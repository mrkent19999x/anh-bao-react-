// Firebase references - FIXED VERSION
console.log('customers-fixed.js loaded!');

// Global variables
let customersRef, employeesRef;
let customersManager;

// Initialize Firebase references
function initializeFirebaseRefs() {
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
}

// Customers Management Class
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
        
        // Search input
        const searchInput = document.getElementById('searchCustomer');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterCustomers());
        }

        // Filters
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');
        const employeeFilter = document.getElementById('employeeFilter');

        if (statusFilter) statusFilter.addEventListener('change', () => this.filterCustomers());
        if (typeFilter) typeFilter.addEventListener('change', () => this.filterCustomers());
        if (employeeFilter) employeeFilter.addEventListener('change', () => this.filterCustomers());

        // Form submission
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
            const snapshot = await customersRef.orderBy('createdAt', 'desc').get();
            this.customers = [];
            snapshot.forEach(doc => {
                this.customers.push({ id: doc.id, ...doc.data() });
            });
            this.renderCustomers();
            this.updateStats();
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    }

    renderCustomers() {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        this.customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name || 'N/A'}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customer.email || 'N/A'}</td>
                <td>${this.getTypeDisplayName(customer.type)}</td>
                <td>${this.getStatusDisplayName(customer.status)}</td>
                <td>${customer.assignedTo ? this.getEmployeeName(customer.assignedTo) : 'Chưa phân công'}</td>
                <td>${this.formatCurrency(customer.revenue || 0)}</td>
                <td>${this.formatDate(customer.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="customersManager.viewCustomer('${customer.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="customersManager.editCustomer('${customer.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="customersManager.deleteCustomer('${customer.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
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

        const filteredCustomers = this.customers.filter(customer => {
            const matchesSearch = !searchTerm || 
                customer.name?.toLowerCase().includes(searchTerm) ||
                customer.email?.toLowerCase().includes(searchTerm) ||
                customer.phone?.includes(searchTerm);

            const matchesStatus = !statusFilter || customer.status === statusFilter;
            const matchesType = !typeFilter || customer.type === typeFilter;
            const matchesEmployee = !employeeFilter || customer.assignedTo === employeeFilter;

            return matchesSearch && matchesStatus && matchesType && matchesEmployee;
        });

        this.renderFilteredCustomers(filteredCustomers);
    }

    renderFilteredCustomers(filteredCustomers) {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name || 'N/A'}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customer.email || 'N/A'}</td>
                <td>${this.getTypeDisplayName(customer.type)}</td>
                <td>${this.getStatusDisplayName(customer.status)}</td>
                <td>${customer.assignedTo ? this.getEmployeeName(customer.assignedTo) : 'Chưa phân công'}</td>
                <td>${this.formatCurrency(customer.revenue || 0)}</td>
                <td>${this.formatDate(customer.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="customersManager.viewCustomer('${customer.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="customersManager.editCustomer('${customer.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="customersManager.deleteCustomer('${customer.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateStats() {
        const totalCustomers = this.customers.length;
        const activeCustomers = this.customers.filter(c => c.status === 'active').length;
        const newCustomers = this.customers.filter(c => {
            const createdAt = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return createdAt > oneWeekAgo;
        }).length;

        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('activeCustomers').textContent = activeCustomers;
        document.getElementById('newCustomers').textContent = newCustomers;
    }

    openAddCustomerModal() {
        console.log('openAddCustomerModal called');
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Thêm khách hàng';
        document.getElementById('customerForm').reset();
        
        const modal = document.getElementById('customerModal');
        modal.style.display = 'block';
        modal.classList.add('show');
    }

    async editCustomer(customerId) {
        console.log('editCustomer called for:', customerId);
        try {
            const customerDoc = await customersRef.doc(customerId).get();
            if (customerDoc.exists) {
                const customer = customerDoc.data();
                this.currentEditId = customerId;
                
                document.getElementById('modalTitle').textContent = 'Chỉnh sửa khách hàng';
                document.getElementById('fullName').value = customer.name || '';
                document.getElementById('phone').value = customer.phone || '';
                document.getElementById('email').value = customer.email || '';
                document.getElementById('customerType').value = customer.type || '';
                document.getElementById('status').value = customer.status || 'active';
                document.getElementById('assignedTo').value = customer.assignedTo || '';
                document.getElementById('revenue').value = customer.revenue || '';
                document.getElementById('notes').value = customer.notes || '';
                document.getElementById('address').value = customer.address || '';
                document.getElementById('taxCode').value = customer.taxCode || '';
                
                const modal = document.getElementById('customerModal');
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        } catch (error) {
            console.error('Error loading customer for edit:', error);
        }
    }

    viewCustomer(customerId) {
        // Implement view customer functionality
        console.log('View customer:', customerId);
    }

    closeCustomerModal() {
        console.log('closeCustomerModal called');
        const modal = document.getElementById('customerModal');
        modal.style.display = 'none';
        modal.classList.remove('show');
        this.currentEditId = null;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        console.log('handleFormSubmit called');
        
        const formData = {
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            type: document.getElementById('customerType').value,
            status: document.getElementById('status').value,
            assignedTo: document.getElementById('assignedTo').value,
            revenue: parseFloat(document.getElementById('revenue').value) || 0,
            notes: document.getElementById('notes').value,
            address: document.getElementById('address').value,
            taxCode: document.getElementById('taxCode').value,
            updatedAt: new Date()
        };

        try {
            if (this.currentEditId) {
                // Update existing customer
                await customersRef.doc(this.currentEditId).update(formData);
                this.showNotification('Khách hàng đã được cập nhật thành công!', 'success');
            } else {
                // Add new customer
                formData.createdAt = new Date();
                await customersRef.add(formData);
                this.showNotification('Khách hàng đã được thêm thành công!', 'success');
            }
            
            this.closeCustomerModal();
            this.loadCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
            this.showNotification('Có lỗi xảy ra khi lưu khách hàng!', 'error');
        }
    }

    async deleteCustomer(customerId) {
        if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
            try {
                await customersRef.doc(customerId).delete();
                this.showNotification('Khách hàng đã được xóa thành công!', 'success');
                this.loadCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                this.showNotification('Có lỗi xảy ra khi xóa khách hàng!', 'error');
            }
        }
    }

    getEmployeeName(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        return employee ? (employee.fullName || employee.email) : 'N/A';
    }

    getTypeDisplayName(type) {
        const types = {
            'individual': 'Cá nhân',
            'business': 'Doanh nghiệp',
            'government': 'Cơ quan nhà nước'
        };
        return types[type] || type || 'N/A';
    }

    getStatusDisplayName(status) {
        const statuses = {
            'active': 'Đang hoạt động',
            'inactive': 'Không hoạt động',
            'pending': 'Chờ xử lý'
        };
        return statuses[status] || status || 'N/A';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('vi-VN');
    }

    showNotification(message, type) {
        // Simple notification implementation
        alert(message);
    }
}

// Global functions for HTML onclick
window.openAddCustomerModal = function() {
    console.log('Global openAddCustomerModal called');
    if (customersManager) {
        customersManager.openAddCustomerModal();
    }
};

window.closeCustomerModal = function() {
    console.log('Global closeCustomerModal called');
    if (customersManager) {
        customersManager.closeCustomerModal();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - customers-fixed.js');
    
    // Initialize Firebase references
    initializeFirebaseRefs();
    
    // Create customers manager instance
    customersManager = new CustomersManager();
    console.log('customersManager initialized:', customersManager);
}); 