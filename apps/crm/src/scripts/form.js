// Form Handler for Customer Information
class CustomerForm {
    constructor() {
        this.formId = null;
        this.createdBy = null;
        this.init();
    }

    async init() {
        try {
            // Get form ID from URL
            this.formId = this.getFormIdFromUrl();
            if (!this.formId) {
                this.showError('Form ID không hợp lệ');
                return;
            }

            // Display form ID
            document.getElementById('formId').textContent = this.formId;

            // Load form data from Firestore
            await this.loadFormData();

            // Setup event listeners
            this.setupEventListeners();

            // Hide loading screen
            this.hideLoading();

        } catch (error) {
            console.error('Error initializing form:', error);
            this.showError('Lỗi khi tải form');
        }
    }

    getFormIdFromUrl() {
        const path = window.location.pathname;
        const match = path.match(/\/form\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    async loadFormData() {
        try {
            // Check if form exists in Firestore
            const formDoc = await db.collection('forms').doc(this.formId).get();
            
            if (!formDoc.exists) {
                this.showError('Form không tồn tại hoặc đã hết hạn');
                return;
            }

            const formData = formDoc.data();
            this.createdBy = formData.createdBy;

            // Check if form is still active
            if (formData.status === 'expired' || formData.status === 'completed') {
                this.showError('Form này đã hết hạn hoặc đã hoàn thành');
                return;
            }

        } catch (error) {
            console.error('Error loading form data:', error);
            this.showError('Lỗi khi tải thông tin form');
        }
    }

    setupEventListeners() {
        const form = document.getElementById('customerForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Add validation listeners
        this.addValidationListeners();
    }

    addValidationListeners() {
        // Phone number validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.validatePhone(e.target.value);
            });
        }

        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                this.validateEmail(e.target.value);
            });
        }

        // Required field validation
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', (e) => {
                this.validateRequired(e.target);
            });
        });
    }

    validatePhone(phone) {
        const phoneRegex = /^[0-9]{10,11}$/;
        const isValid = phoneRegex.test(phone);
        this.toggleFieldError('phone', !isValid && phone.length > 0);
        return isValid;
    }

    validateEmail(email) {
        if (!email) return true; // Email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        this.toggleFieldError('email', !isValid);
        return isValid;
    }

    validateRequired(field) {
        const isValid = field.value.trim().length > 0;
        this.toggleFieldError(field.id, !isValid);
        return isValid;
    }

    toggleFieldError(fieldId, showError) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        if (showError) {
            formGroup.classList.add('error');
            if (!formGroup.querySelector('.error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${this.getErrorMessage(fieldId)}`;
                formGroup.appendChild(errorMsg);
            }
        } else {
            formGroup.classList.remove('error');
            const errorMsg = formGroup.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    }

    getErrorMessage(fieldId) {
        const messages = {
            'fullName': 'Vui lòng nhập họ và tên',
            'phone': 'Số điện thoại không hợp lệ (10-11 số)',
            'email': 'Email không hợp lệ',
            'services': 'Vui lòng chọn ít nhất một dịch vụ'
        };
        return messages[fieldId] || 'Trường này không hợp lệ';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Disable submit button
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';

        try {
            // Collect form data
            const formData = this.collectFormData();

            // Save to Firestore
            await this.saveFormData(formData);

            // Show success message
            this.showSuccess();

        } catch (error) {
            console.error('Error submitting form:', error);
            this.showError('Lỗi khi gửi form. Vui lòng thử lại.');
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi thông tin';
        }
    }

    validateForm() {
        let isValid = true;

        // Validate required fields
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateRequired(field)) {
                isValid = false;
            }
        });

        // Validate phone
        const phone = document.getElementById('phone').value;
        if (!this.validatePhone(phone)) {
            isValid = false;
        }

        // Validate email if provided
        const email = document.getElementById('email').value;
        if (email && !this.validateEmail(email)) {
            isValid = false;
        }

        // Validate services
        const services = document.querySelectorAll('input[name="services"]:checked');
        if (services.length === 0) {
            this.toggleFieldError('services', true);
            isValid = false;
        }

        return isValid;
    }

    collectFormData() {
        const form = document.getElementById('customerForm');
        const formData = new FormData(form);

        // Collect checkbox values
        const services = [];
        document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
            services.push(checkbox.value);
        });

        // Collect radio value
        const contactMethod = document.querySelector('input[name="contactMethod"]:checked')?.value || 'phone';

        return {
            formId: this.formId,
            createdBy: this.createdBy,
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            idNumber: formData.get('idNumber'),
            address: formData.get('address'),
            companyName: formData.get('companyName'),
            taxCode: formData.get('taxCode'),
            businessType: formData.get('businessType'),
            revenue: parseFloat(formData.get('revenue')) || 0,
            services: services,
            urgency: formData.get('urgency'),
            description: formData.get('description'),
            contactMethod: contactMethod,
            preferredTime: formData.get('preferredTime'),
            status: 'Đã tiếp nhận',
            submittedAt: new Date(),
            ipAddress: this.getClientIP(),
            userAgent: navigator.userAgent
        };
    }

    async saveFormData(formData) {
        try {
            // Save customer data
            const customerRef = await db.collection('customers').add({
                ...formData,
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: this.createdBy,
                customerType: formData.businessType || 'individual',
                isActive: true
            });

            // Update form status
            await db.collection('forms').doc(this.formId).update({
                status: 'completed',
                customerId: customerRef.id,
                completedAt: new Date()
            });

            // Create initial task
            await db.collection('tasks').add({
                title: `Xử lý hồ sơ khách hàng: ${formData.fullName}`,
                description: `Hồ sơ mới từ form ${this.formId}`,
                customerId: customerRef.id,
                assignedTo: this.createdBy,
                status: 'pending',
                priority: this.getPriorityFromUrgency(formData.urgency),
                deadline: this.calculateDeadline(formData.urgency),
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Create initial conversation
            const conversationRef = await db.collection('conversations').add({
                title: `Hỗ trợ khách hàng: ${formData.fullName}`,
                type: 'customer',
                customerId: customerRef.id,
                participants: [this.createdBy],
                lastMessage: 'Hồ sơ đã được tiếp nhận',
                updatedAt: new Date(),
                createdAt: new Date()
            });

            // Add initial bot message
            await db.collection('messages').add({
                conversationId: conversationRef.id,
                senderId: 'bot',
                senderName: 'Hệ thống',
                text: 'Hồ sơ của bạn đã được tiếp nhận, chúng tôi sẽ xử lý trong thời gian sớm nhất.',
                timestamp: new Date(),
                status: 'sent'
            });

            return customerRef.id;

        } catch (error) {
            console.error('Error saving form data:', error);
            throw error;
        }
    }

    getPriorityFromUrgency(urgency) {
        const priorities = {
            'low': 'low',
            'medium': 'medium',
            'high': 'high',
            'urgent': 'high'
        };
        return priorities[urgency] || 'medium';
    }

    calculateDeadline(urgency) {
        const now = new Date();
        const deadlines = {
            'low': new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
            'medium': new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
            'high': new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day
            'urgent': new Date(now.getTime() + 6 * 60 * 60 * 1000) // 6 hours
        };
        return deadlines[urgency] || deadlines['medium'];
    }

    getClientIP() {
        // This is a placeholder - in production, you'd get this from server
        return 'unknown';
    }

    showSuccess() {
        const form = document.getElementById('customerForm');
        const successMessage = document.getElementById('successMessage');
        
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Display submitted form ID
        document.getElementById('submittedFormId').textContent = this.formId;
    }

    showError(message) {
        // Hide loading screen first
        this.hideLoading();
        
        // Show error message
        const formContainer = document.querySelector('.form-container');
        formContainer.innerHTML = `
            <div class="error-container">
                <div class="error-card">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Lỗi</h3>
                    <p>${message}</p>
                    <button onclick="window.history.back()" class="btn-back">
                        <i class="fas fa-arrow-left"></i>
                        Quay lại
                    </button>
                </div>
            </div>
        `;
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
}

// Initialize form when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CustomerForm();
});

// Add error styles to CSS
const errorStyles = `
    .error-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .error-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 3rem;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
    }
    
    .error-icon {
        font-size: 4rem;
        color: #dc3545;
        margin-bottom: 1rem;
    }
    
    .error-card h3 {
        color: #2c3e50;
        font-size: 1.8rem;
        margin-bottom: 1rem;
    }
    
    .error-card p {
        color: #6c757d;
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
    }
    
    .btn-back {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .btn-back:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
`;

// Inject error styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet); 