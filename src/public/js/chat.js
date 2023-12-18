const socket = io()
let user = ''

Swal.fire({
  title: 'Iniciar sesion',
  input: 'text',
  text: 'Ingresa tu correo electronico para identificarte en el chat',
  inputValidator: (value) => {
    return !value && 'Debes ingresar un correo electronico'
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value
  socket.emit('new-user', user)
})

const chatInput = document.getElementById('chat-input')

chatInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const message = chatInput.value
    if (message.trim().length > 0) {
      socket.emit('chat-message', {
        user: user,
        message: message,
      })
      chatInput.value = ''
    }
  }
})

const messagesPanel = document.getElementById('messages-panel')

socket.on('messages', (data) => {
  let messages = ''
  data.forEach((message) => {
    messages += `<b>${message.user}:</b></br>${message.message}</br>`
  })
  messagesPanel.innerHTML = messages
})

socket.on('new-user', (username) => {
  Swal.fire({
    title: `${username} se ha conectado al chat`,
    toast: true,
    position: 'top-end',
  })
})
