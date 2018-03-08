var socket = io();

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

socket.on('model', function(msg){
    switch (msg.operation){
        case 'get':
            io_get_model_done(msg);
            break;
        case 'save':
            io_save_model_done(msg);
            break;
    }
});

socket.on('insModel', function(msg){
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
    }
});



function socketEmit(type,msg){
    socket.emit(type, msg);
}

/* socket emit */
function io_get_model(user_id,projectId){
    let msg = generate_msg_base(user_id,projectId,'get');
    socketEmit('model',msg);
}

function io_save_model(user_id,projectId,model){
    let msg = generate_msg_base(user_id,projectId,'save');
    msg["nodes"] = model["nodes"];
    msg["relations"] = model["relations"];
    socketEmit('model',msg);
}

function io_get_insModel(user_id,projectId){
    let msg = generate_msg_base(user_id,projectId,'get');
    socketEmit('insModel',msg);
}

function io_create_insModel_node(user_id,projectId,nodes){
    let msg = generate_msg_base(user_id,projectId,'create_node');
    msg["nodes"] = nodes;
    socketEmit('insModel',msg);
}

function io_remove_insModel_node(user_id,projectId,nodes){
    let msg = generate_msg_base(user_id,projectId,'remove_node');
    msg["nodes"] = nodes;
    socketEmit('insModel',msg);
}

function io_create_insModel_relation(user_id,projectId,relations){
    let msg = generate_msg_base(user_id,projectId,'create_relation');
    msg["relations"] = relations;
    socketEmit('insModel',msg);
}

function io_remove_insModel_relation(user_id,projectId,relations){
    let msg = generate_msg_base(user_id,projectId,'remove_relation');
    msg["relations"] = relations;
    socketEmit('insModel',msg);
}

function io_revise_insModel_relation(user_id,projectId,relations){
    let msg = generate_msg_base(user_id,projectId,'revise_relation');
    msg["relations"] = relations;
    socketEmit('insModel',msg);
}

function io_recommend_insModel_node(user_id,projectId,nodes){
    let msg = generate_msg_base(user_id,projectId,'rcmd_node');
    msg["nodes"] = nodes;
    socketEmit('insModel',msg);
}

function io_recommend_insModel_relation(user_id,projectId,relations){
    let msg = generate_msg_base(user_id,projectId,'rcmd_relation');
    msg["relations"] = relations;
    socketEmit('insModel',msg);
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
function io_get_model_done(msg){
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

function io_get_insModel_done(msg){
    if(msg.error){
        return;
    }else{
        instance_model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
    }
}

function io_create_insModel_node_done(msg){
    if(msg.error){
        return;
    }else{
        return;
    }
}

function io_remove_insModel_node_done(msg){
    if(msg.error){
        return;
    }else{
        return;
    }
}

function io_create_insModel_relation_done(msg){
    if(msg.error){
        return;
    }else{
        return;
    }
}

function io_remove_insModel_relation_done(msg){
    if(msg.error){
        return;
    }else{
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
        recommend_model={
            "nodes":msg.nodes,
            "relations":msg.relations
        }
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

function io_test(){
    msg = "hello";
    socketEmit('iotest', msg);
}

socket.on('iotest_back', function(msg){
    console.log(msg);
});