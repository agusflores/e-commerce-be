const form = document.getElementById('registerForm')
const errorWhileCreatingUser = document.getElementById(
  'error-while-create-user'
)

let resultOk = false

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const data = new FormData(form)
  const obj = {}
  data.forEach((value, key) => (obj[key] = value))
  console.log(obj);
  fetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((result) => {
      if (result.status === 200) {
        resultOk = true
        return result.text()
      } else {
        errorWhileCreatingUser.classList.remove('hidden')
      }
    })
    .then((token) => {
      if (resultOk) {
        localStorage.setItem('token', token)
        window.location.replace('/views/profile')
      }
    })
})
