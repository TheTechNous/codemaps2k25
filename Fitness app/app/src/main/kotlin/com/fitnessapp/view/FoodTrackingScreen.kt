package com.fitnessapp.view

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.fitnessapp.R
import com.fitnessapp.model.FoodItem
import com.fitnessapp.model.MealType
import com.fitnessapp.model.NutrientType
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import kotlin.math.roundToInt

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FoodTrackingScreen(navController: NavController) {
    var selectedDate by remember { mutableStateOf(LocalDate.now()) }
    var showAddMealDialog by remember { mutableStateOf(false) }
    val selectedMealType = remember { mutableStateOf<MealType?>(null) }
    var showFoodDetailsSheet by remember { mutableStateOf(false) }
    var selectedFood by remember { mutableStateOf<FoodItem?>(null) }
    
    // Mock data for the current daily totals
    val dailyCalories = 1850
    val calorieGoal = 2200
    val caloriePercentage = (dailyCalories.toFloat() / calorieGoal.toFloat())
    
    val proteinGrams = 95
    val proteinGoal = 120
    val proteinPercentage = (proteinGrams.toFloat() / proteinGoal.toFloat())
    
    val carbsGrams = 210
    val carbsGoal = 250
    val carbsPercentage = (carbsGrams.toFloat() / carbsGoal.toFloat())
    
    val fatGrams = 62
    val fatGoal = 73
    val fatPercentage = (fatGrams.toFloat() / fatGoal.toFloat())

    // Demo meal data
    val breakfast = listOf(
        FoodItem(
            id = "1",
            name = "Greek Yogurt with Berries",
            calories = 220,
            protein = 18f,
            carbs = 24f,
            fat = 8f,
            imageRes = R.drawable.food_yogurt,
            servingSize = "1 cup",
            time = "7:30 AM"
        ),
        FoodItem(
            id = "2",
            name = "Whole Grain Toast",
            calories = 80,
            protein = 3f,
            carbs = 15f,
            fat = 1f,
            imageRes = R.drawable.food_toast,
            servingSize = "1 slice",
            time = "7:30 AM"
        )
    )
    
    val lunch = listOf(
        FoodItem(
            id = "3",
            name = "Grilled Chicken Salad",
            calories = 380,
            protein = 32f,
            carbs = 30f,
            fat = 14f,
            imageRes = R.drawable.food_salad,
            servingSize = "1 bowl",
            time = "12:15 PM"
        ),
        FoodItem(
            id = "4",
            name = "Avocado",
            calories = 160,
            protein = 2f,
            carbs = 8f,
            fat = 15f,
            imageRes = R.drawable.food_avocado,
            servingSize = "1/2 fruit",
            time = "12:15 PM"
        )
    )
    
    val dinner = listOf(
        FoodItem(
            id = "5",
            name = "Salmon Fillet",
            calories = 280,
            protein = 32f,
            carbs = 0f,
            fat = 16f,
            imageRes = R.drawable.food_salmon,
            servingSize = "150g",
            time = "7:00 PM"
        ),
        FoodItem(
            id = "6",
            name = "Quinoa",
            calories = 220,
            protein = 8f,
            carbs = 39f,
            fat = 4f,
            imageRes = R.drawable.food_quinoa,
            servingSize = "1 cup",
            time = "7:00 PM"
        ),
        FoodItem(
            id = "7",
            name = "Steamed Broccoli",
            calories = 55,
            protein = 4f,
            carbs = 11f,
            fat = 0.5f,
            imageRes = R.drawable.food_broccoli,
            servingSize = "1 cup",
            time = "7:00 PM"
        )
    )
    
    val snacks = listOf(
        FoodItem(
            id = "8",
            name = "Protein Shake",
            calories = 180,
            protein = 25f,
            carbs = 9f,
            fat = 2f,
            imageRes = R.drawable.food_shake,
            servingSize = "1 serving",
            time = "3:30 PM"
        ),
        FoodItem(
            id = "9",
            name = "Apple",
            calories = 95,
            protein = 0.5f,
            carbs = 25f,
            fat = 0.3f,
            imageRes = R.drawable.food_apple,
            servingSize = "1 medium",
            time = "10:30 AM"
        )
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Nutrition Tracker",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold
                        )
                    )
                },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { navController.navigate("food_search") }) {
                        Icon(Icons.Default.Search, contentDescription = "Search Foods")
                    }
                    IconButton(onClick = { navController.navigate("nutrition_settings") }) {
                        Icon(Icons.Default.Settings, contentDescription = "Nutrition Settings")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddMealDialog = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary,
                shape = CircleShape
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Meal")
            }
        },
        content = { innerPadding ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // Date selection
                item {
                    DateSelector(
                        currentDate = selectedDate,
                        onDateSelected = { selectedDate = it }
                    )
                }
                
                // Nutrition summary card
                item {
                    NutritionSummaryCard(
                        dailyCalories = dailyCalories,
                        calorieGoal = calorieGoal,
                        caloriePercentage = caloriePercentage,
                        proteinGrams = proteinGrams,
                        proteinGoal = proteinGoal,
                        proteinPercentage = proteinPercentage,
                        carbsGrams = carbsGrams,
                        carbsGoal = carbsGoal,
                        carbsPercentage = carbsPercentage,
                        fatGrams = fatGrams,
                        fatGoal = fatGoal,
                        fatPercentage = fatPercentage
                    )
                }
                
                // Macro nutrients distribution chart
                item {
                    MacroDistributionChart(
                        proteinPercentage = proteinPercentage,
                        carbsPercentage = carbsPercentage,
                        fatPercentage = fatPercentage
                    )
                }
                
                // Breakfast section
                item {
                    MealHeader(
                        mealType = MealType.BREAKFAST,
                        totalCalories = breakfast.sumOf { it.calories },
                        onAddClicked = { 
                            selectedMealType.value = MealType.BREAKFAST
                            showAddMealDialog = true
                        }
                    )
                }
                
                items(breakfast) { foodItem ->
                    FoodItemCard(
                        foodItem = foodItem,
                        onClick = {
                            selectedFood = foodItem
                            showFoodDetailsSheet = true
                        }
                    )
                }
                
                // Lunch section
                item {
                    MealHeader(
                        mealType = MealType.LUNCH,
                        totalCalories = lunch.sumOf { it.calories },
                        onAddClicked = { 
                            selectedMealType.value = MealType.LUNCH
                            showAddMealDialog = true
                        }
                    )
                }
                
                items(lunch) { foodItem ->
                    FoodItemCard(
                        foodItem = foodItem,
                        onClick = {
                            selectedFood = foodItem
                            showFoodDetailsSheet = true
                        }
                    )
                }
                
                // Dinner section
                item {
                    MealHeader(
                        mealType = MealType.DINNER,
                        totalCalories = dinner.sumOf { it.calories },
                        onAddClicked = { 
                            selectedMealType.value = MealType.DINNER
                            showAddMealDialog = true
                        }
                    )
                }
                
                items(dinner) { foodItem ->
                    FoodItemCard(
                        foodItem = foodItem,
                        onClick = {
                            selectedFood = foodItem
                            showFoodDetailsSheet = true
                        }
                    )
                }
                
                // Snacks section
                item {
                    MealHeader(
                        mealType = MealType.SNACK,
                        totalCalories = snacks.sumOf { it.calories },
                        onAddClicked = { 
                            selectedMealType.value = MealType.SNACK
                            showAddMealDialog = true
                        }
                    )
                }
                
                items(snacks) { foodItem ->
                    FoodItemCard(
                        foodItem = foodItem,
                        onClick = {
                            selectedFood = foodItem
                            showFoodDetailsSheet = true
                        }
                    )
                }
                
                // Water intake
                item {
                    WaterIntakeTracker()
                }
                
                // Nutrition insights
                item {
                    NutritionInsightsCard()
                }
                
                item { Spacer(modifier = Modifier.height(80.dp)) }
            }
        },
        bottomBar = { BottomNavigationBar(navController) }
    )

    // Add meal dialog
    if (showAddMealDialog) {
        AddMealDialog(
            mealType = selectedMealType.value,
            onDismiss = { showAddMealDialog = false },
            onAddFood = { foodName, mealType ->
                // Handle adding food
                showAddMealDialog = false
                navController.navigate("food_search?meal=${mealType.name}")
            }
        )
    }
    
    // Food details bottom sheet
    if (showFoodDetailsSheet && selectedFood != null) {
        FoodDetailsBottomSheet(
            foodItem = selectedFood!!,
            onDismiss = { showFoodDetailsSheet = false },
            onEdit = { 
                showFoodDetailsSheet = false
                // Navigate to edit food screen
                navController.navigate("edit_food/${selectedFood!!.id}")
            }
        )
    }
}

@Composable
fun DateSelector(
    currentDate: LocalDate,
    onDateSelected: (LocalDate) -> Unit
) {
    val dates = (-3..3).map { currentDate.plusDays(it.toLong()) }
    val dateFormat = DateTimeFormatter.ofPattern("E\nd")
    val today = LocalDate.now()

    Column(modifier = Modifier.fillMaxWidth()) {
        // Day name and full date
        Text(
            text = if (currentDate == today) "Today" 
                   else if (currentDate == today.plusDays(1)) "Tomorrow"
                   else if (currentDate == today.minusDays(1)) "Yesterday"
                   else currentDate.format(DateTimeFormatter.ofPattern("EEEE")),
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold
        )
        
        Text(
            text = currentDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy")),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        // Date picker
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
        ) {
            items(dates) { date ->
                val isSelected = date == currentDate
                
                DateCard(
                    date = date,
                    dateFormat = dateFormat,
                    isSelected = isSelected,
                    isToday = date == today,
                    onClick = { onDateSelected(date) }
                )
            }
        }
    }
}

@Composable
fun DateCard(
    date: LocalDate,
    dateFormat: DateTimeFormatter,
    isSelected: Boolean,
    isToday: Boolean,
    onClick: () -> Unit
) {
    val backgroundColor = if (isSelected) 
                         MaterialTheme.colorScheme.primary 
                      else
                         MaterialTheme.colorScheme.surface
                         
    val contentColor = if (isSelected) 
                      MaterialTheme.colorScheme.onPrimary 
                   else 
                      MaterialTheme.colorScheme.onSurface

    Card(
        modifier = Modifier
            .width(60.dp)
            .height(80.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (isSelected) 4.dp else 1.dp
        )
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            // If it's today, show "Today" text
            if (isToday) {
                Text(
                    text = "Today",
                    style = MaterialTheme.typography.bodySmall,
                    color = contentColor,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )
            }
            
            Text(
                text = date.format(dateFormat).replace("\n", "\n"),
                style = MaterialTheme.typography.bodyMedium,
                color = contentColor,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(4.dp)
            )
        }
    }
}

@Composable
fun NutritionSummaryCard(
    dailyCalories: Int,
    calorieGoal: Int,
    caloriePercentage: Float,
    proteinGrams: Int,
    proteinGoal: Int,
    proteinPercentage: Float,
    carbsGrams: Int,
    carbsGoal: Int,
    carbsPercentage: Float,
    fatGrams: Int,
    fatGoal: Int,
    fatPercentage: Float
) {
    val caloriesRemaining = calorieGoal - dailyCalories
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            // Calories and progress bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Daily Calories",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = "$dailyCalories",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = " / $calorieGoal kcal",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                            modifier = Modifier.padding(bottom = 4.dp, start = 4.dp)
                        )
                    }
                }
                
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.size(60.dp)
                ) {
                    CircularProgressIndicator(
                        progress = { caloriePercentage.coerceIn(0f, 1f) },
                        modifier = Modifier.fillMaxSize(),
                        strokeWidth = 8.dp,
                        color = if (caloriePercentage > 1f) MaterialTheme.colorScheme.error
                               else MaterialTheme.colorScheme.primary,
                        trackColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                    Text(
                        text = "${(caloriePercentage * 100).roundToInt()}%",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = if (caloriesRemaining > 0) 
                      "$caloriesRemaining calories remaining" 
                      else 
                      "${-caloriesRemaining} calories over goal",
                style = MaterialTheme.typography.bodyMedium,
                color = if (caloriesRemaining >= 0) 
                       MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                       else
                       MaterialTheme.colorScheme.error
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Macros grid
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                MacroProgressItem(
                    name = "PROTEIN",
                    current = proteinGrams,
                    goal = proteinGoal,
                    percentage = proteinPercentage,
                    color = Color(0xFF66BB6A)
                )
                
                MacroProgressItem(
                    name = "CARBS",
                    current = carbsGrams,
                    goal = carbsGoal,
                    percentage = carbsPercentage,
                    color = Color(0xFFFFB74D)
                )
                
                MacroProgressItem(
                    name = "FAT",
                    current = fatGrams,
                    goal = fatGoal,
                    percentage = fatPercentage,
                    color = Color(0xFFEF5350)
                )
            }
        }
    }
}

@Composable
fun MacroProgressItem(
    name: String,
    current: Int,
    goal: Int,
    percentage: Float,
    color: Color
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = name,
            style = MaterialTheme.typography.bodySmall,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(4.dp))
        
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(60.dp)
        ) {
            CircularProgressIndicator(
                progress = { percentage.coerceIn(0f, 1f) },
                modifier = Modifier.fillMaxSize(),
                strokeWidth = 6.dp,
                color = color,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "$current",
                    style = MaterialTheme.typography.bodyLarge.copy(
                        fontWeight = FontWeight.Bold
                    )
                )
                Text(
                    text = "g",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(4.dp))
        
        Text(
            text = "$goal g",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
    }
}

@Composable
fun MacroDistributionChart(
    proteinPercentage: Float,
    carbsPercentage: Float,
    fatPercentage: Float
) {
    val total = proteinPercentage + carbsPercentage + fatPercentage
    val proteinRatio = (proteinPercentage / total).coerceIn(0f, 1f)
    val carbsRatio = (carbsPercentage / total).coerceIn(0f, 1f)
    val fatRatio = (fatPercentage / total).coerceIn(0f, 1f)
    
    // Make sure ratios add up to 1
    val adjustedProteinRatio = proteinRatio
    val adjustedCarbsRatio = carbsRatio
    val adjustedFatRatio = 1f - adjustedProteinRatio - adjustedCarbsRatio
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = "Macro Distribution",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Custom chart
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(24.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.LightGray.copy(alpha = 0.3f))
            ) {
                Row(modifier = Modifier.fillMaxSize()) {
                    // Protein section
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .weight(adjustedProteinRatio)
                            .background(Color(0xFF66BB6A))
                    )
                    
                    // Carbs section
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .weight(adjustedCarbsRatio)
                            .background(Color(0xFFFFB74D))
                    )
                    
                    // Fat section
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .weight(adjustedFatRatio)
                            .background(Color(0xFFEF5350))
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Legend
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                MacroLegendItem(
                    name = "Protein",
                    percentage = (adjustedProteinRatio * 100).roundToInt(),
                    color = Color(0xFF66BB6A)
                )
                
                MacroLegendItem(
                    name = "Carbs",
                    percentage = (adjustedCarbsRatio * 100).roundToInt(),
                    color = Color(0xFFFFB74D)
                )
                
                MacroLegendItem(
                    name = "Fat",
                    percentage = (adjustedFatRatio * 100).roundToInt(),
                    color = Color(0xFFEF5350)
                )
            }
        }
    }
}

@Composable
fun MacroLegendItem(
    name: String,
    percentage: Int,
    color: Color
) {
    Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(12.dp)
                .background(color, shape = CircleShape)
        )
        
        Spacer(modifier = Modifier.width(4.dp))
        
        Text(
            text = "$name $percentage%",
            style = MaterialTheme.typography.bodySmall
        )
    }
}

@Composable
fun MealHeader(
    mealType: MealType,
    totalCalories: Int,
    onAddClicked: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = when(mealType) {
                    MealType.BREAKFAST -> Icons.Outlined.FreeBreakfast
                    MealType.LUNCH -> Icons.Outlined.LunchDining
                    MealType.DINNER -> Icons.Outlined.DinnerDining
                    MealType.SNACK -> Icons.Outlined.Restaurant
                },
                contentDescription = mealType.toString(),
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier
                    .size(32.dp)
                    .padding(end = 8.dp)
            )
            
            Column {
                Text(
                    text = mealType.toString().capitalize(),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                
                Text(
                    text = "$totalCalories kcal",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }
        }
        
        IconButton(
            onClick = onAddClicked,
            modifier = Modifier
                .size(36.dp)
                .background(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = CircleShape
                )
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Add ${mealType.toString().lowercase()}",
                tint = MaterialTheme.colorScheme.onPrimaryContainer
            )
        }
    }
    
    Divider(
        modifier = Modifier.padding(vertical = 8.dp),
        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.1f)
    )
}

@Composable
fun FoodItemCard(
    foodItem: FoodItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Food image
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Image(
                    painter = painterResource(id = foodItem.imageRes),
                    contentDescription = foodItem.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }
            
            Spacer(modifier = Modifier.width(12.dp))
            
            // Food info
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = foodItem.name,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.SemiBold
                )
                
                Text(
                    text = foodItem.servingSize,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                // Macros
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NutrientPill(
                        name = "P",
                        value = "${foodItem.protein.toInt()}g",
                        color = Color(0xFF66BB6A)
                    )
                    
                    NutrientPill(
                        name = "C",
                        value = "${foodItem.carbs.toInt()}g",
                        color = Color(0xFFFFB74D)
                    )
                    
                    NutrientPill(
                        name = "F",
                        value = "${foodItem.fat.toInt()}g",
                        color = Color(0xFFEF5350)
                    )
                }
            }
            
            // Calories
            Column(
                horizontalAlignment = Alignment.End
            ) {
                Text(
                    text = "${foodItem.calories}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                
                Text(
                    text = "kcal",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }
        }
    }
}

@Composable
fun NutrientPill(
    name: String,
    value: String,
    color: Color
) {
    Row(
        modifier = Modifier
            .background(
                color = color.copy(alpha = 0.1f),
                shape = RoundedCornerShape(16.dp)
            )
            .padding(horizontal = 6.dp, vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = name,
            style = MaterialTheme.typography.bodySmall,
            fontWeight = FontWeight.Bold,
            color = color
        )
        
        Spacer(modifier = Modifier.width(2.dp))
        
        Text(
            text = value,
            style = MaterialTheme.typography.bodySmall
        )
    }
}

@Composable
fun WaterIntakeTracker() {
    val waterGoal = 8 // 8 glasses
    var waterIntake by remember { mutableStateOf(5) } // Current intake

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Filled.WaterDrop,
                        contentDescription = "Water",
                        tint = Color(0xFF42A5F5),
                        modifier = Modifier.size(28.dp)
                    )
                    
                    Spacer(modifier = Modifier.width(8.dp))
                    
                    Column {
                        Text(
                            text = "Water Intake",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "$waterIntake of $waterGoal glasses",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                }
                
                Row {
                    IconButton(
                        onClick = { if (waterIntake > 0) waterIntake-- },
                        modifier = Modifier
                            .size(36.dp)
                            .background(
                                MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                                CircleShape
                            )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Remove,
                            contentDescription = "Decrease",
                            tint = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }
                    
                    Spacer(modifier = Modifier.width(8.dp))
                    
                    IconButton(
                        onClick = { if (waterIntake < waterGoal) waterIntake++ },
                        modifier = Modifier
                            .size(36.dp)
                            .background(
                                MaterialTheme.colorScheme.primaryContainer,
                                CircleShape
                            )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Increase",
                            tint = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Water glasses visualization
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                for (i in 1..waterGoal) {
                    WaterGlass(filled = i <= waterIntake)
                }
            }
        }
    }
}

@Composable
fun WaterGlass(filled: Boolean) {
    Box(
        modifier = Modifier
            .width(28.dp)
            .height(40.dp)
            .clip(
                RoundedCornerShape(
                    topStart = 2.dp,
                    topEnd = 2.dp,
                    bottomStart = 8.dp,
                    bottomEnd = 8.dp
                )
            )
            .border(
                width = 2.dp,
                color = Color(0xFF42A5F5),
                shape = RoundedCornerShape(
                    topStart = 2.dp,
                    topEnd = 2.dp,
                    bottomStart = 8.dp,
                    bottomEnd = 8.dp
                )
            )
            .padding(2.dp),
        contentAlignment = Alignment.BottomCenter
    ) {
        if (filled) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(0.9f)
                    .clip(
                        RoundedCornerShape(
                            bottomStart = 6.dp,
                            bottomEnd = 6.dp
                        )
                    )
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                Color(0xFF90CAF9),
                                Color(0xFF42A5F5)
                            )
                        )
                    )
            )
        }
    }
}

@Composable
fun NutritionInsightsCard() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Nutrition Insights",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                
                TextButton(onClick = { /* Navigate to detailed insights */ }) {
                    Text(
                        text = "View All",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Insight cards
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                InsightItem(
                    icon = Icons.Default.Insights,
                    title = "Protein intake has been consistent",
                    description = "Great job maintaining your protein goals this week!",
                    positive = true
                )
                
                InsightItem(
                    icon = Icons.Default.Warning,
                    title = "Sugar consumption is high",
                    description = "Try to reduce added sugars in your snacks",
                    positive = false
                )
                
                InsightItem(
                    icon = Icons.Default.TrendingUp,
                    title = "Fiber intake improving",
                    description = "You've increased your daily fiber by 20% this week",
                    positive = true
                )
            }
        }
    }
}

@Composable
fun InsightItem(
    icon: ImageVector,
    title: String,
    description: String,
    positive: Boolean
) {
    val backgroundColor = if (positive) 
                         MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                      else
                         MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.5f)
                         
    val contentColor = if (positive) 
                      MaterialTheme.colorScheme.primary
                   else
                      MaterialTheme.colorScheme.error

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(backgroundColor)
            .padding(12.dp),
        verticalAlignment = Alignment.Top
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = contentColor,
            modifier = Modifier.padding(top = 2.dp)
        )
        
        Spacer(modifier = Modifier.width(12.dp))
        
        Column {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.SemiBold
                )
            )
            
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
        }
    }
}

@Composable
fun AddMealDialog(
    mealType: MealType?,
    onDismiss: () -> Unit,
    onAddFood: (String, MealType) -> Unit
) {
    val focusRequester = remember { FocusRequester() }
    var foodName by remember { mutableStateOf("") }
    val selectedMealType = remember { mutableStateOf(mealType ?: MealType.SNACK) }
    
    LaunchedEffect(Unit) {
        try {
            delay(100) // Small delay to ensure the dialog is fully shown
            focusRequester.requestFocus()
        } catch (e: Exception) {
            // Handle potential focus request exception
        }
    }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Add to ${selectedMealType.value.toString().toLowerCase().capitalize()}",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Meal type selection
                if (mealType == null) {
                    Text(
                        text = "Select meal:",
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.align(Alignment.Start)
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    LazyRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        items(MealType.values()) { type ->
                            MealTypeChip(
                                mealType = type,
                                selected = selectedMealType.value == type,
                                onClick = { selectedMealType.value = type }
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                }
                
                // Quick add options
                Text(
                    text = "Quick add options:",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.align(Alignment.Start)
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Common food options
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(QuickAddFoods) { food ->
                        QuickAddFoodItem(
                            food = food,
                            onClick = {
                                onAddFood(food.name, selectedMealType.value)
                            }
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Search
                OutlinedTextField(
                    value = foodName,
                    onValueChange = { foodName = it },
                    label = { Text("Search for food") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .focusRequester(focusRequester),
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search"
                        )
                    },
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Cancel")
                    }
                    
                    Spacer(modifier = Modifier.width(8.dp))
                    
                    Button(
                        onClick = { 
                            if (foodName.isNotBlank()) {
                                onAddFood(foodName, selectedMealType.value) 
                            } else {
                                onDismiss()
                            }
                        }
                    ) {
                        Text("Search")
                    }
                }
            }
        }
    }
}

@Composable
fun MealTypeChip(
    mealType: MealType,
    selected: Boolean,
    onClick: () -> Unit
) {
    val backgroundColor = if (selected) 
                         MaterialTheme.colorScheme.primary
                      else 
                         MaterialTheme.colorScheme.surface
                         
    val contentColor = if (selected) 
                      MaterialTheme.colorScheme.onPrimary
                   else 
                      MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                      
    val borderColor = if (selected) 
                     MaterialTheme.colorScheme.primary
                  else 
                     MaterialTheme.colorScheme.outline

    Surface(
        modifier = Modifier
            .padding(end = 8.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        color = backgroundColor,
        border = BorderStroke(1.dp, borderColor)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
        ) {
            Icon(
                imageVector = when(mealType) {
                    MealType.BREAKFAST -> Icons.Outlined.FreeBreakfast
                    MealType.LUNCH -> Icons.Outlined.LunchDining
                    MealType.DINNER -> Icons.Outlined.DinnerDining
                    MealType.SNACK -> Icons.Outlined.Restaurant
                },
                contentDescription = mealType.toString(),
                tint = contentColor,
                modifier = Modifier.size(16.dp)
            )
            
            Spacer(modifier = Modifier.width(4.dp))
            
            Text(
                text = mealType.toString().toLowerCase().capitalize(),
                style = MaterialTheme.typography.bodySmall,
                color = contentColor
            )
        }
    }
}

@Composable
fun QuickAddFoodItem(
    food: QuickAddFood,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(80.dp)
            .clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant),
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(id = food.imageRes),
                contentDescription = food.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        }
        
        Spacer(modifier = Modifier.height(4.dp))
        
        Text(
            text = food.name,
            style = MaterialTheme.typography.bodySmall,
            textAlign = TextAlign.Center,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
fun FoodDetailsBottomSheet(
    foodItem: FoodItem,
    onDismiss: () -> Unit,
    onEdit: () -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 20.dp)
        ) {
            // Header with image and basic info
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Food image
                Image(
                    painter = painterResource(id = foodItem.imageRes),
                    contentDescription = foodItem.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(70.dp)
                        .clip(RoundedCornerShape(12.dp))
                )
                
                Spacer(modifier = Modifier.width(16.dp))
                
                // Food name and basic info
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = foodItem.name,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Text(
                        text = "${foodItem.servingSize} • ${foodItem.time}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }
                
                // Calories
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "${foodItem.calories}",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Text(
                        text = "kcal",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }
            }
            
            Divider()
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Macro nutrients
            Text(
                text = "Macronutrients",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )
            
            // Detailed macro bars
            MacroNutrientBar(
                name = "Protein",
                value = foodItem.protein.toInt(),
                total = (foodItem.protein + foodItem.carbs + foodItem.fat).toInt(),
                color = Color(0xFF66BB6A)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            MacroNutrientBar(
                name = "Carbs",
                value = foodItem.carbs.toInt(),
                total = (foodItem.protein + foodItem.carbs + foodItem.fat).toInt(),
                color = Color(0xFFFFB74D)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            MacroNutrientBar(
                name = "Fat",
                value = foodItem.fat.toInt(),
                total = (foodItem.protein + foodItem.carbs + foodItem.fat).toInt(),
                color = Color(0xFFEF5350)
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                OutlinedButton(
                    onClick = onDismiss,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Close")
                }
                
                Spacer(modifier = Modifier.width(16.dp))
                
                Button(
                    onClick = onEdit,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Edit")
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun MacroNutrientBar(
    name: String,
    value: Int,
    total: Int,
    color: Color
) {
    val percentage = if (total > 0) value.toFloat() / total.toFloat() else 0f

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = name,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold
            )
            
            Text(
                text = "${value}g",
                style = MaterialTheme.typography.bodyMedium
            )
        }
        
        Spacer(modifier = Modifier.height(4.dp))
        
        // Progress bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(percentage)
                    .fillMaxHeight()
                    .clip(RoundedCornerShape(4.dp))
                    .background(color)
            )
        }
    }
}

@Composable
fun BottomNavigationBar(navController: NavController) {
    NavigationBar {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
            label = { Text("Home") },
            selected = false,
            onClick = { navController.navigate("home") }
        )
        
        NavigationBarItem(
            icon = { Icon(Icons.Default.FitnessCenter, contentDescription = "Workouts") },
            label = { Text("Workouts") },
            selected = false,
            onClick = { navController.navigate("workouts") }
        )
        
        NavigationBarItem(
            icon = { Icon(Icons.Default.Restaurant, contentDescription = "Nutrition") },
            label = { Text("Nutrition") },
            selected = true,
            onClick = { /* Already on nutrition screen */ }
        )
        
        NavigationBarItem(
            icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
            label = { Text("Profile") },
            selected = false,
            onClick = { navController.navigate("profile") }
        )
    }
}

// Utility for String capitalization for meal types
fun String.capitalize(): String {
    return this.lowercase().replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
}

// Demo list of quick-add food options
val QuickAddFoods = listOf(
    QuickAddFood("Apple", R.drawable.food_apple),
    QuickAddFood("Banana", R.drawable.food_banana),
    QuickAddFood("Chicken", R.drawable.food_chicken),
    QuickAddFood("Egg", R.drawable.food_egg),
    QuickAddFood("Yogurt", R.drawable.food_yogurt),
    QuickAddFood("Salad", R.drawable.food_salad)
)

// Quick add food data class
data class QuickAddFood(
    val name: String,
    val imageRes: Int
)