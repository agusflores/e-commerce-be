const logoutButton = document.getElementById('logout-button')

logoutButton.addEventListener('click', () => {
  fetch('/api/users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    if (result.status === 200) {
      localStorage.removeItem('token')
      window.location.replace('/views/users/login')
    }
  })
})
