'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Upload,
  Filter,
  Grid,
  List,
  Download,
  Eye,
  Edit,
  Trash2,
  Share,
  FileText,
  Image,
  File,
  Video,
  Music,
  Archive,
  Folder,
  Calendar,
  User,
  MoreVertical,
  Plus,
  FolderPlus,
  SortAsc,
  SortDesc
} from 'lucide-react'

// Mock data
const documents = [
  {
    id: 1,
    name: 'Báo cáo tài chính Q4 2023.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    uploader: 'Nguyễn Văn An',
    category: 'Báo cáo',
    status: 'approved',
    description: 'Báo cáo tài chính quý 4 năm 2023',
    tags: ['tài chính', 'báo cáo', 'Q4'],
    downloadCount: 15,
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Hợp đồng khách hàng ABC.docx',
    type: 'docx',
    size: '1.8 MB',
    uploadDate: '2024-01-14',
    uploader: 'Trần Thị Bình',
    category: 'Hợp đồng',
    status: 'pending',
    description: 'Hợp đồng vay vốn với khách hàng ABC',
    tags: ['hợp đồng', 'vay vốn', 'ABC'],
    downloadCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Ảnh minh họa sản phẩm.jpg',
    type: 'jpg',
    size: '3.2 MB',
    uploadDate: '2024-01-13',
    uploader: 'Lê Văn Cường',
    category: 'Hình ảnh',
    status: 'approved',
    description: 'Ảnh minh họa sản phẩm mới',
    tags: ['hình ảnh', 'sản phẩm', 'marketing'],
    downloadCount: 23,
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'
  }
]

const categories = [
  { name: 'Tất cả', count: 15 },
  { name: 'Báo cáo', count: 5 },
  { name: 'Hợp đồng', count: 3 },
  { name: 'Hình ảnh', count: 4 },
  { name: 'Tài liệu pháp lý', count: 2 },
  { name: 'Khác', count: 1 }
]

const statusColors = {
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
}

const typeIcons = {
  pdf: FileText,
  docx: FileText,
  jpg: Image,
  png: Image,
  mp4: Video,
  mp3: Music,
  zip: Archive,
  default: File
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'Tất cả' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'date':
        comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        break
      case 'size':
        comparison = parseFloat(a.size) - parseFloat(b.size)
        break
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const stats = {
    total: documents.length,
    totalSize: '7.4 MB',
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length
  }

  const getFileIcon = (type: string) => {
    const IconComponent = typeIcons[type as keyof typeof typeIcons] || typeIcons.default
    return <IconComponent className="w-6 h-6" />
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Tài liệu</h1>
            <p className="text-gray-300">Lưu trữ và quản lý tài liệu công ty</p>
          </div>
          <div className="flex gap-3">
            <Button className="btn-secondary">
              <FolderPlus className="w-4 h-4 mr-2" />
              Tạo thư mục
            </Button>
            <Button className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Tải lên
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tổng tài liệu</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tổng dung lượng</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSize}</p>
                </div>
                <Archive className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Đã duyệt</p>
                  <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                </div>
                <Check className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className="btn-secondary"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="btn-secondary"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar - Categories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-64 space-y-4"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Sort Options */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Sắp xếp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Sắp xếp theo:</p>
                <div className="space-y-1">
                  {[
                    { value: 'name', label: 'Tên' },
                    { value: 'date', label: 'Ngày' },
                    { value: 'size', label: 'Kích thước' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                        sortBy === option.value
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant={sortOrder === 'asc' ? 'default' : 'outline'}
                  onClick={() => setSortOrder('asc')}
                  className="btn-secondary"
                >
                  <SortAsc className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={sortOrder === 'desc' ? 'default' : 'outline'}
                  onClick={() => setSortOrder('desc')}
                  className="btn-secondary"
                >
                  <SortDesc className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1"
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="glass card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(doc.type)}
                          <div>
                            <h3 className="font-semibold text-white text-sm truncate">
                              {doc.name}
                            </h3>
                            <p className="text-xs text-gray-400">{doc.size}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <img
                        src={doc.thumbnail}
                        alt={doc.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />

                      <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                        {doc.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {doc.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{doc.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>{doc.uploadDate}</span>
                        <span>{doc.downloadCount} lượt tải</span>
                      </div>

                      <Badge className={`${statusColors[doc.status as keyof typeof statusColors]} border text-xs`}>
                        {doc.status === 'approved' ? 'Đã duyệt' :
                         doc.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                      </Badge>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="ghost" className="hover:bg-white/10 flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Xem
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10 flex-1">
                          <Download className="w-3 h-3 mr-1" />
                          Tải
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10">
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="glass card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getFileIcon(doc.type)}
                          <div>
                            <h3 className="font-semibold text-white">{doc.name}</h3>
                            <p className="text-sm text-gray-400">{doc.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-white">{doc.size}</p>
                            <p className="text-xs text-gray-400">{doc.uploadDate}</p>
                          </div>

                          <Badge className={`${statusColors[doc.status as keyof typeof statusColors]} border`}>
                            {doc.status === 'approved' ? 'Đã duyệt' :
                             doc.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                          </Badge>

                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="hover:bg-white/10">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-white/10">
                              <Download className="w-4 h-4" />
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
            </div>
          )}
        </motion.div>
      </div>

      {/* Empty State */}
      {sortedDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy tài liệu</h3>
          <p className="text-gray-400 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          <Button className="btn-primary">
            <Upload className="w-4 h-4 mr-2" />
            Tải lên tài liệu
          </Button>
        </motion.div>
      )}
    </div>
  )
}
