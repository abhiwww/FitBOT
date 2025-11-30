// Enhanced Utility Functions with Better Accuracy
function calculateBMI(weight, heightCm) {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
}

// Enhanced BMR calculation with different formulas
function calculateBMR(weight, heightCm, age, gender) {
    // Using Mifflin-St Jeor Equation (more accurate)
    if (gender === "male") {
        return Math.round(10 * weight + 6.25 * heightCm - 5 * age + 5);
    } else {
        return Math.round(10 * weight + 6.25 * heightCm - 5 * age - 161);
    }
}

// Enhanced BMI category with more detailed ranges
function getBMICategory(bmi) {
    if (bmi < 16) return "severely underweight";
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "normal weight";
    if (bmi < 30) return "overweight";
    if (bmi < 35) return "obese class I";
    if (bmi < 40) return "obese class II";
    return "obese class III";
}

// Enhanced training level suggestion
function getLevelFromBMI(bmi, age) {
    if (bmi < 18.5 || bmi >= 30 || age > 50) return "beginner";
    if (bmi >= 18.5 && bmi < 25) return "intermediate";
    return "beginner";
}

// Enhanced calorie target with goal-specific adjustments
function getCalorieTarget(bmr, activityFactor, goal, weight, height, age) {
    const maintenance = bmr * activityFactor;
    
    let adjustment = 0;
    switch(goal) {
        case "loss":
            adjustment = -500; // More sustainable deficit
            break;
        case "gain":
            adjustment = 300; // Conservative surplus
            break;
        default:
            adjustment = 0;
    }
    
    // Adjust based on current weight status
    const bmi = calculateBMI(weight, height);
    if (goal === "loss" && bmi > 30) {
        adjustment = -600; // Larger deficit for obese individuals
    } else if (goal === "gain" && bmi < 18.5) {
        adjustment = 400; // Larger surplus for underweight
    }
    
    return Math.round(maintenance + adjustment);
}

// Enhanced diet plan with macro cycling
function getDietPlan(calories, goal, bmi) {
    let proteinRatio, carbRatio, fatRatio;
    
    switch(goal) {
        case "loss":
            proteinRatio = 0.35; // Higher protein for satiety
            carbRatio = 0.40;
            fatRatio = 0.25;
            break;
        case "gain":
            proteinRatio = 0.30;
            carbRatio = 0.50; // Higher carbs for energy
            fatRatio = 0.20;
            break;
        default:
            proteinRatio = 0.25;
            carbRatio = 0.50;
            fatRatio = 0.25;
    }
    
    // Adjust for BMI
    if (bmi > 30) {
        proteinRatio += 0.05; // Even more protein for obese individuals
        carbRatio -= 0.05;
    }

    const protein = Math.round(proteinRatio * calories / 4);
    const carbs = Math.round(carbRatio * calories / 4);
    const fats = Math.round(fatRatio * calories / 9);

    const focus =
        goal === "loss"
        ? "higher protein for satiety, controlled carbs, plenty of vegetables and fiber"
        : goal === "gain"
        ? "calorie-dense foods, adequate carbs for energy, consistent protein intake"
        : "balanced macronutrients matching your maintenance energy needs";

    return {
        calories,
        protein,
        carbs,
        fats,
        focus,
        proteinRatio: Math.round(proteinRatio * 100),
        carbRatio: Math.round(carbRatio * 100),
        fatRatio: Math.round(fatRatio * 100)
    };
}

// Calculate ideal weight range
function getIdealWeight(heightCm) {
    const heightM = heightCm / 100;
    const min = Math.round(18.5 * heightM * heightM);
    const max = Math.round(24.9 * heightM * heightM);
    return { min, max };
}

// Calculate water intake recommendation
function getWaterIntake(weight, activityLevel) {
    const baseWater = weight * 0.033; // Base: 33ml per kg
    const activityMultiplier = 1 + (activityLevel - 1.2) * 0.2; // Adjust for activity
    return Math.round(baseWater * activityMultiplier * 10) / 10; // Round to 1 decimal
}

// Enhanced fitness profile calculation
document.getElementById("calcBtn").addEventListener("click", () => {
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const activity = parseFloat(document.getElementById("activity").value);
    const goal = document.getElementById("goal").value;

    if (!age || !height || !weight || age < 10 || age > 100 || height < 100 || height > 250 || weight < 20 || weight > 300) {
        document.getElementById("resultSummary").innerHTML = 
            `<span style="color: var(--danger)">Please enter valid values: Age (10-100), Height (100-250cm), Weight (20-300kg)</span>`;
        return;
    }

    // Show loading state
    const calcBtn = document.getElementById("calcBtn");
    const originalText = calcBtn.innerHTML;
    calcBtn.innerHTML = '<span class="loading-spinner"></span> Calculating...';
    calcBtn.disabled = true;

    setTimeout(() => {
        const bmi = calculateBMI(weight, height);
        const bmiCategory = getBMICategory(bmi);
        const bmr = calculateBMR(weight, height, age, gender);
        const calories = getCalorieTarget(bmr, activity, goal, weight, height, age);
        const diet = getDietPlan(calories, goal, bmi);
        const level = getLevelFromBMI(bmi, age);
        const idealWeight = getIdealWeight(height);
        const waterIntake = getWaterIntake(weight, activity);

        window.userProfile = { 
            age, gender, height, weight, bmi, bmiCategory, bmr, calories, goal, level, diet,
            idealWeight, waterIntake
        };

        // Enhanced result display
        document.getElementById("resultSummary").innerHTML = `
            <strong>🎯 Your Personalized Fitness Profile:</strong><br><br>
            
            <strong>Body Composition:</strong><br>
            • BMI: <span style="color: var(--warning)">${bmi.toFixed(1)}</span> (${bmiCategory})<br>
            • Ideal Weight Range: ${idealWeight.min}-${idealWeight.max} kg<br>
            • BMR: ${Math.round(bmr)} kcal/day<br><br>
            
            <strong>Daily Targets:</strong><br>
            • Calories: <span style="color: var(--success)">${calories} kcal</span><br>
            • Protein: ${diet.protein}g | Carbs: ${diet.carbs}g | Fats: ${diet.fats}g<br>
            • Water: ${waterIntake} liters/day<br><br>
            
            <strong>Recommendations:</strong><br>
            • Training Level: <span style="color: var(--primary)">${level}</span><br>
            • Focus: ${diet.focus}
        `;

        // Save user data
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            localStorage.setItem(`userData_${currentUser.email}`, JSON.stringify(window.userProfile));
        }

        if (window.addMessage) {
            window.addMessage(
                `🎉 **Profile Updated Successfully!**\n\n` +
                `I've calculated your personalized fitness plan:\n` +
                `• BMI: ${bmi.toFixed(1)} (${bmiCategory})\n` +
                `• Daily Calories: ${calories} kcal\n` +
                `• Training Level: ${level}\n\n` +
                `Ready to crush your ${goal} goals? 💪`
            );
        }

        // Restore button
        calcBtn.innerHTML = originalText;
        calcBtn.disabled = false;

    }, 1500); // Simulate calculation time
});

// Add input validation
document.querySelectorAll('#age, #height, #weight').forEach(input => {
    input.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (value && (value < 10 || value > 300)) {
            this.style.borderColor = 'var(--danger)';
        } else {
            this.style.borderColor = '';
        }
    });
});