// Enhanced User Authentication System with Security Features
class AuthSystem {
    constructor() {
        this.authContainer = document.getElementById('authContainer');
        this.appContent = document.getElementById('appContent');
        this.authButtons = document.getElementById('authButtons');
        this.userInfo = document.getElementById('userInfo');
        this.signInForm = document.getElementById('signInForm');
        this.signUpForm = document.getElementById('signUpForm');
        this.signInBtn = document.getElementById('signInBtn');
        this.signUpBtn = document.getElementById('signUpBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.switchToSignUp = document.getElementById('switchToSignUp');
        this.switchToSignIn = document.getElementById('switchToSignIn');
        this.signInSubmit = document.getElementById('signInSubmit');
        this.signUpSubmit = document.getElementById('signUpSubmit');
        this.userAvatar = document.getElementById('userAvatar');
        this.userName = document.getElementById('userName');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        this.signInBtn.addEventListener('click', () => this.showSignIn());
        this.signUpBtn.addEventListener('click', () => this.showSignUp());
        this.switchToSignUp.addEventListener('click', () => this.showSignUp());
        this.switchToSignIn.addEventListener('click', () => this.showSignIn());
        this.signInSubmit.addEventListener('click', () => this.signIn());
        this.signUpSubmit.addEventListener('click', () => this.signUp());
        this.logoutBtn.addEventListener('click', () => this.logout());

        // Enter key support
        document.getElementById('signInPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.signIn();
        });
        document.getElementById('signUpConfirmPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.signUp();
        });
    }

    // Enhanced password validation
    validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const passed = Object.values(requirements).every(req => req);
        return { passed, requirements };
    }

    // Enhanced email validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Basic encryption for demo purposes (not for production)
    async hashPassword(password) {
        // Simple hash for demo - in production use proper hashing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    async signUp() {
        const name = document.getElementById('signUpName').value.trim();
        const email = document.getElementById('signUpEmail').value.trim().toLowerCase();
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpConfirmPassword').value;

        // Validation
        if (!name || !email || !password) {
            this.showAlert('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showAlert('Please enter a valid email address', 'error');
            return;
        }

        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.passed) {
            const missing = Object.entries(passwordValidation.requirements)
                .filter(([_, passed]) => !passed)
                .map(([req]) => req);
            this.showAlert(`Password must include: ${missing.join(', ')}`, 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showAlert('Passwords do not match', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[email]) {
            this.showAlert('User with this email already exists', 'error');
            return;
        }

        // Create new user with hashed password
        try {
            const hashedPassword = await this.hashPassword(password);
            users[email] = { 
                name, 
                email, 
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto login after sign up
            localStorage.setItem('currentUser', JSON.stringify({ 
                name, 
                email,
                loginTime: new Date().toISOString()
            }));
            
            this.showAppContent({ name, email });
            this.showAlert('Account created successfully! Welcome to FitBot! 🎉', 'success');
            
            // Clear form
            this.clearSignUpForm();
            
        } catch (error) {
            this.showAlert('Error creating account. Please try again.', 'error');
            console.error('Signup error:', error);
        }
    }

    async signIn() {
        const email = document.getElementById('signInEmail').value.trim().toLowerCase();
        const password = document.getElementById('signInPassword').value;

        if (!email || !password) {
            this.showAlert('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showAlert('Please enter a valid email address', 'error');
            return;
        }

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const user = users[email];
        
        if (!user) {
            this.showAlert('No account found with this email', 'error');
            return;
        }

        // Verify password
        try {
            const hashedPassword = await this.hashPassword(password);
            if (user.password !== hashedPassword) {
                this.showAlert('Invalid password', 'error');
                return;
            }

            // Update last login
            user.lastLogin = new Date().toISOString();
            users[email] = user;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Set current user
            localStorage.setItem('currentUser', JSON.stringify({ 
                name: user.name, 
                email,
                loginTime: new Date().toISOString()
            }));
            
            this.showAppContent({ name: user.name, email });
            this.showAlert(`Welcome back, ${user.name}! 👋`, 'success');
            
            // Clear form
            this.clearSignInForm();
            
        } catch (error) {
            this.showAlert('Error signing in. Please try again.', 'error');
            console.error('Signin error:', error);
        }
    }

    showSignIn() {
        this.signInForm.classList.remove('hidden');
        this.signUpForm.classList.add('hidden');
        this.clearSignUpForm();
    }

    showSignUp() {
        this.signUpForm.classList.remove('hidden');
        this.signInForm.classList.add('hidden');
        this.clearSignInForm();
    }

    clearSignInForm() {
        document.getElementById('signInEmail').value = '';
        document.getElementById('signInPassword').value = '';
    }

    clearSignUpForm() {
        document.getElementById('signUpName').value = '';
        document.getElementById('signUpEmail').value = '';
        document.getElementById('signUpPassword').value = '';
        document.getElementById('signUpConfirmPassword').value = '';
    }

    showAppContent(user) {
        this.authContainer.classList.add('hidden');
        this.appContent.classList.remove('hidden');
        this.authButtons.classList.add('hidden');
        this.userInfo.classList.remove('hidden');
        
        // Enhanced user avatar with gradient based on name
        this.userAvatar.textContent = user.name.charAt(0).toUpperCase();
        this.userAvatar.style.background = this.generateAvatarGradient(user.name);
        this.userName.textContent = user.name;
        
        // Load user data if exists
        this.loadUserData(user.email);
        
        // Initialize progress tracker if available
        if (window.progressTracker) {
            window.progressTracker.loadProgress();
        }
    }

    generateAvatarGradient(name) {
        const colors = [
            'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            'linear-gradient(45deg, #4834d4, #686de0)',
            'linear-gradient(45deg, #00d2d3, #54a0ff)',
            'linear-gradient(45deg, #f368e0, #ff9ff3)',
            'linear-gradient(45deg, #1dd1a1, #00d2d3)',
            'linear-gradient(45deg, #feca57, #ff9ff3)'
        ];
        
        // Deterministic color based on name
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    }

    loadUserData(email) {
        const userData = JSON.parse(localStorage.getItem(`userData_${email}`));
        if (userData) {
            document.getElementById('age').value = userData.age || '';
            document.getElementById('gender').value = userData.gender || 'male';
            document.getElementById('height').value = userData.height || '';
            document.getElementById('weight').value = userData.weight || '';
            document.getElementById('activity').value = userData.activity || '1.2';
            document.getElementById('goal').value = userData.goal || 'loss';
            
            if (userData.bmi) {
                document.getElementById('resultSummary').innerHTML = `
                    <strong>🎯 Your Fitness Profile:</strong><br><br>
                    <strong>Body Composition:</strong><br>
                    • BMI: <span style="color: var(--warning)">${userData.bmi.toFixed(1)}</span> (${userData.bmiCategory})<br>
                    • BMR: ${Math.round(userData.bmr)} kcal/day<br><br>
                    
                    <strong>Daily Targets:</strong><br>
                    • Calories: <span style="color: var(--success)">${userData.calories} kcal</span><br>
                    • Training Level: <span style="color: var(--primary)">${userData.level}</span>
                `;
            }
        }
    }

    logout() {
        // Clear current user session
        localStorage.removeItem('currentUser');
        
        // Show auth interface
        this.authContainer.classList.remove('hidden');
        this.appContent.classList.add('hidden');
        this.authButtons.classList.remove('hidden');
        this.userInfo.classList.add('hidden');
        this.showSignIn();
        
        this.showAlert('You have been logged out successfully', 'info');
    }

    checkAuthStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // Check if session is still valid (24 hours)
            const loginTime = new Date(currentUser.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                this.showAppContent(currentUser);
            } else {
                // Session expired
                this.logout();
                this.showAlert('Your session has expired. Please sign in again.', 'info');
            }
        }
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.auth-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `auth-alert auth-alert-${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

        // Add styles
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            ${type === 'error' ? 'background: linear-gradient(45deg, var(--danger), #c44569);' : ''}
            ${type === 'success' ? 'background: linear-gradient(45deg, var(--success), #1dd1a1);' : ''}
            ${type === 'info' ? 'background: linear-gradient(45deg, var(--primary), #4834d4);' : ''}
        `;

        alert.querySelector('button').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authSystem = new AuthSystem();
});

// Make auth functions available globally
window.signUp = () => window.authSystem.signUp();
window.signIn = () => window.authSystem.signIn();
window.logout = () => window.authSystem.logout();