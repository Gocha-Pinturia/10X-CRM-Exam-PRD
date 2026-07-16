// Layout logic: active navigation links, theme toggle, and logout

import { getSession, clearSession, getTheme, saveTheme } from './storage.js';
import { showToast } from './ui.js';
import { protectPage } from './guard.js';

// 1. Protect the page (P0.1)
// If no session, redirect to login immediately
protectPage();

// 2. Highlight the active navigation link (P0.2)
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});

// 3. Theme Toggle Logic (P0.3)
const themeToggleBtn = document.getElementById('themeToggle');
const currentTheme = getTheme();

// Apply the saved theme on page load
if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
}

// Handle theme switch
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');

        // Check if light theme is now active
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'light' : 'dark';

        // Save to localStorage
        saveTheme(newTheme);

        // Optional: update button icon/text if you have one
        themeToggleBtn.textContent = isLight ? '☀️ Light' : '🌙 Dark';
    });

    // Set initial button text
    themeToggleBtn.textContent = currentTheme === 'light' ? '☀️ Light' : '🌙 Dark';
}

// 4. Logout Logic (P0.2)
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Clear only the session, keep users and clients data
        clearSession();

        showToast('Logged out successfully', 'success');

        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    });
}