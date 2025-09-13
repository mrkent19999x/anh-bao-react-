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
    const category = searchParams.get('category') || 'all'
    const status = searchParams.get('status') || 'all'

    const where: any = {
      userId: user.id
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    if (category !== 'all') {
      where.category = category
    }

    if (status !== 'all') {
      where.status = status
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: documents })
  } catch (error) {
    console.error('Get documents error:', error)
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
      name,
      type,
      size,
      category,
      description,
      tags,
      status,
      filePath,
      thumbnail,
      customerId
    } = await request.json()

    if (!name || !type || !size || !filePath) {
      return NextResponse.json(
        { error: 'Tên, loại, kích thước và đường dẫn file là bắt buộc' },
        { status: 400 }
      )
    }

    const document = await prisma.document.create({
      data: {
        name,
        type,
        size,
        category,
        description,
        tags: tags || [],
        status: status || 'pending',
        filePath,
        thumbnail,
        userId: user.id,
        customerId: customerId || null
      }
    })

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error('Create document error:', error)
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
