// Authentication management với phân quyền
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
        this.userPermissions = [];
        this.init();
    }

    init() {
        // Check if user is already logged in
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.loadUserData();
                this.redirectIfNeeded();
            } else {
                this.currentUser = null;
                this.userRole = null;
                this.userPermissions = [];
                this.redirectToLogin();
            }
        });

        // Setup login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Setup logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            this.currentUser = userCredential.user;
            await this.loadUserData();
        } catch (error) {
            errorMessage.textContent = this.getErrorMessage(error.code);
            errorMessage.classList.add('show');
        }
    }

    async handleLogout() {
        try {
            await auth.signOut();
            this.currentUser = null;
            this.userRole = null;
            this.userPermissions = [];
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async loadUserData() {
        if (!this.currentUser) return;

        try {
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                this.userRole = userData.role || 'staff';
                this.userPermissions = this.getPermissionsByRole(this.userRole);
                
                // Update UI with user data
                this.updateUserUI(userData);
                
                // Check page access
                this.checkPageAccess();
                
                // Update navigation based on role
                this.updateNavigation();
                
            } else {
                console.log('No user document found for:', this.currentUser.uid);
                // Create default user document
                await this.createDefaultUserDocument();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async createDefaultUserDocument() {
        try {
            await db.collection('users').doc(this.currentUser.uid).set({
                email: this.currentUser.email,
                fullName: this.currentUser.displayName || this.currentUser.email,
                role: 'staff', // Default role
                status: 'active',
                createdAt: new Date(),
                lastLogin: new Date()
            });
            
            this.userRole = 'staff';
            this.userPermissions = this.getPermissionsByRole('staff');
            this.updateNavigation();
        } catch (error) {
            console.error('Error creating default user document:', error);
        }
    }

    updateUserUI(userData) {
        const userNameElement = document.getElementById('userName');
        const userRoleElement = document.getElementById('userRole');
        
        if (userNameElement) {
            userNameElement.textContent = userData.fullName || this.currentUser.email;
        }
        
        if (userRoleElement) {
            userRoleElement.textContent = this.getRoleDisplayName(this.userRole);
        }
    }

    getRoleDisplayName(role) {
        const roleNames = {
            'admin': 'Quản trị viên',
            'manager': 'Quản lý',
            'accountant': 'Kế toán',
            'staff': 'Nhân viên',
            'agent': 'Công tác viên'
        };
        return roleNames[role] || 'Nhân viên';
    }

    getPermissionsByRole(role) {
        const permissions = {
            'admin': [
                'dashboard', 'customers', 'tasks', 'employees', 'documents', 
                'reports', 'chat', 'internal', 'settings', 'user_management',
                'financial_management', 'system_config'
            ],
            'manager': [
                'dashboard', 'customers', 'tasks', 'employees', 'documents', 
                'reports', 'chat', 'internal'
            ],
            'accountant': [
                'dashboard', 'customers', 'documents', 'reports', 'chat',
                'financial_management'
            ],
            'staff': [
                'dashboard', 'customers', 'tasks', 'documents', 'chat'
            ],
            'agent': [
                'dashboard', 'customers', 'tasks'
            ]
        };
        return permissions[role] || ['dashboard'];
    }

    checkPageAccess() {
        const currentPage = this.getCurrentPage();
        
        if (!this.hasPermission(currentPage)) {
            alert('Bạn không có quyền truy cập trang này!');
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        
        const pageMappings = {
            'index': 'dashboard',
            'customers': 'customers',
            'tasks': 'tasks',
            'employees': 'employees',
            'documents': 'documents',
            'reports': 'reports',
            'chat': 'chat',
            'internal': 'internal',
            'settings': 'settings'
        };
        
        return pageMappings[page] || 'dashboard';
    }

    hasPermission(page) {
        return this.userPermissions.includes(page);
    }

    updateNavigation() {
        // Hide/show navigation items based on permissions
        const navItems = {
            'customers': document.querySelector('a[href="customers.html"]'),
            'tasks': document.querySelector('a[href="tasks.html"]'),
            'employees': document.querySelector('a[href="employees.html"]'),
            'documents': document.querySelector('a[href="documents.html"]'),
            'reports': document.querySelector('a[href="reports.html"]'),
            'chat': document.querySelector('a[href="chat.html"]'),
            'internal': document.querySelector('a[href="internal.html"]')
        };

        Object.keys(navItems).forEach(page => {
            const navItem = navItems[page];
            if (navItem) {
                if (this.hasPermission(page)) {
                    navItem.style.display = 'flex';
                } else {
                    navItem.style.display = 'none';
                }
            }
        });

        // Update dashboard content based on role
        this.updateDashboardContent();
    }

    updateDashboardContent() {
        // Update dashboard stats and content based on user role
        const dashboard = document.querySelector('.dashboard');
        if (dashboard && this.userRole) {
            // Add role-specific welcome message
            const welcomeMsg = document.getElementById('welcomeMessage');
            if (welcomeMsg) {
                welcomeMsg.textContent = `Chào mừng ${this.getRoleDisplayName(this.userRole)}!`;
            }
        }
    }

    redirectIfNeeded() {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'login.html' || currentPage === '') {
            window.location.href = 'index.html';
        }
    }

    redirectToLogin() {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'login.html') {
            window.location.href = 'login.html';
        }
    }

    // Utility methods for other components
    getCurrentUserRole() {
        return this.userRole;
    }

    getCurrentUserPermissions() {
        return this.userPermissions;
    }

    isAdmin() {
        return this.userRole === 'admin';
    }

    isManager() {
        return this.userRole === 'manager' || this.userRole === 'admin';
    }

    isAccountant() {
        return this.userRole === 'accountant' || this.userRole === 'admin';
    }

    canManageUsers() {
        return this.userRole === 'admin' || this.userRole === 'manager';
    }

    canManageFinancial() {
        return this.userRole === 'admin' || this.userRole === 'accountant';
    }

    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'Email không tồn tại',
            'auth/wrong-password': 'Mật khẩu không đúng',
            'auth/invalid-email': 'Email không hợp lệ',
            'auth/too-many-requests': 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau',
            'auth/network-request-failed': 'Lỗi kết nối mạng',
            'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
            'auth/operation-not-allowed': 'Phương thức đăng nhập không được hỗ trợ'
        };
        return errorMessages[errorCode] || 'Đăng nhập thất bại';
    }
}

// Initialize authentication
const authManager = new AuthManager(); 