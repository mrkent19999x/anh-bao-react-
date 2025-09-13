// Tasks Management
class TasksManager {
    constructor() {
        this.tasks = [];
        this.employees = [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadEmployees();
        this.loadTasks();
            this.setupEventListeners();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchTask');
        const statusFilter = document.getElementById('statusFilter');
        const priorityFilter = document.getElementById('priorityFilter');
        const employeeFilter = document.getElementById('employeeFilter');

        if (searchInput) searchInput.addEventListener('input', () => this.filterAndRender());
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterAndRender());
        if (priorityFilter) priorityFilter.addEventListener('change', () => this.filterAndRender());
        if (employeeFilter) employeeFilter.addEventListener('change', () => this.filterAndRender());

        const form = document.getElementById('taskForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
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

    async loadTasks() {
        try {
            const snapshot = await tasksRef.get();
            this.tasks = [];
            snapshot.forEach(doc => {
                this.tasks.push({ id: doc.id, ...doc.data() });
            });
            this.renderTasks();
            this.updateStats();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showNotification('Lỗi khi tải danh sách công việc', 'error');
        }
    }

    renderTasks(tasksToRender = this.tasks) {
        const tbody = document.getElementById('tasksTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (tasksToRender.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>Không tìm thấy công việc nào</p>
                    </td>
                </tr>
            `;
            return;
        }

        tasksToRender.forEach(task => {
            const row = document.createElement('tr');
            const assignedEmployee = this.employees.find(emp => emp.id === task.assignedTo);
            
            row.innerHTML = `
                <td>${task.title || 'N/A'}</td>
                <td>${this.truncateText(task.description, 50) || 'N/A'}</td>
                <td>${assignedEmployee ? (assignedEmployee.fullName || assignedEmployee.email) : 'N/A'}</td>
                <td><span class="status-badge ${task.status || 'pending'}">${this.getStatusDisplayName(task.status)}</span></td>
                <td><span class="priority-badge ${task.priority || 'medium'}">${this.getPriorityDisplayName(task.priority)}</span></td>
                <td>${this.formatDate(task.deadline)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-view" onclick="tasksManager.viewTask('${task.id}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-edit" onclick="tasksManager.editTask('${task.id}')" title="Sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="tasksManager.deleteTask('${task.id}')" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterAndRender() {
        const searchTerm = document.getElementById('searchTask')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const priorityFilter = document.getElementById('priorityFilter')?.value || '';
        const employeeFilter = document.getElementById('employeeFilter')?.value || '';

        const filtered = this.tasks.filter(task => {
            const matchesSearch = !searchTerm || 
                task.title?.toLowerCase().includes(searchTerm) ||
                task.description?.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || task.status === statusFilter;
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            const matchesEmployee = !employeeFilter || task.assignedTo === employeeFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesEmployee;
        });

        this.renderTasks(filtered);
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const pendingTasks = this.tasks.filter(task => task.status === 'pending').length;
        const processingTasks = this.tasks.filter(task => task.status === 'processing').length;
        const completedTasks = this.tasks.filter(task => task.status === 'completed').length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('processingTasks').textContent = processingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
    }

    openAddTaskModal() {
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Thêm công việc';
        document.getElementById('taskForm').reset();
        document.getElementById('taskModal').style.display = 'block';
    }

    async editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.currentEditId = taskId;
        document.getElementById('modalTitle').textContent = 'Sửa công việc';
        
        document.getElementById('title').value = task.title || '';
        document.getElementById('description').value = task.description || '';
        document.getElementById('assignedTo').value = task.assignedTo || '';
        document.getElementById('priority').value = task.priority || 'medium';
        document.getElementById('status').value = task.status || 'pending';
        
        if (task.deadline) {
            const deadline = new Date(task.deadline);
            const localDateTime = new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000);
            document.getElementById('deadline').value = localDateTime.toISOString().slice(0, 16);
        }

        document.getElementById('taskModal').style.display = 'block';
    }

    viewTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const assignedEmployee = this.employees.find(emp => emp.id === task.assignedTo);
        
        alert(`
Chi tiết công việc:
- Tiêu đề: ${task.title}
- Mô tả: ${task.description || 'Không có'}
- Nhân viên: ${assignedEmployee ? (assignedEmployee.fullName || assignedEmployee.email) : 'Chưa gán'}
- Trạng thái: ${this.getStatusDisplayName(task.status)}
- Độ ưu tiên: ${this.getPriorityDisplayName(task.priority)}
- Deadline: ${this.formatDate(task.deadline)}
- Ngày tạo: ${this.formatDate(task.createdAt)}
        `);
    }

    closeTaskModal() {
        document.getElementById('taskModal').style.display = 'none';
        this.currentEditId = null;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            assignedTo: document.getElementById('assignedTo').value,
            priority: document.getElementById('priority').value,
            status: document.getElementById('status').value,
            updatedAt: Date.now()
        };

        const deadlineInput = document.getElementById('deadline').value;
        if (deadlineInput) {
            formData.deadline = new Date(deadlineInput).getTime();
        }

        try {
            if (this.currentEditId) {
                await tasksRef.doc(this.currentEditId).update(formData);
                this.showNotification('Cập nhật công việc thành công', 'success');
            } else {
                formData.createdAt = Date.now();
                await tasksRef.add(formData);
                this.showNotification('Thêm công việc thành công', 'success');
            }

            this.closeTaskModal();
            this.loadTasks();
        } catch (error) {
            console.error('Error saving task:', error);
            this.showNotification('Lỗi khi lưu công việc', 'error');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;

        try {
            await tasksRef.doc(taskId).delete();
            this.showNotification('Xóa công việc thành công', 'success');
            this.loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showNotification('Lỗi khi xóa công việc', 'error');
        }
    }

    getStatusDisplayName(status) {
        const statusNames = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'completed': 'Hoàn thành'
        };
        return statusNames[status] || 'Chờ xử lý';
    }

    getPriorityDisplayName(priority) {
        const priorityNames = {
            'high': 'Cao',
            'medium': 'Trung bình',
            'low': 'Thấp'
        };
        return priorityNames[priority] || 'Trung bình';
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
}

// Global function to export tasks to CSV
function exportTasksToCSV() {
    if (!tasksManager) {
        console.error('TasksManager not initialized');
        alert('Lỗi: Trình quản lý công việc chưa sẵn sàng.');
        return;
    }

    const tasksToExport = tasksManager.tasks.filter(task => {
        const searchTerm = document.getElementById('searchTask')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const priorityFilter = document.getElementById('priorityFilter')?.value || '';
        const employeeFilter = document.getElementById('employeeFilter')?.value || '';

        const matchesSearch = !searchTerm || 
            task.title?.toLowerCase().includes(searchTerm) ||
            task.description?.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || task.status === statusFilter;
        const matchesPriority = !priorityFilter || task.priority === priorityFilter;
        const matchesEmployee = !employeeFilter || task.assignedTo === employeeFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesEmployee;
    });

    if (tasksToExport.length === 0) {
        alert('Không có dữ liệu công việc để xuất.');
        return;
    }

    const csvData = tasksToExport.map(task => {
        const assignedEmployee = tasksManager.employees.find(emp => emp.id === task.assignedTo);
        return {
            'Tieu De': task.title,
            'Mo Ta': task.description,
            'Nhan Vien': assignedEmployee ? (assignedEmployee.fullName || assignedEmployee.email) : 'Chua gan',
            'Trang Thai': tasksManager.getStatusDisplayName(task.status),
            'Do Uu Tien': tasksManager.getPriorityDisplayName(task.priority),
            'Deadline': tasksManager.formatDate(task.deadline),
            'Ngay Tao': tasksManager.formatDate(task.createdAt)
        };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh_sach_cong_viec.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Global functions
function openAddTaskModal() {
    tasksManager.openAddTaskModal();
}

function closeTaskModal() {
    tasksManager.closeTaskModal();
}

// Initialize
let tasksManager;

document.addEventListener('DOMContentLoaded', () => {
    tasksManager = new TasksManager();
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