// Performance optimization utilities
class PerformanceOptimizer {
    constructor() {
        this.eventListeners = new Map();
        this.firestoreListeners = new Map();
    }

    /**
     * Add event listener with automatic cleanup tracking
     * @param {HTMLElement} element - Element to add listener to
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {string} id - Unique identifier for cleanup
     */
    addEventListener(element, event, handler, id) {
        if (!element || !event || !handler || !id) return;
        
        element.addEventListener(event, handler);
        
        if (!this.eventListeners.has(id)) {
            this.eventListeners.set(id, []);
        }
        
        this.eventListeners.get(id).push({ element, event, handler });
    }

    /**
     * Remove all event listeners for a given ID
     * @param {string} id - Unique identifier
     */
    removeEventListeners(id) {
        const listeners = this.eventListeners.get(id);
        if (!listeners) return;
        
        listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        this.eventListeners.delete(id);
    }

    /**
     * Add Firestore listener with automatic cleanup tracking
     * @param {Function} unsubscribe - Unsubscribe function
     * @param {string} id - Unique identifier for cleanup
     */
    addFirestoreListener(unsubscribe, id) {
        if (!unsubscribe || !id) return;
        
        this.firestoreListeners.set(id, unsubscribe);
    }

    /**
     * Remove Firestore listener
     * @param {string} id - Unique identifier
     */
    removeFirestoreListener(id) {
        const unsubscribe = this.firestoreListeners.get(id);
        if (unsubscribe) {
            unsubscribe();
            this.firestoreListeners.delete(id);
        }
    }

    /**
     * Cleanup all listeners
     */
    cleanup() {
        // Cleanup event listeners
        this.eventListeners.forEach((listeners, id) => {
            this.removeEventListeners(id);
        });
        
        // Cleanup Firestore listeners
        this.firestoreListeners.forEach((unsubscribe, id) => {
            this.removeFirestoreListener(id);
        });
    }

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} - Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Lazy load images
     * @param {string} selector - CSS selector for images
     */
    lazyLoadImages(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Optimize database queries with pagination
     * @param {Object} query - Firestore query
     * @param {number} limit - Number of documents per page
     * @param {Object} lastDoc - Last document for pagination
     * @returns {Object} - Optimized query
     */
    paginateQuery(query, limit = 20, lastDoc = null) {
        let optimizedQuery = query.limit(limit);
        
        if (lastDoc) {
            optimizedQuery = optimizedQuery.startAfter(lastDoc);
        }
        
        return optimizedQuery;
    }
}

// Create global instance
window.performanceOptimizer = new PerformanceOptimizer();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.performanceOptimizer.cleanup();
});