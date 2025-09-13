'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  CreditCard,
  FileText,
  Send,
  Check,
  AlertCircle,
  Upload,
  Camera,
  Plus,
  Trash2,
  Edit,
  Save,
  Eye,
  Download
} from 'lucide-react'

export default function FormPage() {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      idNumber: ''
    },
    businessInfo: {
      companyName: '',
      position: '',
      businessType: '',
      taxCode: '',
      address: '',
      website: ''
    },
    loanInfo: {
      loanAmount: '',
      loanPurpose: '',
      loanTerm: '',
      monthlyIncome: '',
      collateral: '',
      notes: ''
    }
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const steps = [
    { id: 1, title: 'Thông tin cá nhân', description: 'Thông tin cơ bản' },
    { id: 2, title: 'Thông tin doanh nghiệp', description: 'Thông tin công ty' },
    { id: 3, title: 'Thông tin vay vốn', description: 'Chi tiết khoản vay' }
  ]

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="glass max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Gửi form thành công!</h2>
              <p className="text-gray-400 mb-6">
                Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ tới.
              </p>
              <div className="space-y-3">
                <Button className="w-full btn-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Tải PDF xác nhận
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full btn-secondary"
                  onClick={() => {
                    setIsSubmitted(false)
                    setCurrentStep(1)
                    setFormData({
                      personalInfo: { fullName: '', email: '', phone: '', address: '', dateOfBirth: '', gender: '', idNumber: '' },
                      businessInfo: { companyName: '', position: '', businessType: '', taxCode: '', address: '', website: '' },
                      loanInfo: { loanAmount: '', loanPurpose: '', loanTerm: '', monthlyIncome: '', collateral: '', notes: '' }
                    })
                  }}
                >
                  Gửi form mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Đăng ký vay vốn</h1>
          <p className="text-gray-300">Điền thông tin để đăng ký khoản vay</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <div className="ml-3 text-left">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Thông tin cá nhân
                  </CardTitle>
                  <CardDescription>
                    Vui lòng điền đầy đủ thông tin cá nhân của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={formData.personalInfo.fullName}
                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Giới tính *</Label>
                      <select
                        id="gender"
                        value={formData.personalInfo.gender}
                        onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                        className="w-full p-2 bg-white/5 border border-white/20 text-white rounded-md"
                        required
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="idNumber">CMND/CCCD *</Label>
                      <Input
                        id="idNumber"
                        value={formData.personalInfo.idNumber}
                        onChange={(e) => handleInputChange('personalInfo', 'idNumber', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      value={formData.personalInfo.address}
                      onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Business Info */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-green-400" />
                    Thông tin doanh nghiệp
                  </CardTitle>
                  <CardDescription>
                    Thông tin về công ty và vị trí công việc
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Tên công ty *</Label>
                      <Input
                        id="companyName"
                        value={formData.businessInfo.companyName}
                        onChange={(e) => handleInputChange('businessInfo', 'companyName', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Chức vụ *</Label>
                      <Input
                        id="position"
                        value={formData.businessInfo.position}
                        onChange={(e) => handleInputChange('businessInfo', 'position', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Loại hình kinh doanh *</Label>
                      <select
                        id="businessType"
                        value={formData.businessInfo.businessType}
                        onChange={(e) => handleInputChange('businessInfo', 'businessType', e.target.value)}
                        className="w-full p-2 bg-white/5 border border-white/20 text-white rounded-md"
                        required
                      >
                        <option value="">Chọn loại hình</option>
                        <option value="retail">Bán lẻ</option>
                        <option value="wholesale">Bán sỉ</option>
                        <option value="manufacturing">Sản xuất</option>
                        <option value="service">Dịch vụ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="taxCode">Mã số thuế *</Label>
                      <Input
                        id="taxCode"
                        value={formData.businessInfo.taxCode}
                        onChange={(e) => handleInputChange('businessInfo', 'taxCode', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.businessInfo.website}
                        onChange={(e) => handleInputChange('businessInfo', 'website', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="businessAddress">Địa chỉ công ty *</Label>
                    <Input
                      id="businessAddress"
                      value={formData.businessInfo.address}
                      onChange={(e) => handleInputChange('businessInfo', 'address', e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Loan Info */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    Thông tin vay vốn
                  </CardTitle>
                  <CardDescription>
                    Chi tiết về khoản vay bạn muốn đăng ký
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="loanAmount">Số tiền vay (VNĐ) *</Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        value={formData.loanInfo.loanAmount}
                        onChange={(e) => handleInputChange('loanInfo', 'loanAmount', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="100000000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="loanTerm">Thời hạn vay (tháng) *</Label>
                      <select
                        id="loanTerm"
                        value={formData.loanInfo.loanTerm}
                        onChange={(e) => handleInputChange('loanInfo', 'loanTerm', e.target.value)}
                        className="w-full p-2 bg-white/5 border border-white/20 text-white rounded-md"
                        required
                      >
                        <option value="">Chọn thời hạn</option>
                        <option value="6">6 tháng</option>
                        <option value="12">12 tháng</option>
                        <option value="24">24 tháng</option>
                        <option value="36">36 tháng</option>
                        <option value="60">60 tháng</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="monthlyIncome">Thu nhập hàng tháng (VNĐ) *</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        value={formData.loanInfo.monthlyIncome}
                        onChange={(e) => handleInputChange('loanInfo', 'monthlyIncome', e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="10000000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="loanPurpose">Mục đích vay *</Label>
                      <select
                        id="loanPurpose"
                        value={formData.loanInfo.loanPurpose}
                        onChange={(e) => handleInputChange('loanInfo', 'loanPurpose', e.target.value)}
                        className="w-full p-2 bg-white/5 border border-white/20 text-white rounded-md"
                        required
                      >
                        <option value="">Chọn mục đích</option>
                        <option value="business">Kinh doanh</option>
                        <option value="personal">Cá nhân</option>
                        <option value="investment">Đầu tư</option>
                        <option value="education">Giáo dục</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="collateral">Tài sản thế chấp</Label>
                    <Input
                      id="collateral"
                      value={formData.loanInfo.collateral}
                      onChange={(e) => handleInputChange('loanInfo', 'collateral', e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="Mô tả tài sản thế chấp (nếu có)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Ghi chú thêm</Label>
                    <textarea
                      id="notes"
                      value={formData.loanInfo.notes}
                      onChange={(e) => handleInputChange('loanInfo', 'notes', e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/20 text-white rounded-md h-24 resize-none"
                      placeholder="Thông tin bổ sung..."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-between mt-8"
          >
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary"
            >
              Quay lại
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Tiếp theo
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Gửi đơn đăng ký
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  )
}
