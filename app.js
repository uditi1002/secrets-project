//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var encrypt = require('mongoose-encryption');

dotenv.config({path: "secrets.env"});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
mongoose.connect(process.env.URL);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.KEY, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);

app.route("/")

    .get( async (req, res) => {
        res.render("home");
    });

app.route("/login")

    .get( async (req, res) => {
        res.render("login");
    })

    .post( async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}).exec()
            .then((foundUser) => {
                if (foundUser){
                    if (foundUser.password === password){
                        res.render("secrets");
                    }
                }
            })
            .catch(err => res.send(err));
    });

app.route("/register")

    .get( async (req, res) => {
        res.render("register");
    })

    .post( async (req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save()
            .then(() => res.render("secrets"))
            .catch(err => console.log(err));
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });