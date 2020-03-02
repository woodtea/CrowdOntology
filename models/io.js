

var data = require('./data');
var db = require('./db');
var server_config = require('../server_config.json');
var format = require('./format');
var formatExchange = new format();
const logger = require("../logger_config");

var DataManager = require('./dm');
var dm = new DataManager(server_config);
// console.log(dm);
//mcreate_empty_project_with_name("test");
//mcreate_hlm_project();
//mcreate_movie_project_with_name("任意电影");
//mcreate_algorithm_project_with_name("test4");
function ioConfig(server){

    var io = require('socket.io')(server);

    io.on('connection', function(socket) {
        //socket建立连接
        console.log('a user connected');
        //socket.emit('data', db)
        //socket断开连接
        socket.on('disconnect', function () {
            console.log('user disconnected');
        })
        //测试用
        socket.on('save model', function (msg) {
            //console.log("save model")
            //console.log(msg);
            db["instance_model"][msg.user] = msg.instance_model;
            //data.instance_model = msg.instance_model;
            //return socket.emit('chat message',msg)
            //console.log(db);
        })
        socket.on('model', function(msg){
            logger.info(JSON.stringify(msg))
            //console.log(msg);
            let emitMsg;
            switch (msg.operation){
                case 'mget':
                    /*
                    emitMsg = io_get_model(msg,function(emitMsg){
                        return socket.emit('model',emitMsg);
                    });*/
                    dm.handle(msg, function(rep){
                        //console.log("model")
                        //console.log(rep)
                        logger.trace(JSON.stringify(rep))
                        return socket.emit("model",rep);
                    });
                    break;
                case 'mcreate_node':
                    emitMsg = io_create_insModel_node(msg,function(emitMsg){
                        logger.info(JSON.stringify(emitMsg))
                        return socket.emit('model',emitMsg);
                    });
                    break;
                case 'madd_key_attr'://both node and key attribute
                    emitMsg = io_create_model_keyAttr(msg,function(emitMsg){
                        logger.info(JSON.stringify(emitMsg))
                        return socket.emit('model',emitMsg);
                    });
                    break;
                case 'mcreate_relation':
                    emitMsg = io_create_insModel_relation(msg,function(emitMsg){
                        logger.info(JSON.stringify(emitMsg))
                        return socket.emit('model',emitMsg);
                    });
                    break;




            }
        })

        socket.on('insModel', function(msg){
            logger.info(JSON.stringify(msg))
            //console.log(msg);
            let emitMsg;

            switch (msg.operation){
                case 'get':
                    /*
                    emitMsg = io_get_insModel(msg,function(emitMsg){
                        return socket.emit('insModel',emitMsg);
                    });*/
                    //console.log("insModel")
                    dm.handle(msg, function(rep){
                        //console.log(rep)
                        logger.trace(JSON.stringify(rep))
                        return socket.emit("insModel",rep);
                    });
                    break;
                case 'cite_rcmd':
                    console.log("receive>>>>>>>>>>>>>>>>>>")
                    socket.emit('insModel',msg);
                    break;
                case 'create_node':
                    emitMsg = io_create_insModel_node(msg,function(emitMsg){
                        //console.log(emitMsg);
                        logger.info(JSON.stringify(emitMsg))
                        return socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'remove_node':
                    emitMsg = io_remove_insModel_node(msg,function(emitMsg){
                        //console.log(emitMsg);
                        logger.info(JSON.stringify(emitMsg))
                        return socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'create_relation':
                    emitMsg = io_create_insModel_relation(msg,function(emitMsg){
                        //console.log("hhhhhh",emitMsg);
                        logger.info(JSON.stringify(emitMsg))
                        return socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'remove_relation':
                    emitMsg = io_remove_insModel_relation(msg,function(emitMsg){
                        //console.log(emitMsg);
                        logger.info(JSON.stringify(emitMsg))
                        return socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'revise_relation':
                    emitMsg = io_revise_insModel_relation(msg);
                    break;
                case 'rcmd_node':
                    emitMsg = io_recommend_insModel_node(msg);
                    break;
                case 'rcmd_relation':
                    emitMsg = io_recommend_insModel_relation(msg);
                    break;
                case 'rcmd':
                    emitMsg = io_recommend_insModel(msg,function(emitMsg){
                        logger.info(JSON.stringify(emitMsg))
                        return socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'rcmdIndex':
                    dm.handle(msg, function(rep){
                        logger.trace(JSON.stringify(rep))
                        return socket.emit("insModel",rep);
                    });
                    break;
                case 'rcmd_entity':
                    dm.handle(msg, function(rep){
                        //console.log(rep);
                        logger.trace(JSON.stringify(rep))
                        return socket.emit("insModel",rep);
                    });
                    break;
            }
            //console.log(emitMsg);
            //return socket.emit('insModel',emitMsg);
        });

        //先不管。。。我也不知道写的什么
        socket.on('get',function(msg){
        })

        socket.on('revise',function(msg){
            [type,reply] = reviseMsg(msg);
            return socket.emit(type,reply);
        })

        socket.on('recommend',function(msg){
        })

        //just for test
        socket.on('iotest',function(msg){
            //console.log(msg);
            msg0 = {
                operation:'init'
            };
            msg1 = {
                operation: 'create_user',
                operation_id: 'opt1',
                name: '123@123'
            };
            msg1_2 = {
                operation: 'create_user',
                operation_id: 'opt1',
                name: 'user1@mail'
            };
            msg1_3 = {
                operation: 'create_user',
                operation_id: 'opt1',
                name: 'user2@mail'
            };
            msg2 = {
                operation: 'create_project',
                operation_id: 'opt2',
                name: '红楼梦人物关系图谱'
            };
            msg3 = {
                operation: 'mcreate_node',
                user_id : 'user1@mail.com',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: '',
                        tag : 'Entity',
                        value : '人'
                    }
                ]
            };
            msg2_9 = {
                operation: 'mcreate_node',
                user_id : '123@132',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: '',
                        tag : 'Symbol',
                        value : 'String'
                    }
                ]
            };
            msg4 = {
                operation: 'mcreate_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        value: '亲友',
                        roles:[
                            {rolename : '亲友',
                            node_id : 110},
                            {rolename : '亲友',
                            node_id : 110}
                        ]
                    }
                ]
            };
            msg4_1 = {
                operation: 'mcreate_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        value: '性别',
                        roles:[
                            {rolename : '',
                                node_id : 110},
                            {rolename : '性别',
                                node_id : 110}
                        ]
                    }
                ]
            };
            msg4_2 = {
                operation: 'mcreate_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        value: '姓名',
                        roles:[
                            {rolename : '',
                                node_id : 110},
                            {rolename : '姓名',
                                node_id : 110}
                        ]
                    }
                ]
            };
            msg5 = {
                operation: 'mget',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2'
            };
            msg6 = {
                operation: 'create_node',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: '',
                        tags : [110], //tag用id表示
                        value: '西瓜人' //实体的value为空
                    }
                ]
            };
            msg7 = {
                operation: 'create_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        tag: 112, //用tagid表示
                        roles:[{
                            rolename : '',
                            node_id : 252,
                        },
                        {
                            rolename : '兄弟',
                            node_id : 114,
                        }
                        ]
                    }
                ]
            };
            msg8 = {
                operation: 'get',
                user_id : 'user2@mail',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2'
            };
            msg9 = {
                operation: 'remove_node',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes: [
                    162
                ]
            };
            msg10 = {
                operation: 'remove_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations: [
                    164
                ]
            };
            msg11 = {
                operation: 'get_tags',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                node: {
                    value:'冬瓜'
                }
                
            };
            msg12 = {
                operation: 'refer',
                user_id : 'user1@mail',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                node:{
                    front_id: '',
                    refer_id: 14
                }
            };
            msg13 = {
                operation: 'create_node_proxy',
                user_id : 'user2@mail',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: 'front_n人',
                        tags : ["167"], //tag用id表示
                        value: "贾宝玉" //实体的value为空
                    }
                ]
            };
            msg14 = {
                operation: 'create_relation_proxy',
                user_id : 'user2@mail',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        tag: 171, //用tagid表示
                        roles:[{
                            rolename : '',
                            node_id : 174,
                        },
                        {
                            rolename : '姓名',
                            node_id : 176,
                        }
                        ]
                    }
                ]
            };
            msg15 = {
                operation: 'rcmd',
                user_id : 'zhut@pku.edu.cn',
                project_id : '电影人物关系图谱',
                operation_id : 'op2',
                nodes:{
                    143:{//内部信息目前都用不着
                        tags: [],
                        value: ""
                    }
                }
            };

            msg16 = {
                operation: 'get_user',
                operation_id: 'opt1',
                name: '123@12'
            };
            
            msg17 = {
                operation: 'rcmd_entity',
                user_id : 'user1@mail',
                project_id : '电影人物关系图谱',
                operation_id: 'opt2',
                topk: 7
            };
            
            msg18 = {
                operation: 'new_rcmd',
                user_id : 'zhut@pku.edu.cn',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes:{
                    143:{//内部信息目前都用不着
                        tags: [],
                        value: ""
                    }
                }
            };

            msg19 = {
                operation: 'madd_key_attr',
                user_id : 'zhut@pku.edu.cn',
                project_id : '电影人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        id: '667',
                        key_attr_list: ['621']
                    }
                ]
            }

            //initiate Set
            if(msg == "init"){
                init_project();
            }else if(msg=="mcreate_hlm"){
                mcreate_hlm_project();
            }else if(msg=="mcreate_hlm2"){
                mcreate_hlm2_project();
            }else if(msg=="mcreate_movie"){
                mcreate_movie_project();
            }else if(msg=="mcreate_movie_rzdf"){
                mcreate_movie_project_rzdf();
            }else if(msg=="mcreate_movie_dhxy"){
                mcreate_movie_project_with_name("大话西游-电影人物关系图谱");
            }else if(msg=="mcreate_movie_ws"){
                mcreate_movie_project_with_name("无双-电影人物关系图谱-群体");
                mcreate_movie_project_with_name("无双-电影人物关系图谱-yuxiaz");
                mcreate_movie_project_with_name("无双-电影人物关系图谱-symbolk");
                mcreate_movie_project_with_name("无双-电影人物关系图谱-liberion");
                mcreate_movie_project_with_name("无双-电影人物关系图谱-weiyh");
                mcreate_movie_project_with_name("无双-电影人物关系图谱-guojm");
                mcreate_movie_project_with_name("无双-电影人物关系图谱-qiaoxiaohe");
            }else if(msg.substring(0,12)=="mcreate_algo") {
                mcreate_algorithm_project_with_name(msg.substring(12,msg.length));
            }else if(msg.substring(0,13)=="mcreate_empty") {
                mcreate_empty_project_with_name(msg.substring(13,msg.length));
            }else {
                let msgArray = [msg0,msg1,msg2,msg3,msg4,msg5,msg6,msg7,msg8,msg9,msg10,msg11,msg12,msg13,msg14,msg15,msg16, msg17, msg18, msg19];
                dm.handle(msgArray[msg], function(rep){
                    // console.log('[CALLBACK]')
                    // console.log(rep);
                    return socket.emit('iotest_back', rep);
                });
            }
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

function emitMsgHeader(rcvMsg,err,msg){
    let emitMsg = {
        "operation":rcvMsg.operation,
        "user":rcvMsg.user,
        "project": rcvMsg.project, //仅测试使用
        "operationId":rcvMsg.operationId,
        "err":err,
        "msg":msg,
        "migrate":{}
    }
    return emitMsg;
}

function io_create_insModel_node(rcvMsg,callback){

    let newMsg = formatExchange.web2Server(rcvMsg);
    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        // console.log('[CALLBACK]')
        // console.log(rep);
        callback(emitMsg);
    });

    return;
}

function io_create_model_keyAttr(rcvMsg,callback) {
    let newMsg = formatExchange.web2Server(rcvMsg);
    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        // console.log('[CALLBACK]')
        // console.log(rep);
        callback(emitMsg);
    });

    return;
}


function io_remove_insModel_node(rcvMsg,callback){
    let newMsg = formatExchange.web2Server(rcvMsg);

    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        // console.log('[CALLBACK]')
        // console.log(rep);
        callback(emitMsg);
    });

    return;
}

function io_create_insModel_relation(rcvMsg,callback){

    let newMsg = formatExchange.web2Server(rcvMsg);
    //console.log("newmsg here",newMsg);

    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        // console.log('[CALLBACK]')
        // console.log(rep);
        callback(emitMsg);
    });

    return;
}

function io_remove_insModel_relation(rcvMsg,callback){

    let newMsg = formatExchange.web2Server(rcvMsg);

    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        // console.log('[CALLBACK]')
        // console.log(rep);
        callback(emitMsg);
    });

    return;
}


function io_recommend_insModel(rcvMsg,callback){
    let newMsg = formatExchange.web2Server(rcvMsg);
    newMsg.operation = "new_rcmd";  //使用new_rcmd，弃用rcmd
    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.operation = "rcmd";//使用new_rcmd，弃用rcmd
        emitMsg.nodes = rep.nodes;
        emitMsg.relations = rep.relations;
        emitMsg.rcmd_relations = rep.rcmd_relations;
        emitMsg.migrate = rep.migrate;
        // console.log('[CALLBACK]')
        // console.log(rep);
        callback(emitMsg);
    });

    return;
}

function mcreate_user(user){
    let msg = {
        operation: 'create_user',
        operation_id: 'opt0',
        name: user
    };
    return msg;
}

function mcreate_relation(value,roles,project_id){
    let msg = {
        operation: 'mcreate_relation',
        user_id : '123@123',
        project_id : project_id,
        operation_id : 'op0',
        relations:[
            {
                front_id:'frontr_1',
                value: value,
                roles:roles
            }
        ]
    };
    // console.log(msg);
    return msg;
}

function mcreate_node(tag,value,project_id,user_id="user@mail"){
    let msg = {
        operation: 'mcreate_node',
        user_id : user_id,
        project_id : project_id,
        operation_id : 'op0',
        nodes :[
            {
                front_id: '',
                tag : tag,
                value : value
            }
        ]
    };
    return msg;
}

function madd_key_attr(node_id,arrlist,user_id,project_id){
    msg = {
        operation: 'madd_key_attr',
        user_id : user_id,
        project_id : project_id,
        operation_id : 'op0',
        nodes :[
            {
                id: node_id,             //'667',
                key_attr_list: arrlist  //['621']
            }
        ]
    }

    return msg;
}

function init_project(){
    msg0 = {operation:'init'};

    dm.handle(msg0, function(rep) {
        dm.handle(mcreate_user("user@mail"), function (rep) {});
        dm.handle(mcreate_user("user1@mail"), function (rep) {});
        dm.handle(mcreate_user("user2@mail"), function (rep) {});
        dm.handle(mcreate_user("jiangy@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("liby@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("shenn@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("wangp@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("wangxm@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("weiyh@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangyx@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangxy@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhut@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("chuwj@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangzf@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangmy@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangw@sei.pku.edu.cn"), function (rep) {});

        dm.handle(mcreate_user("luoyx@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("guojm@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("qiaoxh@pku.edu.cn"), function (rep) {});
    });
}


function mcreate_hlm_project(){
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: '红楼梦人物关系图谱'
    };
    var humanId,movieId,roleId,symbolId;
    dm.handle(msg1, function(rep) {
        dm.handle(mcreate_node("Entity", "人", "红楼梦人物关系图谱"), function (rep) {
            for (let key in rep.migrate) humanId = rep.migrate[key];
            dm.handle(mcreate_node("Symbol", "String", "红楼梦人物关系图谱"), function (rep) {
                for (let key in rep.migrate) symbolId = rep.migrate[key];
                //创建属性
                dm.handle(mcreate_relation("姓名",rolename1="",rolename2="姓名",id1=humanId,id2=symbolId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("性别",rolename1="",rolename2="性别",id1=humanId,id2=symbolId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("出生日期",rolename1="",rolename2="出生日期",id1=humanId,id2=symbolId,project_id="红楼梦人物关系图谱"),function(rep){});
                //创建关系
                dm.handle(mcreate_relation("父子",rolename1="父亲",rolename2="儿子",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("母子",rolename1="母亲",rolename2="儿子",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("父女",rolename1="父亲",rolename2="女儿",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("母女",rolename1="母亲",rolename2="女儿",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});

                dm.handle(mcreate_relation("夫妻",rolename1="丈夫",rolename2="妻子",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});

                dm.handle(mcreate_relation("公媳",rolename1="公公",rolename2="媳妇",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("婆媳",rolename1="婆婆",rolename2="媳妇",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("翁婿",rolename1="岳父",rolename2="女婿",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("姑婿",rolename1="岳母",rolename2="女婿",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});

                dm.handle(mcreate_relation("兄弟",rolename1="哥哥",rolename2="弟弟",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("兄妹",rolename1="哥哥",rolename2="妹妹",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("姐弟",rolename1="姐姐",rolename2="弟弟",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("姐妹",rolename1="姐姐",rolename2="妹妹",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
            });
        });
    });
    return;
}

function mcreate_hlm2_project(){
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: '红楼梦人物关系图谱'
    };
    var humanId,movieId,roleId,symbolId;
    dm.handle(msg1, function(rep) {
        dm.handle(mcreate_node("Entity", "人", "红楼梦人物关系图谱"), function (rep) {
            for (let key in rep.migrate) humanId = rep.migrate[key];
            dm.handle(mcreate_node("Symbol", "String", "红楼梦人物关系图谱"), function (rep) {
                for (let key in rep.migrate) symbolId = rep.migrate[key];
                //创建属性
                let roles;
                roles = [{rolename : "", node_id : humanId}, {rolename : "姓名", node_id : symbolId}]
                dm.handle(mcreate_relation(value="姓名",roles,project_id="红楼梦人物关系图谱"),function(rep){
                    let relationId;
                    for (let key in rep.migrate) relationId = rep.migrate[key];
                    dm.handle(madd_key_attr(node_id=humanId,[relationId],user_id="",project_id="红楼梦人物关系图谱"),function(rep){});
                });
                roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                dm.handle(mcreate_relation("性别",roles,project_id="红楼梦人物关系图谱"),function(rep){});
                roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                dm.handle(mcreate_relation("出生年份",roles,project_id="红楼梦人物关系图谱"),function(rep){});
                //创建关系
                //夫妻间
                roles = [
                    {rolename : "丈夫", node_id : humanId},
                    {rolename : "妻子", node_id : humanId}
                ]
                dm.handle(mcreate_relation("夫妻", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "丈夫", node_id : humanId},
                    {rolename : "小妾", node_id : humanId}
                ]
                dm.handle(mcreate_relation("夫妾", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                //父子间
                roles = [
                    {rolename : "父亲", node_id : humanId},
                    {rolename : "儿子", node_id : humanId}
                ]
                dm.handle(mcreate_relation("父子", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "母亲", node_id : humanId},
                    {rolename : "儿子", node_id : humanId}
                ]
                dm.handle(mcreate_relation("母子", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "父亲", node_id : humanId},
                    {rolename : "女儿", node_id : humanId}
                ]
                dm.handle(mcreate_relation("父女", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "母亲", node_id : humanId},
                    {rolename : "女儿", node_id : humanId}
                ]
                dm.handle(mcreate_relation("母女", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                //婆媳间
                roles = [
                    {rolename : "公公", node_id : humanId},
                    {rolename : "媳妇", node_id : humanId}
                ]
                dm.handle(mcreate_relation("公媳", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "婆婆", node_id : humanId},
                    {rolename : "媳妇", node_id : humanId}
                ]
                dm.handle(mcreate_relation("婆媳", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "岳父", node_id : humanId},
                    {rolename : "女婿", node_id : humanId}
                ]
                dm.handle(mcreate_relation("翁婿", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "岳母", node_id : humanId},
                    {rolename : "女婿", node_id : humanId}
                ]
                dm.handle(mcreate_relation("姑婿", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                //同辈间
                roles = [
                    {rolename : "哥哥", node_id : humanId},
                    {rolename : "弟弟", node_id : humanId}
                ]
                dm.handle(mcreate_relation("兄弟", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "哥哥", node_id : humanId},
                    {rolename : "妹妹", node_id : humanId}
                ]
                dm.handle(mcreate_relation("兄妹", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "姐姐", node_id : humanId},
                    {rolename : "弟弟", node_id : humanId}
                ]
                dm.handle(mcreate_relation("姐弟", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
                roles = [
                    {rolename : "姐姐", node_id : humanId},
                    {rolename : "妹妹", node_id : humanId}
                ]
                dm.handle(mcreate_relation("姐妹", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});

                roles = [
                    {rolename : "主人", node_id : humanId},
                    {rolename : "奴仆", node_id : humanId}
                ]
                dm.handle(mcreate_relation("主仆", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});

                roles = [
                    {rolename : "主人", node_id : humanId},
                    {rolename : "丫鬟", node_id : humanId}
                ]
                dm.handle(mcreate_relation("主人丫鬟", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});

                roles = [
                    {rolename : "君主", node_id : humanId},
                    {rolename : "臣子", node_id : humanId}
                ]
                dm.handle(mcreate_relation("君臣", roles, project_id = "红楼梦人物关系图谱"), function (rep) {});
            });
        });
    });
    return;
}

function mcreate_movie_project(){
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: '电影人物关系图谱'
    };
    var humanId,movieId,roleId,symbolId;
    dm.handle(msg1, function(rep) {
        dm.handle(mcreate_node("Entity", "人", "电影人物关系图谱"), function (rep) {
            for (let key in rep.migrate) humanId = rep.migrate[key];
            dm.handle(mcreate_node("Entity", "电影", "电影人物关系图谱"), function (rep) {
                for (let key in rep.migrate) movieId = rep.migrate[key];
                dm.handle(mcreate_node("Entity", "电影人物", "电影人物关系图谱"), function (rep) {
                    for (let key in rep.migrate) roleId = rep.migrate[key];
                    dm.handle(mcreate_node("Symbol", "String", "电影人物关系图谱"), function (rep) {
                        for (let key in rep.migrate) symbolId = rep.migrate[key];
                        //创建属性
                        let roles;
                        roles = [{rolename : "", node_id : humanId}, {rolename : "姓名", node_id : symbolId}]
                        dm.handle(mcreate_relation(value="姓名",roles,project_id="电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=humanId,[relationId],user_id="",project_id="电影人物关系图谱"),function(rep){});
                        });
                        roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("性别",roles,project_id="电影人物关系图谱"),function(rep){});
                        roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("出生年份",roles,project_id="电影人物关系图谱"),function(rep){});

                        roles = [{rolename : "", node_id : movieId}, {rolename : "片名", node_id : symbolId}]
                        dm.handle(mcreate_relation("片名",roles,project_id="电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=movieId,[relationId],user_id="",project_id="电影人物关系图谱"),function(rep){});
                        });
                        roles = [{rolename : "", node_id : movieId}, {rolename : "上映日期", node_id : symbolId}]
                        dm.handle(mcreate_relation("上映日期",roles,project_id="电影人物关系图谱"),function(rep){});

                        roles = [{rolename : "", node_id : roleId}, {rolename : "名称", node_id : symbolId}]
                        dm.handle(mcreate_relation("名称",roles,project_id="电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=roleId,[relationId],user_id="",project_id="电影人物关系图谱"),function(rep){});
                        });
                        roles = [{rolename : "", node_id : roleId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("性别",roles,project_id="电影人物关系图谱"),function(rep){});
                        //创建关系
                        roles = [
                            {rolename : "电影", node_id : movieId},
                            {rolename : "导演", node_id : humanId}
                        ]
                        dm.handle(mcreate_relation("导演", roles, project_id = "电影人物关系图谱"), function (rep) {});
                        //dm.handle(mcreate_relation("出演", rolename1 = "演员", rolename2 = "电影", id1 = humanId, id2 = movieId, project_id = "电影人物关系图谱"), function (rep) {});
                        //dm.handle(mcreate_relation("饰演", rolename1 = "演员", rolename2 = "角色", id1 = humanId, id2 = roleId, project_id = "电影人物关系图谱"), function (rep) {});
                        //dm.handle(mcreate_relation("角色", rolename1 = "角色", rolename2 = "电影", id1 = roleId, id2 = movieId, project_id = "电影人物关系图谱"), function (rep) {});

                        roles = [
                            {rolename : "电影", node_id : movieId},
                            {rolename : "角色", node_id : roleId},
                            {rolename : "演员", node_id : humanId}
                            ]
                        dm.handle(mcreate_relation("出演", roles, project_id = "电影人物关系图谱"), function (rep) {});
                    });
                });
            });
        });
    });
    return;
}

function mcreate_movie_project_rzdf(){
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: '让子弹飞-电影人物关系图谱'
    };
    var humanId,movieId,roleId,symbolId;
    dm.handle(msg1, function(rep) {
        dm.handle(mcreate_node("Entity", "人", "让子弹飞-电影人物关系图谱"), function (rep) {
            for (let key in rep.migrate) humanId = rep.migrate[key];
            dm.handle(mcreate_node("Entity", "电影", "让子弹飞-电影人物关系图谱"), function (rep) {
                for (let key in rep.migrate) movieId = rep.migrate[key];
                dm.handle(mcreate_node("Entity", "电影人物", "让子弹飞-电影人物关系图谱"), function (rep) {
                    for (let key in rep.migrate) roleId = rep.migrate[key];
                    dm.handle(mcreate_node("Symbol", "String", "让子弹飞-电影人物关系图谱"), function (rep) {
                        for (let key in rep.migrate) symbolId = rep.migrate[key];
                        //创建属性
                        let roles;
                        roles = [{rolename : "", node_id : humanId}, {rolename : "姓名", node_id : symbolId}]
                        dm.handle(mcreate_relation(value="姓名",roles,project_id="让子弹飞-电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=humanId,[relationId],user_id="",project_id="让子弹飞-电影人物关系图谱"),function(rep){});
                        });
                        roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("性别",roles,project_id="让子弹飞-电影人物关系图谱"),function(rep){});
                        roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("出生年份",roles,project_id="让子弹飞-电影人物关系图谱"),function(rep){});

                        roles = [{rolename : "", node_id : movieId}, {rolename : "片名", node_id : symbolId}]
                        dm.handle(mcreate_relation("片名",roles,project_id="让子弹飞-电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=movieId,[relationId],user_id="",project_id="让子弹飞-电影人物关系图谱"),function(rep){});
                        });
                        roles = [{rolename : "", node_id : movieId}, {rolename : "上映日期", node_id : symbolId}]
                        dm.handle(mcreate_relation("上映日期",roles,project_id="让子弹飞-电影人物关系图谱"),function(rep){});

                        roles = [{rolename : "", node_id : roleId}, {rolename : "名称", node_id : symbolId}]
                        dm.handle(mcreate_relation("名称",roles,project_id="让子弹飞-电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=roleId,[relationId],user_id="",project_id="让子弹飞-电影人物关系图谱"),function(rep){});
                        });
                        roles = [{rolename : "", node_id : roleId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("性别",roles,project_id="让子弹飞-电影人物关系图谱"),function(rep){});
                        //创建关系
                        roles = [
                            {rolename : "电影", node_id : movieId},
                            {rolename : "导演", node_id : humanId}
                        ]
                        dm.handle(mcreate_relation("导演", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "电影", node_id : movieId},
                            {rolename : "编剧", node_id : humanId}
                        ]
                        dm.handle(mcreate_relation("编剧", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});

                        roles = [
                            {rolename : "电影", node_id : movieId},
                            {rolename : "角色", node_id : roleId},
                            {rolename : "演员", node_id : humanId}
                        ]
                        dm.handle(mcreate_relation("出演", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        //
                        //爱情
                        roles = [
                            {rolename : "丈夫", node_id : roleId},
                            {rolename : "妻子", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("夫妻", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "男友", node_id : roleId},
                            {rolename : "女友", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("情侣", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "爱慕者", node_id : roleId},
                            {rolename : "被爱慕者", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("爱慕", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        //亲情
                        roles = [
                            {rolename : "父亲", node_id : roleId},
                            {rolename : "儿子", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("父子", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "母亲", node_id : roleId},
                            {rolename : "儿子", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("母子", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "父亲", node_id : roleId},
                            {rolename : "女儿", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("父女", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "母亲", node_id : roleId},
                            {rolename : "女儿", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("母女", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        //婆媳间
                        roles = [
                            {rolename : "公公", node_id : roleId},
                            {rolename : "媳妇", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("公媳", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "婆婆", node_id : roleId},
                            {rolename : "媳妇", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("婆媳", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "岳父", node_id : roleId},
                            {rolename : "女婿", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("翁婿", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "岳母", node_id : roleId},
                            {rolename : "女婿", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("姑婿", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        //同辈间
                        roles = [
                            {rolename : "哥哥", node_id : roleId},
                            {rolename : "弟弟", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("兄弟", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "哥哥", node_id : roleId},
                            {rolename : "妹妹", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("兄妹", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "姐姐", node_id : roleId},
                            {rolename : "弟弟", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("姐弟", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "姐姐", node_id : roleId},
                            {rolename : "妹妹", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("姐妹", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        //友情
                        roles = [
                            {rolename : "朋友", node_id : roleId},
                            {rolename : "朋友", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("朋友", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "师父", node_id : roleId},
                            {rolename : "徒弟", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("师徒", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "仇人", node_id : roleId},
                            {rolename : "报仇", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("仇恨", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});
                        roles = [
                            {rolename : "恩人", node_id : roleId},
                            {rolename : "报恩", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("恩情", roles, project_id = "让子弹飞-电影人物关系图谱"), function (rep) {});

                    });
                });
            });
        });
    });
    return;
}

function mcreate_movie_project_with_name(projectName){
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: projectName
    };
    var humanId,movieId,roleId,symbolId;
    dm.handle(msg1, function(rep) {
        dm.handle(mcreate_node("Entity", "人", projectName), function (rep) {
            for (let key in rep.migrate) humanId = rep.migrate[key];
            dm.handle(mcreate_node("Entity", "电影", projectName), function (rep) {
                for (let key in rep.migrate) movieId = rep.migrate[key];
                dm.handle(mcreate_node("Entity", "电影人物", projectName), function (rep) {
                    for (let key in rep.migrate) roleId = rep.migrate[key];
                    dm.handle(mcreate_node("Symbol", "String", projectName), function (rep) {
                        for (let key in rep.migrate) symbolId = rep.migrate[key];
                        //创建属性
                        let roles;
                        roles = [{rolename : "", node_id : humanId}, {rolename : "姓名", node_id : symbolId}]
                        dm.handle(mcreate_relation(value="姓名",roles,project_id=projectName),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=humanId,[relationId],user_id="",project_id=projectName),function(rep){});
                        });
                        roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("性别",roles,project_id=projectName),function(rep){});
                        roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("出生年份",roles,project_id=projectName),function(rep){});

                        roles = [{rolename : "", node_id : movieId}, {rolename : "片名", node_id : symbolId}]
                        dm.handle(mcreate_relation("片名",roles,project_id=projectName),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=movieId,[relationId],user_id="",project_id=projectName),function(rep){});
                        });
                        roles = [{rolename : "", node_id : movieId}, {rolename : "上映日期", node_id : symbolId}]
                        dm.handle(mcreate_relation("上映日期",roles,project_id=projectName),function(rep){});

                        roles = [{rolename : "", node_id : roleId}, {rolename : "名称", node_id : symbolId}]
                        dm.handle(mcreate_relation("名称",roles,project_id=projectName),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=roleId,[relationId],user_id="",project_id=projectName),function(rep){});
                        });
                        roles = [{rolename : "", node_id : roleId}, {rolename : "性别", node_id : symbolId}]
                        dm.handle(mcreate_relation("性别",roles,project_id=projectName),function(rep){});
                        //创建关系
                        roles = [
                            {rolename : "电影", node_id : movieId},
                            {rolename : "导演", node_id : humanId}
                        ]
                        dm.handle(mcreate_relation("导演", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "电影", node_id : movieId},
                            {rolename : "编剧", node_id : humanId}
                        ]
                        dm.handle(mcreate_relation("编剧", roles, project_id = projectName), function (rep) {});

                        roles = [
                            {rolename : "电影", node_id : movieId},
                            {rolename : "角色", node_id : roleId},
                            {rolename : "演员", node_id : humanId}
                        ]
                        dm.handle(mcreate_relation("出演", roles, project_id = projectName), function (rep) {});
                        //
                        //爱情
                        roles = [
                            {rolename : "丈夫", node_id : roleId},
                            {rolename : "妻子", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("夫妻", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "男友", node_id : roleId},
                            {rolename : "女友", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("情侣", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "爱慕者", node_id : roleId},
                            {rolename : "被爱慕者", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("爱慕", roles, project_id = projectName), function (rep) {});
                        //亲情
                        roles = [
                            {rolename : "父亲", node_id : roleId},
                            {rolename : "儿子", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("父子", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "母亲", node_id : roleId},
                            {rolename : "儿子", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("母子", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "父亲", node_id : roleId},
                            {rolename : "女儿", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("父女", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "母亲", node_id : roleId},
                            {rolename : "女儿", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("母女", roles, project_id = projectName), function (rep) {});
                        //婆媳间
                        roles = [
                            {rolename : "公公", node_id : roleId},
                            {rolename : "媳妇", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("公媳", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "婆婆", node_id : roleId},
                            {rolename : "媳妇", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("婆媳", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "岳父", node_id : roleId},
                            {rolename : "女婿", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("翁婿", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "岳母", node_id : roleId},
                            {rolename : "女婿", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("姑婿", roles, project_id = projectName), function (rep) {});
                        //同辈间
                        roles = [
                            {rolename : "哥哥", node_id : roleId},
                            {rolename : "弟弟", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("兄弟", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "哥哥", node_id : roleId},
                            {rolename : "妹妹", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("兄妹", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "姐姐", node_id : roleId},
                            {rolename : "弟弟", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("姐弟", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "姐姐", node_id : roleId},
                            {rolename : "妹妹", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("姐妹", roles, project_id = projectName), function (rep) {});
                        //友情
                        roles = [
                            {rolename : "朋友", node_id : roleId},
                            {rolename : "朋友", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("朋友", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "师父", node_id : roleId},
                            {rolename : "徒弟", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("师徒", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "仇人", node_id : roleId},
                            {rolename : "报仇", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("仇恨", roles, project_id = projectName), function (rep) {});
                        roles = [
                            {rolename : "恩人", node_id : roleId},
                            {rolename : "报恩", node_id : roleId}
                        ]
                        dm.handle(mcreate_relation("恩情", roles, project_id = projectName), function (rep) {});

                    });
                });
            });
        });
    });
    return;
}
function mcreate_algorithm_project_with_name(projectName) {
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: projectName
    };
    var humanId,algoId,questionId,structureId,complexId,symbolId;
    dm.handle(msg1, function(rep) {
        dm.handle(mcreate_node("Entity", "人", projectName), function (rep) {
            for (let key in rep.migrate) humanId = rep.migrate[key];
            dm.handle(mcreate_node("Entity", "算法", projectName), function (rep) {
                for (let key in rep.migrate) algoId = rep.migrate[key];
                dm.handle(mcreate_node("Entity", "问题", projectName), function (rep) {
                    for (let key in rep.migrate) questionId = rep.migrate[key];
                    dm.handle(mcreate_node("Entity", "数据结构", projectName), function (rep) {
                        for (let key in rep.migrate) structureId = rep.migrate[key];
                        dm.handle(mcreate_node("Entity", "复杂度值", projectName), function (rep) {
                            for (let key in rep.migrate) complexId = rep.migrate[key];
                            dm.handle(mcreate_node("Symbol", "String", projectName), function (rep) {
                                for (let key in rep.migrate) symbolId = rep.migrate[key];
                                //创建属性
                                let roles;
                                roles = [{rolename : "", node_id : humanId}, {rolename : "姓名", node_id : symbolId}]
                                dm.handle(mcreate_relation(value="姓名",roles,project_id=projectName),function(rep){
                                    let relationId;
                                    for (let key in rep.migrate) relationId = rep.migrate[key];
                                    dm.handle(madd_key_attr(node_id=humanId,[relationId],user_id="",project_id=projectName),function(rep){});
                                });
                                roles = [{rolename : "", node_id : humanId}, {rolename : "性别", node_id : symbolId}]
                                dm.handle(mcreate_relation("性别",roles,project_id=projectName),function(rep){});
                                roles = [{rolename : "", node_id : humanId}, {rolename : "出生年份", node_id : symbolId}]
                                dm.handle(mcreate_relation("出生年份",roles,project_id=projectName),function(rep){});

                                roles = [{rolename : "", node_id : questionId}, {rolename : "问题名", node_id : symbolId}]
                                dm.handle(mcreate_relation("问题名",roles,project_id=projectName),function(rep){
                                    let relationId;
                                    for (let key in rep.migrate) relationId = rep.migrate[key];
                                    dm.handle(madd_key_attr(node_id=questionId,[relationId],user_id="",project_id=projectName),function(rep){});
                                });

                                roles = [{rolename : "", node_id : structureId}, {rolename : "名称", node_id : symbolId}]
                                dm.handle(mcreate_relation(value="名称",roles,project_id=projectName),function(rep){
                                    let relationId;
                                    for (let key in rep.migrate) relationId = rep.migrate[key];
                                    dm.handle(madd_key_attr(node_id=structureId,[relationId],user_id="",project_id=projectName),function(rep){});
                                });

                                roles = [{rolename : "", node_id : algoId}, {rolename : "算法名", node_id : symbolId}]
                                dm.handle(mcreate_relation(value="算法名",roles,project_id=projectName),function(rep){
                                    let relationId;
                                    for (let key in rep.migrate) relationId = rep.migrate[key];
                                    dm.handle(madd_key_attr(node_id=algoId,[relationId],user_id="",project_id=projectName),function(rep){});
                                });

                                roles = [{rolename : "", node_id : complexId}, {rolename : "值", node_id : symbolId}]
                                dm.handle(mcreate_relation(value="值",roles,project_id=projectName),function(rep){
                                    let relationId;
                                    for (let key in rep.migrate) relationId = rep.migrate[key];
                                    dm.handle(madd_key_attr(node_id=complexId,[relationId],user_id="",project_id=projectName),function(rep){});
                                });




                                //创建关系
                                roles = [
                                    {rolename : "数据结构", node_id : structureId},
                                    {rolename : "发明者", node_id : humanId}
                                ]
                                dm.handle(mcreate_relation("发明", roles, project_id = projectName), function (rep) {});

                                roles = [
                                    {rolename : "算法", node_id : structureId},
                                    {rolename : "提出者", node_id : humanId}
                                ]
                                dm.handle(mcreate_relation("提出", roles, project_id = projectName), function (rep) {});

                                roles = [
                                    {rolename : "较大", node_id : complexId},
                                    {rolename : "较小", node_id : complexId}
                                ]
                                dm.handle(mcreate_relation("复杂度比较", roles, project_id = projectName), function (rep) {});

                                roles = [
                                    {rolename : "算法", node_id : algoId},
                                    {rolename : "使用", node_id : structureId},
                                    {rolename : "问题", node_id : questionId}
                                ]
                                dm.handle(mcreate_relation("解决", roles, project_id = projectName), function (rep) {});

                                roles = [
                                    {rolename : "算法", node_id : algoId},
                                    {rolename : "空间", node_id : complexId},
                                    {rolename : "时间", node_id : complexId}
                                ]
                                dm.handle(mcreate_relation("复杂度", roles, project_id = projectName), function (rep) {});
                            });
                        });
                    });
                });
            });
        });
    });
    return;
}
function mcreate_empty_project_with_name(projectName) {
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: projectName
    };

    dm.handle(msg1, function(rep) {
        /*dm.handle(mcreate_node("Entity", "人", projectName), function (rep) {
        });*/
        dm.handle(mcreate_node("Symbol", "String", projectName), function (rep) {
            //for (let key in rep.migrate) symbolId = rep.migrate[key];
        })
    });
    return;
}

module.exports = ioConfig;