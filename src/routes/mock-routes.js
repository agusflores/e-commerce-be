import { Router } from 'express'
import { generateFakeProduct } from '../utils.js'

const router = Router()

router.get('/products', async (req, res) => {
  let mockedProducts = []
  for (let i = 0; i < 100; i++) {
    const fakeProduct = generateFakeProduct()
    mockedProducts.push(fakeProduct)
  }

  res.status(200).json({ status: 'success', products: mockedProducts })
})

export { router as mockRouter }
