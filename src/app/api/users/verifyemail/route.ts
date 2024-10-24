import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(request: NextRequest) {
  try {
    console.log('In Verify Email Route')
    const body = await request.json()
    const { token } = body

    console.log('token = ', token)

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined

    await user.save()

    return NextResponse.json({
      message: 'Email verified successfully',
      success: true,
      user: user,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
