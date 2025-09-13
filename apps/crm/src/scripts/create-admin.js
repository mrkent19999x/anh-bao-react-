// Create Admin Account Script
class AdminCreator {
    constructor() {
        this.init();
    }

    init() {
        const createForm = document.getElementById('createAdminForm');
        if (createForm) {
            createForm.addEventListener('submit', (e) => this.handleCreateAdmin(e));
        }
    }

    async handleCreateAdmin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        
        const messageDiv = document.getElementById('message');
        const submitBtn = document.getElementById('submitBtn');
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang tạo...';
            
            // Tạo user trong Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Tạo document trong Firestore
            await db.collection('users').doc(user.uid).set({
                email: email,
                fullName: fullName,
                phone: phone,
                role: 'admin',
                status: 'active',
                createdAt: new Date(),
                lastLogin: new Date()
            });

            messageDiv.textContent = 'Tạo tài khoản admin thành công!';
            messageDiv.className = 'message success';

            // Clear form
            document.getElementById('createAdminForm').reset();

        } catch (error) {
            console.error('Error creating admin:', error);
            messageDiv.textContent = this.getErrorMessage(error.code);
            messageDiv.className = 'message error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Tạo Admin';
        }
    }

    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'Email đã được sử dụng',
            'auth/invalid-email': 'Email không hợp lệ',
            'auth/weak-password': 'Mật khẩu quá yếu (cần ít nhất 6 ký tự)',
            'auth/operation-not-allowed': 'Tạo tài khoản bị vô hiệu hóa',
            'auth/network-request-failed': 'Lỗi kết nối mạng'
        };
        return errorMessages[errorCode] || 'Lỗi tạo tài khoản: ' + errorCode;
    }
}

// Initialize admin creator
const adminCreator = new AdminCreator(); 