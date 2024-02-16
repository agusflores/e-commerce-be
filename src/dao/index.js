import { connectDB } from '../config/dbConnection.js'
import { CartMongo } from './repository/cart-mongo.js'

connectDB()
export const cartDao = new CartMongo()
