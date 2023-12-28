import mongoose from 'mongoose'
import productModel from './product.model.js'

const collection = 'Cart'

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: productModel,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
})

const cartModel = mongoose.model(collection, cartSchema)

export default cartModel
