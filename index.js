const express = require("express");
const bodyParser = require("body-parser");
require("./db");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
// const orderRouter = require("./routes/order.route");

const env = require("./config/envConfig");
// console.log(env);
const PORT = env.PORT || 3007;

const app = express();

app.use(bodyParser.json());
//or
// app.use(express.json());

//-----checking with response -----------//
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to learn react" });
// });

//use routes we use app.use
app.use("/api", userRouter);

//products api
app.use("/api/product", productRouter);

//order api
// app.use("/api/oder", orderRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
