const myQuery = require("./db/db")
let {
    staticPath
} = require("../util/common")
const {
    static
} = require("express")



// 热门搜索关键词
function hot() {
    return async (req, res) => {
        // 查询search表   返回search_text
        let [err, data] = await myQuery(`select search_text from search`)
        err ? res.send({
            code: 201,
            msg: "查询错误"
        }) : res.send({
            code: 200,
            msg: "成功",
            result: {
                data
            }
        })
        err ? res.send({
            code: 201,
            msg: "查询错误"
        }) : res.send({
            code: 200,
            mag: "成功",
            result: {
                data
            }
        })
    }
}


// 轮播图
function banner() {
    return async (req, res) => {
        let [err, doc] = await myQuery(`select concat ('${staticPath}',coverimg)coverimg from banner`)
        res.send({
            code: 200,
            msg: "成功",
            result: {
                data: doc
            }
        })
        console.log(doc);

        // console.log({code:200,msg:"成功",result:{data:doc}});

    }
}


// 猜你喜欢
function like() {
    return async (req, res) => {
        let [err, data] = await myQuery(`select concat ('${staticPath}',image_url)image_url,goods_name,goods_price,goods_id from goods_list order by rand() limit 20`)
        err ? res.send({
            code: 201,
            msg: "查询错误"
        }) : res.send({
            code: 200,
            msg: "成功",
            result: {
                data
            }
        })
    }
}


// 人气好货
function popularity() {
    return async (req, res) => {
        // 查询goods_eval(商品评论列表) 返回 评论总条数，星级评分总数，商品id；根据goods_id来分组，根据星级评分总数排序，返回8条
        let [err, dataArr] = await myQuery(`select count(*) count,sum(eval_start)evalStartSum,goods_id from goods_eval group by goods_id order by evalStartSum desc limit 8`)
        await Promise.all(dataArr.map(async item => {
            // 根据goods_eval返回的商品id值，查找goods_list,返回image_url,goods_name；
            let [err, [obj]] = await myQuery(`select goods_name,concat('${staticPath}',image_url)image_url from goods_list where goods_list.goods_id = '${item.goods_id}'`)
            // 合并对象
            Object.assign(item, obj)
        }))
        res.send({
            code: 200,
            msg: "成功",
            result: {
                data: dataArr
            }
        })
    }
}

// 排行榜
function ranking() {
    return async (req, res) => {
        // 链表查询goods_eval和goods_list;
        // 返回：星级总数，三级id
        // 条件: goods_id相同；分组：三级id分组；排序 星级总数排序；限制：4 
        let [err, dataArr] = await myQuery(`select sum(eval_start) evalNum,thired_id from goods_eval join goods_list on goods_list.goods_id = goods_eval.goods_id group by goods_list.thired_id order by evalNum desc limit 4`)
        await Promise.all(dataArr.map(async item => {
            // 根据三级id查找三级name
            let [, [{
                thired_name
            }]] = await myQuery(`select thired_name from category_thired where category_thired.thired_id ='${item.thired_id}'`)
            // 商品详情：goods_name,image_url,goods_price ；条件：三级id相同返回前三条值；
            let [, goodslist] = await myQuery(`select goods_price, goods_name,concat('${staticPath}',image_url)image_url from goods_list where goods_list.thired_id = '${item.thired_id}' limit 3`)

            item.thired_name = thired_name;
            item.goodslist = goodslist;
        }))
        res.send({
            code: 200,
            msg: "成功",
            result: {
                data: dataArr
            }
        })
    }
}


//各大板块
function home() {
    return async (req, res) => {
        // 返回值：second_id,big_title,small_title,image_url,second_name 
        // 查询条件：second_id
        // 表：home，category_second
        let [err, dataArr] = await myQuery(`
        select home.second_id,home.big_title,home.small_title,
        concat('${staticPath}',home.image_url)image_url,category_second.second_name
        from home join category_second 
        on home.second_id = category_second.second_id
        `)
        await Promise.all(dataArr.map(async item => {
            // 返回值：thired_name,thired_id
            // 查询条件：second_id
            // 表:category_thired
            let [, thirdList] = await myQuery(`
            select thired_name,thired_id 
            from category_thired
            where category_thired.second_id = '${item.second_id}'
            `)
            // 返回值：goods_id,goods_name,goods_manufacturer，iamge_url
            // 查询条件：second_id  返回4条
            // 表：goods_list
            let [err, goodslist] = await myQuery(`
                select goods_id,goods_name,goods_manufacturer,
                concat('${staticPath}',image_url) image_url
                from goods_list
                where goods_list.second_id = '${item.second_id}'
                limit 4
                `)
            item.thirdList = thirdList
            item.goodslist = goodslist
        }))
        res.send({
            code: 200,
            msg: "成功",
            result: {
                data: dataArr
            }
        })


    }
}

// 限时秒杀
// function flash(){
//     return async(req,res)=>{
//         // 查询flash_sale  的flash_id  ，根据flash_id来分组 
//        // 根据flash_sale返回的flash_id值，查找flash_product,返回flash_id，goods_id，根据flash_id来分组 ；
//        // 根据flash_product返回的flash_id值，查找goods_list
//       // 返回  image_url，goods_name,goods_price,assem_price ,goods_id

//     //   flash_id可以分组  goods_id不可


//         let  [err,dataArr] = await myQuery(`select goods_id,flash_id from flash_product`)
//         // console.log(dataArr);
//         await Promise.all(dataArr.map(async item=>{
//             let [,[obj]] = await myQuery(`select goods_name,goods_price,assem_price, concat('${staticPath}',image_url)image_url from goods_list where goods_list.goods_id = '${item.goods_id}'`)

//             Object.assign(item,obj)
//         }))
//         res.send({code:200,msg:"成功",result:{data:dataArr}})

//     }
// }

// ---------------------------------------------------------
async function getFlash() {
    let [err, rows] = await myQuery(`
    SELECT a.id,a.flash_id,b.goods_id,CONCAT('${staticPath}',c.image_url) as image_url,c.goods_name,c.goods_price,c.assem_price FROM flash_sale as a 
    INNER JOIN flash_product as b ON a.flash_id = b.flash_id
    INNER JOIN goods_list as c ON b.goods_id = c.goods_id
    `);
    // console.log(err)
    // console.log(rows)
    if (err) return err;
    else {
        let data = [];
        rows.forEach(row => {
            let flag = false; //默认为false，表示data数组里面没有和rows数组相同id的数据
            data.forEach(item => {
                if (item.id == row.id) {
                    flag = true
                }
            })
            if (flag == false) {
                data.push(row)
            }
        })
        /*
        [
        { '8015e8de-d52d-457d-86f4-6e0c129b1ad2': [] },
        { '6c547d64-5432-46d1-b08b-a24c87e330cf': [] }
        ]
        */
        data = data.map(item => {
            let tmp = {}
            tmp[item.flash_id] = [];
            return tmp;
        })
        data.forEach(item => {
            // Object.keys(obj);获取obj对象里面所有的key，一个对象可能不止一个key，所以这是一个数组
            // Object.values(obj);获取obj对象里面所有的value，一个对象可能不止一个value，所以这是一个数组
            let flash_id = Object.keys(item)[0];
            rows.forEach(row => {
                if (row.flash_id == flash_id) {
                    item[flash_id].push(row)
                }
            })
        })

        let currHour = (new Date()).getHours();
        data[0]['time'] = currHour
        data[1]['time'] = currHour + 1

        return data
    };
}

function flash() {
    return async (req, res) => {
        let rst = await getFlash();
        if (rst.length > 0) {
            res.json({
                code: 200,
                msg: '成功',
                result: {
                    data: rst
                }
            })
        } else {
            res.json({
                code: 201,
                msg: '查询失败',
                result: {
                    reason: rst.message
                }
            })
        }
    }
}



module.exports = {
    banner,
    like,
    popularity,
    ranking,
    hot,
    flash,
    home
}