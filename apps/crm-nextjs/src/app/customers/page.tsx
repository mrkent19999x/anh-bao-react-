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
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  TrendingUp,
  Users,
  Building
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const customers = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '0901234567',
    company: 'Công ty ABC',
    status: 'active',
    lastContact: '2024-01-15',
    totalValue: 15000000,
    priority: 'high',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '0907654321',
    company: 'Công ty XYZ',
    status: 'pending',
    lastContact: '2024-01-10',
    totalValue: 8500000,
    priority: 'medium',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Lê Văn Cường',
    email: 'cuong.le@email.com',
    phone: '0909876543',
    company: 'Công ty DEF',
    status: 'inactive',
    lastContact: '2023-12-20',
    totalValue: 25000000,
    priority: 'low',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
]

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  inactive: 'bg-red-500/20 text-red-400 border-red-500/30'
}

const priorityColors = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-blue-500/20 text-blue-400'
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    pending: customers.filter(c => c.status === 'pending').length,
    totalValue: customers.reduce((sum, c) => sum + c.totalValue, 0)
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Khách hàng</h1>
            <p className="text-gray-300">Theo dõi và quản lý thông tin khách hàng</p>
          </div>
          <div className="flex gap-3">
            <Button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Thêm khách hàng
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tổng khách hàng</p>
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
                <TrendingUp className="w-8 h-8 text-green-400" />
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
                <Calendar className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tổng giá trị</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {(stats.totalValue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <Building className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm khách hàng..."
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
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              className="btn-secondary"
            >
              Chờ xử lý
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Customers List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
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
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                        customer.status === 'active' ? 'bg-green-500' :
                        customer.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                      <p className="text-sm text-gray-400">{customer.company}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        {customer.totalValue.toLocaleString('vi-VN')} VNĐ
                      </p>
                      <p className="text-sm text-gray-400">
                        Liên hệ: {customer.lastContact}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Badge className={`${statusColors[customer.status as keyof typeof statusColors]} border`}>
                        {customer.status === 'active' ? 'Hoạt động' :
                         customer.status === 'pending' ? 'Chờ xử lý' : 'Không hoạt động'}
                      </Badge>
                      <Badge className={`${priorityColors[customer.priority as keyof typeof priorityColors]}`}>
                        {customer.priority === 'high' ? 'Cao' :
                         customer.priority === 'medium' ? 'Trung bình' : 'Thấp'}
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
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy khách hàng</h3>
          <p className="text-gray-400 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Thêm khách hàng mới
          </Button>
        </motion.div>
      )}
    </div>
  )
}
