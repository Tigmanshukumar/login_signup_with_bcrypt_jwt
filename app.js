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
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.redirect("/404");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      res.redirect("/success");
    } else {
      res.redirect("/404");
    }
  } catch (err) {
    res.status(500).send("Login error");
  }
});


app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await userModel.create({ username, password: hash, email });
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error signing up");
  }
});



app.listen(3000);
