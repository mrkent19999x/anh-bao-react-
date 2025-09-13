// Mobile Menu Setup - STANDARD VERSION (used by all pages)
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (menuToggle && sidebar && overlay) {
        // Toggle menu
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });

        // Close menu when clicking a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        });
    }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', setupMobileMenu); 