var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var weixin = require('./routes/weixin');
var app = express();
app.use(express.query());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/weixin',weixin);
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

//var wechat = require('wechat');
//var config = {
//  token : 'weixin',
//  appid : 'wxd1a4191ffd46822a',
//  encodingAESKey : 'eVv1VuViXDkytc0OLE8xlS1HStZ6W450nuvh7bWBMrv',
//  checkSignature: true
//};
//
//app.use(express.query());
//app.use('/', wechat(config, function(req, res, next) {
//  // 微信输入信息都在req.weixin上
//  var message = req.weixin;
//  console.log('log mao:', message);
//
//  if (message.Content === 'diaosi') {
//    // 回复屌丝(普通回复)
//    res.reply('hehe');
//  } else if (message.Content === 'text') {
//    console.log('log text');
//    // 你也可以这样回复text类型的信息
//    res.reply({
//      content : 'text object',
//      type : 'text'
//    });
//  } else if (message.Content === 'hehe') {
//    // 回复一段音乐
//    res.reply({
//      type : "music",
//      content : {
//        title : "来段音乐吧",
//        description : "一无所有",
//        musicUrl : "http://mp3.com/xx.mp3",
//        hqMusicUrl : "http://mp3.com/xx.mp3",
//        thumbMediaId : "thisThumbMediaId"
//      }
//    });
//  } else {
//    // 回复高富帅(图文回复)
//    res.reply([ {
//      title : '你来我家接我吧',
//      description : '这是女神与高富帅之间的对话',
//      picurl : 'https://www.baidu.com/img/bd_logo1.png',
//      url : 'https://www.baidu.com/'
//    } ]);
//  }
//}));



module.exports = app;
