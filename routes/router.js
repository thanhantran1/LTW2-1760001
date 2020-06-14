module.exports = function(app, passport) {
    app.get('/', function(req, res){
     res.render('index.ejs');
    });
   
    app.get('/login', function(req, res){
     res.render('login.ejs', {message:req.flash('loginMessage')});
    });
   
    app.post('/login', passport.authenticate('local-login', {
     successRedirect: '/profile',
     failureRedirect: '/login',
     failureFlash: true
    }),
     function(req, res){
      if(req.body.remember){
       req.session.cookie.maxAge = 1000 * 60 * 3;
      }else{
       req.session.cookie.expires = false;
      }
      res.redirect('/');
     });
   
    app.get('/signup', function(req, res){
     res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
   
    app.post('/signup', passport.authenticate('local-signup', {
     successRedirect: '/profile',
     failureRedirect: '/signup',
     failureFlash: true
    }));
   
    app.get('/profile', isLoggedIn, function(req, res){
     res.render('profile.ejs', {
        successRedirect: '/list',
        failureRedirect: '/profile',
        user:req.user
     });
    });
    
    app.get('/inform', function(req,res){
        res.render('inform.ejs');
    });
    
    app.get('/conference', function (req, res) {

         res.render('conference.ejs', function(connection) {
            var mysql = require('mysql');                         
            connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                passport: "",
                database: "fitness"
            });
            var  sql = "select * from conference";
            connection.query(sql, function(err, result) {
            if (err) throw err;
            res.send({data:result});
        });
        })
    });

    app.get('/list', function(req, res){
        res.render('list.ejs', function(connection) {
            var mysql = require('mysql');
            connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                passport: "",
                database: "fitness"
            });
            var  sql = "SELECT id, username FROM users";
            connection.query(sql, function(err, result) {
            if (err) throw err;
            res.send(result);
        });
        })
    });
   
    app.get('/logout', function(req,res){
     req.logout();
     res.redirect('/login');
    })
   };
   
   function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
     return next();
   
    res.redirect('/');
   };
