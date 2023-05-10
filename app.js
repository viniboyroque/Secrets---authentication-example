//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

//MONGOOSE COLLECTIONS AND DOCUMENTS//////
const userSchema = new mongoose.Schema({
    email: String,
    password: String
  
  });
  


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);



/////////////////////////////////////////

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post ("/register", function(req, res) {

    const email = req.body.userName;
    const password = req.body.password;
  
    const user = new User({ 
      email: email,
      password: password
    });
    user.save().then(function () {
        res.render("secrets");
        
      })
      .catch(function (err) {
        console.log(err);
      });
  });

app.post ("/login", function(req, res) {

    const email = req.body.userName;
    const password = req.body.password;

    User.findOne({email: email}).then(function (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        res.render("login");
      }
    }).catch(function (err) {
      console.log(err);
    });
  });



app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000.");
    
  });