import cartModel from '../dao/models/cart.model.js'
import productModel from '../dao/models/product.model.js'

class CartController {
  static getCartById = async (req, res) => {
    const id = req.params.id

    const result = await cartModel.findById(id).populate('products.product')
    return res.json({
      status: 'success',
      message: result,
    })
  }

  static deleteCartById = async (req, res) => {
    const id = req.params.id

    const cart = await cartModel.findOne({ _id: id })

    if (!cart) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Cart not found' })
    }

    cart.products = []

    const result = await cartModel.updateOne({ _id: id }, { $set: cart })

    return res.json({
      status: 'success',
      message: result,
    })
  }

  static postCart = async (req, res) => {
    const cart = req.body
    const result = await cartModel.create(cart)
    return res.json({
      status: 'success',
      message: result,
    })
  }

  static addProductsToCart = async (req, res) => {
    const cartIdToFind = req.params.cid
    const productIdToFind = req.params.pid
    const productQuantityToAdd = req.body.quantity

    const cart = await cartModel.findOne({ _id: cartIdToFind })
    if (!cart) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Cart not found' })
    }

    const product = await productModel.findOne({ _id: productIdToFind })
    if (!product) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Product not found' })
    }

    const productExistsInCart = cart.products.find((p) => {
      return p.product._id.toString() === product._id.toString()
    })

    if (!productExistsInCart) {
      cart.products.push({
        product: product,
        quantity: productQuantityToAdd,
      })
    } else {
      const index = cart.products.findIndex((p) => {
        return p.product._id.toString() === product._id.toString()
      })
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
  }

  static removeProductsFromCart = async (req, res) => {
    const cartIdToFind = req.params.cid
    const productIdToFind = req.params.pid

    const cart = await cartModel.findOne({ _id: cartIdToFind })
    if (!cart) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Cart not found' })
    }

    const product = await productModel.findOne({ _id: productIdToFind })
    if (!product) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Product not found' })
    }

    const productExistsInCart = cart.products.find((p) => {
      return p.product._id.toString() === product._id.toString()
    })

    if (!productExistsInCart) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Product not found in cart' })
    } else {
      cart.products.splice(productExistsInCart, 1)
      const result = await cartModel.updateOne(
        { _id: cartIdToFind },
        { $set: cart }
      )
      return res.status(200).send({ status: 'success', message: result })
    }
  }

  static updateProductsFromCart = async (req, res) => {
    const cartIdToFind = req.params.cid
    const productIdToFind = req.params.pid

    const cart = await cartModel.findOne({ _id: cartIdToFind })
    if (!cart) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Cart not found' })
    }

    const product = await productModel.findOne({ _id: productIdToFind })
    if (!product) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Product not found' })
    }

    const productExistsInCart = cart.products.find((p) => {
      return p.product._id.toString() === product._id.toString()
    })

    if (!productExistsInCart) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Product not found in cart' })
    } else {
      const index = cart.products.findIndex((p) => {
        return p.product._id.toString() === product._id.toString()
      })
      cart.products[index].quantity = req.body.quantity
    }
    const result = await cartModel.updateOne(
      { _id: cartIdToFind },
      { $set: cart }
    )
    return res.json({
      status: 'success',
      message: result,
    })
  }
}

export { CartController }
