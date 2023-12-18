import { Router } from 'express'
import cartModel from '../dao/models/cart.model.js'
import productModel from '../dao/models/product.model.js'

const router = Router()

router.get('/:id', async (req, res) => {
  const id = req.params.id

  const result = await cartModel.find({ _id: id })
  return res.json({
    status: 'success',
    message: result,
  })
})

router.post('/', async (req, res) => {
  const products = await req.body.products.map((p) => {
    return {
      productId: p.id,
      quantity: p.quantity,
    }
  })

  const newCart = {
    products: products,
  }

  const result = await cartModel.create(newCart)
  return res.json({
    status: 'success',
    message: result,
  })
})

router.post('/:cid/products/:pid', async (req, res) => {
  const cartIdToFind = req.params.cid
  const productIdToFind = req.params.pid
  const productQuantityToAdd = req.body.quantity

  const cart = await cartModel.findOne({ _id: cartIdToFind })
  if (!cart) {
    return res.status(404).send({ status: 'error', message: 'Cart not found' })
  }

  const product = await productModel.findOne({ _id: productIdToFind })
  if (!product) {
    return res
      .status(404)
      .send({ status: 'error', message: 'Product not found' })
  }

  const productExistsInCart = await cart.products.find(
    (p) => p.productId === productIdToFind
  )

  if (!productExistsInCart) {
    cart.products.push({
      productId: product._id,
      quantity: productQuantityToAdd,
    })
  } else {
    const index = cart.products.findIndex(
      (p) => p.productId === productIdToFind
    )
    cart.products[index].quantity += productQuantityToAdd
  }
  const result = await cartModel.updateOne(
    { _id: cartIdToFind },
    { $set: cart }
  )
  return res.json({
    status: 'success',
    message: result,
  })
})

export default router
