package com.fitnessapp.data.local.dao

import androidx.room.*
import com.fitnessapp.model.ExerciseFeedback
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object for exercise feedback operations.
 */
@Dao
interface ExerciseFeedbackDao {
    
    @Insert
    suspend fun insertFeedback(feedback: ExerciseFeedback): Long
    
    @Update
    suspend fun updateFeedback(feedback: ExerciseFeedback)
    
    @Delete
    suspend fun deleteFeedback(feedback: ExerciseFeedback)
    
    @Query("SELECT * FROM exercise_feedback WHERE exerciseId = :exerciseId ORDER BY timestamp DESC")
    fun getFeedbackForExercise(exerciseId: Long): Flow<List<ExerciseFeedback>>
    
    @Query("SELECT * FROM exercise_feedback WHERE userId = :userId ORDER BY timestamp DESC")
    fun getFeedbackByUser(userId: Long): Flow<List<ExerciseFeedback>>
    
    @Query("SELECT AVG(rating) FROM exercise_feedback WHERE exerciseId = :exerciseId")
    fun getAverageRatingForExercise(exerciseId: Long): Flow<Float>
    
    @Query("SELECT * FROM exercise_feedback ORDER BY timestamp DESC LIMIT 100")
    fun getRecentFeedback(): Flow<List<ExerciseFeedback>>
    
    @Query("SELECT * FROM exercise_feedback WHERE id = :feedbackId")
    suspend fun getFeedbackById(feedbackId: Long): ExerciseFeedback?
}
