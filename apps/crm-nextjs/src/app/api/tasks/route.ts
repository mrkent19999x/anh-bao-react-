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
    const priority = searchParams.get('priority') || 'all'

    const where: any = {
      userId: user.id
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      where.status = status
    }

    if (priority !== 'all') {
      where.priority = priority
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    console.error('Get tasks error:', error)
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
      description,
      status,
      priority,
      dueDate,
      progress,
      estimatedTime,
      customerId
    } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Tiêu đề công việc là bắt buộc' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        progress: progress || 0,
        estimatedTime,
        userId: user.id,
        customerId: customerId || null
      }
    })

    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
