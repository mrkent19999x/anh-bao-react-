'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Save,
  RefreshCw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  Building,
  CreditCard,
  Download,
  Upload
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  })

  const tabs = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
    { id: 'system', label: 'Hệ thống', icon: Settings }
  ]

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <Button className="btn-secondary">Thay đổi ảnh</Button>
              <p className="text-sm text-gray-400 mt-1">JPG, PNG tối đa 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Họ và tên</Label>
              <Input
                id="firstName"
                defaultValue="Nguyễn Văn An"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="an.nguyen@anhbaobank.com"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                defaultValue="0901234567"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="position">Chức vụ</Label>
              <Input
                id="position"
                defaultValue="Quản lý khách hàng"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="department">Phòng ban</Label>
              <Input
                id="department"
                defaultValue="Kinh doanh"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="joinDate">Ngày vào làm</Label>
              <Input
                id="joinDate"
                defaultValue="2023-01-15"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Thông tin công ty</CardTitle>
          <CardDescription>Cập nhật thông tin công ty</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Tên công ty</Label>
              <Input
                id="company"
                defaultValue="Anh Bảo Bank"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                defaultValue="123 Nguyễn Huệ, Q1, TP.HCM"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                defaultValue="https://anhbaobank.com"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="taxCode">Mã số thuế</Label>
              <Input
                id="taxCode"
                defaultValue="0123456789"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Thay đổi mật khẩu</CardTitle>
          <CardDescription>Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                className="pr-10 bg-white/5 border-white/20 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <Button className="btn-primary">
            <Key className="w-4 h-4 mr-2" />
            Cập nhật mật khẩu
          </Button>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Xác thực hai yếu tố</CardTitle>
          <CardDescription>Thêm lớp bảo mật cho tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">SMS</h4>
              <p className="text-sm text-gray-400">Nhận mã xác thực qua tin nhắn</p>
            </div>
            <Button className="btn-secondary">Bật</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Phiên đăng nhập</CardTitle>
          <CardDescription>Quản lý các phiên đăng nhập của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <h4 className="font-semibold text-white">Chrome - Windows</h4>
                <p className="text-sm text-gray-400">192.168.1.100 • Hôm nay 10:30</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Hiện tại</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <h4 className="font-semibold text-white">Safari - iPhone</h4>
                <p className="text-sm text-gray-400">192.168.1.101 • Hôm qua 15:20</p>
              </div>
              <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                Đăng xuất
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Cài đặt thông báo</CardTitle>
          <CardDescription>Chọn cách bạn muốn nhận thông báo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email', label: 'Email', description: 'Nhận thông báo qua email' },
            { key: 'push', label: 'Push', description: 'Thông báo trên trình duyệt' },
            { key: 'sms', label: 'SMS', description: 'Tin nhắn văn bản' },
            { key: 'marketing', label: 'Marketing', description: 'Thông báo quảng cáo và khuyến mãi' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">{item.label}</h4>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <Button
                variant={notifications[item.key as keyof typeof notifications] ? 'default' : 'outline'}
                onClick={() => setNotifications(prev => ({
                  ...prev,
                  [item.key]: !prev[item.key as keyof typeof notifications]
                }))}
                className="btn-secondary"
              >
                {notifications[item.key as keyof typeof notifications] ? 'Bật' : 'Tắt'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Chủ đề</CardTitle>
          <CardDescription>Chọn giao diện phù hợp với bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-white/20 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Sun className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white">Sáng</span>
              </div>
              <p className="text-sm text-gray-400">Giao diện sáng, dễ nhìn</p>
            </div>
            <div className="p-4 border border-blue-500/50 rounded-lg cursor-pointer bg-blue-500/10">
              <div className="flex items-center gap-3 mb-2">
                <Moon className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Tối</span>
                <Badge className="bg-blue-500/20 text-blue-400">Hiện tại</Badge>
              </div>
              <p className="text-sm text-gray-400">Giao diện tối, tiết kiệm pin</p>
            </div>
            <div className="p-4 border border-white/20 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="w-5 h-5 text-gray-400" />
                <span className="font-semibold text-white">Tự động</span>
              </div>
              <p className="text-sm text-gray-400">Theo hệ thống</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Ngôn ngữ</CardTitle>
          <CardDescription>Chọn ngôn ngữ hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
              { code: 'en', name: 'English', flag: '🇺🇸' }
            ].map((lang) => (
              <div key={lang.code} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-semibold text-white">{lang.name}</span>
                </div>
                {lang.code === 'vi' && <Badge className="bg-blue-500/20 text-blue-400">Hiện tại</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSystemTab = () => (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Thông tin hệ thống</CardTitle>
          <CardDescription>Thông tin về phiên bản và cấu hình</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Phiên bản ứng dụng</Label>
              <Input value="1.0.0" disabled className="bg-white/5 border-white/20 text-white" />
            </div>
            <div>
              <Label>Phiên bản PWA</Label>
              <Input value="1.0.0" disabled className="bg-white/5 border-white/20 text-white" />
            </div>
            <div>
              <Label>Trình duyệt</Label>
              <Input value="Chrome 120.0" disabled className="bg-white/5 border-white/20 text-white" />
            </div>
            <div>
              <Label>Hệ điều hành</Label>
              <Input value="Windows 11" disabled className="bg-white/5 border-white/20 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Dữ liệu</CardTitle>
          <CardDescription>Quản lý dữ liệu và bộ nhớ cache</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Bộ nhớ cache</h4>
              <p className="text-sm text-gray-400">2.4 MB</p>
            </div>
            <Button className="btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Xóa cache
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Dữ liệu offline</h4>
              <p className="text-sm text-gray-400">15.2 MB</p>
            </div>
            <Button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Xuất dữ liệu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab()
      case 'security': return renderSecurityTab()
      case 'notifications': return renderNotificationsTab()
      case 'appearance': return renderAppearanceTab()
      case 'system': return renderSystemTab()
      default: return renderProfileTab()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Cài đặt</h1>
            <p className="text-gray-300">Quản lý cài đặt tài khoản và hệ thống</p>
          </div>
          <Button className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-64"
        >
          <Card className="glass">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}
