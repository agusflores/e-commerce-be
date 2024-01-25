const form = document.getElementById('loginForm')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const data = new FormData(form)
  const obj = {}
  data.forEach((value, key) => (obj[key] = value))
  if (obj.email === '' || obj.password === '') {
    return alert('Datos incompletos')
  }

  fetch('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace('/views/users')
    } else {
      console.log(result)
    }
  })
})
