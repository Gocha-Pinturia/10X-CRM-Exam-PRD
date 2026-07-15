// Import functions from other modules
import { getUsers, saveUsers } from './storage.js';
import { showToast, showFieldError, clearFieldError, clearAllErrors } from './ui.js';
import { redirectIfLoggedIn } from './guard.js';

// Redirect logged-in users to dashboard (P0.1)
redirectIfLoggedIn();

// Sign Up form validation and submission
const signupForm = document.getElementById('signupForm');

// Get input elements
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// ========== LIVE VALIDATION (P0.4 bonus) ==========
// Clear errors when user starts typing

fullNameInput.addEventListener('input', () => {
    if (fullNameInput.classList.contains('input-error')) {
        const fullName = fullNameInput.value.trim();
        if (fullName.length >= 3) {
            clearFieldError(fullNameInput);
        }
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('input-error')) {
        const email = emailInput.value.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            const users = getUsers();
            const emailExists = users.some(user => user.email === email);
            if (!emailExists) {
                clearFieldError(emailInput);
            }
        }
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('input-error')) {
        const password = passwordInput.value;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (password.length >= 8 && hasLetter && hasNumber) {
            clearFieldError(passwordInput);
            // Also check confirm password if it matches
            if (confirmPasswordInput.value &&
                confirmPasswordInput.value === password) {
                clearFieldError(confirmPasswordInput);
            }
        }
    }
});

confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordInput.classList.contains('input-error')) {
        if (confirmPasswordInput.value === passwordInput.value &&
            passwordInput.value !== '') {
            clearFieldError(confirmPasswordInput);
        }
    }
});

// ========== FORM SUBMIT HANDLER ==========

signupForm.addEventListener('submit', (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Clear all previous errors
    clearAllErrors(signupForm);

    // Get form values
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const company = document.getElementById('company').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation flags
    let isValid = true;

    // Validation rule 1: Full Name - at least 3 characters after trim
    if (fullName.length < 3) {
        showFieldError(fullNameInput, 'Full name must be at least 3 characters');
        isValid = false;
    }

    // Validation rule 2: Email - contains @ and dot after @
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    // Validation rule 3: Email duplicate check
    const users = getUsers();
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        showFieldError(emailInput, 'An account with this email already exists');
        isValid = false;
    }

    // Validation rule 4: Password - at least 8 chars, 1 letter, 1 number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (password.length < 8 || !hasLetter || !hasNumber) {
        showFieldError(passwordInput, 'Password must be at least 8 characters and contain a letter and a number');
        isValid = false;
    }

    // Validation rule 5: Confirm Password - must match password
    if (password !== confirmPassword) {
        showFieldError(confirmPasswordInput, 'Passwords do not match');
        isValid = false;
    }

    // If validation fails, stop here
    if (!isValid) {
        return;
    }

    // Create User object (P1.3)
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        password: password,
        company: company,
        createdAt: new Date().toISOString()
    };

    // Add user to array and save to localStorage
    users.push(newUser);
    saveUsers(users);

    // Show success toast
    showToast('Account created successfully! Please log in.', 'success');

    // Redirect to login page after 1.5 seconds (P1.3)
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});