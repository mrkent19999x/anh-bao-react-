'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Bot,
  Send,
  Smile,
  Paperclip,
  Mic,
  MicOff,
  Settings,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  MessageCircle,
  Zap,
  Brain,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Lightbulb,
  HelpCircle
} from 'lucide-react'

// Mock data
const chatHistory = [
  {
    id: 1,
    type: 'user',
    message: 'Xin chào, tôi muốn tìm hiểu về dịch vụ vay vốn',
    timestamp: '10:30',
    isTyping: false
  },
  {
    id: 2,
    type: 'bot',
    message: 'Xin chào! Tôi rất vui được hỗ trợ bạn. Chúng tôi có nhiều gói vay vốn phù hợp với nhu cầu của bạn. Bạn có thể cho tôi biết thêm về mục đích vay vốn không?',
    timestamp: '10:31',
    isTyping: false,
    suggestions: ['Vay kinh doanh', 'Vay cá nhân', 'Vay đầu tư', 'Vay mua nhà']
  },
  {
    id: 3,
    type: 'user',
    message: 'Tôi muốn vay để kinh doanh',
    timestamp: '10:32',
    isTyping: false
  },
  {
    id: 4,
    type: 'bot',
    message: 'Tuyệt vời! Để vay kinh doanh, bạn cần chuẩn bị các giấy tờ sau:\n\n1. CMND/CCCD\n2. Giấy phép kinh doanh\n3. Báo cáo tài chính 6 tháng gần nhất\n4. Kế hoạch kinh doanh\n5. Tài sản thế chấp (nếu có)\n\nBạn có muốn tôi hướng dẫn chi tiết về quy trình vay không?',
    timestamp: '10:33',
    isTyping: false,
    suggestions: ['Quy trình vay', 'Lãi suất', 'Thời hạn vay', 'Điều kiện vay']
  }
]

const quickQuestions = [
  'Lãi suất vay vốn hiện tại là bao nhiêu?',
  'Thời hạn vay tối đa là bao lâu?',
  'Cần những giấy tờ gì để vay?',
  'Có thể vay bao nhiêu tiền?',
  'Quy trình vay như thế nào?'
]

const botPersonality = {
  name: 'Anh Bảo Bot',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  status: 'online',
  description: 'Trợ lý AI chuyên về dịch vụ tài chính'
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState(chatHistory)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isBotTyping, setIsBotTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isTyping: false
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsBotTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: 'Cảm ơn bạn đã hỏi! Tôi đang xử lý câu hỏi của bạn. Đây là một câu trả lời mẫu từ chatbot.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isTyping: false,
        suggestions: ['Thông tin khác', 'Liên hệ nhân viên', 'Đặt lịch hẹn']
      }
      setMessages(prev => [...prev, botResponse])
      setIsBotTyping(false)
    }, 2000)
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        handleSendMessage('Tôi đã ghi âm một tin nhắn')
      }, 3000)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Chatbot AI</h1>
            <p className="text-gray-300">Trợ lý thông minh hỗ trợ khách hàng 24/7</p>
          </div>
          <div className="flex gap-3">
            <Button className="btn-secondary" onClick={clearChat}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
            <Button className="btn-secondary">
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="glass h-[600px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={botPersonality.avatar}
                    alt={botPersonality.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{botPersonality.name}</h3>
                  <p className="text-sm text-gray-400">{botPersonality.description}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 ml-auto">
                  {botPersonality.status}
                </Badge>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {message.type === 'bot' && (
                      <img
                        src={botPersonality.avatar}
                        alt="Bot"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div className={`${message.type === 'user' ? 'bg-blue-500/20' : 'bg-white/10'} rounded-lg p-3`}>
                      <p className="text-white text-sm whitespace-pre-line">{message.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSuggestion(suggestion)}
                              className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 mr-2 mb-1"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      {message.type === 'bot' && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="ghost" className="hover:bg-white/10 p-1">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="hover:bg-white/10 p-1">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="hover:bg-white/10 p-1">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isBotTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex space-x-2">
                    <img
                      src={botPersonality.avatar}
                      alt="Bot"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMessage) }} className="flex items-center space-x-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="hover:bg-white/10"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white/10"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={toggleRecording}
                  className={`hover:bg-white/10 ${isRecording ? 'text-red-400' : 'text-gray-400'}`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <Button type="submit" className="btn-primary">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {/* Quick Questions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Câu hỏi thường gặp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left text-sm p-3 hover:bg-white/5 text-gray-300"
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Bot Stats */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Thống kê Bot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Tin nhắn hôm nay</span>
                <span className="text-sm text-white font-semibold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Tỷ lệ hài lòng</span>
                <span className="text-sm text-green-400 font-semibold">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Thời gian phản hồi</span>
                <span className="text-sm text-blue-400 font-semibold">2.3s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Trạng thái</span>
                <Badge className="bg-green-500/20 text-green-400">Online</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                Tính năng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Trả lời tự động
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Học hỏi từ cuộc trò chuyện
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Hỗ trợ đa ngôn ngữ
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Tích hợp CRM
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
