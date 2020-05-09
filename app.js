const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParse = require('cookie-parser');
const bodyParse = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
require('./config/passport')(passport);
const app = express();

app.engine('hbs', exphbs({

  extname: '.hbs'
}));
app.set('view engine', 'handlebars');

app.use(morgan('dev'));
app.use(cookieParse());
app.use(bodyParse.urlencoded({
  extended: true
}));

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(session({
  secret: 'justasecret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/router')(app, passport);

// Errors => page not found 404
app.use((req, res, next) =>  {
  var err = new Error('Page not found');
  err.status = 404;
  next(err);
})

// Handling errors (send them to the client)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
})

module.exports = app;