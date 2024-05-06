import { cartDao, ticketDao, userDao, productDao } from '../dao/index.js'
import { transporter } from '../config/gmail.js'
import { purchaseEmailTemplate } from '../templates/mail/purchase-email.js'

class CartController {
  static getUsersCart = async (req, res) => {
    try {
      const result = req.session.user.cart
      return res.status(200).json({
        status: 'success',
        cartId: result,
      })
    } catch (error) {
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static getCartById = async (req, res) => {
    try {
      const id = req.params.id
      const result = await cartDao.getCartById(id)
      return res.json({
        status: 'success',
        message: result,
      })
    } catch (error) {
      req.logger.error(error.message)
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
      req.logger.error(error.message)
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
      req.logger.error(error.message)
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
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', error: error })
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
      req.logger.error(error.message)
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
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static doAPurchase = async (req, res) => {
    try {
      const cartId = req.session.user.cart
      const cart = await cartDao.getCartById(cartId)

      if (!cart) {
        return res
          .status(404)
          .send({ status: 'error', message: 'Cart not found' })
      }

      if (cart.products.length === 0) {
        return res
          .status(404)
          .send({ status: 'error', message: 'Cart is empty' })
      }

      cart.products.forEach((elem) => {
        elem.product.stock = elem.product.stock - elem.quantity
        productDao.updateProductById(elem.product._id, elem.product)
      })

      const user = await userDao.getUserByCart(cart)

      const ticket = {
        code: Math.floor(Math.random() * (1000000 - 1000 + 1)) + 1000,
        purchase_datetime: new Date(),
        amount: cart.total,
        purchaser: user.email,
      }
      await ticketDao.createTicket(ticket)

      cart.products = []
      cart.total = 0

      await cartDao.updateCart(cartId, cart)

      const mailOptions = {
        to: user.email,
        subject: 'Confirmacion de compra',
        html: purchaseEmailTemplate(ticket),
      }

      transporter.sendMail(mailOptions, (err, res) => {})

      return res.json({
        status: 'success',
        message: ticket,
      })
    } catch (error) {
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }
}

export { CartController }
