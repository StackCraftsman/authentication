//jshint esversion:6

//Hashing//
//Password -> Hash Function -> Hash

//Salting//
//Password -> 28891(salt) -> Hash Function -> Hash

//Salt Rounds// (2 Round) (2 kademeli yaptık)
//Password -> 548796(salt) -> Hash Function -> Hash --> 548797(salt) -> Hash Function -> Hash

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//27017 -> mongodb için default port
mongoose.connect("mongodb://localhost/userDB", { useUnifiedTopology: true, useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash,
      //password: md5(req.body.password),
    });

    ////(eski kodun sonucu) -> with save method automatically mongoose encrpyt the password field////
    newUser.save((err) => {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  //const password = md5(req.body.password); //hash değerleri registertakiyle aynı

  ////(eski kodun sonucu) -> with save method automatically mongoose decrypt the password field////
  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      res.send(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          result ? res.render("secrets") : res.send("password is wrong");
        });
      }
    }
  });
});

app.post("/logout", (req, res) => {});

app.post("/submit", (req, res) => {});

const port = 3000;
app.listen(port, () => {
  console.log("Server started on port 3000");
});
