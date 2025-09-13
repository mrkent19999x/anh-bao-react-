# XMLGuard PWA — Realtime Monitoring (Server + PWA)

## Mục tiêu
- Realtime giám sát máy/agent, logs, XML templates (WebSocket/Socket.io)
- PWA installable, offline cơ bản, giao diện Material-like hiện đại
- Windows-first: script `.bat` idempotent, có log và healthcheck

## Cấu trúc
- `xmlguard-pwa/`
  - `server/app.js`: Express + Socket.io + SQLite (DB cục bộ) 0 dependency ngoài Node/SQLite
  - `public/`: PWA (HTML/CSS/JS), Service Worker `sw.js`, `manifest.json`
  - `data/`: CSDL SQLite (tự tạo khi chạy lần đầu)
  - `logs/`: Log server và script
- `deploy/` (Windows-first):
  - `setup-vps.bat`: Cài & khởi chạy như service (nếu có NSSM), mở firewall, log setup
  - `setup-client.bat`: Thiết lập `XMLGUARD_SERVER_URL` + kiểm tra kết nối
  - `one-click-setup.bat`: Cài deps và chạy server nền (console)

## Chạy nhanh (Local dev)
```
cd xmlguard-pwa
# Cài deps (Node 18+)
npm install
# Chạy
npm start
# Mặc định: http://localhost:3000
```

## Verify nhanh
- Mở `http://localhost:3000` → thấy Dashboard, số liệu 0/0/0
- Upload 1 template (XML/txt) → xuất hiện trong danh sách, tăng số `Templates`
- Mở DevTools → Application → Service Workers: `sw.js` active, offline test: tắt mạng vẫn xem trang
- API health: `curl http://localhost:3000/api/health`

## Tích hợp Agent (giữ nguyên Python)
- Agent chỉ cần WebSocket/Socket.io tới server:
  - `agent:register` → `{ machineId, name, ip, tags }`
  - `agent:heartbeat` → `{ machineId, status }` (online/degraded/offline)
  - `agent:log` → `{ machineId, level, message }`
- Server broadcast:
  - `machines:update` (toàn bộ danh sách)
  - `logs:new` (tail theo máy)
  - `templates:update` (reload templates)

## Bảo mật (định hướng tích hợp CRM)
- Dùng Firebase Auth (ID Token) chung với CRM:
  - Frontend lấy `idToken` sau đăng nhập Firebase
  - WebSocket: `io({ auth: { idToken } })`
  - Server Node: verify bằng Firebase Admin SDK rồi ủy quyền theo role
- Đóng CORS theo domain sản xuất (`ALLOW_ORIGIN`)
- Không lưu secrets trong repo. Dùng ENV/secret manager

## Biến môi trường (tuỳ chọn)
- `PORT` (mặc định `3000`)
- `HOST` (mặc định `0.0.0.0`)
- `ALLOW_ORIGIN` (mặc định `*` cho dev)
- `DATA_DIR`, `DB_FILE`, `LOG_DIR`

## Triển khai Windows (VPS)
1) Cài Node 18+ và (khuyến nghị) NSSM
2) Chạy `deploy/setup-vps.bat` (Run as Administrator)
3) Kiểm tra:
   - `sc query XMLGuardPWA` (nếu dùng NSSM)
   - `curl http://localhost:3000/api/health`
   - Log: `xmlguard-pwa/logs/service.out.log`

## Triển khai Linux (tham khảo)
```bash
cd xmlguard-pwa
npm ci
PORT=3000 HOST=0.0.0.0 NODE_ENV=production node server/app.js &
# Hoặc tạo systemd service (khuyến nghị)
```

## Lộ trình tích hợp với CRM (Anh Bảo)
- SSO: Firebase Auth dùng chung. CRM phát `idToken`, XMLGuard verify
- UI: Link/iframe `https://crm-domain/xmlguard` hoặc reverse-proxy `/xmlguard` → server Node
- Documents: CRM upload/duyệt file thuế → agent/Node validate XML (XSD/Checksum/Watermark) → lưu audit
- Event bus: Logs từ agent bắn về Node → CRM subscribe qua Socket.io hoặc REST

## Lưu ý
- Đây là khung nền (scaffold) sẵn chạy. Phần xác thực, XSD validation, watermark PDF/XML sẽ bổ sung theo đặc tả
- Không commit thông tin nhạy cảm. Set ENV khi deploy

```
Mã thoát chuẩn: 0 OK, khác 0 là lỗi cụ thể trong .bat (10 admin, 11 node, 12 npm)
```

