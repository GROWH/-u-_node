const svgCaptcha = require("svg-captcha")
const myQuery =require("./db/db")
const bcrypt = require("bcryptjs")
const uid = require("uuid")["v1"]   // 根据时间戳生成一个uid


function code(){
    return function(req,res){  

        let options = {
            noise:2,
            color:true,
            background:"#ccc",
            width:100,
            height:38
        }
        var captcha = svgCaptcha.create(options) 
        req.session.captcha = captcha.text
        // console.log(captcha);
        res.type("svg");
        res.send(captcha.data)
      }
}


function register(){
    return async (req,res)=>{
        // console.log(req.body);     
        let {uname,pwd,code} = req.body;
        // console.log(req.session)
        let {captcha} = req.session;
        // console.log(captcha);
        // console.log(await myQuery(`insert into admin (username,password) values ('${uname}','${pwd}')`)); 
        
      if(!uname||!pwd) {
        res.send({code:1,msg:"用户名或密码不能为空"})
      }else if(code.toUpperCase()!=captcha.toUpperCase()){
        res.send({code:1,msg:"验证码不正确"})
      }else{
         // 生成加密规则（不需要你改）
        let salt = await bcrypt.genSalt(10);
         // 将密码生成hash密码（密码加密完成）；只需要修改第一个参数，填前端传过来的密码；
        let hash = await bcrypt.hash(pwd,salt)
        // 里面插入数据库的密码就变成了上面生成的hash值
        let [err, doc] = await myQuery(`insert into member (uid,username,password,createdate) values ('${uid()}','${uname}','${hash}','${new Date().getTime()}')`);
        if(err){
          // req.session.uname=uname;
          // req.session.pwd = pwd;
          // console.log(req.session)
          console.log(err);
          
          res.send({code:1,msg:"注册失败"})
        }else{
          res.send({code:0,msg:"注册成功"})
        }
      
      } 
        
      }
}

function login(){
    return async (req,res)=>{
        // console.log(req.session);
      
        
       let {uname,pwd,code} = req.body;
      //  let {uname:username,pwd:password,captcha} = req.session;
       let {captcha} = req.session;
      let [err, doc] = await myQuery(`select * from member where username='${uname}'`);
      // console.log(await myQuery(`insert into admin (username,password) values ('${uname}','${pwd}')`)); 
      // console.log(doc);
      
      if(err){
        res.send({code:1,msg:"登录失败"})
      }
      
      if(!uname || !pwd){
           res.send({code:1,msg:"用户名或者密码不能为空"})
       }else if(code.toUpperCase()!=captcha.toUpperCase()){
        res.send({code:1,msg:"验证码不正确"})
      }else if(!doc.length){
              res.send({code:1,msg:"该用户不存在请先注册"})
      }else{ 
         //  密码解密；第一个参数是前端传入的值；第二个参数是数据库查询的值（数据库中密码）
        let bool = await bcrypt.compare(pwd,(doc[0].password));
          //  if(doc[0].password!==pwd){
          //     res.send({code:1,msg:"密码不正确"})
          // }else{
          //     res.send({code:0,msg:"登录成功"})
          // }
      
          bool? res.send({code:0,msg:"登录成功"}): res.send({code:1,msg:"密码不正确"})
        }
      
      
        
      }
}


module.exports = {code,register,login}