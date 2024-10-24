import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import User from '@/models/user.model'
import { RESET_PASSWORD, VERIFY_EMAIL } from '@/constants'

export const sendEmail = async ({ email, emailType, userId }: any) => {
  console.log('email = ', email)
  console.log('emailType = ', emailType)
  console.log('userId = ', userId)
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)
    console.log('hashedToken = ', hashedToken)

    const subject =
      emailType === VERIFY_EMAIL ? 'Verify your email' : 'Reset your password'

    const verifyEmailHTML = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">
      here</a> to verify your email.
      or copy and paste the link below in your browser.<br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`

    const resetPasswordHTML = `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">
      here</a> to reset your password.
      or copy and paste the link below in your browser.<br> ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
      </p>`

    const emailHTML = VERIFY_EMAIL ? verifyEmailHTML : resetPasswordHTML

    let user
    if (emailType === VERIFY_EMAIL) {
      user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000,
          },
        },
        { new: true }
      )
    } else if (emailType === RESET_PASSWORD) {
      user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          },
        },
        { new: true }
      )
    }

    console.log('mail user = ', user)

    // Looking to send emails in production? Check out our Email API/SMTP product!
    // var transport = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // })

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'a47fc5f23a43f2',
        pass: '13bf9b7dc635fd',
      },
    })

    const mailOptions = {
      from: 'anas001ismail@gmail.com',
      to: email,
      subject: subject,
      html: emailHTML,
    }

    const mailResponse = await transport.sendMail(mailOptions)
    return mailResponse
  } catch (error: any) {
    throw new Error(error.message)
  }
}
