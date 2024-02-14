import { Router } from 'express'
import { ProductController } from '../controller/product-controller.js'

const router = Router()

router.get('/', ProductController.getProducts)

router.get('/:id', ProductController.getProductById)

router.post('/', ProductController.createProduct)

router.put('/:id',ProductController.updateProductById)

router.delete('/:id', ProductController.deleteProductById)

export default router
