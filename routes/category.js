var express = require('express');
var router = express.Router();
let {first,second,third,goodslist} = require("../model/category")





router.get("/first",first())
router.get("/second",second())
router.get("/third",third())
router.get("/goodslist",goodslist())





module.exports = router