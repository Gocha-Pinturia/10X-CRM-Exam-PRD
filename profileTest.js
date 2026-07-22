// js/profile.js
import { STORAGE_KEYS } from './data.js';
import { showToast } from './ui.js';

// DOM Elements
const accountInfo = {
    fullName: document.getElementById('profile-full-name'),
    email: document.getElementById('profile-email'),
    company: document.getElementById('profile-company'),
    memberSince: document.getElementById('profile-member-since')
};

const editForm = {
    fullName: document.getElementById('edit-full-name'),
    company: document.getElementById('edit-company'),
    saveBtn: document.getElementById('btn-save-changes')
};

const passwordForm = {
    current: document.getElementById('current-password'),
    new: document.getElementById('new-password'),
    confirm: document.getElementById('confirm-password'),
    changeBtn: document.getElementById('btn-change-password')
};

const resetBtn = document.getElementById('btn-reset-data');

// Current user data
let currentUser = null;

/**
 * Loads current user data from session and crm_users
 */
function loadUserProfile() {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    currentUser = users.find(u => u.id === session.userId);

    if (!currentUser) {
        showToast('User not found', 'error');
        return;
    }

    // Display user info (P5.1)
    // document.getElementById('profile-avatar').textContent = initialsOf(users.fullName);
    accountInfo.fullName.textContent = currentUser.fullName;
    accountInfo.email.textContent = currentUser.email;
    accountInfo.company.textContent = currentUser.company || 'Not specified';
    accountInfo.memberSince.textContent = new Date(currentUser.createdAt).toLocaleDateString();

    // Pre-fill edit form
    editForm.fullName.value = currentUser.fullName;
    editForm.company.value = currentUser.company || '';
}

/**
 * Handles profile update (P5.2)
 */
function handleSaveChanges(event) {
    event.preventDefault();

    const fullName = editForm.fullName.value.trim();
    const company = editForm.company.value.trim();

    // Validation
    if (fullName.length < 3) {
        showToast('Full name must be at least 3 characters', 'error');
        return;
    }

    // Update user data
    currentUser.fullName = fullName;
    currentUser.company = company;

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Update session if needed
    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));
    if (session) {
        session.email = currentUser.email;
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    }

    // Re-load profile to update display
    loadUserProfile();

    showToast('Profile updated ✓', 'success');
}

/**
 * Handles password change (P5.3)
 */
function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = passwordForm.current.value;
    const newPassword = passwordForm.new.value;
    const confirmPassword = passwordForm.confirm.value;

    // Validation
    if (currentPassword !== currentUser.password) {
        showToast('Current password is incorrect', 'error');
        return;
    }

    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        showToast('Password must be at least 8 characters and contain a letter and a number', 'error');
        return;
    }

    if (newPassword === currentPassword) {
        showToast('New password must be different from the current one', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    // Update password
    currentUser.password = newPassword;

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Clear form
    passwordForm.current.value = '';
    passwordForm.new.value = '';
    passwordForm.confirm.value = '';

    showToast('Password changed ✓', 'success');
}

/**
 * Handles CRM data reset (P5.4)
 */
function handleResetData() {
    if (!confirm('Reset all CRM data? This will delete all clients and reload from API.')) {
        return;
    }

    // Delete clients data
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);

    // Reload from API
    fetch('https://dummyjson.com/users?limit=30')
        .then(response => response.json())
        .then(data => {
            const clients = data.users.map(user => ({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phone,
                company: user.company.name,
                image: user.image,
                status: 'Lead',
                dealValue: Math.floor(Math.random() * 9501) + 500,
                notes: [],
                createdAt: new Date().toISOString()
            }));

            localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
            showToast('CRM data reset successfully', 'success');

            // Redirect to clients page to see fresh data
            setTimeout(() => {
                window.location.href = 'clients.html';
            }, 1500);
        })
        .catch(error => {
            console.error('Error resetting data:', error);
            showToast('Failed to reset data', 'error');
        });
}

// Event Listeners
if (editForm.saveBtn) {
    editForm.saveBtn.addEventListener('click', handleSaveChanges);
}

if (passwordForm.changeBtn) {
    passwordForm.changeBtn.addEventListener('click', handleChangePassword);
}

if (resetBtn) {
    resetBtn.addEventListener('click', handleResetData);
}

// Initialize
loadUserProfile();