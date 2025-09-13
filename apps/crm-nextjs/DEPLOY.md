# 🚀 HƯỚNG DẪN DEPLOY CRM SYSTEM

## 📋 TỔNG QUAN
Dự án CRM NextJS đã được hoàn thiện với:
- ✅ **Frontend**: NextJS 14 với TypeScript
- ✅ **Backend**: API Routes với Prisma ORM
- ✅ **Database**: PostgreSQL với dữ liệu thật
- ✅ **Authentication**: JWT-based auth
- ✅ **UI/UX**: Responsive, PWA-ready

## 🛠️ CÀI ĐẶT LOCAL

### 1. Cài đặt Dependencies
```bash
cd /home/mrkent19999x/bao-cmr/apps/crm-nextjs
npm install
```

### 2. Thiết lập Database
```bash
# Cài đặt PostgreSQL (nếu chưa có)
sudo apt install postgresql postgresql-contrib

# Tạo database
sudo -u postgres createdb bao_crm
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"

# Cấu hình Prisma
npx prisma generate
npx prisma db push

# Seed dữ liệu mẫu
npx tsx prisma/seed.ts
```

### 3. Cấu hình Environment
```bash
# Copy file env
cp env.example .env.local

# Chỉnh sửa .env.local nếu cần
# DATABASE_URL="postgresql://postgres:password@localhost:5432/bao_crm?schema=public"
```

### 4. Chạy Development
```bash
npm run dev
# Hoặc
npx next dev
```

## 🌐 DEPLOY PRODUCTION

### 1. Vercel (Khuyến nghị)
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel

# Cấu hình Environment Variables trong Vercel Dashboard:
# - DATABASE_URL
# - JWT_SECRET
# - NEXTAUTH_SECRET
```

### 2. Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. VPS/Server
```bash
# Cài đặt Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2
npm install -g pm2

# Build và start
npm run build
pm2 start npm --name "crm-app" -- start
pm2 save
pm2 startup
```

## 🗄️ DATABASE PRODUCTION

### 1. PostgreSQL trên VPS
```bash
# Cài đặt PostgreSQL
sudo apt install postgresql postgresql-contrib

# Tạo database production
sudo -u postgres createdb bao_crm_prod
sudo -u postgres psql -c "CREATE USER crm_user WITH PASSWORD 'strong_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bao_crm_prod TO crm_user;"
```

### 2. Cloud Database (Khuyến nghị)
- **Supabase**: PostgreSQL managed
- **PlanetScale**: MySQL managed
- **Railway**: PostgreSQL managed
- **Neon**: PostgreSQL serverless

## 🔐 BẢO MẬT

### 1. Environment Variables
```bash
# Production .env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-super-secret-jwt-key-256-bits"
NEXTAUTH_SECRET="your-nextauth-secret"
NODE_ENV="production"
```

### 2. Database Security
- Sử dụng connection pooling
- Enable SSL cho database
- Tạo user riêng cho app (không dùng postgres user)
- Backup định kỳ

### 3. Application Security
- Rate limiting
- CORS configuration
- Input validation
- SQL injection protection (Prisma đã handle)

## 📊 MONITORING

### 1. Logs
```bash
# PM2 logs
pm2 logs crm-app

# Nginx logs (nếu dùng)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Performance
- Sử dụng Next.js Analytics
- Database query monitoring
- Memory usage tracking

## 🔄 BACKUP & RECOVERY

### 1. Database Backup
```bash
# Backup
pg_dump bao_crm_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql bao_crm_prod < backup_file.sql
```

### 2. Application Backup
```bash
# Backup code
tar -czf crm-backup-$(date +%Y%m%d).tar.gz /path/to/app

# Backup uploads/files
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /path/to/uploads
```

## 🚀 QUICK DEPLOY

### 1. One-click Deploy với Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/bao-crm)

### 2. Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/bao_crm
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=bao_crm
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📱 PWA DEPLOYMENT

### 1. Service Worker
- Đã được cấu hình sẵn
- Cache strategies cho static assets
- Offline support

### 2. Manifest
- App name: "Anh Bảo Bank CRM"
- Theme color: "#1e293b"
- Icons: 192x192, 512x512

## ✅ CHECKLIST DEPLOY

- [ ] Database đã được tạo và migrate
- [ ] Environment variables đã được cấu hình
- [ ] SSL certificate (HTTPS)
- [ ] Domain name đã được setup
- [ ] Backup strategy đã được thiết lập
- [ ] Monitoring đã được cấu hình
- [ ] Security headers đã được setup
- [ ] Performance optimization đã được áp dụng

## 🆘 TROUBLESHOOTING

### 1. Database Connection Error
```bash
# Kiểm tra PostgreSQL status
sudo systemctl status postgresql

# Kiểm tra connection
psql -h localhost -U postgres -d bao_crm
```

### 2. Build Error
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### 3. Permission Error
```bash
# Fix file permissions
sudo chown -R $USER:$USER /path/to/app
chmod -R 755 /path/to/app
```

---

**🎉 Chúc mừng! CRM System đã sẵn sàng để deploy!**
