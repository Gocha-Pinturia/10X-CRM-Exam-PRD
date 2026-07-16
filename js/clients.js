// js/clients.js

// Import necessary functions and constants from other modules
import { loadClientsData, STORAGE_KEYS } from './data.js';
import { showToast } from './ui.js';

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

    // If no clients, show empty state message (PRD P4.3)
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

/**
 * Handles delete button click - removes client from state and localStorage
 * @param {Event} event - Click event
 */
async function handleDeleteClient(event) {
    // Find the closest button with class 'btn-delete' (handles clicks on child elements)
    const deleteButton = event.target.closest('.btn-delete');

    // If clicked element is not a delete button, exit
    if (!deleteButton) return;

    // Get client ID from data-id attribute
    const clientId = parseInt(deleteButton.dataset.id);

    // Show confirmation dialog (PRD P4.5)
    const confirmed = confirm('Delete this client? This cannot be undone.');

    if (!confirmed) return;

    try {
        // Send DELETE request to DummyJSON API (PRD P4.5)
        const response = await fetch(`https://dummyjson.com/users/${clientId}`, {
            method: 'DELETE'
        });

        // Note: DummyJSON may return 404 for our added clients (it doesn't actually save them)
        // But we still remove from state regardless of response status

        // Remove client from state array using filter()
        state.clients = state.clients.filter(client => client.id !== clientId);

        // Save updated state to localStorage using imported constant
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));

        // Re-render the list
        renderClients(state.clients);

        // Show success toast notification (PRD P0.4)
        showToast('Client deleted', 'success');

    } catch (error) {
        console.error('Error deleting client:', error);
        showToast('Failed to delete client', 'error');
    }
}

// Set up event listeners
retryButton.addEventListener('click', initClientsPage);

// Event delegation: listen for clicks on the entire clients list container
clientsListContainer.addEventListener('click', handleDeleteClient);

// Initialize the page when the script loads
initClientsPage();