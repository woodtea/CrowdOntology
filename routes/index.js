var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/login');
    //res.render('login',{title:"login"});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login',{title:"login"});
});

router.post('/login', function(req, res, next) {
    res.redirect('/workspace');
});

router.get('/workspace', function(req, res, next) {
    res.render('workspace',{title:"workspace","user":{"mail":"yijiang.sei@pku.edu.cn"}});
});

module.exports = router;
