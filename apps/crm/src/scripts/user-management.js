// User Management System
class UserManager {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.init();
    }

    init() {
        console.log('🔧 Khởi tạo User Management...');
        
        // Check if user has permission
        if (!authManager.isAdmin()) {
            alert('Bạn không có quyền truy cập trang này!');
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        this.loadUsers();
    }

    setupEventListeners() {
        // Filter listeners
        const roleFilter = document.getElementById('roleFilter');
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchInput');

        if (roleFilter) roleFilter.addEventListener('change', () => this.filterUsers());
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterUsers());
        if (searchInput) searchInput.addEventListener('input', () => this.filterUsers());
    }

    async loadUsers() {
        try {
            console.log('📋 Đang tải danh sách người dùng...');
            
            const snapshot = await db.collection('users').get();
            this.users = [];
            
            snapshot.forEach(doc => {
                this.users.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            this.filteredUsers = [...this.users];
            this.renderUsers();
            this.updateStats();
            
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
            alert('Lỗi khi tải danh sách người dùng!');
        }
    }

    filterUsers() {
        const roleFilter = document.getElementById('roleFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';

        this.filteredUsers = this.users.filter(user => {
            const matchesRole = !roleFilter || user.role === roleFilter;
            const matchesStatus = !statusFilter || user.status === statusFilter;
            const matchesSearch = !searchTerm || 
                user.fullName?.toLowerCase().includes(searchTerm) ||
                user.email?.toLowerCase().includes(searchTerm) ||
                user.phone?.includes(searchTerm);

            return matchesRole && matchesStatus && matchesSearch;
        });

        this.renderUsers();
    }

    renderUsers() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (this.filteredUsers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #6c757d;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Không có người dùng nào</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredUsers.map(user => `
            <tr>
                <td>
                    <div class="user-info-cell">
                        <div class="user-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-details">
                            <div class="user-name">${user.fullName || 'Chưa có tên'}</div>
                            <div class="user-email">${user.email}</div>
                            ${user.phone ? `<div class="user-phone">${user.phone}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="role-badge ${user.role}">${this.getRoleDisplayName(user.role)}</span>
                </td>
                <td>
                    <span class="status-badge ${user.status}">${this.getStatusDisplayName(user.status)}</span>
                </td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>${user.lastLogin ? this.formatDate(user.lastLogin) : 'Chưa đăng nhập'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-view" onclick="userManager.viewUser('${user.id}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-edit" onclick="userManager.editUser('${user.id}')" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${user.id !== authManager.currentUser?.uid ? `
                            <button class="btn btn-delete" onclick="userManager.deleteUser('${user.id}')" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');

        // Add CSS for user management
        this.addUserManagementStyles();
    }

    addUserManagementStyles() {
        if (document.getElementById('userManagementStyles')) return;

        const style = document.createElement('style');
        style.id = 'userManagementStyles';
        style.textContent = `
            .user-info-cell {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.1rem;
            }

            .user-details {
                flex: 1;
                min-width: 0;
            }

            .user-name {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 0.25rem;
            }

            .user-email {
                color: #6c757d;
                font-size: 0.9rem;
                margin-bottom: 0.25rem;
            }

            .user-phone {
                color: #6c757d;
                font-size: 0.85rem;
            }

            .role-badge {
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                text-align: center;
                display: inline-block;
                min-width: 100px;
            }

            .role-badge.admin {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                color: white;
            }

            .role-badge.manager {
                background: linear-gradient(135deg, #fd7e14 0%, #e55a00 100%);
                color: white;
            }

            .role-badge.accountant {
                background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
                color: white;
            }

            .role-badge.staff {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
            }

            .role-badge.agent {
                background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%);
                color: white;
            }

            .status-badge {
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                text-align: center;
                display: inline-block;
                min-width: 100px;
            }

            .status-badge.active {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
            }

            .status-badge.inactive {
                background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                color: white;
            }

            .status-badge.suspended {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                color: white;
            }

            .users-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.9rem;
            }

            .users-table th,
            .users-table td {
                padding: 1rem;
                text-align: left;
                border-bottom: 1px solid rgba(102, 126, 234, 0.1);
            }

            .users-table th {
                background: rgba(102, 126, 234, 0.05);
                font-weight: 600;
                color: #2c3e50;
            }

            .users-table tr:hover {
                background: rgba(102, 126, 234, 0.02);
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .user-info-cell {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    font-size: 1rem;
                }

                .role-badge,
                .status-badge {
                    padding: 0.25rem 0.75rem;
                    font-size: 0.8rem;
                    min-width: 80px;
                }

                .users-table th,
                .users-table td {
                    padding: 0.75rem 0.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    updateStats() {
        const totalUsers = this.users.length;
        const adminCount = this.users.filter(u => u.role === 'admin').length;
        const managerCount = this.users.filter(u => u.role === 'manager').length;
        const activeUsers = this.users.filter(u => u.status === 'active').length;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('adminCount').textContent = adminCount;
        document.getElementById('managerCount').textContent = managerCount;
        document.getElementById('activeUsers').textContent = activeUsers;
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

    getStatusDisplayName(status) {
        const statusNames = {
            'active': 'Đang hoạt động',
            'inactive': 'Không hoạt động',
            'suspended': 'Tạm khóa'
        };
        return statusNames[status] || 'Không xác định';
    }

    formatDate(date) {
        if (!date) return 'N/A';
        
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Modal Management
    showCreateUserModal() {
        document.getElementById('createUserModal').classList.add('show');
        document.getElementById('createUserForm').reset();
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    async handleCreateUser(event) {
        event.preventDefault();
        
        const email = document.getElementById('newUserEmail').value;
        const password = document.getElementById('newUserPassword').value;
        const fullName = document.getElementById('newUserFullName').value;
        const phone = document.getElementById('newUserPhone').value;
        const role = document.getElementById('newUserRole').value;
        const status = document.getElementById('newUserStatus').value;
        const notes = document.getElementById('newUserNotes').value;

        try {
            // Create user in Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Save user data to Firestore
            await db.collection('users').doc(user.uid).set({
                email: email,
                fullName: fullName,
                phone: phone,
                role: role,
                status: status,
                notes: notes,
                createdAt: new Date(),
                lastLogin: null,
                createdBy: authManager.currentUser.uid
            });

            alert('Tạo người dùng thành công!');
            this.closeModal('createUserModal');
            this.loadUsers();

        } catch (error) {
            console.error('Lỗi khi tạo người dùng:', error);
            alert('Lỗi khi tạo người dùng: ' + this.getErrorMessage(error.code));
        }
    }

    async handleEditUser(event) {
        event.preventDefault();
        
        const userId = document.getElementById('editUserId').value;
        const fullName = document.getElementById('editUserFullName').value;
        const phone = document.getElementById('editUserPhone').value;
        const role = document.getElementById('editUserRole').value;
        const status = document.getElementById('editUserStatus').value;
        const notes = document.getElementById('editUserNotes').value;

        try {
            await db.collection('users').doc(userId).update({
                fullName: fullName,
                phone: phone,
                role: role,
                status: status,
                notes: notes,
                updatedAt: new Date(),
                updatedBy: authManager.currentUser.uid
            });

            alert('Cập nhật người dùng thành công!');
            this.closeModal('editUserModal');
            this.loadUsers();

        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            alert('Lỗi khi cập nhật người dùng!');
        }
    }

    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        alert(`
Thông tin người dùng:
- Họ tên: ${user.fullName || 'Chưa có'}
- Email: ${user.email}
- Số điện thoại: ${user.phone || 'Chưa có'}
- Vai trò: ${this.getRoleDisplayName(user.role)}
- Trạng thái: ${this.getStatusDisplayName(user.status)}
- Ngày tạo: ${this.formatDate(user.createdAt)}
- Lần đăng nhập cuối: ${user.lastLogin ? this.formatDate(user.lastLogin) : 'Chưa đăng nhập'}
- Ghi chú: ${user.notes || 'Không có'}
        `);
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserFullName').value = user.fullName || '';
        document.getElementById('editUserPhone').value = user.phone || '';
        document.getElementById('editUserRole').value = user.role;
        document.getElementById('editUserStatus').value = user.status;
        document.getElementById('editUserNotes').value = user.notes || '';

        document.getElementById('editUserModal').classList.add('show');
    }

    async deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (userId === authManager.currentUser?.uid) {
            alert('Không thể xóa tài khoản của chính mình!');
            return;
        }

        const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.fullName}" (${user.email})?`);
        if (!confirmDelete) return;

        try {
            // Delete from Firestore
            await db.collection('users').doc(userId).delete();
            
            // Note: Firebase Auth user deletion requires admin SDK
            // For now, we'll just mark as deleted in Firestore
            await db.collection('users').doc(userId).set({
                status: 'deleted',
                deletedAt: new Date(),
                deletedBy: authManager.currentUser.uid
            }, { merge: true });

            alert('Xóa người dùng thành công!');
            this.loadUsers();

        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            alert('Lỗi khi xóa người dùng!');
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
        return errorMessages[errorCode] || 'Lỗi không xác định';
    }
}

// Initialize user manager
let userManager;
document.addEventListener('DOMContentLoaded', () => {
    userManager = new UserManager();
});
