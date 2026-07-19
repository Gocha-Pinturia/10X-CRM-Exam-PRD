// Responsive navigation for mobile devices

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Toggle sidebar on hamburger click
    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-open');
            overlay.classList.toggle('overlay-active');
        });

        // Close sidebar when clicking overlay
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('sidebar-open');
            overlay.classList.remove('overlay-active');
        });

        // Close sidebar when clicking a nav link
        const navLinks = sidebar.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('sidebar-open');
                overlay.classList.remove('overlay-active');
            });
        });
    }
});