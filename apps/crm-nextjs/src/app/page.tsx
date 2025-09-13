'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Briefcase,
  MessageCircle,
  FileText,
  BarChart3,
  Settings,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    title: 'Quản lý Khách hàng',
    description: 'Theo dõi thông tin khách hàng, lịch sử giao dịch và trạng thái hồ sơ',
    icon: Users,
    href: '/customers',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Quản lý Công việc',
    description: 'Phân công và theo dõi tiến độ công việc, deadline và độ ưu tiên',
    icon: Briefcase,
    href: '/tasks',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Chat & Tương tác',
    description: 'Hệ thống chat nội bộ, chatbot tự động và tương tác với khách hàng',
    icon: MessageCircle,
    href: '/chat',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Quản lý Tài liệu',
    description: 'Upload, phân loại và chia sẻ tài liệu quan trọng',
    icon: FileText,
    href: '/documents',
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Báo cáo & Thống kê',
    description: 'Dashboard tổng quan, biểu đồ và báo cáo chi tiết',
    icon: BarChart3,
    href: '/reports',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Cài đặt Hệ thống',
    description: 'Cấu hình hệ thống, quản lý người dùng và phân quyền',
    icon: Settings,
    href: '/settings',
    color: 'from-gray-500 to-slate-500'
  }
]

const stats = [
  { label: 'Khách hàng', value: '1,234', change: '+12%' },
  { label: 'Công việc', value: '89', change: '+5%' },
  { label: 'Tài liệu', value: '456', change: '+23%' },
  { label: 'Tin nhắn', value: '2,345', change: '+8%' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <Badge variant="secondary" className="text-sm font-medium">
                PWA Ready
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="gradient-text">Anh Bảo Bank</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Hệ thống quản lý khách hàng và công việc nội bộ hiện đại
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Bắt đầu sử dụng
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
                Tìm hiểu thêm
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Stats */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Card className="glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      {stat.label}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Tính năng nổi bật</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Khám phá các tính năng mạnh mẽ giúp quản lý công việc hiệu quả hơn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              >
                <Link href={feature.href}>
                  <Card className="card-hover glass h-full group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full group-hover:bg-white/10">
                        Khám phá
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="container mx-auto px-4">
          <Card className="glass text-center max-w-4xl mx-auto">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Sẵn sàng bắt đầu?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Trải nghiệm hệ thống quản lý hiện đại với giao diện đẹp mắt và tính năng mạnh mẽ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-primary text-lg px-8 py-4">
                  Đăng nhập ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
                  Xem demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  )
}
