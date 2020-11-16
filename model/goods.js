let myQuery = require("./db/db")
let {
    staticPath
} = require("../util/common")


function shopwindow() {
    return async (req, res) => {
        let [err, dataArr] = await myQuery(`
      select win_location.goods_id,goods_list.goods_name,goods_list.goods_price,concat('${staticPath}',goods_list.image_url) image_url
      from win_location join goods_list on win_location.goods_id=goods_list.goods_id
      `)
        res.send({
            code: 200,
            msg: "成功",
            result: {
                data: dataArr
            }
        })
    }
}


module.exports = {
    shopwindow
}