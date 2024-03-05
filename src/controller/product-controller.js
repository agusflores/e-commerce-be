import { productDao } from '../dao/index.js'

class ProductController {
  static getProducts = async (req, res) => {
    try {
      let { limit = 10, page = 1, sort, category, status } = req.query
      const products = productDao.getProducts(
        limit,
        page,
        sort,
        category,
        status
      )

      res.json({
        status: 'success',
        message: products,
      })
    } catch (error) {
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static getProductById = async (req, res) => {
    try {
      const id = req.params.id
      const product = await productDao.getProductById(id)
      return res.json({
        status: 'success',
        message: product,
      })
    } catch (error) {
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static createProduct = async (req, res) => {
    try {
      const product = req.body
      const createdProduct = await productDao.createProduct(product)
      return res.json({
        status: 'success',
        message: createdProduct,
      })
    } catch (error) {
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static updateProductById = async (req, res) => {
    try {
      const id = req.params.id
      const newProduct = req.body
      const updatedProduct = await productDao.updateProductById(id, newProduct)
      res.json({
        status: 'success',
        message: updatedProduct,
      })
    } catch (error) {
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }

  static deleteProductById = async (req, res) => {
    try {
      const id = req.params.id
      const result = await productDao.deleteProductById(id)
      res.json({
        status: 'success',
        message: result,
      })
    } catch (error) {
      req.logger.error(error.message)
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }
}

export { ProductController }
