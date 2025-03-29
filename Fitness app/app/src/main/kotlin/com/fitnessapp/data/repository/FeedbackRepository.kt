package com.fitnessapp.data.repository

import com.fitnessapp.data.local.dao.ExerciseFeedbackDao
import com.fitnessapp.model.ExerciseFeedback
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository class that handles operations related to exercise feedback.
 */
@Singleton
class FeedbackRepository @Inject constructor(
    private val exerciseFeedbackDao: ExerciseFeedbackDao
) {
    /**
     * Insert new feedback for an exercise.
     */
    suspend fun insertFeedback(feedback: ExerciseFeedback): Long {
        return exerciseFeedbackDao.insertFeedback(feedback)
    }

    /**
     * Get all feedback for a specific exercise.
     */
    fun getFeedbackForExercise(exerciseId: Long): Flow<List<ExerciseFeedback>> {
        return exerciseFeedbackDao.getFeedbackForExercise(exerciseId)
    }

    /**
     * Get all feedback submitted by a specific user.
     */
    fun getFeedbackByUser(userId: Long): Flow<List<ExerciseFeedback>> {
        return exerciseFeedbackDao.getFeedbackByUser(userId)
    }

    /**
     * Update existing feedback.
     */
    suspend fun updateFeedback(feedback: ExerciseFeedback) {
        exerciseFeedbackDao.updateFeedback(feedback)
    }

    /**
     * Delete feedback entry.
     */
    suspend fun deleteFeedback(feedback: ExerciseFeedback) {
        exerciseFeedbackDao.deleteFeedback(feedback)
    }
    
    /**
     * Get average rating for an exercise.
     */
    fun getAverageRatingForExercise(exerciseId: Long): Flow<Float> {
        return exerciseFeedbackDao.getAverageRatingForExercise(exerciseId)
    }
}
