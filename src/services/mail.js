'use strict'
const nodemailer = require('nodemailer')

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (email, subject, template) => {
  require('dotenv').config()
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount()

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'GMAIL',
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: 'shadrachadamuul@gmail.com',
      pass: 'Ubandomaadamu@24',
    },
    debug: true,
    logger: true,
  })

  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: process.env.MAIL_SENDER, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: template, // html body
    },
    (error, response) => {
      if (error) {
        console.log(error)
        return false
      } else {
        console.log('Message sent: %s', info.messageId)
        console.log(response)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
        return true
      }
    },
  )
}
module.exports = { sendEmail }
// main().catch(console.error)
