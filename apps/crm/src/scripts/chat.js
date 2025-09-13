// Chat Management System with Bot Integration
class ChatManager {
    constructor() {
        this.currentConversation = null;
        this.currentCustomer = null;
        this.unsubscribe = null;
        this.init();
    }

    async init() {
        try {
            await this.checkAuth();
            this.setupEventListeners();
            this.loadConversations();
        } catch (error) {
            console.error('Error initializing chat:', error);
            this.showNotification('Lỗi khởi tạo chat', 'error');
        }
    }

    async checkAuth() {
        return new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                unsubscribe();
                if (user) {
                    this.currentUser = user;
                    resolve();
                } else {
                    window.location.href = 'login.html';
                    reject(new Error('Not authenticated'));
                }
            });
        });
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchConversation');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterConversations(e.target.value);
            });
        }

        const newChatBtn = document.getElementById('newChatBtn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.showNewConversationModal();
            });
        }

        const sendBtn = document.getElementById('sendMessageBtn');
        const messageInput = document.getElementById('messageInput');
        
        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });

            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    async loadConversations() {
        try {
            this.showLoading('conversationsList');
            
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const conversationsRef = db.collection('conversations');
            const query = currentUser.email === 'admin@anhbao.com' 
                ? conversationsRef.orderBy('updatedAt', 'desc')
                : conversationsRef.where('participants', 'array-contains', currentUser.uid)
                    .orderBy('updatedAt', 'desc');

            this.unsubscribe = query.onSnapshot((snapshot) => {
                const conversations = [];
                snapshot.forEach(doc => {
                    conversations.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                this.renderConversations(conversations);
            }, (error) => {
                console.error('Error loading conversations:', error);
                this.showNotification('Lỗi tải danh sách chat', 'error');
            });

        } catch (error) {
            console.error('Error loading conversations:', error);
            this.showNotification('Lỗi tải danh sách chat', 'error');
        }
    }

    renderConversations(conversations) {
        const container = document.getElementById('conversationsList');
        if (!container) return;

        if (conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>Chưa có cuộc trò chuyện nào</h3>
                    <p>Bắt đầu cuộc trò chuyện mới để tương tác với khách hàng</p>
                    <button class="btn-primary" onclick="chatManager.showNewConversationModal()">
                        <i class="fas fa-plus"></i>
                        Tạo cuộc trò chuyện mới
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = conversations.map(conv => `
            <div class="conversation-item ${this.currentConversation?.id === conv.id ? 'active' : ''}" 
                 onclick="chatManager.selectConversation('${conv.id}')">
                <div class="conversation-avatar">
                    <i class="fas ${conv.type === 'customer' ? 'fa-user' : 'fa-users'}"></i>
                </div>
                <div class="conversation-content">
                    <div class="conversation-header">
                        <h4>${conv.title}</h4>
                        <span class="conversation-time">${this.formatTime(conv.updatedAt)}</span>
                    </div>
                    <p class="conversation-preview">${conv.lastMessage || 'Chưa có tin nhắn'}</p>
                </div>
                <div class="conversation-actions">
                    <button class="btn-icon" onclick="event.stopPropagation(); chatManager.deleteConversation('${conv.id}')" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async selectConversation(conversationId) {
        try {
            this.showLoading('messagesContainer');
            
            const conversationDoc = await db.collection('conversations').doc(conversationId).get();
            if (!conversationDoc.exists) {
                this.showNotification('Cuộc trò chuyện không tồn tại', 'error');
                return;
            }

            this.currentConversation = {
                id: conversationId,
                ...conversationDoc.data()
            };

            if (this.currentConversation.customerId) {
                const customerDoc = await db.collection('customers').doc(this.currentConversation.customerId).get();
                if (customerDoc.exists) {
                    this.currentCustomer = {
                        id: customerDoc.id,
                        ...customerDoc.data()
                    };
                }
            }

            this.updateConversationUI();
            this.loadMessages(conversationId);

        } catch (error) {
            console.error('Error selecting conversation:', error);
            this.showNotification('Lỗi chọn cuộc trò chuyện', 'error');
        }
    }

    updateConversationUI() {
        const header = document.getElementById('conversationHeader');
        if (header && this.currentConversation) {
            header.innerHTML = `
                <div class="conversation-info">
                    <h3>${this.currentConversation.title}</h3>
                    <p class="conversation-subtitle">
                        ${this.currentConversation.type === 'customer' ? 'Chat với khách hàng' : 'Chat nội bộ'}
                    </p>
                </div>
                <div class="conversation-actions">
                    ${this.currentCustomer ? `
                        <div class="customer-status">
                            <label for="customerStatus">Trạng thái:</label>
                            <select id="customerStatus" class="status-select">
                                <option value="pending" ${this.currentCustomer.status === 'pending' ? 'selected' : ''}>Đã tiếp nhận</option>
                                <option value="processing" ${this.currentCustomer.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
                                <option value="waiting" ${this.currentCustomer.status === 'waiting' ? 'selected' : ''}>Đợi bổ sung giấy tờ</option>
                                <option value="completed" ${this.currentCustomer.status === 'completed' ? 'selected' : ''}>Đã hoàn thành</option>
                            </select>
                        </div>
                    ` : ''}
                    <button class="btn-icon" onclick="chatManager.closeConversation()" title="Đóng">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            const statusSelect = document.getElementById('customerStatus');
            if (statusSelect) {
                statusSelect.addEventListener('change', (e) => {
                    this.updateCustomerStatus(e.target.value);
                });
            }
        }

        const messageArea = document.getElementById('messageArea');
        if (messageArea) {
            messageArea.style.display = this.currentConversation ? 'flex' : 'none';
        }
    }

    async loadMessages(conversationId) {
        try {
            const messagesRef = db.collection('messages')
                .where('conversationId', '==', conversationId)
                .orderBy('timestamp', 'asc');

            messagesRef.onSnapshot((snapshot) => {
                const messages = [];
                snapshot.forEach(doc => {
                    messages.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                this.renderMessages(messages);
            }, (error) => {
                console.error('Error loading messages:', error);
                this.showNotification('Lỗi tải tin nhắn', 'error');
            });

        } catch (error) {
            console.error('Error loading messages:', error);
            this.showNotification('Lỗi tải tin nhắn', 'error');
        }
    }

    renderMessages(messages) {
        const container = document.getElementById('messagesContainer');
        if (!container) return;

        container.innerHTML = messages.map(msg => `
            <div class="message ${msg.senderId === 'bot' ? 'bot' : msg.senderId === auth.currentUser?.uid ? 'sent' : 'received'}">
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">${msg.senderName}</span>
                        <span class="message-time">${this.formatTime(msg.timestamp)}</span>
                    </div>
                    <div class="message-text">${this.formatMessage(msg.text)}</div>
                </div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput?.value?.trim();
        
        if (!text || !this.currentConversation) return;

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            await db.collection('messages').add({
                conversationId: this.currentConversation.id,
                senderId: currentUser.uid,
                senderName: currentUser.displayName || currentUser.email,
                text: text,
                timestamp: new Date(),
                status: 'sent'
            });

            await db.collection('conversations').doc(this.currentConversation.id).update({
                lastMessage: text,
                updatedAt: new Date()
            });

            messageInput.value = '';

            if (this.currentConversation.type === 'customer' && this.currentCustomer) {
                await this.sendBotResponse(text);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('Lỗi gửi tin nhắn', 'error');
        }
    }

    async sendBotResponse(userMessage) {
        try {
            let botResponse = this.getBotResponseByStatus(this.currentCustomer.status, userMessage);
            
            if (botResponse) {
                await db.collection('messages').add({
                    conversationId: this.currentConversation.id,
                    senderId: 'bot',
                    senderName: 'Hệ thống',
                    text: botResponse,
                    timestamp: new Date(),
                    status: 'sent'
                });

                await db.collection('conversations').doc(this.currentConversation.id).update({
                    lastMessage: botResponse,
                    updatedAt: new Date()
                });
            }

        } catch (error) {
            console.error('Error sending bot response:', error);
        }
    }

    getBotResponseByStatus(status, userMessage) {
        const message = userMessage.toLowerCase();
        
        const statusKeywords = ['tình trạng', 'trạng thái', 'đến đâu', 'xong chưa', 'bao giờ', 'khi nào'];
        const isStatusInquiry = statusKeywords.some(keyword => message.includes(keyword));

        if (isStatusInquiry) {
            switch (status) {
                case 'pending':
                    return 'Hồ sơ của bạn đã được tiếp nhận và đang chờ xử lý. Chúng tôi sẽ liên hệ sớm nhất.';
                case 'processing':
                    return 'Hồ sơ của bạn đang được xử lý tích cực. Chúng tôi sẽ cập nhật thông tin khi có tiến triển.';
                case 'waiting':
                    return 'Hồ sơ của bạn cần bổ sung thêm giấy tờ. Vui lòng cung cấp các tài liệu còn thiếu để chúng tôi tiếp tục xử lý.';
                case 'completed':
                    return 'Hồ sơ của bạn đã được hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!';
                default:
                    return 'Hồ sơ của bạn đang được xử lý. Vui lòng đợi thông báo từ chúng tôi.';
            }
        }

        const generalKeywords = ['xin chào', 'hello', 'hi', 'cảm ơn', 'thanks'];
        const isGeneralInquiry = generalKeywords.some(keyword => message.includes(keyword));

        if (isGeneralInquiry) {
            return 'Xin chào! Chúng tôi luôn sẵn sàng hỗ trợ bạn. Nếu có thắc mắc về tình trạng hồ sơ, vui lòng hỏi trực tiếp.';
        }

        return 'Cảm ơn bạn đã liên hệ. Nếu có thắc mắc về tình trạng hồ sơ, vui lòng hỏi trực tiếp.';
    }

    async updateCustomerStatus(newStatus) {
        if (!this.currentCustomer) return;

        try {
            await db.collection('customers').doc(this.currentCustomer.id).update({
                status: newStatus,
                updatedAt: new Date()
            });

            this.currentCustomer.status = newStatus;

            const statusMessages = {
                'pending': 'Hồ sơ đã được tiếp nhận',
                'processing': 'Hồ sơ đang được xử lý',
                'waiting': 'Hồ sơ cần bổ sung giấy tờ',
                'completed': 'Hồ sơ đã hoàn thành'
            };

            await db.collection('messages').add({
                conversationId: this.currentConversation.id,
                senderId: 'bot',
                senderName: 'Hệ thống',
                text: `📋 Cập nhật trạng thái: ${statusMessages[newStatus]}`,
                timestamp: new Date(),
                status: 'sent'
            });

            this.showNotification('Cập nhật trạng thái thành công', 'success');

        } catch (error) {
            console.error('Error updating customer status:', error);
            this.showNotification('Lỗi cập nhật trạng thái', 'error');
        }
    }

    async showNewConversationModal() {
        try {
            const customersSnapshot = await db.collection('customers').get();
            const customers = [];
            customersSnapshot.forEach(doc => {
                customers.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Tạo cuộc trò chuyện mới</h3>
                        <button class="btn-close" onclick="this.closest('.modal-overlay').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="conversationType">Loại cuộc trò chuyện</label>
                            <select id="conversationType" class="form-control">
                                <option value="customer">Chat với khách hàng</option>
                                <option value="internal">Chat nội bộ</option>
                            </select>
                        </div>
                        <div class="form-group" id="customerSelectionGroup">
                            <label for="customerSelect">Chọn khách hàng</label>
                            <select id="customerSelect" class="form-control">
                                <option value="">Chọn khách hàng...</option>
                                ${customers.map(customer => `
                                    <option value="${customer.id}">${customer.fullName} - ${customer.phone}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="conversationTitle">Tiêu đề cuộc trò chuyện</label>
                            <input type="text" id="conversationTitle" class="form-control" placeholder="Nhập tiêu đề...">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Hủy</button>
                        <button class="btn-primary" onclick="chatManager.createConversation()">Tạo</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const typeSelect = modal.querySelector('#conversationType');
            const customerGroup = modal.querySelector('#customerSelectionGroup');
            
            typeSelect.addEventListener('change', (e) => {
                customerGroup.style.display = e.target.value === 'customer' ? 'block' : 'none';
            });

        } catch (error) {
            console.error('Error showing new conversation modal:', error);
            this.showNotification('Lỗi hiển thị modal', 'error');
        }
    }

    async createConversation() {
        try {
            const modal = document.querySelector('.modal-overlay');
            const type = modal.querySelector('#conversationType').value;
            const customerId = modal.querySelector('#customerSelect').value;
            const title = modal.querySelector('#conversationTitle').value;

            if (!title.trim()) {
                this.showNotification('Vui lòng nhập tiêu đề cuộc trò chuyện', 'error');
                return;
            }

            if (type === 'customer' && !customerId) {
                this.showNotification('Vui lòng chọn khách hàng', 'error');
                return;
            }

            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const conversationData = {
                title: title,
                type: type,
                participants: [currentUser.uid],
                lastMessage: 'Cuộc trò chuyện mới được tạo',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            if (type === 'customer') {
                conversationData.customerId = customerId;
            }

            const conversationRef = await db.collection('conversations').add(conversationData);

            await db.collection('messages').add({
                conversationId: conversationRef.id,
                senderId: 'bot',
                senderName: 'Hệ thống',
                text: 'Cuộc trò chuyện mới được tạo',
                timestamp: new Date(),
                status: 'sent'
            });

            modal.remove();
            this.selectConversation(conversationRef.id);
            this.showNotification('Tạo cuộc trò chuyện thành công', 'success');

        } catch (error) {
            console.error('Error creating conversation:', error);
            this.showNotification('Lỗi tạo cuộc trò chuyện', 'error');
        }
    }

    async deleteConversation(conversationId) {
        if (!confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) return;

        try {
            const messagesSnapshot = await db.collection('messages')
                .where('conversationId', '==', conversationId)
                .get();
            
            const batch = db.batch();
            messagesSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });

            batch.delete(db.collection('conversations').doc(conversationId));
            await batch.commit();

            if (this.currentConversation?.id === conversationId) {
                this.closeConversation();
            }

            this.showNotification('Xóa cuộc trò chuyện thành công', 'success');

        } catch (error) {
            console.error('Error deleting conversation:', error);
            this.showNotification('Lỗi xóa cuộc trò chuyện', 'error');
        }
    }

    closeConversation() {
        this.currentConversation = null;
        this.currentCustomer = null;
        this.updateConversationUI();
        
        const messageArea = document.getElementById('messageArea');
        if (messageArea) {
            messageArea.style.display = 'none';
        }
    }

    filterConversations(searchTerm) {
        const items = document.querySelectorAll('.conversation-item');
        items.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
            const matches = title.includes(searchTerm.toLowerCase()) || 
                           preview.includes(searchTerm.toLowerCase());
            item.style.display = matches ? 'flex' : 'none';
        });
    }

    formatTime(timestamp) {
        if (!timestamp) return '';
        
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Vừa xong';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} ngày trước`;
        
        return date.toLocaleDateString('vi-VN');
    }

    formatMessage(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
    }

    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Đang tải...</p>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

let chatManager;
document.addEventListener('DOMContentLoaded', () => {
    chatManager = new ChatManager();
}); 
