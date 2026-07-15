// UI utility functions for toast notifications

// Show toast notification
// type: 'success' (green) or 'error' (red)
// message: text to display
// duration: how long to show (default 3000ms)
export function showToast(message, type = 'success', duration = 3000) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add to page
    document.body.appendChild(toast);

    // Show with animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Show error message under input field
// inputElement: the input element
// message: error text to display
export function showFieldError(inputElement, message) {
    const errorSpan = inputElement.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
        inputElement.classList.add('input-error');
    }
}

// Clear error message from input field
// inputElement: the input element
export function clearFieldError(inputElement) {
    const errorSpan = inputElement.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = '';
        inputElement.classList.remove('input-error');
    }
}

// Clear all form errors
// form: the form element
export function clearAllErrors(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => clearFieldError(input));
}