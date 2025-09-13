# 🚀 Production Guide - Anh Bảo Bank System

## 📋 **Thông tin Hệ thống**

- **URL**: https://anhbao-373f3.web.app
- **Admin Account**: `admin@anhbao.com` / `password123`
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth

---

## 👥 **Quy trình Sử dụng**

### 1️⃣ **Đăng nhập & Quản lý User**

#### **Admin Setup**
1. Truy cập: https://anhbao-373f3.web.app
2. Đăng nhập với: `admin@anhbao.com` / `password123`
3. Vào trang "Nhân viên" để tạo tài khoản cho nhân viên

#### **Tạo Nhân viên mới**
1. Click "Thêm nhân viên"
2. Điền thông tin: Tên, Email, SĐT, Role (employee)
3. Nhân viên sẽ nhận email để set password

### 2️⃣ **Quản lý Khách hàng**

#### **Thêm Khách hàng thủ công**
1. Vào trang "Khách hàng"
2. Click "Thêm khách hàng"
3. Điền thông tin đầy đủ
4. Chọn trạng thái: "Đã tiếp nhận"

#### **Tạo Link Form cho Khách hàng**
1. Trong danh sách khách hàng, click nút "🔗" (Tạo link form)
2. Copy link và gửi cho khách hàng
3. Khách hàng điền form → tự động tạo hồ sơ

#### **Cập nhật Trạng thái**
- **Đã tiếp nhận**: Hồ sơ mới được tạo
- **Đang xử lý**: Đang xử lý hồ sơ
- **Đợi bổ sung giấy tờ**: Cần thêm tài liệu
- **Đã hoàn thành**: Hoàn thành hồ sơ

### 3️⃣ **Quản lý Công việc**

#### **Tạo Task mới**
1. Vào trang "Công việc"
2. Click "Thêm công việc"
3. Điền: Tiêu đề, Mô tả, Deadline, Priority
4. Assign cho nhân viên cụ thể

#### **Cập nhật Task**
- **Pending**: Chờ xử lý
- **Processing**: Đang xử lý
- **Completed**: Hoàn thành

### 4️⃣ **Chat & Chatbot**

#### **Tạo Conversation**
1. Vào trang "Chat"
2. Click "Cuộc trò chuyện mới"
3. Chọn loại: Customer hoặc Internal
4. Thêm participants

#### **Chatbot Responses**
Chatbot tự động trả lời dựa trên trạng thái khách hàng:
- **"Hồ sơ đến đâu rồi?"** → Trả lời theo status
- **"Xin chào"** → Chào hỏi
- **"Cảm ơn"** → Phản hồi lịch sự

#### **Cập nhật Status từ Chat**
1. Trong conversation, click dropdown "Trạng thái"
2. Chọn status mới
3. Bot tự động gửi thông báo

### 5️⃣ **Quản lý Tài liệu**

#### **Upload File**
1. Vào trang "Kho tài liệu"
2. Click "Tải lên tài liệu"
3. Chọn file (PDF, DOC, JPG, PNG)
4. Chọn loại: Hồ sơ thuế, Giấy tờ cá nhân, Tài liệu doanh nghiệp
5. Assign cho khách hàng cụ thể

#### **Quản lý File**
- **Preview**: Click để xem trước
- **Download**: Tải về máy
- **Delete**: Xóa (chỉ owner hoặc admin)

### 6️⃣ **Dashboard & Báo cáo**

#### **Thống kê Tổng quan**
- **Tổng khách hàng**: Số lượng khách hàng
- **Công việc đang xử lý**: Tasks pending + processing
- **Nhân viên**: Số lượng nhân viên
- **Doanh thu tháng**: Tính theo completed tasks

#### **Biểu đồ Phân tích**
- **Trạng thái Khách hàng**: Doughnut chart
- **Tiến độ Công việc**: Bar chart
- **Hoạt động 6 tháng**: Line chart

---

## 🔗 **Form System Workflow**

### **Luồng Tạo Form**
1. **Nhân viên tạo link**: Click "🔗" trong customer list
2. **Gửi link**: Copy và gửi cho khách hàng
3. **Khách điền form**: Truy cập link và điền thông tin
4. **Hệ thống xử lý**: Tự động tạo:
   - Customer record
   - Task assignment
   - Conversation
   - Bot message
5. **Nhân viên xử lý**: Cập nhật status và tương tác

### **Form URL Format**
```
https://anhbao-373f3.web.app/form/abc123
```
- `abc123`: Unique form ID (8 ký tự)
- Form có hiệu lực 30 ngày
- Mỗi form chỉ sử dụng được 1 lần

---

## 🔒 **Bảo mật & Quyền truy cập**

### **Role-based Access**
- **Admin**: Xem tất cả data, quản lý users
- **Employee**: Chỉ xem data được assign

### **Data Isolation**
- Nhân viên chỉ thấy khách hàng được giao
- Nhân viên chỉ thấy công việc được assign
- Nhân viên chỉ thấy tài liệu được giao
- Chat chỉ visible cho participants

### **Public Access**
- Form links: Public read để khách hàng điền
- Chatbot responses: Public read

---

## 📱 **Mobile & Responsive**

### **Mobile Optimization**
- Responsive design cho điện thoại
- Touch-friendly interface
- Optimized loading speed
- PWA ready (có thể install như app)

### **Cross-browser Support**
- Chrome, Firefox, Safari, Edge
- Mobile browsers
- Tablet browsers

---

## 🚨 **Troubleshooting**

### **Lỗi thường gặp**

#### **Không đăng nhập được**
- Kiểm tra email/password
- Clear browser cache
- Thử browser khác

#### **Form không load**
- Kiểm tra URL format
- Form có thể đã hết hạn
- Contact admin để tạo form mới

#### **Chat không real-time**
- Kiểm tra internet connection
- Refresh page
- Clear browser cache

#### **File upload lỗi**
- Kiểm tra file size (< 10MB)
- Kiểm tra file type (PDF, DOC, JPG, PNG)
- Thử file khác

### **Performance Issues**
- **Slow loading**: Clear cache, restart browser
- **Charts not loading**: Check internet, refresh
- **Real-time lag**: Check connection quality

---

## 📞 **Support & Contact**

### **Technical Support**
- **Email**: admin@anhbao.com
- **Phone**: [Số điện thoại support]
- **Hours**: 8:00 AM - 6:00 PM (GMT+7)

### **Emergency Contact**
- **System Admin**: [Admin contact]
- **Database Issues**: Firebase Console
- **Hosting Issues**: Firebase Hosting

---

## 🔄 **Maintenance & Updates**

### **Regular Maintenance**
- **Daily**: Check system status
- **Weekly**: Review user activities
- **Monthly**: Backup data, update security

### **System Updates**
- Automatic Firebase updates
- Manual feature updates
- Security patches

---

## 📊 **Analytics & Reporting**

### **Key Metrics**
- **Customer Acquisition**: Số khách hàng mới/tháng
- **Task Completion Rate**: Tỷ lệ hoàn thành công việc
- **Response Time**: Thời gian phản hồi khách hàng
- **User Activity**: Hoạt động nhân viên

### **Reports Available**
- Customer status report
- Task progress report
- Employee performance report
- Monthly activity report

---

## 🎯 **Best Practices**

### **Customer Management**
- Cập nhật status thường xuyên
- Giao tiếp qua chat
- Upload tài liệu đầy đủ
- Tạo form link cho khách mới

### **Task Management**
- Set deadline realistic
- Update progress regularly
- Assign tasks appropriately
- Use priority levels

### **Communication**
- Use chat for quick updates
- Update status promptly
- Respond to customer inquiries
- Use chatbot for common questions

---

## 🚀 **Getting Started Checklist**

### **Day 1: Setup**
- [ ] Đăng nhập admin account
- [ ] Tạo tài khoản cho nhân viên
- [ ] Test các tính năng cơ bản
- [ ] Upload tài liệu mẫu

### **Day 2: Training**
- [ ] Train nhân viên sử dụng hệ thống
- [ ] Test workflow end-to-end
- [ ] Create sample customers
- [ ] Test form system

### **Day 3: Go Live**
- [ ] Start using for real customers
- [ ] Monitor system performance
- [ ] Collect feedback
- [ ] Optimize workflow

---

**🎉 Chúc mừng! Hệ thống Anh Bảo Bank đã sẵn sàng phục vụ!** 