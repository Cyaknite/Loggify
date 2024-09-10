const express = require("express");
const app = express();
const ejs = require("ejs");
const fs = require("fs");
const session = require("express-session");

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "random",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  try {
    res.locals.data = fs.readdirSync("./files");
  } catch (err) {
    res.send("Some error occured");
  }
  res.render("index");
});

app.post("/changed", (req, res) => {
  fs.renameSync(`./files/${req.session.title}`, `./files/${req.body.title}`);
  fs.writeFileSync(`./files/${req.body.title}`, req.body.content);
  res.render("changed");
});

app.get("/view_n_edit/:fileName", (req, res) => {
  res.locals.title = req.params.fileName;
  req.session.title = `${req.params.fileName}`;
  res.locals.content = fs.readFileSync(`./files/${req.params.fileName}`);
  res.render("view_n_edit");
});

app.post("/makeFile", (req, res) => {
  fs.writeFileSync(`./files/${req.body.title}`, req.body.content, "UTF-8");
  res.render("created");
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/delete/:fileName", (req, res) => {
  fs.unlinkSync(`./files/${req.params.fileName}`);
  res.render("deleted");
});

app.listen(8080, () => {
  console.log("The server has started");
});
