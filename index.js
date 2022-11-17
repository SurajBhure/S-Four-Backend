const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('./db')
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')

const env = require('./config/envConfig')

const app = express()

const PORT = env.PORT || 3007
app.use(bodyParser.json())
app.use(cors())

//or
// app.use(express.json());

const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
const productRouter = require('./routes/product.route')
const orderRouter = require('./routes/order.route')

//-----checking with response -----------//
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to learn react" });
// });

//use routes we use app.use
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/products', productRouter)

//products api
app.use('/api/product', productRouter)

//order api
// app.use("/api/oder", orderRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
