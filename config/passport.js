var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {
  passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  connection.query("SELECT * FROM users WHERE id = ? ", [id], function(err, rows){
    done(err, rows[0]);
  });
});

passport.use(
  'list-user',
  new LocalStrategy({
    usernameField : 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    connection.query("SELECT * FROM users", function(err, result, field) {
      if (err) throw err;
      console.log(result);
    });
  })
),

passport.use(
  'local-signup',
  new LocalStrategy({
    usernameField : 'username',
    passwordField: 'password',
    passReqToCallback: true
  },

  function(req, username, password, done){
   connection.query("SELECT * FROM users WHERE username = ? ", 
   [username], function(err, rows){
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('signupMessage', 'That is already taken'));
    }else{
     var newUserMysql = {
      username: username,
      password: bcrypt.hashSync(password, null, null)
     };

    var insertQuery = "INSERT INTO users (username, password) values (?, ?)";

    connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
      function(err, rows){
       newUserMysql.id = rows.insertId;

       return done(null, newUserMysql);
      });
    }
   });
  })
 );

passport.use(
  'local-login',
  new LocalStrategy({
    usernameField : 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT * FROM users WHERE username = ? ", [username],
   function(err, rows){
    if(err)
     return done(err);
    if(!rows.length){
     return done(null, false, req.flash('loginMessage', 'No User Found'));
    }
    if(!bcrypt.compareSync(password, rows[0].password))
     return done(null, false, req.flash('loginMessage', 'Wrong Password'));

    return done(null, rows[0]);
   });
  })
 );
};

//  -----------------------------------------------------------------------

passport.use(
  'Add',
  new LocalStrategy({
    tenskField : 'tensk',
    noitochucField: 'noitochuc',
    thoigianField: 'thoigian',
    passReqToCallback: true
  },

  function(req, tensk, noitochuc, thoigian, done){
   connection.query("SELECT * FROM event WHERE tensk = ? ", 
   [tensk], function(err, rows){
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('AddMessage', 'That is already taken'));
    }else{
     var newEventMysql = {
      tensk: tensk,
      noitochuc: noitochuc,
      thoigian: bcrypt.hashSync(thoigian, null, null),
     };

    var insertQuery = "INSERT INTO event (tensk, noitochuc, thoigian) values (?, ?, ?)";

    connection.query(insertQuery, [newEventMysql.tensk, newEventMysql.noitochuc, newEventMysql.thoigian],
      function(err, rows){
       newEventMysql.id = rows.insertId;

       return done(null, newEventMysql);
      });
    }
   });
  })
 );
};
