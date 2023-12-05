import { Router } from 'express'
import fs from 'fs'

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
  const products = await getProducts()
  res.render('realtimeproducts', { products })
})

export default router
