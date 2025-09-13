# 🚀 Anh Bảo Bank - CRM System (Next.js 14 PWA)

## ✨ Tính năng nổi bật

### 🎨 **UI/UX Siêu đẹp**
- **Glassmorphism Design** - Hiệu ứng kính mờ hiện đại
- **Dark/Light Mode** - Chuyển đổi theme mượt mà
- **Framer Motion** - Animations mượt mà, chuyên nghiệp
- **Responsive Design** - Tối ưu cho mọi thiết bị
- **shadcn/ui Components** - UI components đẹp nhất hiện tại

### 📱 **PWA Chuẩn**
- **Installable** - Cài đặt như app native
- **Offline Support** - Hoạt động khi không có mạng
- **Push Notifications** - Thông báo real-time
- **Background Sync** - Đồng bộ dữ liệu tự động
- **App-like Experience** - Trải nghiệm như app thật

### 🔧 **Tech Stack Hiện đại**
- **Next.js 14** - React framework mới nhất
- **TypeScript** - Type safety 100%
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations library
- **shadcn/ui** - UI components đẹp
- **next-pwa** - PWA plugin chuẩn

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
cd apps/crm-nextjs
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

### 3. Build production
```bash
npm run build
npm start
```

## 📱 Cài đặt PWA

### Android (Chrome/Samsung Internet)
1. Mở trình duyệt
2. Truy cập website
3. Nhấn menu (3 chấm) → "Thêm vào màn hình chính"
4. Đặt tên: "Anh Bảo Bank"
5. Nhấn "Thêm"

### iPhone (Safari)
1. Mở Safari
2. Truy cập website
3. Nhấn nút "Chia sẻ" (hình vuông + mũi tên)
4. Chọn "Thêm vào màn hình chính"
5. Đặt tên: "Anh Bảo Bank"
6. Nhấn "Thêm"

## 🎯 Tính năng chính

### 👥 Quản lý Khách hàng
- Xem danh sách khách hàng
- Thêm/sửa thông tin khách hàng
- Tạo link form riêng cho khách
- Cập nhật trạng thái hồ sơ

### 📋 Quản lý Công việc
- Xem danh sách công việc
- Thêm/sửa công việc
- Cập nhật tiến độ
- Đánh dấu hoàn thành

### 💬 Chat & Tương tác
- Chat nội bộ với đồng nghiệp
- Chat với khách hàng
- Chatbot tự động trả lời
- Cập nhật trạng thái từ chat

### 📁 Quản lý Tài liệu
- Upload tài liệu
- Xem danh sách tài liệu
- Tải xuống tài liệu
- Phân loại theo khách hàng

### 📊 Dashboard & Báo cáo
- Xem thống kê tổng quan
- Biểu đồ trạng thái khách hàng
- Tiến độ công việc
- Hoạt động 6 tháng gần đây

## 🔧 Cấu hình

### Environment Variables
Tạo file `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### PWA Configuration
File `next.config.js` đã được cấu hình sẵn:
- Service Worker tự động
- Cache strategies tối ưu
- Offline support
- Push notifications

## 🎨 UI Components

### Sử dụng shadcn/ui
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
```

### Custom CSS Classes
```css
.glass - Hiệu ứng kính mờ
.gradient-text - Text gradient đẹp
.card-hover - Hover effect cho card
.btn-primary - Button primary style
.btn-secondary - Button secondary style
```

## 🚀 Deploy

### Vercel (Khuyến nghị)
1. Push code lên GitHub
2. Kết nối với Vercel
3. Deploy tự động

### VPS/Server
1. Build project: `npm run build`
2. Start server: `npm start`
3. Cấu hình reverse proxy (Nginx)

## 📱 PWA Features

### Service Worker
- Cache static assets
- Cache API responses
- Offline fallback
- Background sync

### Manifest
- App icons (192x192, 512x512)
- Theme colors
- Display mode
- Shortcuts

### Notifications
- Push notifications
- Toast notifications
- Background sync

## 🎯 Performance

### Optimizations
- Image optimization
- Code splitting
- Lazy loading
- Service Worker caching
- CDN ready

### Metrics
- Lighthouse Score: 95+
- PWA Score: 100
- Performance: 90+
- Accessibility: 95+

## 🔒 Security

### Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

### PWA Security
- HTTPS required
- Secure context
- CSP headers

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Xóa cache và thử lại
3. Kiểm tra network connection
4. Liên hệ admin: admin@anhbaobank.com

---

**🎉 PWA siêu đẹp, siêu tiện với Next.js 14!**
