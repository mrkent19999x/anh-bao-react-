import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const period = searchParams.get('period') || ''

    const where: any = {
      userId: user.id
    }

    if (type !== 'all') {
      where.type = type
    }

    if (period) {
      where.period = period
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: reports })
  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    const {
      title,
      type,
      period,
      status,
      totalRevenue,
      growth,
      customers,
      orders,
      data,
      customerId
    } = await request.json()

    if (!title || !type || !period) {
      return NextResponse.json(
        { error: 'Tiêu đề, loại và kỳ báo cáo là bắt buộc' },
        { status: 400 }
      )
    }

    const report = await prisma.report.create({
      data: {
        title,
        type,
        period,
        status: status || 'pending',
        totalRevenue: totalRevenue || 0,
        growth: growth || 0,
        customers: customers || 0,
        orders: orders || 0,
        data: data || {},
        userId: user.id,
        customerId: customerId || null
      }
    })

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('Create report error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
