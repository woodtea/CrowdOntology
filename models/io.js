
var data = require('./data');


function ioConfig(server){

    var io = require('socket.io')(server);

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.emit('data',data)

        socket.on('disconnect',function(){
            console.log('user disconnected');
        })

        socket.on('save model',function(msg){
            data.instance_model = msg.instance_model;
            //socket.emit('chat message',msg)
        })

        socket.on('get',function(msg){
            data.instance_model = msg.instance_model;
        })

        socket.on('revise',function(msg){
            data.instance_model = msg.instance_model;
        })

        socket.on('recommend',function(msg){
            data.instance_model = msg.instance_model;
        })

    });
}

module.exports = ioConfig;