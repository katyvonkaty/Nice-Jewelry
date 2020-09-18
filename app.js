const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
})

const userSchema = {
  username: String,
  password: String
}

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res) {
  res.render("index")
})

app.get("/register", function(req, res) {
  res.render("shop")
})

app.get("/shop", function(req, res) {
  res.render("shop")
})

app.get("/reviews", function(req, res) {
  res.render("reviews")
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.post("/login", function(req, res) {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if(err) {
      console.log(err)
    } else {
      res.render("shop")
    }
  });
});

app.post("/register", function(req,res){
  // const username =
})


app.listen(process.env.PORT || 3000, function() {
  console.log("all systems go")
})
