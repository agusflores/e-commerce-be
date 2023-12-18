import { randomUUID } from 'crypto'
import { Router } from 'express'
import productModel from '../dao/models/product.model.js'
const router = Router()

router.get('/', async (req, res) => {
  let limit = req.query.limit
  const result = await productModel.find().limit(limit)
  res.json({
    status: 'success',
    message: result,
  })
})

router.get('/:id', async (req, res) => {
  const id = req.params.id

  const result = await productModel.find({ _id: id })
  res.json({
    status: 'success',
    message: result,
  })
})

router.post('/', async (req, res) => {
  const defaultStatus = true
  const newProduct = req.body
  newProduct.id = randomUUID()
  if (!isValidProduct(newProduct)) {
    res.status(400).send({ status: 'error', message: 'Missing fields' })
  } else {
    if (newProduct.status === undefined) {
      newProduct.status = defaultStatus
    }
    const result = await productModel.create(newProduct)
    res.json({
      status: 'success',
      message: result,
    })
  }
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const newProduct = req.body
  if (!isValidProduct(newProduct)) {
    res.status(400).send({ status: 'error', message: 'Missing fields' })
  } else {
    const result = await productModel.updateOne(
      { _id: id },
      { $set: newProduct }
    )
    res.json({
      status: 'success',
      message: result,
    })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const result = await productModel.deleteOne({ _id: id })
  res.json({
    status: 'success',
    message: result,
  })
})

function isValidProduct(product) {
  if (
    product.title === undefined ||
    product.description === undefined ||
    product.code === undefined ||
    product.price === undefined ||
    product.stock === undefined ||
    product.category === undefined
  ) {
    return false
  } else {
    return true
  }
}

export default router
