const User = require('../models/user');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


module.exports = (app) => {
    app.get("/login", (req, res) => {
        res.render('login');

    });
    app.post("/login", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ username }, "username password")
          .then(user => {
              if (!user) {
                  return res.status(401).send({ message: "Incorrect Username or Password." });
              }
            //   Check Password
            User.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    return res.status(401).send({ message: "Incorrect Username or Password" });
                }
                // Create a token
                const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                    expiresIn: "60 Days."
                });
                // Set a cookie and redirect to the root
                res.cookie("nToken", token, { maxAge: 900000, httponly: true });
                res.redirect('/');
            });
          })
          .catch(err => {
              console.log(err);
          });
        });
        app.get('/sign-up', (req, res) => {
            res.sender('sign-up');
        });
    // sign up form
    app.post("/sign-up", (req, res) => {
        // Create user
        const user = new User(req.body);
        user
        .save()
        .then(user => {
            var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 Days." });
            res.cookie("nToken", token, { maxAge: 900000, httponly: true });
            res.redirect('/')
        })
        .catch(err => {
            console.log(err.message);
            return res.status(400).send({ err: err });
        });
    });
    app.get('logout', (req, res) => {
        res.clearCookie('nToken');
        res.redirect('/');
    });
}