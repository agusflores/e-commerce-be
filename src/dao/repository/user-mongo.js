import userModel from '../../models/user.model.js'

export class UserMongo {
  constructor() {
    this.model = userModel
  }

  async getUserByCart(cart) {
    try {
      const result = await userModel.findOne({ cart: cart })
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
