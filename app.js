require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// keep
// const bcrypt = require("bcrypt");
// const saltRounds = 3;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(session({
  secret:"cockapoos are my life blood",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
})

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema)


app.get("/", function(req, res) {
  res.render("index")
})

app.get("/about", function(req, res) {
  res.render("about")
})

app.get("/shop", function(req, res) {
  res.render("shop")
})

app.get("/gift", function(req, res) {
  res.render("gift")
})

app.get("/404", function(req, res) {
  res.render("404")
})


app.get("/reviews", function(req, res) {
  res.render("reviews")
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.get("/register", function(req, res) {
  res.render("register")
})

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.email,
      password: hash
    });

    newUser.save(function(err) {
      if (err) {
        console.log(err)
      } else {
        res.render("reviews", {
          username: newUser.email
        })
      }
    });
  })
});

app.post("/login", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email
  }, function(err, foundUser) {
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("reviews", {
              username: email
            });
          } else {
            res.redirect("404")
            console.log(foundUser.password)
          }
        });
      };
    };
  })
});


app.listen(process.env.PORT || 3000, function() {
  console.log("all systems go")
})
