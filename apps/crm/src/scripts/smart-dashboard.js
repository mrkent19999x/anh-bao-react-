// Smart Dashboard - Dashboard thông minh với AI và real-time features
class SmartDashboard {
    constructor() {
        this.notifications = [];
        this.weatherData = null;
        this.calendarEvents = [];
        this.quickActions = [];
        this.init();
    }

    async init() {
        console.log('🚀 Khởi tạo Smart Dashboard...');
        await this.setupNotifications();
        await this.loadWeatherData();
        await this.loadCalendarEvents();
        this.setupQuickActions();
        this.setupRealTimeUpdates();
        this.setupSmartSuggestions();
        this.setupAutoRefresh();
    }

    // ===== REAL-TIME NOTIFICATIONS =====
    async setupNotifications() {
        console.log('📢 Thiết lập hệ thống thông báo...');
        
        // Tạo notification container
        this.createNotificationContainer();
        
        // Lắng nghe real-time updates
        this.listenToRealTimeUpdates();
        
        // Thiết lập browser notifications
        this.setupBrowserNotifications();
    }

    createNotificationContainer() {
        const notificationHTML = `
            <div id="notificationContainer" class="notification-container">
                <div class="notification-header">
                    <h3><i class="fas fa-bell"></i> Thông báo mới</h3>
                    <button id="clearAllNotifications" class="btn-clear-all">
                        <i class="fas fa-trash"></i> Xóa tất cả
                    </button>
                </div>
                <div id="notificationList" class="notification-list">
                    <!-- Notifications will be added here -->
                </div>
            </div>
        `;

        // Thêm vào content area
        const content = document.querySelector('.content');
        content.insertAdjacentHTML('afterbegin', notificationHTML);

        // Thêm CSS cho notifications
        this.addNotificationStyles();
    }

    addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                border: 1px solid rgba(255,255,255,0.3);
                margin-bottom: 2rem;
                overflow: hidden;
            }

            .notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .notification-header h3 {
                margin: 0;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .btn-clear-all {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
                touch-action: manipulation;
                min-height: 44px;
                min-width: 44px;
            }

            .btn-clear-all:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-1px);
            }

            .notification-list {
                max-height: 300px;
                overflow-y: auto;
                padding: 1rem;
            }

            .notification-item {
                padding: 1rem;
                margin-bottom: 0.75rem;
                border-radius: 12px;
                background: rgba(255,255,255,0.8);
                border: 1px solid rgba(102, 126, 234, 0.1);
                cursor: pointer;
                transition: all 0.2s ease;
                touch-action: manipulation;
                min-height: 44px;
            }

            .notification-item:hover {
                background: rgba(255,255,255,0.95);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .notification-item.unread {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                border-left: 4px solid #667eea;
            }

            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
            }

            .notification-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                flex-shrink: 0;
            }

            .notification-icon.customer {
                background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
                color: white;
            }

            .notification-icon.task {
                background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
                color: white;
            }

            .notification-icon.system {
                background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%);
                color: white;
            }

            .notification-details {
                flex: 1;
                min-width: 0;
            }

            .notification-title {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
            }

            .notification-message {
                color: #6c757d;
                font-size: 0.9rem;
                line-height: 1.4;
                margin-bottom: 0.5rem;
            }

            .notification-time {
                color: #adb5bd;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .notification-container {
                    margin: 0 1rem 2rem 1rem;
                }
                
                .notification-header {
                    padding: 1rem 1.25rem;
                }
                
                .notification-header h3 {
                    font-size: 1rem;
                }
                
                .btn-clear-all {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.85rem;
                }
                
                .notification-list {
                    max-height: 300px;
                    padding: 0.75rem;
                }
                
                .notification-item {
                    padding: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                
                .notification-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 1rem;
                }
                
                .notification-title {
                    font-size: 0.9rem;
                }
                
                .notification-message {
                    font-size: 0.85rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    listenToRealTimeUpdates() {
        console.log('🔔 Lắng nghe real-time updates...');
        
        // Simulate real-time updates for demo
        setInterval(() => {
            const random = Math.random();
            if (random < 0.3) { // 30% chance
                const notification = {
                    id: Date.now(),
                    type: random < 0.5 ? 'customer' : 'task',
                    title: random < 0.5 ? 'Khách hàng mới' : 'Công việc mới',
                    message: random < 0.5 
                        ? 'Có khách hàng mới đăng ký dịch vụ'
                        : 'Có công việc mới được tạo',
                    timestamp: new Date(),
                    unread: true
                };
                this.addNotification(notification);
            }
        }, 10000); // Check every 10 seconds
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.renderNotifications();
        this.showBrowserNotification(notification);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            this.notifications = this.notifications.filter(n => n.id !== notification.id);
            this.renderNotifications();
        }, 30000);
    }

    renderNotifications() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        if (this.notifications.length === 0) {
            notificationList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #6c757d;">
                    <i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Chưa có thông báo mới</p>
                </div>
            `;
            return;
        }

        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.unread ? 'unread' : ''}" 
                 onclick="smartDashboard.handleNotificationClick('${notification.id}')">
                <div class="notification-content">
                    <div class="notification-icon ${notification.type}">
                        <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">
                            <i class="fas fa-clock"></i>
                            ${this.formatTime(notification.timestamp)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Setup clear all button
        const clearAllBtn = document.getElementById('clearAllNotifications');
        if (clearAllBtn) {
            clearAllBtn.onclick = () => {
                this.notifications = [];
                this.renderNotifications();
            };
        }
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'customer': return 'fa-user';
            case 'task': return 'fa-tasks';
            case 'system': return 'fa-cog';
            default: return 'fa-bell';
        }
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    }

    handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id == notificationId);
        if (notification) {
            this.markAsRead(notificationId);
            // Navigate based on notification type
            if (notification.type === 'customer') {
                window.location.href = 'customers.html';
            } else if (notification.type === 'task') {
                window.location.href = 'tasks.html';
            }
        }
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id == notificationId);
        if (notification) {
            notification.unread = false;
            this.renderNotifications();
        }
    }

    async setupBrowserNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        }
    }

    showBrowserNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
    }

    // ===== QUICK ACTIONS =====
    setupQuickActions() {
        console.log('⚡ Thiết lập Quick Actions...');
        
        const quickActionsHTML = `
            <div class="quick-actions-container">
                <h3><i class="fas fa-bolt"></i> Thao tác nhanh</h3>
                <div class="quick-actions-grid">
                    <button class="quick-action-btn" onclick="smartDashboard.quickAddCustomer()">
                        <i class="fas fa-user-plus"></i>
                        <span>Thêm khách hàng</span>
                    </button>
                    <button class="quick-action-btn" onclick="smartDashboard.quickAddTask()">
                        <i class="fas fa-tasks"></i>
                        <span>Tạo công việc</span>
                    </button>
                    <button class="quick-action-btn" onclick="smartDashboard.quickSchedule()">
                        <i class="fas fa-calendar-plus"></i>
                        <span>Lên lịch hẹn</span>
                    </button>
                    <button class="quick-action-btn" onclick="smartDashboard.quickReport()">
                        <i class="fas fa-chart-bar"></i>
                        <span>Báo cáo nhanh</span>
                    </button>
                </div>
            </div>
        `;

        // Thêm vào content area
        const content = document.querySelector('.content');
        const notificationContainer = document.getElementById('notificationContainer');
        if (notificationContainer) {
            notificationContainer.insertAdjacentHTML('afterend', quickActionsHTML);
        }

        // Thêm CSS cho quick actions
        this.addQuickActionsStyles();
    }

    addQuickActionsStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .quick-actions-container {
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                border: 1px solid rgba(255,255,255,0.3);
                margin-bottom: 2rem;
                padding: 1.5rem;
            }

            .quick-actions-container h3 {
                margin: 0 0 1.5rem 0;
                color: #2c3e50;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .quick-actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .quick-action-btn {
                height: 60px;
                min-height: 60px;
                border-radius: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                font-size: 1rem;
                font-weight: 600;
                transition: all 0.2s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                touch-action: manipulation;
                text-decoration: none;
            }

            .quick-action-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .quick-action-btn i {
                font-size: 1.2rem;
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .quick-actions-container {
                    margin: 0 1rem 2rem 1rem;
                    padding: 1.25rem;
                }
                
                .quick-actions-container h3 {
                    font-size: 1.1rem;
                    margin-bottom: 1.25rem;
                }
                
                .quick-actions-grid {
                    grid-template-columns: 1fr;
                    gap: 0.75rem;
                }
                
                .quick-action-btn {
                    height: 56px;
                    min-height: 56px;
                    font-size: 0.95rem;
                }
                
                .quick-action-btn i {
                    font-size: 1.1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    quickAddCustomer() {
        this.showQuickCustomerModal();
    }

    quickAddTask() {
        window.location.href = 'tasks.html';
    }

    quickSchedule() {
        // Open calendar or scheduling modal
        alert('Tính năng lên lịch hẹn đang được phát triển!');
    }

    quickReport() {
        window.location.href = 'reports.html';
    }

    // ===== WEATHER WIDGET =====
    async loadWeatherData() {
        console.log('🌤️ Tải dữ liệu thời tiết...');
        
        // Simulate weather data for demo
        this.weatherData = {
            location: 'Hà Nội',
            temperature: 28,
            condition: 'sunny',
            humidity: 65,
            windSpeed: 12
        };
        
        this.renderWeatherWidget();
    }

    renderWeatherWidget() {
        const weatherHTML = `
            <div class="weather-widget">
                <div class="weather-header">
                    <h3><i class="fas fa-cloud-sun"></i> Thời tiết</h3>
                    <button onclick="smartDashboard.refreshWeather()" class="weather-refresh">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                <div class="weather-content">
                    <div class="weather-main">
                        <div class="weather-icon">
                            <i class="fas fa-sun"></i>
                        </div>
                        <div class="weather-info">
                            <div class="temperature">${this.weatherData.temperature}°C</div>
                            <div class="location">${this.weatherData.location}</div>
                        </div>
                    </div>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <i class="fas fa-tint"></i>
                            <span>Độ ẩm: ${this.weatherData.humidity}%</span>
                        </div>
                        <div class="weather-detail">
                            <i class="fas fa-wind"></i>
                            <span>Gió: ${this.weatherData.windSpeed} km/h</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Thêm vào content area
        const content = document.querySelector('.content');
        const quickActionsContainer = document.querySelector('.quick-actions-container');
        if (quickActionsContainer) {
            quickActionsContainer.insertAdjacentHTML('afterend', weatherHTML);
        }

        // Thêm CSS cho weather widget
        this.addWeatherStyles();
    }

    addWeatherStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .weather-widget {
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                border: 1px solid rgba(255,255,255,0.3);
                margin-bottom: 2rem;
                overflow: hidden;
            }

            .weather-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
                color: white;
            }

            .weather-header h3 {
                margin: 0;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .weather-refresh {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                touch-action: manipulation;
            }

            .weather-refresh:hover {
                background: rgba(255,255,255,0.3);
                transform: rotate(180deg);
            }

            .weather-content {
                padding: 1.5rem;
            }

            .weather-main {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .weather-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: white;
            }

            .weather-info {
                flex: 1;
            }

            .temperature {
                font-size: 2rem;
                font-weight: 700;
                color: #2c3e50;
                line-height: 1;
            }

            .location {
                color: #6c757d;
                font-size: 0.9rem;
                margin-top: 0.25rem;
            }

            .weather-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .weather-detail {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #6c757d;
                font-size: 0.9rem;
            }

            .weather-detail i {
                color: #17a2b8;
                width: 16px;
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .weather-widget {
                    margin: 0 1rem 2rem 1rem;
                }
                
                .weather-header {
                    padding: 1rem 1.25rem;
                }
                
                .weather-header h3 {
                    font-size: 1rem;
                }
                
                .weather-content {
                    padding: 1.25rem;
                }
                
                .weather-icon {
                    width: 50px;
                    height: 50px;
                    font-size: 1.5rem;
                }
                
                .temperature {
                    font-size: 1.75rem;
                }
                
                .weather-details {
                    grid-template-columns: 1fr;
                    gap: 0.75rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    refreshWeather() {
        console.log('🔄 Làm mới thời tiết...');
        // Simulate refresh
        this.weatherData.temperature = Math.floor(Math.random() * 10) + 25;
        this.renderWeatherWidget();
    }

    // ===== CALENDAR WIDGET =====
    async loadCalendarEvents() {
        console.log('📅 Tải sự kiện lịch...');
        
        // Simulate calendar events for demo
        this.calendarEvents = [
            {
                id: 1,
                title: 'Họp với khách hàng ABC',
                time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                type: 'meeting'
            },
            {
                id: 2,
                title: 'Deadline báo cáo thuế',
                time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
                type: 'deadline'
            },
            {
                id: 3,
                title: 'Kiểm tra hệ thống',
                time: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
                type: 'task'
            }
        ];
        
        this.renderCalendarWidget();
    }

    renderCalendarWidget() {
        const calendarHTML = `
            <div class="calendar-widget">
                <div class="calendar-header">
                    <h3><i class="fas fa-calendar-alt"></i> Lịch sự kiện</h3>
                    <span class="event-count">${this.calendarEvents.length} sự kiện</span>
                </div>
                <div class="calendar-content">
                    ${this.calendarEvents.map(event => `
                        <div class="calendar-event" onclick="smartDashboard.viewEvent('${event.id}')">
                            <div class="event-icon ${event.type}">
                                <i class="fas ${this.getEventIcon(event.type)}"></i>
                            </div>
                            <div class="event-details">
                                <div class="event-title">${event.title}</div>
                                <div class="event-time">
                                    <i class="fas fa-clock"></i>
                                    ${this.formatEventTime(event.time)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Thêm vào content area
        const content = document.querySelector('.content');
        const weatherWidget = document.querySelector('.weather-widget');
        if (weatherWidget) {
            weatherWidget.insertAdjacentHTML('afterend', calendarHTML);
        }

        // Thêm CSS cho calendar widget
        this.addCalendarStyles();
    }

    addCalendarStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .calendar-widget {
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                border: 1px solid rgba(255,255,255,0.3);
                margin-bottom: 2rem;
                overflow: hidden;
            }

            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%);
                color: white;
            }

            .calendar-header h3 {
                margin: 0;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .event-count {
                background: rgba(255,255,255,0.2);
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.85rem;
            }

            .calendar-content {
                padding: 1rem;
            }

            .calendar-event {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                margin-bottom: 0.75rem;
                border-radius: 12px;
                background: rgba(255,255,255,0.8);
                border: 1px solid rgba(102, 126, 234, 0.1);
                cursor: pointer;
                transition: all 0.2s ease;
                touch-action: manipulation;
                min-height: 44px;
            }

            .calendar-event:hover {
                background: rgba(255,255,255,0.95);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .calendar-event:last-child {
                margin-bottom: 0;
            }

            .event-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                flex-shrink: 0;
            }

            .event-icon.meeting {
                background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
                color: white;
            }

            .event-icon.deadline {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                color: white;
            }

            .event-icon.task {
                background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
                color: white;
            }

            .event-details {
                flex: 1;
                min-width: 0;
            }

            .event-title {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
            }

            .event-time {
                color: #6c757d;
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .calendar-widget {
                    margin: 0 1rem 2rem 1rem;
                }
                
                .calendar-header {
                    padding: 1rem 1.25rem;
                }
                
                .calendar-header h3 {
                    font-size: 1rem;
                }
                
                .calendar-content {
                    padding: 0.75rem;
                }
                
                .calendar-event {
                    padding: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                
                .event-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 1rem;
                }
                
                .event-title {
                    font-size: 0.9rem;
                }
                
                .event-time {
                    font-size: 0.8rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    formatEventTime(date) {
        const now = new Date();
        const diff = date - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days} ngày nữa`;
        } else if (hours > 0) {
            return `${hours} giờ ${minutes} phút nữa`;
        } else if (minutes > 0) {
            return `${minutes} phút nữa`;
        } else {
            return 'Sắp tới';
        }
    }

    viewEvent(eventId) {
        console.log('Xem sự kiện:', eventId);
        // Navigate to calendar or show event details
        alert('Tính năng xem chi tiết sự kiện đang được phát triển!');
    }

    // ===== SMART SUGGESTIONS =====
    setupSmartSuggestions() {
        console.log('💡 Thiết lập Smart Suggestions...');
        this.generateSuggestions();
    }

    async generateSuggestions() {
        // Simulate AI suggestions based on data
        const suggestions = [
            {
                type: 'inactive_customers',
                title: 'Khách hàng không hoạt động',
                message: 'Có 5 khách hàng chưa liên lạc trong 30 ngày qua',
                action: 'Xem danh sách',
                icon: 'fa-user-clock',
                color: '#ffc107'
            },
            {
                type: 'overdue_tasks',
                title: 'Công việc quá hạn',
                message: 'Có 3 công việc đã quá deadline',
                action: 'Xem chi tiết',
                icon: 'fa-exclamation-triangle',
                color: '#dc3545'
            },
            {
                type: 'revenue_opportunity',
                title: 'Cơ hội tăng doanh thu',
                message: 'Phân tích cho thấy có thể tăng 15% doanh thu',
                action: 'Xem báo cáo',
                icon: 'fa-chart-line',
                color: '#28a745'
            }
        ];

        this.renderSmartSuggestions(suggestions);
    }

    renderSmartSuggestions(suggestions) {
        const suggestionsHTML = `
            <div class="smart-suggestions">
                <div class="suggestions-header">
                    <h3><i class="fas fa-lightbulb"></i> Gợi ý thông minh</h3>
                </div>
                <div class="suggestions-content">
                    ${suggestions.map(suggestion => `
                        <div class="suggestion-item" onclick="smartDashboard.executeSuggestion('${suggestion.type}')">
                            <div class="suggestion-icon" style="background: ${suggestion.color}">
                                <i class="fas ${suggestion.icon}"></i>
                            </div>
                            <div class="suggestion-details">
                                <div class="suggestion-title">${suggestion.title}</div>
                                <div class="suggestion-message">${suggestion.message}</div>
                                <div class="suggestion-action">${suggestion.action}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Thêm vào content area
        const content = document.querySelector('.content');
        const calendarWidget = document.querySelector('.calendar-widget');
        if (calendarWidget) {
            calendarWidget.insertAdjacentHTML('afterend', suggestionsHTML);
        }

        // Thêm CSS cho suggestions
        this.addSuggestionsStyles();
    }

    addSuggestionsStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .smart-suggestions {
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                border: 1px solid rgba(255,255,255,0.3);
                margin-bottom: 2rem;
                overflow: hidden;
            }

            .suggestions-header {
                padding: 1rem 1.5rem;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
            }

            .suggestions-header h3 {
                margin: 0;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .suggestions-content {
                padding: 1rem;
            }

            .suggestion-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                margin-bottom: 0.75rem;
                border-radius: 12px;
                background: rgba(255,255,255,0.8);
                border: 1px solid rgba(102, 126, 234, 0.1);
                cursor: pointer;
                transition: all 0.2s ease;
                touch-action: manipulation;
                min-height: 44px;
            }

            .suggestion-item:hover {
                background: rgba(255,255,255,0.95);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .suggestion-item:last-child {
                margin-bottom: 0;
            }

            .suggestion-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                color: white;
                flex-shrink: 0;
            }

            .suggestion-details {
                flex: 1;
                min-width: 0;
            }

            .suggestion-title {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
            }

            .suggestion-message {
                color: #6c757d;
                font-size: 0.85rem;
                margin-bottom: 0.5rem;
            }

            .suggestion-action {
                color: #667eea;
                font-size: 0.8rem;
                font-weight: 600;
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .smart-suggestions {
                    margin: 0 1rem 2rem 1rem;
                }
                
                .suggestions-header {
                    padding: 1rem 1.25rem;
                }
                
                .suggestions-header h3 {
                    font-size: 1rem;
                }
                
                .suggestions-content {
                    padding: 0.75rem;
                }
                
                .suggestion-item {
                    padding: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                
                .suggestion-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 1rem;
                }
                
                .suggestion-title {
                    font-size: 0.9rem;
                }
                
                .suggestion-message {
                    font-size: 0.8rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    executeSuggestion(type) {
        console.log('Thực hiện gợi ý:', type);
        switch (type) {
            case 'inactive_customers':
                window.location.href = 'customers.html?filter=inactive';
                break;
            case 'overdue_tasks':
                window.location.href = 'tasks.html?filter=overdue';
                break;
            case 'revenue_opportunity':
                window.location.href = 'reports.html?type=revenue';
                break;
            default:
                alert('Tính năng đang được phát triển!');
        }
    }

    // ===== AUTO REFRESH =====
    setupAutoRefresh() {
        console.log('🔄 Thiết lập Auto Refresh...');
        setInterval(() => {
            this.refreshData();
        }, 300000); // Refresh every 5 minutes
    }

    async refreshData() {
        console.log('🔄 Làm mới dữ liệu...');
        // Refresh weather data
        await this.loadWeatherData();
        // Refresh calendar events
        await this.loadCalendarEvents();
        // Generate new suggestions
        this.generateSuggestions();
    }

    // ===== QUICK CUSTOMER MODAL =====
    showQuickCustomerModal() {
        const modalHTML = `
            <div id="quickCustomerModal" class="modal show">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Thêm khách hàng nhanh</h2>
                        <button class="close" onclick="smartDashboard.closeModal('quickCustomerModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="quickCustomerForm" onsubmit="smartDashboard.submitQuickCustomer(event)">
                        <div class="form-group">
                            <label for="customerName">Tên khách hàng *</label>
                            <input type="text" id="customerName" required>
                        </div>
                        <div class="form-group">
                            <label for="customerPhone">Số điện thoại</label>
                            <input type="tel" id="customerPhone">
                        </div>
                        <div class="form-group">
                            <label for="customerEmail">Email</label>
                            <input type="email" id="customerEmail">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="smartDashboard.closeModal('quickCustomerModal')">
                                Hủy
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    async submitQuickCustomer(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            status: 'active',
            createdAt: new Date()
        };

        try {
            // Simulate API call
            console.log('Lưu khách hàng:', formData);
            
            // Add notification
            this.addNotification({
                id: Date.now(),
                type: 'customer',
                title: 'Khách hàng mới',
                message: `Đã thêm khách hàng: ${formData.name}`,
                timestamp: new Date(),
                unread: true
            });

            // Close modal
            this.closeModal('quickCustomerModal');
            
            // Show success message
            alert('Thêm khách hàng thành công!');
            
        } catch (error) {
            console.error('Lỗi khi thêm khách hàng:', error);
            alert('Có lỗi xảy ra khi thêm khách hàng!');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    }

    destroy() {
        console.log('🧹 Dọn dẹp Smart Dashboard...');
        // Clear intervals and remove event listeners
        // This will be called when component is destroyed
    }
}

let smartDashboard;
document.addEventListener('DOMContentLoaded', () => {
    smartDashboard = new SmartDashboard();
});
