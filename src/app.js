import express from 'express'
import __dirname from './utils.js'
import productRouter from './routes/product-routes.js'
import cartRouter from './routes/cart-routes.js'
import viewsRouter from './routes/views-router.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import ProductManager from './manager/ProductManager.js'

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`))

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/views', viewsRouter)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.redirect('/views/home')
})

const socketServer = new Server(httpServer)
const productsManager = new ProductManager()

socketServer.on('connection', async (socket) => {

  socket.emit('initial-products', await productsManager.getProducts())
  
  socket.on('new-product', async (product) => {
    const products = await productsManager.addProduct(product)
    socketServer.emit('products', products)
  })
})
