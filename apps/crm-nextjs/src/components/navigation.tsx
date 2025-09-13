'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Users,
  Briefcase,
  MessageCircle,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react'

const navigation = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Khách hàng', href: '/customers', icon: Users },
  { name: 'Công việc', href: '/tasks', icon: Briefcase },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Tài liệu', href: '/documents', icon: FileText },
  { name: 'Báo cáo', href: '/reports', icon: BarChart3 },
  { name: 'Nhân viên', href: '/employees', icon: Users },
  { name: 'Cài đặt', href: '/settings', icon: Settings }
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 glass"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/20 backdrop-blur-md border-r border-white/10 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-bold gradient-text">Anh Bảo Bank</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                  {item.name === 'Chat' && (
                    <Badge className="bg-red-500 text-white text-xs ml-auto">3</Badge>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User Menu */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="relative">
            <Button
              variant="ghost"
              className="w-full justify-start glass"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="User"
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">Nguyễn Văn An</p>
                <p className="text-xs text-gray-400">Quản lý</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-0 right-0 mb-2 glass rounded-lg p-2 space-y-1"
              >
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <User className="w-4 h-4 mr-2" />
                  Hồ sơ
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </Button>
                <hr className="border-white/10" />
                <Button variant="ghost" className="w-full justify-start text-sm text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Top Bar */}
      <div className="md:ml-64 p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {navigation.find(item => item.href === pathname)?.name || 'Trang chủ'}
            </h1>
            <p className="text-gray-400">
              {pathname === '/' && 'Chào mừng đến với hệ thống quản lý'}
              {pathname === '/customers' && 'Quản lý thông tin khách hàng'}
              {pathname === '/tasks' && 'Theo dõi tiến độ công việc'}
              {pathname === '/chat' && 'Giao tiếp nội bộ và với khách hàng'}
              {pathname === '/documents' && 'Lưu trữ và quản lý tài liệu'}
              {pathname === '/reports' && 'Báo cáo và phân tích dữ liệu'}
              {pathname === '/employees' && 'Quản lý thông tin nhân viên'}
              {pathname === '/settings' && 'Cài đặt tài khoản và hệ thống'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hover:bg-white/10">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="hover:bg-white/10 relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                3
              </Badge>
            </Button>
            <Button variant="ghost" className="hover:bg-white/10">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
