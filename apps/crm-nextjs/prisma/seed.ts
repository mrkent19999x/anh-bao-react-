import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@anhbaobank.com' },
    update: {},
    create: {
      email: 'admin@anhbaobank.com',
      password: hashedPassword,
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      position: 'Quản lý khách hàng',
      department: 'Kinh doanh',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'user@anhbaobank.com' },
    update: {},
    create: {
      email: 'user@anhbaobank.com',
      password: userPassword,
      name: 'Trần Thị Bình',
      phone: '0907654321',
      position: 'Nhân viên tư vấn',
      department: 'Kinh doanh',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    }
  })

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        phone: '0901234567',
        company: 'Công ty ABC',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        status: 'active',
        priority: 'high',
        totalValue: 15000000,
        lastContact: new Date('2024-01-15'),
        notes: 'Khách hàng VIP, cần chăm sóc đặc biệt',
        userId: admin.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Trần Thị Bình',
        email: 'binh.tran@email.com',
        phone: '0907654321',
        company: 'Công ty XYZ',
        address: '456 Lê Lợi, Q3, TP.HCM',
        status: 'pending',
        priority: 'medium',
        totalValue: 8500000,
        lastContact: new Date('2024-01-10'),
        notes: 'Đang chờ duyệt hồ sơ',
        userId: admin.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Lê Văn Cường',
        email: 'cuong.le@email.com',
        phone: '0909876543',
        company: 'Công ty DEF',
        address: '789 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
        status: 'inactive',
        priority: 'low',
        totalValue: 25000000,
        lastContact: new Date('2023-12-20'),
        notes: 'Khách hàng cũ, cần liên hệ lại',
        userId: user.id
      }
    })
  ])

  // Create sample tasks
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Gọi điện cho khách hàng ABC',
        description: 'Liên hệ để xác nhận thông tin hồ sơ vay vốn',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-01-20'),
        progress: 60,
        estimatedTime: '2 giờ',
        userId: admin.id,
        customerId: customers[0].id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Xử lý hồ sơ khách hàng XYZ',
        description: 'Kiểm tra và duyệt hồ sơ vay vốn',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2024-01-25'),
        progress: 0,
        estimatedTime: '4 giờ',
        userId: user.id,
        customerId: customers[1].id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Báo cáo tháng 1/2024',
        description: 'Tổng hợp báo cáo doanh số tháng 1',
        status: 'completed',
        priority: 'low',
        dueDate: new Date('2024-01-30'),
        progress: 100,
        estimatedTime: '6 giờ',
        userId: admin.id
      }
    })
  ])

  // Create sample documents
  await Promise.all([
    prisma.document.create({
      data: {
        name: 'Báo cáo tài chính Q4 2023.pdf',
        type: 'pdf',
        size: '2.4 MB',
        category: 'Báo cáo',
        description: 'Báo cáo tài chính quý 4 năm 2023',
        tags: ['tài chính', 'báo cáo', 'Q4'],
        status: 'approved',
        downloadCount: 15,
        filePath: '/documents/report-q4-2023.pdf',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        userId: admin.id,
        customerId: customers[0].id
      }
    }),
    prisma.document.create({
      data: {
        name: 'Hợp đồng khách hàng ABC.docx',
        type: 'docx',
        size: '1.8 MB',
        category: 'Hợp đồng',
        description: 'Hợp đồng vay vốn với khách hàng ABC',
        tags: ['hợp đồng', 'vay vốn', 'ABC'],
        status: 'pending',
        downloadCount: 8,
        filePath: '/documents/contract-abc.docx',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=200&fit=crop',
        userId: user.id,
        customerId: customers[0].id
      }
    })
  ])

  // Create sample reports
  await Promise.all([
    prisma.report.create({
      data: {
        title: 'Báo cáo doanh số tháng 1/2024',
        type: 'sales',
        period: '2024-01',
        status: 'completed',
        totalRevenue: 1500000000,
        growth: 12.5,
        customers: 45,
        orders: 120,
        data: {
          revenue: [1200000000, 1500000000, 1800000000, 2200000000],
          customers: [120, 145, 167, 189]
        },
        userId: admin.id
      }
    }),
    prisma.report.create({
      data: {
        title: 'Báo cáo khách hàng mới',
        type: 'customers',
        period: '2024-01',
        status: 'pending',
        totalRevenue: 0,
        growth: 8.2,
        customers: 23,
        orders: 0,
        data: {},
        userId: user.id
      }
    })
  ])

  // Create sample conversations
  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        name: 'Nhóm Marketing',
        type: 'group',
        lastMessage: 'Báo cáo tháng 1 đã hoàn thành',
        unread: 3
      }
    }),
    prisma.conversation.create({
      data: {
        name: 'Nguyễn Văn An',
        type: 'private',
        lastMessage: 'Cảm ơn anh đã hỗ trợ',
        unread: 0
      }
    }),
    prisma.conversation.create({
      data: {
        name: 'Trần Thị Bình',
        type: 'private',
        lastMessage: 'Hồ sơ khách hàng XYZ cần xem xét',
        unread: 1
      }
    })
  ])

  // Create sample messages
  await Promise.all([
    prisma.chatMessage.create({
      data: {
        content: 'Chào mọi người, hôm nay có ai rảnh không?',
        type: 'text',
        isBot: false,
        status: 'read',
        conversationId: conversations[0].id
      }
    }),
    prisma.chatMessage.create({
      data: {
        content: 'Mình rảnh, có gì cần hỗ trợ không?',
        type: 'text',
        isBot: false,
        status: 'read',
        conversationId: conversations[0].id
      }
    }),
    prisma.chatMessage.create({
      data: {
        content: 'Tôi có thể giúp gì cho bạn?',
        type: 'text',
        isBot: true,
        status: 'read',
        conversationId: conversations[0].id
      }
    })
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created users: ${admin.name}, ${user.name}`)
  console.log(`👥 Created customers: ${customers.length}`)
  console.log(`📋 Created tasks: 3`)
  console.log(`📄 Created documents: 2`)
  console.log(`📊 Created reports: 2`)
  console.log(`💬 Created conversations: ${conversations.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
