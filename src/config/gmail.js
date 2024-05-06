import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'agustinflores1505@gmail.com',
    pass: 'yyfetcctulxdxbvc',
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
})

export { transporter }
