
var data = require('./data');
var db = require('./db');

var server_config = {
    passwd:"",
    address:"localhost:7687"
};
var DataManager = require('./dm');
var dm = new DataManager(server_config);
console.log(dm);

function ioConfig(server){

    var io = require('socket.io')(server);

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.emit('data',db)

        socket.on('disconnect',function(){
            console.log('user disconnected');
        })

        socket.on('save model',function(msg){
            //console.log("save model")
            //console.log(msg);
            db["instance_model"][msg.user] = msg.instance_model;
            //data.instance_model = msg.instance_model;
            //socket.emit('chat message',msg)
            console.log(db);
        })

        socket.on('get',function(msg){
        })

        socket.on('revise',function(msg){
            [type,reply] = reviseMsg(msg);
            socket.emit(type,reply);
        })

        socket.on('recommend',function(msg){
        })
        
        socket.on('iotest',function(msg){
            console.log(msg);
            msg0 = {
                operation:'init'
            };
            msg1 = {
                operation: 'create_user',
                operation_id: 'opt1',
                name: 'wahaha'
            };
            msg2 = {
                operation: 'create_project',
                operation_id: 'opt2',
                name: '西游记'
            };
            msg3 = {
                operation: 'mcreate_node',
                user_id : 'wahaha',
                project_id : '西游记',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: '',
                        tag : 'Value',
                        value : 'date'
                    }
                ]
            }
            msg4 = {
                operation: 'mcreate_relation',
                user_id : 'wahaha',
                project_id : '西游记',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        value: '姓名',
                        roles:[
                            {role_name : '',
                            node_id : 96},
                            {role_name : '姓名',
                            node_id : 41}
                        ]
                    }
                ]
            }
            reply = dm.handle(msg4, function(rep){
                console.log('[CALLBACK]')
                console.log(rep);
            });
            socket.emit('iotest_back', 'reply');
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