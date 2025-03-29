package com.fitnessapp

import com.fitnessapp.config.DatabaseConfig
import com.fitnessapp.config.JwtConfig
import com.fitnessapp.routes.FoodRoutes
import com.fitnessapp.routes.UserRoutes
import com.fitnessapp.routes.WorkoutRoutes
import io.ktor.http.*
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.callloging.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.slf4j.LoggerFactory
import org.slf4j.event.Level
import java.util.concurrent.TimeUnit

fun main() {
    // Initialize the embedded server with Netty engine
    embeddedServer(
        Netty,
        port = System.getenv("PORT")?.toInt() ?: 8080,
        host = "0.0.0.0",
        module = Application::module
    ).start(wait = true)
}

/**
 * Main application module setup for Ktor
 */
fun Application.module() {
    val logger = LoggerFactory.getLogger(this::class.java)
    
    // Initialize the database connection
    val databaseConfig = DatabaseConfig()
    databaseConfig.init()
    
    // Register shutdown hook to close database connections
    Runtime.getRuntime().addShutdownHook(Thread {
        logger.info("Application shutdown: closing database connections")
        databaseConfig.shutdown()
    })
    
    // Initialize JWT configuration
    val jwtConfig = JwtConfig()
    
    // Configure Ktor features
    configureSecurity(jwtConfig)
    configureMonitoring()
    configureSerialization()
    configureHTTP()
    configureRouting(jwtConfig)
    
    logger.info("Fitness App backend started successfully")
}

/**
 * Configure security features including JWT authentication
 */
fun Application.configureSecurity(jwtConfig: JwtConfig) {
    install(Authentication) {
        jwt("auth-jwt") {
            jwtConfig.configureKtorAuth()(this)
        }
    }
}

/**
 * Configure HTTP related features like CORS and default headers
 */
fun Application.configureHTTP() {
    install(DefaultHeaders) {
        header("X-Engine", "Ktor")
        header("X-Environment", environment.config.property("environment").getString())
    }
    
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        allowHeader("X-Requested-With")
        anyHost() // For development, restrict in production
        allowCredentials = true
        maxAgeInSeconds = TimeUnit.DAYS.toSeconds(1)
    }
    
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            when (cause) {
                is SecurityException -> call.respond(HttpStatusCode.Unauthorized, mapOf("error" to (cause.message ?: "Unauthorized")))
                is IllegalArgumentException -> call.respond(HttpStatusCode.BadRequest, mapOf("error" to (cause.message ?: "Bad Request")))
                else -> {
                    log.error("Unhandled exception", cause)
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Internal Server Error"))
                }
            }
        }
    }
}

/**
 * Configure content negotiation for JSON serialization
 */
fun Application.configureSerialization() {
    install(ContentNegotiation) {
        jackson {
            // Configure Jackson serialization options here
        }
    }
}

/**
 * Configure application monitoring and logging
 */
fun Application.configureMonitoring() {
    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/") }
        format { call ->
            val status = call.response.status()
            val httpMethod = call.request.httpMethod.value
            val path = call.request.path()
            val userAgent = call.request.headers["User-Agent"]
            "Status: $status, HTTP method: $httpMethod, Path: $path, User agent: $userAgent"
        }
    }
}

/**
 * Configure application routing with routes for different endpoints
 */
fun Application.configureRouting(jwtConfig: JwtConfig) {
    routing {
        route("/api") {
            route("/v1") {
                // Public routes
                get("/health") {
                    call.respond(HttpStatusCode.OK, mapOf("status" to "UP"))
                }
                
                // Routes grouped by domain
                UserRoutes.registerRoutes(this, jwtConfig)
                
                // Protected routes
                authenticate("auth-jwt") {
                    FoodRoutes.registerRoutes(this)
                    WorkoutRoutes.registerRoutes(this)
                }
            }
        }
    }
}