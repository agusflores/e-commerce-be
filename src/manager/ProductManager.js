import fs from 'fs'

export default class ProductManager {
  path = './files/products.json'

  constructor() {}

  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const products = JSON.parse(data)
      return products
    } else {
      return []
    }
  }

  getProductById = async (id) => {
    const products = await this.getProducts()
    if (products.length === 0) {
      return 'El archivo esta vacio'
    } else {
      const product = products.find((prod) => prod.id === id)
      product ? product : 'Not Found'
    }
  }

  addProduct = async (product) => {
    const products = await this.getProducts()
    const productExists = products.find((prod) => prod.code === product.code)

    if (!productExists) {
      products.length === 0
        ? (product.id = 1)
        : (product.id = products[products.length - 1].id + 1)
      products.push(product)
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, '\t')
      )
      return products
    }
  }

  updateProduct = async (id, product) => {
    try {
      const products = await this.getProducts()
      const productIndex = products.findIndex((prod) => prod.id === id)

      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...product }
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, '\t')
        )
        return products
      } else {
        return 'Not Found'
      }
    } catch (error) {
      console.log(error)
    }
  }

  deleteProduct = async (id) => {
    const products = await this.getProducts()
    const productIndex = products.findIndex((prod) => prod.id === id)
    if (productIndex !== -1) {
      products.splice(productIndex, 1)
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, '\t')
      )
      return products
    } else {
      return 'Not Found'
    }
  }
}
