var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
    if(checkSignIn(req,res)) {
        res.redirect('/user');
    }
    //res.redirect('/signin');
    //res.render('login',{title:"login"});
});

/* GET Signin page. */
router.get('/signin', function(req, res, next) {
    res.render('signin', {
        title: 'SingIn'
    });
});

router.post('/signin', function(req, res, next) {

    //console.log(req.body.mail)
    req.session.user = {
        mail:req.body.mail  //for test
    }

    console.log("ll");

    let user = User.get(req.body.mail);

    if (!user) {
        var newUser = new User({
            password: req.body.password,
            mail: req.body.mail
        });
        newUser.save();
    }
    res.redirect('/user');
});

router.get('/signout', function(req, res, next) {
    delete req.session.user;
    res.redirect('/signin');
});

router.get('/workspace', function(req, res, next) {
    if(checkSignIn(req,res)){
        res.render('workspace',{
            title:"Workspace",
            "user":{
                "mail":req.session.user.mail    //Forest
            }
        });
    }
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'SingUp' });
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About' });
});

router.get('/help', function(req, res, next) {
    res.render('help', { title: 'Help' });
});

router.get('/user', function(req, res, next) {
    if(checkSignIn(req,res)){
        res.render('user', {
            title: 'User',
            "user":{
                "mail":req.session.user.mail    //Forest
            }
        });
    }
});

module.exports = router;


function checkSignIn(req,res){
    if(req.session.user) return true;
    else{
        req.session.user = {
            mail: "123@123"
        }
        return true;
        res.redirect('/signin');
        return false;
    }
}

