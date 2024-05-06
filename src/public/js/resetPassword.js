const form = document.getElementById('resetPasswordForm')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const confirmPasswordInput = document.getElementById('password-confirm')
const wrongEmail = document.getElementById('wrong-email-text')
const passwordDoesntMatch = document.getElementById(
  'password-doesnt-match-text'
)

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let hasError = false
  const data = new FormData(form)
  const obj = {}
  data.forEach((value, key) => (obj[key] = value))

  if (!validateEmail(obj.email)) {
    emailInput.classList.add('border-red-500')
    wrongEmail.classList.remove('hidden')
    hasError = true
  }

  if (obj.password !== obj.passwordConfirm) {
    passwordInput.classList.add('border-red-500')
    confirmPasswordInput.classList.add('border-red-500')
    passwordDoesntMatch.classList.remove('hidden')
    hasError = true
  }

  if (hasError) return

  fetch('/api/users/reset-password', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace('/views/users/login')
    } else {
      console.log('Error al restaurar contraseña')
    }
  })
})

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

emailInput.addEventListener('focus', () => {
  if (emailInput.classList.contains('border-red-500')) {
    emailInput.classList.remove('border-red-500')
    emailInput.value = ''
    wrongEmail.classList.add('hidden')
  }
})

passwordInput.addEventListener('focus', () => {
  if (passwordInput.classList.contains('border-red-500')) {
    passwordInput.classList.remove('border-red-500')
    passwordInput.value = ''
    confirmPasswordInput.classList.remove('border-red-500')
    confirmPasswordInput.value = ''
    passwordDoesntMatch.classList.add('hidden')
  }
})
