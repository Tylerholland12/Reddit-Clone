const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// Use "main" as our default layout
app.engine('handlebars', exphbs({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render
app.set('view engine', 'handlebars');

// Tell our app to send the "hello world" message to our home page
app.get('/', (req, res) => {
  res.render('layouts/main', { msg: 'Handlebars are Cool!' });
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})