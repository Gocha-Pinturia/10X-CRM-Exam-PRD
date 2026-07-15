// Import functions from other modules
import { getUsers, saveSession } from './storage.js';
import { showToast, showFieldError, clearAllErrors } from './ui.js';
import { redirectIfLoggedIn } from './guard.js';

// Redirect logged-in users to dashboard (P0.1 Auth Guard)
redirectIfLoggedIn();

// Login form validation and submission
const loginForm = document.getElementById('loginForm');

// Get input elements
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');

// Handle form submission
loginForm.addEventListener('submit', (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Clear all previous errors
    clearAllErrors(loginForm);

    // Get form values
    const email = loginEmailInput.value.trim().toLowerCase();
    const password = loginPasswordInput.value;

    // Validation flags
    let isValid = true;

    // Validation rule 1: Email is required
    if (email === '') {
        showFieldError(loginEmailInput, 'Email is required');
        isValid = false;
    }

    // Validation rule 2: Password is required
    if (password === '') {
        showFieldError(loginPasswordInput, 'Password is required');
        isValid = false;
    }

    // If basic validation fails, stop here
    if (!isValid) {
        return;
    }

    // Validation rule 3: Check credentials pair (P2.2)
    const users = getUsers();
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        // Generalized error for security
        showFieldError(loginEmailInput, 'Invalid email or password');
        return;
    }

    // Successful login behavior (P2.3)

    // 1. Create Session object
    const session = {
        userId: user.id,
        email: user.email,
        loginAt: new Date().toISOString()
    };

    // 2. Save session to localStorage
    saveSession(session);

    // 3. Show success toast
    showToast('Login successful! Welcome back.', 'success');

    // 4. Instant redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500); // Small delay to let user see the toast
});