package com.fitnessapp.config

import com.typesafe.config.ConfigFactory
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.config.HoconApplicationConfig
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.slf4j.LoggerFactory
import java.sql.Connection
import javax.sql.DataSource

/**
 * Advanced database configuration for the Fitness App backend.
 * Handles connection pooling, migrations, and environment-specific configurations.
 */
class DatabaseConfig(private val configPath: String = "database") {
    private val logger = LoggerFactory.getLogger(this::class.java)
    private val appConfig = HoconApplicationConfig(ConfigFactory.load())
    private lateinit var dataSource: HikariDataSource

    companion object {
        private var initialized = false
        
        // Constants for database column sizing
        const val NAME_LENGTH = 100
        const val EMAIL_LENGTH = 255
        const val DESCRIPTION_LENGTH = 500
        const val URL_LENGTH = 2048
        
        // Transaction isolation levels
        val DEFAULT_ISOLATION_LEVEL = Connection.TRANSACTION_REPEATABLE_READ
    }

    /**
     * Initializes the database connection and runs migrations.
     * Ensures initialization happens only once.
     */
    fun init() {
        if (initialized) {
            logger.info("Database already initialized, skipping...")
            return
        }
        
        try {
            initConnectionPool()
            runMigrations()
            connectToDatabase()
            initialized = true
            logger.info("Database successfully initialized")
        } catch (e: Exception) {
            logger.error("Failed to initialize database", e)
            throw DatabaseInitializationException("Could not initialize database connection", e)
        }
    }

    /**
     * Configures and initializes the database connection pool using HikariCP.
     */
    private fun initConnectionPool() {
        logger.info("Initializing connection pool...")
        
        val dbConfig = appConfig.config(configPath)
        val hikariConfig = HikariConfig().apply {
            driverClassName = dbConfig.property("driver").getString()
            jdbcUrl = dbConfig.property("jdbcUrl").getString()
            username = dbConfig.property("username").getString()
            password = dbConfig.property("password").getString()
            maximumPoolSize = dbConfig.property("poolSize").getString().toInt()
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            validate()
            
            // Advanced performance tuning
            addDataSourceProperty("cachePrepStmts", "true")
            addDataSourceProperty("prepStmtCacheSize", "250")
            addDataSourceProperty("prepStmtCacheSqlLimit", "2048")
            addDataSourceProperty("useServerPrepStmts", "true")
            
            // Connection testing
            addDataSourceProperty("connectionTestQuery", "SELECT 1")
            addDataSourceProperty("connectionTimeout", "30000")
            addDataSourceProperty("idleTimeout", "600000")
            addDataSourceProperty("maxLifetime", "1800000")
        }
        
        dataSource = HikariDataSource(hikariConfig)
        logger.info("Connection pool initialized with max ${hikariConfig.maximumPoolSize} connections")
    }

    /**
     * Runs database migrations using Flyway
     */
    private fun runMigrations() {
        logger.info("Running database migrations...")
        val flyway = Flyway.configure()
            .dataSource(dataSource)
            .locations("db/migration")
            .baselineOnMigrate(true)
            .load()
        
        val migrationResult = flyway.migrate()
        logger.info("Applied ${migrationResult.migrationsExecuted} migrations")
    }

    /**
     * Connects to the database using Exposed
     */
    private fun connectToDatabase() {
        Database.connect(dataSource)
        TransactionManager.manager.defaultIsolationLevel = DEFAULT_ISOLATION_LEVEL
        logger.info("Connected to database with Exposed ORM")
    }

    /**
     * Returns the configured data source
     */
    fun getDataSource(): DataSource = dataSource

    /**
     * Closes the connection pool when the application shuts down
     */
    fun shutdown() {
        if (::dataSource.isInitialized && !dataSource.isClosed) {
            logger.info("Shutting down database connection pool")
            dataSource.close()
        }
    }
    
    /**
     * Custom exception for database initialization failures
     */
    class DatabaseInitializationException(message: String, cause: Throwable?) : 
        RuntimeException(message, cause)
}