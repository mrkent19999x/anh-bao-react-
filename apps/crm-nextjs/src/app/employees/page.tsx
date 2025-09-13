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
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  TrendingUp,
  Users,
  Building,
  Clock,
  Award,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// Mock data
const employees = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@anhbaobank.com',
    phone: '0901234567',
    position: 'Quản lý khách hàng',
    department: 'Kinh doanh',
    status: 'active',
    joinDate: '2023-01-15',
    salary: 15000000,
    performance: 95,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    skills: ['Quản lý', 'Bán hàng', 'CRM'],
    lastActive: '2 giờ trước'
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'binh.tran@anhbaobank.com',
    phone: '0907654321',
    position: 'Nhân viên tư vấn',
    department: 'Kinh doanh',
    status: 'active',
    joinDate: '2023-03-20',
    salary: 12000000,
    performance: 88,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    skills: ['Tư vấn', 'Giao tiếp', 'Excel'],
    lastActive: '1 giờ trước'
  },
  {
    id: 3,
    name: 'Lê Văn Cường',
    email: 'cuong.le@anhbaobank.com',
    phone: '0909876543',
    position: 'Kế toán trưởng',
    department: 'Kế toán',
    status: 'inactive',
    joinDate: '2022-08-10',
    salary: 20000000,
    performance: 92,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    skills: ['Kế toán', 'Tài chính', 'Báo cáo'],
    lastActive: '1 ngày trước'
  }
]

const departments = [
  { name: 'Tất cả', count: 15 },
  { name: 'Kinh doanh', count: 8 },
  { name: 'Kế toán', count: 3 },
  { name: 'Nhân sự', count: 2 },
  { name: 'IT', count: 2 }
]

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
}

const performanceColors = {
  excellent: 'bg-green-500/20 text-green-400',
  good: 'bg-blue-500/20 text-blue-400',
  average: 'bg-yellow-500/20 text-yellow-400',
  poor: 'bg-red-500/20 text-red-400'
}

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('Tất cả')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'Tất cả' || employee.department === selectedDepartment
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    averageSalary: employees.reduce((sum, e) => sum + e.salary, 0) / employees.length,
    averagePerformance: employees.reduce((sum, e) => sum + e.performance, 0) / employees.length
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'excellent', label: 'Xuất sắc' }
    if (score >= 80) return { level: 'good', label: 'Tốt' }
    if (score >= 70) return { level: 'average', label: 'Trung bình' }
    return { level: 'poor', label: 'Cần cải thiện' }
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Nhân viên</h1>
            <p className="text-gray-300">Theo dõi và quản lý thông tin nhân viên</p>
          </div>
          <div className="flex gap-3">
            <Button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
            <Button className="btn-primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm nhân viên
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tổng nhân viên</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Lương trung bình</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {(stats.averageSalary / 1000000).toFixed(1)}M
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Hiệu suất TB</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.averagePerformance.toFixed(0)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
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
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('active')}
              className="btn-secondary"
            >
              Hoạt động
            </Button>
            <Button
              variant={filterStatus === 'inactive' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('inactive')}
              className="btn-secondary"
            >
              Không hoạt động
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar - Departments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-64 space-y-4"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Phòng ban</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {departments.map((dept) => (
                <button
                  key={dept.name}
                  onClick={() => setSelectedDepartment(dept.name)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    selectedDepartment === dept.name
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span>{dept.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {dept.count}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Employees List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1 space-y-4"
        >
          {filteredEmployees.map((employee, index) => {
            const performance = getPerformanceLevel(employee.performance)
            return (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="glass card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${
                            employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-white">{employee.name}</h3>
                          <p className="text-gray-400">{employee.position}</p>
                          <p className="text-sm text-gray-500">{employee.department}</p>

                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Mail className="w-3 h-3" />
                              {employee.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Phone className="w-3 h-3" />
                              {employee.phone}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {employee.joinDate}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            {employee.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">
                            {employee.salary.toLocaleString('vi-VN')} VNĐ
                          </p>
                          <p className="text-sm text-gray-400">
                            Hiệu suất: {employee.performance}%
                          </p>
                          <p className="text-xs text-gray-500">
                            Hoạt động: {employee.lastActive}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Badge className={`${statusColors[employee.status as keyof typeof statusColors]} border`}>
                            {employee.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </Badge>
                          <Badge className={`${performanceColors[performance.level as keyof typeof performanceColors]}`}>
                            {performance.label}
                          </Badge>
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy nhân viên</h3>
          <p className="text-gray-400 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          <Button className="btn-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm nhân viên mới
          </Button>
        </motion.div>
      )}
    </div>
  )
}
