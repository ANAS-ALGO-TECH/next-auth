import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('body = ', body)

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'User does not exists' },
        { status: 400 }
      )
    }

    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Check your credentials' },
        { status: 400 }
      )
    }

    const tokenData = {
      id: user._id,
      username: user._username,
      email: user._email,
    }

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    })

    const response = NextResponse.json({
      message: 'Logged In successfully',
      success: true,
    })

    response.cookies.set('token', token, {
      httpOnly: true,
    })
    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
