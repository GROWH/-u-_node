// 1.引入mysql
const mysql = require("mysql")
const to = require("../../util/awaitTo")

//2.连接的配置信息
let config = {
    host: "127.0.0.1",
    port: '3306',
    user: 'root',
    password: "123456",
    database: 'xiaou'
  }

//3.创建连接
  let connection = mysql.createConnection(config)
// 4. 监听mysql的连接

//   connection.connect((err)=>{
//       console.log(err);
      
//   })


function operator (sqlStr){
    return new Promise((resolve,reject)=>{
      connection.query(sqlStr,(err,doc)=>{
          if(err){
            reject(err)
          }else {
            resolve(doc)
          }
      })
    })
  }
  
  // 只是返回to返回值的返回值
  async function myQuery (sqlStr){
    return await to(operator(sqlStr)) // [err,doc]
  }
  
  
  module.exports = myQuery;