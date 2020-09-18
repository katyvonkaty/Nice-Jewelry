const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", function(req,res){
  res.render("index")
})


app.listen(process.env.PORT || 3000, function(){
  console.log("all systems go")
})
