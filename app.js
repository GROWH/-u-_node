var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session")

// 引入路由
var usersRouter = require('./routes/users');
var homeRouter = require("./routes/home")
var categoryRouter = require("./routes/category")
var goodsRouter = require("./routes/goods")



var app = express();

// 读取ejs文件
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.all("*",(req,res,next)=>{
  res.set("Access-Control-Allow-Origin", req.headers['origin']);
  // 允许跨域的时候携带session
  res.set('Access-Control-Allow-Credentials', 'true');
  next()
})

app.use(logger('dev'));
//解析post请求
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//使用cookie
app.use(cookieParser());
//读取静态文件
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 3,
  }
}))


//使用路由
app.use('/user', usersRouter);
app.use("/api",homeRouter)
app.use("/api",categoryRouter)
app.use("/api",goodsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
