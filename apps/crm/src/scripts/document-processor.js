// Document Processor - Quản lý và xử lý hồ sơ
class DocumentProcessor {
    constructor() {
        this.documents = [];
        this.filters = {
            status: '',
            product: '',
            search: ''
        };
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            await this.checkAuth();
            await this.loadDocuments();
            this.setupEventListeners();
            this.updateStatistics();
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing Document Processor:', error);
            this.showError('Lỗi khi khởi tạo hệ thống');
        }
    }

    async checkAuth() {
        return new Promise((resolve, reject) => {
            // Check if Firebase auth is available
            if (typeof auth === 'undefined') {
                console.warn('Firebase auth not available, skipping authentication');
                this.currentUser = { uid: 'test-user', email: 'test@example.com' };
                resolve();
                return;
            }
            
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = user;
                    await this.loadUserInfo();
                    resolve();
                } else {
                    console.warn('User not authenticated, redirecting to login');
                    window.location.href = 'login.html';
                    reject('Chưa đăng nhập');
                }
            });
        });
    }

    async loadUserInfo() {
        try {
            // Check if Firebase db is available
            if (typeof db === 'undefined') {
                console.warn('Firebase db not available, using test data');
                document.getElementById('userName').textContent = this.currentUser.email || 'Test User';
                document.getElementById('userRole').textContent = 'Nhân viên';
                return;
            }
            
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                document.getElementById('userName').textContent = userData.name || userData.email;
                document.getElementById('userRole').textContent = userData.role || 'Nhân viên';
            }
        } catch (error) {
            console.error('Error loading user info:', error);
            // Fallback to test data
            document.getElementById('userName').textContent = this.currentUser.email || 'Test User';
            document.getElementById('userRole').textContent = 'Nhân viên';
        }
    }

    async loadDocuments() {
        try {
            // Check if Firebase db is available
            if (typeof db === 'undefined') {
                console.warn('Firebase db not available, using test data');
                this.documents = [
                    {
                        id: 'test-001',
                        title: 'Hồ sơ Upper Doanh nghiệp #001',
                        productType: 'upper-doanh-nghiep',
                        status: 'pending',
                        customerName: 'Công ty ABC',
                        createdAt: new Date(),
                        urgency: 'normal'
                    },
                    {
                        id: 'test-002',
                        title: 'Hồ sơ Tax Plus 500 #002',
                        productType: 'tax-plus-500',
                        status: 'processing',
                        customerName: 'Công ty XYZ',
                        createdAt: new Date(),
                        urgency: 'urgent'
                    }
                ];
                this.renderDocuments();
                return;
            }
            
            const documentsSnapshot = await db.collection('documents').orderBy('createdAt', 'desc').get();
            this.documents = [];
            
            documentsSnapshot.forEach(doc => {
                this.documents.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            this.renderDocuments();
        } catch (error) {
            console.error('Error loading documents:', error);
            this.showError('Lỗi khi tải danh sách hồ sơ');
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.filterDocuments();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.filterDocuments();
            });
        }

        // Product filter
        const productFilter = document.getElementById('productFilter');
        if (productFilter) {
            productFilter.addEventListener('change', (e) => {
                this.filters.product = e.target.value;
                this.filterDocuments();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Upload area
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#3b82f6';
                uploadArea.style.background = '#f8fafc';
            });
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#e2e8f0';
                uploadArea.style.background = 'white';
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#e2e8f0';
                uploadArea.style.background = 'white';
                const files = e.dataTransfer.files;
                this.handleFileSelection(files);
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFileSelection(e.target.files);
            });
        }

        // Chat input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }
    }

    handleFileSelection(files) {
        const fileList = document.getElementById('fileList');
        const uploadPreview = document.getElementById('uploadPreview');
        
        if (files.length > 0) {
            uploadPreview.style.display = 'block';
            fileList.innerHTML = '';

            Array.from(files).forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-info">
                        <i class="fas fa-file"></i>
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${this.formatFileSize(file.size)}</span>
                    </div>
                    <button class="remove-file" onclick="documentProcessor.removeFile(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                fileList.appendChild(fileItem);
            });
        }
    }

    removeFile(index) {
        const fileInput = document.getElementById('fileInput');
        const dt = new DataTransfer();
        const files = fileInput.files;

        for (let i = 0; i < files.length; i++) {
            if (i !== index) {
                dt.items.add(files[i]);
            }
        }

        fileInput.files = dt.files;
        this.handleFileSelection(fileInput.files);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    filterDocuments() {
        let filteredDocs = this.documents;

        // Filter by search
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filteredDocs = filteredDocs.filter(doc => 
                doc.customerName?.toLowerCase().includes(searchTerm) ||
                doc.productType?.toLowerCase().includes(searchTerm) ||
                doc.description?.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by status
        if (this.filters.status) {
            filteredDocs = filteredDocs.filter(doc => doc.status === this.filters.status);
        }

        // Filter by product
        if (this.filters.product) {
            filteredDocs = filteredDocs.filter(doc => doc.productType === this.filters.product);
        }

        this.renderDocuments(filteredDocs);
    }

    renderDocuments(documents = this.documents) {
        const documentsGrid = document.getElementById('documentsGrid');
        
        if (!documentsGrid) return;

        if (documents.length === 0) {
            documentsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>Chưa có hồ sơ nào</h3>
                    <p>Bắt đầu bằng cách tạo hồ sơ mới hoặc upload tài liệu</p>
                </div>
            `;
            return;
        }

        documentsGrid.innerHTML = documents.map(doc => this.createDocumentCard(doc)).join('');
    }

    createDocumentCard(doc) {
        const statusClass = `status-${doc.status}`;
        const statusText = this.getStatusText(doc.status);
        const productText = this.getProductText(doc.productType);
        const createdAt = doc.createdAt ? new Date(doc.createdAt.toDate()).toLocaleDateString('vi-VN') : 'N/A';

        return `
            <div class="document-card" onclick="documentProcessor.viewDocument('${doc.id}')">
                <div class="document-header">
                    <div>
                        <h4 class="document-title">${doc.customerName || 'Khách hàng mới'}</h4>
                        <span class="document-status ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="document-info">
                    <p><strong>Sản phẩm:</strong> ${productText}</p>
                    <p><strong>Ngày tạo:</strong> ${createdAt}</p>
                    <p><strong>Mô tả:</strong> ${doc.description || 'Không có mô tả'}</p>
                </div>
                <div class="document-actions">
                    <button class="btn-view" onclick="event.stopPropagation(); documentProcessor.viewDocument('${doc.id}')">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                    <button class="btn-edit" onclick="event.stopPropagation(); documentProcessor.editDocument('${doc.id}')">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn-delete" onclick="event.stopPropagation(); documentProcessor.deleteDocument('${doc.id}')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'completed': 'Hoàn thành',
            'urgent': 'Khẩn cấp'
        };
        return statusMap[status] || status;
    }

    getProductText(productType) {
        const productMap = {
            'upper-doanh-nghiep': 'Upper Doanh nghiệp',
            'tax-plus-500': 'Tax Plus 500',
            'upper-tax-ho-kinh-doanh': 'Upper Tax Hộ Kinh doanh'
        };
        return productMap[productType] || productType;
    }

    updateStatistics() {
        const stats = {
            pending: 0,
            processing: 0,
            completed: 0,
            urgent: 0
        };

        this.documents.forEach(doc => {
            if (stats.hasOwnProperty(doc.status)) {
                stats[doc.status]++;
            }
        });

        document.getElementById('pendingCount').textContent = stats.pending;
        document.getElementById('processingCount').textContent = stats.processing;
        document.getElementById('completedCount').textContent = stats.completed;
        document.getElementById('urgentCount').textContent = stats.urgent;
    }

    async viewDocument(docId) {
        try {
            const doc = this.documents.find(d => d.id === docId);
            if (doc) {
                // TODO: Implement document view modal
                alert(`Xem hồ sơ: ${doc.customerName}`);
            }
        } catch (error) {
            console.error('Error viewing document:', error);
            this.showError('Lỗi khi xem hồ sơ');
        }
    }

    async editDocument(docId) {
        try {
            const doc = this.documents.find(d => d.id === docId);
            if (doc) {
                // TODO: Implement document edit modal
                alert(`Sửa hồ sơ: ${doc.customerName}`);
            }
        } catch (error) {
            console.error('Error editing document:', error);
            this.showError('Lỗi khi sửa hồ sơ');
        }
    }

    async deleteDocument(docId) {
        if (confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) {
            try {
                await db.collection('documents').doc(docId).delete();
                this.documents = this.documents.filter(d => d.id !== docId);
                this.renderDocuments();
                this.updateStatistics();
                this.showSuccess('Đã xóa hồ sơ thành công');
            } catch (error) {
                console.error('Error deleting document:', error);
                this.showError('Lỗi khi xóa hồ sơ');
            }
        }
    }

    async uploadFiles() {
        const fileInput = document.getElementById('fileInput');
        const files = fileInput.files;

        if (files.length === 0) {
            this.showError('Vui lòng chọn file để upload');
            return;
        }

        try {
            this.showLoading('Đang upload files...');

            for (let file of files) {
                await this.processUploadedFile(file);
            }

            this.showSuccess('Upload thành công! AI đang phân tích tài liệu...');
            this.closeUploadModal();
            await this.loadDocuments();

        } catch (error) {
            console.error('Error uploading files:', error);
            this.showError('Lỗi khi upload files');
        } finally {
            this.hideLoading();
        }
    }

    async processUploadedFile(file) {
        // Create document record
        const docData = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            status: 'pending',
            productType: this.detectProductType(file.name),
            createdAt: new Date(),
            createdBy: this.currentUser.uid,
            description: `File upload: ${file.name}`,
            customerName: 'Khách hàng mới'
        };

        const docRef = await db.collection('documents').add(docData);

        // Upload file to storage
        const storageRef = storage.ref(`documents/${docRef.id}/${file.name}`);
        await storageRef.put(file);

        // Get download URL
        const downloadURL = await storageRef.getDownloadURL();

        // Update document with file URL
        await db.collection('documents').doc(docRef.id).update({
            fileURL: downloadURL
        });

        // Trigger AI analysis
        this.triggerAIAnalysis(docRef.id, file);
    }

    detectProductType(fileName) {
        const lowerFileName = fileName.toLowerCase();
        
        if (lowerFileName.includes('doanh nghiệp') || lowerFileName.includes('business')) {
            return 'upper-doanh-nghiep';
        } else if (lowerFileName.includes('tax plus') || lowerFileName.includes('500')) {
            return 'tax-plus-500';
        } else if (lowerFileName.includes('hộ kinh doanh') || lowerFileName.includes('household')) {
            return 'upper-tax-ho-kinh-doanh';
        }
        
        return 'unknown';
    }

    async triggerAIAnalysis(docId, file) {
        try {
            // Send to AI Document Reader for analysis
            const aiReader = new AIDocumentReader();
            await aiReader.analyzeDocument(docId, file);
        } catch (error) {
            console.error('Error triggering AI analysis:', error);
        }
    }

    // Modal functions
    openUploadModal() {
        document.getElementById('uploadModal').style.display = 'block';
    }

    closeUploadModal() {
        document.getElementById('uploadModal').style.display = 'none';
        document.getElementById('fileInput').value = '';
        document.getElementById('uploadPreview').style.display = 'none';
    }

    openAIChatbot() {
        document.getElementById('aiChatbotModal').style.display = 'block';
    }

    closeAIChatbot() {
        document.getElementById('aiChatbotModal').style.display = 'none';
    }

    async sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Process with AI
        try {
            const aiReader = new AIDocumentReader();
            const response = await aiReader.processChatMessage(message, this.documents);
            this.addChatMessage(response, 'bot');
        } catch (error) {
            console.error('Error processing chat message:', error);
            this.addChatMessage('Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn.', 'bot');
        }
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    resetFilters() {
        this.filters = {
            status: '',
            product: '',
            search: ''
        };
        
        document.getElementById('searchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('productFilter').value = '';
        
        this.renderDocuments();
    }

    async logout() {
        try {
            await auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    // Utility functions
    showLoading(message = 'Đang tải...') {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.querySelector('p').textContent = message;
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    showSuccess(message) {
        // TODO: Implement toast notification
        alert(message);
    }

    showError(message) {
        // TODO: Implement toast notification
        alert('Lỗi: ' + message);
    }
}

// Global functions for HTML onclick handlers
function openUploadModal() {
    documentProcessor.openUploadModal();
}

function closeUploadModal() {
    documentProcessor.closeUploadModal();
}

function uploadFiles() {
    documentProcessor.uploadFiles();
}

function openAIChatbot() {
    documentProcessor.openAIChatbot();
}

function closeAIChatbot() {
    documentProcessor.closeAIChatbot();
}

function sendChatMessage() {
    documentProcessor.sendChatMessage();
}

function resetFilters() {
    documentProcessor.resetFilters();
}

// Initialize Document Processor
let documentProcessor;
document.addEventListener('DOMContentLoaded', () => {
    documentProcessor = new DocumentProcessor();
});
