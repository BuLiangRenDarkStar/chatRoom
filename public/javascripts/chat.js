function Chat() {
    this.socket = null
}

Chat.prototype.init = function () {
    var self = this
    this.socket = io.connect()//与服务器建立连接
    this.socket.on( 'connect',function () {//connect事件
        document.getElementById('info').textContent = '输入昵称'
        document.getElementById('nickWrapper').style.display = 'block'
        document.getElementById('nicknameInput').focus()
    } )

    document.getElementById('loginBtn').addEventListener('click', function() {
        var nickName = document.getElementById('nicknameInput').value
        //检查昵称输入框是否为空
        if (nickName.trim().length != 0) {
            self.socket.emit('login', nickName)
        } else {
            //输入框获取焦点，这样用户不必点击它，就能编辑显示的文本了。
            document.getElementById('nicknameInput').focus()
        }
    }, false)

    this.socket.on('nickExisted',function () {
        document.getElementById('info').textContent = "昵称被占用"
    })
    this.socket.on('success',function () {
        document.title = document.getElementById('nicknameInput').value
        document.getElementById('loginWrapper').style.display = 'none'
        document.getElementById('messageInput').focus()
    })

    this.socket.on('system',function (nickname, userNums, status) {
        var message = nickname + ' ' + (status=='login'?'joined':'left')
        self.sendMessage('system',message)
        document.getElementById('status').textContent = userNums + (userNums>1?'users':'user')+ 'online'
    })

    document.getElementById('sendBtn').addEventListener('click',function () {
        var messageInput = document.getElementById('messageInput')
        var message = messageInput.value

        messageInput.value = ''
        messageInput.focus()
        if(message.trim().length!=0){
            self.socket.emit('postMessage', message)
            self.sendMessage('me',message)
        }
    },false)

    this.socket.on('hasNewMessage',function (user,message) {
        self.sendMessage(user,message)
    })
}

Chat.prototype.sendMessage = function (user,message) {
    var container = document.getElementById('historyMsg')
    messageDisplay = document.createElement('p')
    messageDisplay.innerHTML = user + ': '+ message
    container.appendChild(messageDisplay)
    container.scrollTop = container.scrollHeight

}

window.onload = function () {
    var chat = new Chat()
    chat.init()
}