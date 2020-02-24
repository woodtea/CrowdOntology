var express = require('express');
var router = express.Router();
var request = require('request');
var User = require('../models/user');

var server_config = require('../server_config.json');
var DataManager = require('../models/dm');
var dm = new DataManager(server_config);

/* GET home page. */
router.get('/', function(req, res, next) {
    if(checkSignIn(req,res)) {
        res.redirect('/user');
    }
    res.redirect('/signin');
});

/* GET Signin page. */
router.get('/signin', function(req, res, next) {
    let token = req.query.token;
    if (!token)
    {
        let [success,error] = getAlertMsg(req);
        res.render('signin', {
            title: 'SingIn',
            success:success,
            error:error
        });
    }
    else//带token情况，为统一平台返回
    {
        console.log("request>>>>>>>>>>")
        request(
            `http://passport.pintu.fun/check_token?token=${token}&t=${new Date().getTime()}`,
            function (error, response, data) {

                if (!error && response.statusCode === 200) {
                    console.log("back2>>>>>>>>>>>>>>>>>>>>>>>")
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.error === 0) {
                        console.log("back22>>>>>>>>>>>>>>>>>>>>>>>")
                        let userId = data.username;
                        if (!userId) {
                            console.log("nouserid>>>>>>>>>>>")
                            res.redirect(`http://passport.pintu.fun/login?redirectUrl=${req.headers.host + req.originalUrl}`);
                            return;
                        }
                        console.log("userid:"+userId)
                        req.session.user =   {
                            mail:userId
                        }
                        let msg = {
                            operation: 'get_user',
                            operation_id: '',
                            name: userId
                        };
                        dm.handle(msg, function(rep){
                            console.log(rep)
                            console.log("back3>>>>>>>>>>>>>>>>>>>>>>>")
                            if(rep.user_id != -1){//平台返回账号已在数据库中存在
                                req.session['success'] = 'SignUp Success';
                                res.redirect('/user');
                            }else{
                                let msg = {
                                    operation: 'create_user',
                                    operation_id: '',
                                    name: userId
                                };
                                console.log("back4>>>>>>>>>>>>>>>>>>>>>>>")
                                dm.handle(msg, function(rep){
                                    console.log(rep)
                                    res.redirect('/user');
                                });
                            }
                        });
                    } else {
                        // token 验证失败，重新去 passport 登录。
                        console.log("back3>>>>>>>>>>>>>>>>>>>>>>>")
                        res.redirect(`http://passport.pintu.fun/login?redirectUrl=${req.headers.host + req.originalUrl}`);
                    }
                } else {
                    res.redirect(`http:/passport.pintu.fun/login?redirectUrl=${req.headers.host + req.originalUrl}`);
                }
            });
    }

});

router.post('/signin', function(req, res, next) {
    console.log(req.body)
    console.log("login>>>>>>>>>>>>>>>>>>>>>>")
    if(req.body.method=="1")
    {
        res.redirect(`http://passport.pintu.fun/login?redirectUrl=${req.headers.host + req.originalUrl}`);
    }
    else
    {
        let msg = {
            operation: 'get_user',
            operation_id: '',
            name: req.body.mail
        };
        dm.handle(msg, function(rep){
            console.log(rep)
            if(rep.user_id != -1){
                req.session.user = {
                    mail:req.body.mail  //for test
                }
                req.session['success'] = 'SignUp Success';
                res.redirect('/user');
            }else{
                req.session['error'] = 'User not found';
                res.redirect('/signin');
            }
        });
    }

});

router.get('/signout', function(req, res, next) {
    delete req.session.user;
    res.redirect('/signin');
});

router.get('/workspace/:project', function(req, res, next) {
    if(checkSignIn(req,res)){
        res.render('workspace',{
            title:"Workspace",
            project:req.params.project,
            "user":{
                "mail":req.session.user.mail    //Forest
            }
        });
    }
});

router.get('/signup', function(req, res, next) {
    let [success,error] = getAlertMsg(req);
    res.render('signup', {
        title: 'SingUp',
        success:success,
        error:error
    });
});

router.post('/signup', function(req, res, next) {

    // 检查密码
    if (req.body['password-repeat'] != req.body['password']) {
        req.session['error'] = 'The two passwords you entered do not match';
        return res.redirect('/signup');
    }

    var regexPW = /^.{6,40}$/;

    if (!regexPW.exec(req.body['password'])) {
        req.session['error'] = 'Password length no less than 6 and no more than 40 characters';
        return res.redirect('/signup');
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
                "mail":req.session.user.mail,    //Forest
                "name":req.session.user.mail.split("@")[0]
            }
        });
    }
});

module.exports = router;


function checkSignIn(req,res){
    if(req.session.user) return true;
    else{
        var os=require('os');
        var platform=os.platform();
        if(platform == 'darwin'){
            //for test
            req.session.user = {
                mail:"user1@mail"
            }
            return true;
        }
        else{
            req.session['error'] = 'User is not signed in ';
            res.redirect('/signin');
            return false;
        }
    }
}

function getAlertMsg(req){
    let success = req.session.success;
    delete req.session.success;
    let error = req.session.error;
    delete req.session.error;

    return [success,error];
}

