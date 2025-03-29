package com.fitnessapp.model

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import com.fitnessapp.config.DatabaseConfig.Companion.NAME_LENGTH
import com.fitnessapp.config.DatabaseConfig.Companion.DESCRIPTION_LENGTH
import com.fitnessapp.config.DatabaseConfig.Companion.URL_LENGTH
import java.time.LocalDateTime
import java.util.UUID

/**
 * Database table definition for food items
 */
object Foods : UUIDTable(name = "foods") {
    val name: Column<String> = varchar("name", NAME_LENGTH)
    val description: Column<String?> = varchar("description", DESCRIPTION_LENGTH).nullable()
    val imageUrl: Column<String?> = varchar("image_url", URL_LENGTH).nullable()
    val calories: Column<Int> = integer("calories")
    val protein: Column<Double> = double("protein")
    val carbs: Column<Double> = double("carbs")
    val fat: Column<Double> = double("fat")
    val fiber: Column<Double?> = double("fiber").nullable()
    val sugar: Column<Double?> = double("sugar").nullable()
    val servingSize: Column<Double> = double("serving_size")
    val servingUnit: Column<String> = varchar("serving_unit", 20)
    val barcode: Column<String?> = varchar("barcode", 50).nullable()
    val isVerified: Column<Boolean> = bool("is_verified").default(false)
    val createdBy: Column<UUID> = reference("created_by", Users.id, onDelete = ReferenceOption.SET_NULL).nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").default(LocalDateTime.now())
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").default(LocalDateTime.now())
    
    init {
        // Composite index for faster searches by name
        index(isUnique = false, name, calories)
    }
}

/**
 * Database table definition for meal entries (user's food diary)
 */
object MealEntries : UUIDTable(name = "meal_entries") {
    val userId: Column<UUID> = reference("user_id", Users.id, onDelete = ReferenceOption.CASCADE)
    val foodId: Column<UUID> = reference("food_id", Foods.id, onDelete = ReferenceOption.CASCADE)
    val mealType: Column<String> = varchar("meal_type", 20)
    val servingQty: Column<Double> = double("serving_qty")
    val eatenAt: Column<LocalDateTime> = datetime("eaten_at")
    val notes: Column<String?> = varchar("notes", DESCRIPTION_LENGTH).nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").default(LocalDateTime.now())
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").default(LocalDateTime.now())
    
    init {
        // Index for querying user meals by date
        index(isUnique = false, userId, eatenAt)
    }
}

/**
 * Food data class for serialization and business logic
 */
data class Food(
    val id: UUID,
    val name: String,
    val description: String? = null,
    val imageUrl: String? = null,
    val calories: Int,
    val protein: Double,
    val carbs: Double,
    val fat: Double,
    val fiber: Double? = null,
    val sugar: Double? = null,
    val servingSize: Double,
    val servingUnit: String,
    val barcode: String? = null,
    val isVerified: Boolean = false,
    val createdBy: UUID? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    /**
     * Calculate the macronutrient distribution as percentages
     */
    fun getMacroDistribution(): MacroDistribution {
        val totalCaloriesFromMacros = 
            (protein * 4) + (carbs * 4) + (fat * 9)
        
        return MacroDistribution(
            proteinPercentage = (protein * 4 * 100) / totalCaloriesFromMacros,
            carbsPercentage = (carbs * 4 * 100) / totalCaloriesFromMacros,
            fatPercentage = (fat * 9 * 100) / totalCaloriesFromMacros
        )
    }
    
    /**
     * Calculate nutrition values for a specific serving quantity
     */
    fun calculateForServing(servingQty: Double): NutritionInfo {
        val multiplier = servingQty / servingSize
        
        return NutritionInfo(
            calories = (calories * multiplier).toInt(),
            protein = protein * multiplier,
            carbs = carbs * multiplier,
            fat = fat * multiplier,
            fiber = fiber?.let { it * multiplier },
            sugar = sugar?.let { it * multiplier }
        )
    }
}

/**
 * Meal entry data class representing a food item eaten at a specific time
 */
data class MealEntry(
    val id: UUID,
    val userId: UUID,
    val food: Food,
    val mealType: MealType,
    val servingQty: Double,
    val eatenAt: LocalDateTime,
    val notes: String? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    /**
     * Get nutrition information for this meal entry
     */
    fun getNutritionInfo(): NutritionInfo = food.calculateForServing(servingQty)
}

/**
 * Meal type enum representing different meal categories
 */
enum class MealType {
    BREAKFAST,
    LUNCH,
    DINNER,
    SNACK;
    
    companion object {
        fun fromString(value: String): MealType =
            values().find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("Invalid meal type: $value")
    }
}

/**
 * Nutrition information data class
 */
data class NutritionInfo(
    val calories: Int,
    val protein: Double,
    val carbs: Double,
    val fat: Double,
    val fiber: Double? = null,
    val sugar: Double? = null
)

/**
 * Macronutrient distribution data class (percentages)
 */
data class MacroDistribution(
    val proteinPercentage: Double,
    val carbsPercentage: Double,
    val fatPercentage: Double
)

/**
 * Food search criteria for filtering food items
 */
data class FoodSearchCriteria(
    val query: String? = null,
    val minProtein: Double? = null,
    val maxCalories: Int? = null,
    val barcode: String? = null,
    val verifiedOnly: Boolean = false,
    val orderBy: String = "name",
    val limit: Int = 20,
    val offset: Int = 0
)