import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'

export class CartMongo {
  constructor() {
    this.model = cartModel
  }

  async getCartById(id) {
    try {
      const cart = await cartModel.findById(id).populate('products.product')
      if (!cart) {
        throw new Error(`No existe el carrito con el id proporcionado: ${id}`)
      }
      return cart
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteCartById(id) {
    try {
      const cart = await cartModel.findOne({ _id: id })
      if (!cart) {
        throw new Error(`No existe el carrito con el id proporcionado: ${id}`)
      }
      cart.products = []
      const result = await cartModel.updateOne({ _id: id }, { $set: cart })
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createCart(cart) {
    try {
      const result = await cartModel.create(cart)
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await cartModel.findOne({ _id: cartId })
      if (!cart) {
        throw new Error(
          `No existe el carrito con el id proporcionado: ${cartId}`
        )
      }
      const product = await productModel.findOne({ _id: productId })
      if (!product) {
        throw new Error(
          `No existe el producto con el id proporcionado: ${productId}`
        )
      }
      const productExistsInCart = cart.products.find((p) => {
        return p.product._id.toString() === product._id.toString()
      })

      if (!productExistsInCart) {
        cart.products.push({
          product: product,
          quantity: quantity,
        })
      } else {
        const index = cart.products.findIndex((p) => {
          return p.product._id.toString() === product._id.toString()
        })
        cart.products[index].quantity += quantity
      }
      const result = await cartModel.updateOne({ _id: cartId }, { $set: cart })
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findOne({ _id: cartId })
      if (!cart) {
        throw new Error(
          `No existe el carrito con el id proporcionado: ${cartId}`
        )
      }
      const product = await productModel.findOne({ _id: productId })
      if (!product) {
        throw new Error(
          `No existe el producto con el id proporcionado: ${productId}`
        )
      }
      const productExistsInCart = cart.products.find((p) => {
        return p.product._id.toString() === product._id.toString()
      })

      if (!productExistsInCart) {
        throw new Error(
          `No existe el producto con el id proporcionado: ${productId} en el carrito`
        )
      }
      cart.products.splice(productExistsInCart, 1)
      const result = await cartModel.updateOne({ _id: cartId }, { $set: cart })
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateProductFromCart(cartId, productId, quantity) {
    try {
      const cart = await cartModel.findOne({ _id: cartId })
      if (!cart) {
        throw new Error(
          `No existe el carrito con el id proporcionado: ${cartId}`
        )
      }
      const product = await productModel.findOne({ _id: productId })
      if (!product) {
        throw new Error(
          `No existe el producto con el id proporcionado: ${productId}`
        )
      }
      const productExistsInCart = cart.products.find((p) => {
        return p.product._id.toString() === product._id.toString()
      })

      if (!productExistsInCart) {
        throw new Error(
          `No existe el producto con el id proporcionado: ${productId} en el carrito`
        )
      }
      const index = cart.products.findIndex((p) => {
        return p.product._id.toString() === product._id.toString()
      })
      cart.products[index].quantity = quantity

      const result = await cartModel.updateOne({ _id: cartId }, { $set: cart })
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
