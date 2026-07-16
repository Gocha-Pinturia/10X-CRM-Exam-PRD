// Layout logic: navigation rendering, active links, theme toggle, and logout

import { getSession, clearSession, getTheme, saveTheme } from './storage.js';
import { showToast } from './ui.js';
import { protectPage } from './guard.js';

// 1. Protect the page (P0.1)
protectPage();

// 2. Render navigation sidebar (P0.2)
function renderNavigation() {
    const navContainer = document.getElementById('main-nav');

    if (!navContainer) return; // If no container, exit

    const currentPage = window.location.pathname.split('/').pop();

    // Create navigation HTML
    navContainer.innerHTML = `
        <div class="logo">10X CRM</div>
        <nav>
            <a href="dashboard.html" class="nav-link ${currentPage === 'dashboard.html' ? 'active' : ''}">Dashboard</a>
            <a href="clients.html" class="nav-link ${currentPage === 'clients.html' ? 'active' : ''}">Clients</a>
            <a href="profile.html" class="nav-link ${currentPage === 'profile.html' ? 'active' : ''}">Profile</a>
        </nav>
        <div class="theme-toggle-container" style="margin-top: auto; padding: 12px 16px;">
            <button id="themeToggle" class="theme-btn" style="width: 100%; padding: 8px; background: #334155; color: white; border: none; border-radius: 6px; cursor: pointer;">
                🌙 Dark
            </button>
        </div>
        <button id="logoutBtn" class="logout-btn" style="margin-top: 8px; padding: 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Logout
        </button>
    `;
}

// Render the navigation
renderNavigation();

// 3. Theme Toggle Logic (P0.3)
const themeToggleBtn = document.getElementById('themeToggle');
const currentTheme = getTheme();

// Apply the saved theme on page load
if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
}

// Handle theme switch
if (themeToggleBtn) {
    // Set initial button text
    themeToggleBtn.textContent = currentTheme === 'light' ? '☀️ Light' : ' Dark';

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');

        // Check if light theme is now active
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'light' : 'dark';

        // Save to localStorage
        saveTheme(newTheme);

        // Update button text
        themeToggleBtn.textContent = isLight ? '☀️ Light' : '🌙 Dark';
    });
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
        }, 1500);
    });
}