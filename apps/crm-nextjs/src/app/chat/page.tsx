'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Bot,
  User,
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Download
} from 'lucide-react'

// Mock data
const conversations = [
  {
    id: 1,
    name: 'Nhóm Marketing',
    lastMessage: 'Báo cáo tháng 1 đã hoàn thành',
    time: '10:30',
    unread: 3,
    type: 'group',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face',
    online: true
  },
  {
    id: 2,
    name: 'Nguyễn Văn An',
    lastMessage: 'Cảm ơn anh đã hỗ trợ',
    time: '09:45',
    unread: 0,
    type: 'private',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    online: true
  },
  {
    id: 3,
    name: 'Trần Thị Bình',
    lastMessage: 'Hồ sơ khách hàng XYZ cần xem xét',
    time: '09:20',
    unread: 1,
    type: 'private',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    online: false
  }
]

const messages = [
  {
    id: 1,
    sender: 'Nguyễn Văn An',
    content: 'Chào mọi người, hôm nay có ai rảnh không?',
    time: '10:30',
    type: 'text',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'read'
  },
  {
    id: 2,
    sender: 'Trần Thị Bình',
    content: 'Mình rảnh, có gì cần hỗ trợ không?',
    time: '10:32',
    type: 'text',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'read'
  },
  {
    id: 3,
    sender: 'Bot',
    content: 'Tôi có thể giúp gì cho bạn?',
    time: '10:33',
    type: 'text',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    status: 'read',
    isBot: true
  },
  {
    id: 4,
    sender: 'Nguyễn Văn An',
    content: 'Cảm ơn mọi người đã hỗ trợ!',
    time: '10:35',
    type: 'text',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'sent'
  }
]

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
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

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <h2 className="text-xl font-bold gradient-text">Tin nhắn</h2>
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
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              className={`p-4 border-b border-white/5 cursor-pointer ${
                selectedConversation === conversation.id ? 'bg-white/10' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-400">{conversation.time}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        {conversation.unread}
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
                src={conversations.find(c => c.id === selectedConversation)?.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {conversations.find(c => c.id === selectedConversation)?.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {conversations.find(c => c.id === selectedConversation)?.online ? 'Đang hoạt động' : 'Không hoạt động'}
                </p>
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
              className={`flex ${msg.sender === 'Bot' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex space-x-2 max-w-xs lg:max-w-md ${msg.sender === 'Bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className={`${msg.sender === 'Bot' ? 'bg-white/10' : 'bg-blue-500/20'} rounded-lg p-3`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-300">{msg.sender}</span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-white text-sm">{msg.content}</p>
                  {msg.sender !== 'Bot' && (
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

            <Button type="submit" className="btn-primary">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
