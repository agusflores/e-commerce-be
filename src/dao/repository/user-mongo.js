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

  async updateUserRoleById(id, newRole) {
    try {
      const result = await userModel.updateOne(
        { _id: id },
        { $set: { role: newRole } }
      )
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteUserById(id) {
    try {
      const result = await userModel.deleteOne({ _id: id })
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
