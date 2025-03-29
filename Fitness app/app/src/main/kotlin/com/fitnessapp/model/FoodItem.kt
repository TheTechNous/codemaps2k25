package com.fitnessapp.model

/**
 * Data class representing a food item in the food tracking system
 */
data class FoodItem(
    val id: String,
    val name: String,
    val calories: Int,
    val protein: Float,
    val carbs: Float,
    val fat: Float,
    val imageRes: Int,
    val servingSize: String,
    val time: String,
    val mealType: MealType = MealType.SNACK
)
