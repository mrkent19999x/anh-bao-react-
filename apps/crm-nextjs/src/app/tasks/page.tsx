'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  User,
  Flag,
  CheckCircle,
  Circle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  TrendingUp,
  CheckSquare,
  Square
} from 'lucide-react'

// Mock data
const tasks = [
  {
    id: 1,
    title: 'Gọi điện cho khách hàng ABC',
    description: 'Liên hệ để xác nhận thông tin hồ sơ vay vốn',
    assignee: 'Nguyễn Văn An',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-01-20',
    createdAt: '2024-01-15',
    customer: 'Công ty ABC',
    estimatedTime: '2 giờ',
    progress: 60
  },
  {
    id: 2,
    title: 'Xử lý hồ sơ khách hàng XYZ',
    description: 'Kiểm tra và duyệt hồ sơ vay vốn',
    assignee: 'Trần Thị Bình',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-01-25',
    createdAt: '2024-01-18',
    customer: 'Công ty XYZ',
    estimatedTime: '4 giờ',
    progress: 0
  },
  {
    id: 3,
    title: 'Báo cáo tháng 1/2024',
    description: 'Tổng hợp báo cáo doanh số tháng 1',
    assignee: 'Lê Văn Cường',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-30',
    createdAt: '2024-01-10',
    customer: 'Nội bộ',
    estimatedTime: '6 giờ',
    progress: 100
  }
]

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
}

const priorityColors = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-blue-500/20 text-blue-400'
}

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <Clock className="w-4 h-4" />
      case 'pending':
        return <Circle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Công việc</h1>
            <p className="text-gray-300">Theo dõi và quản lý tiến độ công việc</p>
          </div>
          <div className="flex gap-3">
            <Button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Tạo công việc
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tổng công việc</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Circle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Đang thực hiện</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Quá hạn</p>
                  <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm công việc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className="btn-secondary"
            >
              Tất cả
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              className="btn-secondary"
            >
              Chờ xử lý
            </Button>
            <Button
              variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('in-progress')}
              className="btn-secondary"
            >
              Đang thực hiện
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('completed')}
              className="btn-secondary"
            >
              Hoàn thành
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="glass card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                        <Badge className={`${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                          {task.priority === 'high' ? 'Cao' :
                           task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </Badge>
                        <Badge className={`${statusColors[task.status as keyof typeof statusColors]} border`}>
                          {task.status === 'pending' ? 'Chờ xử lý' :
                           task.status === 'in-progress' ? 'Đang thực hiện' :
                           task.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        </Badge>
                      </div>

                      <p className="text-gray-300 mb-3">{task.description}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {task.assignee}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {task.dueDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Flag className="w-4 h-4" />
                          {task.customer}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {task.status === 'in-progress' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Tiến độ</span>
                            <span className="text-white">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="hover:bg-white/10">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="hover:bg-white/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="hover:bg-red-500/20">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy công việc</h3>
          <p className="text-gray-400 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Tạo công việc mới
          </Button>
        </motion.div>
      )}
    </div>
  )
}
