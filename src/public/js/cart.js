const checkoutButton = document.getElementById('checkout-btn')

checkoutButton.addEventListener('click', () => {
  fetch('/api/cart/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(() => {
    window.location.replace('/views/profile')
  })
})
