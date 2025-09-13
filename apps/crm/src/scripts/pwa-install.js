// PWA Installation Handler
class PWAInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.init();
    }

    init() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', (evt) => {
            console.log('PWA installed successfully');
            this.hideInstallButton();
            this.showSuccessMessage();
        });

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('PWA already installed');
            this.hideInstallButton();
        }
    }

    createInstallButton() {
        // Remove existing button if any
        const existingButton = document.getElementById('pwa-install-button');
        if (existingButton) {
            existingButton.remove();
        }

        // Create install button
        const button = document.createElement('div');
        button.id = 'pwa-install-button';
        button.className = 'pwa-install-button';
        button.innerHTML = `
            <div class="pwa-install-content">
                <i class="fas fa-download"></i>
                <span>Cài đặt App</span>
            </div>
        `;

        // Add click event
        button.addEventListener('click', () => {
            this.installPWA();
        });

        // Add to page
        document.body.appendChild(button);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (button && button.parentNode) {
                button.classList.add('fade-out');
                setTimeout(() => {
                    if (button && button.parentNode) {
                        button.remove();
                    }
                }, 500);
            }
        }, 10000);

        return button;
    }

    showInstallButton() {
        this.installButton = this.createInstallButton();
        
        // Add CSS if not exists
        if (!document.getElementById('pwa-install-styles')) {
            const style = document.createElement('style');
            style.id = 'pwa-install-styles';
            style.textContent = `
                .pwa-install-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                    z-index: 10000;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-weight: 600;
                    font-size: 14px;
                    border: none;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .pwa-install-button:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
                }

                .pwa-install-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pwa-install-content i {
                    font-size: 16px;
                }

                .pwa-install-button.fade-out {
                    opacity: 0;
                    transform: translateY(20px);
                }

                @media (max-width: 768px) {
                    .pwa-install-button {
                        bottom: 15px;
                        right: 15px;
                        padding: 12px 16px;
                        font-size: 13px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideInstallButton() {
        if (this.installButton && this.installButton.parentNode) {
            this.installButton.remove();
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            return;
        }

        try {
            // Show the install prompt
            this.deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.showSuccessMessage();
            } else {
                console.log('User dismissed the install prompt');
            }

            // Clear the deferredPrompt
            this.deferredPrompt = null;
            this.hideInstallButton();

        } catch (error) {
            console.error('Error installing PWA:', error);
        }
    }

    showSuccessMessage() {
        // Create success message
        const message = document.createElement('div');
        message.className = 'pwa-success-message';
        message.innerHTML = `
            <div class="pwa-success-content">
                <i class="fas fa-check-circle"></i>
                <span>App đã được cài đặt thành công!</span>
            </div>
        `;

        // Add CSS if not exists
        if (!document.getElementById('pwa-success-styles')) {
            const style = document.createElement('style');
            style.id = 'pwa-success-styles';
            style.textContent = `
                .pwa-success-message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
                    z-index: 10001;
                    animation: slideInRight 0.5s ease-out;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-weight: 600;
                    font-size: 14px;
                }

                .pwa-success-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pwa-success-content i {
                    font-size: 18px;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @media (max-width: 768px) {
                    .pwa-success-message {
                        top: 15px;
                        right: 15px;
                        padding: 12px 16px;
                        font-size: 13px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(message);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (message && message.parentNode) {
                message.style.animation = 'slideOutRight 0.5s ease-in';
                setTimeout(() => {
                    if (message && message.parentNode) {
                        message.remove();
                    }
                }, 500);
            }
        }, 3000);
    }
}

// Initialize PWA Install Manager
let pwaInstallManager;
document.addEventListener('DOMContentLoaded', () => {
    pwaInstallManager = new PWAInstallManager();
});

// Export for global access
window.PWAInstallManager = PWAInstallManager; 