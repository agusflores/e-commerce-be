import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import { createHash, validatePassword } from '../utils.js'
import passport from 'passport'

const router = new Router()

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
  passport.authenticate('login', { failureRedirect: '/views/users/login' }),
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
  passport.authenticate('github', { scope: ['user:email'], sesion: false }),
  async (req, res) => {}
)

router.get(
  '/githubcallback',
  passport.authenticate('github', { scope: ['user:email'], sesion: false }),
  async (req, res) => {
    console.log(req.user)
    res.redirect('/views/home')
  }
)

export { router as userRouter }
