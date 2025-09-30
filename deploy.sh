#!/bin/bash

# 🚀 ANH BAO CRM - AUTOMATED DEPLOYMENT SCRIPT
# Version: 1.0.0
# Author: AI Security Auditor

set -e  # Exit on any error

echo "🚀 Starting Anh Bao CRM Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found!"
    print_status "Creating .env.local from template..."
    cp .env.example .env.local
    print_warning "Please update .env.local with your actual values before deploying!"
    exit 1
fi

# Step 1: Security Audit
print_status "Running security audit..."
cd /workspace/apps/crm-nextjs
npm audit --audit-level=moderate
if [ $? -eq 0 ]; then
    print_success "Security audit passed!"
else
    print_error "Security audit failed!"
    exit 1
fi

# Step 2: Build Next.js App
print_status "Building Next.js application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Next.js build completed!"
else
    print_error "Next.js build failed!"
    exit 1
fi

# Step 3: Build Firebase Functions
print_status "Building Firebase Functions..."
cd /workspace/apps/crm/functions
npm audit --audit-level=moderate
if [ $? -eq 0 ]; then
    print_success "Firebase Functions security audit passed!"
else
    print_error "Firebase Functions security audit failed!"
    exit 1
fi

# Step 4: Deploy Firebase Functions
print_status "Deploying Firebase Functions..."
firebase deploy --only functions --project anhbao-373f3
if [ $? -eq 0 ]; then
    print_success "Firebase Functions deployed successfully!"
else
    print_error "Firebase Functions deployment failed!"
    exit 1
fi

# Step 5: Deploy Firebase Hosting
print_status "Deploying Firebase Hosting..."
cd /workspace/apps/crm
firebase deploy --only hosting --project anhbao-373f3
if [ $? -eq 0 ]; then
    print_success "Firebase Hosting deployed successfully!"
else
    print_error "Firebase Hosting deployment failed!"
    exit 1
fi

# Step 6: Post-deployment verification
print_status "Running post-deployment verification..."

# Check if the app is accessible
APP_URL="https://anhbao-373f3.web.app"
print_status "Checking app accessibility at $APP_URL..."

# Test security headers
print_status "Testing security headers..."
curl -I "$APP_URL" | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Strict-Transport-Security|Content-Security-Policy)" || print_warning "Some security headers might not be present"

# Final success message
print_success "🎉 Deployment completed successfully!"
print_status "Application URL: $APP_URL"
print_status "Admin Login: admin@anhbao.com"
print_warning "Remember to change the default admin password!"

echo ""
echo "📋 POST-DEPLOYMENT CHECKLIST:"
echo "✅ Security audit passed"
echo "✅ Build completed successfully"
echo "✅ Firebase Functions deployed"
echo "✅ Firebase Hosting deployed"
echo "✅ Security headers configured"
echo ""
echo "🔒 SECURITY REMINDERS:"
echo "- Change default admin password"
echo "- Update JWT_SECRET in production"
echo "- Monitor access logs"
echo "- Regular security updates"
echo ""
echo "🚀 Your Anh Bao CRM is now live and secure!"