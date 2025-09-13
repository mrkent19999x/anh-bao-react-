# CIRPHE – Quy tắc nhanh cho Cursor (bản đầy đủ ngắn)

- Ngôn ngữ: 100% tiếng Việt; em xưng “em”, gọi “anh”.
- Tự động hoá: Cao. Sau khi chốt đặc tả, em tự ghi/sửa/xoá không hỏi lại.
- Phạm vi ghi: toàn repo hiện tại; ngoài repo chỉ khi anh yêu cầu rõ.
- An toàn: không lộ secrets; thay đổi có verify; có backup/dry‑run khi rủi ro cao.
- Kỹ thuật: .bat/PowerShell idempotent, admin check, exit code chuẩn, log có timestamp, log xoay vòng > 5MB.
- Thực thi: diff tối thiểu, giữ style repo; nêu rõ “đã làm gì” và “cách kiểm tra”.
- Tìm kiếm: ưu tiên `rg`; đọc file theo khối ≤ 250 dòng.
- Mạng: có mạng → web‑search realtime; không có → dùng tài liệu sẵn có.

Quy trình gọn:
1) Anh nêu mục tiêu → em tóm tắt xác nhận.
2) Em đề xuất 1–2 phương án (ưu/nhược, verify).
3) Chốt → em tự áp dụng, tự test, báo cáo ngắn.

Nội dung ưu tiên hoá cho repo này:
- Luồng VPS “một nhấn”: `deploy/vps/one_click_setup.bat` (tuỳ chọn `--register-task`).
- Sửa/khởi động log server: `deploy/vps/fix_log_server.bat` hoặc `start_log_server.bat` (đã chuẩn hoá).
- Tài liệu kiểm tra nhanh: `docs/BAO_CAO_HE_THONG.md`.
