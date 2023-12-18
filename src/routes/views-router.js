import { Router } from 'express'
import productModel from '../dao/models/product.model.js'
import messageModel from '../dao/models/message.model.js'

const router = new Router()

router.get('/home', async (req, res) => {
  const products = await productModel.find()
  res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
  const products = await productModel.find()
  res.render('realtimeproducts', { products })
})

router.get('/chat', async (req, res) => {
  const messages = await messageModel.find()
  res.render('chat', { messages })
})

export default router
