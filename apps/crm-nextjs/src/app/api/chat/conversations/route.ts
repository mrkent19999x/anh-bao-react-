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

    const conversations = await prisma.conversation.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: conversations })
  } catch (error) {
    console.error('Get conversations error:', error)
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

    const { name, type } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Tên cuộc trò chuyện là bắt buộc' },
        { status: 400 }
      )
    }

    const conversation = await prisma.conversation.create({
      data: {
        name,
        type: type || 'private'
      }
    })

    return NextResponse.json({ success: true, data: conversation })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
