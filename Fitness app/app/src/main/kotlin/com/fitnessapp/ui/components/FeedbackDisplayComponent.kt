package com.fitnessapp.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.fitnessapp.model.ExerciseFeedback
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun FeedbackList(feedbackList: List<ExerciseFeedback>, modifier: Modifier = Modifier) {
    LazyColumn(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(feedbackList) { feedback ->
            FeedbackCard(feedback = feedback)
        }
    }
}

@Composable
fun FeedbackCard(feedback: ExerciseFeedback, modifier: Modifier = Modifier) {
    val dateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
    
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Rating: ${feedback.rating}/5",
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = dateFormat.format(feedback.sessionDate),
                    style = MaterialTheme.typography.bodySmall
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically) {
                RatingBar(rating = feedback.rating)
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "Difficulty: ${feedback.difficultyLevel}/5",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Text(
                text = "Completion: ${feedback.completionPercentage.toInt()}%",
                style = MaterialTheme.typography.bodyMedium
            )
            
            if (!feedback.comments.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Comments:",
                    style = MaterialTheme.typography.labelMedium
                )
                Text(
                    text = feedback.comments,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }
}

@Composable
fun RatingBar(rating: Int, maxRating: Int = 5) {
    Row {
        repeat(maxRating) { index ->
            Icon(
                imageVector = if (index < rating) Icons.Default.Star else Icons.Default.StarBorder,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
fun AverageRatingDisplay(rating: Float, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "Average Rating: ",
            style = MaterialTheme.typography.bodyMedium
        )
        Text(
            text = String.format("%.1f", rating),
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.width(4.dp))
        RatingBar(rating = rating.toInt())
    }
}
