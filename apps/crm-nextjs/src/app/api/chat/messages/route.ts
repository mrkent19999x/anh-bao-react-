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
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'ID cuộc trò chuyện là bắt buộc' },
        { status: 400 }
      )
    }

    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error('Get messages error:', error)
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

    const { content, type, conversationId, isBot } = await request.json()

    if (!content || !conversationId) {
      return NextResponse.json(
        { error: 'Nội dung và ID cuộc trò chuyện là bắt buộc' },
        { status: 400 }
      )
    }

    const message = await prisma.chatMessage.create({
      data: {
        content,
        type: type || 'text',
        isBot: isBot || false,
        conversationId
      }
    })

    // Update conversation last message
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content,
        unread: isBot ? { increment: 1 } : undefined
      }
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
