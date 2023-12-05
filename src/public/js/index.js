import { randomUUID } from 'crypto'

const socket = io()
console.log(socket.id);
const listProducts = document.getElementById('list-products')
const addProductButton = document.getElementById('add-product')

addProductButton.addEventListener('click', () => {

  const newProduct = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseInt(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    thumbnail: document.getElementById('thumbnail').value,
    category: document.getElementById('category').value,
    id: randomUUID(),
    status: true,
  }

  socket.emit('new-product', newProduct)
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
