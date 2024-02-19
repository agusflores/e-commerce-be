const redirectButton = document.getElementById('redirectButton')

redirectButton.addEventListener('click', () => {
  console.log('hola')
  window.location.href = 'http://localhost:8080/views/users/login'
})
