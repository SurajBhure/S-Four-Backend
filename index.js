
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./db");
const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");
const paymentRouter = require("./routes/payment.route")

const env = require('./config/envConfig')


const app = express();

app.use(cors());

// stripe webhook
app.post(
  "/api/webhook",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "x-access-token,x-refresh-token");
  next();
});

//add middleware
app.use(bodyParser.json());

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

app.use("/api", userRouter);// for user
app.use("/api", categoryRouter); // for create category
app.use("/api",productRouter) // for create products
app.use("/api",paymentRouter) // for payment 
 
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
