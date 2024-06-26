import express from 'express'
import __dirname from './utils.js'
import productRouter from './routes/product-routes.js'
import cartRouter from './routes/cart-routes.js'
import viewsRouter from './routes/views-router.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import messageModel from './models/message.model.js'
import productModel from './models/product.model.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { userRouter } from './routes/session-routes.js'
import inicializePassport from './config/passport.config.js'
import passport from 'passport'
import { mockRouter } from './routes/mock-routes.js'
import { addLogger } from './config/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const PORT = 8080
const app = express()
const MONGO =
  'mongodb+srv://agustinflores1505:tUreQzQk6yGuuN55@cluster0.2gugbsj.mongodb.net/e-commerce?retryWrites=true&w=majority'
const connection = mongoose.connect(MONGO)

app.use(
  session({
    store: new MongoStore({
      mongoUrl: MONGO,
    }),
    secret: '1234',
    resave: false,
    saveUninitialized: false,
  })
)

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion de E-commerce BE',
      description: 'Documentacion de la API de E-commerce BE con Swagger',
    },
  },
  apis: [`${__dirname}/docs/**/*.yalm`],
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

inicializePassport()

app.use(addLogger)

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`))

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/views', viewsRouter)
app.use('/api/users', userRouter)
app.use('/mock', mockRouter)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.redirect('/views/users/login')
})

app.get('/logger-test', async (req, res) => {
  req.logger.debug('This is a debug message')
  req.logger.http('This is a http message')
  req.logger.info('This is an info message')
  req.logger.warn('This is a warning message')
  req.logger.error('This is an error message')
  req.logger.fatal('This is a fatal message')
  res.status(200).json({ status: 'success', message: 'Check the logs' })
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
