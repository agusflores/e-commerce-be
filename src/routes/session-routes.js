import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import { createHash, validatePassword } from '../utils.js'
import passport from 'passport'

const router = new Router()

// router.post('/register', async (req, res) => {
//   const { firstName, lastName, age, email, password } = req.body
//   const existUser = await userModel.findOne({ email: email })
//   if (existUser) {
//     return res.send({ status: 'error', error: 'user exists' })
//   } else {
//     const user = {
//       firstName,
//       lastName,
//       age,
//       email,
//       password: createHash(password),
//     }

//     if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
//       await userModel.create({ ...user, role: 'admin' })
//     } else {
//       await userModel.create(user)
//     }
//   }
// })

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '' }),
  async (req, res) => {
    return res.send({
      status: 'success',
      message: 'User registered successfully',
    })
  }
)

router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '' }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send({
        status: 'Error',
        error: 'Datos incorrectos',
      })
    }
    req.session.user = {
      fullName: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      age: req.user.age,
    }
    return res.send({ status: 'success', payload: req.session.user })
  }
)

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body
//   console.log(email, password)
//   const user = await userModel.findOne({ email })

//   if (!user) {
//     return res.status(400).send({
//       status: 'Error',
//       error: 'Datos incorrectos',
//     })
//   }

//   if (!validatePassword(password, user)) {
//     return res.status(400).send({
//       status: 'Error',
//       error: 'Datos incorrectos',
//     })
//   }

//   req.session.user = {
//     fullName: `${user.firstName} ${user.lastName}`,
//     email: user.email,
//     age: user.age,
//   }
//   res.send({
//     status: 200,
//     payload: req.session.user,
//     message: 'login',
//   })
//   console.log('Usuario encontrado:', req.session.user)
// })

router.post('/resetPassword', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).send({
      status: 'Error',
      error: 'Datos incompletos',
    })
  }

  const user = await userModel.findOne({ email })

  if (!user) {
    return res.status(400).send({ status: 'error', error: 'user doesnt exist' })
  }

  const newHashPassword = createHash(password)
  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: newHashPassword } }
  )

  return res.status(200).send({ status: 'ok', message: 'password updated' })
})

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
)

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user
    res.redirect('/')
  }
)

export { router as userRouter }
