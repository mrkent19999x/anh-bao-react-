# 🚀 Anh Bảo Bank - Hệ thống Quản lý Nội bộ & Hồ sơ Khách hàng

## 📋 Mô tả Dự án

**❗ QUAN TRỌNG: Đây KHÔNG phải là phần mềm khai thuế công khai ❗**

Anh Bảo Bank là **hệ thống nội bộ** được xây dựng bởi anh Nghĩa để:
- Quản lý **nhân viên/CTV** làm việc với khách hàng
- Giao và theo dõi **hồ sơ khách hàng** làm việc với thuế
- Tự động hóa giao việc, chat, thống kê
- Hỗ trợ công việc trung gian giữa **ngân hàng ↔️ thuế ↔️ khách hàng**

**Đặc điểm chính:**
- **Hệ thống nội bộ:** Chỉ nhân viên/CTV đăng nhập sử dụng
- **Không công khai:** Không có landing page hay quảng bá dịch vụ
- **Quản lý hồ sơ:** Tập trung vào quản lý hồ sơ khách hàng
- **Tạo link riêng:** Nhân viên có thể tạo link form riêng cho khách hàng

**🎯 Mục đích chính:**
Hệ thống phục vụ cho công việc liên kết giữa ngân hàng, khách hàng và cơ quan thuế thông qua các sản phẩm vay theo hồ sơ thuế, **KHÔNG phải để quản lý thuế cho khách**.

## 📜 Lịch sử Phát triển

### 🎯 **Giai đoạn 1: Khởi tạo & Setup (Ban đầu)**
- **Ngày bắt đầu:** 2024
- **Mục tiêu:** Tạo hệ thống CRM cơ bản với Firebase
- **Công nghệ:** HTML5, CSS3, JavaScript, Firebase

#### ✅ **Đã hoàn thành:**
1. **Setup Firebase Project:**
   - Tạo project `anhbao-373f3` trên Firebase Console
   - Cấu hình Firebase Hosting, Authentication, Firestore
   - Setup Firebase CLI và deploy cơ bản

2. **Xử lý lỗi Authentication:**
   - Gặp lỗi "Tạo tài khoản bị vô hiệu hóa"
   - Bật Email/Password sign-in method trong Firebase Console
   - Tạo trang `create-admin.html` để tạo admin đầu tiên
   - Debug và fix lỗi `auth/invalid-login-credentials`

3. **Chuyển đổi Database:**
   - Ban đầu dùng Firebase Realtime Database
   - Gặp lỗi billing requirement (Blaze Plan)
   - **Quyết định quan trọng:** Chuyển sang Firestore (free tier)
   - Refactor toàn bộ code để sử dụng Firestore

4. **Tạo trang đăng nhập:**
   - `login.html` với Firebase Authentication
   - `auth.js` xử lý đăng nhập/đăng xuất
   - Tích hợp với Firestore để lấy thông tin user

### 🎨 **Giai đoạn 2: UI/UX Overhaul (Cải thiện giao diện)**
- **Nguyên nhân:** User feedback "màu sắc lởm lắm, UI thô thô, không mềm mại"
- **Mục tiêu:** Tạo giao diện hiện đại, mềm mại, đẹp mắt

#### ✅ **Đã hoàn thành:**
1. **Thiết kế mới:**
   - **Glassmorphism Design:** Backdrop blur, transparency effects
   - **Gradient Colors:** `#667eea` → `#764ba2` (Primary)
   - **Smooth Animations:** Cubic-bezier transitions
   - **Modern UI Components:** Cards, buttons, modals

2. **Cập nhật CSS toàn bộ:**
   - `main.css`: Global styles với Glassmorphism
   - `employees.css`: Trang nhân viên với design mới
   - `reports.css`: Trang báo cáo với animations
   - Responsive design cho mobile

3. **Cải thiện UX:**
   - Hover effects mượt mà
   - Loading states
   - Error handling đẹp mắt
   - Notifications với animations

### 👥 **Giai đoạn 3: Quản lý Nhân viên (Employees)**
- **Mục tiêu:** Tạo hệ thống quản lý nhân viên hoàn chỉnh

#### ✅ **Đã hoàn thành:**
1. **Trang nhân viên (`employees.html`):**
   - Giao diện quản lý với bảng dữ liệu
   - Modal thêm/sửa nhân viên
   - Tìm kiếm và lọc theo vai trò, trạng thái

2. **Logic quản lý (`employees.js`):**
   - CRUD operations với Firestore
   - Validation dữ liệu
   - Real-time updates
   - Error handling

3. **Tính năng:**
   - Thêm/Sửa/Xóa nhân viên
   - Phân quyền: Admin, Manager, Staff, Sales
   - Trạng thái: Active/Inactive
   - Tìm kiếm và lọc
   - Thống kê số lượng nhân viên

### 📊 **Giai đoạn 4: Báo cáo & Thống kê (Reports)**
- **Mục tiêu:** Tạo hệ thống báo cáo trực quan với biểu đồ

#### ✅ **Đã hoàn thành:**
1. **Trang báo cáo (`reports.html`):**
   - Dashboard với 4 biểu đồ chính
   - Thống kê tổng quan
   - Top customers và recent activities

2. **Tích hợp Chart.js (`reports.js`):**
   - **Customer Growth:** Biểu đồ tăng trưởng khách hàng
   - **Task Status:** Phân bố trạng thái công việc
   - **Employee Performance:** Hiệu suất nhân viên
   - **Revenue:** Doanh thu theo tháng

3. **Tính năng:**
   - Real-time data từ Firestore
   - Responsive charts
   - Date filtering
   - Export data (planned)

### 📋 **Giai đoạn 5: Quản lý Công việc (Tasks)**
- **Mục tiêu:** Tạo hệ thống quản lý công việc và phân công

#### ✅ **Đã hoàn thành:**
1. **Trang công việc (`tasks.html`):**
   - Giao diện quản lý tasks với bảng
   - Modal thêm/sửa công việc
   - Filters theo trạng thái, priority, assignee

2. **Logic quản lý (`tasks.js`):**
   - CRUD operations cho tasks
   - Assignment cho nhân viên
   - Status tracking: Pending, Processing, Completed
   - Priority levels: Low, Medium, High

3. **Tính năng:**
   - Tạo và gán công việc
   - Theo dõi tiến độ
   - Deadline management
   - Search và filter
   - Thống kê tasks

### 👥 **Giai đoạn 6: Quản lý Khách hàng (Customers)**
- **Mục tiêu:** Tạo hệ thống quản lý khách hàng hoàn chỉnh

#### ✅ **Đã hoàn thành:**
1. **Trang khách hàng (`customers.html`):**
   - Giao diện quản lý customers
   - Modal thêm/sửa thông tin khách hàng
   - Bảng hiển thị với sorting và filtering

2. **Logic quản lý (`customers.js`):**
   - CRUD operations cho customers
   - Customer categorization
   - Contact management
   - Activity tracking

3. **Tính năng:**
   - Thêm/Sửa/Xóa khách hàng
   - Phân loại: Individual, Company, VIP
   - Trạng thái: Active, Inactive, Prospect
   - Tìm kiếm và lọc
   - Thống kê khách hàng

### 💬 **Giai đoạn 7: Hệ thống Chat**
- **Mục tiêu:** Tạo hệ thống chat real-time cho giao tiếp nội bộ và với khách hàng

#### ✅ **Đã hoàn thành:**
1. **Trang chat (`chat.html`):**
   - Giao diện 3 cột: Conversations, Chat area, Info panel
   - Modal tạo cuộc trò chuyện mới
   - Real-time messaging interface

2. **Logic chat (`chat.js`):**
   - Real-time messaging với Firestore
   - Conversation management
   - Message status tracking
   - File sharing (planned)

3. **Tính năng:**
   - Tạo cuộc trò chuyện mới
   - Chat real-time
   - Loại chat: Customer, Internal, Support
   - Search conversations
   - Message history

### 📁 **Giai đoạn 8: Quản lý Tài liệu (Documents)**
- **Mục tiêu:** Tạo hệ thống upload và quản lý tài liệu

#### ✅ **Đã hoàn thành:**
1. **Trang tài liệu (`documents.html`):**
   - Giao diện quản lý documents
   - Upload modal với drag & drop
   - Grid/List view toggle
   - File preview

2. **Logic quản lý (`documents.js`):**
   - File upload với Firebase Storage
   - Document categorization
   - Search và filter
   - Download tracking

3. **Tính năng:**
   - Upload multiple files
   - Drag & drop interface
   - File categorization
   - Search và filter
   - Download tracking
   - File preview

## 📜 Lịch sử Phát triển

### 🎯 **Giai đoạn 1: Khởi tạo & Setup (Ban đầu)**
- **Ngày bắt đầu:** 2024
- **Mục tiêu:** Tạo hệ thống CRM cơ bản với Firebase
- **Công nghệ:** HTML5, CSS3, JavaScript, Firebase

#### ✅ **Đã hoàn thành:**
1. **Setup Firebase Project:**
   - Tạo project `anhbao-373f3` trên Firebase Console
   - Cấu hình Firebase Hosting, Authentication, Firestore
   - Setup Firebase CLI và deploy cơ bản

2. **Xử lý lỗi Authentication:**
   - Gặp lỗi "Tạo tài khoản bị vô hiệu hóa"
   - Bật Email/Password sign-in method trong Firebase Console
   - Tạo trang `create-admin.html` để tạo admin đầu tiên
   - Debug và fix lỗi `auth/invalid-login-credentials`

3. **Chuyển đổi Database:**
   - Ban đầu dùng Firebase Realtime Database
   - Gặp lỗi billing requirement (Blaze Plan)
   - **Quyết định quan trọng:** Chuyển sang Firestore (free tier)
   - Refactor toàn bộ code để sử dụng Firestore

4. **Tạo trang đăng nhập:**
   - `login.html` với Firebase Authentication
   - `auth.js` xử lý đăng nhập/đăng xuất
   - Tích hợp với Firestore để lấy thông tin user

### 🎨 **Giai đoạn 2: UI/UX Overhaul (Cải thiện giao diện)**
- **Nguyên nhân:** User feedback "màu sắc lởm lắm, UI thô thô, không mềm mại"
- **Mục tiêu:** Tạo giao diện hiện đại, mềm mại, đẹp mắt

#### ✅ **Đã hoàn thành:**
1. **Thiết kế mới:**
   - **Glassmorphism Design:** Backdrop blur, transparency effects
   - **Gradient Colors:** `#667eea` → `#764ba2` (Primary)
   - **Smooth Animations:** Cubic-bezier transitions
   - **Modern UI Components:** Cards, buttons, modals

2. **Cập nhật CSS toàn bộ:**
   - `main.css`: Global styles với Glassmorphism
   - `employees.css`: Trang nhân viên với design mới
   - `reports.css`: Trang báo cáo với animations
   - Responsive design cho mobile

3. **Cải thiện UX:**
   - Hover effects mượt mà
   - Loading states
   - Error handling đẹp mắt
   - Notifications với animations

### 👥 **Giai đoạn 3: Quản lý Nhân viên (Employees)**
- **Mục tiêu:** Tạo hệ thống quản lý nhân viên hoàn chỉnh

#### ✅ **Đã hoàn thành:**
1. **Trang nhân viên (`employees.html`):**
   - Giao diện quản lý với bảng dữ liệu
   - Modal thêm/sửa nhân viên
   - Tìm kiếm và lọc theo vai trò, trạng thái

2. **Logic quản lý (`employees.js`):**
   - CRUD operations với Firestore
   - Validation dữ liệu
   - Real-time updates
   - Error handling

3. **Tính năng:**
   - Thêm/Sửa/Xóa nhân viên
   - Phân quyền: Admin, Manager, Staff, Sales
   - Trạng thái: Active/Inactive
   - Tìm kiếm và lọc
   - Thống kê số lượng nhân viên

### 📊 **Giai đoạn 4: Báo cáo & Thống kê (Reports)**
- **Mục tiêu:** Tạo hệ thống báo cáo trực quan với biểu đồ

#### ✅ **Đã hoàn thành:**
1. **Trang báo cáo (`reports.html`):**
   - Dashboard với 4 biểu đồ chính
   - Thống kê tổng quan
   - Top customers và recent activities

2. **Tích hợp Chart.js (`reports.js`):**
   - **Customer Growth:** Biểu đồ tăng trưởng khách hàng
   - **Task Status:** Phân bố trạng thái công việc
   - **Employee Performance:** Hiệu suất nhân viên
   - **Revenue:** Doanh thu theo tháng

3. **Tính năng:**
   - Real-time data từ Firestore
   - Responsive charts
   - Date filtering
   - Export data (planned)

### 📋 **Giai đoạn 5: Quản lý Công việc (Tasks)**
- **Mục tiêu:** Tạo hệ thống quản lý công việc và phân công

#### ✅ **Đã hoàn thành:**
1. **Trang công việc (`tasks.html`):**
   - Giao diện quản lý tasks với bảng
   - Modal thêm/sửa công việc
   - Filters theo trạng thái, priority, assignee

2. **Logic quản lý (`tasks.js`):**
   - CRUD operations cho tasks
   - Assignment cho nhân viên
   - Status tracking: Pending, Processing, Completed
   - Priority levels: Low, Medium, High

3. **Tính năng:**
   - Tạo và gán công việc
   - Theo dõi tiến độ
   - Deadline management
   - Search và filter
   - Thống kê tasks

### 👥 **Giai đoạn 6: Quản lý Khách hàng (Customers)**
- **Mục tiêu:** Tạo hệ thống quản lý khách hàng hoàn chỉnh

#### ✅ **Đã hoàn thành:**
1. **Trang khách hàng (`customers.html`):**
   - Giao diện quản lý customers
   - Modal thêm/sửa thông tin khách hàng
   - Bảng hiển thị với sorting và filtering

2. **Logic quản lý (`customers.js`):**
   - CRUD operations cho customers
   - Customer categorization
   - Contact management
   - Activity tracking

3. **Tính năng:**
   - Thêm/Sửa/Xóa khách hàng
   - Phân loại: Individual, Company, VIP
   - Trạng thái: Active, Inactive, Prospect
   - Tìm kiếm và lọc
   - Thống kê khách hàng

### 💬 **Giai đoạn 7: Hệ thống Chat**
- **Mục tiêu:** Tạo hệ thống chat real-time cho giao tiếp nội bộ và với khách hàng

#### ✅ **Đã hoàn thành:**
1. **Trang chat (`chat.html`):**
   - Giao diện 3 cột: Conversations, Chat area, Info panel
   - Modal tạo cuộc trò chuyện mới
   - Real-time messaging interface

2. **Logic chat (`chat.js`):**
   - Real-time messaging với Firestore
   - Conversation management
   - Message status tracking
   - File sharing (planned)

3. **Tính năng:**
   - Tạo cuộc trò chuyện mới
   - Chat real-time
   - Loại chat: Customer, Internal, Support
   - Search conversations
   - Message history

### 📁 **Giai đoạn 8: Quản lý Tài liệu (Documents)**
- **Mục tiêu:** Tạo hệ thống upload và quản lý tài liệu

#### ✅ **Đã hoàn thành:**
1. **Trang tài liệu (`documents.html`):**
   - Giao diện quản lý documents
   - Upload modal với drag & drop
   - Grid/List view toggle
   - File preview

2. **Logic quản lý (`documents.js`):**
   - File upload với Firebase Storage
   - Document categorization
   - Search và filter
   - Download tracking

3. **Tính năng:**
   - Upload multiple files
   - Drag & drop interface
   - File categorization
   - Search và filter
   - Download tracking
   - File preview

## ✨ Tính năng Chính (Tổng hợp)

### 🏠 Dashboard
- **Thống kê tổng quan:** Hiển thị số liệu khách hàng, công việc, nhân viên
- **Biểu đồ trực quan:** Theo dõi hiệu suất và tăng trưởng
- **Hoạt động gần đây:** Cập nhật real-time các hoạt động mới nhất

### 👥 Quản lý Khách hàng & Hồ sơ
- **Thêm/Sửa/Xóa khách hàng:** Quản lý thông tin chi tiết
- **Tìm kiếm & Lọc:** Tìm kiếm nhanh theo tên, email, số điện thoại
- **Phân loại khách hàng:** Individual, Company, VIP
- **Trạng thái hồ sơ:** Đã tiếp nhận, Đang xử lý, Đợi bổ sung giấy tờ, Đã hoàn thành
- **Lịch sử tương tác:** Theo dõi các hoạt động với khách hàng
- **Tạo link form riêng:** Nhân viên có thể tạo link `/form/:id` cho khách hàng điền
- **Trace tracking:** Ghi nhận ai tạo form, khách nào điền

### 👨‍💼 Quản lý Nhân viên
- **Quản lý hồ sơ nhân viên:** Thông tin cá nhân, vai trò, phòng ban
- **Phân quyền:** Admin, Manager, Staff, Sales
- **Trạng thái hoạt động:** Đang hoạt động/Không hoạt động
- **Thống kê nhân viên:** Tổng số, đang hoạt động, nhân viên mới

### 📋 Quản lý Công việc
- **Tạo & Gán công việc:** Phân công cho nhân viên cụ thể
- **Theo dõi tiến độ:** Trạng thái Pending, Processing, Completed
- **Deadline & Priority:** Quản lý thời hạn và độ ưu tiên (Low, Medium, High)
- **Lịch sử công việc:** Theo dõi các thay đổi và cập nhật

### 📊 Báo cáo & Thống kê
- **Biểu đồ tăng trưởng:** Khách hàng mới theo thời gian
- **Phân tích công việc:** Trạng thái và hiệu suất
- **Hiệu suất nhân viên:** Số lượng công việc hoàn thành
- **Doanh thu:** Theo dõi doanh thu theo tháng
- **Khách hàng hàng đầu:** Top 5 khách hàng mới nhất
- **Hoạt động gần đây:** Timeline các hoạt động

### 💬 Chat & Chatbot
- **Chat nội bộ:** Giao tiếp giữa nhân viên
- **Chat với khách hàng:** Hỗ trợ khách hàng trực tuyến
- **Loại cuộc trò chuyện:** Customer, Internal, Support
- **Lịch sử chat:** Lưu trữ các cuộc hội thoại
- **Real-time messaging:** Tin nhắn real-time
- **Chatbot đơn giản:** Phản hồi theo trạng thái hồ sơ
- **Auto-reply:** Tự động trả lời dựa trên field `status` của hồ sơ

### 📁 Quản lý Tài liệu & Hồ sơ
- **Upload & Quản lý:** Tài liệu khách hàng, hồ sơ thuế
- **Drag & Drop:** Upload file dễ dàng
- **Phân loại:** Theo loại tài liệu và danh mục
- **Tìm kiếm:** Tìm kiếm nhanh tài liệu
- **Download tracking:** Theo dõi lượt tải
- **File preview:** Xem trước tài liệu
- **Hồ sơ thuế:** Quản lý giấy tờ liên quan đến thuế
- **Bảo mật:** Mỗi nhân viên chỉ xem hồ sơ của mình (trừ Admin)

## 🛠 Công nghệ Sử dụng

### Frontend
- **HTML5:** Cấu trúc trang web
- **CSS3:** Styling với Glassmorphism và Gradient
- **JavaScript (ES6+):** Logic và tương tác
- **Chart.js:** Biểu đồ và thống kê trực quan
- **Font Awesome:** Icons đẹp mắt

### Backend & Database
- **Firebase Hosting:** Hosting ứng dụng
- **Firebase Authentication:** Xác thực người dùng
- **Firestore Database:** Cơ sở dữ liệu NoSQL (real-time)
- **Firebase Storage:** Lưu trữ file và tài liệu
- **Firebase CLI:** Quản lý và deploy

### UI/UX Design
- **Glassmorphism:** Hiệu ứng trong suốt hiện đại
- **Gradient Design:** Màu sắc mềm mại
- **Responsive Design:** Tương thích mọi thiết bị
- **Smooth Animations:** Chuyển động mượt mà
- **Modern Components:** Cards, modals, buttons

## 🚀 Hướng dẫn Cài đặt & Deploy

### Bước 1: Chuẩn bị Môi trường
```bash
# Cài đặt Node.js (nếu chưa có)
# Tải từ: https://nodejs.org/

# Cài đặt Firebase CLI
npm install -g firebase-tools

# Đăng nhập Firebase
firebase login
```

### Bước 2: Tạo Project Firebase
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới với tên `anhbao-373f3`
3. Bật các service:
   - **Authentication:** Email/Password
   - **Firestore Database:** Tạo database
   - **Storage:** Lưu trữ file
   - **Hosting:** Chuẩn bị hosting

### Bước 3: Clone & Setup Dự án
```bash
# Clone dự án (nếu có)
git clone <repository-url>
cd crm-etax

# Hoặc tạo thư mục mới
mkdir crm-etax
cd crm-etax
```

### Bước 4: Cấu hình Firebase
1. **Cập nhật firebase.json:**
```json
{
  "hosting": {
    "public": "src",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

2. **Cập nhật .firebaserc:**
```json
{
  "projects": {
    "default": "anhbao-373f3"
  }
}
```

3. **Cập nhật firebase-config.js:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCQ7R-GyZjSY_iPQ1iooF_uFOa35gViM18",
  authDomain: "anhbao-373f3.firebaseapp.com",
  projectId: "anhbao-373f3",
  storageBucket: "anhbao-373f3.firebasestorage.app",
  messagingSenderId: "599456783339",
  appId: "1:599456783339:web:cd57a672317cfaf2d617ae"
};
```

### Bước 5: Tạo Admin User
1. Truy cập: `https://anhbao-373f3.web.app/create-admin.html`
2. Tạo tài khoản admin đầu tiên
3. Lưu thông tin đăng nhập

### Bước 6: Deploy
```bash
# Deploy lên Firebase
firebase deploy

# Hoặc deploy chỉ hosting
firebase deploy --only hosting
```

## 📱 Hướng dẫn Sử dụng

### Đăng nhập Hệ thống
1. Truy cập: `https://anhbao-373f3.web.app/login.html`
2. Nhập email và mật khẩu admin
3. Đăng nhập vào hệ thống

### Quản lý Nhân viên
1. Vào menu **"Nhân viên"**
2. **Thêm nhân viên:** Click nút "Thêm nhân viên"
3. **Sửa/Xóa:** Sử dụng các nút action trong bảng
4. **Tìm kiếm:** Sử dụng ô tìm kiếm

### Quản lý Khách hàng
1. Vào menu **"Khách hàng"**
2. **Thêm khách hàng:** Click nút "Thêm khách hàng"
3. **Quản lý thông tin:** Cập nhật thông tin chi tiết
4. **Theo dõi trạng thái:** Quản lý trạng thái khách hàng

### Quản lý Công việc
1. Vào menu **"Công việc"**
2. **Tạo công việc:** Click nút "Thêm công việc"
3. **Gán nhân viên:** Chọn nhân viên thực hiện
4. **Theo dõi tiến độ:** Cập nhật trạng thái công việc

### Chat & Tương tác
1. Vào menu **"Chat"**
2. **Tạo cuộc trò chuyện:** Click "Cuộc trò chuyện mới"
3. **Chọn loại:** Customer, Internal, Support
4. **Gửi tin nhắn:** Real-time messaging

### Quản lý Tài liệu
1. Vào menu **"Tài liệu"**
2. **Upload tài liệu:** Click "Tải lên tài liệu"
3. **Drag & Drop:** Kéo thả file vào upload area
4. **Phân loại:** Chọn danh mục và tags
5. **Tìm kiếm:** Sử dụng filters và search

### Xem Báo cáo
1. Vào menu **"Báo cáo"**
2. **Chọn khoảng thời gian:** Dropdown "30 ngày qua"
3. **Xem biểu đồ:** Tăng trưởng, hiệu suất, doanh thu
4. **Phân tích dữ liệu:** Top khách hàng, hoạt động gần đây

## 🎨 Thiết kế UI/UX

### Màu sắc Chủ đạo
- **Primary:** Gradient `#667eea` → `#764ba2`
- **Background:** Gradient `#f8f9fa` → `#e9ecef` → `#dee2e6`
- **Text:** `#2c3e50` (Dark Blue)
- **Secondary:** `#6c757d` (Gray)
- **Success:** `#28a745` (Green)
- **Warning:** `#ffc107` (Yellow)
- **Danger:** `#dc3545` (Red)

### Hiệu ứng Đặc biệt
- **Glassmorphism:** Backdrop blur 20px
- **Smooth Animations:** Cubic-bezier transitions
- **Hover Effects:** Transform và shadow
- **Responsive:** Mobile-first design
- **Modern Components:** Cards, modals, buttons

## 🔧 Cấu trúc Thư mục

```
crm-etax/
├── src/
│   ├── index.html              # Dashboard chính
│   ├── login.html              # Trang đăng nhập
│   ├── create-admin.html       # Tạo admin
│   ├── employees.html          # Quản lý nhân viên
│   ├── customers.html          # Quản lý khách hàng & hồ sơ
│   ├── tasks.html              # Quản lý công việc
│   ├── chat.html               # Hệ thống chat & chatbot
│   ├── documents.html          # Quản lý tài liệu & hồ sơ
│   ├── reports.html            # Báo cáo & thống kê
│   ├── styles/
│   │   ├── main.css            # CSS chính (Glassmorphism)
│   │   ├── employees.css       # CSS trang nhân viên
│   │   ├── customers.css       # CSS trang khách hàng
│   │   ├── tasks.css           # CSS trang công việc
│   │   ├── chat.css            # CSS trang chat
│   │   ├── documents.css       # CSS trang tài liệu
│   │   └── reports.css         # CSS trang báo cáo
│   └── scripts/
│       ├── firebase-config.js  # Cấu hình Firebase
│       ├── auth.js             # Xác thực
│       ├── employees.js        # Logic nhân viên
│       ├── customers.js        # Logic khách hàng & hồ sơ
│       ├── tasks.js            # Logic công việc
│       ├── chat.js             # Logic chat & chatbot
│       ├── documents.js        # Logic tài liệu & hồ sơ
│       └── reports.js          # Logic báo cáo
├── firebase.json               # Cấu hình Firebase
├── .firebaserc                 # Project ID
└── README.md                   # Tài liệu này
```

## 🗄️ Mô hình Dữ liệu (Firestore)

### 👥 Users Collection
```javascript
users: {
  uid: {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "staff", // admin, manager, staff, sales
    isActive: true,
    createdAt: Timestamp,
    createdForms: ["abc123", "xyz456"] // Links đã tạo
  }
}
```

### 👤 Customers Collection
```javascript
customers: {
  customerId: {
    name: "Trần Văn B",
    email: "tranvanb@example.com",
    phone: "0123456789",
    type: "individual", // individual, company, vip
    status: "Đang xử lý", // Đã tiếp nhận, Đang xử lý, Đợi bổ sung giấy tờ, Đã hoàn thành
    assignedTo: "uid", // Nhân viên phụ trách
    createdAt: Timestamp,
    updatedAt: Timestamp,
    documents: ["doc1", "doc2"], // Tài liệu liên quan
    history: [
      {
        action: "Tạo hồ sơ",
        timestamp: Timestamp,
        user: "uid"
      }
    ]
  }
}
```

### 📋 Tasks Collection
```javascript
tasks: {
  taskId: {
    title: "Xử lý hồ sơ thuế",
    description: "Hoàn thiện hồ sơ cho khách hàng ABC",
    assignedTo: "uid",
    customerId: "customerId",
    status: "processing", // pending, processing, completed
    priority: "medium", // low, medium, high
    deadline: Timestamp,
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}
```

### 💬 Conversations Collection
```javascript
conversations: {
  conversationId: {
    title: "Hỗ trợ khách hàng ABC",
    type: "customer", // customer, internal, support
    participants: ["uid1", "uid2"],
    lastMessage: "Hồ sơ đang được xử lý",
    updatedAt: Timestamp,
    createdAt: Timestamp
  }
}
```

### 📝 Messages Collection
```javascript
messages: {
  messageId: {
    conversationId: "conversationId",
    senderId: "uid",
    senderName: "Nguyễn Văn A",
    text: "Hồ sơ đang được xử lý",
    timestamp: Timestamp,
    status: "sent" // sent, delivered, read
  }
}
```

### 💬 Chatbot Messages Collection
```javascript
messages: {
  abc123: [ // Form ID
    {
      from: "customer",
      text: "E ơi hồ sơ anh đến đâu rồi?",
      timestamp: Timestamp
    },
    {
      from: "bot",
      text: "Hồ sơ của anh đang được xử lý, vui lòng đợi.",
      timestamp: Timestamp
    }
  ]
}
```

### 📁 Documents Collection
```javascript
documents: {
  documentId: {
    fileName: "ho-so-thue.pdf",
    fileSize: 1024000,
    fileType: "pdf",
    downloadURL: "https://...",
    category: "tax", // contracts, reports, invoices, tax, other
    uploadedBy: "uid",
    customerId: "customerId", // Liên kết với khách hàng
    tags: ["thuế", "hồ sơ"],
    description: "Hồ sơ thuế năm 2024",
    downloadCount: 0,
    uploadedAt: Timestamp
  }
}
```

## 🔗 Tính năng Đặc biệt

### 📝 Tạo Link Form Riêng
- **Mục đích:** Nhân viên tạo link riêng cho khách hàng điền thông tin
- **Luồng hoạt động:**
  1. **Nhân viên tạo link:** Tạo form với ID duy nhất (vd: `abc123`)
  2. **Gửi cho khách hàng:** Link: `https://anhbao-373f3.web.app/form/abc123`
  3. **Khách hàng điền form:** Dữ liệu được ghi nhận với trace `createdBy: "uid"`
  4. **Nhân viên cập nhật trạng thái:** Cập nhật status hồ sơ (Đã tiếp nhận → Đang xử lý → Đã hoàn thành)
  5. **Khách chat hỏi tình trạng:** Sử dụng chat để hỏi thông tin
  6. **Chatbot phản hồi:** Chỉ trả lời theo status do nhân viên cập nhật

### 🤖 Chatbot Đơn giản
- **Mục đích:** Tự động trả lời khách hàng theo trạng thái hồ sơ
- **Cách hoạt động:**
```javascript
// Ví dụ logic chatbot
if (status === "Đã tiếp nhận") {
  return "Hồ sơ của anh/chị đã được tiếp nhận, chúng tôi sẽ xử lý trong thời gian sớm nhất.";
} else if (status === "Đang xử lý") {
  return "Hồ sơ của anh/chị đang được xử lý, vui lòng đợi cập nhật tiếp theo.";
} else if (status === "Đợi bổ sung giấy tờ") {
  return "Hồ sơ cần bổ sung thêm giấy tờ, vui lòng liên hệ nhân viên phụ trách.";
} else if (status === "Đã hoàn thành") {
  return "Hồ sơ đã hoàn thành, cảm ơn anh/chị đã sử dụng dịch vụ.";
}
```

### 🔒 Bảo mật Dữ liệu
- **Phân quyền:** Mỗi nhân viên chỉ xem hồ sơ của mình
- **Admin:** Có thể truy cập toàn bộ dữ liệu
- **Manager:** Có thể xem dữ liệu của team mình
- **Staff/Sales:** Chỉ xem dữ liệu được gán

## 🚨 Xử lý Lỗi Thường gặp

### Lỗi Authentication
```bash
# Lỗi: "Tạo tài khoản bị vô hiệu hóa"
# Giải pháp: Bật Email/Password trong Firebase Console
# Authentication > Sign-in method > Email/Password > Enable
```

### Lỗi Database
```bash
# Lỗi: "Permission denied"
# Giải pháp: Cập nhật Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Lỗi Deploy
```bash
# Lỗi: "Not in a Firebase app directory"
# Giải pháp: Đảm bảo đang ở thư mục crm-etax
cd crm-etax
firebase deploy
```

### Lỗi Storage
```bash
# Lỗi: "Storage permission denied"
# Giải pháp: Cập nhật Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📞 Hỗ trợ & Liên hệ

### Thông tin Dự án
- **Tên dự án:** Anh Bảo Bank
- **Version:** 2.0.0 (Complete Edition)
- **Ngày tạo:** 2024
- **Developer:** Cipher (AI Assistant)
- **User:** Nghĩa

### Liên hệ Hỗ trợ
- **Email:** support@anhbaobank.com
- **Website:** https://anhbao-373f3.web.app
- **Documentation:** Đọc file README.md này

## 🔄 Cập nhật & Bảo trì

### Phiên bản Hiện tại
- **v2.0.0:** Phiên bản hoàn chỉnh với 8 tính năng chính
- **UI/UX:** Glassmorphism design hiện đại
- **Database:** Firestore với real-time updates
- **Storage:** Firebase Storage cho file upload
- **Security:** Firebase Authentication
- **Real-time:** Chat và notifications

### Tính năng Đã Hoàn thành ✅
- [x] **Dashboard:** Thống kê tổng quan với biểu đồ real-time
- [x] **Authentication:** Đăng nhập/đăng xuất an toàn
- [x] **Employees:** Quản lý nhân viên đầy đủ
- [x] **Customers:** Quản lý khách hàng chi tiết + Form System
- [x] **Tasks:** Quản lý công việc và phân công
- [x] **Chat:** Hệ thống chat real-time + Chatbot
- [x] **Documents:** Upload và quản lý tài liệu
- [x] **Form System:** Tạo link form riêng cho khách hàng
- [x] **UI/UX:** Glassmorphism design hiện đại
- [x] **Responsive:** Tương thích mobile
- [x] **Security:** Firestore Rules + Role-based access
- [x] **Performance:** Optimized queries + Indexes

### Kế hoạch Phát triển Tương lai 🚀
- [ ] **Trang Nội bộ:** Cài đặt hệ thống, quản lý cấu hình
- [ ] **Mobile App:** React Native app
- [ ] **AI Chatbot:** Hỗ trợ tự động
- [ ] **Payment Integration:** Thanh toán online
- [ ] **Export Features:** PDF/Excel reports
- [ ] **Advanced Analytics:** AI-powered insights
- [ ] **Multi-language:** Hỗ trợ đa ngôn ngữ
- [ ] **API Integration:** Tích hợp với hệ thống khác

## 🎯 Kết luận

Anh Bảo Bank đã phát triển từ một ý tưởng đơn giản thành một **hệ thống quản lý nội bộ hoàn chỉnh** với 8 tính năng chính. Quá trình phát triển đã trải qua nhiều thách thức và cải tiến:

### 🏆 **Thành tựu Đạt được:**
1. **Hệ thống nội bộ hoàn chỉnh:** 8 tính năng chính đã hoàn thành
2. **UI/UX hiện đại:** Glassmorphism design đẹp mắt
3. **Real-time:** Chat và notifications real-time
4. **Scalable:** Kiến trúc có thể mở rộng
5. **User-friendly:** Dễ sử dụng cho nhân viên/CTV
6. **Bảo mật:** Phân quyền theo nhân viên

### 🎨 **Cải tiến UI/UX:**
- Từ giao diện "thô thô, lởm lắm" → Glassmorphism hiện đại
- Từ màu sắc "mờ lắm" → Gradient đẹp mắt
- Từ "ko đc mềm mại" → Smooth animations

### 🔧 **Kỹ thuật:**
- Chuyển từ Realtime Database → Firestore
- Tích hợp Firebase Storage cho file upload
- Real-time messaging với Firestore
- Chart.js cho báo cáo trực quan

### 🎯 **Mục đích chính:**
- **Quản lý nhân viên/CTV** làm việc với khách hàng
- **Theo dõi hồ sơ** khách hàng làm việc với thuế
- **Tự động hóa** giao việc, chat, thống kê
- **Hỗ trợ trung gian** ngân hàng ↔️ thuế ↔️ khách hàng

**Hệ thống hiện tại đã sẵn sàng cho production và phục vụ đúng mục đích nội bộ! 🚀**

### 🧪 Test & Deployment:
- ✅ **Toàn bộ hệ thống đã được test** (xem `SYSTEM_TEST_REPORT.md`)
- ✅ **Firestore Rules** đã được cấu hình và deploy
- ✅ **Production ready** tại https://anhbao-373f3.web.app
- ✅ **Hướng dẫn sử dụng** chi tiết đã được tạo

### 📚 Tài liệu hỗ trợ:
- **Hướng dẫn sử dụng**: `PRODUCTION_GUIDE.md`
- **Báo cáo test**: `SYSTEM_TEST_REPORT.md`
- **Checklist test**: `TEST_CHECKLIST.md`

---

**Chúc anh Nghĩa sử dụng hệ thống hiệu quả và thành công trong công việc quản lý hồ sơ khách hàng! 🎉**

---

## 🚫 Lưu ý Quan trọng

**🚫 Tuyệt đối không tích hợp chatbot AI trả lời tự động các quy trình xử lý hồ sơ – chỉ phản hồi theo status do nhân viên cập nhật.**
