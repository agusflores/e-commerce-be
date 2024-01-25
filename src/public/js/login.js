const form = document.getElementById('loginForm')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const wrongPassword = document.getElementById('wrong-password-text')
const wrongEmail = document.getElementById('wrong-email-text')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let hasError = false
  const data = new FormData(form)
  const obj = {}
  data.forEach((value, key) => (obj[key] = value))

  if (obj.email === '' || !validateEmail(obj.email)) {
    emailInput.classList.add('border-red-500')
    wrongEmail.classList.remove('hidden')
    hasError = true
  }

  if (obj.password === '') {
    passwordInput.classList.add('border-red-500')
    wrongPassword.classList.remove('hidden')
    hasError = true
  }

  if (hasError) return

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

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
