// AI Assistant with Learning Capabilities and Data Sync
class AIAssistant {
    constructor() {
        this.conversationHistory = [];
        this.learningData = {};
        this.syncData = {};
        this.init();
    }

    async init() {
        try {
            await this.loadLearningData();
            await this.setupSyncSystem();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing AI Assistant:', error);
        }
    }

    async loadLearningData() {
        try {
            // Load learning data from Firestore
            const learningSnapshot = await db.collection('ai_learning').get();
            learningSnapshot.forEach(doc => {
                this.learningData[doc.id] = doc.data();
            });
        } catch (error) {
            console.error('Error loading learning data:', error);
        }
    }

    async setupSyncSystem() {
        try {
            // Setup real-time sync for customer data
            const customersRef = db.collection('customers');
            customersRef.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified') {
                        this.updateSyncData('customer', change.doc.id, change.doc.data());
                    }
                });
            });

            // Setup real-time sync for task data
            const tasksRef = db.collection('tasks');
            tasksRef.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified') {
                        this.updateSyncData('task', change.doc.id, change.doc.data());
                    }
                });
            });

        } catch (error) {
            console.error('Error setting up sync system:', error);
        }
    }

    updateSyncData(type, id, data) {
        if (!this.syncData[type]) {
            this.syncData[type] = {};
        }
        this.syncData[type][id] = data;
        
        // Trigger UI updates if needed
        this.notifyDataChange(type, id, data);
    }

    notifyDataChange(type, id, data) {
        // Emit custom event for UI updates
        const event = new CustomEvent('aiDataSync', {
            detail: { type, id, data }
        });
        document.dispatchEvent(event);
    }

    setupEventListeners() {
        // Listen for data sync events
        document.addEventListener('aiDataSync', (event) => {
            this.handleDataSync(event.detail);
        });

        // Listen for user interactions
        document.addEventListener('userInteraction', (event) => {
            this.learnFromInteraction(event.detail);
        });
    }

    handleDataSync(syncInfo) {
        // Update AI knowledge based on data changes
        switch (syncInfo.type) {
            case 'customer':
                this.updateCustomerKnowledge(syncInfo.id, syncInfo.data);
                break;
            case 'task':
                this.updateTaskKnowledge(syncInfo.id, syncInfo.data);
                break;
            case 'conversation':
                this.updateConversationKnowledge(syncInfo.id, syncInfo.data);
                break;
        }
    }

    updateCustomerKnowledge(customerId, customerData) {
        // Update AI knowledge about customer
        if (!this.learningData.customers) {
            this.learningData.customers = {};
        }
        
        this.learningData.customers[customerId] = {
            name: customerData.fullName,
            status: customerData.status,
            type: customerData.customerType,
            lastUpdate: new Date(),
            history: customerData.history || []
        };
    }

    updateTaskKnowledge(taskId, taskData) {
        // Update AI knowledge about tasks
        if (!this.learningData.tasks) {
            this.learningData.tasks = {};
        }
        
        this.learningData.tasks[taskId] = {
            title: taskData.title,
            status: taskData.status,
            priority: taskData.priority,
            assignedTo: taskData.assignedTo,
            lastUpdate: new Date()
        };
    }

    updateConversationKnowledge(conversationId, conversationData) {
        // Update AI knowledge about conversations
        if (!this.learningData.conversations) {
            this.learningData.conversations = {};
        }
        
        this.learningData.conversations[conversationId] = {
            type: conversationData.type,
            participants: conversationData.participants,
            lastMessage: conversationData.lastMessage,
            lastUpdate: new Date()
        };
    }

    async learnFromInteraction(interaction) {
        try {
            // Save interaction to learning data
            const interactionId = Date.now().toString();
            
            await db.collection('ai_interactions').doc(interactionId).set({
                type: interaction.type,
                userInput: interaction.input,
                aiResponse: interaction.response,
                context: interaction.context,
                timestamp: new Date(),
                success: interaction.success || false
            });

            // Update local learning data
            if (!this.learningData.interactions) {
                this.learningData.interactions = [];
            }
            this.learningData.interactions.push({
                id: interactionId,
                ...interaction,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error learning from interaction:', error);
        }
    }

    async generateResponse(userInput, context = {}) {
        try {
            // Analyze user input
            const analysis = this.analyzeUserInput(userInput);
            
            // Get relevant data from sync
            const relevantData = this.getRelevantData(analysis, context);
            
            // Generate response based on analysis and data
            const response = await this.createResponse(analysis, relevantData, context);
            
            // Learn from this interaction
            await this.learnFromInteraction({
                type: 'chat',
                input: userInput,
                response: response,
                context: context,
                success: true
            });

            return response;

        } catch (error) {
            console.error('Error generating response:', error);
            return 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.';
        }
    }

    analyzeUserInput(input) {
        const lowerInput = input.toLowerCase();
        
        return {
            intent: this.detectIntent(lowerInput),
            entities: this.extractEntities(lowerInput),
            sentiment: this.analyzeSentiment(lowerInput),
            keywords: this.extractKeywords(lowerInput)
        };
    }

    detectIntent(input) {
        const intents = {
            'status_inquiry': ['tình trạng', 'trạng thái', 'đến đâu', 'xong chưa', 'bao giờ', 'khi nào'],
            'help_request': ['giúp', 'hỗ trợ', 'hướng dẫn', 'làm sao', 'cách nào'],
            'complaint': ['phàn nàn', 'không hài lòng', 'chậm', 'lỗi', 'sai'],
            'appreciation': ['cảm ơn', 'thanks', 'tốt', 'hay', 'hài lòng'],
            'greeting': ['xin chào', 'hello', 'hi', 'chào'],
            'goodbye': ['tạm biệt', 'goodbye', 'bye', 'hẹn gặp lại']
        };

        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => input.includes(keyword))) {
                return intent;
            }
        }

        return 'general_inquiry';
    }

    extractEntities(input) {
        const entities = {
            customer: null,
            task: null,
            status: null,
            date: null
        };

        // Extract customer name patterns
        const customerPatterns = [
            /(?:khách hàng|anh|chị)\s+([a-zA-ZÀ-ỹ\s]+)/i,
            /([a-zA-ZÀ-ỹ\s]+)\s+(?:của tôi|của em)/
        ];

        for (const pattern of customerPatterns) {
            const match = input.match(pattern);
            if (match) {
                entities.customer = match[1].trim();
                break;
            }
        }

        // Extract status keywords
        const statusKeywords = {
            'pending': ['tiếp nhận', 'chờ', 'pending'],
            'processing': ['đang xử lý', 'processing', 'xử lý'],
            'waiting': ['bổ sung', 'thiếu', 'waiting'],
            'completed': ['hoàn thành', 'xong', 'completed']
        };

        for (const [status, keywords] of Object.entries(statusKeywords)) {
            if (keywords.some(keyword => input.includes(keyword))) {
                entities.status = status;
                break;
            }
        }

        return entities;
    }

    analyzeSentiment(input) {
        const positiveWords = ['tốt', 'hay', 'hài lòng', 'cảm ơn', 'thanks', 'tuyệt'];
        const negativeWords = ['không hài lòng', 'chậm', 'lỗi', 'sai', 'tệ', 'kém'];
        
        const positiveCount = positiveWords.filter(word => input.includes(word)).length;
        const negativeCount = negativeWords.filter(word => input.includes(word)).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    extractKeywords(input) {
        const keywords = [];
        const commonKeywords = [
            'hồ sơ', 'thuế', 'doanh nghiệp', 'cá nhân', 'giấy tờ', 'tài liệu',
            'xử lý', 'hoàn thành', 'bổ sung', 'liên hệ', 'thông tin', 'cập nhật'
        ];

        commonKeywords.forEach(keyword => {
            if (input.includes(keyword)) {
                keywords.push(keyword);
            }
        });

        return keywords;
    }

    getRelevantData(analysis, context) {
        const relevantData = {
            customers: [],
            tasks: [],
            conversations: []
        };

        // Get customer data if customer entity is found
        if (analysis.entities.customer && this.learningData.customers) {
            relevantData.customers = Object.values(this.learningData.customers)
                .filter(customer => 
                    customer.name.toLowerCase().includes(analysis.entities.customer.toLowerCase())
                );
        }

        // Get task data based on context
        if (context.customerId && this.learningData.tasks) {
            relevantData.tasks = Object.values(this.learningData.tasks)
                .filter(task => task.customerId === context.customerId);
        }

        // Get conversation history
        if (context.conversationId && this.learningData.conversations) {
            relevantData.conversations = Object.values(this.learningData.conversations)
                .filter(conv => conv.id === context.conversationId);
        }

        return relevantData;
    }

    async createResponse(analysis, relevantData, context) {
        const { intent, entities, sentiment, keywords } = analysis;

        // Handle different intents
        switch (intent) {
            case 'status_inquiry':
                return this.handleStatusInquiry(entities, relevantData, context);
            
            case 'help_request':
                return this.handleHelpRequest(keywords, context);
            
            case 'complaint':
                return this.handleComplaint(sentiment, context);
            
            case 'appreciation':
                return this.handleAppreciation(sentiment);
            
            case 'greeting':
                return this.handleGreeting(context);
            
            case 'goodbye':
                return this.handleGoodbye();
            
            default:
                return this.handleGeneralInquiry(analysis, context);
        }
    }

    handleStatusInquiry(entities, relevantData, context) {
        if (relevantData.customers.length > 0) {
            const customer = relevantData.customers[0];
            const statusMessages = {
                'pending': 'Hồ sơ của bạn đã được tiếp nhận và đang chờ xử lý. Chúng tôi sẽ liên hệ sớm nhất.',
                'processing': 'Hồ sơ của bạn đang được xử lý tích cực. Chúng tôi sẽ cập nhật thông tin khi có tiến triển.',
                'waiting': 'Hồ sơ của bạn cần bổ sung thêm giấy tờ. Vui lòng cung cấp các tài liệu còn thiếu để chúng tôi tiếp tục xử lý.',
                'completed': 'Hồ sơ của bạn đã được hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!'
            };

            return statusMessages[customer.status] || 'Hồ sơ của bạn đang được xử lý. Vui lòng đợi thông báo từ chúng tôi.';
        }

        return 'Tôi không tìm thấy thông tin hồ sơ của bạn. Vui lòng cung cấp thêm thông tin hoặc liên hệ nhân viên hỗ trợ.';
    }

    handleHelpRequest(keywords, context) {
        const helpTopics = {
            'hồ sơ': 'Để kiểm tra tình trạng hồ sơ, bạn có thể hỏi "Hồ sơ của tôi đến đâu rồi?" hoặc cung cấp tên của bạn.',
            'thuế': 'Chúng tôi hỗ trợ các dịch vụ thuế cho cá nhân và doanh nghiệp. Bạn cần hỗ trợ gì cụ thể?',
            'giấy tờ': 'Để biết cần chuẩn bị giấy tờ gì, vui lòng cho biết loại hồ sơ bạn muốn làm.',
            'liên hệ': 'Bạn có thể liên hệ nhân viên hỗ trợ qua chat này hoặc gọi số hotline: 1900-xxxx.'
        };

        for (const keyword of keywords) {
            if (helpTopics[keyword]) {
                return helpTopics[keyword];
            }
        }

        return 'Tôi có thể giúp bạn với các vấn đề về hồ sơ, thuế, giấy tờ. Bạn cần hỗ trợ gì cụ thể?';
    }

    handleComplaint(sentiment, context) {
        if (sentiment === 'negative') {
            return 'Tôi rất tiếc về sự bất tiện này. Chúng tôi sẽ cố gắng cải thiện dịch vụ. Bạn có thể cho biết chi tiết vấn đề để tôi hỗ trợ tốt hơn không?';
        }
        return 'Cảm ơn bạn đã phản hồi. Chúng tôi sẽ xem xét và cải thiện dịch vụ.';
    }

    handleAppreciation(sentiment) {
        if (sentiment === 'positive') {
            return 'Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi! Chúng tôi luôn cố gắng mang đến dịch vụ tốt nhất.';
        }
        return 'Cảm ơn bạn! Chúng tôi rất vui khi được phục vụ bạn.';
    }

    handleGreeting(context) {
        const greetings = [
            'Xin chào! Tôi là trợ lý AI của Anh Bảo Bank. Tôi có thể giúp gì cho bạn?',
            'Chào bạn! Tôi sẵn sàng hỗ trợ bạn với các vấn đề về hồ sơ và dịch vụ.',
            'Xin chào! Bạn cần hỗ trợ gì về dịch vụ của chúng tôi không?'
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    handleGoodbye() {
        const goodbyes = [
            'Tạm biệt! Chúc bạn một ngày tốt lành!',
            'Hẹn gặp lại bạn! Nếu cần hỗ trợ, đừng ngại liên hệ nhé!',
            'Cảm ơn bạn đã sử dụng dịch vụ. Chúc bạn sức khỏe!'
        ];
        
        return goodbyes[Math.floor(Math.random() * goodbyes.length)];
    }

    handleGeneralInquiry(analysis, context) {
        return 'Tôi hiểu câu hỏi của bạn. Để hỗ trợ tốt nhất, bạn có thể hỏi cụ thể về tình trạng hồ sơ, dịch vụ thuế, hoặc các vấn đề khác.';
    }

    // Generate customer interaction link
    async generateCustomerLink(customerId) {
        try {
            const customer = await db.collection('customers').doc(customerId).get();
            if (!customer.exists) {
                throw new Error('Customer not found');
            }

            const customerData = customer.data();
            const linkId = this.generateLinkId();
            
            // Create interaction link
            await db.collection('interaction_links').doc(linkId).set({
                customerId: customerId,
                customerName: customerData.fullName,
                type: 'customer_chat',
                status: 'active',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                createdBy: auth.currentUser?.uid
            });

            const baseUrl = window.location.origin;
            return `${baseUrl}/customer-chat/${linkId}`;

        } catch (error) {
            console.error('Error generating customer link:', error);
            throw error;
        }
    }

    generateLinkId() {
        return 'link_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Sync customer data with employee
    async syncCustomerEmployeeData(customerId, employeeId) {
        try {
            // Update customer assignment
            await db.collection('customers').doc(customerId).update({
                assignedTo: employeeId,
                updatedAt: new Date()
            });

            // Create sync record
            await db.collection('data_sync').add({
                customerId: customerId,
                employeeId: employeeId,
                syncType: 'customer_assignment',
                timestamp: new Date(),
                status: 'completed'
            });

            // Update AI knowledge
            this.updateSyncData('customer', customerId, { assignedTo: employeeId });

            return true;

        } catch (error) {
            console.error('Error syncing customer-employee data:', error);
            return false;
        }
    }

    // Get sync status
    async getSyncStatus(customerId) {
        try {
            const syncSnapshot = await db.collection('data_sync')
                .where('customerId', '==', customerId)
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get();

            if (!syncSnapshot.empty) {
                return syncSnapshot.docs[0].data();
            }

            return null;

        } catch (error) {
            console.error('Error getting sync status:', error);
            return null;
        }
    }

    // Export learning data
    async exportLearningData() {
        try {
            const exportData = {
                timestamp: new Date(),
                learningData: this.learningData,
                syncData: this.syncData,
                statistics: {
                    totalInteractions: this.learningData.interactions?.length || 0,
                    totalCustomers: Object.keys(this.learningData.customers || {}).length,
                    totalTasks: Object.keys(this.learningData.tasks || {}).length
                }
            };

            // Save to Firestore
            await db.collection('ai_exports').add(exportData);

            return exportData;

        } catch (error) {
            console.error('Error exporting learning data:', error);
            throw error;
        }
    }
}

// Initialize AI Assistant
let aiAssistant;
document.addEventListener('DOMContentLoaded', () => {
    aiAssistant = new AIAssistant();
});

// Export for global use
window.aiAssistant = aiAssistant;
