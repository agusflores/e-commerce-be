const checkoutButton = document.getElementById('checkout-btn')

checkoutButton.addEventListener('click', () => {
  fetch('/api/cart/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(() => {
    Swal.fire({
      title: 'Se realizó la compra con éxito',
      toast: true,
      showConfirmButton: false,
      position: 'top-end',
      timer: 1000,
    }).then(() => {
      window.location.replace('/views/profile')
    })
  })
})
