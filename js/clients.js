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

// Get references to modal elements
const addClientModal = document.getElementById('add-client-modal');
const btnAddClient = document.getElementById('btn-add-client');
const btnCloseModal = document.getElementById('btn-close-modal');
const addClientForm = document.getElementById('add-client-form');

/**
 * Opens the add client modal
 */
function openAddClientModal() {
    addClientModal.showModal(); // Native HTML5 dialog method (PRD P4.4)
}

/**
 * Closes the add client modal and resets the form
 */
function closeAddClientModal() {
    addClientModal.close();
    addClientForm.reset();
    clearAllErrors(addClientForm); // Clear any validation errors
}

/**
 * Handles the submission of the new client form
 * @param {Event} event - Submit event
 */
async function handleAddClient(event) {
    event.preventDefault(); // Prevent default form submission

    // 1. Get form values
    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim().toLowerCase();
    const phone = document.getElementById('client-phone').value.trim();
    const company = document.getElementById('client-company').value.trim();
    const dealValue = Number(document.getElementById('client-deal').value);
    const status = document.getElementById('client-status').value;

    // 2. Validation (P4.4)
    let isValid = true;
    clearAllErrors(addClientForm);

    if (name.length < 3) {
        showFieldError(document.getElementById('client-name'), 'Name must be at least 3 characters');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError(document.getElementById('client-email'), 'Please enter a valid email address');
        isValid = false;
    } else {
        // Check for duplicate email in existing clients
        const emailExists = state.clients.some(client => client.email === email);
        if (emailExists) {
            showFieldError(document.getElementById('client-email'), 'A client with this email already exists');
            isValid = false;
        }
    }

    if (phone && phone.length < 6) {
        showFieldError(document.getElementById('client-phone'), 'Phone number looks too short');
        isValid = false;
    }

    if (isNaN(dealValue) || dealValue <= 0) {
        showFieldError(document.getElementById('client-deal'), 'Deal value must be a positive number');
        isValid = false;
    }

    if (!isValid) return; // Stop if validation fails

    // 3. Prepare data for API (DummyJSON expects specific fields)
    // We split the name to fake firstName and lastName for the API
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || 'Client';

    const newClientData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone || '+0000000000', // DummyJSON requires phone
        company: { name: company || 'Freelance' }, // DummyJSON expects company object
        status: status,
        dealValue: dealValue
    };

    try {
        // Show loading state on button (optional but good UX)
        const submitBtn = addClientForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;

        // 4. Send POST request to DummyJSON API
        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClientData)
        });

        if (!response.ok) {
            throw new Error('Failed to add client');
        }

        const apiResponse = await response.json();

        // 5. Transform API response into our Client model (P4.4)
        // Note: DummyJSON returns the added user. We adapt it to our structure.
        const mappedNewClient = {
            id: apiResponse.id,
            name: `${apiResponse.firstName} ${apiResponse.lastName}`,
            email: apiResponse.email,
            phone: apiResponse.phone,
            company: apiResponse.company.name,
            image: apiResponse.image || 'https://dummyjson.com/icon/user/128',
            status: status,
            dealValue: dealValue,
            notes: [],
            createdAt: new Date().toISOString()
        };

        // 6. THE GOLDEN CYCLE:
        // a) Update state (add to the BEGINNING of the array)
        state.clients.unshift(mappedNewClient);

        // b) Save to localStorage
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));

        // c) Re-render UI
        renderClients(state.clients);

        // 7. Success feedback
        showToast('Client added ✓', 'success');
        closeAddClientModal();

    } catch (error) {
        console.error('Error adding client:', error);
        showToast('Failed to add client. Please try again.', 'error');
    } finally {
        // Restore button state
        const submitBtn = addClientForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Save Client';
        submitBtn.disabled = false;
    }
}

// Attach event listeners for the modal
if (btnAddClient) btnAddClient.addEventListener('click', openAddClientModal);
if (btnCloseModal) btnCloseModal.addEventListener('click', closeAddClientModal);

// Close modal when clicking outside of it (bonus UX from PRD)
if (addClientModal) {
    addClientModal.addEventListener('click', (event) => {
        if (event.target === addClientModal) {
            closeAddClientModal();
        }
    });
}

// Attach form submit listener
if (addClientForm) {
    addClientForm.addEventListener('submit', handleAddClient);
}

// Set up event listeners
retryButton.addEventListener('click', initClientsPage);

// Event delegation: listen for clicks on the entire clients list container
clientsListContainer.addEventListener('click', handleDeleteClient);

// Initialize the page when the script loads
initClientsPage();