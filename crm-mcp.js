#!/usr/bin/env node

/**
 * CRM MCP Server - XMLGuard CRM Integration
 * Phase 3: CRM VPS Management
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

class CRMServer {
  constructor() {
    this.server = new Server(
      {
        name: 'crm-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.crmBaseUrl = process.env.CRM_BASE_URL || 'http://103.69.86.130:3000';
    this.crmApiKey = process.env.CRM_API_KEY || '';

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'crm_get_customers',
            description: 'Lấy danh sách khách hàng từ CRM',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Số lượng khách hàng tối đa (mặc định: 50)',
                  default: 50
                },
                status: {
                  type: 'string',
                  description: 'Lọc theo trạng thái khách hàng',
                  enum: ['active', 'inactive', 'lead', 'prospect']
                },
                search: {
                  type: 'string',
                  description: 'Tìm kiếm theo tên hoặc email'
                }
              }
            }
          },
          {
            name: 'crm_get_customer',
            description: 'Lấy thông tin chi tiết một khách hàng',
            inputSchema: {
              type: 'object',
              properties: {
                customerId: {
                  type: 'string',
                  description: 'ID của khách hàng'
                }
              },
              required: ['customerId']
            }
          },
          {
            name: 'crm_create_customer',
            description: 'Tạo khách hàng mới trong CRM',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Tên khách hàng'
                },
                email: {
                  type: 'string',
                  description: 'Email khách hàng'
                },
                phone: {
                  type: 'string',
                  description: 'Số điện thoại'
                },
                company: {
                  type: 'string',
                  description: 'Tên công ty'
                },
                status: {
                  type: 'string',
                  description: 'Trạng thái khách hàng',
                  enum: ['lead', 'prospect', 'active', 'inactive'],
                  default: 'lead'
                },
                notes: {
                  type: 'string',
                  description: 'Ghi chú về khách hàng'
                }
              },
              required: ['name', 'email']
            }
          },
          {
            name: 'crm_update_customer',
            description: 'Cập nhật thông tin khách hàng',
            inputSchema: {
              type: 'object',
              properties: {
                customerId: {
                  type: 'string',
                  description: 'ID của khách hàng'
                },
                updates: {
                  type: 'object',
                  description: 'Các trường cần cập nhật',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    company: { type: 'string' },
                    status: { type: 'string', enum: ['lead', 'prospect', 'active', 'inactive'] },
                    notes: { type: 'string' }
                  }
                }
              },
              required: ['customerId', 'updates']
            }
          },
          {
            name: 'crm_delete_customer',
            description: 'Xóa khách hàng khỏi CRM',
            inputSchema: {
              type: 'object',
              properties: {
                customerId: {
                  type: 'string',
                  description: 'ID của khách hàng cần xóa'
                }
              },
              required: ['customerId']
            }
          },
          {
            name: 'crm_get_leads',
            description: 'Lấy danh sách leads từ CRM',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Số lượng leads tối đa (mặc định: 50)',
                  default: 50
                },
                status: {
                  type: 'string',
                  description: 'Lọc theo trạng thái lead',
                  enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']
                }
              }
            }
          },
          {
            name: 'crm_create_lead',
            description: 'Tạo lead mới trong CRM',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Tên lead'
                },
                email: {
                  type: 'string',
                  description: 'Email lead'
                },
                phone: {
                  type: 'string',
                  description: 'Số điện thoại'
                },
                company: {
                  type: 'string',
                  description: 'Tên công ty'
                },
                source: {
                  type: 'string',
                  description: 'Nguồn lead',
                  enum: ['website', 'referral', 'cold-call', 'social', 'other']
                },
                status: {
                  type: 'string',
                  description: 'Trạng thái lead',
                  enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
                  default: 'new'
                },
                value: {
                  type: 'number',
                  description: 'Giá trị dự kiến của lead'
                },
                notes: {
                  type: 'string',
                  description: 'Ghi chú về lead'
                }
              },
              required: ['name', 'email']
            }
          },
          {
            name: 'crm_get_deals',
            description: 'Lấy danh sách deals từ CRM',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Số lượng deals tối đa (mặc định: 50)',
                  default: 50
                },
                status: {
                  type: 'string',
                  description: 'Lọc theo trạng thái deal',
                  enum: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']
                },
                customerId: {
                  type: 'string',
                  description: 'Lọc theo ID khách hàng'
                }
              }
            }
          },
          {
            name: 'crm_create_deal',
            description: 'Tạo deal mới trong CRM',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Tiêu đề deal'
                },
                customerId: {
                  type: 'string',
                  description: 'ID khách hàng'
                },
                value: {
                  type: 'number',
                  description: 'Giá trị deal'
                },
                status: {
                  type: 'string',
                  description: 'Trạng thái deal',
                  enum: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
                  default: 'prospecting'
                },
                expectedCloseDate: {
                  type: 'string',
                  description: 'Ngày dự kiến đóng deal (YYYY-MM-DD)'
                },
                notes: {
                  type: 'string',
                  description: 'Ghi chú về deal'
                }
              },
              required: ['title', 'customerId', 'value']
            }
          },
          {
            name: 'crm_get_stats',
            description: 'Lấy thống kê tổng quan CRM',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'crm_get_customers':
            return await this.getCustomers(args);
          case 'crm_get_customer':
            return await this.getCustomer(args);
          case 'crm_create_customer':
            return await this.createCustomer(args);
          case 'crm_update_customer':
            return await this.updateCustomer(args);
          case 'crm_delete_customer':
            return await this.deleteCustomer(args);
          case 'crm_get_leads':
            return await this.getLeads(args);
          case 'crm_create_lead':
            return await this.createLead(args);
          case 'crm_get_deals':
            return await this.getDeals(args);
          case 'crm_create_deal':
            return await this.createDeal(args);
          case 'crm_get_stats':
            return await this.getStats(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Lỗi khi thực hiện ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[CRM MCP] Server error:', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  // CRM API Methods
  async makeRequest(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      url: `${this.crmBaseUrl}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(this.crmApiKey && { 'Authorization': `Bearer ${this.crmApiKey}` })
      },
      timeout: 10000
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`CRM API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Không thể kết nối đến CRM server');
      } else {
        throw new Error(`Lỗi request: ${error.message}`);
      }
    }
  }

  async getCustomers(args = {}) {
    const { limit = 50, status, search } = args;
    let endpoint = `/api/customers?limit=${limit}`;

    if (status) endpoint += `&status=${status}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;

    const data = await this.makeRequest(endpoint);

    return {
      content: [
        {
          type: 'text',
          text: `Đã lấy ${data.customers?.length || 0} khách hàng từ CRM:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async getCustomer(args) {
    const { customerId } = args;
    const data = await this.makeRequest(`/api/customers/${customerId}`);

    return {
      content: [
        {
          type: 'text',
          text: `Thông tin khách hàng ${customerId}:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async createCustomer(args) {
    const { name, email, phone, company, status = 'lead', notes } = args;
    const customerData = { name, email, phone, company, status, notes };

    const data = await this.makeRequest('/api/customers', 'POST', customerData);

    return {
      content: [
        {
          type: 'text',
          text: `Đã tạo khách hàng mới thành công:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async updateCustomer(args) {
    const { customerId, updates } = args;
    const data = await this.makeRequest(`/api/customers/${customerId}`, 'PUT', updates);

    return {
      content: [
        {
          type: 'text',
          text: `Đã cập nhật khách hàng ${customerId} thành công:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async deleteCustomer(args) {
    const { customerId } = args;
    const data = await this.makeRequest(`/api/customers/${customerId}`, 'DELETE');

    return {
      content: [
        {
          type: 'text',
          text: `Đã xóa khách hàng ${customerId} thành công`
        }
      ]
    };
  }

  async getLeads(args = {}) {
    const { limit = 50, status } = args;
    let endpoint = `/api/leads?limit=${limit}`;

    if (status) endpoint += `&status=${status}`;

    const data = await this.makeRequest(endpoint);

    return {
      content: [
        {
          type: 'text',
          text: `Đã lấy ${data.leads?.length || 0} leads từ CRM:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async createLead(args) {
    const { name, email, phone, company, source, status = 'new', value, notes } = args;
    const leadData = { name, email, phone, company, source, status, value, notes };

    const data = await this.makeRequest('/api/leads', 'POST', leadData);

    return {
      content: [
        {
          type: 'text',
          text: `Đã tạo lead mới thành công:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async getDeals(args = {}) {
    const { limit = 50, status, customerId } = args;
    let endpoint = `/api/deals?limit=${limit}`;

    if (status) endpoint += `&status=${status}`;
    if (customerId) endpoint += `&customerId=${customerId}`;

    const data = await this.makeRequest(endpoint);

    return {
      content: [
        {
          type: 'text',
          text: `Đã lấy ${data.deals?.length || 0} deals từ CRM:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async createDeal(args) {
    const { title, customerId, value, status = 'prospecting', expectedCloseDate, notes } = args;
    const dealData = { title, customerId, value, status, expectedCloseDate, notes };

    const data = await this.makeRequest('/api/deals', 'POST', dealData);

    return {
      content: [
        {
          type: 'text',
          text: `Đã tạo deal mới thành công:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async getStats(args = {}) {
    const data = await this.makeRequest('/api/stats');

    return {
      content: [
        {
          type: 'text',
          text: `Thống kê CRM:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('CRM MCP Server đang chạy...');
  }
}

// Start server
const server = new CRMServer();
server.run().catch(console.error);
