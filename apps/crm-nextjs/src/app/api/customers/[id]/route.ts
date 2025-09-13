import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Không tìm thấy khách hàng' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const customer = await prisma.customer.updateMany({
      where: {
        id: params.id,
        userId: user.id
      },
      data: {
        name,
        email,
        phone,
        company,
        address,
        status,
        priority,
        totalValue,
        notes
      }
    })

    if (customer.count === 0) {
      return NextResponse.json({ error: 'Không tìm thấy khách hàng' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Cập nhật khách hàng thành công' })
  } catch (error) {
    console.error('Update customer error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    const customer = await prisma.customer.deleteMany({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (customer.count === 0) {
      return NextResponse.json({ error: 'Không tìm thấy khách hàng' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Xóa khách hàng thành công' })
  } catch (error) {
    console.error('Delete customer error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
