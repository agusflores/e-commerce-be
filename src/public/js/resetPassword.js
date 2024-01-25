const form = document.getElementById('resetPasswordForm')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const data = new FormData(form)
  const obj = {}
  data.forEach((value, key) => (obj[key] = value))

  fetch('/api/users/reset-password', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    console.log(result)
    if (result.status === 200) {
      window.location.replace('/views/users')
    } else {
      console.log('Error al restaurar contraseña')
    }
  })
})
