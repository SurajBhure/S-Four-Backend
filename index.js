const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('./db')
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
const productRouter = require('./routes/product.route')

const env = require('./config/envConfig')
// console.log(env);
const PORT = env.PORT || 3007

const app = express()
app.use(cors())

app.use(bodyParser.json())
//or
// app.use(express.json());

//-----checking with response -----------//
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to learn react" });
// });

//use routes we use app.use
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/products', productRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
