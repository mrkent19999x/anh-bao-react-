# 🏦 Anh Bảo Bank - CRM System

## 📋 Tổng quan
Hệ thống CRM (Customer Relationship Management) hoàn chỉnh cho ngân hàng Anh Bảo Bank, được xây dựng với Next.js 14, TypeScript, PostgreSQL và Prisma ORM.

## ✨ Tính năng chính

### 🎯 Quản lý Khách hàng
- Danh sách khách hàng với tìm kiếm và lọc
- Thông tin chi tiết khách hàng
- Phân loại theo mức độ ưu tiên
- Theo dõi lịch sử giao dịch

### 📋 Quản lý Công việc
- Tạo và theo dõi công việc
- Phân công cho nhân viên
- Theo dõi tiến độ
- Nhắc nhở deadline

### 📄 Quản lý Tài liệu
- Upload và quản lý tài liệu
- Phân loại theo danh mục
- Tìm kiếm và lọc
- Chia sẻ tài liệu

### 📊 Báo cáo & Thống kê
- Dashboard tổng quan
- Báo cáo doanh số
- Thống kê khách hàng
- Biểu đồ trực quan

### 💬 Hệ thống Chat
- Chat nội bộ
- Chat với khách hàng
- Chatbot tự động
- Lưu trữ tin nhắn

### 👥 Quản lý Nhân viên
- Danh sách nhân viên
- Phân quyền theo cấp độ
- Theo dõi hiệu suất
- Quản lý phòng ban

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 14** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Radix UI** - UI components

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database Schema
- **Users** - Quản lý người dùng
- **Customers** - Thông tin khách hàng
- **Tasks** - Công việc
- **Documents** - Tài liệu
- **Reports** - Báo cáo
- **Chat Messages** - Tin nhắn
- **Conversations** - Cuộc trò chuyện

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- PostgreSQL 12+
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone https://github.com/your-username/bao-crm.git
cd bao-crm/apps/crm-nextjs

# Cài đặt dependencies
npm install

# Cấu hình database
cp env.example .env.local
# Chỉnh sửa .env.local với thông tin database

# Tạo database
npx prisma generate
npx prisma db push

# Seed dữ liệu mẫu
npx tsx prisma/seed.ts

# Chạy development server
npm run dev
```

### Truy cập
- **URL**: http://localhost:3000
- **Admin**: admin@anhbaobank.com / admin123
- **User**: user@anhbaobank.com / user123

## 📱 PWA Support
Ứng dụng hỗ trợ Progressive Web App (PWA) với:
- Service Worker
- Offline support
- Install prompt
- Push notifications

## 🔐 Bảo mật
- JWT authentication
- Password hashing với bcrypt
- CORS protection
- Input validation
- SQL injection protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập

### Customers
- `GET /api/customers` - Lấy danh sách khách hàng
- `POST /api/customers` - Tạo khách hàng mới
- `GET /api/customers/[id]` - Lấy thông tin khách hàng
- `PUT /api/customers/[id]` - Cập nhật khách hàng
- `DELETE /api/customers/[id]` - Xóa khách hàng

### Tasks
- `GET /api/tasks` - Lấy danh sách công việc
- `POST /api/tasks` - Tạo công việc mới

### Documents
- `GET /api/documents` - Lấy danh sách tài liệu
- `POST /api/documents` - Upload tài liệu

### Reports
- `GET /api/reports` - Lấy danh sách báo cáo
- `POST /api/reports` - Tạo báo cáo mới

### Chat
- `GET /api/chat/conversations` - Lấy danh sách cuộc trò chuyện
- `POST /api/chat/conversations` - Tạo cuộc trò chuyện mới
- `GET /api/chat/messages` - Lấy tin nhắn
- `POST /api/chat/messages` - Gửi tin nhắn

## 🚀 Deploy

### Vercel (Khuyến nghị)
```bash
npm i -g vercel
vercel
```

### Docker
```bash
docker build -t bao-crm .
docker run -p 3000:3000 bao-crm
```

### VPS/Server
```bash
npm run build
npm start
```

## 📁 Cấu trúc thư mục
```
bao-cmr/
├── apps/
│   └── crm-nextjs/          # Next.js application
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   └── hooks/       # Custom hooks
│       ├── prisma/          # Database schema & migrations
│       ├── lib/             # Utilities & configurations
│       └── public/          # Static assets
├── docs/                    # Documentation
└── README.md
```

## 🤝 Đóng góp
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ
- **Email**: admin@anhbaobank.com
- **Website**: https://anhbaobank.com

---

**🎉 Cảm ơn bạn đã sử dụng Anh Bảo Bank CRM System!**
