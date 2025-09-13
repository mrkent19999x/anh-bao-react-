'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  Filter,
  Plus,
  User,
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Download,
  Star,
  Flag,
  Archive,
  Trash2,
  Edit,
  Reply,
  Forward,
  Copy,
  Mic,
  MicOff,
  Camera,
  Headphones,
  Settings,
  Bell,
  BellOff,
  Volume2,
  VolumeX
} from 'lucide-react'

// Mock data
const customers = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    company: 'Công ty ABC',
    status: 'online',
    lastMessage: 'Cảm ơn anh đã hỗ trợ',
    time: '10:30',
    unread: 2,
    priority: 'high',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    tags: ['VIP', 'Quan trọng']
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    company: 'Công ty XYZ',
    status: 'away',
    lastMessage: 'Tôi cần hỗ trợ về khoản vay',
    time: '09:45',
    unread: 0,
    priority: 'medium',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    tags: ['Mới']
  },
  {
    id: 3,
    name: 'Lê Văn Cường',
    company: 'Công ty DEF',
    status: 'offline',
    lastMessage: 'Hẹn gặp lại tuần sau',
    time: 'Hôm qua',
    unread: 1,
    priority: 'low',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    tags: ['Cũ']
  }
]

const messages = [
  {
    id: 1,
    sender: 'Nguyễn Văn An',
    content: 'Xin chào, tôi muốn tìm hiểu về dịch vụ vay vốn',
    time: '10:25',
    type: 'customer',
    status: 'read',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    sender: 'Nhân viên hỗ trợ',
    content: 'Xin chào anh An! Tôi rất vui được hỗ trợ anh. Anh có thể cho tôi biết thêm về nhu cầu vay vốn của anh không?',
    time: '10:26',
    type: 'agent',
    status: 'read',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    sender: 'Nguyễn Văn An',
    content: 'Tôi muốn vay 500 triệu để mở rộng kinh doanh',
    time: '10:28',
    type: 'customer',
    status: 'read',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 4,
    sender: 'Nhân viên hỗ trợ',
    content: 'Tuyệt vời! Với số tiền 500 triệu, chúng tôi có gói vay kinh doanh phù hợp. Anh có thể cho tôi biết thêm về tình hình tài chính hiện tại không?',
    time: '10:30',
    type: 'agent',
    status: 'read',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
]

export default function CustomerChatPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(1)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Handle send message
      setMessage('')
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const currentCustomer = customers.find(c => c.id === selectedCustomer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-80 bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold gradient-text">Chat khách hàng</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="hover:bg-white/10">
                <Search className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="hover:bg-white/10">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="p-4 border-b border-white/10">
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className="btn-secondary text-xs"
            >
              Tất cả
            </Button>
            <Button
              variant={filterStatus === 'online' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('online')}
              className="btn-secondary text-xs"
            >
              Online
            </Button>
            <Button
              variant={filterStatus === 'away' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('away')}
              className="btn-secondary text-xs"
            >
              Away
            </Button>
          </div>
        </div>

        {/* Customers List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <motion.div
              key={customer.id}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              className={`p-4 border-b border-white/5 cursor-pointer ${
                selectedCustomer === customer.id ? 'bg-white/10' : ''
              }`}
              onClick={() => setSelectedCustomer(customer.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    customer.status === 'online' ? 'bg-green-500' :
                    customer.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {customer.name}
                    </h3>
                    <span className="text-xs text-gray-400">{customer.time}</span>
                  </div>

                  <p className="text-xs text-gray-400 truncate mb-1">
                    {customer.company}
                  </p>

                  <p className="text-xs text-gray-300 truncate">
                    {customer.lastMessage}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {customer.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {customer.unread > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        {customer.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-white/10">
          <Button className="w-full btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Cuộc trò chuyện mới
          </Button>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex flex-col"
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={currentCustomer?.avatar}
                alt="Customer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {currentCustomer?.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {currentCustomer?.company} • {currentCustomer?.status}
                </p>
              </div>
              <div className="flex gap-1">
                {currentCustomer?.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="hover:bg-white/10">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="hover:bg-white/10">
                <Video className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="hover:bg-white/10">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${msg.type === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-xs lg:max-w-md ${msg.type === 'customer' ? 'flex-row-reverse' : 'flex-row'}`}>
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className={`${msg.type === 'customer' ? 'bg-blue-500/20' : 'bg-white/10'} rounded-lg p-3`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-300">{msg.sender}</span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-white text-sm">{msg.content}</p>
                  {msg.type === 'agent' && (
                    <div className="flex justify-end mt-1">
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3 h-3 text-blue-400" />
                      ) : msg.status === 'sent' ? (
                        <Check className="w-3 h-3 text-gray-400" />
                      ) : (
                        <Clock className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <Button type="button" size="sm" variant="ghost" className="hover:bg-white/10">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" className="hover:bg-white/10">
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" className="hover:bg-white/10">
              <FileText className="w-4 h-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" className="hover:bg-white/10">
              <Camera className="w-4 h-4" />
            </Button>

            <div className="flex-1 relative">
              <Input
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button type="button" size="sm" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white/10">
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            <Button type="button" size="sm" variant="ghost" className="hover:bg-white/10">
              <Mic className="w-4 h-4" />
            </Button>

            <Button type="submit" className="btn-primary">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
