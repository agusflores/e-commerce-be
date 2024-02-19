import userModel from '../models/user.model.js'
import { createHash, validatePassword } from '../utils.js'

class AuthController {
  static register = async (req, res) => {
    req.session.user = {
      fullName: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      age: req.user.age,
    }

    return res.status(200).redirect('/views/users')
  }

  static login = async (req, res) => {
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

    return res.status(200).redirect('/views/users')
  }

  static resetPassword = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res
        .status(400)
        .send({ status: 'error', error: 'User doesnt exist' })
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
  }
}

export { AuthController }
