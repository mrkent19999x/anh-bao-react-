'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Share,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// Mock data
const reports = [
  {
    id: 1,
    title: 'Báo cáo doanh số tháng 1/2024',
    type: 'sales',
    period: '2024-01',
    status: 'completed',
    createdBy: 'Nguyễn Văn An',
    createdAt: '2024-01-31',
    totalRevenue: 1500000000,
    growth: 12.5,
    customers: 45,
    orders: 120
  },
  {
    id: 2,
    title: 'Báo cáo khách hàng mới',
    type: 'customers',
    period: '2024-01',
    status: 'pending',
    createdBy: 'Trần Thị Bình',
    createdAt: '2024-01-30',
    totalRevenue: 0,
    growth: 8.2,
    customers: 23,
    orders: 0
  },
  {
    id: 3,
    title: 'Báo cáo hiệu suất nhân viên',
    type: 'performance',
    period: '2024-01',
    status: 'completed',
    createdBy: 'Lê Văn Cường',
    createdAt: '2024-01-29',
    totalRevenue: 0,
    growth: -2.1,
    customers: 0,
    orders: 0
  }
]

const stats = {
  totalReports: 15,
  completed: 12,
  pending: 3,
  totalRevenue: 2500000000,
  growth: 15.2,
  activeCustomers: 156,
  newCustomers: 23
}

const chartData = {
  revenue: [
    { month: 'T1', value: 1200000000 },
    { month: 'T2', value: 1500000000 },
    { month: 'T3', value: 1800000000 },
    { month: 'T4', value: 2200000000 }
  ],
  customers: [
    { month: 'T1', value: 120 },
    { month: 'T2', value: 145 },
    { month: 'T3', value: 167 },
    { month: 'T4', value: 189 }
  ]
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01')
  const [selectedType, setSelectedType] = useState('all')

  const filteredReports = reports.filter(report => {
    const matchesPeriod = report.period === selectedPeriod
    const matchesType = selectedType === 'all' || report.type === selectedType
    return matchesPeriod && matchesType
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Báo cáo & Thống kê</h1>
            <p className="text-gray-300">Theo dõi hiệu suất và phân tích dữ liệu</p>
          </div>
          <div className="flex gap-3">
            <Button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
            <Button className="btn-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              Tạo báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.totalRevenue / 1000000000).toFixed(1)}B VNĐ
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">+{stats.growth}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Khách hàng hoạt động</p>
                  <p className="text-2xl font-bold text-white">{stats.activeCustomers}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400">+{stats.newCustomers} mới</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Báo cáo hoàn thành</p>
                  <p className="text-2xl font-bold text-white">{stats.completed}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">80%</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">20%</span>
                  </div>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period and Type Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === '2024-01' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('2024-01')}
              className="btn-secondary"
            >
              Tháng 1/2024
            </Button>
            <Button
              variant={selectedPeriod === '2024-02' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('2024-02')}
              className="btn-secondary"
            >
              Tháng 2/2024
            </Button>
            <Button
              variant={selectedPeriod === '2024-03' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('2024-03')}
              className="btn-secondary"
            >
              Tháng 3/2024
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              className="btn-secondary"
            >
              Tất cả
            </Button>
            <Button
              variant={selectedType === 'sales' ? 'default' : 'outline'}
              onClick={() => setSelectedType('sales')}
              className="btn-secondary"
            >
              Doanh số
            </Button>
            <Button
              variant={selectedType === 'customers' ? 'default' : 'outline'}
              onClick={() => setSelectedType('customers')}
              className="btn-secondary"
            >
              Khách hàng
            </Button>
            <Button
              variant={selectedType === 'performance' ? 'default' : 'outline'}
              onClick={() => setSelectedType('performance')}
              className="btn-secondary"
            >
              Hiệu suất
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Revenue Chart */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-400" />
              Doanh thu theo tháng
            </CardTitle>
            <CardDescription>
              Biểu đồ doanh thu 6 tháng gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {chartData.revenue.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-300 hover:from-green-400 hover:to-green-300"
                    style={{ height: `${(item.value / 2500000000) * 200}px` }}
                  />
                  <span className="text-xs text-gray-400">{item.month}</span>
                  <span className="text-xs text-white font-medium">
                    {(item.value / 1000000000).toFixed(1)}B
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customers Chart */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              Khách hàng theo tháng
            </CardTitle>
            <CardDescription>
              Số lượng khách hàng mới và hoạt động
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {chartData.customers.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-400 hover:to-blue-300"
                    style={{ height: `${(item.value / 200) * 200}px` }}
                  />
                  <span className="text-xs text-gray-400">{item.month}</span>
                  <span className="text-xs text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Báo cáo gần đây</h2>
          <Button className="btn-secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>

        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="glass card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      report.type === 'sales' ? 'bg-green-500/20' :
                      report.type === 'customers' ? 'bg-blue-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      {report.type === 'sales' ? <DollarSign className="w-6 h-6 text-green-400" /> :
                       report.type === 'customers' ? <Users className="w-6 h-6 text-blue-400" /> :
                       <Activity className="w-6 h-6 text-purple-400" />}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                      <p className="text-sm text-gray-400">
                        Tạo bởi {report.createdBy} • {report.createdAt}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-400">Kỳ: {report.period}</span>
                        {report.totalRevenue > 0 && (
                          <span className="text-sm text-green-400">
                            Doanh thu: {(report.totalRevenue / 1000000000).toFixed(1)}B VNĐ
                          </span>
                        )}
                        <span className="text-sm text-blue-400">
                          Tăng trưởng: {report.growth > 0 ? '+' : ''}{report.growth}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge className={`${
                      report.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    } border`}>
                      {report.status === 'completed' ? 'Hoàn thành' :
                       report.status === 'pending' ? 'Chờ xử lý' : 'Lỗi'}
                    </Badge>

                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="hover:bg-white/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="hover:bg-white/10">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="hover:bg-white/10">
                        <Share className="w-4 h-4" />
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
      {filteredReports.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Không có báo cáo</h3>
          <p className="text-gray-400 mb-6">Thử thay đổi bộ lọc hoặc tạo báo cáo mới</p>
          <Button className="btn-primary">
            <BarChart3 className="w-4 h-4 mr-2" />
            Tạo báo cáo mới
          </Button>
        </motion.div>
      )}
    </div>
  )
}
