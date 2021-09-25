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
    });

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
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) {
      res.send(err);
    } else {
      if (foundUser) {
        //return true or false
        bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
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
