var mysql = require('mysql')

var db = { }

//连接数据库
var pool = mysql.createConnection({
    host:'127.0.0.1',//数据库地址
    user:'root',//mysql认证用户名
    password: '123456',//mysql认证用户密码
    port:'3306',
    database:'testdb'
})

pool.connect( function (err) {
    if(err){
        console.log(err)
        return
    }else{
        console.log('数据库已连接')
    }
} )

//pool.query("CREATE TABLE person(id int, user varchar(255))")

//查询
db.query = function ( userName, callback ) {//这里的pool.query是异步操作
    var res = false

    var checkSql = 'SELECT user from person where user = '+ userName
    var q = pool.query(checkSql,function (err, result) {
        console.log(q.sql)
        if(err){
            console.log('select error: '+err.message)
            return
        }
        //console.log('result: '+result)
        if( result!=0 ){
            res = true
        }
      //  console.log( "res: "+res )
        callback( res )
    })
}

//获取某列长度
db.getUserLength = function () {
    var getLength = 'SELECT count(1) FROM person'
    pool.query(getLength,function (err, result) {
        if(err){
            console.log( 'getLength error: '+err.message )
            return
        }
        console.log('---------------getLength-------------------')
        console.log('getLength ID:',result)
        console.log('-----------------------------------------')
    })
}

db.add = function( userName ){
    var addSql = 'INSERT INTO person(id,user) VALUES(0,?)'
    var addParam = userName
    pool.query(addSql,addParam,function (err,result) {
        if(err){
            console.log( 'insert error: '+err.message )
            return
        }
        console.log('---------------INSERT-------------------')
        console.log('INSERT ID:',result)
        console.log('-----------------------------------------')
    })
}

db.delete = function( userName ){
    var deleteSql = 'DELETE FROM person where user = '+ userName
    pool.query( deleteSql, function (err, result) {
        if(err){
            console.log(err.message)
            return
        }
        console.log('---------------INSERT-------------------')
        console.log('delete ID:',result)
        console.log('-----------------------------------------')
    })

}

module.exports = db