const form = document.getElementById('resetPasswordForm')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const data = new FormData(form)
  const obj = {}
  data.forEach((value, key) => (obj[key] = value))

  fetch('/api/users/resetPassword', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    console.log(result)
    if (result.status === 200) {
      console.log('Contraseña restaurada')
    } else {
      console.log('Error al restaurar contraseña')
    }
  })
})
