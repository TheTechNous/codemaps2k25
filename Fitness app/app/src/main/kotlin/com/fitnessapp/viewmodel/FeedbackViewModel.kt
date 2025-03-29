package com.fitnessapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fitnessapp.data.repository.FeedbackRepository
import com.fitnessapp.model.ExerciseFeedback
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject

/**
 * ViewModel to handle exercise feedback UI logic.
 */
@HiltViewModel
class FeedbackViewModel @Inject constructor(
    private val feedbackRepository: FeedbackRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<FeedbackUiState>(FeedbackUiState.Initial)
    val uiState: StateFlow<FeedbackUiState> = _uiState.asStateFlow()
    
    fun submitFeedback(
        exerciseId: Long,
        userId: Long,
        rating: Int,
        difficultyLevel: Int,
        comments: String?,
        performanceSatisfaction: Int,
        energyLevel: Int,
        completionPercentage: Float
    ) {
        viewModelScope.launch {
            try {
                _uiState.value = FeedbackUiState.Loading
                val feedback = ExerciseFeedback(
                    exerciseId = exerciseId,
                    userId = userId,
                    sessionDate = Date(),
                    rating = rating,
                    difficultyLevel = difficultyLevel,
                    comments = comments,
                    performanceSatisfaction = performanceSatisfaction,
                    energyLevel = energyLevel,
                    completionPercentage = completionPercentage
                )
                
                val id = feedbackRepository.insertFeedback(feedback)
                _uiState.value = FeedbackUiState.Success(id)
            } catch (e: Exception) {
                _uiState.value = FeedbackUiState.Error(e.message ?: "Unknown error occurred")
            }
        }
    }
    
    fun getFeedbackForExercise(exerciseId: Long) {
        viewModelScope.launch {
            try {
                _uiState.value = FeedbackUiState.Loading
                feedbackRepository.getFeedbackForExercise(exerciseId)
                    .collect { feedbackList ->
                        _uiState.value = FeedbackUiState.FeedbackList(feedbackList)
                    }
            } catch (e: Exception) {
                _uiState.value = FeedbackUiState.Error(e.message ?: "Unknown error occurred")
            }
        }
    }
    
    fun getAverageRating(exerciseId: Long) {
        viewModelScope.launch {
            feedbackRepository.getAverageRatingForExercise(exerciseId)
                .collect { avgRating ->
                    _uiState.value = FeedbackUiState.AverageRating(avgRating)
                }
        }
    }
}

sealed class FeedbackUiState {
    object Initial : FeedbackUiState()
    object Loading : FeedbackUiState()
    data class Success(val feedbackId: Long) : FeedbackUiState()
    data class FeedbackList(val feedback: List<ExerciseFeedback>) : FeedbackUiState()
    data class AverageRating(val rating: Float) : FeedbackUiState()
    data class Error(val message: String) : FeedbackUiState()
}
