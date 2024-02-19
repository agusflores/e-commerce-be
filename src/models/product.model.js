import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const collection = 'Product'

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  stock: Number,
  thumbnail: String,
  category: String,
  status: Boolean,
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, productSchema)

export default productModel
