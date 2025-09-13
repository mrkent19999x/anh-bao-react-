# 🎯 XMLGuard PWA - Hướng Dẫn Sử Dụng Mới

## 📋 **TỔNG QUAN**

**XMLGuard PWA** - Hệ thống bảo vệ file XML đơn giản, không cần MeshCentral!

### **Kiến trúc mới:**
- **Server:** XMLGuard PWA (Express + SQLite + Socket.io)
- **Client:** XMLGuard Agent (Python)
- **Web Interface:** http://localhost:3000
- **Quản lý:** Qua webapp đơn giản

## 🚀 **CÀI ĐẶT NHANH**

### **Bước 1: Cài đặt Server (VPS/Máy chủ)**
```bash
# Chạy script setup (Command Prompt as Administrator)
cd deploy
setup-xmlguard-pwa.bat
```

**Hoặc khởi động nhanh:**
```bash
cd deploy
start-xmlguard.bat
```

### **Bước 2: Cài đặt Client (Máy con)**
```bash
# Copy XMLGuard.exe vào thư mục deploy/client/
# Chạy script cài đặt (Command Prompt as Administrator)
cd deploy/client
install_client.bat
```

## 🎮 **SỬ DỤNG**

### **1. Quản lý qua Web Interface**
- **URL:** http://localhost:3000
- **Tính năng:**
  - Xem danh sách máy client
  - Upload/Quản lý templates XML
  - Xem logs real-time
  - Thống kê hệ thống

### **2. Upload Templates**
1. Vào web interface
2. Click "Upload Template"
3. Chọn file XML
4. Template tự động sync xuống máy client

### **3. Xem Logs**
1. Vào web interface
2. Xem "Logs realtime"
3. Lọc theo level: info, warn, error
4. Real-time updates

### **4. Quản lý Máy Client**
1. Vào web interface
2. Xem "Danh sách máy"
3. Tìm kiếm máy theo tên
4. Xem trạng thái online/offline

## 🔧 **CẤU HÌNH**

### **Server Config (apps/xmlguard-pwa/server/app.js)**
- **Port:** 3000 (thay vì 4433/4434)
- **Database:** SQLite (thay vì MeshCentral)
- **Templates:** Upload qua web interface

### **Client Config (C:\ProgramData\SystemTaxData\config.json)**
```json
{
  "server": {
    "log_endpoint": "http://localhost:3000/api/log",
    "templates_url": "http://localhost:3000/api/templates/download"
  }
}
```

## 📊 **SO SÁNH VỚI MESHCENTRAL**

| Tính năng | MeshCentral (Cũ) | XMLGuard PWA (Mới) |
|-----------|------------------|-------------------|
| **Giao diện** | Phức tạp, nhiều tính năng | Đơn giản, tập trung |
| **Cài đặt** | Lằng nhằng, nhiều bước | Chỉ cần 2 script |
| **Port** | 4433, 4434 | 3000 |
| **Database** | MeshCentral DB | SQLite |
| **Templates** | Upload qua file manager | Upload trực tiếp |
| **Logs** | Phải vào từng máy | Tất cả ở 1 chỗ |
| **Quản lý** | Qua web interface phức tạp | Webapp đơn giản |

## 🎯 **LỢI ÍCH**

✅ **Đơn giản hơn:** Không cần MeshCentral  
✅ **Dễ cài đặt:** Chỉ 2 script  
✅ **Quản lý tập trung:** Tất cả ở webapp  
✅ **Real-time:** Cập nhật ngay lập tức  
✅ **Nhẹ hơn:** Ít tài nguyên hơn  
✅ **Dễ debug:** Logs rõ ràng  

## 🚨 **TROUBLESHOOTING**

### **Server không chạy:**
```bash
cd apps/xmlguard-pwa
npm install
npm start
```

### **Client không kết nối:**
- Kiểm tra server đang chạy
- Kiểm tra firewall port 3000
- Kiểm tra config.json

### **Templates không sync:**
- Kiểm tra templates_url trong config
- Kiểm tra server có templates không
- Restart client

## 📞 **HỖ TRỢ**

- **Web Interface:** http://localhost:3000
- **Logs:** Xem trong web interface
- **Config:** C:\ProgramData\SystemTaxData\config.json

---

**🎉 Chúc mừng! Anh đã có hệ thống XMLGuard đơn giản, không còn lằng nhằng MeshCentral nữa!**