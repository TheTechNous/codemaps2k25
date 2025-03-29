package com.fitnessapp.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

/**
 * Data class representing feedback for an exercise session.
 * This includes rating, comments, and performance metrics.
 */
@Entity(tableName = "exercise_feedback")
data class ExerciseFeedback(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val exerciseId: Long,
    val userId: Long,
    val sessionDate: Date,
    val rating: Int, // User rating on a scale (e.g., 1-5)
    val difficultyLevel: Int, // Perceived difficulty level
    val comments: String?,
    val performanceSatisfaction: Int, // How satisfied the user was with their performance
    val energyLevel: Int, // User's energy level during exercise
    val completionPercentage: Float, // What percentage of the planned exercise was completed
    val timestamp: Date = Date()
)
