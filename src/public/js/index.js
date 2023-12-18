const socket = io()

const addProductButton = document.getElementById('add-product')

socket.on('initial-products', (products) => {
  renderProducts(products)
})

const renderProducts = (products) => {
  const listProducts = document.getElementById('list-products')
  listProducts.innerHTML = ''
  products.forEach((prod) => {
    const item = document.createElement('li')
    const content = `<strong>Titulo: </strong>${prod.title}<br />
    <strong>Precio: </strong>${prod.price}<br />
    <strong>Descripcion: </strong>${prod.description}<br />
    <strong>Codigo: </strong>${prod.code}<br />
    <strong>Stock: </strong>${prod.stock}<br />
    <strong>Categoria: </strong>${prod.category}<br />
    <br>
    `

    item.innerHTML = content
    listProducts.appendChild(item)
  })
}

addProductButton.addEventListener('click', () => {
  const newProduct = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseInt(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    thumbnail: document.getElementById('thumbnail').value,
    category: document.getElementById('category').value,
    id: crypto.randomUUID(),
    status: true,
  }
  socket.emit('new-product', newProduct)
})

socket.on('products', (products) => {
  let infoProducts = ''
  listProducts.innerHTML = `<ul>`
  products.forEach((p) => {
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
