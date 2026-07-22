// js/dashboard.js

// Import necessary functions and constants
import { loadClientsData } from './data.js';

// Get DOM elements
const greetingElement = document.getElementById('greeting');
const clockElement = document.getElementById('live-clock');
const statTotalElement = document.getElementById('stat-total');
const statActiveElement = document.getElementById('stat-active');
const statWonElement = document.getElementById('stat-won');
const statNewElement = document.getElementById('stat-new');
const recentClientsList = document.getElementById('recent-clients-list');

// Pipeline elements
const pipelineLeadElement = document.getElementById('pipeline-lead');
const pipelineLeadCountElement = document.getElementById('pipeline-lead-count');
const pipelineContactedElement = document.getElementById('pipeline-contacted');
const pipelineContactedCountElement = document.getElementById('pipeline-contacted-count');
const pipelineWonElement = document.getElementById('pipeline-won');
const pipelineWonCountElement = document.getElementById('pipeline-won-count');
const pipelineLostElement = document.getElementById('pipeline-lost');
const pipelineLostCountElement = document.getElementById('pipeline-lost-count');

// Application state
let state = {
    clients: [],
    currentUser: null
};

/**
 * Updates the live clock every second
 */
function startLiveClock() {
    const updateClock = () => {
        const now = new Date();
        const dateString = now.toLocaleDateString();
        const timeString = now.toLocaleTimeString();
        clockElement.textContent = `${dateString} ${timeString}`;
    };

    updateClock(); // Update immediately
    setInterval(updateClock, 1000); // Then every second
}

/**
 * Extracts first name from full name
 * @param {string} fullName 
 * @returns {string}
 */
function getFirstName(fullName) {
    return fullName ? fullName.split(' ')[0] : 'User';
}

/**
 * Sets greeting with user's name
 */
function setGreeting() {
    const session = JSON.parse(localStorage.getItem('crm_session'));
    if (session && session.email) {
        const users = JSON.parse(localStorage.getItem('crm_users') || '[]');
        const user = users.find(u => u.email === session.email);

        if (user) {
            state.currentUser = user;
            const firstName = getFirstName(user.fullName);
            greetingElement.textContent = `Welcome back, ${firstName}!`;
        }
    }
}

/**
 * Calculates and displays statistics
 */
function calculateStats() {
    const clients = state.clients;

    // Total Clients
    statTotalElement.textContent = clients.length;

    // Active Deals (not Won or Lost)
    const activeDeals = clients.filter(c => c.status !== 'Won' && c.status !== 'Lost');
    statActiveElement.textContent = activeDeals.length;

    // Won Revenue (sum of dealValue for Won clients)
    const wonRevenue = clients
        .filter(c => c.status === 'Won')
        .reduce((sum, c) => sum + c.dealValue, 0);
    statWonElement.textContent = `$${wonRevenue.toLocaleString()}`;

    // New This Week (created in last 7 days)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const newThisWeek = clients.filter(c => {
        const createdAt = new Date(c.createdAt).getTime();
        return createdAt >= oneWeekAgo;
    });
    statNewElement.textContent = newThisWeek.length;
}

/**
 * Displays pipeline overview
 */
function displayPipeline() {
    const clients = state.clients;
    const total = clients.length || 1; // Avoid division by zero

    // Count by status
    const leadCount = clients.filter(c => c.status === 'Lead').length;
    const contactedCount = clients.filter(c => c.status === 'Contacted').length;
    const wonCount = clients.filter(c => c.status === 'Won').length;
    const lostCount = clients.filter(c => c.status === 'Lost').length;

    // Calculate percentages
    const leadPercent = (leadCount / total) * 100;
    const contactedPercent = (contactedCount / total) * 100;
    const wonPercent = (wonCount / total) * 100;
    const lostPercent = (lostCount / total) * 100;

    // Update counts
    pipelineLeadCountElement.textContent = leadCount;
    pipelineContactedCountElement.textContent = contactedCount;
    pipelineWonCountElement.textContent = wonCount;
    pipelineLostCountElement.textContent = lostCount;

    // Update bar widths
    pipelineLeadElement.style.width = `${leadPercent}%`;
    pipelineContactedElement.style.width = `${contactedPercent}%`;
    pipelineWonElement.style.width = `${wonPercent}%`;
    pipelineLostElement.style.width = `${lostPercent}%`;
}

/**
 * Displays recent clients (last 5)
 */
function displayRecentClients() {
    const clients = state.clients;

    if (clients.length === 0) {
        recentClientsList.innerHTML = '<p class="empty-state">No clients yet.</p>';
        return;
    }

    // Sort by createdAt descending and take first 5
    const recent = [...clients]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    recentClientsList.innerHTML = '';

    recent.forEach(client => {
        const clientDiv = document.createElement('div');
        clientDiv.className = 'recent-client-item';
        clientDiv.innerHTML = `
            <div class="client-info">
                <h4>${client.name}</h4>
                <p>${client.company}</p>
            </div>
            <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
            <span class="client-date">${new Date(client.createdAt).toLocaleDateString()}</span>
        `;
        recentClientsList.appendChild(clientDiv);
    });
}

/**
 * Initializes the dashboard page
 */
async function initDashboard() {
    try {
        // Load clients data
        const clients = await loadClientsData();
        state.clients = clients;

        // Set greeting with user name
        setGreeting();

        // Start live clock
        startLiveClock();

        // Calculate and display statistics
        calculateStats();

        // Display pipeline overview
        displayPipeline();

        // Display recent clients
        displayRecentClients();

    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        recentClientsList.innerHTML = '<p class="error-state">Failed to load data</p>';
    }
}

// Initialize dashboard when script loads
initDashboard();