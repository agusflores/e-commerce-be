import mongoose from 'mongoose'

const collection = 'Product'

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: {
    type: String,
    unique: true,
  },
  price: Number,
  stock: Number,
  thumbnail: String,
  category: String,
  status: Boolean,
})

const productModel = mongoose.model(collection, productSchema)

export default productModel
