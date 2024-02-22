import { Router } from 'express'
import { ProductController } from '../controller/product-controller.js'
import { validateAdminRole } from '../utils.js'

const router = Router()

router.get('/', ProductController.getProducts)

router.get('/:id', ProductController.getProductById)

router.post('/', validateAdminRole, ProductController.createProduct)

router.put('/:id', validateAdminRole, ProductController.updateProductById)

router.delete('/:id', validateAdminRole, ProductController.deleteProductById)

export default router
