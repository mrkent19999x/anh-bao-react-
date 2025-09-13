'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Briefcase,
  MessageCircle,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Target,
  Activity,
  Zap,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react'

// Mock data
const announcements = [
  {
    id: 1,
    title: 'Họp phòng ban tuần này',
    content: 'Cuộc họp phòng kinh doanh sẽ diễn ra vào thứ 6 tuần này lúc 14:00',
    type: 'meeting',
    priority: 'high',
    author: 'Nguyễn Văn An',
    createdAt: '2024-01-15',
    isRead: false
  },
  {
    id: 2,
    title: 'Cập nhật chính sách vay vốn',
    content: 'Chính sách vay vốn mới sẽ có hiệu lực từ ngày 1/2/2024',
    type: 'policy',
    priority: 'medium',
    author: 'Trần Thị Bình',
    createdAt: '2024-01-14',
    isRead: true
  },
  {
    id: 3,
    title: 'Thông báo nghỉ lễ Tết',
    content: 'Công ty sẽ nghỉ lễ Tết từ 29/1 đến 5/2/2024',
    type: 'holiday',
    priority: 'high',
    author: 'Lê Văn Cường',
    createdAt: '2024-01-13',
    isRead: false
  }
]

const quickActions = [
  { name: 'Tạo cuộc họp', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
  { name: 'Gửi thông báo', icon: Bell, color: 'from-purple-500 to-pink-500' },
  { name: 'Tạo báo cáo', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
  { name: 'Quản lý nhân viên', icon: Users, color: 'from-orange-500 to-red-500' }
]

const recentActivities = [
  {
    id: 1,
    user: 'Nguyễn Văn An',
    action: 'đã tạo khách hàng mới',
    target: 'Công ty ABC',
    time: '2 giờ trước',
    type: 'customer'
  },
  {
    id: 2,
    user: 'Trần Thị Bình',
    action: 'đã hoàn thành công việc',
    target: 'Báo cáo tháng 1',
    time: '4 giờ trước',
    type: 'task'
  },
  {
    id: 3,
    user: 'Lê Văn Cường',
    action: 'đã upload tài liệu',
    target: 'Hợp đồng XYZ.pdf',
    time: '6 giờ trước',
    type: 'document'
  }
]

const stats = {
  totalEmployees: 15,
  activeTasks: 23,
  completedTasks: 45,
  pendingApprovals: 8,
  newCustomers: 12,
  totalRevenue: 2500000000
}

export default function InternalPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || announcement.type === filterType
    return matchesSearch && matchesType
  })

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
            <h1 className="text-3xl font-bold gradient-text mb-2">Trang nội bộ</h1>
            <p className="text-gray-300">Quản lý và theo dõi hoạt động nội bộ</p>
          </div>
          <div className="flex gap-3">
            <Button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Tạo mới
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Nhân viên</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Công việc</p>
                  <p className="text-2xl font-bold text-white">{stats.activeTasks}</p>
                </div>
                <Briefcase className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Hoàn thành</p>
                  <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">KH mới</p>
                  <p className="text-2xl font-bold text-white">{stats.newCustomers}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Doanh thu</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.totalRevenue / 1000000000).toFixed(1)}B
                  </p>
                </div>
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Thao tác nhanh
              </CardTitle>
              <CardDescription>
                Các chức năng thường dùng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-4 hover:bg-white/5"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mr-3`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white">{action.name}</span>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Hoạt động gần đây
              </CardTitle>
              <CardDescription>
                Các hoạt động mới nhất trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'customer' ? 'bg-blue-500/20' :
                    activity.type === 'task' ? 'bg-green-500/20' :
                    'bg-purple-500/20'
                  }`}>
                    {activity.type === 'customer' ? <Users className="w-4 h-4 text-blue-400" /> :
                     activity.type === 'task' ? <Briefcase className="w-4 h-4 text-green-400" /> :
                     <FileText className="w-4 h-4 text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-400">{activity.target}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-400" />
                Thông báo
              </CardTitle>
              <CardDescription>
                Các thông báo quan trọng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    announcement.isRead ? 'bg-white/5 border-white/10' : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white">
                      {announcement.title}
                    </h4>
                    {!announcement.isRead && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${
                      announcement.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {announcement.priority === 'high' ? 'Cao' :
                       announcement.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {announcement.createdAt}
                    </span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6"
      >
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  className="btn-secondary"
                >
                  Tất cả
                </Button>
                <Button
                  variant={filterType === 'meeting' ? 'default' : 'outline'}
                  onClick={() => setFilterType('meeting')}
                  className="btn-secondary"
                >
                  Cuộc họp
                </Button>
                <Button
                  variant={filterType === 'policy' ? 'default' : 'outline'}
                  onClick={() => setFilterType('policy')}
                  className="btn-secondary"
                >
                  Chính sách
                </Button>
                <Button
                  variant={filterType === 'holiday' ? 'default' : 'outline'}
                  onClick={() => setFilterType('holiday')}
                  className="btn-secondary"
                >
                  Nghỉ lễ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
