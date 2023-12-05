const socket = io()

const listProducts = document.getElementById('list-products')
const addProductButton = document.getElementById('add-product')

addProductButton.addEventListener('click', () => {
  socket.emit('new-product', 'Se ha agregado un nuevo producto')
})

socket.on('products', (products) => {
  let infoProducts = ''
  listProducts.innerHTML = `<ul>`
  products.forEach((p) => {
    console.log(JSON.stringify(p))
    infoProducts += `<li>
        <strong>Id: </strong>${p.id}<br>
        <strong>Titulo: </strong>${p.title}<br>
        <strong>Precio: </strong>${p.price}<br>
        <strong>Descripcion: </strong>${p.description}<br>
        <strong>Categoria: </strong>${p.category}<br>
        </li>`
  })
  infoProducts += `</ul>`
  listProducts.innerHTML = infoProducts
})
