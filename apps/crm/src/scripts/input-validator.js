// Input validation utility
class InputValidator {
    /**
     * Validate customer form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} - Validation result
     */
    static validateCustomerForm(formData) {
        const errors = {};
        
        // Validate full name
        if (!formData.fullName || formData.fullName.trim().length < 2) {
            errors.fullName = 'Tên phải có ít nhất 2 ký tự';
        }
        
        // Validate email
        if (formData.email && !SecurityUtils.validateEmail(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }
        
        // Validate phone
        if (formData.phone && !SecurityUtils.validatePhone(formData.phone)) {
            errors.phone = 'Số điện thoại phải có 10-11 chữ số';
        }
        
        // Validate tax code
        if (formData.taxCode && !/^[0-9]{10,13}$/.test(formData.taxCode)) {
            errors.taxCode = 'Mã số thuế phải có 10-13 chữ số';
        }
        
        // Validate revenue
        if (formData.revenue && (isNaN(formData.revenue) || formData.revenue < 0)) {
            errors.revenue = 'Doanh thu phải là số dương';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    /**
     * Validate task form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} - Validation result
     */
    static validateTaskForm(formData) {
        const errors = {};
        
        // Validate title
        if (!formData.title || formData.title.trim().length < 3) {
            errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        }
        
        // Validate description
        if (formData.description && formData.description.length > 1000) {
            errors.description = 'Mô tả không được quá 1000 ký tự';
        }
        
        // Validate deadline
        if (formData.deadline) {
            const deadline = new Date(formData.deadline);
            const now = new Date();
            if (deadline <= now) {
                errors.deadline = 'Deadline phải là thời gian trong tương lai';
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    /**
     * Validate user form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} - Validation result
     */
    static validateUserForm(formData) {
        const errors = {};
        
        // Validate email
        if (!formData.email || !SecurityUtils.validateEmail(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }
        
        // Validate password
        if (formData.password && formData.password.length < 8) {
            errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        
        // Validate full name
        if (!formData.fullName || formData.fullName.trim().length < 2) {
            errors.fullName = 'Tên phải có ít nhất 2 ký tự';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    /**
     * Sanitize input to prevent XSS
     * @param {string} input - Input to sanitize
     * @returns {string} - Sanitized input
     */
    static sanitizeInput(input) {
        if (!input) return '';
        
        return SecurityUtils.escapeHtml(input.toString());
    }
}

// Make it globally available
window.InputValidator = InputValidator;