var express = require('express');
var router = express.Router();
let {code,register,login}=require("../model/user")



// 创建了验证码的接口
router.get("/captcha",code())
// 创建了验证码注册的接口
router.post("/register",register())
// 创建了登录的接口
router.post("/login",login())



module.exports = router;


// mvc  m 数据  v 视图  c 路由
// mvvm
