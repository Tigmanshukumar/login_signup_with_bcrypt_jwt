const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get('/404', (req, res) => {
  res.render('404');   
});

app.get('/success', (req, res) => {
  res.render('success');   
});

app.post("/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.redirect("/404");  }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        res.redirect("success");
    })
});

app.post("/signup", (req, res) => {
  let { username, password, email } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        password: hash,
        email,
      });
      res.send(createdUser);
    });
  });





});

app.listen(3000);
