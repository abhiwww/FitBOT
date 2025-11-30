// Enhanced Workout and Diet Data with Videos and Progress Tracking
const workouts = {
    chest: {
        beginner: [
            { name: "Wall push-ups", video: "https://example.com/wall-pushups.mp4", reps: "3 sets of 10-15" },
            { name: "Incline push-ups", video: "https://example.com/incline-pushups.mp4", reps: "3 sets of 8-12" },
            { name: "Knee push-ups", video: "https://example.com/knee-pushups.mp4", reps: "3 sets of 10-15" }
        ],
        intermediate: [
            { name: "Regular push-ups", video: "https://example.com/pushups.mp4", reps: "3 sets of 12-15" },
            { name: "Wide push-ups", video: "https://example.com/wide-pushups.mp4", reps: "3 sets of 10-12" },
            { name: "Decline push-ups", video: "https://example.com/decline-pushups.mp4", reps: "3 sets of 8-10" }
        ],
        advanced: [
            { name: "Archer push-ups", video: "https://example.com/archer-pushups.mp4", reps: "3 sets of 5-8" },
            { name: "Explosive push-ups", video: "https://example.com/explosive-pushups.mp4", reps: "3 sets of 8-10" },
            { name: "Dive-bomber push-ups", video: "https://example.com/divebomber-pushups.mp4", reps: "3 sets of 6-8" }
        ]
    },
    back: {
        beginner: [
            { name: "Supermans", video: "https://example.com/supermans.mp4", reps: "3 sets of 12-15" },
            { name: "Prone Y-raises", video: "https://example.com/prone-y-raises.mp4", reps: "3 sets of 10-12" }
        ],
        intermediate: [
            { name: "Reverse snow angels", video: "https://example.com/reverse-snow-angels.mp4", reps: "3 sets of 10-12" },
            { name: "Hip hinge rows", video: "https://example.com/hip-hinge-rows.mp4", reps: "3 sets of 12-15" }
        ],
        advanced: [
            { name: "Pike handstand hold", video: "https://example.com/pike-handstand.mp4", reps: "3 sets of 30-45 seconds" },
            { name: "Table rows", video: "https://example.com/table-rows.mp4", reps: "3 sets of 10-12" }
        ]
    },
    // ... other body parts with similar structure
    fullbody: {
        beginner: [
            { name: "Marching in place", video: "https://example.com/marching.mp4", reps: "3 minutes" },
            { name: "Bodyweight squats", video: "https://example.com/squats.mp4", reps: "3 sets of 12-15" },
            { name: "Wall push-ups", video: "https://example.com/wall-pushups.mp4", reps: "3 sets of 10-12" }
        ],
        intermediate: [
            { name: "Burpees without jump", video: "https://example.com/burpees.mp4", reps: "3 sets of 8-10" },
            { name: "Mountain climbers", video: "https://example.com/mountain-climbers.mp4", reps: "3 sets of 15-20" },
            { name: "Walk-out to plank", video: "https://example.com/walkout-plank.mp4", reps: "3 sets of 8-10" }
        ],
        advanced: [
            { name: "Full burpees", video: "https://example.com/full-burpees.mp4", reps: "3 sets of 10-12" },
            { name: "Plank jacks", video: "https://example.com/plank-jacks.mp4", reps: "3 sets of 15-20" },
            { name: "Jump squats + push-ups", video: "https://example.com/jump-squats-pushups.mp4", reps: "3 sets of 8-10" }
        ]
    }
};

class ProgressTracker {
    constructor() {
        this.workoutsCompleted = 0;
        this.caloriesBurned = 0;
        this.streak = 0;
        this.lastWorkoutDate = null;
        this.workoutHistory = [];
        this.achievements = [];
    }

    logWorkout(workoutType, duration, calories) {
        const today = new Date().toDateString();
        this.workoutsCompleted++;
        this.caloriesBurned += calories;
        
        // Calculate streak
        if (this.lastWorkoutDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (this.lastWorkoutDate === yesterday.toDateString()) {
                this.streak++;
            } else if (this.lastWorkoutDate !== today) {
                this.streak = 1;
            }
        }
        
        this.lastWorkoutDate = today;
        this.workoutHistory.push({
            date: today,
            type: workoutType,
            duration,
            calories
        });
        
        this.checkAchievements();
        this.saveProgress();
        this.updateProgressUI();
    }

    checkAchievements() {
        const newAchievements = [];
        
        if (this.workoutsCompleted >= 1 && !this.achievements.includes('first_workout')) {
            newAchievements.push('First Workout! 🎉');
            this.achievements.push('first_workout');
        }
        
        if (this.streak >= 7 && !this.achievements.includes('week_streak')) {
            newAchievements.push('7-Day Streak! 🔥');
            this.achievements.push('week_streak');
        }
        
        if (this.caloriesBurned >= 1000 && !this.achievements.includes('calorie_master')) {
            newAchievements.push('1000 Calories Burned! 💪');
            this.achievements.push('calorie_master');
        }
        
        if (this.workoutsCompleted >= 10 && !this.achievements.includes('dedicated')) {
            newAchievements.push('10 Workouts Completed! 🏆');
            this.achievements.push('dedicated');
        }

        return newAchievements;
    }

    saveProgress() {
        const progress = {
            workoutsCompleted: this.workoutsCompleted,
            caloriesBurned: this.caloriesBurned,
            streak: this.streak,
            lastWorkoutDate: this.lastWorkoutDate,
            workoutHistory: this.workoutHistory,
            achievements: this.achievements
        };
        localStorage.setItem('fitbot_progress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('fitbot_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            Object.assign(this, progress);
            this.updateProgressUI();
        }
    }

    updateProgressUI() {
        const progressSection = document.getElementById('progressSection');
        if (progressSection) {
            progressSection.innerHTML = `
                <div class="progress-stats">
                    <div class="stat-card">
                        <div class="stat-value">${this.streak}</div>
                        <div class="stat-label">Day Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.workoutsCompleted}</div>
                        <div class="stat-label">Workouts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.caloriesBurned}</div>
                        <div class="stat-label">Calories</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.achievements.length}</div>
                        <div class="stat-label">Achievements</div>
                    </div>
                </div>
                ${this.achievements.length > 0 ? `
                    <div class="achievements">
                        <h4>Your Achievements</h4>
                        ${this.achievements.map(ach => 
                            `<span class="achievement-badge">${ach}</span>`
                        ).join('')}
                    </div>
                ` : ''}
            `;
        }
    }

    getProgressReport() {
        return {
            streak: this.streak,
            totalWorkouts: this.workoutsCompleted,
            totalCalories: this.caloriesBurned,
            achievements: this.achievements.length
        };
    }
}

class VoiceRecognition {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.voiceBtn = document.getElementById('voiceBtn');
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.setupRecognition();
        } else {
            this.voiceBtn.style.display = 'none';
        }
    }

    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.voiceBtn.classList.add('listening');
            this.voiceBtn.innerHTML = '🎤';
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.voiceBtn.classList.remove('listening');
            this.voiceBtn.innerHTML = '🎤';
        };

        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript;
            document.getElementById('userInput').value = command;
            this.processVoiceCommand(command);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.voiceBtn.classList.remove('listening');
            this.voiceBtn.innerHTML = '🎤';
        };
    }

    processVoiceCommand(command) {
        const responses = {
            'start workout': () => this.handleWorkoutCommand(),
            'show my progress': () => this.handleProgressCommand(),
            'what should I eat': () => this.handleDietCommand(),
            'calculate my BMI': () => this.handleBMICommand(),
            'chest workout': () => this.handleSpecificWorkout('chest'),
            'leg workout': () => this.handleSpecificWorkout('legs'),
            'diet plan': () => this.handleDietPlan()
        };

        for (const [key, action] of Object.entries(responses)) {
            if (command.toLowerCase().includes(key)) {
                action();
                break;
            }
        }
    }

    handleWorkoutCommand() {
        addMessage("Starting your workout! Here's a full body routine:", "bot");
        setTimeout(() => handleUserMessage("full body routine"), 1000);
    }

    handleProgressCommand() {
        const progress = progressTracker.getProgressReport();
        addMessage(`Your progress: ${progress.streak} day streak, ${progress.totalWorkouts} workouts completed, ${progress.totalCalories} calories burned! 🎯`, "bot");
    }

    handleDietCommand() {
        addMessage("Let me suggest a healthy meal plan for you!", "bot");
        setTimeout(() => handleUserMessage("diet plan"), 1000);
    }

    handleBMICommand() {
        addMessage("Let me calculate your BMI and BMR!", "bot");
        setTimeout(() => handleUserMessage("bmi info"), 1000);
    }

    handleSpecificWorkout(bodyPart) {
        addMessage(`Great! Let me show you some ${bodyPart} exercises.`, "bot");
        setTimeout(() => handleUserMessage(`${bodyPart} workout`), 1000);
    }

    handleDietPlan() {
        addMessage("Here's your personalized diet plan!", "bot");
        setTimeout(() => handleUserMessage("diet plan"), 1000);
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }
}

// Enhanced food database with recipes
const mealPlans = {
    loss: {
        vegetarian: [
            {
                meal: "Breakfast",
                name: "Protein Oats",
                ingredients: ["Oats", "Skim milk", "Berries", "Chia seeds"],
                calories: 350,
                recipe: "Cook oats with milk, top with berries and chia seeds"
            },
            {
                meal: "Lunch", 
                name: "Quinoa Salad",
                ingredients: ["Quinoa", "Mixed vegetables", "Lemon dressing", "Herbs"],
                calories: 400,
                recipe: "Mix cooked quinoa with vegetables and lemon dressing"
            }
        ],
        nonVegetarian: [
            {
                meal: "Breakfast",
                name: "Egg Scramble",
                ingredients: ["3 Eggs", "Spinach", "Tomatoes", "Whole wheat toast"],
                calories: 380,
                recipe: "Scramble eggs with vegetables, serve with toast"
            },
            {
                meal: "Lunch",
                name: "Grilled Chicken Salad",
                ingredients: ["Chicken breast", "Mixed greens", "Olive oil", "Vinegar"],
                calories: 420,
                recipe: "Grill chicken and serve over fresh salad"
            }
        ]
    },
    gain: {
        vegetarian: [
            {
                meal: "Breakfast",
                name: "Nut Butter Toast",
                ingredients: ["Whole grain bread", "Peanut butter", "Banana", "Honey"],
                calories: 450,
                recipe: "Toast bread, spread peanut butter, top with banana slices and honey"
            }
        ],
        nonVegetarian: [
            {
                meal: "Breakfast", 
                name: "Protein Power",
                ingredients: ["4 Eggs", "Avocado", "Whole wheat toast", "Cheese"],
                calories: 520,
                recipe: "Scramble eggs with cheese, serve with avocado toast"
            }
        ]
    }
};

// Initialize components
const progressTracker = new ProgressTracker();
let voiceRecognizer = null;

// Enhanced chatbot logic
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const quickActions = document.querySelectorAll('.quick-action');
const typingIndicator = document.getElementById('typingIndicator');

// Append message to chat with enhanced features
function addMessage(text, sender = "bot") {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `${text}<div class="message-time">${time}</div>`;
    
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    // Add animation for new messages
    setTimeout(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
    }, 100);
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Enhanced message handling with NLP-like features
function handleUserMessage(message) {
    const msg = message.toLowerCase();
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        
        if (!window.userProfile) {
            addMessage("Please fill your details and click 'Calculate & Update' first so I can personalize your plan.");
            return;
        }

        // Enhanced greeting detection
        if (msg.match(/\b(hi|hello|hey|good morning|good afternoon)\b/)) {
            addMessage(`Hello! Welcome back to FitBot! How can I help you with your fitness journey today? 💪`);
            return;
        }

        if (msg.includes("bmi") || msg.includes("bmr")) {
            const { bmi, bmiCategory, bmr, calories, goal } = window.userProfile;
            addMessage(
                `📊 **Your Fitness Metrics:**\n` +
                `• BMI: ${bmi.toFixed(1)} (${bmiCategory})\n` +
                `• BMR: ${Math.round(bmr)} kcal/day\n` +
                `• Daily Target: ${calories} kcal for ${goal}\n` +
                `• Recommendation: ${getBMITips(bmiCategory)}`
            );
            return;
        }

        // Progress tracking queries
        if (msg.includes("progress") || msg.includes("streak") || msg.includes("achievement")) {
            const progress = progressTracker.getProgressReport();
            addMessage(
                `🎯 **Your Progress:**\n` +
                `• Current Streak: ${progress.streak} days 🔥\n` +
                `• Total Workouts: ${progress.totalWorkouts} 🏋️\n` +
                `• Calories Burned: ${progress.totalCalories} 🔥\n` +
                `• Achievements: ${progress.achievements} 🏆\n\n` +
                `Keep up the great work! You're doing amazing!`
            );
            return;
        }

        // Ask for specific body part workouts with enhanced response
        const bodyParts = Object.keys(workouts);
        const matchedPart = bodyParts.find((part) => msg.includes(part));
        if (matchedPart) {
            let intensity = "beginner";
            if (msg.includes("intermediate") || msg.includes("medium")) intensity = "intermediate";
            if (msg.includes("advanced") || msg.includes("hard") || msg.includes("intense")) intensity = "advanced";

            const exercises = workouts[matchedPart][intensity];
            let response = `💪 **${intensity.charAt(0).toUpperCase() + intensity.slice(1)} ${matchedPart} Exercises:**\n\n`;
            
            exercises.forEach((exercise, index) => {
                response += `${index + 1}. **${exercise.name}** - ${exercise.reps}\n`;
            });
            
            response += `\n💡 *Tip: Rest 60 seconds between sets and focus on proper form!*`;
            
            addMessage(response);
            
            // Log this workout interaction
            progressTracker.logWorkout(`${matchedPart} workout`, 30, 150);
            return;
        }

        // Enhanced workout request
        if (msg.includes("workout") || msg.includes("exercise") || msg.includes("routine")) {
            const { level, goal } = window.userProfile;
            const full = workouts.fullbody[level];
            let response = `🏋️ **${level.charAt(0).toUpperCase() + level.slice(1)} Full-Body Routine for ${goal}:**\n\n`;
            
            full.forEach((exercise, index) => {
                response += `${index + 1}. **${exercise.name}** - ${exercise.reps}\n`;
            });
            
            response += `\n⏱️ *Complete 3 rounds with 90 seconds rest between rounds*`;
            response += `\n🎯 *Perfect for your ${goal} goals!*`;
            
            addMessage(response);
            progressTracker.logWorkout("full body routine", 45, 200);
            return;
        }

        // Enhanced diet questions with meal plans
        if (msg.includes("diet") || msg.includes("meal") || msg.includes("food") || msg.includes("eat")) {
            const { calories, goal, diet } = window.userProfile;
            const dietType = msg.includes("veg") ? "vegetarian" : "nonVegetarian";
            const plan = mealPlans[goal]?.[dietType] || mealPlans[goal]?.nonVegetarian;
            
            let response = `🍽️ **Your ${goal} Diet Plan (${Math.round(calories)} kcal):**\n\n`;
            response += `• Protein: ${diet.protein}g | Carbs: ${diet.carbs}g | Fats: ${diet.fats}g\n\n`;
            
            if (plan) {
                plan.forEach(meal => {
                    response += `**${meal.meal} - ${meal.name}** (${meal.calories} kcal)\n`;
                    response += `Ingredients: ${meal.ingredients.join(", ")}\n`;
                    response += `Recipe: ${meal.recipe}\n\n`;
                });
            }
            
            response += `💡 *${diet.focus}*`;
            
            addMessage(response);
            return;
        }

        // Motivational responses
        if (msg.includes("tired") || msg.includes("hard") || msg.includes("difficult")) {
            addMessage("I know it's tough, but remember why you started! 💪 Every rep counts, every healthy meal matters. You've got this! Keep pushing! 🔥");
            return;
        }

        if (msg.includes("thank") || msg.includes("thanks")) {
            addMessage("You're welcome! 😊 Remember, consistency is key. Keep showing up for yourself! You're doing amazing! 🌟");
            return;
        }

        // Default enhanced response
        addMessage(
            "I can help you with:\n\n" +
            "💪 **Workouts:** \"chest workout\", \"leg exercises\", \"full body routine\"\n" +
            "🍽️ **Nutrition:** \"diet plan\", \"meal suggestions\", \"weight loss diet\"\n" +
            "📊 **Tracking:** \"my progress\", \"show my BMI\", \"achievements\"\n" +
            "🎯 **Goals:** \"weight loss tips\", \"muscle gain advice\"\n\n" +
            "What would you like to focus on today? 😊"
        );
    }, 1000 + Math.random() * 1000); // Random delay for natural conversation feel
}

// Helper function for BMI tips
function getBMITips(category) {
    const tips = {
        underweight: "Focus on strength training and calorie surplus with nutrient-dense foods",
        "normal weight": "Maintain with balanced workouts and nutrition. Great job!",
        overweight: "Combine cardio with strength training and moderate calorie deficit",
        obese: "Start with low-impact exercises and focus on consistent calorie deficit"
    };
    return tips[category] || "Stay active and eat balanced meals!";
}

// Initialize voice recognition when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    voiceRecognizer = new VoiceRecognition();
    progressTracker.loadProgress();
    
    // Add voice button event listener
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            voiceRecognizer.startListening();
        });
    }
    
    // Add theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            themeToggle.innerHTML = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
        });
    }
    
    // Add exercise demo functionality
    document.querySelectorAll('.workout-card').forEach(card => {
        card.addEventListener('click', function() {
            const demo = this.querySelector('.exercise-demo');
            if (demo) {
                demo.classList.toggle('show');
            }
        });
    });
});

// Send message with enhanced features
sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    userInput.value = "";
    handleUserMessage(text);
});

// Quick actions with enhanced functionality
quickActions.forEach(action => {
    action.addEventListener('click', () => {
        const text = action.getAttribute('data-action');
        addMessage(text, "user");
        handleUserMessage(text);
    });
});

// Enhanced enter key handling
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});

// Make functions available globally
window.addMessage = addMessage;
window.handleUserMessage = handleUserMessage;
window.progressTracker = progressTracker;