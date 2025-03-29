package com.fitnessapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.fitnessapp.model.ExerciseFeedback
import com.fitnessapp.viewmodel.FeedbackUiState
import com.fitnessapp.viewmodel.FeedbackViewModel

@Composable
fun FeedbackScreen(
    exerciseId: Long,
    userId: Long,
    viewModel: FeedbackViewModel = hiltViewModel(),
    onFeedbackSubmitted: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    
    var rating by remember { mutableStateOf(3) }
    var difficultyLevel by remember { mutableStateOf(3) }
    var comments by remember { mutableStateOf("") }
    var performanceSatisfaction by remember { mutableStateOf(3) }
    var energyLevel by remember { mutableStateOf(3) }
    var completionPercentage by remember { mutableStateOf(100f) }
    
    LaunchedEffect(uiState) {
        if (uiState is FeedbackUiState.Success) {
            onFeedbackSubmitted()
        }
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Exercise Feedback",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )
        
        Text(text = "How would you rate this exercise?")
        Slider(
            value = rating.toFloat(),
            onValueChange = { rating = it.toInt() },
            valueRange = 1f..5f,
            steps = 3,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = "Poor")
            Text(text = "Excellent")
        }
        
        Text(text = "Difficulty Level: ${difficultyLevel}")
        Slider(
            value = difficultyLevel.toFloat(),
            onValueChange = { difficultyLevel = it.toInt() },
            valueRange = 1f..5f,
            steps = 3,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        
        OutlinedTextField(
            value = comments,
            onValueChange = { comments = it },
            label = { Text("Comments") },
            modifier = Modifier.fillMaxWidth()
        )
        
        Text(text = "Performance Satisfaction: ${performanceSatisfaction}")
        Slider(
            value = performanceSatisfaction.toFloat(),
            onValueChange = { performanceSatisfaction = it.toInt() },
            valueRange = 1f..5f,
            steps = 3
        )
        
        Text(text = "Energy Level: ${energyLevel}")
        Slider(
            value = energyLevel.toFloat(),
            onValueChange = { energyLevel = it.toInt() },
            valueRange = 1f..5f,
            steps = 3
        )
        
        Text(text = "Completion Percentage: ${completionPercentage.toInt()}%")
        Slider(
            value = completionPercentage,
            onValueChange = { completionPercentage = it },
            valueRange = 0f..100f
        )
        
        Button(
            onClick = {
                viewModel.submitFeedback(
                    exerciseId = exerciseId,
                    userId = userId,
                    rating = rating,
                    difficultyLevel = difficultyLevel,
                    comments = comments.takeIf { it.isNotBlank() },
                    performanceSatisfaction = performanceSatisfaction,
                    energyLevel = energyLevel,
                    completionPercentage = completionPercentage
                )
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = uiState !is FeedbackUiState.Loading
        ) {
            Text("Submit Feedback")
        }
        
        when (uiState) {
            is FeedbackUiState.Loading -> {
                CircularProgressIndicator()
            }
            is FeedbackUiState.Error -> {
                Text(
                    text = (uiState as FeedbackUiState.Error).message,
                    color = MaterialTheme.colorScheme.error
                )
            }
            else -> { /* Do nothing for other states */ }
        }
    }
}
