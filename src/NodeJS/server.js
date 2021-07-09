
// var express=require('express');
// var app=express();

// app.get('/',function(req,res){
// 	res.send('Hello World');
// });

// var server=app.listen('8081',function(){
// 	var host=server.address().address
// 	var port=server.address().port
// 	console.log("应用实例，访问地址为http://%s:%s",host,port)
// })



// app.listen('8083',function(){
// 	console.log('app listening on 8081')
// })


var express = require('express');
var app = express();
var sql = require('mssql');
var router = express.Router();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

  router.get('/user', function (req, res) {
//app.get('/user', function (req, res) {
    sql.connect("mssql://dbsfc:foxconn@10.98.7.211:1433/SMT_SFC").then(function () {
        new sql.Request()
            .input('userid', 'ST44')
            .query("select PROCESSNAME from SFC_PRODUCT_PROCESS where PROCESSID=@userid").then(function (data) {
                res.send(data.recordset);
            }).catch(function (err) {
                console.log(err);
            });
        // Stored Procedure
    }).catch(function (err) {
        console.log(err);
    })
})


app.listen('8083', function () {
    console.log('app listening on 8083')
})


// var express=require('express');
// var app=express(); 
// var sql = require('mssql');
// //连接方式："mssql://用户名:密码@ip地址:1433(默认端口号)/数据库名称"
// sql.connect("mssql://dbsfc:foxconn@10.98.7.211:1433/SMT_SFC").then(function() {
//     // Query
//     new sql.Request().query('select * from SFC_PRODUCT_PROCESS').then(function(recordset) {
//         console.log(recordset);
//     }).catch(function(err) {
//        console.log(err);
//     });
//     // Stored Procedure
// }).catch(function(err) {
//     console.log(err);
// })



/**
 * Created by Administrator on 2015/8/28.
 */ 