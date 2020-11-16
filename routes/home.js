var express = require('express');
var router = express.Router();
let {banner,like, popularity,ranking,hot,flash,home}=require("../model/home")




router.get("/banner",banner())
router.get("/like",like())
router.get("/popularity",popularity())
router.get("/ranking",ranking())
router.get("/hot",hot())
router.get("/flash",flash())
router.get("/home",home())





module.exports = router;


// mvc  m 数据  v 视图  c 路由
// mvvm