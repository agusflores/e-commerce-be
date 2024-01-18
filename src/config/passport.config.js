import passport from 'passport'
import local from 'passport-local'

import { createHash, validatePassword } from '../utils.js'
import userModel from '../dao/models/user.model.js'
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

const inicializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        const { firstName, lastName, age, email } = req.body
        try {
          let user = await userModel.findOne({ email: username })
          if (user) {
            console.log('user register')
            return done(null, false)
          }
          const newUser = {
            firstName,
            lastName,
            age,
            email,
            password: createHash(password),
          }
          const result = await userModel.create(newUser)
          return done(null, result)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username })
          if (!user) {
            return done(null, false)
          }
          if (!validatePassword(password, user)) {
            return done(null, false)
          }
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => done(null, user._id))

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
  })

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.2282c51ff6d0f2e3',
        clientSecret: '82832f52b19c31c95f95703e2d160504cd73a13f',
        callbackURL: 'http://localhost:8080/api/session/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile)
          let user = await userModel.findOne({ email: profile.__json.email })
          if (!user) {
            let newUser = {
              firstName: profile.__json.firstName,
              lastName: '',
              age: 18,
              email: profile.__json.email,
              password: '',
            }
            let result = await userModel.create(newUser)
            done(null, result)
          } else {
            done(null, user)
          }
        } catch {}
      }
    )
  )
}
export default inicializePassport
