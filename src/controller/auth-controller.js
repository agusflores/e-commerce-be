import { UserDTO } from '../dto/user/user-dto.js'
import userModel from '../models/user.model.js'
import { createHash, generateToken } from '../utils.js'

class AuthController {
  static register = async (req, res) => {
    const user = req.body
    req.session.user = new UserDTO(user)

    const accessToken = generateToken()

    return res.status(200).send(accessToken)
  }

  static login = async (req, res) => {
    if (!req.user) {
      return res.status(400).send({
        status: 'Error',
        error: 'Datos incorrectos',
      })
    }

    req.session.user = new UserDTO(req.user)

    const accessToken = generateToken()
    return res.status(200).send(accessToken)
  }

  static resetPassword = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res
        .status(400)
        .send({ status: 'error', error: 'User does not exist' })
    }

    const newHashPassword = createHash(password)
    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newHashPassword } }
    )

    req.session.user = new UserDTO(user)

    return res.status(200).redirect('/views/users')
  }

  static logout = async (req, res) => {
    req.session.destroy()
    return res.status(200).send({ status: 'ok' })
  }
}

export { AuthController }
