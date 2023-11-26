import express from 'express'
import __dirname from './utils.js'
import productRouter from './routes/product-routes.js'
import cartRouter from './routes/cart-routes.js'

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`))

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)

