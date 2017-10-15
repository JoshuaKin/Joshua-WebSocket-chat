/**
 * app.js
 */
/*构建http服务*/
var app = require('http').createServer()
/*引入socket.io*/
var io = require('socket.io')(app);
/*定义监听端口，可以自定义，端口不要被占用*/
var PORT = 8081;
/*用户数组替代数据库*/
var users = [];
/*监听端口*/
app.listen(PORT);
/**
 *监听客户端连接
 *io是我们定义的服务端的socket
 *回调函数里面的socket是本次连接的客户端socket
 *io与socket是一对多的关系
 */
io.on('connection', function(socket) {
    /*所有的监听on，与发送emit都得写在连接里面，包括断开连接*/
    /*是否是新用户标识*/
    var isNewPerson = true;
    var userName = null;
    /*当前登录用户*/
    socket.on('login', function(data) {
        // var recived_Message=JSON.parse(data);
        // console.log(data.userName);
        for (var i = 0; i < users.length; i++) {
            if (users[i].userName == data.userName) {
                isNewPerson = false;
                break;
            } else {
                isNewPerson = true;
            };
        };
        if (isNewPerson) {
            userName = data.userName;
            users.push({ userName: data.userName });
            // console.log(users)
            // /*登录成功*/
            socket.emit('loginSuccess', data);
            /*向所有连接的客户端广播add事件*/
            io.sockets.emit('add', data)
        } else {
            /*登录失败*/
            socket.emit('loginFail', '')
        };
    });
    /*发送消息*/
    socket.on('sendMessage', function(data) {
        io.sockets.emit('receiveMessage', data);
    })
    /*退出登陆*/
    socket.on('disconnect', function() {
        /*向所有连接的客户端广播leave事件*/
        io.sockets.emit('leave', userName);
        users.map(function(data, index) {
            if (data.userName == userName) {
                users.splice(index, 1);
            };
        });
    })
});
console.log('app listen at' + PORT);