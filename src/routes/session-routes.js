import { Router } from 'express'
import passport from 'passport'
import { AuthController } from '../controller/auth-controller.js'
import { authToken } from '../utils.js'

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

router.post('/logout', AuthController.logout)

router.post('/', authToken, (req, res) => {
  res.send({ status: 'ok', user: req.user })
})

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
    res.redirect('/views/profile')
  }
)

router.get('/', AuthController.getUsers)

router.get('/no-current', AuthController.getUsersWithoutCurrent)

router.delete('/delete-user/:id', AuthController.deleteUserById)

router.put('/update-user/:id', AuthController.updateUser)

export { router as userRouter }
