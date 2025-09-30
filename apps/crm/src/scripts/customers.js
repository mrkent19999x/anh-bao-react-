// Firebase references
console.log('customers.js loaded!');
let customersRef, employeesRef;
if (typeof window.customersRef === 'undefined') {
    customersRef = db.collection('customers');
    window.customersRef = customersRef;
} else {
    customersRef = window.customersRef;
}
if (typeof window.employeesRef === 'undefined') {
    employeesRef = db.collection('users');
    window.employeesRef = employeesRef;
} else {
    employeesRef = window.employeesRef;
}

// Customers Management
class CustomersManager {
    constructor() {
        console.log('CustomersManager constructor called');
        this.customers = [];
        this.employees = [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        console.log('CustomersManager init called');
        this.loadEmployees();
        this.loadCustomers();
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('setupEventListeners called');
        const searchInput = document.getElementById('searchCustomer');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterCustomers());
        }

        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');
        const employeeFilter = document.getElementById('employeeFilter');

        if (statusFilter) statusFilter.addEventListener('change', () => this.filterCustomers());
        if (typeFilter) typeFilter.addEventListener('change', () => this.filterCustomers());
        if (employeeFilter) employeeFilter.addEventListener('change', () => this.filterCustomers());

        const form = document.getElementById('customerForm');
        if (form) {
            console.log('customerForm found, adding submit listener');
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        } else {
            console.error('customerForm not found!');
        }

        // Modal event listeners
        const modal = document.getElementById('customerModal');
        if (modal) {
            console.log('customerModal found, adding event listeners');
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeCustomerModal();
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    this.closeCustomerModal();
                }
            });
        } else {
            console.error('customerModal not found!');
        }
    }

    async loadEmployees() {
        try {
            const snapshot = await employeesRef.get();
            this.employees = [];
            snapshot.forEach(doc => {
                this.employees.push({ id: doc.id, ...doc.data() });
            });
            this.populateEmployeeFilters();
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }

    populateEmployeeFilters() {
        const assignedToSelect = document.getElementById('assignedTo');
        const employeeFilterSelect = document.getElementById('employeeFilter');

        if (assignedToSelect) {
            assignedToSelect.innerHTML = '<option value="">Chọn nhân viên</option>';
            this.employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = employee.fullName || employee.email;
                assignedToSelect.appendChild(option);
            });
        }

        if (employeeFilterSelect) {
            employeeFilterSelect.innerHTML = '<option value="">Tất cả</option>';
            this.employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = employee.fullName || employee.email;
                employeeFilterSelect.appendChild(option);
            });
        }
    }

    async loadCustomers() {
        try {
            const snapshot = await customersRef.get();
            this.customers = [];
            snapshot.forEach(doc => {
                this.customers.push({ id: doc.id, ...doc.data() });
            });
        this.renderCustomers();
            this.updateStats();
        } catch (error) {
            console.error('Error loading customers:', error);
            this.showNotification('Lỗi khi tải danh sách khách hàng', 'error');
        }
    }

    renderCustomers() {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.customers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>Chưa có khách hàng nào</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.customers.forEach(customer => {
            const row = document.createElement('tr');
        const assignedEmployee = this.employees.find(emp => emp.id === customer.assignedTo);

            row.innerHTML = `
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${SecurityUtils.escapeHtml(customer.fullName || 'N/A')}</div>
                        <div class="customer-tax">${customer.taxCode ? `MST: ${SecurityUtils.escapeHtml(customer.taxCode)}` : ''}</div>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <div class="contact-email">${SecurityUtils.escapeHtml(customer.email || 'N/A')}</div>
                        <div class="contact-phone">${SecurityUtils.escapeHtml(customer.phone || 'N/A')}</div>
                    </div>
                </td>
                <td><span class="type-badge ${customer.customerType || 'individual'}">${this.getTypeDisplayName(customer.customerType)}</span></td>
                <td><span class="status-badge ${customer.status || 'active'}">${this.getStatusDisplayName(customer.status)}</span></td>
                <td>${assignedEmployee ? SecurityUtils.escapeHtml(assignedEmployee.fullName || assignedEmployee.email) : 'Chưa gán'}</td>
                <td class="revenue-amount ${!customer.revenue || customer.revenue === 0 ? 'zero' : ''}">${this.formatCurrency(customer.revenue)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-view" onclick="customersManager.viewCustomer('${customer.id}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-edit" onclick="customersManager.editCustomer('${customer.id}')" title="Sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-form" onclick="customersManager.createFormLink('${customer.id}')" title="Tạo link form">
                            <i class="fas fa-link"></i>
                        </button>
                        <button class="btn-delete" onclick="customersManager.deleteCustomer('${customer.id}')" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterCustomers() {
        const searchTerm = document.getElementById('searchCustomer')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        const employeeFilter = document.getElementById('employeeFilter')?.value || '';

        const filtered = this.customers.filter(customer => {
            const matchesSearch = !searchTerm || 
                customer.fullName?.toLowerCase().includes(searchTerm) ||
                customer.email?.toLowerCase().includes(searchTerm) ||
                customer.phone?.toLowerCase().includes(searchTerm) ||
                customer.taxCode?.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || customer.status === statusFilter;
            const matchesType = !typeFilter || customer.customerType === typeFilter;
            const matchesEmployee = !employeeFilter || customer.assignedTo === employeeFilter;

            return matchesSearch && matchesStatus && matchesType && matchesEmployee;
        });

        this.renderFilteredCustomers(filtered);
    }

    renderFilteredCustomers(filteredCustomers) {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (filteredCustomers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>Không tìm thấy khách hàng</p>
                    </td>
                </tr>
            `;
            return;
        }

        filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');
            const assignedEmployee = this.employees.find(emp => emp.id === customer.assignedTo);
            
            row.innerHTML = `
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${SecurityUtils.escapeHtml(customer.fullName || 'N/A')}</div>
                        <div class="customer-tax">${customer.taxCode ? `MST: ${SecurityUtils.escapeHtml(customer.taxCode)}` : ''}</div>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <div class="contact-email">${SecurityUtils.escapeHtml(customer.email || 'N/A')}</div>
                        <div class="contact-phone">${SecurityUtils.escapeHtml(customer.phone || 'N/A')}</div>
                    </div>
                </td>
                <td><span class="type-badge ${customer.customerType || 'individual'}">${this.getTypeDisplayName(customer.customerType)}</span></td>
                <td><span class="status-badge ${customer.status || 'active'}">${this.getStatusDisplayName(customer.status)}</span></td>
                <td>${assignedEmployee ? SecurityUtils.escapeHtml(assignedEmployee.fullName || assignedEmployee.email) : 'Chưa gán'}</td>
                <td class="revenue-amount ${!customer.revenue || customer.revenue === 0 ? 'zero' : ''}">${this.formatCurrency(customer.revenue)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-view" onclick="customersManager.viewCustomer('${customer.id}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-edit" onclick="customersManager.editCustomer('${customer.id}')" title="Sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-form" onclick="customersManager.createFormLink('${customer.id}')" title="Tạo link form">
                            <i class="fas fa-link"></i>
                        </button>
                        <button class="btn-delete" onclick="customersManager.deleteCustomer('${customer.id}')" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateStats() {
        const totalCustomers = this.customers.length;
        const activeCustomers = this.customers.filter(customer => customer.status === 'active').length;
        const newCustomers = this.customers.filter(customer => {
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            return customer.createdAt && customer.createdAt > thirtyDaysAgo;
        }).length;
        const totalRevenue = this.customers.reduce((sum, customer) => sum + (customer.revenue || 0), 0);

        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('activeCustomers').textContent = activeCustomers;
        document.getElementById('newCustomers').textContent = newCustomers;
        document.getElementById('totalRevenue').textContent = this.formatCurrency(totalRevenue);
    }

    openAddCustomerModal() {
        console.log('openAddCustomerModal called from class method');
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Thêm khách hàng';
        document.getElementById('customerForm').reset();
        const modal = document.getElementById('customerModal');
        modal.style.display = 'block';
        modal.classList.add('show');
    }

    async editCustomer(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) return;

        this.currentEditId = customerId;
        document.getElementById('modalTitle').textContent = 'Sửa khách hàng';
        
        document.getElementById('fullName').value = customer.fullName || '';
        document.getElementById('customerType').value = customer.customerType || 'individual';
        document.getElementById('email').value = customer.email || '';
        document.getElementById('phone').value = customer.phone || '';
        document.getElementById('address').value = customer.address || '';
        document.getElementById('taxCode').value = customer.taxCode || '';
        document.getElementById('assignedTo').value = customer.assignedTo || '';
        document.getElementById('status').value = customer.status || 'active';
        document.getElementById('revenue').value = customer.revenue || '';
        document.getElementById('notes').value = customer.notes || '';

        const modal = document.getElementById('customerModal');
        modal.style.display = 'block';
        modal.classList.add('show');
    }

    viewCustomer(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) return;

        const assignedEmployee = this.employees.find(emp => emp.id === customer.assignedTo);
        
        alert(`
Chi tiết khách hàng:
- Họ tên/Công ty: ${customer.fullName}
- Loại khách hàng: ${this.getTypeDisplayName(customer.customerType)}
- Email: ${customer.email || 'Không có'}
- Số điện thoại: ${customer.phone}
- Địa chỉ: ${customer.address || 'Không có'}
- Mã số thuế: ${customer.taxCode || 'Không có'}
- Nhân viên phụ trách: ${assignedEmployee ? (assignedEmployee.fullName || assignedEmployee.email) : 'Chưa gán'}
- Trạng thái: ${this.getStatusDisplayName(customer.status)}
- Doanh thu: ${this.formatCurrency(customer.revenue)}
- Ghi chú: ${customer.notes || 'Không có'}
- Ngày tạo: ${this.formatDate(customer.createdAt)}
        `);
    }

    closeCustomerModal() {
        console.log('closeCustomerModal called from class method');
        const modal = document.getElementById('customerModal');
        modal.style.display = 'none';
        modal.classList.remove('show');
        this.currentEditId = null;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            customerType: document.getElementById('customerType').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            taxCode: document.getElementById('taxCode').value,
            assignedTo: document.getElementById('assignedTo').value,
            status: document.getElementById('status').value,
            revenue: parseFloat(document.getElementById('revenue').value) || 0,
            notes: document.getElementById('notes').value,
            updatedAt: Date.now()
        };

        try {
            if (this.currentEditId) {
                await customersRef.doc(this.currentEditId).update(formData);
                this.showNotification('Cập nhật khách hàng thành công', 'success');
            } else {
                formData.createdAt = Date.now();
                await customersRef.add(formData);
                this.showNotification('Thêm khách hàng thành công', 'success');
            }

            this.closeCustomerModal();
            this.loadCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
            this.showNotification('Lỗi khi lưu khách hàng', 'error');
        }
    }

    async deleteCustomer(customerId) {
        if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return;

            try {
            await customersRef.doc(customerId).delete();
                this.showNotification('Xóa khách hàng thành công', 'success');
                this.loadCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                this.showNotification('Lỗi khi xóa khách hàng', 'error');
            }
        }

    getTypeDisplayName(type) {
        const typeNames = {
            'individual': 'Cá nhân',
            'business': 'Doanh nghiệp',
            'vip': 'VIP'
        };
        return typeNames[type] || 'Cá nhân';
    }

    getStatusDisplayName(status) {
        const statusNames = {
            'pending': 'Đã tiếp nhận',
            'processing': 'Đang xử lý',
            'waiting': 'Đợi bổ sung giấy tờ',
            'completed': 'Đã hoàn thành',
            'active': 'Hoạt động',
            'inactive': 'Không hoạt động'
        };
        return statusNames[status] || 'Đã tiếp nhận';
    }

    formatCurrency(amount) {
        if (!amount || amount === 0) return '0 VNĐ';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showNotification(message, type) {
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
            notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    async createFormLink(customerId) {
        try {
            // Generate unique form ID
            const formId = this.generateFormId();
            
            // Get current user
            const currentUser = auth.currentUser;
            if (!currentUser) {
                this.showNotification('Vui lòng đăng nhập để tạo link form', 'error');
                return;
            }

            // Create form in Firestore
            await db.collection('forms').doc(formId).set({
                customerId: customerId,
                createdBy: currentUser.uid,
                status: 'active',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            });

            // Generate form URL
            const formUrl = `${window.location.origin}/form/${formId}`;
            
            // Show success with copy option
            this.showFormLinkModal(formUrl, formId);

        } catch (error) {
            console.error('Error creating form link:', error);
            this.showNotification('Lỗi khi tạo link form', 'error');
        }
    }

    generateFormId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    showFormLinkModal(formUrl, formId) {
        const modal = document.createElement('div');
        modal.className = 'modal form-link-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 15px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            ">
                <div class="modal-header" style="margin-bottom: 1.5rem;">
                    <h3 style="color: #2c3e50; margin: 0;">Link Form đã tạo thành công!</h3>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #667eea; font-weight: 600;">Link Form:</label>
                        <input type="text" value="${formUrl}" readonly style="
                            width: 100%;
                            padding: 0.8rem;
                            border: 2px solid #e9ecef;
                            border-radius: 8px;
                            font-family: monospace;
                            font-size: 0.9rem;
                            background: #f8f9fa;
                        ">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #667eea; font-weight: 600;">Mã Form:</label>
                        <input type="text" value="${formId}" readonly style="
                            width: 100%;
                            padding: 0.8rem;
                            border: 2px solid #e9ecef;
                            border-radius: 8px;
                            font-family: monospace;
                            font-size: 0.9rem;
                            background: #f8f9fa;
                        ">
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button onclick="this.closest('.form-link-modal').remove()" style="
                            padding: 0.8rem 1.5rem;
                            border: none;
                            border-radius: 8px;
                            background: #6c757d;
                            color: white;
                            cursor: pointer;
                            font-weight: 600;
                        ">Đóng</button>
                        <button onclick="navigator.clipboard.writeText('${formUrl}').then(() => {
                            this.textContent = 'Đã copy!';
                            setTimeout(() => {
                                this.textContent = 'Copy Link';
                            }, 2000);
                        })" style="
                            padding: 0.8rem 1.5rem;
                            border: none;
                            border-radius: 8px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            cursor: pointer;
                            font-weight: 600;
                        ">Copy Link</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Function to export data to CSV
function exportToCSV() {
    if (!customersManager) {
        console.error('CustomersManager not initialized');
        alert('Lỗi: Trình quản lý khách hàng chưa sẵn sàng.');
        return;
    }

    const customersToExport = customersManager.customers.filter(customer => {
        const searchTerm = document.getElementById('searchCustomer')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        const employeeFilter = document.getElementById('employeeFilter')?.value || '';

        const matchesSearch = !searchTerm || 
            customer.fullName?.toLowerCase().includes(searchTerm) ||
            customer.email?.toLowerCase().includes(searchTerm) ||
            customer.phone?.toLowerCase().includes(searchTerm) ||
            customer.taxCode?.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || customer.status === statusFilter;
        const matchesType = !typeFilter || customer.customerType === typeFilter;
        const matchesEmployee = !employeeFilter || customer.assignedTo === employeeFilter;

        return matchesSearch && matchesStatus && matchesType && matchesEmployee;
    });

    if (customersToExport.length === 0) {
        alert('Không có dữ liệu khách hàng để xuất.');
        return;
    }

    const csvData = customersToExport.map(customer => {
        const assignedEmployee = customersManager.employees.find(emp => emp.id === customer.assignedTo);
        return {
            'Ho Ten/Cong Ty': customer.fullName,
            'Email': customer.email,
            'So Dien Thoai': customer.phone,
            'Ma So Thue': customer.taxCode,
            'Dia Chi': customer.address,
            'Loai Khach Hang': customersManager.getTypeDisplayName(customer.customerType),
            'Trang Thai': customersManager.getStatusDisplayName(customer.status),
            'Nhan Vien Phu Trach': assignedEmployee ? (assignedEmployee.fullName || assignedEmployee.email) : 'Chua gan',
            'Doanh Thu (VND)': customer.revenue,
            'Ghi Chu': customer.notes,
            'Ngay Tao': customersManager.formatDate(customer.createdAt)
        };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh_sach_khach_hang.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Global functions for modal handling
window.openAddCustomerModal = function() {
    console.log('openAddCustomerModal called from window function');
    if (customersManager) {
        console.log('customersManager exists, calling openAddCustomerModal');
        customersManager.openAddCustomerModal();
    } else {
        console.error('customersManager is not initialized');
    }
};

window.closeCustomerModal = function() {
    console.log('closeCustomerModal called');
    if (customersManager) {
        console.log('customersManager exists, calling closeCustomerModal');
        customersManager.closeCustomerModal();
    } else {
        console.error('customersManager is not initialized');
    }
};

// Initialize
let customersManager;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - customers.js');
    customersManager = new CustomersManager();
    console.log('customersManager initialized:', customersManager);
    
    // Monitor modal display changes
    const modal = document.getElementById('customerModal');
    if (modal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (modal.style.display === 'block') {
                        console.log('Modal display changed to block - Stack trace:', new Error().stack);
                    }
                }
            });
        });
        
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 