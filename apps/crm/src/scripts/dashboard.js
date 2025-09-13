// Dashboard functionality with Firestore and Chart.js
class Dashboard {
    constructor() {
        this.charts = {};
        this.unsubscribers = [];
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.loadStats();
        this.loadRecentCustomers();
        this.loadPendingTasks();
        this.loadRecentChats();
        this.initCharts();
        this.setupRealTimeUpdates();
        this.setupMobileMenu();
    }

    async checkAuth() {
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    this.currentUser = user;
                    resolve(user);
                } else {
                    window.location.href = 'login.html';
                }
                unsubscribe();
            });
        });
    }

    async loadStats() {
        try {
            // Load total customers
            const customersSnapshot = await db.collection('customers').get();
            const totalCustomers = customersSnapshot.size;
            document.getElementById('totalCustomers').textContent = totalCustomers;

            // Load active tasks (pending + processing)
            const pendingTasksSnapshot = await db.collection('tasks')
                .where('status', 'in', ['pending', 'processing']).get();
            const activeTasks = pendingTasksSnapshot.size;
            document.getElementById('activeTasks').textContent = activeTasks;

            // Load total employees
            const employeesSnapshot = await db.collection('users')
                .where('role', '==', 'employee').get();
            const totalEmployees = employeesSnapshot.size;
            document.getElementById('totalEmployees').textContent = totalEmployees;

            // Calculate monthly revenue (placeholder - can be enhanced later)
            const completedTasksSnapshot = await db.collection('tasks')
                .where('status', '==', 'completed')
                .where('completedAt', '>=', this.getStartOfMonth()).get();
            const monthlyRevenue = completedTasksSnapshot.size * 1000000; // Placeholder calculation
            document.getElementById('monthlyRevenue').textContent = this.formatCurrency(monthlyRevenue);

            // Update stats for charts
            this.updateChartData();

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    async loadRecentCustomers() {
        try {
            const snapshot = await db.collection('customers')
                .orderBy('createdAt', 'desc')
                .limit(5)
                .get();
            
            const customers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.renderRecentCustomers(customers);
        } catch (error) {
            console.error('Error loading recent customers:', error);
        }
    }

    async loadPendingTasks() {
        try {
            const snapshot = await db.collection('tasks')
                .where('status', '==', 'pending')
                .orderBy('createdAt', 'desc')
                .limit(5)
                .get();
            
            const tasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.renderPendingTasks(tasks);
        } catch (error) {
            console.error('Error loading pending tasks:', error);
        }
    }

    async loadRecentChats() {
        try {
            const snapshot = await db.collection('conversations')
                .orderBy('updatedAt', 'desc')
                .limit(3)
                .get();
            
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.renderRecentChats(chats);
        } catch (error) {
            console.error('Error loading recent chats:', error);
        }
    }

    renderRecentCustomers(customers) {
        const container = document.getElementById('recentCustomers');
        if (!container) return;

        if (customers.length === 0) {
            container.innerHTML = '<p class="empty-state">Chưa có khách hàng nào</p>';
            return;
        }

        const html = customers.map(customer => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${customer.fullName || 'Chưa có tên'}</h4>
                    <p>${customer.phone || 'Chưa có SĐT'}</p>
                </div>
                <div class="item-status">
                    <span class="status-badge ${customer.status}">${this.getStatusText(customer.status)}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    renderPendingTasks(tasks) {
        const container = document.getElementById('pendingTasks');
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = '<p class="empty-state">Không có công việc nào đang chờ</p>';
            return;
        }

        const html = tasks.map(task => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${task.title}</h4>
                    <p>Giao cho: ${task.assignedTo || 'Chưa phân công'}</p>
                </div>
                <div class="item-status">
                    <span class="status-badge pending">Chờ xử lý</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    renderRecentChats(chats) {
        const container = document.getElementById('recentChats');
        if (!container) return;

        if (chats.length === 0) {
            container.innerHTML = '<p class="empty-state">Chưa có cuộc trò chuyện nào</p>';
            return;
        }

        const html = chats.map(chat => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${chat.title || 'Cuộc trò chuyện'}</h4>
                    <p>${chat.participants?.length || 0} người tham gia</p>
                </div>
                <div class="item-status">
                    <span class="status-badge active">Hoạt động</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    async initCharts() {
        // Customer Status Chart
        const customerStatusCtx = document.getElementById('customerStatusChart');
        if (customerStatusCtx) {
            this.charts.customerStatus = new Chart(customerStatusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Đã tiếp nhận', 'Đang xử lý', 'Đợi bổ sung', 'Đã hoàn thành'],
                    datasets: [{
                        data: [0, 0, 0, 0],
                        backgroundColor: [
                            '#ffc107',
                            '#17a2b8',
                            '#dc3545',
                            '#28a745'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        }

        // Task Progress Chart
        const taskProgressCtx = document.getElementById('taskProgressChart');
        if (taskProgressCtx) {
            this.charts.taskProgress = new Chart(taskProgressCtx, {
                type: 'bar',
                data: {
                    labels: ['Chờ xử lý', 'Đang xử lý', 'Hoàn thành'],
                    datasets: [{
                        label: 'Số lượng',
                        data: [0, 0, 0],
                        backgroundColor: [
                            '#ffc107',
                            '#17a2b8',
                            '#28a745'
                        ],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        // Monthly Activity Chart
        const monthlyActivityCtx = document.getElementById('monthlyActivityChart');
        if (monthlyActivityCtx) {
            this.charts.monthlyActivity = new Chart(monthlyActivityCtx, {
                type: 'line',
                data: {
                    labels: this.getLast6Months(),
                    datasets: [{
                        label: 'Khách hàng mới',
                        data: [0, 0, 0, 0, 0, 0],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    }

    async updateChartData() {
        try {
            // Update Customer Status Chart
            const customerStatusData = await this.getCustomerStatusData();
            if (this.charts.customerStatus) {
                this.charts.customerStatus.data.datasets[0].data = customerStatusData;
                this.charts.customerStatus.update();
            }

            // Update Task Progress Chart
            const taskProgressData = await this.getTaskProgressData();
            if (this.charts.taskProgress) {
                this.charts.taskProgress.data.datasets[0].data = taskProgressData;
                this.charts.taskProgress.update();
            }

            // Update Monthly Activity Chart
            const monthlyActivityData = await this.getMonthlyActivityData();
            if (this.charts.monthlyActivity) {
                this.charts.monthlyActivity.data.datasets[0].data = monthlyActivityData;
                this.charts.monthlyActivity.update();
            }

        } catch (error) {
            console.error('Error updating chart data:', error);
        }
    }

    async getCustomerStatusData() {
        const statuses = ['pending', 'processing', 'waiting', 'completed'];
        const data = [];

        for (const status of statuses) {
            const snapshot = await db.collection('customers')
                .where('status', '==', status).get();
            data.push(snapshot.size);
        }

        return data;
    }

    async getTaskProgressData() {
        const statuses = ['pending', 'processing', 'completed'];
        const data = [];

        for (const status of statuses) {
            const snapshot = await db.collection('tasks')
                .where('status', '==', status).get();
            data.push(snapshot.size);
        }

        return data;
    }

    async getMonthlyActivityData() {
        const months = this.getLast6Months();
        const data = [];

        for (const month of months) {
            const startDate = new Date(month + '-01');
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            
            const snapshot = await db.collection('customers')
                .where('createdAt', '>=', startDate)
                .where('createdAt', '<=', endDate).get();
            
            data.push(snapshot.size);
        }

        return data;
    }

    setupRealTimeUpdates() {
        // Real-time updates for stats
        const unsubscribeCustomers = db.collection('customers')
            .onSnapshot(() => {
                this.loadStats();
                this.loadRecentCustomers();
            });

        const unsubscribeTasks = db.collection('tasks')
            .onSnapshot(() => {
                this.loadStats();
                this.loadPendingTasks();
            });

        const unsubscribeChats = db.collection('conversations')
            .onSnapshot(() => {
                this.loadRecentChats();
            });

        this.unsubscribers.push(unsubscribeCustomers, unsubscribeTasks, unsubscribeChats);
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Đã tiếp nhận',
            'processing': 'Đang xử lý',
            'waiting': 'Đợi bổ sung giấy tờ',
            'completed': 'Đã hoàn thành',
            'active': 'Hoạt động',
            'inactive': 'Không hoạt động'
        };
        return statusMap[status] || 'Không xác định';
    }

    getStartOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    getLast6Months() {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }));
        }
        return months;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (menuToggle && sidebar && overlay) {
            // Toggle menu
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('active');
            });

            // Close menu when clicking overlay
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });

            // Close menu when clicking a nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                });
            });
        }
    }

    destroy() {
        // Cleanup real-time listeners
        this.unsubscribers.forEach(unsubscribe => unsubscribe());
        this.unsubscribers = [];

        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (dashboard) {
        dashboard.destroy();
    }
}); 