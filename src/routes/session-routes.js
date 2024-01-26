import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import { createHash, validatePassword } from '../utils.js'
import passport from 'passport'

const router = new Router()

router.post(
  '/register',
  passport.authenticate('register', {
    failureRedirect: '/register',
  }),
  async (req, res) => {
    req.session.user = {
      fullName: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      age: req.user.age,
    }

    return res.status(200).redirect('/views/users')
  }
)

router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/login',
  }),
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

    return resstatus(200).redirect('/views/users')
  }
)

router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body

  const user = await userModel.findOne({ email })

  if (!user) {
    return res.status(400).send({ status: 'error', error: 'User doesnt exist' })
  }

  const newHashPassword = createHash(password)
  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: newHashPassword } }
  )

  req.session.user = {
    fullName: `${req.user.firstName} ${req.user.lastName}`,
    email: req.user.email,
    age: req.user.age,
  }

  return res.status(200).redirect('/views/users')
})

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], sesion: false }),
  async (req, res) => {}
)

router.get(
  '/githubcallback',
  passport.authenticate('github', { scope: ['user:email'], sesion: false }),
  async (req, res) => {
    res.redirect('/views/home')
  }
)

export { router as userRouter }
