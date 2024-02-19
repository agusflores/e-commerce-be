import productModel from '../../models/product.model.js'

export class ProductMongo {
  constructor() {
    this.model = productModel
  }

  async getProducts(limit, page, sort, category, status) {
    try {
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

      const products = await productModel.paginate({
        limit: limit,
        lean: true,
        page: page,
        sort: sort
          ? { price: sort === 'desc' ? -1 : sort === 'asc' ? 1 : 0 }
          : undefined,
      })
      return products
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findById(id)
      if (!product) {
        throw new Error(`No existe el carrito con el id proporcionado: ${id}`)
      }
      return product
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createProduct(product) {
    try {
      if (!isValidProduct(product)) {
        throw new Error('Missing fields')
      }
      if (product.status === undefined) {
        product.status = true
      }
      const result = await productModel.create(product)
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateProductById(id, newProduct) {
    try {
      if (!isValidProduct(newProduct)) {
        throw new Error('Missing fields')
      }
      const result = await productModel.updateOne(
        { _id: id },
        { $set: newProduct }
      )
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteProductById(id) {
    try {
      const result = await productModel.deleteOne({ _id: id })
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

const isValidProduct = (product) => {
  if (
    product.title === undefined ||
    product.description === undefined ||
    product.code === undefined ||
    product.price === undefined ||
    product.stock === undefined ||
    product.category === undefined
  ) {
    return false
  }
  return true
}
