import { Router } from 'express'
import productModel from '../models/product.model.js'
import messageModel from '../models/message.model.js'
import cartModel from '../models/cart.model.js'

const router = new Router()

router.get('/chat', async (req, res) => {
  const messages = await messageModel.find()
  res.render('chat', { messages })
})

router.get('/cart', async (req, res) => {
  const user = req.session.user
  const cart = await cartModel.findById(user.cart).populate('products.product')
  if (!cart) {
    return res.status(404).send('Cart not found')
  }

  res.render('cart', { cart: cart.toJSON() })
})

router.get('/products', async (req, res) => {
  let { limit = 3, page = 1, sort, category, status } = req.query
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

router.get('/profile', (req, res) => {
  res.render('profile', { user: req.session.user })
})

router.get('/users/resetPassword', (req, res) => {
  res.render('resetPassword')
})

export default router
