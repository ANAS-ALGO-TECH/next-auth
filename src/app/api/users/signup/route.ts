import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'

connect()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    console.log('body = ', body)

    const user = await User.findOne({ email })

    if (user) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    const savedUser = await newUser.save()
    console.log('savedUser = ', savedUser)

    // const tokenData = {
    //   id: savedUser._id,
    //   username: savedUser._username,
    //   email: savedUser._email,
    // }

    // const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
    //   expiresIn: '1d',
    // })

    // send verification email
    await sendEmail({
      email,
      emailType: 'VERIFY',
      userId: savedUser._id,
    })

    return NextResponse.json({
      message: 'User registered successfully',
      success: true,
      user: savedUser,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
