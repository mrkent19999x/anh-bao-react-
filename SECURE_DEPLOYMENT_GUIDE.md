# 🚀 HƯỚNG DẪN DEPLOYMENT AN TOÀN

## 📋 TRƯỚC KHI DEPLOY

### 1. **Kiểm tra Security**
```bash
# Kiểm tra vulnerabilities
cd /workspace/apps/crm-nextjs
npm audit --audit-level=moderate

cd /workspace/apps/crm/functions
npm audit --audit-level=moderate
```

### 2. **Cấu hình Environment Variables**
```bash
# Copy file environment
cp .env.example .env.local

# Cập nhật các giá trị thực tế:
# - FIREBASE_API_KEY
# - JWT_SECRET (256-bit strong secret)
# - ADMIN_PASSWORD (strong password)
# - DATABASE_URL
```

### 3. **Build và Test**
```bash
# Build Next.js app
cd /workspace/apps/crm-nextjs
npm run build

# Test Firebase Functions
cd /workspace/apps/crm/functions
npm run serve
```

## 🔒 SECURITY CHECKLIST

### ✅ **Đã Fix**
- [x] Next.js vulnerabilities (Updated to 14.2.33)
- [x] Firebase Admin vulnerabilities (Updated to 13.5.0)
- [x] Hardcoded credentials removed
- [x] API keys moved to environment variables
- [x] Security headers added
- [x] XSS protection utilities created
- [x] Input validation utilities created
- [x] Performance optimization utilities created

### ⚠️ **Cần Kiểm tra Thêm**
- [ ] Firestore security rules
- [ ] Firebase Storage rules
- [ ] Rate limiting implementation
- [ ] HTTPS enforcement
- [ ] CORS configuration

## 🚀 DEPLOYMENT STEPS

### 1. **Deploy Firebase Functions**
```bash
cd /workspace/apps/crm/functions
firebase deploy --only functions
```

### 2. **Deploy Firebase Hosting**
```bash
cd /workspace/apps/crm
firebase deploy --only hosting
```

### 3. **Deploy Next.js App**
```bash
cd /workspace/apps/crm-nextjs
npm run build
npm run start
```

## 🔧 POST-DEPLOYMENT

### 1. **Kiểm tra Security Headers**
```bash
curl -I https://your-domain.com
# Kiểm tra các headers:
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - X-XSS-Protection: 1; mode=block
# - Strict-Transport-Security
# - Content-Security-Policy
```

### 2. **Test Authentication**
- Test admin login với password mới
- Test user registration
- Test role-based access control

### 3. **Monitor Performance**
- Check console logs (should be minimal in production)
- Monitor database queries
- Check memory usage

## 🚨 EMERGENCY ROLLBACK

### Nếu có vấn đề:
```bash
# Rollback Firebase Functions
firebase deploy --only functions --project your-project-id

# Rollback Hosting
firebase hosting:channel:deploy previous-version
```

## 📊 MONITORING

### 1. **Security Monitoring**
- Monitor failed login attempts
- Check for suspicious API usage
- Monitor database access patterns

### 2. **Performance Monitoring**
- Monitor page load times
- Check database query performance
- Monitor memory usage

### 3. **Error Monitoring**
- Set up error tracking (Sentry, etc.)
- Monitor console errors
- Track user-reported issues

## 🔄 MAINTENANCE

### Weekly:
- Check security advisories
- Review access logs
- Update dependencies

### Monthly:
- Security audit
- Performance review
- Backup verification

### Quarterly:
- Penetration testing
- Code review
- Disaster recovery test

---

**⚠️ QUAN TRỌNG:** Luôn test trên staging environment trước khi deploy lên production!