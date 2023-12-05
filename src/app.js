import express from 'express'
import __dirname from './utils.js'
import productRouter from './routes/product-routes.js'
import cartRouter from './routes/cart-routes.js'
import viewsRouter from './routes/views-router.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { getProducts } from './routes/views-router.js'
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

socketServer.on('connection', (socket) => {
  socket.on('new-product', async (product) => {
    const products = await getProducts()
    products.push(product)
    socketServer.emit('products', products)
  })
})
