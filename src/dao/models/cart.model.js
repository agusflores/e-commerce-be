import mongoose from 'mongoose'
import productModel from './product.model.js'

const collection = 'Cart'

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
})

const cartModel = mongoose.model(collection, cartSchema)

export default cartModel
