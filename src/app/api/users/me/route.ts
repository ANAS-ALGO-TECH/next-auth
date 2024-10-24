import { connect } from '@/dbConfig/dbConfig'
import { getDataFromToken } from '@/helpers/getDataFromToken'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(request: NextRequest) {
  try {
    // extract data from token
    const userId = await getDataFromToken(request)
    console.log('userId = ', userId)

    const user = await User.findOne({ _id: userId }).select('-password')
    console.log('user = ', user)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    return NextResponse.json({
      message: 'User data retrieved successfully',
      success: true,
      data: user,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
