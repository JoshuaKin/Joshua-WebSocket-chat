/*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/
var socket = io('ws://localhost:3389');
/*定义用户名*/
var uname = null;
var loginBtn = document.getElementById('login-btn');
/*登陆*/
loginBtn.onclick = function() {
    uname = joshuaJs.delSpace(document.getElementById('loginName').value, 2);
    if (uname) {
        /*向服务端发送登录事件*/
        // uname={userName:uname};
        // var send_Message=JSON.stringify(uname);
        // socket.emit('login', send_Message)
        socket.emit('login', { userName: uname })
    } else {
        alert('请输入昵称')
    }
};
/*发送消息*/
document.getElementById('send-btn').onclick = function() {
    sendMessage();
};
joshuaJs.getW().onkeydown = function(event) {
    if (event.keyCode == 13) {
        sendMessage()
    };
};
/*登陆成功*/
socket.on('loginSuccess', function(data) {
    if (data.userName == uname) {
        checkin(data);
    } else {
        alert('用户名不匹配,请重试');
    };
});
/*登录失败*/
socket.on('loginFail', function() {
    alert('昵称重复');
});
/*新人加入提示*/
socket.on('add', function(data) {
    var newHtml = document.createElement("p");
    joshuaJs.innerText(newHtml, '系统消息:' + data.userName + '已加入群聊')
    document.getElementById('chatDiv').append(newHtml);
    var newBr = document.createElement("br")
    document.getElementById('chatDiv').append(newBr);
});
/*接收消息*/
socket.on('receiveMessage', function(data) {
    showMessage(data);
})
/*退出群聊提示*/
socket.on('leave', function(userName) {
    if (userName != null) {
        var newHtml = document.createElement("p");
        joshuaJs.innerText(newHtml, '系统消息:' + userName + '已退出群聊')
        document.getElementById('chatDiv').append(newHtml);
        var newBr = document.createElement("br")
        document.getElementById('chatDiv').append(newBr);
    }
});
/*隐藏登录界面 显示聊天界面*/
var checkin = function(data) {
    joshuaJs.hide(document.getElementById('login-wrap'));
    joshuaJs.show(document.getElementById('chat-wrap'));
};
/*发送消息*/
var sendMessage = function() {
    var message = document.getElementById('send-txt').value;
    message = joshuaJs.delSpace(message, 2);
    if (message) {
        socket.emit('sendMessage', { userName: uname, message: message });
    };
};
/*显示消息*/
var showMessage = function(data) {
    var newDiv = document.createElement('div')
    if (data.userName == uname) {
        newDiv.className = 'chat-item item-right clearfix';
        var newSpan1 = document.createElement('span');
        newSpan1.className = 'img fr';
        newDiv.append(newSpan1);
        var newSpan2 = document.createElement('span');
        newSpan2.className = 'message fr';
        joshuaJs.innerText(newSpan2, data.message);
        newDiv.append(newSpan2);
    } else {
        newDiv.className = 'chat-item item-left clearfix rela';
        var newSpan1 = document.createElement('span');
        newSpan1.className = 'abs uname';
        joshuaJs.innerText(newSpan1, data.userName);
        newDiv.append(newSpan1);
        var newSpan2 = document.createElement('span');
        newSpan2.className = 'img fl';
        newDiv.append(newSpan2);
        var newSpan3 = document.createElement('span');
        newSpan3.className = 'fl message';
        joshuaJs.innerText(newSpan3, data.message);
        newDiv.append(newSpan3);
    };
    document.getElementById('chatDiv').append(newDiv);
};
