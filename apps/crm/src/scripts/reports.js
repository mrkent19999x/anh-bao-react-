// Reports Management
class ReportsManager {
    constructor() {
        this.charts = {};
        this.allData = {
            customers: [],
            tasks: [],
            employees: []
        };
        this.init();
    }

    async init() {
        await this.loadAllData();
        this.setupEventListeners();
        this.initializeAllCharts();
        // Initial report generation based on default filter value
        const initialDays = document.getElementById('dateRange').value;
        this.generateFilteredReport(initialDays);
    }

    setupEventListeners() {
        const dateRangeSelect = document.getElementById('dateRange');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => this.generateFilteredReport(e.target.value));
        }
    }

    async loadAllData() {
        try {
            const [customersSnapshot, tasksSnapshot, employeesSnapshot] = await Promise.all([
                db.collection('customers').get(),
                db.collection('tasks').get(),
                db.collection('users').get()
            ]);

            this.allData.customers = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.allData.tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.allData.employees = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        } catch (error) {
            console.error('Error loading all data:', error);
        }
    }

    generateFilteredReport(days = 30) {
        const now = new Date();
        const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

        const filteredCustomers = this.allData.customers.filter(c => c.createdAt && new Date(c.createdAt.toDate()) >= startDate);
        const filteredTasks = this.allData.tasks.filter(t => t.createdAt && new Date(t.createdAt.toDate()) >= startDate);
        
        this.updateStats(this.allData.customers, this.allData.tasks, this.allData.employees);
        this.updateCustomerGrowthChart(filteredCustomers, days);
        this.updateTaskStatusChart(this.allData.tasks); // This one uses all tasks
        this.updateEmployeePerformanceChart(filteredTasks, this.allData.employees);
        this.updateRevenueChart(filteredCustomers, days);
        this.renderTopCustomers(this.allData.customers);
        this.renderRecentActivities(); // This still uses mock data
    }

    updateStats(customers, tasks, employees) {
        document.getElementById('totalCustomers').textContent = customers.length;
        document.getElementById('totalTasks').textContent = tasks.length;
        document.getElementById('totalEmployees').textContent = employees.length;
        document.getElementById('totalDocuments').textContent = '0'; // Placeholder
    }

    initializeAllCharts() {
        this.charts.customerGrowth = this.createLineChart('customerGrowthChart', 'Khách hàng mới', '#667eea');
        this.charts.taskStatus = this.createDoughnutChart('taskStatusChart', ['Hoàn thành', 'Đang xử lý', 'Chờ xử lý']);
        this.charts.employeePerformance = this.createBarChart('employeePerformanceChart', 'Công việc hoàn thành', 'rgba(102, 126, 234, 0.8)');
        this.charts.revenue = this.createLineChart('revenueChart', 'Doanh thu (triệu VND)', '#764ba2');
    }

    updateCustomerGrowthChart(filteredCustomers, days) {
        const chart = this.charts.customerGrowth;
        if (!chart) return;

        const { labels, data } = this.calculateGrowthData(filteredCustomers, days);
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }
    
    calculateGrowthData(customers, days) {
        const labels = [];
        const data = [];
        const now = new Date();

        if (days <= 30) { // Group by day
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
                labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
                const count = customers.filter(c => {
                    const customerDate = new Date(c.createdAt);
                    return customerDate.toDateString() === date.toDateString();
                }).length;
                data.push(count);
            }
        } else { // Group by month
            for (let i = Math.floor(days / 30) - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                labels.push(date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }));
                const count = customers.filter(c => {
                    const customerDate = new Date(c.createdAt);
                    return customerDate.getFullYear() === date.getFullYear() && customerDate.getMonth() === date.getMonth();
                }).length;
                data.push(count);
            }
        }
        return { labels, data };
    }

    // --- Methods for other charts (will be fixed later) ---
    updateTaskStatusChart(tasks) {
        const chart = this.charts.taskStatus;
        if (!chart) return;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const processing = tasks.filter(t => t.status === 'processing').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        chart.data.datasets[0].data = [completed, processing, pending];
        chart.update();
    }

    updateEmployeePerformanceChart(filteredTasks, employees) {
        const chart = this.charts.employeePerformance;
        if (!chart) return;

        const performanceData = employees.map(emp => {
            const completedTasks = filteredTasks.filter(task => 
                task.assignedTo === emp.id && task.status === 'completed'
            ).length;
            return { name: emp.fullName || emp.email, count: completedTasks };
        });

        // Sort by performance and take top 10
        performanceData.sort((a, b) => b.count - a.count);
        const top10 = performanceData.slice(0, 10);

        chart.data.labels = top10.map(d => d.name);
        chart.data.datasets[0].data = top10.map(d => d.count);
        chart.update();
    }

    updateRevenueChart(filteredCustomers, days) {
        const chart = this.charts.revenue;
        if (!chart) return;

        const { labels, data } = this.calculateRevenueData(filteredCustomers, days);
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }

    calculateRevenueData(customers, days) {
        const labels = [];
        const data = [];
        const now = new Date();

        if (days <= 90) { // Group by day for up to 3 months
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
                labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
                const dailyRevenue = customers.filter(c => {
                    const customerDate = new Date(c.createdAt);
                    return customerDate.toDateString() === date.toDateString();
                }).reduce((sum, c) => sum + (c.revenue || 0), 0);
                data.push(dailyRevenue / 1000000); // Convert to millions
            }
        } else { // Group by month
            const monthsToDisplay = Math.ceil(days / 30);
            for (let i = monthsToDisplay - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                labels.push(date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }));
                const monthlyRevenue = customers.filter(c => {
                    const customerDate = new Date(c.createdAt);
                    return customerDate.getFullYear() === date.getFullYear() && customerDate.getMonth() === date.getMonth();
                }).reduce((sum, c) => sum + (c.revenue || 0), 0);
                data.push(monthlyRevenue / 1000000); // Convert to millions
            }
        }
        return { labels, data };
    }

    renderTopCustomers(customers) { /* ... existing implementation ... */ }
    renderRecentActivities() { /* ... existing implementation with mock data ... */ }

    // --- Chart Creation Helper Methods ---
    createLineChart(canvasId, label, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    borderColor: color,
                    backgroundColor: color + '1A', // transparent version
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    createDoughnutChart(canvasId, labels) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: [],
                    backgroundColor: ['#28a745', '#17a2b8', '#ffc107'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
    }

    createBarChart(canvasId, label, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    backgroundColor: color,
                    borderRadius: 8
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }
    
    // Other helper methods from original file...
    getLast6Months() {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleDateString('vi-VN', { month: 'short' }));
        }
        return months;
    }
}

// Initialize reports manager
let reportsManager;

document.addEventListener('DOMContentLoaded', () => {
    reportsManager = new ReportsManager();
}); 