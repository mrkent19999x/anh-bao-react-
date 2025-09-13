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
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const where: any = {
      userId: user.id
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      where.status = status
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: customers })
  } catch (error) {
    console.error('Get customers error:', error)
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

    const { name, email, phone, company, address, status, priority, totalValue, notes } = await request.json()

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Tên, email và số điện thoại là bắt buộc' },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        address,
        status: status || 'active',
        priority: priority || 'medium',
        totalValue: totalValue || 0,
        notes,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
