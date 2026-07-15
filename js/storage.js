// Storage utility functions for working with localStorage

// Get all registered users from localStorage
export function getUsers() {
    const users = localStorage.getItem('crm_users');
    return users ? JSON.parse(users) : [];
}

// Save users array to localStorage
export function saveUsers(users) {
    localStorage.setItem('crm_users', JSON.stringify(users));
}

// Get current session from localStorage
export function getSession() {
    const session = localStorage.getItem('crm_session');
    return session ? JSON.parse(session) : null;
}

// Save session to localStorage
export function saveSession(session) {
    localStorage.setItem('crm_session', JSON.stringify(session));
}

// Clear session (for logout)
export function clearSession() {
    localStorage.removeItem('crm_session');
}

// Get current theme from localStorage
export function getTheme() {
    return localStorage.getItem('crm_theme') || 'dark';
}

// Save theme to localStorage
export function saveTheme(theme) {
    localStorage.setItem('crm_theme', theme);
}