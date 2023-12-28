import { Router } from 'express'
import productModel from '../dao/models/product.model.js'
import messageModel from '../dao/models/message.model.js'
import cartModel from '../dao/models/cart.model.js'

const router = new Router()

router.get('/home', async (req, res) => {
  const products = await productModel.find()
  res.render('home', { products: products.map((p) => p.toJSON()) })
})

router.get('/realtimeproducts', async (req, res) => {
  const products = await productModel.find()
  res.render('realtimeproducts', { products })
})

router.get('/chat', async (req, res) => {
  const messages = await messageModel.find()
  res.render('chat', { messages })
})

router.get('/carts/:cid', async (req, res) => {
  const cid = req.params.cid
  const cart = await cartModel.findById(cid).populate('products.product')

  if (!cart) {
    return res.status(404).send('Cart not found')
  }

  res.render('cart', { cart: cart.toJSON() })
})

export default router
