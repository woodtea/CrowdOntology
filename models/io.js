
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
        })

        socket.on('revise',function(msg){
            [type,reply] = reviseMsg(msg);
            socket.emit(type,reply);
        })

        socket.on('recommend',function(msg){
        })

    });
}


function reviseMsg(msg){
/*
 {
     "operation": "create_node" ,
     "user_id": "u1" ,
     //"operationID": "操作的时间" //用来区分操作
     "node": {
     "nodeid": "__front__1",
     "tags": ["人"]
 }
*/
    switch(msg.operation){
        case "create_node":
            break;
        case "delete_node":
            break;
        case "revise_node":
            break;

        case "create_relation":
            break;
        case "delete_relation":
            break;
        case "revise_relation":
            break;
    }

}

module.exports = ioConfig;