const express = require("express");
const bodyParser = require("body-parser");
require("./db");
const PORT = 3007;

const app = express();
app.use(bodyParser.json());
//or
// app.use(express.json());
app.use("/", require("./routes/user.route"));

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});