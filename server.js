// Require Libraries
require('dotenv').config();
const express = require('express');
require('./data/reddit-db');
const path = require('path');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


// App Setup
const app = express();
const publicPath = path.join(__dirname, 'public');

// Middleware
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// After Body Parser Init's
app.use(expressValidator());

app.use(cookieParser());

var checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
      req.user = null;
    } else {
      var token = req.cookies.nToken;
      var decodedToken = jwt.decode(token, { complete: true }) || {};
      req.user = decodedToken.payload;
    }
  
    next();
  };
  app.use(checkAuth);

app.use('/', express.static(publicPath));

// Routes
app.get('/', (req, res) => {
    var currentUser = req.user;
    res.render('index', {currentUser})
})

require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);



// Run server on Port 
if (require.main === module) {
    app.listen(process.env.PORT, () => {
        console.log(`Listening at http://localhost:${process.env.PORT}`)
    });
}

module.exports = {app}