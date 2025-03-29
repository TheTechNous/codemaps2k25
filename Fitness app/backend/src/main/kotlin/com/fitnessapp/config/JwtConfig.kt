package com.fitnessapp.config

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.typesafe.config.ConfigFactory
import io.ktor.server.auth.jwt.*
import io.ktor.server.config.*
import org.slf4j.LoggerFactory
import java.util.*
import java.util.concurrent.TimeUnit

/**
 * Advanced JWT configuration for handling authentication in the Fitness App.
 * Provides token generation, validation, and credential verification.
 */
class JwtConfig(private val configPath: String = "jwt") {
    private val logger = LoggerFactory.getLogger(this::class.java)
    private val appConfig = HoconApplicationConfig(ConfigFactory.load())
    private val jwtConfig = appConfig.config(configPath)
    
    // JWT Configuration properties
    private val issuer = jwtConfig.property("issuer").getString()
    private val audience = jwtConfig.property("audience").getString() 
    private val realm = jwtConfig.property("realm").getString()
    private val secret = jwtConfig.property("secret").getString()
    private val expirationInMs = jwtConfig.property("expirationInMs").getString().toLong()
    private val domain = jwtConfig.property("domain").getString()
    
    // JWT Algorithm using HMAC256
    private val algorithm = Algorithm.HMAC256(secret)
    
    // JWT Token verifier
    val verifier: JWTVerifier = JWT
        .require(algorithm)
        .withIssuer(issuer)
        .withAudience(audience)
        .build()

    /**
     * Configures JWT authentication for Ktor.
     * @return JWTAuthenticationProvider.Configuration for Ktor setup
     */
    fun configureKtorAuth(): JWTAuthenticationProvider.Configuration.() -> Unit = {
        realm = this@JwtConfig.realm
        verifier(verifier)
        validate { credential ->
            try {
                if (validateCredential(credential)) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            } catch (e: Exception) {
                logger.error("JWT validation failed", e)
                null
            }
        }
        challenge { _, _ ->
            throw SecurityException("Token is invalid or has expired")
        }
    }
    
    /**
     * Validates JWT credentials
     * @param credential The JWT credential to validate
     * @return Boolean indicating whether the credential is valid
     */
    private fun validateCredential(credential: JWTCredential): Boolean {
        val containsAudience = credential.payload.audience.contains(audience)
        val notExpired = !credential.payload.isExpired
        val userIdClaim = credential.payload.getClaim("userId")
        val hasUserId = !userIdClaim.isNull && !userIdClaim.asString().isNullOrEmpty()
        
        if (!containsAudience) {
            logger.warn("JWT validation failed: incorrect audience")
        }
        if (!notExpired) {
            logger.warn("JWT validation failed: token expired")
        }
        if (!hasUserId) {
            logger.warn("JWT validation failed: missing userId claim")
        }
        
        return containsAudience && notExpired && hasUserId
    }
    
    /**
     * Generates a JWT token for a user
     * @param userId The user's unique identifier
     * @param email The user's email address
     * @param roles List of roles assigned to the user
     * @return String containing the generated JWT token
     */
    fun generateToken(userId: String, email: String, roles: List<String> = emptyList()): String {
        return JWT.create()
            .withIssuer(issuer)
            .withAudience(audience)
            .withClaim("userId", userId)
            .withClaim("email", email)
            .withArrayClaim("roles", roles.toTypedArray())
            .withExpiresAt(Date(System.currentTimeMillis() + expirationInMs))
            .withIssuedAt(Date())
            .withJWTId(UUID.randomUUID().toString())
            .sign(algorithm)
    }
    
    /**
     * Generates a refresh token with extended expiration
     * @param userId The user's unique identifier
     * @return String containing the generated refresh token
     */
    fun generateRefreshToken(userId: String): String {
        val refreshExpirationInMs = TimeUnit.DAYS.toMillis(30) // 30 days
        
        return JWT.create()
            .withIssuer(issuer)
            .withAudience("refresh")
            .withClaim("userId", userId)
            .withClaim("type", "refresh")
            .withExpiresAt(Date(System.currentTimeMillis() + refreshExpirationInMs))
            .withIssuedAt(Date())
            .withJWTId(UUID.randomUUID().toString())
            .sign(algorithm)
    }
    
    /**
     * Extracts user ID from JWT token
     * @param token JWT token as string
     * @return User ID extracted from the token
     */
    fun extractUserId(token: String): String {
        val decodedJWT = verifier.verify(token)
        return decodedJWT.getClaim("userId").asString()
    }
    
    /**
     * Checks if a token is a refresh token
     * @param token JWT token as string
     * @return Boolean indicating whether it's a refresh token
     */
    fun isRefreshToken(token: String): Boolean {
        val decodedJWT = verifier.verify(token)
        val type = decodedJWT.getClaim("type").asString()
        return type == "refresh"
    }
    
    /**
     * Gets the configured domain for cookies
     * @return Domain string for cookie settings
     */
    fun getCookieDomain(): String = domain
    
    /**
     * Gets the token expiration time in milliseconds
     * @return Expiration time in milliseconds
     */
    fun getExpirationTime(): Long = expirationInMs
}