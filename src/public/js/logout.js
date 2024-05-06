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
    userElement.classList.add(
      'w-full',
      'flex',
      'items-center',
      'justify-between',
      'mt-2'
    )

    userElement.innerHTML = `<input type="hidden" class="user-id" value=${
      user._id
    } /> <p class="mt-2 w-1/5 text-center text-gray-700 font-semibold">${
      user.firstName
    } ${
      user.lastName
    }</p> <br /> <p class="w-1/5 text-center text-gray-700 font-semibold">${
      user.email
    }</p>  <br / > <p class="w-1/5 text-center text-gray-700 font-semibold">${capitalizeFirstLetter(
      user.role
    )}</p> <p class="w-1/5 text-center text-gray-700 font-semibold">${
      user.age
    }</p> <div class='w-1/5 flex items-center justify-center'>
    <button type="button" class='edit-user-btn px-3 cursor-pointer'><svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
        class='icon icon-tabler icons-tabler-outline icon-tabler-edit'
      ><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path
          d='M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1'
        /><path
          d='M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z'
        /><path d='M16 5l3 3' /></svg></button>
    <button type="button" class='delete-user-btn px-3 cursor-pointer'><svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
        class='icon icon-tabler icons-tabler-outline icon-tabler-trash'
      ><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path
          d='M4 7l16 0'
        /><path d='M10 11l0 6' /><path d='M14 11l0 6' /><path
          d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12'
        /><path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' /></svg></button>
  </div>`

    usersContainer.appendChild(userElement)
  })

  const editUserButtons = document.querySelectorAll('.edit-user-btn')
  const deleteUserButtons = document.querySelectorAll('.delete-user-btn')

  editUserButtons.forEach((button) => {
    const id =
      button.parentElement.parentElement.querySelector('.user-id').value
    button.addEventListener('click', async () => {
      Swal.fire({
        title: 'Actualizar rol de usuario',
        input: 'text',
        text: 'Ingresa el nuevo rol del usuario. Valores posibles "user" o "premium"',
        inputValidator: (value) => {
          return (
            (!value ||
              (value.toLowerCase() !== 'user' &&
                value.toLowerCase() !== 'premium')) &&
            'Debe ingresar un rol de usuario valido'
          )
        },
        allowOutsideClick: false,
      }).then((result) => {
        let newRole = result.value
        if (newRole) {
          newRole = newRole.toLowerCase()
          const body = { role: newRole }
          fetch(`/api/users/update-user/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(response)
              }
              return response.json()
            })
            .then(() => {
              Swal.fire({
                title: 'El rol del usuario fue actualizado con exito',
                toast: true,
                showConfirmButton: false,
                position: 'top-end',
                timer: 1000,
              }).then(() => {
                window.location.replace('/views/profile')
              })
            })
            .catch((error) => {
              Swal.fire({
                title:
                  'Ocurrio un error al intentar actualizar el rol del usuario',
                toast: true,
                position: 'top-end',
              })
            })
        }
      })
    })
  })

  deleteUserButtons.forEach((button) => {
    const id =
      button.parentElement.parentElement.querySelector('.user-id').value
    button.addEventListener('click', async () => {
      fetch(`/api/users/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response)
          }
          return response.json()
        })
        .then(() => {
          Swal.fire({
            title: 'El usuario fue eliminado con exito',
            toast: true,
            showConfirmButton: false,
            position: 'top-end',
            timer: 1000,
          }).then(() => {
            window.location.replace('/views/profile')
          })
        })
        .catch(() => {
          Swal.fire({
            title: 'Ocurrio un error al intentar eliminar el usuario',
            toast: true,
            position: 'top-end',
          })
        })
    })
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
