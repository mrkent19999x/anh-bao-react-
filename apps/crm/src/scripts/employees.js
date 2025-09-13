// Employees Management
class EmployeesManager {
    constructor() {
        this.employees = [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadEmployees();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchEmployee');
        const roleFilter = document.getElementById('roleFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterAndRender());
        }
        if (roleFilter) {
            roleFilter.addEventListener('change', () => this.filterAndRender());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterAndRender());
        }

        const form = document.getElementById('employeeForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const modal = document.getElementById('employeeModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeEmployeeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEmployeeModal();
            }
        });
    }

    async loadEmployees() {
        try {
            const snapshot = await db.collection('users').where('role', '==', 'employee').get();
            this.employees = [];
            
            snapshot.forEach(doc => {
                this.employees.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            this.renderEmployees();
            this.updateStats();
        } catch (error) {
            console.error('Error loading employees:', error);
            this.showNotification('Lỗi khi tải danh sách nhân viên', 'error');
        }
    }

    renderEmployees(employeesToRender = this.employees) {
        const tbody = document.getElementById('employeesTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (employeesToRender.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>Không tìm thấy nhân viên nào</p>
                    </td>
                </tr>
            `;
            return;
        }

        employeesToRender.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.fullName || 'N/A'}</td>
                <td>${employee.email || 'N/A'}</td>
                <td><span class="role-badge ${employee.role || 'staff'}">${this.getRoleDisplayName(employee.role)}</span></td>
                <td><span class="status-badge ${employee.isActive ? 'active' : 'inactive'}">${employee.isActive ? 'Hoạt động' : 'Không hoạt động'}</span></td>
                <td>${this.formatDate(employee.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="employeesManager.editEmployee('${employee.id}')" title="Sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="employeesManager.deleteEmployee('${employee.id}')" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterAndRender() {
        const searchTerm = document.getElementById('searchEmployee').value.toLowerCase();
        const roleFilter = document.getElementById('roleFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filtered = this.employees.filter(employee => {
            const matchesSearch = !searchTerm || 
                (employee.fullName || '').toLowerCase().includes(searchTerm) ||
                (employee.email || '').toLowerCase().includes(searchTerm);

            const matchesRole = !roleFilter || employee.role === roleFilter;
            
            const matchesStatus = !statusFilter || 
                (statusFilter === 'active' && employee.isActive) || 
                (statusFilter === 'inactive' && !employee.isActive);

            return matchesSearch && matchesRole && matchesStatus;
        });

        this.renderEmployees(filtered);
    }

    updateStats() {
        const totalEmployees = this.employees.length;
        const activeEmployees = this.employees.filter(emp => emp.isActive).length;
        const newEmployees = this.employees.filter(emp => {
            const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            return emp.createdAt && emp.createdAt > oneWeekAgo;
        }).length;

        document.getElementById('totalEmployees').textContent = totalEmployees;
        document.getElementById('activeEmployees').textContent = activeEmployees;
        document.getElementById('newEmployees').textContent = newEmployees;
    }

    openAddEmployeeModal() {
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Thêm nhân viên';
        document.getElementById('employeeForm').reset();
        document.getElementById('employeeModal').style.display = 'block';
    }

    async editEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee) return;

        this.currentEditId = employeeId;
        document.getElementById('modalTitle').textContent = 'Sửa nhân viên';
        
        // Fill form with employee data
        document.getElementById('fullName').value = employee.fullName || '';
        document.getElementById('email').value = employee.email || '';
        document.getElementById('phone').value = employee.phone || '';
        document.getElementById('role').value = employee.role || '';
        document.getElementById('department').value = employee.department || '';
        document.getElementById('status').value = employee.isActive ? 'active' : 'inactive';

        document.getElementById('employeeModal').style.display = 'block';
    }

    closeEmployeeModal() {
        document.getElementById('employeeModal').style.display = 'none';
        this.currentEditId = null;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            role: document.getElementById('role').value,
            department: document.getElementById('department').value,
            isActive: document.getElementById('status').value === 'active',
            updatedAt: Date.now()
        };

        try {
            if (this.currentEditId) {
                // Update existing employee
                await employeesRef.doc(this.currentEditId).update(formData);
                this.showNotification('Cập nhật nhân viên thành công', 'success');
            } else {
                // Add new employee
                formData.createdAt = Date.now();
                await employeesRef.add(formData);
                this.showNotification('Thêm nhân viên thành công', 'success');
            }

            this.closeEmployeeModal();
            this.loadEmployees();
        } catch (error) {
            console.error('Error saving employee:', error);
            this.showNotification('Lỗi khi lưu nhân viên', 'error');
        }
    }

    async deleteEmployee(employeeId) {
        if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;

        try {
            await employeesRef.doc(employeeId).delete();
            this.showNotification('Xóa nhân viên thành công', 'success');
            this.loadEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            this.showNotification('Lỗi khi xóa nhân viên', 'error');
        }
    }

    getRoleDisplayName(role) {
        const roleNames = {
            'admin': 'Admin',
            'manager': 'Manager',
            'staff': 'Staff',
            'sales': 'Sales'
        };
        return roleNames[role] || 'Staff';
    }

    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #8CB883 0%, #6B8A63 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global function to export employees to CSV
function exportEmployeesToCSV() {
    if (!employeesManager) {
        console.error('EmployeesManager not initialized');
        alert('Lỗi: Trình quản lý nhân viên chưa sẵn sàng.');
        return;
    }

    const employeesToExport = employeesManager.employees.filter(employee => {
        const searchTerm = document.getElementById('searchEmployee').value.toLowerCase();
        const roleFilter = document.getElementById('roleFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const matchesSearch = !searchTerm || 
            (employee.fullName || '').toLowerCase().includes(searchTerm) ||
            (employee.email || '').toLowerCase().includes(searchTerm);

        const matchesRole = !roleFilter || employee.role === roleFilter;
        
        const matchesStatus = !statusFilter || 
            (statusFilter === 'active' && employee.isActive) || 
            (statusFilter === 'inactive' && !employee.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    if (employeesToExport.length === 0) {
        alert('Không có dữ liệu nhân viên để xuất.');
        return;
    }

    const csvData = employeesToExport.map(employee => {
        return {
            'Ho Ten': employee.fullName,
            'Email': employee.email,
            'So Dien Thoai': employee.phone,
            'Vai Tro': employeesManager.getRoleDisplayName(employee.role),
            'Phong Ban': employee.department,
            'Trang Thai': employee.isActive ? 'Hoat dong' : 'Khong hoat dong',
            'Ngay Tao': employeesManager.formatDate(employee.createdAt)
        };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh_sach_nhan_vien.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Global functions for onclick handlers
function openAddEmployeeModal() {
    employeesManager.openAddEmployeeModal();
}

function closeEmployeeModal() {
    employeesManager.closeEmployeeModal();
}

// Global functions for modal handling
window.openAddEmployeeModal = openAddEmployeeModal;
window.closeEmployeeModal = closeEmployeeModal;

// Initialize employees manager
let employeesManager;

document.addEventListener('DOMContentLoaded', () => {
    employeesManager = new EmployeesManager();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
}

// Global functions for onclick handlers
function openAddEmployeeModal() {
    employeesManager.openAddEmployeeModal();
}

function closeEmployeeModal() {
    employeesManager.closeEmployeeModal();
}

// Global functions for modal handling
window.openAddEmployeeModal = openAddEmployeeModal;
window.closeEmployeeModal = closeEmployeeModal;

// Initialize employees manager
let employeesManager;

document.addEventListener('DOMContentLoaded', () => {
    employeesManager = new EmployeesManager();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 