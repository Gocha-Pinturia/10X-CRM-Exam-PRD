// js/ui.js

/**
 * Shows a toast notification message
 * @param {string} message - Text to display
 * @param {string} type - 'success' (green) or 'error' (red)
 */
export function showToast(message, type = 'success') {
    // 1. Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');

    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // 2. Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // 3. Build toast HTML
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
    `;

    // 4. Add toast to container
    toastContainer.appendChild(toast);

    // 5. Trigger animation (small delay is REQUIRED for CSS transition to work)
    setTimeout(() => {
        toast.classList.add('toast-visible');
    }, 10);

    // 6. Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });

    // 7. Auto-remove after 3 seconds (PRD P0.4)
    setTimeout(() => {
        removeToast(toast);
    }, 3000);
}

/**
 * Removes a toast element with animation
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hiding');

    // Remove from DOM after animation completes (300ms matches CSS transition)
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Shows an error message for a specific form field
 * @param {HTMLInputElement} input - The input element
 * @param {string} message - Error message to display
 */
export function showFieldError(input, message) {
    // Add error class to input
    input.classList.add('input-error');

    // Find the error message span (next sibling or specific class)
    // Based on your HTML structure: <span class="error-message"></span> is right after input
    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

/**
 * Clears the error message and styling for a specific form field
 * @param {HTMLInputElement} input - The input element
 */
export function clearFieldError(input) {
    input.classList.remove('input-error');

    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = '';
    }
}

/**
 * Clears all errors in a form
 * @param {HTMLFormElement} form - The form element
 */
export function clearAllErrors(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        clearFieldError(input);
    });
}