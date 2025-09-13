// Documents Management System
class DocumentsManager {
    constructor() {
        this.documents = [];
        this.currentUser = null;
        this.employees = [];
        this.selectedFiles = [];
        this.currentView = 'grid';
        this.documentsRef = db.collection('documents');
        this.employeesRef = db.collection('users');
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.loadEmployees();
        this.loadDocuments();
        this.setupEventListeners();
        this.updateStats();

        // XMLGuard Simple - Kiểm tra XML
        const validateBtn = document.getElementById('validateXmlBtn');
        const xmlInput = document.getElementById('xmlValidateInput');
        if (validateBtn && xmlInput && window.XMLGuard) {
            validateBtn.addEventListener('click', () => xmlInput.click());
            xmlInput.addEventListener('change', async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                try {
                    const res = await window.XMLGuard.validateXmlFile(file);
                    const ok = !!res.ok;
                    const msg = ok ? 'XML hợp lệ' : `XML không đạt: ${ (res.issues||[]).join(', ') }`;
                    alert(`${msg}\nChecksum: ${res.checksum||'-'}\nMST: ${res.fingerprint?.mst||'-'}\nMã TK: ${res.fingerprint?.maTKhai||'-'}\nKiểu ký: ${res.fingerprint?.kieuKy||'-'}\nSố lần: ${res.fingerprint?.soLan||'-'}`);
                } catch (err) {
                    alert('Lỗi khi kiểm tra XML');
                } finally {
                    e.target.value = '';
                }
            });
        }

        // XMLGuard Overwrite - Ghi đè XML fake
        const overwriteBtn = document.getElementById('overwriteXmlBtn');
        const xmlOverwriteInput = document.getElementById('xmlOverwriteInput');
        if (overwriteBtn && xmlOverwriteInput && window.XMLGuardOverwrite) {
            overwriteBtn.addEventListener('click', () => xmlOverwriteInput.click());
            xmlOverwriteInput.addEventListener('change', async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                try {
                    // Đọc nội dung file
                    const content = await file.text();

                    // Phân tích file
                    const analysis = window.XMLGuardOverwrite.analyzeXmlFile(content);

                    if (analysis.isFake) {
                        const confirmOverwrite = confirm(
                            `⚠️ PHÁT HIỆN FILE XML FAKE!\n\n` +
                            `Vấn đề: ${analysis.issues.join(', ')}\n` +
                            `MST: ${analysis.fingerprint.mst || 'N/A'}\n` +
                            `FormCode: ${analysis.fingerprint.formCode || 'N/A'}\n\n` +
                            `Bạn có muốn ghi đè bằng nội dung chính thức không?`
                        );

                        if (confirmOverwrite) {
                            // Tạo file tạm để test ghi đè
                            const tempPath = `temp_${Date.now()}_${file.name}`;

                            // Simulate overwrite (trong browser chỉ có thể download)
                            const officialContent = this.generateOfficialXml(analysis.fingerprint);

                            // Tạo download link cho file đã ghi đè
                            const blob = new Blob([officialContent], { type: 'text/xml' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `OFFICIAL_${file.name}`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);

                            alert('✅ File đã được ghi đè và tải xuống!\nTên file: OFFICIAL_' + file.name);

                            // Log hoạt động
                            await this.logOverwriteActivity(file.name, analysis);
                        }
                    } else {
                        alert('✅ File XML hợp lệ, không cần ghi đè');
                    }
                } catch (err) {
                    alert('❌ Lỗi khi xử lý XML: ' + err.message);
                } finally {
                    e.target.value = '';
                }
            });
        }
    }

    setupEventListeners() {
        // Search and filters
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const customerFilter = document.getElementById('customerFilter');

        if (searchInput) searchInput.addEventListener('input', () => this.filterDocuments());
        if (typeFilter) typeFilter.addEventListener('change', () => this.filterDocuments());
        if (customerFilter) customerFilter.addEventListener('change', () => this.filterDocuments());

        // Upload modal listeners
        const uploadModal = document.getElementById('uploadModal');
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('active');
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('active');
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('active');
                fileInput.files = e.dataTransfer.files;
                this.handleFileSelection(fileInput.files);
            });
            fileInput.addEventListener('change', (e) => this.handleFileSelection(e.target.files));
        }
    }

    filterDocuments() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value;
        const customerFilter = document.getElementById('customerFilter').value;

        const filtered = this.documents.filter(doc => {
            const matchesSearch = !searchTerm ||
                (doc.fileName || '').toLowerCase().includes(searchTerm) ||
                (doc.description || '').toLowerCase().includes(searchTerm);

            const matchesType = !typeFilter || doc.fileType.startsWith(typeFilter);

            const matchesCustomer = !customerFilter || doc.customerId === customerFilter;

            return matchesSearch && matchesType && matchesCustomer;
        });

        this.renderDocuments(filtered);
    }

    async loadCurrentUser() {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const userDoc = await this.employeesRef.doc(user.uid).get();
                if (userDoc.exists) {
                    this.currentUser = { id: user.uid, ...userDoc.data() };
                }
            }
        } catch (error) {
            console.error('Error loading current user:', error);
        }
    }

    async loadEmployees() {
        try {
            const snapshot = await this.employeesRef.get();
            this.employees = [];
            snapshot.forEach(doc => {
                this.employees.push({ id: doc.id, ...doc.data() });
            });
            this.populateCreatorFilter();
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }

    populateCreatorFilter() {
        const creatorFilter = document.getElementById('creatorFilter');
        if (creatorFilter) {
            creatorFilter.innerHTML = '<option value="">Tất cả</option>';
            this.employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = employee.fullName || employee.email;
                creatorFilter.appendChild(option);
            });
        }
    }

    async loadDocuments() {
        try {
            const snapshot = await this.documentsRef.get();
            this.documents = [];
            snapshot.forEach(doc => {
                this.documents.push({ id: doc.id, ...doc.data() });
            });
            this.renderDocuments();
        } catch (error) {
            console.error('Error loading documents:', error);
            this.showNotification('Lỗi khi tải danh sách tài liệu', 'error');
        }
    }

    renderDocuments() {
        const grid = document.getElementById('documentsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        if (this.documents.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-file-alt" style="font-size: 4rem; color: #667eea; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <h3 style="color: #2c3e50; margin-bottom: 0.5rem;">Chưa có tài liệu nào</h3>
                    <p style="color: #6c757d;">Bắt đầu bằng cách tải lên tài liệu đầu tiên</p>
                </div>
            `;
            return;
        }

        this.documents.forEach(document => {
            const card = document.createElement('div');
            card.className = 'document-card';
            card.onclick = () => this.openDocumentDetail(document.id);

            const fileType = this.getFileType(document.fileName);
            const fileSize = this.formatFileSize(document.fileSize);

            card.innerHTML = `
                <div class="document-icon ${fileType}">
                    <i class="fas ${this.getFileIcon(fileType)}"></i>
                </div>
                <div class="document-info">
                    <div class="document-name">${document.fileName}</div>
                    <div class="document-meta">
                        <span>${fileSize}</span>
                        <span>${this.formatDate(document.uploadedAt)}</span>
                        <div class="document-category">${this.getCategoryDisplayName(document.category)}</div>
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn-download" onclick="event.stopPropagation(); documentsManager.downloadDocument('${document.id}')" title="Tải xuống">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-preview" onclick="event.stopPropagation(); documentsManager.previewDocument('${document.id}')" title="Xem trước">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-share" onclick="event.stopPropagation(); documentsManager.shareDocument('${document.id}')" title="Chia sẻ">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="btn-delete" onclick="event.stopPropagation(); documentsManager.deleteDocument('${document.id}')" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    filterDocuments() {
        const searchTerm = document.getElementById('searchDocument')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const creatorFilter = document.getElementById('creatorFilter')?.value || '';

        const filtered = this.documents.filter(document => {
            const matchesSearch = document.fileName.toLowerCase().includes(searchTerm) ||
                                document.description?.toLowerCase().includes(searchTerm) ||
                                document.tags?.some(tag => tag.toLowerCase().includes(searchTerm));

            const matchesType = !typeFilter || this.getFileType(document.fileName) === typeFilter;
            const matchesCategory = !categoryFilter || document.category === categoryFilter;
            const matchesCreator = !creatorFilter || document.uploadedBy === creatorFilter;

            return matchesSearch && matchesType && matchesCategory && matchesCreator;
        });

        this.renderFilteredDocuments(filtered);
    }

    renderFilteredDocuments(filteredDocuments) {
        const grid = document.getElementById('documentsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        if (filteredDocuments.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 4rem; color: #667eea; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <h3 style="color: #2c3e50; margin-bottom: 0.5rem;">Không tìm thấy tài liệu</h3>
                    <p style="color: #6c757d;">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            `;
            return;
        }

        filteredDocuments.forEach(document => {
            const card = document.createElement('div');
            card.className = 'document-card';
            card.onclick = () => this.openDocumentDetail(document.id);

            const fileType = this.getFileType(document.fileName);
            const fileSize = this.formatFileSize(document.fileSize);

            card.innerHTML = `
                <div class="document-icon ${fileType}">
                    <i class="fas ${this.getFileIcon(fileType)}"></i>
                </div>
                <div class="document-info">
                    <div class="document-name">${document.fileName}</div>
                    <div class="document-meta">
                        <span>${fileSize}</span>
                        <span>${this.formatDate(document.uploadedAt)}</span>
                        <div class="document-category">${this.getCategoryDisplayName(document.category)}</div>
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn-download" onclick="event.stopPropagation(); documentsManager.downloadDocument('${document.id}')" title="Tải xuống">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-preview" onclick="event.stopPropagation(); documentsManager.previewDocument('${document.id}')" title="Xem trước">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-share" onclick="event.stopPropagation(); documentsManager.shareDocument('${document.id}')" title="Chia sẻ">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="btn-delete" onclick="event.stopPropagation(); documentsManager.deleteDocument('${document.id}')" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
            </div>
        `;
            grid.appendChild(card);
        });
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.selectedFiles = [...this.selectedFiles, ...files];
        this.renderFilePreview();
    }

    handleDragOver(event) {
        event.preventDefault();
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.classList.add('dragover');
        }
    }

    handleDragLeave(event) {
        event.preventDefault();
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.classList.remove('dragover');
        }
    }

    handleDrop(event) {
        event.preventDefault();
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.classList.remove('dragover');
        }

        const files = Array.from(event.dataTransfer.files);
        this.selectedFiles = [...this.selectedFiles, ...files];
        this.renderFilePreview();
    }

    renderFilePreview() {
        const preview = document.getElementById('filePreview');
        if (!preview) return;

            preview.innerHTML = '';

        this.selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            const fileType = this.getFileType(file.name);

            fileItem.innerHTML = `
                <div class="file-icon">
                    <i class="fas ${this.getFileIcon(fileType)}"></i>
                </div>
                    <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
                <button class="file-remove" onclick="documentsManager.removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(fileItem);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.renderFilePreview();
    }

    async handleUpload(event) {
        event.preventDefault();

        if (this.selectedFiles.length === 0) {
            this.showNotification('Vui lòng chọn ít nhất một file', 'error');
            return;
        }

        const category = document.getElementById('documentCategory').value;
        const tags = document.getElementById('documentTags').value;
        const description = document.getElementById('documentDescription').value;

        if (!category) {
            this.showNotification('Vui lòng chọn danh mục', 'error');
            return;
        }

        try {
            for (const file of this.selectedFiles) {
                await this.uploadFile(file, category, tags, description);
            }

            this.showNotification('Tải lên tài liệu thành công', 'success');
            this.closeUploadModal();
            this.loadDocuments();
            this.updateStats();
        } catch (error) {
            console.error('Error uploading files:', error);
            this.showNotification('Lỗi khi tải lên tài liệu', 'error');
        }
    }

    async uploadFile(file, category, tags, description) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`documents/${Date.now()}_${file.name}`);

        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();

        const documentData = {
            fileName: file.name,
            fileSize: file.size,
            fileType: this.getFileType(file.name),
            downloadURL: downloadURL,
            category: category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            description: description,
            uploadedBy: this.currentUser?.id,
            uploadedAt: Date.now(),
            downloadCount: 0,
            isPublic: false
        };

        await documentsRef.add(documentData);
    }

    async downloadDocument(documentId) {
        try {
            const doc = await documentsRef.doc(documentId).get();
            if (!doc.exists) {
                this.showNotification('Tài liệu không tồn tại', 'error');
                return;
            }

            const document = doc.data();

            // Update download count
            await documentsRef.doc(documentId).update({
                downloadCount: (document.downloadCount || 0) + 1
            });

            // Create download link
            const link = document.createElement('a');
            link.href = document.downloadURL;
            link.download = document.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification('Đang tải xuống tài liệu', 'success');
            this.loadDocuments();
            this.updateStats();
        } catch (error) {
            console.error('Error downloading document:', error);
            this.showNotification('Lỗi khi tải xuống tài liệu', 'error');
        }
    }

    previewDocument(documentId) {
        // This would typically open a preview modal or redirect to a preview page
        this.showNotification('Tính năng xem trước đang được phát triển', 'info');
    }

    shareDocument(documentId) {
        // This would typically open a share modal
        this.showNotification('Tính năng chia sẻ đang được phát triển', 'info');
    }

    async deleteDocument(documentId) {
        if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
            return;
        }

        try {
            const doc = await documentsRef.doc(documentId).get();
            if (!doc.exists) {
                this.showNotification('Tài liệu không tồn tại', 'error');
                return;
            }

            const document = doc.data();

                // Delete from storage
            const storageRef = firebase.storage().refFromURL(document.downloadURL);
                await storageRef.delete();

            // Delete from Firestore
            await documentsRef.doc(documentId).delete();

            this.showNotification('Đã xóa tài liệu', 'success');
            this.loadDocuments();
            this.updateStats();
            } catch (error) {
                console.error('Error deleting document:', error);
            this.showNotification('Lỗi khi xóa tài liệu', 'error');
        }
    }

    openDocumentDetail(documentId) {
        // This would typically open a detail modal
        this.showNotification('Tính năng xem chi tiết đang được phát triển', 'info');
    }

    updateStats() {
        const totalDocuments = this.documents.length;
        const totalFolders = 0; // Would be calculated if folders are implemented
        const totalDownloads = this.documents.reduce((sum, doc) => sum + (doc.downloadCount || 0), 0);
        const totalSize = this.documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

        document.getElementById('totalDocuments').textContent = totalDocuments;
        document.getElementById('totalFolders').textContent = totalFolders;
        document.getElementById('totalDownloads').textContent = totalDownloads;
        document.getElementById('totalSize').textContent = this.formatFileSize(totalSize);
    }

    getFileType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        if (extension === 'pdf') return 'pdf';
        if (['doc', 'docx'].includes(extension)) return 'doc';
        if (['xls', 'xlsx'].includes(extension)) return 'xls';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'img';
        return 'other';
    }

    getFileIcon(fileType) {
        const icons = {
            'pdf': 'fa-file-pdf',
            'doc': 'fa-file-word',
            'xls': 'fa-file-excel',
            'img': 'fa-file-image',
            'other': 'fa-file'
        };
        return icons[fileType] || 'fa-file';
    }

    getCategoryDisplayName(category) {
        const categories = {
            'contracts': 'Hợp đồng',
            'reports': 'Báo cáo',
            'invoices': 'Hóa đơn',
            'tax': 'Thuế',
            'other': 'Khác'
        };
        return categories[category] || 'Khác';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN');
    }

    // Tạo XML chính thức mẫu
    generateOfficialXml(fingerprint) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="http://www.gdt.gov.vn/2014/XMLSchema">
  <mst>${fingerprint.mst || '0123456789'}</mst>
  <formCode>${fingerprint.formCode || '01GTKT'}</formCode>
  <period>${fingerprint.period || '2024'}</period>
  <amount>${fingerprint.amount || '1000000'}</amount>
  <maTKhai>01</maTKhai>
  <kieuKy>1</kieuKy>
  <soLan>1</soLan>
  <ngayKy>${new Date().toISOString().split('T')[0]}</ngayKy>
  <nguoiKy>Hệ thống chính thức</nguoiKy>
  <trangThai>Hợp lệ</trangThai>
  <ghiChu>File đã được XMLGuard xác thực và ghi đè</ghiChu>
  <xmlGuardInfo>
    <overwriteTime>${new Date().toISOString()}</overwriteTime>
    <originalIssues>${fingerprint.issues ? fingerprint.issues.join(', ') : 'N/A'}</originalIssues>
    <checksum>${this.calculateChecksum(JSON.stringify(fingerprint))}</checksum>
  </xmlGuardInfo>
</Invoice>`;
    }

    // Log hoạt động ghi đè
    async logOverwriteActivity(fileName, analysis) {
        try {
            const logData = {
                timestamp: new Date(),
                fileName: fileName,
                action: 'OVERWRITE',
                fingerprint: analysis.fingerprint,
                issues: analysis.issues,
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            if (typeof db !== 'undefined' && db) {
                await db.collection('xmlguard_overwrite_logs').add(logData);
                console.log('Overwrite activity logged to Firestore');
            }
        } catch (error) {
            console.error('Error logging overwrite activity:', error);
        }
    }

    // Tính checksum đơn giản
    calculateChecksum(content) {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
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
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)';
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

// Global functions
function openUploadModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('uploadForm').reset();
    documentsManager.selectedFiles = [];
    documentsManager.renderFilePreview();
}

function closeDocumentModal() {
    document.getElementById('documentModal').style.display = 'none';
}

function switchView(view) {
    const grid = document.getElementById('documentsGrid');
    const buttons = document.querySelectorAll('.btn-view');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.btn-view').classList.add('active');

    if (view === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }

    documentsManager.currentView = view;
}

// Initialize
let documentsManager;

document.addEventListener('DOMContentLoaded', () => {
    documentsManager = new DocumentsManager();
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
