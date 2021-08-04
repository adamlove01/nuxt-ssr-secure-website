import nodemailer from 'nodemailer'
import Try from '../../helpers/tryCatch.js'
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * Send Confirmation Email
 *
 * @param  {Object}  data
 * @param  {Integer} data.name    - The user's name
 * @param  {String}  data.email   - The user's email
 * @param  {String}  data.subject - The email subject
 * @param  {String}  data.message - The email message
 * @return {Void}
 */
export async function sendContactEmail(data) {
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
      sender: data.name,
      from: `${data.name} <${process.env.ADMIN_EMAIL}>`,
      replyTo: data.email,
      to: process.env.WEBSITE_EMAIL,
      subject: data.subject,
      html: data.message,
    })
  )

  /** Error: SendMail */
  if (err) console.log(err)

  /** Error: No data */
  if (info === undefined) console.log('SendMail error: No data.')

  /** Success */
  transporter.close()
}
