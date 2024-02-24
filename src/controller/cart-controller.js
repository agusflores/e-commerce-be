import { cartDao, userDao } from '../dao/index.js'
import { PurchaseProductDTO } from '../dto/product/purchase-product-dto.js'

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
      let productsToPurchase = []

      if (!cart) {
        return res
          .status(404)
          .send({ status: 'error', message: 'Cart not found' })
      }

      // if (cart.products.length === 0) {
      //   return res
      //     .status(404)
      //     .send({ status: 'error', message: 'Cart is empty' })
      // }

      cart.products.forEach((elem) => {
        if (elem.product.stock >= elem.quantity) {
          elem.product.stock = elem.product.stock - elem.quantity
          productsToPurchase.push(new PurchaseProductDTO(elem.product))
          cart.products.filter((product) => product != elem)
        }
      })

      let purchasePrice = 0
      productsToPurchase.forEach((elem) => {
        let totalPerElement = elem.price * elem.quantity
        purchasePrice += totalPerElement
      })
      const user = await userDao.getUserByCart(cart)
      console.log(user)

      const ticket = {
        code: Math.floor(Math.random() * (1000000 - 1000 + 1)) + 1000,
        purchase_datetime: new Date(),
        amount: purchasePrice,
        purchaser: user.email,
      }

      return res.json({
        status: 'success',
        message: ticket,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }
}

export { CartController }
