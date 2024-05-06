const logoutButton = document.getElementById('logout-button')
const userRole = document.getElementById('user-role').value
const usersContainer = document.getElementById('users-container')
document.addEventListener('DOMContentLoaded', async () => {
  if (userRole === 'admin') {
    document.getElementById('adminView').style.display = 'block'
  } else {
    document.getElementById('adminView').style.display = 'none'
  }
  const users = await getUsers()
  users.forEach((user) => {
    const userElement = document.createElement('div')
    const buttonsElement = document.createElement('div')
    userElement.classList.add(
      'w-2/4',
      'flex',
      'items-center',
      'justify-between',
      'gap-2',
      'mt-2'
    )
    userElement.innerHTML = `<p class="text-gray-700 font-semibold text-center">${
      user.fullName
    }</p> <br /> <p class="text-gray-700 font-semibold text-center">${
      user.email
    }</p> <br / > <p class="text-gray-700 font-semibold text-center">${capitalizeFirstLetter(
      user.role
    )}</p>`
    usersContainer.appendChild(userElement)
    usersContainer.appendChild(buttonsElement)
  })
})

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

async function getUsers() {
  return fetch('/api/users/no-current', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((result) => {
      return result.json()
    })
    .then((data) => {
      return data.users
    })
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
