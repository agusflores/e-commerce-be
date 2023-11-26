import { randomUUID } from 'crypto'
import { Router } from 'express'
import fs from 'fs'

const router = Router()
const path = './files/cart.json'

router.get('/:id', async (req, res) => {
  const data = await fs.promises.readFile(path, 'utf-8')
  const carts = JSON.parse(data)
  const id = req.params.id
  const cartToFind = carts.find((item) => item.id == id)
  if (cartToFind === undefined || !cartToFind) {
    res.status(404).send({ message: 'Cart not found' })
  } else {
    res.status(200).send({ cart: cartToFind })
  }
})

router.post('/', async (req, res) => {
  const data = await fs.promises.readFile(path, 'utf-8')
  const carts = JSON.parse(data)
  const id = randomUUID()
  const newCart = req.body
  newCart.id = id
  carts.push(newCart)
  await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))
  res.status(201).send({ message: 'Cart created', newCart: newCart })
})

router.post('/:cid/products/:pid', async (req, res) => {
  const data = await fs.promises.readFile(path, 'utf-8')
  const carts = JSON.parse(data)
  const cartIdToFind = req.params.cid
  const productIdToFind = req.params.pid
  const productQuantityToAdd = req.body.quantity
  const cartIndex = carts.findIndex((item) => item.id === cartIdToFind)

  if (cartIndex === -1) {
    res.status(404).send({ message: 'Cart not found' })
  } else {
    const productIndex = carts[cartIndex].products.findIndex(
      (item) => item.id == productIdToFind
    )
    if (productIndex !== -1) {
      carts[cartIndex].products[productIndex].quantity += productQuantityToAdd
      await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))
      res.status(201).send({ message: 'Product quantity modified' })
    } else {
      let product = {
        id: productIdToFind,
        quantity: productQuantityToAdd,
      }
      carts[cartIndex].products.push(product)
      await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))
      res.status(201).send({ message: 'New product added' })
    }
  }
})

export default router
