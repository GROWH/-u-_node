let express = require("express")
let router = express.Router()

let {shopwindow} = require("../model/goods")

router.get("/shopwindow",shopwindow())


module.exports = router