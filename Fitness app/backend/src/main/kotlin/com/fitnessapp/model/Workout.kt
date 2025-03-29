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
 * Database table definition for workout plans
 */
object WorkoutPlans : UUIDTable(name = "workout_plans") {
    val name: Column<String> = varchar("name", NAME_LENGTH)
    val description: Column<String?> = varchar("description", DESCRIPTION_LENGTH).nullable()
    val createdBy: Column<UUID> = reference("created_by", Users.id, onDelete = ReferenceOption.CASCADE)
    val isPublic: Column<Boolean> = bool("is_public").default(false)
    val difficulty: Column<String> = varchar("difficulty", 20)
    val estimatedDuration: Column<Int?> = integer("estimated_duration").nullable()
    val targetMuscleGroups: Column<String> = varchar("target_muscle_groups", 255)
    val imageUrl: Column<String?> = varchar("image_url", URL_LENGTH).nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").default(LocalDateTime.now())
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").default(LocalDateTime.now())
}

/**
 * Database table definition for exercises
 */
object Exercises : UUIDTable(name = "exercises") {
    val name: Column<String> = varchar("name", NAME_LENGTH)
    val description: Column<String?> = varchar("description", DESCRIPTION_LENGTH).nullable()
    val muscleGroup: Column<String> = varchar("muscle_group", 50)
    val secondaryMuscleGroups: Column<String?> = varchar("secondary_muscle_groups", 255).nullable()
    val equipment: Column<String?> = varchar("equipment", 100).nullable()
    val difficulty: Column<String> = varchar("difficulty", 20)
    val instructions: Column<String> = text("instructions")
    val videoUrl: Column<String?> = varchar("video_url", URL_LENGTH).nullable()
    val imageUrl: Column<String?> = varchar("image_url", URL_LENGTH).nullable()
    val isVerified: Column<Boolean> = bool("is_verified").default(false)
    val createdBy: Column<UUID?> = reference("created_by", Users.id, onDelete = ReferenceOption.SET_NULL).nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").default(LocalDateTime.now())
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").default(LocalDateTime.now())
    
    init {
        // Index for searching exercises by muscle group
        index(isUnique = false, muscleGroup, difficulty)
    }
}

/**
 * Junction table connecting workout plans and exercises
 */
object WorkoutExercises : Table(name = "workout_exercises") {
    val workoutPlanId: Column<UUID> = reference("workout_plan_id", WorkoutPlans.id, onDelete = ReferenceOption.CASCADE)
    val exerciseId: Column<UUID> = reference("exercise_id", Exercises.id, onDelete = ReferenceOption.CASCADE)
    val orderIndex: Column<Int> = integer("order_index")
    val sets: Column<Int> = integer("sets")
    val repsMin: Column<Int> = integer("reps_min")
    val repsMax: Column<Int?> = integer("reps_max").nullable()
    val restSeconds: Column<Int?> = integer("rest_seconds").nullable()
    val notes: Column<String?> = varchar("notes", DESCRIPTION_LENGTH).nullable()
    
    override val primaryKey = PrimaryKey(workoutPlanId, exerciseId, name = "pk_workout_exercises")
    
    init {
        // Index for fetching exercises in correct order for a workout
        index(isUnique = false, workoutPlanId, orderIndex)
    }
}

/**
 * Database table definition for workout logs (completed workout sessions)
 */
object WorkoutLogs : UUIDTable(name = "workout_logs") {
    val userId: Column<UUID> = reference("user_id", Users.id, onDelete = ReferenceOption.CASCADE)
    val workoutPlanId: Column<UUID?> = reference("workout_plan_id", WorkoutPlans.id, onDelete = ReferenceOption.SET_NULL).nullable()
    val name: Column<String> = varchar("name", NAME_LENGTH)
    val startedAt: Column<LocalDateTime> = datetime("started_at")
    val finishedAt: Column<LocalDateTime?> = datetime("finished_at").nullable()
    val duration: Column<Int?> = integer("duration_seconds").nullable()
    val notes: Column<String?> = varchar("notes", DESCRIPTION_LENGTH).nullable()
    val rating: Column<Int?> = integer("rating").nullable()
    val caloriesBurned: Column<Int?> = integer("calories_burned").nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").default(LocalDateTime.now())
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").default(LocalDateTime.now())
    
    init {
        // Index for fetching user workout history
        index(isUnique = false, userId, startedAt)
    }
}

/**
 * Database table definition for exercise logs (individual exercise performance in a workout)
 */
object ExerciseLogs : UUIDTable(name = "exercise_logs") {
    val workoutLogId: Column<UUID> = reference("workout_log_id", WorkoutLogs.id, onDelete = ReferenceOption.CASCADE)
    val exerciseId: Column<UUID?> = reference("exercise_id", Exercises.id, onDelete = ReferenceOption.SET_NULL).nullable()
    val exerciseName: Column<String> = varchar("exercise_name", NAME_LENGTH)
    val orderIndex: Column<Int> = integer("order_index")
    val createdAt: Column<LocalDateTime> = datetime("created_at").default(LocalDateTime.now())
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").default(LocalDateTime.now())
}

/**
 * Database table definition for individual sets within an exercise log
 */
object ExerciseSets : UUIDTable(name = "exercise_sets") {
    val exerciseLogId: Column<UUID> = reference("exercise_log_id", ExerciseLogs.id, onDelete = ReferenceOption.CASCADE)
    val setNumber: Column<Int> = integer("set_number")
    val weight: Column<Double?> = double("weight").nullable()
    val reps: Column<Int?> = integer("reps").nullable()
    val timeSeconds: Column<Int?> = integer("time_seconds").nullable()
    val distance: Column<Double?> = double("distance").nullable()
    val distanceUnit: Column<String?> = varchar("distance_unit", 10).nullable()
    val notes: Column<String?> = varchar("notes", DESCRIPTION_LENGTH).nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").default(LocalDateTime.now())
    
    init {
        // Index for getting sets in correct order
        index(isUnique = false, exerciseLogId, setNumber)
    }
}

/**
 * Workout plan data class
 */
data class WorkoutPlan(
    val id: UUID,
    val name: String,
    val description: String? = null,
    val createdBy: UUID,
    val isPublic: Boolean = false,
    val difficulty: WorkoutDifficulty,
    val estimatedDuration: Int? = null,
    val targetMuscleGroups: List<String>,
    val imageUrl: String? = null,
    val exercises: List<WorkoutExercise> = emptyList(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    fun getTargetMuscleGroupsString(): String = targetMuscleGroups.joinToString(",")
    
    companion object {
        fun fromTargetMuscleGroupsString(groupsString: String): List<String> =
            groupsString.split(",").map { it.trim() }.filter { it.isNotEmpty() }
    }
}

/**
 * Exercise data class
 */
data class Exercise(
    val id: UUID,
    val name: String,
    val description: String? = null,
    val muscleGroup: MuscleGroup,
    val secondaryMuscleGroups: List<MuscleGroup> = emptyList(),
    val equipment: String? = null,
    val difficulty: WorkoutDifficulty,
    val instructions: String,
    val videoUrl: String? = null,
    val imageUrl: String? = null,
    val isVerified: Boolean = false,
    val createdBy: UUID? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    fun getSecondaryMuscleGroupsString(): String = 
        secondaryMuscleGroups.joinToString(",") { it.name }
    
    companion object {
        fun fromSecondaryMuscleGroupsString(groupsString: String?): List<MuscleGroup> =
            groupsString?.split(",")
                ?.map { it.trim() }
                ?.filter { it.isNotEmpty() }
                ?.map { MuscleGroup.fromString(it) }
                ?: emptyList()
    }
}

/**
 * Workout exercise junction data class
 */
data class WorkoutExercise(
    val exercise: Exercise,
    val orderIndex: Int,
    val sets: Int,
    val repsMin: Int,
    val repsMax: Int? = null,
    val restSeconds: Int? = null,
    val notes: String? = null
)

/**
 * Workout log data class (completed workout)
 */
data class WorkoutLog(
    val id: UUID,
    val userId: UUID,
    val workoutPlanId: UUID? = null,
    val name: String,
    val startedAt: LocalDateTime,
    val finishedAt: LocalDateTime? = null,
    val duration: Int? = null,
    val notes: String? = null,
    val rating: Int? = null,
    val caloriesBurned: Int? = null,
    val exerciseLogs: List<ExerciseLog> = emptyList(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

/**
 * Exercise log data class (completed exercise)
 */
data class ExerciseLog(
    val id: UUID,
    val workoutLogId: UUID,
    val exerciseId: UUID? = null,
    val exerciseName: String,
    val orderIndex: Int,
    val sets: List<ExerciseSet> = emptyList(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

/**
 * Exercise set data class (individual set performance)
 */
data class ExerciseSet(
    val id: UUID,
    val exerciseLogId: UUID,
    val setNumber: Int,
    val weight: Double? = null,
    val reps: Int? = null,
    val timeSeconds: Int? = null,
    val distance: Double? = null,
    val distanceUnit: String? = null,
    val notes: String? = null,
    val createdAt: LocalDateTime
)

/**
 * Muscle group enum
 */
enum class MuscleGroup {
    CHEST,
    BACK,
    SHOULDERS,
    BICEPS,
    TRICEPS,
    FOREARMS,
    QUADRICEPS,
    HAMSTRINGS,
    CALVES,
    GLUTES,
    ABS,
    TRAPEZIUS,
    NECK,
    LOWER_BACK,
    CARDIO,
    FULL_BODY;
    
    companion object {
        fun fromString(value: String): MuscleGroup =
            values().find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("Invalid muscle group: $value")
    }
}

/**
 * Workout difficulty enum
 */
enum class WorkoutDifficulty {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED,
    EXPERT;
    
    companion object {
        fun fromString(value: String): WorkoutDifficulty =
            values().find { it.name.equals(value, ignoreCase = true) }
                ?: throw IllegalArgumentException("Invalid difficulty level: $value")
    }
}

/**
 * Workout search criteria
 */
data class WorkoutSearchCriteria(
    val query: String? = null,
    val muscleGroup: MuscleGroup? = null,
    val difficulty: WorkoutDifficulty? = null,
    val createdBy: UUID? = null,
    val publicOnly: Boolean = true,
    val limit: Int = 20,
    val offset: Int = 0
)