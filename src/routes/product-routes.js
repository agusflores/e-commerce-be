import { randomUUID } from 'crypto'
import { Router } from 'express'
import fs from 'fs'

const router = Router()
const path = './files/products.json'

router.get('/', async (req, res) => {
  if (fs.existsSync(path) === true) {
    const data = await fs.promises.readFile(path, 'utf-8')
    const products = JSON.parse(data)
    let limit = req.query.limit

    if (limit === undefined || limit === '') {
      res.status(200).send({ status: 'success', products: products })
    } else {
      res
        .status(200)
        .send({ status: 'success', products: products.slice(0, limit) })
    }
  } else {
    res.status(404).send({ status: 'error', message: 'File not found' })
  }
})

router.post('/', async (req, res) => {
  const data = await fs.promises.readFile(path, 'utf-8')
  const products = await JSON.parse(data)
  const defaultStatus = true
  const newProduct = req.body
  newProduct.id = randomUUID()
  if (
    newProduct.title === undefined ||
    newProduct.description === undefined ||
    newProduct.code === undefined ||
    newProduct.price === undefined ||
    newProduct.stock === undefined ||
    newProduct.category === undefined
  ) {
    res.status(400).send({ status: 'error', message: 'Missing fields' })
  } else {
    if (newProduct.status === undefined) {
      newProduct.status = defaultStatus
    }

    products.push(newProduct)
    await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'))
    res.status(201).send({
      status: 'success',
      message: 'Product created',
      product: newProduct,
    })
  }
})

router.get('/:id', async (req, res) => {
  const data = await fs.promises.readFile(path, 'utf-8')
  const products = JSON.parse(data)
  const id = req.params.id
  const product = products.find((item) => item.id == id)
  if (product === undefined || !product) {
    res.status(404).send({ status: 'error', message: 'Product not found' })
  } else {
    res.status(200).send({ status: 'success', product: product })
  }
})

router.put('/:id', async (req, res) => {
  const data = await fs.promises.readFile(path, 'utf-8')
  const products = JSON.parse(data)
  const id = req.params.id
  const newProduct = req.body

  if (
    newProduct.title === undefined ||
    newProduct.description === undefined ||
    newProduct.code === undefined ||
    newProduct.price === undefined ||
    newProduct.stock === undefined ||
    newProduct.category === undefined
  ) {
    res.status(400).send({ status: 'error', message: 'Missing fields' })
  } else {
    const index = products.findIndex((item) => item.id == id)
    if (index === -1) {
      res.status(404).send({ status: 'error', message: 'Product not found' })
    } else {
      newProduct.id = id
      products[index] = newProduct
      await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'))
      res.status(200).send({
        status: 'success',
        message: 'Product updated',
        product: newProduct,
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  const data = await fs.promises.readFile(path, 'utf-8')
  const products = JSON.parse(data)
  const id = req.params.id
  const index = products.findIndex((item) => item.id == id)
  if (index === -1) {
    res.status(404).send({ status: 'error', message: 'Product not found' })
  } else {
    products.splice(index, 1)
    await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'))
    res.status(200).send({ status: 'success', message: 'Product deleted' })
  }
})

export default router
