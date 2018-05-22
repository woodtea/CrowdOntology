var express = require('express');
var router = express.Router();
var User = require('../models/user');

var server_config = require('../server_config.json');
var DataManager = require('../models/dm');
var dm = new DataManager(server_config);

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
        title: 'SingIn',
        success:req.session.success,
        error:req.session.error
    });
});

router.post('/signin', function(req, res, next) {
    //console.log(req.body.mail)
    req.session.user = {
        mail:req.body.mail  //for test
    }

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
    res.render('signup', {
        title: 'SingUp',
        success:req.session.success,
        error:req.session.error
    });
});

router.post('/signup', function(req, res, next) {

    console.log("POST DATA: Sign up");
    console.log(req.session.user);

    console.log(req.body)
    // 检查密码
    if (req.body['password-repeat'] != req.body['password']) {
        req.session['error'] = 'The two passwords you entered do not match';
        return res.redirect('/signup');
    }

    var regexPW = /^.{6,40}$/;

    if (!regexPW.exec(req.body['password'])) {
        req.session['error'] = 'Password length no less than 6 and no more than 40 characters';
        return res.redirect('/reg');
    }

    req.session.user = {
        mail:req.body.mail  //for test
    }

    /*
    let user = User.get(req.body.mail);

    if (!user) {
        var newUser = new User({
            password: req.body.password,
            mail: req.body.mail
        });
        newUser.save();
    }
    */
    let msg = {
        operation: 'create_user',
        operation_id: '',
        name: req.body['mail']
    };
    dm.handle(msg, function(rep){
        console.log(rep)
        req.session['success'] = 'SignUp Success';
        res.redirect('/signin');
    });
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
        req.session['error'] = 'User is not signed in ';
        res.redirect('/signin');
        return false;
    }
}

