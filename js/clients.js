// js/clients.js

// Import necessary functions and constants from other modules
import { loadClientsData, STORAGE_KEYS } from './data.js';
import { showToast, showFieldError, clearAllErrors } from './ui.js'; // Added missing UI imports

// Get references to DOM elements we need to interact with
const clientsListContainer = document.getElementById('clients-list');
const loadingIndicator = document.getElementById('loading-indicator');
const errorIndicator = document.getElementById('error-indicator');
const retryButton = document.getElementById('btn-retry');

// Toolbar elements
const searchInput = document.getElementById('search-input');
const filterChipsContainer = document.getElementById('filter-chips');
const sortSelect = document.getElementById('sort-select');

// Modal elements
const addClientModal = document.getElementById('add-client-modal');
const btnAddClient = document.getElementById('btn-add-client');
const btnCloseModal = document.getElementById('btn-close-modal');
const addClientForm = document.getElementById('add-client-form');

// Unified application state (Fixed: removed duplicate declaration)
let state = {
    clients: [],
    searchQuery: '',
    filterStatus: 'All',
    sortBy: 'newest'
};

/**
 * Returns a filtered and sorted copy of the clients array.
 * Does NOT mutate the original state.clients array.
 * @returns {Array} Filtered and sorted clients.
 */
function getVisibleClients() {
    let visible = [...state.clients];

    // 1. Apply Status Filter
    if (state.filterStatus !== 'All') {
        visible = visible.filter(client => client.status === state.filterStatus);
    }

    // 2. Apply Search (by name or company)
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        visible = visible.filter(client =>
            client.name.toLowerCase().includes(query) ||
            client.company.toLowerCase().includes(query)
        );
    }

    // 3. Apply Sorting
    if (state.sortBy === 'name-asc') {
        visible.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.sortBy === 'deal-desc') {
        visible.sort((a, b) => b.dealValue - a.dealValue);
    } else {
        // Default: 'newest' (createdAt descending)
        visible.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return visible;
}

/**
 * Renders the list of clients to the DOM.
 * @param {Array} clients - Array of client objects to render.
 */
function renderClients(clients) {
    clientsListContainer.innerHTML = '';

    if (clients.length === 0) {
        clientsListContainer.innerHTML = '<p class="empty-state">No clients found.</p>';
        return;
    }

    clients.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.dataset.id = client.id;

        card.innerHTML = `
            <img src="${client.image}" alt="${client.name}" class="client-avatar">
            <div class="client-info">
                <h3 class="client-name">${client.name}</h3>
                <p class="client-company">${client.company}</p>
                <p class="client-email">${client.email}</p>
            </div>
            <div class="client-actions">
                <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
                <select class="status-select" data-id="${client.id}">
                    <option value="Lead" ${client.status === 'Lead' ? 'selected' : ''}>Lead</option>
                    <option value="Contacted" ${client.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                    <option value="Won" ${client.status === 'Won' ? 'selected' : ''}>Won</option>
                    <option value="Lost" ${client.status === 'Lost' ? 'selected' : ''}>Lost</option>
                </select>
                <span class="deal-value">$${client.dealValue.toLocaleString()}</span>
                <button class="btn-delete" data-id="${client.id}">Delete</button>
            </div>
        `;
        clientsListContainer.appendChild(card);
    });
}

/**
 * Initializes the clients page: loads data and renders it.
 */
async function initClientsPage() {
    loadingIndicator.style.display = 'block';
    errorIndicator.style.display = 'none';
    clientsListContainer.innerHTML = '';

    try {
        const clients = await loadClientsData();
        state.clients = clients; // Update state

        loadingIndicator.style.display = 'none';
        renderClients(getVisibleClients()); // Render with current filters/sort

    } catch (error) {
        console.error('Failed to initialize clients page:', error);
        loadingIndicator.style.display = 'none';
        errorIndicator.style.display = 'block';
    }
}

/**
 * Handles search input changes
 */
function handleSearchInput(event) {
    state.searchQuery = event.target.value;
    renderClients(getVisibleClients());
}

/**
 * Handles filter chip clicks
 */
function handleFilterClick(event) {
    const chip = event.target.closest('.chip');
    if (!chip) return;

    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    state.filterStatus = chip.dataset.status;
    renderClients(getVisibleClients());
}

/**
 * Handles sort select changes
 */
function handleSortChange(event) {
    state.sortBy = event.target.value;
    renderClients(getVisibleClients());
}

/**
 * Opens the add client modal
 */
function openAddClientModal() {
    if (addClientModal) addClientModal.showModal();
}

/**
 * Closes the add client modal and resets the form
 */
function closeAddClientModal() {
    if (addClientModal) {
        addClientModal.close();
        addClientForm.reset();
        clearAllErrors(addClientForm); // Now works because it's imported
    }
}

/**
 * Handles the submission of the new client form (The Golden Cycle)
 * @param {Event} event - Submit event
 */
async function handleAddClient(event) {
    event.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim().toLowerCase();
    const phone = document.getElementById('client-phone').value.trim();
    const company = document.getElementById('client-company').value.trim();
    const dealValue = Number(document.getElementById('client-deal').value);
    const status = document.getElementById('client-status').value;

    let isValid = true;
    clearAllErrors(addClientForm);

    // Validation (PRD P4.4)
    if (name.length < 3) {
        showFieldError(document.getElementById('client-name'), 'Name must be at least 3 characters');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError(document.getElementById('client-email'), 'Please enter a valid email address');
        isValid = false;
    } else {
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

    if (!isValid) return;

    const nameParts = name.split(' ');
    const newClientData = {
        firstName: nameParts[0] || 'Unknown',
        lastName: nameParts.slice(1).join(' ') || 'Client',
        email: email,
        phone: phone || '+0000000000',
        company: { name: company || 'Freelance' },
        status: status,
        dealValue: dealValue
    };

    try {
        const submitBtn = addClientForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;

        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClientData)
        });

        if (!response.ok) throw new Error('Failed to add client');
        const apiResponse = await response.json();

        // Transform API response into our Client model
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

        // THE GOLDEN CYCLE:
        // 1. Update state (add to the BEGINNING of the array)
        state.clients.unshift(mappedNewClient);

        // 2. Save to localStorage
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));

        // 3. Re-render UI WITH FILTERS/SORT PRESERVED (Fixed bug)
        renderClients(getVisibleClients());

        showToast('Client added ✓', 'success');
        closeAddClientModal();

    } catch (error) {
        console.error('Error adding client:', error);
        showToast('Failed to add client. Please try again.', 'error');
    } finally {
        const submitBtn = addClientForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Save Client';
        submitBtn.disabled = false;
    }
}

/**
 * Handles delete button click - removes client from state and localStorage
 * @param {Event} event - Click event
 */
async function handleDeleteClient(event) {
    const deleteButton = event.target.closest('.btn-delete');
    if (!deleteButton) return;

    const clientId = parseInt(deleteButton.dataset.id);
    const confirmed = confirm('Delete this client? This cannot be undone.');

    if (!confirmed) return;

    try {
        await fetch(`https://dummyjson.com/users/${clientId}`, { method: 'DELETE' });

        // Remove from state regardless of API response (handles DummyJSON 404 quirk)
        state.clients = state.clients.filter(client => client.id !== clientId);
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));

        renderClients(getVisibleClients());
        showToast('Client deleted', 'success');

    } catch (error) {
        console.error('Error deleting client:', error);
        showToast('Failed to delete client', 'error');
    }
}

// --- Event Listeners Attachment ---
if (searchInput) searchInput.addEventListener('input', handleSearchInput);
if (filterChipsContainer) filterChipsContainer.addEventListener('click', handleFilterClick);
if (sortSelect) sortSelect.addEventListener('change', handleSortChange);

if (btnAddClient) btnAddClient.addEventListener('click', openAddClientModal);
if (btnCloseModal) btnCloseModal.addEventListener('click', closeAddClientModal);

if (addClientModal) {
    addClientModal.addEventListener('click', (event) => {
        if (event.target === addClientModal) closeAddClientModal();
    });
}

if (addClientForm) addClientForm.addEventListener('submit', handleAddClient);
if (retryButton) retryButton.addEventListener('click', initClientsPage);

// Event delegation for delete buttons
clientsListContainer.addEventListener('click', handleDeleteClient);

// Client Details Modal Logic (P4.8)
const clientDetailsModal = document.getElementById('client-details-modal');
const btnCloseDetails = document.getElementById('btn-close-details');
const detailsAvatar = document.getElementById('details-avatar');
const detailsName = document.getElementById('details-name');
const detailsCompany = document.getElementById('details-company');
const detailsEmail = document.getElementById('details-email');
const detailsPhone = document.getElementById('details-phone');
const detailsStatus = document.getElementById('details-status');
const detailsDeal = document.getElementById('details-deal');
const detailsSince = document.getElementById('details-since');
const notesList = document.getElementById('notes-list');
const noteInput = document.getElementById('note-input');
const btnAddNote = document.getElementById('btn-add-note');
const btnRemind = document.getElementById('btn-remind');

// Track currently viewed client for notes/reminders
let currentViewedClientId = null;

/**
 * Opens client details modal and populates with client data
 * @param {number} clientId - ID of the client to display
 */
function openClientDetails(clientId) {
    // Find client in state
    const client = state.clients.find(c => c.id === clientId);
    if (!client) return;

    // Store current client ID for notes/reminders
    currentViewedClientId = clientId;

    // Populate modal fields
    detailsAvatar.src = client.image;
    detailsAvatar.alt = client.name;
    detailsName.textContent = client.name;
    detailsCompany.textContent = client.company;
    detailsEmail.textContent = client.email;
    detailsPhone.textContent = client.phone;
    detailsStatus.textContent = `Status: ${client.status}`;
    detailsDeal.textContent = `Deal Value: $${client.dealValue.toLocaleString()}`;
    detailsSince.textContent = `Client since ${new Date(client.createdAt).toLocaleDateString()}`;

    // Render notes
    renderNotes(client.notes || []);

    // Open modal
    clientDetailsModal.showModal();
}

/**
 * Renders notes list in the modal
 * @param {Array} notes - Array of note objects
 */
function renderNotes(notes) {
    if (notes.length === 0) {
        notesList.innerHTML = '<p class="text-muted">No notes yet.</p>';
        return;
    }

    // Show newest first
    const sortedNotes = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));

    notesList.innerHTML = sortedNotes.map(note => `
        <div class="note-item">
            <p class="note-text">${escapeHtml(note.text)}</p>
            <p class="note-date text-muted">${note.date}</p>
        </div>
    `).join('');
}

/**
 * Escapes HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Handles adding a new note to the current client
 */
function handleAddNote() {
    const noteText = noteInput.value.trim();

    // Validation: empty note not allowed
    if (!noteText) {
        showToast('Note cannot be empty', 'error');
        return;
    }

    // Find client and add note
    const client = state.clients.find(c => c.id === currentViewedClientId);
    if (!client) return;

    // Initialize notes array if it doesn't exist
    if (!client.notes) client.notes = [];

    // Add new note
    const newNote = {
        text: noteText,
        date: new Date().toLocaleString()
    };
    client.notes.push(newNote);

    // Save to localStorage (Golden Cycle)
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));

    // Re-render notes list
    renderNotes(client.notes);

    // Clear input
    noteInput.value = '';

    showToast('Note added ✓', 'success');
}

/**
 * Sets a reminder for the current client (1 minute)
 */
function handleSetReminder() {
    const client = state.clients.find(c => c.id === currentViewedClientId);
    if (!client) return;

    showToast('Reminder set ✓', 'success');

    // Show follow-up toast after 60 seconds
    setTimeout(() => {
        showToast(`⏰ Follow up: ${client.name}`, 'info');
    }, 60000);
}

// Event listeners for details modal
if (btnCloseDetails) {
    btnCloseDetails.addEventListener('click', () => {
        clientDetailsModal.close();
    });
}

clientDetailsModal.addEventListener('click', (event) => {
    if (event.target === clientDetailsModal) clientDetailsModal.close();
})

if (btnAddNote) {
    btnAddNote.addEventListener('click', handleAddNote);
}

if (btnRemind) {
    btnRemind.addEventListener('click', handleSetReminder);
}

// Event delegation for card clicks (P4.8)
clientsListContainer.addEventListener('click', handleCardClick);

/**
 * Handles click on client card to open details modal
 * Uses event delegation on clientsListContainer
 * @param {Event} event - Click event
 */
function handleCardClick(event) {
    // 1. Check if click was on delete button (or its child) - ignore
    if (event.target.closest('.btn-delete')) return;

    // 2. Check if click was on status select - ignore
    if (event.target.closest('.status-select')) return;

    // 3. Find the closest client card
    const card = event.target.closest('.client-card');

    // 4. If no card found (clicked outside), exit
    if (!card) return;

    // 5. Get client ID from data-id attribute
    const clientId = Number(card.dataset.id);

    // 6. Open details modal
    openClientDetails(clientId);
}

/**
 * Handles status change on client card
 * Updates client status in state, localStorage, and re-renders
 * @param {Event} event - Change event from select element
 */
function handleStatusChange(event) {
    const select = event.target.closest('.status-select');
    if (!select) return;

    const clientId = Number(select.dataset.id);
    const newStatus = select.value;

    // Find client and update status
    const client = state.clients.find(c => c.id === clientId);
    if (!client) return;

    client.status = newStatus;

    // Save to localStorage (Golden Cycle)
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));

    // Re-render to update badge
    renderClients(getVisibleClients());

    showToast(`Status updated to ${newStatus}`, 'success');
}

// Initialize the page
initClientsPage();

// Event delegation for status change (P4.6)
clientsListContainer.addEventListener('change', handleStatusChange);