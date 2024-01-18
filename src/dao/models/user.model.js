import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, max: 30 },
  lastName: { type: String, required: true, max: 30 },
  email: { type: String, required: true, max: 50 },
  age: { type: Number, required: true },
  password: { type: String, required: true, max: 100 },
  role: { type: String, default: 'user' },
})

const userModel = mongoose.model('users', userSchema)

export default userModel
