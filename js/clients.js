// js/clients.js

// Import the data loading function from the data module
import { loadClientsData } from './data.js';

// Get references to DOM elements we need to interact with
const clientsListContainer = document.getElementById('clients-list');
const loadingIndicator = document.getElementById('loading-indicator');
const errorIndicator = document.getElementById('error-indicator');
const retryButton = document.getElementById('btn-retry');

// Main application state - will hold our clients array
let state = {
    clients: []
};

/**
 * Renders the list of clients to the DOM.
 * @param {Array} clients - Array of client objects to render.
 */
function renderClients(clients) {
    // Clear the current list before rendering new data
    clientsListContainer.innerHTML = '';

    // If no clients, show empty state message (P4.3)
    if (clients.length === 0) {
        clientsListContainer.innerHTML = '<p class="empty-state">No clients found.</p>';
        return;
    }

    // Loop through each client and create a card
    clients.forEach(client => {
        // Create a card element for each client
        const card = document.createElement('div');
        card.className = 'client-card';
        card.dataset.id = client.id; // Store client ID for future interactions

        // Build the card's HTML content
        card.innerHTML = `
            <img src="${client.image}" alt="${client.name}" class="client-avatar">
            <div class="client-info">
                <h3 class="client-name">${client.name}</h3>
                <p class="client-company">${client.company}</p>
                <p class="client-email">${client.email}</p>
            </div>
            <div class="client-actions">
                <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
                <span class="deal-value">$${client.dealValue.toLocaleString()}</span>
                <button class="btn-delete" data-id="${client.id}">Delete</button>
            </div>
        `;

        // Add the card to the container
        clientsListContainer.appendChild(card);
    });
}

/**
 * Initializes the clients page: loads data and renders it.
 */
async function initClientsPage() {
    // Show loading state
    loadingIndicator.style.display = 'block';
    errorIndicator.style.display = 'none';
    clientsListContainer.innerHTML = '';

    try {
        // Load clients data (from localStorage or API)
        const clients = await loadClientsData();

        // Update application state
        state.clients = clients;

        // Hide loading indicator and render the data
        loadingIndicator.style.display = 'none';
        renderClients(clients);

    } catch (error) {
        // Handle any errors during data loading
        console.error('Failed to initialize clients page:', error);
        loadingIndicator.style.display = 'none';
        errorIndicator.style.display = 'block';
    }
}

// Set up event listeners
retryButton.addEventListener('click', initClientsPage);

// Initialize the page when the script loads
initClientsPage();