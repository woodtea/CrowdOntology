const express = require('express');
//var engine = require('ejs-locals'); //新加
const partials = require('express-partials'); //可以使用layout
const path = require('path');
const favicon = require('serve-favicon');
const loggerAccess = require('morgan');
const fs = require('fs');
const FileStreamRotator = require('file-stream-rotator');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const session = require('express-session');

const app = express();

//app.engine('ejs', engine); //新加

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(loggerAccess('dev'));
//var accessLogStream = fs.createWriteStream(__dirname+'/access.log',{flags:'a'});//创建一个写入流
var accessLogDirectory=__dirname+'/logs/access'; //每日创建一个日志文件
fs.existsSync(accessLogDirectory)||fs.mkdirSync(accessLogDirectory);
var accessLogStream=FileStreamRotator.getStream({
    filename:accessLogDirectory+'/access-%DATE%.log',
    frequency:'daily',
    verbose:false
})
app.use(loggerAccess('combined',{stream:accessLogStream}));//将链接日志写入文件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'secret_meteoric', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 7*24*60*60*1000}
}));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
