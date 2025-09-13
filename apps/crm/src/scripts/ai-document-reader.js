// AI Document Reader - Đọc và phân tích tài liệu thông minh
class AIDocumentReader {
    constructor() {
        this.knowledgeBase = {};
        this.productWorkflows = {};
        this.init();
    }

    async init() {
        try {
            await this.loadKnowledgeBase();
            await this.loadProductWorkflows();
        } catch (error) {
            console.error('Error initializing AI Document Reader:', error);
        }
    }

    async loadKnowledgeBase() {
        try {
            const knowledgeSnapshot = await db.collection('ai_knowledge').get();
            knowledgeSnapshot.forEach(doc => {
                this.knowledgeBase[doc.id] = doc.data();
            });
        } catch (error) {
            console.error('Error loading knowledge base:', error);
        }
    }

    async loadProductWorkflows() {
        try {
            const workflowsSnapshot = await db.collection('product_workflows').get();
            workflowsSnapshot.forEach(doc => {
                this.productWorkflows[doc.id] = doc.data();
            });
        } catch (error) {
            console.error('Error loading product workflows:', error);
        }
    }

    async analyzeDocument(docId, file) {
        try {
            console.log(`AI đang phân tích tài liệu: ${file.name}`);

            // Extract text content from file
            const textContent = await this.extractTextFromFile(file);
            
            // Analyze document type and content
            const analysis = await this.analyzeContent(textContent, file.name);
            
            // Update document with analysis results
            await this.updateDocumentAnalysis(docId, analysis);
            
            // Learn from document
            await this.learnFromDocument(analysis);
            
            console.log('AI phân tích hoàn thành:', analysis);
            
            return analysis;
        } catch (error) {
            console.error('Error analyzing document:', error);
            throw error;
        }
    }

    async extractTextFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    let textContent = '';
                    
                    if (file.type.includes('text') || file.type.includes('csv')) {
                        textContent = e.target.result;
                    } else if (file.type.includes('pdf')) {
                        // For PDF files, we'll need a PDF parser
                        // For now, we'll extract basic text
                        textContent = this.extractBasicText(e.target.result);
                    } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
                        // For Excel files, we'll need a spreadsheet parser
                        // For now, we'll extract basic text
                        textContent = this.extractBasicText(e.target.result);
                    } else if (file.type.includes('word') || file.type.includes('document')) {
                        // For Word documents, we'll need a document parser
                        // For now, we'll extract basic text
                        textContent = this.extractBasicText(e.target.result);
                    }
                    
                    resolve(textContent);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            
            if (file.type.includes('text') || file.type.includes('csv')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    extractBasicText(arrayBuffer) {
        // Basic text extraction from binary files
        // This is a simplified version - in production, you'd use proper parsers
        const uint8Array = new Uint8Array(arrayBuffer);
        let text = '';
        
        for (let i = 0; i < uint8Array.length; i++) {
            const byte = uint8Array[i];
            if (byte >= 32 && byte <= 126) { // Printable ASCII characters
                text += String.fromCharCode(byte);
            }
        }
        
        return text;
    }

    async analyzeContent(textContent, fileName) {
        const analysis = {
            documentType: this.detectDocumentType(fileName, textContent),
            productType: this.detectProductType(fileName, textContent),
            keyInformation: this.extractKeyInformation(textContent),
            workflow: this.detectWorkflow(textContent),
            confidence: this.calculateConfidence(textContent),
            suggestions: this.generateSuggestions(textContent),
            timestamp: new Date()
        };

        return analysis;
    }

    detectDocumentType(fileName, content) {
        const lowerFileName = fileName.toLowerCase();
        const lowerContent = content.toLowerCase();
        
        if (lowerFileName.includes('quy trình') || lowerContent.includes('quy trình')) {
            return 'workflow';
        } else if (lowerFileName.includes('hướng dẫn') || lowerContent.includes('hướng dẫn')) {
            return 'guide';
        } else if (lowerFileName.includes('báo cáo') || lowerContent.includes('báo cáo')) {
            return 'report';
        } else if (lowerFileName.includes('hồ sơ') || lowerContent.includes('hồ sơ')) {
            return 'document';
        } else if (lowerFileName.includes('tính') || lowerContent.includes('tính')) {
            return 'calculation';
        }
        
        return 'general';
    }

    detectProductType(fileName, content) {
        const lowerFileName = fileName.toLowerCase();
        const lowerContent = content.toLowerCase();
        
        if (lowerFileName.includes('doanh nghiệp') || lowerContent.includes('doanh nghiệp') || 
            lowerContent.includes('business') || lowerContent.includes('công ty')) {
            return 'upper-doanh-nghiep';
        } else if (lowerFileName.includes('tax plus') || lowerContent.includes('tax plus') || 
                   lowerContent.includes('500') || lowerContent.includes('cá nhân')) {
            return 'tax-plus-500';
        } else if (lowerFileName.includes('hộ kinh doanh') || lowerContent.includes('hộ kinh doanh') || 
                   lowerContent.includes('household') || lowerContent.includes('hkd')) {
            return 'upper-tax-ho-kinh-doanh';
        }
        
        return 'unknown';
    }

    extractKeyInformation(content) {
        const keyInfo = {
            keywords: this.extractKeywords(content),
            entities: this.extractEntities(content),
            numbers: this.extractNumbers(content),
            dates: this.extractDates(content),
            amounts: this.extractAmounts(content)
        };
        
        return keyInfo;
    }

    extractKeywords(content) {
        const commonKeywords = [
            'thuế', 'tax', 'doanh nghiệp', 'business', 'hộ kinh doanh', 'household',
            'báo cáo', 'report', 'quyết toán', 'settlement', 'khai thuế', 'tax declaration',
            'hạn mức', 'limit', 'tính thuế', 'tax calculation', 'hoàn thuế', 'tax refund'
        ];
        
        const lowerContent = content.toLowerCase();
        const foundKeywords = commonKeywords.filter(keyword => 
            lowerContent.includes(keyword.toLowerCase())
        );
        
        return foundKeywords;
    }

    extractEntities(content) {
        const entities = {
            organizations: this.extractOrganizations(content),
            people: this.extractPeople(content),
            locations: this.extractLocations(content)
        };
        
        return entities;
    }

    extractOrganizations(content) {
        // Simple organization extraction
        const orgPatterns = [
            /công ty\s+[A-Za-zÀ-ỹ\s]+/gi,
            /doanh nghiệp\s+[A-Za-zÀ-ỹ\s]+/gi,
            /công ty\s+TNHH\s+[A-Za-zÀ-ỹ\s]+/gi,
            /công ty\s+CP\s+[A-Za-zÀ-ỹ\s]+/gi
        ];
        
        const organizations = [];
        orgPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                organizations.push(...matches);
            }
        });
        
        return organizations;
    }

    extractPeople(content) {
        // Simple person name extraction
        const namePatterns = [
            /ông\s+[A-Za-zÀ-ỹ\s]+/gi,
            /bà\s+[A-Za-zÀ-ỹ\s]+/gi,
            /anh\s+[A-Za-zÀ-ỹ\s]+/gi,
            /chị\s+[A-Za-zÀ-ỹ\s]+/gi
        ];
        
        const people = [];
        namePatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                people.push(...matches);
            }
        });
        
        return people;
    }

    extractLocations(content) {
        // Simple location extraction
        const locationPatterns = [
            /tại\s+[A-Za-zÀ-ỹ\s]+/gi,
            /ở\s+[A-Za-zÀ-ỹ\s]+/gi,
            /địa chỉ\s*:\s*[A-Za-zÀ-ỹ\s]+/gi
        ];
        
        const locations = [];
        locationPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                locations.push(...matches);
            }
        });
        
        return locations;
    }

    extractNumbers(content) {
        const numberPattern = /\d+(?:\.\d+)?/g;
        return content.match(numberPattern) || [];
    }

    extractDates(content) {
        const datePatterns = [
            /\d{1,2}\/\d{1,2}\/\d{4}/g,
            /\d{1,2}-\d{1,2}-\d{4}/g,
            /\d{4}-\d{1,2}-\d{1,2}/g
        ];
        
        const dates = [];
        datePatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                dates.push(...matches);
            }
        });
        
        return dates;
    }

    extractAmounts(content) {
        const amountPatterns = [
            /(\d+(?:\.\d+)?)\s*(?:triệu|tr|nghìn|k|đồng|vnđ)/gi,
            /(\d+(?:\.\d+)?)\s*(?:USD|VND|EUR)/gi
        ];
        
        const amounts = [];
        amountPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                amounts.push(...matches);
            }
        });
        
        return amounts;
    }

    detectWorkflow(content) {
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('bước 1') || lowerContent.includes('step 1')) {
            return this.extractWorkflowSteps(content);
        } else if (lowerContent.includes('quy trình') || lowerContent.includes('process')) {
            return this.extractProcessSteps(content);
        }
        
        return null;
    }

    extractWorkflowSteps(content) {
        const steps = [];
        const stepPattern = /(?:bước|step)\s*(\d+)[:.\s]+([^\n\r]+)/gi;
        let match;
        
        while ((match = stepPattern.exec(content)) !== null) {
            steps.push({
                step: parseInt(match[1]),
                description: match[2].trim()
            });
        }
        
        return steps;
    }

    extractProcessSteps(content) {
        const steps = [];
        const processPattern = /(\d+)[:.\s]+([^\n\r]+)/gi;
        let match;
        
        while ((match = processPattern.exec(content)) !== null) {
            steps.push({
                step: parseInt(match[1]),
                description: match[2].trim()
            });
        }
        
        return steps;
    }

    calculateConfidence(content) {
        let confidence = 0;
        
        // Check for specific keywords
        const keywords = this.extractKeywords(content);
        confidence += keywords.length * 10;
        
        // Check for structured content
        if (content.includes('bước') || content.includes('step')) {
            confidence += 20;
        }
        
        if (content.includes('quy trình') || content.includes('process')) {
            confidence += 15;
        }
        
        // Check for numbers and dates
        const numbers = this.extractNumbers(content);
        const dates = this.extractDates(content);
        confidence += numbers.length * 2;
        confidence += dates.length * 5;
        
        // Normalize to 0-100
        return Math.min(confidence, 100);
    }

    generateSuggestions(content) {
        const suggestions = [];
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('thuế') && !lowerContent.includes('hạn mức')) {
            suggestions.push('Cần kiểm tra hạn mức thuế');
        }
        
        if (lowerContent.includes('doanh nghiệp') && !lowerContent.includes('mã số thuế')) {
            suggestions.push('Cần thêm mã số thuế doanh nghiệp');
        }
        
        if (lowerContent.includes('hộ kinh doanh') && !lowerContent.includes('giấy phép')) {
            suggestions.push('Cần thêm giấy phép kinh doanh');
        }
        
        if (lowerContent.includes('báo cáo') && !lowerContent.includes('kỳ')) {
            suggestions.push('Cần xác định kỳ báo cáo');
        }
        
        return suggestions;
    }

    async updateDocumentAnalysis(docId, analysis) {
        try {
            await db.collection('documents').doc(docId).update({
                aiAnalysis: analysis,
                analyzedAt: new Date(),
                status: analysis.confidence > 70 ? 'processing' : 'pending'
            });
        } catch (error) {
            console.error('Error updating document analysis:', error);
        }
    }

    async learnFromDocument(analysis) {
        try {
            const learningData = {
                documentType: analysis.documentType,
                productType: analysis.productType,
                keyInformation: analysis.keyInformation,
                workflow: analysis.workflow,
                confidence: analysis.confidence,
                learnedAt: new Date()
            };
            
            await db.collection('ai_learning').add(learningData);
            
            // Update local knowledge base
            this.knowledgeBase[learningData.productType] = learningData;
            
        } catch (error) {
            console.error('Error learning from document:', error);
        }
    }

    async processChatMessage(message, documents = []) {
        try {
            const analysis = this.analyzeUserMessage(message);
            const response = await this.generateResponse(analysis, documents);
            return response;
        } catch (error) {
            console.error('Error processing chat message:', error);
            return 'Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn.';
        }
    }

    analyzeUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        return {
            intent: this.detectIntent(lowerMessage),
            entities: this.extractEntitiesFromMessage(lowerMessage),
            sentiment: this.analyzeSentiment(lowerMessage),
            keywords: this.extractKeywordsFromMessage(lowerMessage)
        };
    }

    detectIntent(message) {
        if (message.includes('phân loại') || message.includes('loại')) {
            return 'classify';
        } else if (message.includes('quy trình') || message.includes('cách làm')) {
            return 'workflow';
        } else if (message.includes('thiếu') || message.includes('cần')) {
            return 'missing_info';
        } else if (message.includes('học') || message.includes('upload')) {
            return 'learn';
        } else if (message.includes('thống kê') || message.includes('bao nhiêu')) {
            return 'statistics';
        } else if (message.includes('giúp') || message.includes('hỗ trợ')) {
            return 'help';
        }
        
        return 'general';
    }

    extractEntitiesFromMessage(message) {
        const entities = {
            productType: null,
            documentType: null,
            status: null
        };
        
        if (message.includes('doanh nghiệp')) {
            entities.productType = 'upper-doanh-nghiep';
        } else if (message.includes('tax plus') || message.includes('500')) {
            entities.productType = 'tax-plus-500';
        } else if (message.includes('hộ kinh doanh')) {
            entities.productType = 'upper-tax-ho-kinh-doanh';
        }
        
        if (message.includes('quy trình')) {
            entities.documentType = 'workflow';
        } else if (message.includes('hướng dẫn')) {
            entities.documentType = 'guide';
        } else if (message.includes('báo cáo')) {
            entities.documentType = 'report';
        }
        
        if (message.includes('chờ xử lý')) {
            entities.status = 'pending';
        } else if (message.includes('đang xử lý')) {
            entities.status = 'processing';
        } else if (message.includes('hoàn thành')) {
            entities.status = 'completed';
        }
        
        return entities;
    }

    analyzeSentiment(message) {
        const positiveWords = ['tốt', 'hay', 'đúng', 'chính xác', 'hoàn hảo'];
        const negativeWords = ['sai', 'lỗi', 'không đúng', 'thiếu', 'chưa'];
        
        let sentiment = 'neutral';
        let score = 0;
        
        positiveWords.forEach(word => {
            if (message.includes(word)) score += 1;
        });
        
        negativeWords.forEach(word => {
            if (message.includes(word)) score -= 1;
        });
        
        if (score > 0) sentiment = 'positive';
        else if (score < 0) sentiment = 'negative';
        
        return sentiment;
    }

    extractKeywordsFromMessage(message) {
        const keywords = [];
        const commonKeywords = [
            'thuế', 'doanh nghiệp', 'hộ kinh doanh', 'báo cáo', 'quyết toán',
            'hạn mức', 'tính thuế', 'hoàn thuế', 'khai thuế', 'mã số thuế'
        ];
        
        commonKeywords.forEach(keyword => {
            if (message.includes(keyword)) {
                keywords.push(keyword);
            }
        });
        
        return keywords;
    }

    async generateResponse(analysis, documents) {
        const { intent, entities, sentiment, keywords } = analysis;
        
        switch (intent) {
            case 'classify':
                return this.generateClassificationResponse(entities, documents);
            case 'workflow':
                return this.generateWorkflowResponse(entities);
            case 'missing_info':
                return this.generateMissingInfoResponse(entities, documents);
            case 'learn':
                return this.generateLearningResponse();
            case 'statistics':
                return this.generateStatisticsResponse(documents);
            case 'help':
                return this.generateHelpResponse();
            default:
                return this.generateGeneralResponse(analysis, documents);
        }
    }

    generateClassificationResponse(entities, documents) {
        if (entities.productType) {
            const productDocs = documents.filter(doc => doc.productType === entities.productType);
            return `Tôi tìm thấy ${productDocs.length} hồ sơ cho sản phẩm ${this.getProductText(entities.productType)}. 
                    ${productDocs.length > 0 ? 'Các hồ sơ này đang ở trạng thái: ' + 
                    productDocs.map(doc => this.getStatusText(doc.status)).join(', ') : ''}`;
        }
        
        return 'Bạn muốn phân loại hồ sơ theo sản phẩm nào? Tôi có thể giúp với: Upper Doanh nghiệp, Tax Plus 500, hoặc Upper Tax Hộ Kinh doanh.';
    }

    generateWorkflowResponse(entities) {
        if (entities.productType) {
            const workflow = this.productWorkflows[entities.productType];
            if (workflow) {
                return `Quy trình cho ${this.getProductText(entities.productType)}:\n${workflow.steps.map(step => 
                    `${step.step}. ${step.description}`).join('\n')}`;
            }
        }
        
        return 'Tôi có thể hướng dẫn quy trình cho các sản phẩm: Upper Doanh nghiệp, Tax Plus 500, hoặc Upper Tax Hộ Kinh doanh. Bạn muốn biết quy trình nào?';
    }

    generateMissingInfoResponse(entities, documents) {
        const suggestions = [];
        
        if (entities.productType === 'upper-doanh-nghiep') {
            suggestions.push('Mã số thuế doanh nghiệp', 'Giấy phép kinh doanh', 'Báo cáo tài chính');
        } else if (entities.productType === 'tax-plus-500') {
            suggestions.push('CMND/CCCD', 'Chứng từ thu nhập', 'Giấy tờ khấu trừ');
        } else if (entities.productType === 'upper-tax-ho-kinh-doanh') {
            suggestions.push('Giấy phép kinh doanh', 'Sổ sách kế toán', 'Chứng từ mua bán');
        }
        
        return `Để hoàn thiện hồ sơ, bạn cần bổ sung:\n${suggestions.map(item => `• ${item}`).join('\n')}`;
    }

    generateLearningResponse() {
        return 'Tôi có thể học từ tài liệu mới! Hãy upload file Excel, Word hoặc PDF vào hệ thống. Tôi sẽ tự động phân tích và học quy trình từ tài liệu đó.';
    }

    generateStatisticsResponse(documents) {
        const stats = {
            total: documents.length,
            pending: documents.filter(d => d.status === 'pending').length,
            processing: documents.filter(d => d.status === 'processing').length,
            completed: documents.filter(d => d.status === 'completed').length,
            urgent: documents.filter(d => d.status === 'urgent').length
        };
        
        return `Thống kê hồ sơ:\n• Tổng cộng: ${stats.total}\n• Chờ xử lý: ${stats.pending}\n• Đang xử lý: ${stats.processing}\n• Hoàn thành: ${stats.completed}\n• Khẩn cấp: ${stats.urgent}`;
    }

    generateHelpResponse() {
        return `Tôi có thể giúp bạn:\n• Phân loại hồ sơ theo sản phẩm\n• Hướng dẫn quy trình xử lý\n• Kiểm tra thông tin thiếu\n• Học từ tài liệu mới\n• Thống kê hồ sơ\n\nBạn cần hỗ trợ gì?`;
    }

    generateGeneralResponse(analysis, documents) {
        if (analysis.keywords.length > 0) {
            return `Tôi thấy bạn quan tâm đến: ${analysis.keywords.join(', ')}. Bạn có muốn tôi hướng dẫn chi tiết về các chủ đề này không?`;
        }
        
        return 'Tôi là AI Assistant chuyên về xử lý hồ sơ thuế. Tôi có thể giúp bạn phân loại, hướng dẫn quy trình, và học từ tài liệu mới. Bạn cần hỗ trợ gì?';
    }

    getProductText(productType) {
        const productMap = {
            'upper-doanh-nghiep': 'Upper Doanh nghiệp',
            'tax-plus-500': 'Tax Plus 500',
            'upper-tax-ho-kinh-doanh': 'Upper Tax Hộ Kinh doanh'
        };
        return productMap[productType] || productType;
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
}

// Initialize AI Document Reader
let aiDocumentReader;
document.addEventListener('DOMContentLoaded', () => {
    aiDocumentReader = new AIDocumentReader();
});
