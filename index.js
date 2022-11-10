const express = require("express");
const bodyParser = require("body-parser");
require("./db");
const userRouter = require("./routes/user.route")

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

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
