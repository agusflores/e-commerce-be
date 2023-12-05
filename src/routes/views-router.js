import { Router } from 'express'
import { randomUUID } from 'crypto'
import fs from 'fs'
import socketServer from '../app.js'

const router = new Router()

export const getProducts = async () => {
  const products = await fs.promises.readFile('./files/products.json')
  const productsParsed = JSON.parse(products)
  return productsParsed
}

router.get('/home', async (req, res) => {
  const products = await getProducts()
  res.render('home', { products: products })
})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realtimeproducts', {})
})

router.post('/realTimeProducts', async (req, res) => {
  const data = await fs.promises.readFile('./files/products.json', 'utf-8')
  const products = await JSON.parse(data)
  const { title, description, code, price, stock, thumbnail, category } =
    req.body

  const newProduct = {
    title: title,
    description: description,
    code: code,
    price: parseInt(price),
    stock: parseInt(stock),
    thumbnail: thumbnail,
    category: category,
    id: randomUUID(),
    status: true,
  }

  products.push(newProduct)
  await fs.promises.writeFile(
    './files/products.json',
    JSON.stringify(products, null, '\t')
  )
  socketServer.emit('products', products)
})

export default router
