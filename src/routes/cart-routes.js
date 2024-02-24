import { Router } from 'express'
import { CartController } from '../controller/cart-controller.js'
import { validateUserRole } from '../utils.js'

const router = Router()

router.get('/:id', CartController.getCartById)

router.delete('/:id', CartController.deleteCartById)

router.post('/', CartController.postCart)

router.post(
  '/:cid/products/:pid',
  validateUserRole,
  CartController.addProductsToCart
)

router.delete('/:cid/products/:pid', CartController.removeProductsFromCart)

router.put('/:cid/products/:pid', CartController.updateProductsFromCart)

router.post('/:cid/purchase', CartController.doAPurchase)

export default router
