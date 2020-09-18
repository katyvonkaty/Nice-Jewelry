const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
})

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "This is not a real website";
userSchema.plugin(encrypt, {secret:secret}, {encryptedFields:["password"]})

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res) {
  res.render("index")
})

app.get("/register", function(req, res) {
  res.render("shop")
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

app.get("/reviews", function(req, res) {
  res.render("reviews")
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.post("/login", function(req, res) {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  newUser.save(function(err) {
    if(err) {
      console.log(err)
    } else {
      res.redirect("shop")
    }
  });
});

app.post("/register", function(req,res){
  // const username =
})


app.listen(process.env.PORT || 3000, function() {
  console.log("all systems go")
})
