package com.fitnessapp.model

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import com.fitnessapp.config.DatabaseConfig.Companion.EMAIL_LENGTH
import com.fitnessapp.config.DatabaseConfig.Companion.NAME_LENGTH
import com.fitnessapp.config.DatabaseConfig.Companion.URL_LENGTH
import java.time.LocalDateTime
import java.util.UUID

/**
 * Database table definition for users
 */
object Users : UUIDTable(name = "users") {
    val email: Column<String> = varchar("email", EMAIL_LENGTH).uniqueIndex()
    val passwordHash: Column<String> = varchar("password_hash", 255)
    val firstName: Column<String> = varchar("first_name", NAME_LENGTH)
    val lastName: Column<String> = varchar("last_name", NAME_LENGTH)
    val profilePictureUrl: Column<String?> = varchar("profile_picture_url", URL_LENGTH).nullable()
    val isActive: Column<Boolean> = bool("is_active").default(true)
    val role: Column<String> = varchar("role", 20).default("USER")
    val createdAt: Column<LocalDateTime> = datetime("created_at").default(LocalDateTime.now())
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").default(LocalDateTime.now())
    val lastLogin: Column<LocalDateTime?> = datetime("last_login").nullable()
}

/**
 * User data class for serialization and business logic
 */
data class User(
    val id: UUID,
    val email: String,
    val firstName: String,
    val lastName: String,
    val profilePictureUrl: String? = null,
    val isActive: Boolean = true,
    val role: String = "USER",
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val lastLogin: LocalDateTime? = null
) {
    /**
     * Returns a safe version of the user without sensitive information for public APIs
     */
    fun toPublicUser(): PublicUser = PublicUser(
        id = id,
        email = email,
        firstName = firstName,
        lastName = lastName, 
        profilePictureUrl = profilePictureUrl,
        isActive = isActive
    )
    
    companion object {
        /**
         * Roles available in the system
         */
        object Roles {
            const val USER = "USER"
            const val ADMIN = "ADMIN"
            const val TRAINER = "TRAINER"
        }
    }
}

/**
 * Public-safe version of User for API responses
 */
data class PublicUser(
    val id: UUID,
    val email: String,
    val firstName: String,
    val lastName: String,
    val profilePictureUrl: String? = null,
    val isActive: Boolean = true
)

/**
 * User credentials for authentication
 */
data class UserCredentials(
    val email: String,
    val password: String
)

/**
 * User registration data
 */
data class UserRegistration(
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String,
    val profilePictureUrl: String? = null
)

/**
 * Authentication response with tokens
 */
data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: PublicUser,
    val expiresIn: Long
)