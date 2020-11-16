const myQuery =require("./db/db")
let { staticPath } = require("../util/common")

function first(){
    return async (req,res)=>{
        let [err, dataArr] = await myQuery('select first_id,first_name from category_first');
        res.send({code:200,msg:"成功",result:{data:dataArr}})
    }
}

function second(){
    return async (req,res)=>{
        // console.log(req.query);
        let { first_id } = req.query
      let [err,dataArr] = await myQuery(`
      select second_id,second_name 
      from category_second 
      where category_second.first_id = '${first_id}'
      `)  
      res.send({code:200,msg:"成功",result:{data:dataArr}})
}
}

function third(){
    return async (req,res)=>{
        let {second_id} = req.query;
        let [err,dataArr] = await myQuery(`
        select thired_id,thired_name from category_thired 
        where category_thired.second_id = '${second_id}'
        `)
        res.send({code:200,msg:"成功",result:{data:dataArr}})
    }
}


// 根据third_id查询商品详情
function goodslist(){
    return async (req,res)=>{
        let {third_id,page=1} = req.query;
        //  返回值：first_id,second_id,thired_id,goods_id,goods_name,goods_price，image_url
        //  查询条件：third_id
        //  表:goods_list;  limit (分页)
        let [err,dataArr]= await myQuery(`
        select first_id,second_id,thired_id,goods_id,goods_name,goods_price,concat('${staticPath}',image_url)image_url
        from goods_list
        where goods_list.thired_id = '${third_id}'
        limit ${(page-1)*20},20
        `)
        await Promise.all(dataArr.map(async item=>{
            // 返回值：指定商品的评论数
            // 查询条件：goods_id
            // 表：goods_eval
            let [err,[{evalNum}]] = await myQuery(`
            select count(*) evalNum
            from goods_eval
            where goods_eval.goods_id = '${item.goods_id}'
            `)
            // console.log(item);
            // console.log(evalNum);

            item.evalNum = evalNum;
        }))
        res.send({code:200,msg:"成功",result:{data:dataArr}})
        // console.log(dataArr);
        
    }
}






module.exports = {
    first,
    second,
    third,
    goodslist
}