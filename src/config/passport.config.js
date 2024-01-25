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

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.7e58ea00ed9616b6',
        clientSecret: '92971fcb484806b67ae7fc70bda3cf180d9dc7c6',
        callbackURL: 'http://localhost:8080/api/users/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        done(null, profile)
      }
    )
  )
}
export default inicializePassport
