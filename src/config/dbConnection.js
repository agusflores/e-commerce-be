import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const MONGO =
      'mongodb+srv://agustinflores1505:tUreQzQk6yGuuN55@cluster0.2gugbsj.mongodb.net/e-commerce?retryWrites=true&w=majority'
    await mongoose.connect(MONGO)
  } catch (error) {
    console.log('error: ', error)
  }
}
