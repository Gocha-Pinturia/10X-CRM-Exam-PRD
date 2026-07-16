// js/data.js

// Define storage keys as constants to avoid typos (DRY principle)
export const STORAGE_KEYS = {
    CLIENTS: 'crm_clients',
    USERS: 'crm_users',
    SESSION: 'crm_session',
    THEME: 'crm_theme'
};

const API_URL = 'https://dummyjson.com/users?limit=30';

/**
 * Loads clients from localStorage or fetches them from the API.
 * @returns {Promise<Array>} Array of client objects.
 */
export async function loadClientsData() {
    // 1. Check if data already exists in localStorage
    const storedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);

    if (storedClients) {
        // Parse and return existing data (no API call needed)
        return JSON.parse(storedClients);
    }

    try {
        // 2. Fetch data from DummyJSON API if localStorage is empty
        const response = await fetch(API_URL);

        // 3. Check if the response is successful (status 200-299)
        if (!response.ok) {
            throw new Error('Failed to fetch clients from API');
        }

        const data = await response.json();

        // 4. Transform API data into our Client object model (PRD 5.4)
        const mappedClients = data.users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            company: user.company.name,
            image: user.image,
            status: 'Lead', // Default status as per PRD
            dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500, // Random value between 500 and 10000
            notes: [],
            createdAt: new Date().toISOString()
        }));

        // 5. Save the transformed data to localStorage for future use
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(mappedClients));

        return mappedClients;

    } catch (error) {
        console.error('Error loading clients:', error);
        // Note: UI error handling (showing "Could not load clients") will be implemented in clients.js
        return [];
    }
}