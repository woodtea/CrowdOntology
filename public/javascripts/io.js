var socket = io();
var tmpMsg = {
    type:[],
    emit:[],
    on:[]
};

var socket_mutex = false;

socket.on('chat message', function(msg){
    alert(msg);
});



socket.on('data', function(msg){

    instance_model = {nodes:{},relations:{}};
    recommend_model_whole = {nodes:{},relations:{}};
    model = {nodes:{},relations:{}};

    if(msg.instance_model[user]) instance_model =  msg.instance_model[user];
    if(msg.model) model = msg.model;
    for(let tmpUser in msg.instance_model){
        if(user != tmpUser) recommend_model_whole = msg.instance_model[tmpUser]
    }

    drawIndex();

    let indexArray = getIndexArray({});
    setIndexTypeahead(indexArray);

    return;

    instance_model = msg.instance_model;
    recommend_model = msg.recommend_model;

    model = msg.model;
    indexArray = getIndexArray(instance_model);

    drawIndex();
    drawRelation("n0", "n2", instance_model);

    indexArray = getIndexArray();
    setIndexTypeahead(indexArray);
});



socket.on('iotest', function(msg){
    alert(msg);
});

socket.on('model', function(msg){
    switch (msg.operation){
        //case 'get':
        case 'mget':
            if(Object.keys(msg.nodes).length == 0){
                socketEmit("iotest", "99");
                socket_mutex = false;
                return;
            }
            io_get_model_done(msg);
            break;
        case 'save':
            io_save_model_done(msg);
            break;
    }
});

socket.on('insModel', function(msg){
    tagReformat.id2value(msg);
    console.log(msg);
    switch (msg.operation){
        case 'get':
            io_get_insModel_done(msg);
            break;
        case 'create_node':
            io_create_insModel_node_done(msg);
            break;
        case 'remove_node':
            io_remove_insModel_node_done(msg);
            break;
        case 'create_relation':
            io_create_insModel_relation_done(msg);
            break;
        case 'remove_relation':
            io_remove_insModel_relation_done(msg);
            break;
        case 'revise_relation':
            io_revise_insModel_relation_done(msg);
            break;
        case 'rcmd_node':
            io_recommend_insModel_node_done(msg);
            break;
        case 'rcmd_relation':
            io_recommend_insModel_relation_done(msg);
            break;
        case 'rcmd':
            io_recommend_insModel_node_done(msg);
            break;
    }
});



function socketEmitArray(type,msg){
    tagReformat.value2id(msg);
    //console.log(msg);
    //console.log(socket_mutex);

    tmpMsg.emit.push(msg);
    tmpMsg.type.push(type);
    //alert(socket_mutex);
    if(!socket_mutex){
        socketEmit(type, msg)
    }
}

function socketEmit(type, msg) {
    console.log(type)
    console.log(msg)
    socket_mutex = true;
    socket.emit(type, msg);
}

/* socket emit */
function emitMsgHeader(operation){
    let msgHeader = {
        "operation":operation,
        "user":user,
        "project": project, //仅测试使用
        "operationId":generateFrontOperationID()
    }
    return msgHeader;
}

/* model */
function io_get_model(user_id,projectId){
    let msg = generate_msg_base(user_id,projectId,'get');
    socketEmitArray('model',msg);
}

function io_save_model(user_id,projectId,model){
    let msg = generate_msg_base(user_id,projectId,'save');
    msg["nodes"] = model["nodes"];
    msg["relations"] = model["relations"];
    socketEmitArray('model',msg);
}

/* insModel */
function io_get_insModel(user_id,projectId){
    let msg = generate_msg_base(user_id,projectId,'get');
    socketEmitArray('insModel',msg);
}

function io_create_insModel_entity(entity){

    //生成Entity节点
    let entityNode = {};
    entityNode[entity.nodeId] = {
        "tags":entity.tags,
        "value": ""
    }
    io_create_insModel_node(entityNode);

    //生成Value节点
    let valueNode = {};
    valueNode[entity.valueId] = {
        "tags": ["String"], //默认
        "value": entity.value
    }
    io_create_insModel_node(valueNode)

    //生成关系
    let relations = {};
    relations[entity.relationId] = {
        "type": "姓名",
        "roles": [
            {"rolename": "", "node_id": entity.nodeId},
            {"rolename": "姓名", "node_id": entity.valueId}
        ]
    }
    io_create_insModel_relation(relations);
}

function io_create_insModel_node(nodes){
    let msg = emitMsgHeader('create_node');
    msg["nodes"] = nodes;
    socketEmitArray('insModel',msg);
}

function io_remove_insModel_node(nodeId){
    let msg = emitMsgHeader('remove_node');
    msg["nodes"] = {};
    msg["nodes"][nodeId] = {}
    socketEmitArray('insModel',msg);
}

function io_create_insModel_relation(relations){
    let msg = emitMsgHeader('create_relation');
    msg["relations"] = relations;
    socketEmitArray('insModel',msg);
}

function io_remove_insModel_relation(relationId){
    let msg = emitMsgHeader('remove_relation');
    msg["relations"] = {};
    msg["relations"][relationId] = {}
    socketEmitArray('insModel',msg);
}

function io_revise_insModel_relation(user_id,projectId,relations){
    let msg = generate_msg_base(user_id,projectId,'revise_relation');
    msg["relations"] = relations;
    socketEmitArray('insModel',msg);
}

function io_recommend_insModel_node(nodes){
    let msg = emitMsgHeader('rcmd'); //'rcmd_node');
    msg["nodes"] = nodes;
    socketEmitArray('insModel',msg);
}

function io_recommend_insModel_relation(user_id,projectId,relations){
    let msg = generate_msg_base(user_id,projectId,'rcmd_relation');
    msg["relations"] = relations;
    socketEmitArray('insModel',msg);
}

function generate_msg_base(user_id,projectId,operation){

    let msg = {
        'operation':operation,
        'user_id':user_id,
        'project_id':projectId,
        'operation_id': new Date()//试试objecid
    }

    return msg;
}

/* socket on */
/* model */
function io_get_model_done(msg){
    socket_mutex = false;
    if(msg.error){
        return;
    }else{
        model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
    }
}

function io_save_model_done(msg){
    if(msg.error){
        return;
    }else{
        return;
    }
}
/* instanceModel */
function io_get_insModel_done(msg){
    socket_mutex = false;
    if(msg.error){
        return;
    }else{
        instance_model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
        prepareNewEntity();
    }
}

function io_create_insModel_node_done(msg){
    if(msg.error){
        return;
    }else{
        migrateEmitMsg(msg.migrate);
        let curMsg = tmpMsgPop(msg.operationId);
        //console.log(curMsg);
        tagReformat.id2value(curMsg);

        let node = curMsg.nodes //tmpMsg.emit.nodes;
        let nodeId;
        for(nodeId in node){
            instance_model.nodes[nodeId] = node[nodeId];
            break;
        }
        if(msg.migrate[nodeId]) nodeId = msg.migrate[nodeId];
        migrate(msg.migrate);
        //svgOperation.clickNode(nodeId)
        return;
    }
}

function io_remove_insModel_node_done(msg){
    if(msg.error){
        return;
    }else{
        let node = tmpMsgPop(msg.operationId).nodes;
        let nodeId;
        for(nodeId in node) break;
        removeNode(nodeId);
        return;
    }
}

function io_create_insModel_relation_done(msg){
    if(msg.error){
        return;
    }else{
        migrateEmitMsg(msg.migrate);
        let curMsg = tmpMsgPop(msg.operationId);
        let relation = curMsg.relations;
        console.log("curMsg")
        console.log(curMsg)
        tagReformat.id2value(curMsg);
        //let relation = tmpMsgPop(msg.operationId).relations //tmpMsg.emit.nodes;
        let relationId;
        for(relationId in relation){
            instance_model.relations[relationId] = relation[relationId];
            break;
        }
        if(msg.migrate[relationId]) relationId = msg.migrate[relationId];
        migrate(msg.migrate);

        let centerId = $("g.center.isCentralized").attr("id");
        let nodeId;
        for(let n in instance_model.relations[relationId].roles){
            nodeId = instance_model.relations[relationId].roles[n].node_id;
            if(nodeId != centerId) break;
        }
        if(!prepareNewEntity()){
            transAnimation(centerId,nodeId,relationId,instance_model);
        }
        return;
    }
}

function io_remove_insModel_relation_done(msg){
    if(msg.error){
        return;
    }else{
        let relation = tmpMsgPop(msg.operationId).relations;
        let relationId;
        for(relationId in relation) break;
        delete instance_model["relations"][relationId];
        return;
    }
}

function io_revise_insModel_relation_done(msg){
    if(msg.error){
        return;
    }else{
        return;
    }
}

function io_recommend_insModel_node_done(msg){
    if(msg.error){
        return;
    }else{
        tmpMsgPop(msg.operationId);

        recommend_model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
        prepareNewEntity(recommend_model,false);

        let centerId = $("g.center.isCentralized").attr("id");
        let entity = getEntity(centerId,recommend_model);
        drawRecommendation(entity.neighbours, instance_model);    //绘制推荐模型
        //drawRecommendation(recommend_model, instance_model);    //绘制推荐模型
        return;
    }
}

function io_recommend_insModel_relation_done(msg){
    if(msg.error){
        return;
    }else{
        recommend_model={
            "nodes":msg.nodes,
            "relations":msg.relations
        }
        return;
    }
}

io_test = function(){
    msg = "hello";
    socketEmitArray('iotest', msg);
}

io_test2 = function(msg = "hello"){
    socket.emit('iotest', msg);
}

socket.on('iotest_back', function(msg){
    //alert("123")
    console.log(msg);
});

migrate = function(obj,model=instance_model){
    if(obj == undefined) return;
    for(let key in obj){
        if(key.indexOf("front_n")!=-1){
            if(model["nodes"][obj[key]] == undefined) model["nodes"][obj[key]]={};
            copyObj(model["nodes"][obj[key]],model["nodes"][key])
            delete model["nodes"][key];

            for(let rel in model["relations"]){
                for(let n in model["relations"][rel]["roles"]){
                    let tmp = model["relations"][rel]["roles"][n];
                    if(tmp["node_id"] == key)  tmp["node_id"]=obj[key];
                }
            }
        }
        if(key.indexOf("front_r")!=-1){
            if(model["relations"][obj[key]] == undefined) model["relations"][obj[key]]={};
            copyObj(model["relations"][obj[key]],model["relations"][key])
            delete model["relations"][key];
        }
    }
    //console.log(tmpMsg.emit)
    return;
}

migrateEmitMsg = function(obj){
    if(obj == undefined) return;
    for(let key in obj){
        if(key.indexOf("front_n")!=-1){
            //更新emit里面的id
            for(let emitMsgOrder in tmpMsg.emit){
                let tmpMsp = tmpMsg.emit[emitMsgOrder];
                if(tmpMsp["nodes"]){
                    if(!tmpMsp["nodes"][key]) continue; //EmitArray可能不存在当前节点
                    else{
                        if(tmpMsp["nodes"][obj[key]] == undefined) tmpMsp["nodes"][obj[key]]={};
                        copyObj(tmpMsp["nodes"][obj[key]],tmpMsp["nodes"][key])
                        delete tmpMsp["nodes"][key];
                    }
                }
                if(tmpMsp["relations"]){
                    for(let rel in tmpMsp["relations"]){
                        for(let n in tmpMsp["relations"][rel]["roles"]){
                            let tmp = tmpMsp["relations"][rel]["roles"][n];
                            if(tmp["node_id"] == key)  {
                                tmp["node_id"]=obj[key];
                            }
                        }
                    }
                }
            }
        }
        if(key.indexOf("front_r")!=-1){
            //更新emit里面的id
            for(let emitMsgOrder in tmpMsg.emit) {
                let tmpMsp = tmpMsg.emit[emitMsgOrder];
                if(tmpMsp["relations"]){
                    if(!tmpMsp["relations"][key]) continue; //EmitArray可能不存在当前节点
                    else{
                        if (tmpMsp["relations"][obj[key]] == undefined) tmpMsp["relations"][obj[key]] = {};
                        copyObj(tmpMsp["relations"][obj[key]], tmpMsp["relations"][key])
                        delete tmpMsp["relations"][key];
                    }
                }
            }
        }
    }

    return;
}


copyObj = function(obj1,obj2){

    for(let key in obj2){
        obj1[key] = obj2[key];
    }
    return;
}

removeNode = function(nodeId,model=instance_model){

    for(let rel in model["relations"]){
        for(let n in model["relations"][rel]["roles"]){
            let tmp = model["relations"][rel]["roles"][n];
            if(tmp["node_id"] == nodeId)  {
                if(model.nodes[nodeId].tags != undefined){
                    alert("存在其他关系，节点无法删除")
                }
                return;
            }
        }
    }
    delete model["nodes"][nodeId];
}

tmpMsgPop= function(operationId){

    let tmpObj = {};
    for(let n in tmpMsg.emit){
        if(tmpMsg.emit[n].operationId == operationId){
            copyObj(tmpObj,tmpMsg.emit[n])
            tmpMsg.emit.splice(n,1);
            tmpMsg.type.splice(n,1)
        }
    }

    if(tmpMsg.emit.length > 0) {    //为什么明明等于0还是等进入
        socketEmit(tmpMsg.type[0],tmpMsg.emit[0]);
    }else{
        socket_mutex = false
    }
    return tmpObj;
}
