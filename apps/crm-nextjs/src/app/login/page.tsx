'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Shield,
  Users,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const success = await login(email, password)

    if (success) {
      router.push('/')
    } else {
      setError('Email hoặc mật khẩu không đúng')
    }

    setIsLoading(false)
  }

  const fillDemoAccount = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@anhbaobank.com')
      setPassword('admin123')
    } else {
      setEmail('user@anhbaobank.com')
      setPassword('user123')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold gradient-text">Anh Bảo Bank</span>
          </motion.div>
          <p className="text-gray-300">Đăng nhập để truy cập hệ thống</p>
        </div>

        {/* Login Form */}
        <Card className="glass">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Chào mừng trở lại</CardTitle>
            <CardDescription>
              Nhập thông tin đăng nhập của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@anhbaobank.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-300">
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full btn-primary text-lg py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-gray-400">Hoặc</span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center">Tài khoản demo:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="btn-secondary text-sm py-2"
                  onClick={() => fillDemoAccount('admin')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="btn-secondary text-sm py-2"
                  onClick={() => fillDemoAccount('user')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>
        </div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-400">Quản lý KH</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-400">Công việc</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-400">Bảo mật</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
