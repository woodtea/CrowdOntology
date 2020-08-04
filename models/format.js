//由于当前前后台格式不同意，故临时使用

function formatExchange(){};

formatExchange.prototype.web2Server = function(msg,type=""){
    console.log(msg);
    let newMsg;
    switch (msg.operation){
        case 'mcreate_node':
            newMsg = format_create_model_node(msg);
            break;
        case 'madd_key_attr':
            newMsg = format_create_model_keyAttr(msg);
            break;
        case 'mcreate_relation':
            newMsg = format_create_model_relation(msg);
            break;
        case 'get':
            newMsg = format_get_insModel(msg);
            break;
        case 'create_node':
            newMsg = format_create_insModel_node(msg);
            break;
        case 'remove_node':
            newMsg = format_remove_insModel_node(msg);
            break;
        case 'create_relation':
            newMsg = format_create_insModel_relation(msg);
            break;
        case 'remove_relation':
            newMsg = format_remove_insModel_relation(msg);
            break;
        case 'revise_relation':
            newMsg = format_revise_insModel_relation(msg);
            break;
        case 'rcmd_node':
            newMsg = format_recommend_insModel_node(msg);
            break;
        case 'rcmd_relation':
            newMsg = format_recommend_insModel_relation(msg);
            break;
        case 'rcmd':
            newMsg = format_recommend_insModel(msg);
            break;
        case 'rcmdIndex':
            newMsg = format_recommend_insModel(msg);
            break;

    }

    return newMsg;
}

formatExchange.prototype.server2Web = function(type,msg){
    let newMsg;
    newMsg = reformat_basic(msg);

    return newMsg;
}

format_basic = function (msg,M=1) {
    let newMsg = {
        operation: msg.operation,
        user_id: msg.user,
        project_id: msg.project,
        operation_id: msg.operationId
    };
    if(M){
        newMsg.operation = "m" + newMsg.operation;
    }

    return newMsg;
}


reformat_basic = function (msg,M=1) {
    let newMsg = {
        operation: msg.operation,
        user: msg.user_id,
        project: msg.project_id,
        operationId: msg.operation__id
    };
    if(M){
        newMsg.operation.shift();
    }
    return newMsg;
}

format_create_model_node = function(msg){
    let newMsg ;
    let frontId;
    for(frontId in msg["nodes"]) break;

    newMsg = format_basic(msg,0);
    newMsg["nodes"]=[{
        "front_id" : frontId,
        "tag" : "Entity",
        "value" : msg["nodes"][frontId].value
    }];

    return newMsg;
}

format_create_model_keyAttr = function (msg) {
    let newMsg = format_basic(msg,0);

    newMsg["nodes"] = [];
    for(let i in msg["keyAttr"]){
        newMsg["nodes"].push({id:msg["keyAttr"][i].id,key_attr_list:[msg["keyAttr"][i].keyAttr]});
    }
    return newMsg;
}

format_create_model_relation = function (msg) {
    //丢失了节点类型,节点类型一般是数组
    //nodes前台用的是对象不用数据
    let newMsg ;
    let frontId;
    for(frontId in msg["relations"]) break;

    newMsg = format_basic(msg,0);
    //newMsg.operation = newMsg.operation+"_proxy";   //临时

    newMsg["relations"]=[{
        "front_id" : frontId,
        "value" : msg["relations"][frontId].type,
        "roles": msg["relations"][frontId].roles
    }];
    if(msg["relations"][frontId].desc != undefined && msg["relations"][frontId].desc != ""){
        newMsg["relations"][0].desc = msg["relations"][frontId].desc;
    }
    return newMsg;
}

format_create_insModel_node = function (msg) {
    //丢失了节点类型,节点类型一般是数组
    //nodes前台用的是对象不用数据
    let newMsg ;
    let frontId;
    for(frontId in msg["nodes"]) break;

    newMsg = format_basic(msg,0);
    newMsg.operation = newMsg.operation+"_proxy";   //临时

    newMsg["nodes"]=[{
        "front_id" : frontId,
        "tags" : msg["nodes"][frontId].tags,
        "value": msg["nodes"][frontId].value//,
        //"dataType": msg["nodes"][frontId].dataType,
    }];
    return newMsg;
}

format_remove_insModel_node = function (msg) {
    let newMsg ;
    let frontId;
    for(frontId in msg["nodes"]) break;

    newMsg = format_basic(msg,0);
    newMsg["nodes"]=[frontId];
    return newMsg;
}

format_create_insModel_relation = function (msg) {
    //丢失了节点类型,节点类型一般是数组
    //nodes前台用的是对象不用数据
    let newMsg ;
    let frontId;
    for(frontId in msg["relations"]) break;

    newMsg = format_basic(msg,0);
    newMsg.operation = newMsg.operation+"_proxy";   //临时

    newMsg["relations"]=[{
        "front_id" : frontId,
        "tag" : msg["relations"][frontId].type,
        "roles": msg["relations"][frontId].roles
    }];
    console.log(newMsg)
    console.log(newMsg["relations"][0])
    return newMsg;
}

format_remove_insModel_relation = function (msg){
    //丢失了节点类型,节点类型一般是数组
    //nodes前台用的是对象不用数据
    let newMsg ;
    let frontId;
    for(frontId in msg["relations"]) break;

    newMsg = format_basic(msg,0);
    newMsg["relations"]=[frontId];
    console.log(newMsg)
    return newMsg;
}

format_recommend_insModel = function (msg){
    let newMsg = format_basic(msg,0);
    newMsg.nodes = msg.nodes;
    return newMsg;
}

isCreateEntity = function(msg){
    let frontId;
    for(frontId in msg["nodes"]) break;
    if(msg["nodes"]["tags"] != undefined) return true;
    else return false;
}


module.exports = formatExchange;