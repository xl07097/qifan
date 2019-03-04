var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var fileStreamRotator = require("file-stream-rotator");

var index = require('./routes/index');
var users = require('./routes/users');
var cook = require('./routes/cook');
var video = require('./routes/video');
var topics = require('./routes/topics');
var personals = require('./routes/personals');
var personalOther = require('./routes/personalOther');
var search = require('./routes/search');
var follows = require('./routes/follow');
var jpage = require('./routes/jpage');
var edit = require('./routes/edit');


var app = express();
var logDir = path.join(__dirname, 'logs');
fs.existsSync(logDir) || fs.mkdirSync(logDir);
// create a rotating write stream
var accessLogStream = fileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDir, 'log-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});
logger.format('xueliang', '[:date[iso]] ":method :url" :status :response-time ms - :res[content-length] ":referrer"');
//:remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(cookieParser());

//session 配置
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: {maxAge: 60 * 1000},
    resave: false,
    saveUninitialized: true
}));

// 设置模板全局常量,可以使用
app.locals = {
    title: '七饭',
    description: '菜谱类web应用',
    lastURL: ""
};

// 配置响应中的全局变量,每个响应模板都可以直接访问user和isLogin变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.isLogin = req.session.isLogin;
    next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//=====================日志
// app.use(logger('dev'));
app.use(logger('xueliang', {stream: accessLogStream}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//注意:路由必须放到 session设置,res.locals设置后面,否则session和local无效
app.use('/', index);
app.use('/users', users);
app.use('/cook', cook);
app.use('/video', video);
app.use('/topics', topics);
app.use('/personals', personals);
app.use('/personalOther', personalOther);
app.use('/search', search);
app.use('/follow', follows);
app.use('/jpage', jpage);
app.use('/edit', edit);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//全局变量
global.PUBLIC_PATH = __dirname + '/public/';
module.exports = app;
