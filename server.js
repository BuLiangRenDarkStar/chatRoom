var http = require("http")
var express = require('express')
var app = express( )
var server = http.createServer(app)
var io = require('socket.io').listen(server)

//var users = [ ]
var db = require("./db")


app.use('/',express.static(__dirname+'/public'))
server.listen(3000)

io.on('connection', function (socket) {
    var usersLength = 0
    socket.on('login', function (nickname) {
       // var userLength = db.getUserLength()

        db.query(nickname,function (existed) {
            console.log("内部existed: "+existed)
            if( existed ){//查询数据库昵称是否已经存在
                socket.emit('nickExisted')
                console.log("existed: "+existed)
            }else{
                // socket.userIndex = users.length
                socket.nickname = nickname
                //  users.push(nickname)
                db.add(nickname)
                socket.emit('success')
                usersLength++
                io.sockets.emit('system', nickname, usersLength, 'login')
            }
        })
    })

    socket.on('disconnect', function () {
        console.log('断开连接')
        //users.splice(socket.userIndex,1)
        db.delete(socket.nickname)
        usersLength--
        socket.broadcast.emit('system', socket.nickname, usersLength, 'logout');
    })

    socket.on('postMessage', function (message) {
        socket.broadcast.emit('hasNewMessage',socket.nickname,message);
    })
})