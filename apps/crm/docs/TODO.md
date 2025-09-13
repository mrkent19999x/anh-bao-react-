# TODO - Danh sách việc cần làm

## 📋 Tổng quan
Đây là danh sách các việc cần làm cho dự án **eTAX Mobile Admin System**

## 🚀 Việc cần làm gần đây nhất

### 1. Hoàn thiện hệ thống tài liệu
- [x] Tạo file `.cursorrules` với hướng dẫn AI Cipher
- [ ] Tạo thư mục `docs/` với cấu trúc chuẩn
- [ ] Tạo file `AICONFIG.md` (kim chỉ nam)
- [ ] Tạo file `CHANGELOG.md` (lịch sử thay đổi)
- [ ] Tạo file `TECH-DOC.md` (mô tả kỹ thuật)
- [ ] Tạo file `documentation-log.md` (log cập nhật)
- [ ] Tạo thư mục `FEATURES/` và file `mobile-pwa.md`

### 2. Kiểm tra và sửa lỗi hệ thống
- [ ] Kiểm tra file `lỗi.txt` (104KB) - có vẻ có nhiều lỗi cần xử lý
- [x] Xóa thư mục `lỗi2/` chứa file video và hình ảnh lỗi
- [x] Xóa file `test-tasks.html` và `test.html` - đã dọn dẹp
- [x] Sửa lỗi đăng nhập - tạo trang reset-admin.html và simple-admin.html
- [x] Cập nhật Firestore rules để cho phép tạo user
- [x] Sửa logic xử lý lỗi auth/invalid-login-credentials
- [x] Sửa navigation sidebar - thêm href cho menu Nhân viên và Báo cáo
- [x] Sửa modal functions trong customers.js - loại bỏ trùng lặp
- [x] Sửa CSS modal - thêm !important và show state
- [x] Sửa logic JavaScript - loại bỏ console.log conflict

### 3. Tối ưu hóa PWA
- [ ] Kiểm tra file `PWA_GUIDE.md` để xem hướng dẫn PWA
- [x] Sửa lỗi giao diện mobile - khoảng trắng trên iPhone
- [ ] Tối ưu hóa giao diện mobile theo file `mobile-pwa.md` (sẽ tạo)

### 4. Kiểm tra production
- [ ] Xem xét file `PRODUCTION_GUIDE.md` để đảm bảo hệ thống sẵn sàng production
- [ ] Kiểm tra `SYSTEM_TEST_REPORT.md` để xem báo cáo test

## 📁 Cấu trúc tài liệu cần tạo

```
docs/
├── AICONFIG.md              # Kim chỉ nam – bắt buộc AI đọc đầu tiên
├── README.md                # Mô tả tổng thể hệ thống (đã có)
├── CHANGELOG.md             # Lịch sử thay đổi
├── TODO.md                  # Danh sách việc cần làm (này)
├── TECH-DOC.md              # Mô tả kỹ thuật chi tiết
├── documentation-log.md     # AI tự ghi log mỗi lần update
└── FEATURES/
    ├── mobile-pwa.md        # Tối ưu hoá giao diện cho điện thoại & PWA
```

## 🔍 Ưu tiên cao
1. **Test đăng nhập** - Thử đăng nhập với tài khoản admin mới
2. **Tạo cấu trúc tài liệu chuẩn** - Để AI có thể làm việc hiệu quả
3. **Kiểm tra và sửa lỗi** - Từ file `lỗi.txt` (đã xóa thư mục lỗi2/ và file test)

## 📝 Ghi chú
- File `lỗi.txt` khá lớn (104KB) - cần phân tích kỹ
- Có nhiều file Excel trong thư mục `src/` - cần kiểm tra
- Hệ thống có vẻ đã có PWA nhưng cần tối ưu thêm

---
*Cập nhật lần cuối: [Ngày hiện tại]* 