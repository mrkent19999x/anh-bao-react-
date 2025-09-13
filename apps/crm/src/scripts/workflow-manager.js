// Workflow Manager - Quản lý quy trình xử lý hồ sơ
class WorkflowManager {
    constructor() {
        this.workflows = {};
        this.currentWorkflow = null;
        this.init();
    }

    async init() {
        try {
            await this.loadWorkflows();
            await this.setupDefaultWorkflows();
        } catch (error) {
            console.error('Error initializing Workflow Manager:', error);
        }
    }

    async loadWorkflows() {
        try {
            const workflowsSnapshot = await db.collection('product_workflows').get();
            workflowsSnapshot.forEach(doc => {
                this.workflows[doc.id] = doc.data();
            });
        } catch (error) {
            console.error('Error loading workflows:', error);
        }
    }

    async setupDefaultWorkflows() {
        const defaultWorkflows = {
            'upper-doanh-nghiep': {
                name: 'Upper Doanh nghiệp',
                description: 'Quy trình xử lý hồ sơ cho doanh nghiệp',
                steps: [
                    {
                        step: 1,
                        name: 'Thu thập thông tin',
                        description: 'Thu thập thông tin doanh nghiệp và giấy tờ cần thiết',
                        required: ['Mã số thuế', 'Giấy phép kinh doanh', 'Báo cáo tài chính'],
                        estimatedTime: '2-3 ngày'
                    },
                    {
                        step: 2,
                        name: 'Phân tích và đánh giá',
                        description: 'Phân tích tình hình thuế và đánh giá hạn mức',
                        required: ['Sổ sách kế toán', 'Chứng từ giao dịch'],
                        estimatedTime: '1-2 ngày'
                    },
                    {
                        step: 3,
                        name: 'Tính toán hạn mức',
                        description: 'Tính toán hạn mức thuế dựa trên quy định',
                        required: ['Công thức tính thuế', 'Biểu thuế hiện hành'],
                        estimatedTime: '1 ngày'
                    },
                    {
                        step: 4,
                        name: 'Lập báo cáo',
                        description: 'Lập báo cáo chi tiết và đề xuất',
                        required: ['Mẫu báo cáo', 'Tài liệu tham khảo'],
                        estimatedTime: '1-2 ngày'
                    },
                    {
                        step: 5,
                        name: 'Hoàn thiện hồ sơ',
                        description: 'Hoàn thiện và nộp hồ sơ',
                        required: ['Chữ ký', 'Con dấu', 'Tài liệu bổ sung'],
                        estimatedTime: '1 ngày'
                    }
                ],
                estimatedTotalTime: '6-9 ngày',
                priority: 'high'
            },
            'tax-plus-500': {
                name: 'Tax Plus 500',
                description: 'Quy trình xử lý hồ sơ cho cá nhân',
                steps: [
                    {
                        step: 1,
                        name: 'Xác minh thông tin cá nhân',
                        description: 'Xác minh thông tin cá nhân và thu nhập',
                        required: ['CMND/CCCD', 'Chứng từ thu nhập', 'Giấy tờ khấu trừ'],
                        estimatedTime: '1-2 ngày'
                    },
                    {
                        step: 2,
                        name: 'Tính toán thuế',
                        description: 'Tính toán thuế thu nhập cá nhân',
                        required: ['Biểu thuế TNCN', 'Chứng từ chi phí'],
                        estimatedTime: '1 ngày'
                    },
                    {
                        step: 3,
                        name: 'Kiểm tra khấu trừ',
                        description: 'Kiểm tra các khoản khấu trừ thuế',
                        required: ['Giấy tờ khấu trừ', 'Chứng từ bảo hiểm'],
                        estimatedTime: '1 ngày'
                    },
                    {
                        step: 4,
                        name: 'Lập tờ khai',
                        description: 'Lập tờ khai thuế TNCN',
                        required: ['Mẫu tờ khai', 'Tài liệu chứng minh'],
                        estimatedTime: '1-2 ngày'
                    },
                    {
                        step: 5,
                        name: 'Nộp hồ sơ',
                        description: 'Nộp hồ sơ và theo dõi xử lý',
                        required: ['Chữ ký', 'Tài liệu bổ sung'],
                        estimatedTime: '1 ngày'
                    }
                ],
                estimatedTotalTime: '5-7 ngày',
                priority: 'medium'
            },
            'upper-tax-ho-kinh-doanh': {
                name: 'Upper Tax Hộ Kinh doanh',
                description: 'Quy trình xử lý hồ sơ cho hộ kinh doanh',
                steps: [
                    {
                        step: 1,
                        name: 'Kiểm tra giấy phép',
                        description: 'Kiểm tra giấy phép kinh doanh và đăng ký thuế',
                        required: ['Giấy phép kinh doanh', 'Mã số thuế HKD'],
                        estimatedTime: '1-2 ngày'
                    },
                    {
                        step: 2,
                        name: 'Thu thập sổ sách',
                        description: 'Thu thập sổ sách kế toán và chứng từ',
                        required: ['Sổ sách kế toán', 'Chứng từ mua bán'],
                        estimatedTime: '2-3 ngày'
                    },
                    {
                        step: 3,
                        name: 'Tính toán doanh thu',
                        description: 'Tính toán doanh thu và chi phí',
                        required: ['Báo cáo doanh thu', 'Chứng từ chi phí'],
                        estimatedTime: '1-2 ngày'
                    },
                    {
                        step: 4,
                        name: 'Tính thuế',
                        description: 'Tính thuế môn bài và thuế GTGT',
                        required: ['Biểu thuế môn bài', 'Biểu thuế GTGT'],
                        estimatedTime: '1 ngày'
                    },
                    {
                        step: 5,
                        name: 'Lập báo cáo',
                        description: 'Lập báo cáo thuế và nộp hồ sơ',
                        required: ['Mẫu báo cáo', 'Chữ ký'],
                        estimatedTime: '1-2 ngày'
                    }
                ],
                estimatedTotalTime: '6-10 ngày',
                priority: 'medium'
            }
        };

        // Save default workflows if they don't exist
        for (const [productType, workflow] of Object.entries(defaultWorkflows)) {
            if (!this.workflows[productType]) {
                try {
                    await db.collection('product_workflows').doc(productType).set(workflow);
                    this.workflows[productType] = workflow;
                } catch (error) {
                    console.error(`Error saving workflow for ${productType}:`, error);
                }
            }
        }
    }

    getWorkflow(productType) {
        return this.workflows[productType] || null;
    }

    getAllWorkflows() {
        return this.workflows;
    }

    async createWorkflow(productType, workflowData) {
        try {
            const workflow = {
                ...workflowData,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await db.collection('product_workflows').doc(productType).set(workflow);
            this.workflows[productType] = workflow;

            return workflow;
        } catch (error) {
            console.error('Error creating workflow:', error);
            throw error;
        }
    }

    async updateWorkflow(productType, workflowData) {
        try {
            const updatedWorkflow = {
                ...workflowData,
                updatedAt: new Date()
            };

            await db.collection('product_workflows').doc(productType).update(updatedWorkflow);
            this.workflows[productType] = { ...this.workflows[productType], ...updatedWorkflow };

            return updatedWorkflow;
        } catch (error) {
            console.error('Error updating workflow:', error);
            throw error;
        }
    }

    async deleteWorkflow(productType) {
        try {
            await db.collection('product_workflows').doc(productType).delete();
            delete this.workflows[productType];

            return true;
        } catch (error) {
            console.error('Error deleting workflow:', error);
            throw error;
        }
    }

    getCurrentStep(document) {
        if (!document.workflowProgress) {
            return 1;
        }
        return document.workflowProgress.currentStep || 1;
    }

    getNextStep(document) {
        const currentStep = this.getCurrentStep(document);
        const workflow = this.getWorkflow(document.productType);
        
        if (!workflow || !workflow.steps) {
            return null;
        }

        const nextStepNumber = currentStep + 1;
        return workflow.steps.find(step => step.step === nextStepNumber) || null;
    }

    getPreviousStep(document) {
        const currentStep = this.getCurrentStep(document);
        const workflow = this.getWorkflow(document.productType);
        
        if (!workflow || !workflow.steps) {
            return null;
        }

        const previousStepNumber = currentStep - 1;
        return workflow.steps.find(step => step.step === previousStepNumber) || null;
    }

    getStepProgress(document) {
        const workflow = this.getWorkflow(document.productType);
        if (!workflow || !workflow.steps) {
            return 0;
        }

        const currentStep = this.getCurrentStep(document);
        return (currentStep / workflow.steps.length) * 100;
    }

    async startWorkflow(documentId, productType) {
        try {
            const workflow = this.getWorkflow(productType);
            if (!workflow) {
                throw new Error('Workflow not found for product type: ' + productType);
            }

            const workflowProgress = {
                currentStep: 1,
                startedAt: new Date(),
                completedSteps: [],
                currentStepStartedAt: new Date(),
                estimatedCompletion: this.calculateEstimatedCompletion(workflow, 1)
            };

            await db.collection('documents').doc(documentId).update({
                workflowProgress,
                status: 'processing',
                productType
            });

            return workflowProgress;
        } catch (error) {
            console.error('Error starting workflow:', error);
            throw error;
        }
    }

    async completeStep(documentId, stepNumber, stepData = {}) {
        try {
            const document = await db.collection('documents').doc(documentId).get();
            if (!document.exists) {
                throw new Error('Document not found');
            }

            const docData = document.data();
            const workflow = this.getWorkflow(docData.productType);
            
            if (!workflow) {
                throw new Error('Workflow not found');
            }

            const currentProgress = docData.workflowProgress || {};
            const completedSteps = currentProgress.completedSteps || [];
            
            // Add current step to completed steps
            completedSteps.push({
                step: stepNumber,
                completedAt: new Date(),
                data: stepData
            });

            const nextStep = stepNumber + 1;
            const isWorkflowComplete = nextStep > workflow.steps.length;

            const updatedProgress = {
                ...currentProgress,
                currentStep: isWorkflowComplete ? workflow.steps.length : nextStep,
                completedSteps,
                currentStepStartedAt: new Date(),
                estimatedCompletion: this.calculateEstimatedCompletion(workflow, nextStep)
            };

            const updateData = {
                workflowProgress: updatedProgress,
                status: isWorkflowComplete ? 'completed' : 'processing'
            };

            if (isWorkflowComplete) {
                updateData.completedAt = new Date();
            }

            await db.collection('documents').doc(documentId).update(updateData);

            return {
                isComplete: isWorkflowComplete,
                nextStep: isWorkflowComplete ? null : nextStep,
                progress: updatedProgress
            };
        } catch (error) {
            console.error('Error completing step:', error);
            throw error;
        }
    }

    async skipStep(documentId, stepNumber, reason = '') {
        try {
            const document = await db.collection('documents').doc(documentId).get();
            if (!document.exists) {
                throw new Error('Document not found');
            }

            const docData = document.data();
            const currentProgress = docData.workflowProgress || {};
            const skippedSteps = currentProgress.skippedSteps || [];
            
            skippedSteps.push({
                step: stepNumber,
                skippedAt: new Date(),
                reason
            });

            const updatedProgress = {
                ...currentProgress,
                skippedSteps
            };

            await db.collection('documents').doc(documentId).update({
                workflowProgress: updatedProgress
            });

            return updatedProgress;
        } catch (error) {
            console.error('Error skipping step:', error);
            throw error;
        }
    }

    calculateEstimatedCompletion(workflow, currentStep) {
        if (!workflow || !workflow.steps) {
            return null;
        }

        const remainingSteps = workflow.steps.filter(step => step.step >= currentStep);
        let totalRemainingDays = 0;

        remainingSteps.forEach(step => {
            const timeRange = step.estimatedTime;
            if (timeRange) {
                const days = this.parseTimeRange(timeRange);
                totalRemainingDays += days;
            }
        });

        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + totalRemainingDays);
        
        return estimatedDate;
    }

    parseTimeRange(timeRange) {
        // Parse time ranges like "2-3 ngày", "1 ngày", etc.
        const match = timeRange.match(/(\d+)(?:\s*-\s*(\d+))?\s*(ngày|ngày làm việc)/);
        if (match) {
            const min = parseInt(match[1]);
            const max = match[2] ? parseInt(match[2]) : min;
            return Math.ceil((min + max) / 2); // Return average
        }
        return 1; // Default to 1 day
    }

    getWorkflowStatistics() {
        const stats = {
            totalWorkflows: Object.keys(this.workflows).length,
            averageSteps: 0,
            averageTime: 0,
            workflowsByPriority: {
                high: 0,
                medium: 0,
                low: 0
            }
        };

        let totalSteps = 0;
        let totalTime = 0;

        Object.values(this.workflows).forEach(workflow => {
            if (workflow.steps) {
                totalSteps += workflow.steps.length;
            }
            
            if (workflow.estimatedTotalTime) {
                const days = this.parseTimeRange(workflow.estimatedTotalTime);
                totalTime += days;
            }

            if (workflow.priority) {
                stats.workflowsByPriority[workflow.priority]++;
            }
        });

        if (stats.totalWorkflows > 0) {
            stats.averageSteps = Math.round(totalSteps / stats.totalWorkflows);
            stats.averageTime = Math.round(totalTime / stats.totalWorkflows);
        }

        return stats;
    }

    validateWorkflow(workflow) {
        const errors = [];

        if (!workflow.name) {
            errors.push('Workflow name is required');
        }

        if (!workflow.steps || !Array.isArray(workflow.steps)) {
            errors.push('Workflow must have steps array');
        } else {
            workflow.steps.forEach((step, index) => {
                if (!step.name) {
                    errors.push(`Step ${index + 1}: name is required`);
                }
                if (!step.description) {
                    errors.push(`Step ${index + 1}: description is required`);
                }
                if (!step.step || step.step !== index + 1) {
                    errors.push(`Step ${index + 1}: step number must be ${index + 1}`);
                }
            });
        }

        return errors;
    }

    async exportWorkflow(productType) {
        const workflow = this.getWorkflow(productType);
        if (!workflow) {
            throw new Error('Workflow not found');
        }

        return {
            ...workflow,
            exportedAt: new Date(),
            version: '1.0'
        };
    }

    async importWorkflow(workflowData) {
        const errors = this.validateWorkflow(workflowData);
        if (errors.length > 0) {
            throw new Error('Invalid workflow: ' + errors.join(', '));
        }

        const productType = workflowData.productType || 'imported-workflow';
        return await this.createWorkflow(productType, workflowData);
    }
}

// Initialize Workflow Manager
let workflowManager;
document.addEventListener('DOMContentLoaded', () => {
    workflowManager = new WorkflowManager();
});
