// Security utilities for safe DOM manipulation
class SecurityUtils {
    /**
     * Safely set text content without XSS risk
     * @param {HTMLElement} element - The element to set content for
     * @param {string} content - The content to set
     */
    static setSafeTextContent(element, content) {
        if (!element) return;
        element.textContent = content || '';
    }

    /**
     * Safely set innerHTML with basic XSS protection
     * @param {HTMLElement} element - The element to set content for
     * @param {string} content - The content to set
     */
    static setSafeInnerHTML(element, content) {
        if (!element) return;
        
        // Basic XSS protection - remove script tags and dangerous attributes
        const sanitized = content
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '');
            
        element.innerHTML = sanitized;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - The text to escape
     * @returns {string} - Escaped text
     */
    static escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number format
     * @param {string} phone - Phone to validate
     * @returns {boolean} - True if valid
     */
    static validatePhone(phone) {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Validate input to prevent XSS
     * @param {string} input - Input to validate
     * @returns {boolean} - True if safe
     */
    static isSafeInput(input) {
        if (!input) return true;
        
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /vbscript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i
        ];
        
        return !dangerousPatterns.some(pattern => pattern.test(input));
    }
}

// Make it globally available
window.SecurityUtils = SecurityUtils;