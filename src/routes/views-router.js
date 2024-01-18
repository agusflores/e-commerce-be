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

router.get('/products', async (req, res) => {
  let { limit = 10, page = 1, sort, category, status } = req.query
  const queryOptions = {}

  if (category) {
    queryOptions.category = category
  }

  if (status) {
    if (status === 'available') {
      queryOptions.stock = { $gt: 0 }
    } else {
      queryOptions.stock = { $eq: 0 }
    }
  }

  const products = await productModel.paginate(queryOptions, {
    limit: limit,
    lean: true,
    page: page,
    sort: sort
      ? { price: sort === 'desc' ? -1 : sort === 'asc' ? 1 : 0 }
      : undefined,
  })

  res.render('products', { products: products })
})

router.get('/users/register', (req, res) => {
  res.render('register')
})

router.get('/users/login', (req, res) => {
  res.render('login')
})

router.get('/users', (req, res) => {
  res.render('profile', { user: req.session.user })
})

export default router
