import { cartDao } from '../dao/index.js'

class CartController {
  static getCartById = async (req, res) => {
    try {
      const id = req.params.id
      const result = await cartDao.getCartById(id)
      return res.json({
        status: 'success',
        message: result,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static deleteCartById = async (req, res) => {
    try {
      const id = req.params.id
      const result = await cartDao.deleteCartById(id)
      return res.json({
        status: 'success',
        message: result,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static postCart = async (req, res) => {
    try {
      const cart = req.body
      const result = await cartDao.createCart(cart)
      return res.json({
        status: 'success',
        message: result,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static addProductsToCart = async (req, res) => {
    try {
      const cartId = req.params.cid
      const productId = req.params.pid
      const quantity = req.body.quantity
      const result = await cartDao.addProductToCart(cartId, productId, quantity)
      return res.json({
        status: 'success',
        message: result,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static removeProductsFromCart = async (req, res) => {
    try {
      const cartId = req.params.cid
      const productId = req.params.pid
      const result = await cartDao.removeProductFromCart(cartId, productId)
      return res.json({
        status: 'success',
        message: result,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static updateProductsFromCart = async (req, res) => {
    try {
      const cartId = req.params.cid
      const productId = req.params.pid
      const quantity = req.body.quantity
      const result = await cartDao.updateProductFromCart(
        cartId,
        productId,
        quantity
      )
      return res.json({
        status: 'success',
        message: result,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static doAPurchase = async (req, res) => {
    try {
      const cartId = req.params.cid
      const cart = await cartDao.getCartById(cartId)

      
      return res.json({
        status: 'success',
        message: cart,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }
}

export { CartController }
