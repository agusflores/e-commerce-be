document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn')

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', async () => {
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
            throw new Error(response)
          }
          return response.json()
        })
        .then(() => {
          Swal.fire({
            title: 'El producto fue agregado al carrito',
            toast: true,
            position: 'top-end',
          })
        })
        .catch((error) => {
          Swal.fire({
            title: 'Ocurrio un error al agregar el producto al carrito',
            toast: true,
            position: 'center',
          })
        })
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
