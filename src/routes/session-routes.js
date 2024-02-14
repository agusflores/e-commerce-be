import { Router } from 'express'
import passport from 'passport'
import { AuthController } from '../controller/auth-controller.js'

const router = new Router()

router.post(
  '/register',
  passport.authenticate('register', {
    failureRedirect: '/register',
  }),
  AuthController.register
)

router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/login',
  }),
  AuthController.login
)

router.post('/reset-password', AuthController.resetPassword)

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
