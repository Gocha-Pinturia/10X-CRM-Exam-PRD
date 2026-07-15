// Auth Guard - controls access to protected and public pages (P0.1)
import { getSession } from './storage.js';

// Check if user is logged in
export function isLoggedIn() {
    return getSession() !== null;
}

// Protect private pages (dashboard, clients, profile)
// If no session -> redirect to login
export function protectPage() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
    }
}

// Redirect logged-in users away from public pages (login, signup)
// If session exists -> redirect to dashboard
export function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
}