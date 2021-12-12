import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import Try from '../../helpers/tryCatch.js'
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * Send Confirmation Email
 *
 * @param  {Object}  user
 * @param  {Integer} user.id    - The user ID
 * @param  {String}  user.email - The user email address
 * @return {Void}
 */
export async function sendConfirmationEmail(user) {
  /** Create Json WebToken */
  const date = new Date().toISOString().replace('T', ' ').split('.')[0]
  const mail = { id: user.id, type: 'sendConfirmationEmail', created: date }
  const token = jwt.sign(mail, process.env.TOKEN_AUTH_SECRET, {
    expiresIn: '1d',
  })

  /**
   * Set the URL path for the confirmation link in the email.
   *
   * Note: when dev testing, the link will be 'http://localhost:3000/...'
   * This may be flagged as spam since it is a suspicious link, and will
   * go to your spam folder.
   *
   * On your live server it will be a 'real' link and SHOULD be delivered okay.
   */
  const url = `${process.env.BASE_URL}/verify?token=${token}`

  /**
   * Create nodemailer transporter
   *
   * @param {String} host      - This is the smtpEndpoint in SES, for example
   *                            'email-smtp.us-east-1.amazonaws.com'
   * @param {String} port      - Amazon SES requires 465, 587 or 25
   * @param {Object} auth
   * @param {String} auth.user - SMTP username: Generated in Amazon SES Console
   * @param {String} auth.pass - SMTP password: Generated in Amazon SES Console
   *                           - See 'Obtaining Amazon SES SMTP credentials
   *                             using the Amazon SES console'
   * https://docs.aws.amazon.com/ses/latest/DeveloperGuide/smtp-credentials.html
   */
  let transporter = nodemailer.createTransport({
    host: process.env.AWS_SMTP_REGION,
    port: process.env.AWS_SMTP_PORT,
    auth: {
      user: process.env.AWS_SMTP_USERNAME,
      pass: process.env.AWS_SMTP_PASSWORD,
    },
  })

  /** Send email to the user */
  const [err, info] = await Try(
    transporter.sendMail({
      from: `"Your Website" <${process.env.ADMIN_EMAIL}>`,
      to: user.email,
      subject: 'Verify Your Account',
      html: `Hello!
      <br><br>
      Thank you for signing up at Your Website!
      <br><br>
      Please click on this link to verify your account:
      <br><br>
      <a href="${url}" style="background-color: #0178c7; border: 1px solid #0178c7; border-radius: 12px; color: #ffffff; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 34px; text-align: center; text-decoration: none; width: 175px; -webkit-text-size-adjust: none; mso-hide: all">VERIFY NOW</a>
      <br><br>
      Thank you so much!`,
    })
  )

  /** Error: SendMail */
  if (err) console.log(err)

  /** Error: No data */
  if (info === undefined) console.log('SendMail error: No data.')

  /** Success */
  transporter.close()
}
