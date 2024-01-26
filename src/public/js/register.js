const form = document.getElementById('registerForm')
const errorWhileCreatingUser = document.getElementById(
  'error-while-create-user'
)

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const data = new FormData(form)
  const obj = {}
  data.forEach((value, key) => (obj[key] = value))

  fetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace('/views/users')
    } else if (result.status === 404) {
      errorWhileCreatingUser.classList.remove('hidden')
    } else {
      console.log(result)
    }
  })
})
