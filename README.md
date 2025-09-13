# 🏦 ANH BẢO BANK - CRM SYSTEM

## 📋 TỔNG QUAN

**Anh Bảo Bank CRM** là hệ thống quản lý khách hàng hoàn chỉnh được xây dựng với Next.js 14, TypeScript và Tailwind CSS. Hệ thống cung cấp giao diện thân thiện và đầy đủ tính năng cho việc quản lý khách hàng, nhân viên, công việc và báo cáo.

## ✨ TÍNH NĂNG CHÍNH

### 🎨 Giao diện người dùng
- **15 trang** hoàn chỉnh với thiết kế đẹp mắt
- **Responsive design** tối ưu cho mobile và desktop
- **UI Components** đầy đủ và nhất quán
- **100% tiếng Việt** dễ sử dụng

### 📱 Các trang chính
1. **Dashboard** - Tổng quan hệ thống
2. **Quản lý khách hàng** - Thông tin và lịch sử khách hàng
3. **Quản lý nhân viên** - Thông tin nhân viên và phòng ban
4. **Quản lý công việc** - Giao việc và theo dõi tiến độ
5. **Quản lý tài liệu** - Lưu trữ và chia sẻ tài liệu
6. **Báo cáo** - Thống kê và báo cáo chi tiết
7. **Cài đặt** - Cấu hình hệ thống
8. **Chat nội bộ** - Giao tiếp giữa nhân viên
9. **Chat khách hàng** - Hỗ trợ khách hàng
10. **Chatbot** - Tự động hóa hỗ trợ
11. **Trang nội bộ** - Thông tin nội bộ
12. **Form khách hàng** - Thu thập thông tin

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### Frontend
- **Next.js 14** - React framework với App Router
- **TypeScript** - Type safety và developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 CÁCH CHẠY DỰ ÁN

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone https://github.com/mrkent19999x/anh-bao-react-.git
cd anh-bao-react-

# Vào thư mục dự án
cd apps/crm-nextjs

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Truy cập
Mở browser và truy cập: `http://localhost:3000`

## 📁 CẤU TRÚC DỰ ÁN

```
apps/crm-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Trang chủ
│   │   ├── customers/         # Quản lý khách hàng
│   │   ├── employees/         # Quản lý nhân viên
│   │   ├── tasks/             # Quản lý công việc
│   │   ├── documents/         # Quản lý tài liệu
│   │   ├── reports/           # Báo cáo
│   │   ├── settings/          # Cài đặt
│   │   ├── login/             # Đăng nhập
│   │   ├── chat/              # Chat nội bộ
│   │   ├── customer-chat/     # Chat khách hàng
│   │   ├── chatbot/           # Chatbot
│   │   ├── internal/          # Nội bộ
│   │   └── form/              # Form khách hàng
│   ├── components/            # UI Components
│   │   └── ui/               # Base UI components
│   └── hooks/                # React Hooks
├── public/                   # Static files
├── package.json
├── next.config.js
└── tailwind.config.js
```

## 🎯 DEPLOY

### Netlify (Khuyến nghị)
1. Vào [app.netlify.com](https://app.netlify.com)
2. Drag & drop folder `apps/crm-nextjs`
3. Chờ deploy (2-3 phút)
4. Có link live ngay!

### Vercel
1. Vào [vercel.com](https://vercel.com)
2. Import từ GitHub
3. Cấu hình root directory: `apps/crm-nextjs`
4. Deploy

### GitHub Pages
1. Vào repository settings
2. Enable GitHub Pages
3. Chọn source branch
4. Chờ GitHub Actions

## 📊 TRẠNG THÁI DỰ ÁN

### ✅ Hoàn thành
- [x] Frontend hoàn chỉnh (15 trang)
- [x] UI/UX đẹp và responsive
- [x] TypeScript configuration
- [x] Tailwind CSS styling
- [x] Component library
- [x] Navigation system
- [x] 100% tiếng Việt

### ⚠️ Cần cải thiện
- [ ] Authentication system
- [ ] Database integration
- [ ] API endpoints
- [ ] Production deployment

## 🤝 ĐÓNG GÓP

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 LICENSE

Dự án này được phát triển cho Anh Bảo Bank. Mọi quyền được bảo lưu.

## 📞 LIÊN HỆ

- **Repository**: https://github.com/mrkent19999x/anh-bao-react-
- **Issues**: Sử dụng GitHub Issues để báo lỗi
- **Discussions**: Sử dụng GitHub Discussions để thảo luận

---

*Phát triển bởi Cipher AI Assistant - 13/09/2025*