document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn')

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const cartId = await getCartId()
        const productId = button.parentElement.querySelector('.pid').value

        const productQuantity =
          button.parentElement.querySelector('.quantity-product').value

        if (productQuantity <= 0 || isNaN(productQuantity)) {
          throw new Error('La cantidad del producto debe ser mayor a 0')
        }

        const body = { quantity: parseInt(productQuantity) }
        fetch(`/api/cart/${cartId}/products/${productId}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 403)
                throw new Error(
                  'El usuario no puede agregar productos al carrito'
                )
              else {
                throw new Error(response.message)
              }
            }
            return response.json()
          })
          .then((data) => {
            console.log('Respuesta:', data)
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.message,
            })
          })
      } catch (error) {
        console.error('Error al obtener el ID del carrito:', error)
      }
    })
  })
})

async function getCartId() {
  return fetch('/api/cart/', {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener el ID del carrito')
      }
      return response.json()
    })
    .then((data) => {
      return data.cartId
    })
    .catch((error) => {
      console.error('Error:', error)
      throw error
    })
}
