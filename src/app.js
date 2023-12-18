import express from 'express'
import __dirname from './utils.js'
import productRouter from './routes/product-routes.js'
import cartRouter from './routes/cart-routes.js'
import viewsRouter from './routes/views-router.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import messageModel from './dao/models/message.model.js'
import productModel from './dao/models/product.model.js'

const PORT = 8080
const app = express()
const MONGO =
  'mongodb+srv://agustinflores1505:tUreQzQk6yGuuN55@cluster0.2gugbsj.mongodb.net/e-commerce?retryWrites=true&w=majority'

const connection = mongoose.connect(MONGO)

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
const products = await productModel.find()

socketServer.on('connection', async (socket) => {
  socket.emit('initial-products', products)
  socket.on('new-product', async (product) => {
    await productModel.create(product)
    const products = await productModel.find()
    socketServer.emit('products', products)
  })

  socket.on('chat-message', async (data) => {
    await messageModel.create(data)
    const messages = await messageModel.find()
    socketServer.emit('messages', messages)
  })

  socket.on('new-user', async (username) => {
    const messages = await messageModel.find()
    socket.emit('messages', messages)
    socket.broadcast.emit('new-user', username)
  })
})
