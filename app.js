require("dotenv").config();
const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;

const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.json());
app.use("/image", express.static("public/uploads"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const helper = require("./helpers");
// welcome
const { User } = require("./models/");
app.get("/", async (req, res) => {
  try {
    const { nickname } = req.body;
    const fileName = "home.ejs";
    const emailUser = {
      name: nickname,
    };
    let html = await helper.getHtml(fileName, emailUser);
    return res.send(html);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message,
      data: null,
    });
  }
});

const routes = require("./routes");
app.use("/", routes);
app.set("view engine", "ejs");

app.use(function (err, req, res, next) {
  res.status(500).json({
    status: false,
    message: err.message,
    data: null,
  });
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
