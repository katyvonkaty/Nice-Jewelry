require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const findOrCreate = require("mongoose-findorcreate");


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
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/reviews",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


app.get("/", function(req, res) {
  res.render("index")
})

app.get("/auth/google",
  passport.authenticate("google", {scope: ["profile"] })
)

app.get("/auth/google/reviews",
    passport.authenticate( 'google', {
      failureRedirect: '/login' }),
      function(req,res) {
        res.redirect('/reviews')
      }
);


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

app.get("/login", function(req, res) {
  res.render("login")
})

app.get("/register", function(req, res) {
  res.render("register")
})

app.get("/reviews", function(req, res) {
    if(req.isAuthenticated()) {
      res.render("reviews")
    } else {
      res.redirect("/login")
    }
})

// app.post("/register", function(req, res) {
//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//     const newUser = new User({
//       email: req.body.email,
//       password: hash
//     });
//
//     newUser.save(function(err) {
//       if (err) {
//         console.log(err)
//       } else {
//         res.render("reviews", {
//           username: newUser.email
//         })
//       }
//     });
//   })
// });

app.get("/submit", function(req,res){

})

app.get("/logout", function(req,res) {
  req.logout();
  res.redirect("/")
})

app.post("/register", function(req,res){
  User.register({username:req.body.username}, req.body.password, function(err,user) {
    if(err){
      console.log(err);
      res.redirect("/register")
    } else {
      passport.authenticate("local") (req,res, function(){
        res.redirect("/reviews")

      })
    }
  })
})



app.post("/login", function(req,res) {
  const user = new User({
    username: req.body.username,
    password: req.body.passport
  })

  req.login(user, function(err) {
    if(err) {
      console.log(err)
    } else {
      passport.authenticate("local") (req,res,function(){
        res.render("reviews", {username: user.username})
      })
    }
  })
})

// TODO: should be redirect but trying to surface username


app.listen(process.env.PORT || 3000, function() {
  console.log("all systems go")
})
