function ioObj() {
    this.socket = io();
    this.socket_mutex = false;
    this.tmpMsg = {
        type: [],
        emit: [],
        on: []
    };
    this.testmode=0;
    this.initmode=0;
}

ioObj.prototype.init = function () {

    this.socket.on('iotest', async function (msg) {
        //alert(msg);
        if(msg=="fresh")
        {
            location.reload();
            //await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("fresh");
            return;
        }
        let type,relationId,relations;
        switch(msg.operation) {
            case 'add_entity':
                //console.log(msg);
                let entity = {
                    tags: [msg.type],
                    value: msg.entity,
                    nodeId: generateFrontNodeID(msg.entity, "e"),
                    valueId: generateFrontNodeID(msg.entity, "v"),
                    relationId: generateFrontRelationID(0)
                }
                that.io_create_insModel_entity(entity);
                break;
            case 'add_attr':
                type = msg.type;
                let value = msg.value;
                let nodes = {};
                let nodeId = generateFrontNodeID(value)
                let tags = data.getAttrTags(type)
                nodes[nodeId] = {
                    "dataType": type,
                    "tags": tags,
                    "value": value
                }
                that.io_create_insModel_node(nodes)
                //生成关系
                let centerId = data.getEntityIdByValue(msg.entity);
                relationId = generateFrontRelationID();
                relations = {};
                relations[relationId] = {
                    "type": type,
                    "roles": [
                        {"rolename": "", "node_id": centerId},
                        {"rolename": type, "node_id": nodeId}
                    ]
                }
                that.io_create_insModel_relation(relations);
                break;
            case 'add_relation':
                type = msg.type;
                relationId = generateFrontRelationID();
                relations = {};
                relations[relationId] = {
                    "type": type,
                    "roles": []
                }
                let roles = msg.roles;
                for (let i in roles) {
                    relations[relationId].roles[i] = {
                        "rolename": "",
                        "node_id": data.getEntityIdByValue(roles[i])
                    }
                }

                that.io_create_insModel_relation(relations);
                break;
        }
    });

    this.socket.on('model', function (msg) {
        switch (msg.operation) {
            //case 'get':
            case 'mget':
                that.io_get_model_done(msg);
                break;
            case 'save':
                that.io_save_model_done(msg);
                break;
            case 'mcreate_node':
                that.io_create_model_node_done(msg);
                break;
            case 'madd_key_attr':
                that.io_create_model_keyAttr_done(msg);
                break;
            case 'mcreate_relation':
                that.io_create_model_relation_done(msg);
                break;
        }
    });

    let that = this;

    this.socket.on('insModel', function (msg) {
        tagReformat.id2value(msg);
        console.log(msg);
        switch (msg.operation) {
            case 'get':
                that.io_get_insModel_done(msg);
                break;
            case 'cite_rcmd':
                that.io_normal_done(msg);
                break;
            case 'create_node':
                that.io_create_insModel_node_done(msg);
                break;
            case 'remove_node':
                that.io_remove_insModel_node_done(msg);
                break;
            case 'create_relation':
                that.io_create_insModel_relation_done(msg);
                break;
            case 'remove_relation':
                that.io_remove_insModel_relation_done(msg);
                break;
            case 'revise_relation':
                that.io_revise_insModel_relation_done(msg);
                break;
            case 'rcmd_node':
                that.io_recommend_insModel_node_done(msg);
                break;
            case 'rcmd_relation':
                that.io_recommend_insModel_relation_done(msg);
                break;
            case 'rcmd':
                that.io_recommend_insModel_node_done(msg);
                break;
            case 'rcmdIndex':
                that.io_recommend_insModel_index_done(msg);
                break;
            case 'rcmd_entity':
                that.io_recommend_insModel_entity_done(msg);
                break;
            case 'report_rcmd':
                that.io_normal_done(msg);
                break;
            case 'reject_entity':
            case 'reject_relation':
                that.io_reject_rcmdModel_relation_done(msg);
                break;
            case 'get_reject':
                that.io_get_reject_done(msg);
                break;
            default:
                that.io_normal_done(msg);
                break;
        }
    });

}

//TODO 创建新属性的临时解决方案，等待修改value2id或getValueId函数
ioObj.prototype.socketEmitNewArray = function (type, msg) {
   // tagReformat.value2id(msg);
    this.tmpMsg.emit.push(msg);
    this.tmpMsg.type.push(type);
    console.log("sendrelation");
    console.log(JSON.stringify(msg));
    if (!this.socket_mutex) {
        this.socketEmit(type, msg)
    }
}

ioObj.prototype.socketEmitArray = function (type, msg) {

    tagReformat.value2id(msg);
    this.tmpMsg.emit.push(msg);
    this.tmpMsg.type.push(type);
    //console.log(JSON.stringify(msg));
    if (!this.socket_mutex) {
        this.socketEmit(type, msg)
    }
}

ioObj.prototype.socketEmit = function (type, msg) {
    console.log(type)
    console.log(msg)
    //console.trace();
    this.socket_mutex = true;
    this.socket.emit(type, msg);
}

/* socket emit */
ioObj.prototype.emitMsgHeader = function (operation) {
    let msgHeader = {
        "operation": operation,
        "user": user,
        "project": project, //仅测试使用
        "operationId": generateFrontOperationID()
    }
    return msgHeader;
}

/* model */
ioObj.prototype.io_get_model = function (user_id, projectId) {
    let msg = this.generate_msg_base(user_id, projectId, 'get');
    this.socketEmitArray('model', msg);
}

ioObj.prototype.io_save_model = function (user_id, projectId, model) {
    let msg = this.generate_msg_base(user_id, projectId, 'save');
    msg["nodes"] = model["nodes"];
    msg["relations"] = model["relations"];
    this.socketEmitArray('model', msg);
}


ioObj.prototype.io_create_moodel_entity = function (entity) {

    //生成Entity节点
    let entityNode = {};
    entityNode[entity.nodeId] = {
        "tags": entity.tags,
        "value": ""
    }
    this.io_create_insModel_node(entityNode);

    //生成Value节点
    let valueNode = {};
    valueNode[entity.valueId] = {
        "tags": ["String"], //默认
        "value": entity.value
    }
    this.io_create_insModel_node(valueNode)

    //生成关系
    let relations = {};
    let keyAttribute = data.getKeyAttribute(entity.tags);
    relations[entity.relationId] = {
        "type": keyAttribute,
        "roles": [
            {"rolename": "", "node_id": entity.nodeId},
            {"rolename": keyAttribute, "node_id": entity.valueId}
        ]
    }
    this.io_create_insModel_relation(relations);

}

ioObj.prototype.io_create_model_node = function (nodes) {
    let msg = this.emitMsgHeader('mcreate_node');
    msg["nodes"] = nodes;
    this.socketEmitArray('model', msg);
}

ioObj.prototype.io_create_model_keyAttr = function (array) {
    let msg = this.emitMsgHeader('madd_key_attr');
    msg["keyAttr"] = array;
    this.socketEmitArray('model', msg);
}


ioObj.prototype.io_create_model_entity = function (entity) {

    //生成Entity节点
    let entityNode = {};
    entityNode[entity.nodeId] = {
        "tag": entity.tag,
        "value": entity.value
    }
    this.io_create_model_node(entityNode);
/*
    //生成Value节点
    let valueNode = {};
    valueNode[entity.valueId] = {
        "tags": ["String"], //默认
        "value": entity.value
    }
    this.io_create_insModel_node(valueNode)
*/
    //生成关系
    let relations = {}
    relations[entity.relationId] = {
        "type": entity.keyAttr,
        "roles": [
            {"rolename": "", "node_id": entity.nodeId},
            {"rolename": entity.keyAttr, "node_id": entity.valueId}
        ]
        //desc
    }
    this.io_create_model_relation(relations);
    let array = [{
        id:entity.nodeId,
        keyAttr:entity.relationId
    }];
    this.io_create_model_keyAttr(array);
}

ioObj.prototype.io_create_model_node_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        this.migrateEmitMsg(msg.migrate);
        let curMsg = this.tmpMsgPop(msg.operationId);

        let node = curMsg.nodes //tmpMsg.emit.nodes;
        let nodeId;
        for (nodeId in node) {
            model.nodes[nodeId] = node[nodeId];
            delete model.nodes[nodeId].tags;
            break;
        }
        return;
    }
}

ioObj.prototype.io_create_model_keyAttr_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        this.migrateEmitMsg(msg.migrate);
        let curMsg = this.tmpMsgPop(msg.operationId);

        let array = curMsg.keyAttr //tmpMsg.emit.nodes;
        for(let i in array){
            model.nodes[array[i].id].key_attr_list = [array[i].keyAttr];
        }
        
        this.prepareModel();
        alert("成功添加实体类型");
        return;
    }
}

ioObj.prototype.io_create_model_relation = function (relations) {
    let msg = this.emitMsgHeader('mcreate_relation');
    msg["relations"] = relations;
    //console.log(JSON.stringify(relations));
    //console.log("ready to emit relation");
    //console.log(JSON.stringify(msg));
    //this.socketEmitArray('model', msg);
    this.socketEmitNewArray('model', msg);
}

ioObj.prototype.io_create_model_relation_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        this.migrateEmitMsg(msg.migrate);
        let curMsg = this.tmpMsgPop(msg.operationId);
        let relation = curMsg.relations;
        //console.log(curMsg);

        for (relationId in relation) {
            if(relation[relationId].value == undefined){
                relation[relationId].value = relation[relationId].type;
                delete relation[relationId].type;
            }
            model.relations[relationId] = relation[relationId];
            break;
        }
        if(data.pendingInsRel.length>0){
            let insRelations = data.pendingInsRel.pop();
            connection.io_create_insModel_relation(insRelations);
        }
        //处理Attribute的情况
        let classId;
        let centerId = $("g.center").attr("id");
        let entityType = instance_model.nodes[centerId].tags[0];
        for(let key in model.nodes){
            if(model.nodes[key].value == entityType){
                classId = key;
                break;
            }
        }
        for (relationId in relation) {
            for(let i in relation[relationId].roles){
                console.log(centerId);
                console.log(relation[relationId].roles[i].node_id)
                console.log(relation[relationId].roles[i].rolename)
                if(relation[relationId].roles[i].node_id == classId && relation[relationId].roles[i].rolename == ""){
                    let array = getAttributeTypes(centerId);
                    setAttributeTypeTypeahead(array);
                    alert("成功添加属性类型");
                }
                break;
            }
        }
        return;
    }
}

/* insModel */
ioObj.prototype.io_get_insModel = function (user_id, projectId) {
    let msg = this.generate_msg_base(user_id, projectId, 'get');
    this.socketEmitArray('insModel', msg);
}

ioObj.prototype.io_cite_recommend = function (status) {
    let msg = this.emitMsgHeader('cite_rcmd');
    if(status===1) msg["done"] = "true";
    else msg["done"] = "false";
    this.socketEmitArray('insModel',msg);
}

ioObj.prototype.io_report_recommend = function (relations) {
    let msg = this.emitMsgHeader('report_rcmd');
    msg['relations']=relations;
    msg['count']=getJsonLength(relations);
    this.socketEmitArray('insModel',msg);
}

ioObj.prototype.io_create_insModel_entity = function (entity) {

    //生成Entity节点
    let entityNode = {};
    entityNode[entity.nodeId] = {
        "tags": entity.tags,
        "value": ""
    }
    this.io_create_insModel_node(entityNode);

    //生成Value节点
    let valueNode = {};
    valueNode[entity.valueId] = {
        "tags": ["String"], //默认
        "value": entity.value
    }
    this.io_create_insModel_node(valueNode)

    //生成关系
    let relations = {};
    let keyAttribute = data.getKeyAttribute(entity.tags);
    relations[entity.relationId] = {
        "type": keyAttribute,
        "roles": [
            {"rolename": "", "node_id": entity.nodeId},
            {"rolename": keyAttribute, "node_id": entity.valueId}
        ]
    }
    this.io_create_insModel_relation(relations);
}

ioObj.prototype.io_create_insModel_node = function (nodes) {
    let msg = this.emitMsgHeader('create_node');
    msg["nodes"] = nodes;
    this.socketEmitArray('insModel', msg);
}

ioObj.prototype.io_remove_insModel_node = function (nodeId) {
    let msg = this.emitMsgHeader('remove_node');
    msg["nodes"] = {};
    msg["nodes"][nodeId] = {}
    this.socketEmitArray('insModel', msg);
}

ioObj.prototype.io_create_insModel_relation = function (relations) {
    let msg = this.emitMsgHeader('create_relation');
    msg["relations"] = relations;
    this.socketEmitArray('insModel', msg);
}

ioObj.prototype.io_remove_insModel_relation = function (relationId) {
    let msg = this.emitMsgHeader('remove_relation');
    msg["relations"] = {};
    msg["relations"][relationId] = {}
    this.socketEmitArray('insModel', msg);
}

ioObj.prototype.io_revise_insModel_relation = function (user_id, projectId, relations) {
    let msg = this.generate_msg_base(user_id, projectId, 'revise_relation');
    msg["relations"] = relations;
    this.socketEmitArray('insModel', msg);
}

ioObj.prototype.io_recommend_insModel_node = function (nodes) {
    //let msg = this.emitMsgHeader('rcmd'); //'rcmd_node');
    let msg = this.emitMsgHeader('rcmd');
    msg["nodes"] = nodes;
    this.socketEmitArray('insModel', msg);
}

ioObj.prototype.io_recommend_insModel_relation = function (user_id, projectId, relations) {
    let msg = this.generate_msg_base(user_id, projectId, 'rcmd_relation');
    msg["relations"] = relations;
    this.socketEmitArray('insModel', msg);
}

ioObj.prototype.generate_msg_base = function (user_id, projectId, operation) {
    let msg = {
        'operation': operation,
        'user_id': user_id,
        'project_id': projectId,
        'operation_id': new Date()//试试objecid
    }
    return msg;
}
ioObj.prototype.io_create_insModel_relation = function (relations) {
    let msg = this.emitMsgHeader('create_relation');
    msg["relations"] = relations;
    this.socketEmitArray('insModel', msg);
}
ioObj.prototype.io_reject_rcmdModel_relation = function(relations){
    let msg = this.emitMsgHeader('reject_relation');
    msg['relations'] = relations;
    this.socketEmitArray('insModel',msg);
}
ioObj.prototype.io_reject_rcmdModel_entity = function(entityId){
    let msg = this.emitMsgHeader('reject_entity');
    msg['id'] = entityId;
    this.socketEmitArray('insModel',msg);
}
ioObj.prototype.io_recover_relation = function(id){
    let msg = this.emitMsgHeader('recover_relation');
    msg['id'] = id;
    this.socketEmitArray('insModel',msg);
}
/* socket on */
/* rcmd model */
ioObj.prototype.io_reject_rcmdModel_relation_done = function(msg)
{
    //TODO 模型重绘,暂时使用直接刷新的简单方案，优化效率请参考引用推荐关系
    if (msg.error) {
        return
    } else {
        this.tmpMsgPop(msg.operationId);
        // $("g.entity.center").trigger("dblclick");
        // $("g.entity.center").trigger("dblclick");
        let nodeId = $('g.entity.center').attr("id");
        let node = {}
        node[nodeId] = eval('(' + JSON.stringify(instance_model.nodes[nodeId]) + ')');
        connection.io_recommend_insModel_node(node);
    }
}
ioObj.prototype.io_get_reject = function(){
    let msg = this.emitMsgHeader('get_reject');
    this.socketEmitArray('insModel',msg);
}
ioObj.prototype.io_get_reject_done = function(msg){
    if (msg.error) {
        return;
    } else {
        //alert(JSON.stringify(msg));
        this.tmpMsgPop(msg.operationId);

        let reject_model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
        data.completeRcmdModel(reject_model);
        //console.log(JSON.stringify(reject_model));
        data.completeRcmdModel(reject_model,recommend_model);
        //console.log(JSON.stringify(reject_model));
        //todo 理论上并不能完全解决insmodel里缺失的情况下不全的问题，需要解决,可能需要获取一个不包含拒绝的完整模型进行补全
        //alert(JSON.stringify(reject_model));
        //prepareNewEntity(reject_model, false);
        //alert(JSON.stringify(reject_model));
        let list= $('#reject-list');
        list.empty();
        let relations = reject_model.relations;
        for(let key in relations)
        {
            let type = relations[key].type;
            let content=$("<li ></li>");
            let area=$('<div class="col-xs-12"></div>')
            let rel=type+'：';
            let flag = false
            for(let role of relations[key].roles)
            {
                if(flag) rel+=',';
                else flag= true;
                let user = reject_model.nodes[role['node_id']].value;
                rel+=user;
            }
            let text=$('<h5></h5>');
            text.append(rel);
            let button='<button class="btn btn-primary pull-right recover-reject btn-sm" value="'+key+'">恢复</button>'

            content.append(area);
            area.append(text)
            area.append(button);
            list.append(content);
        }
        return;
    }
}
/* model */
ioObj.prototype.io_get_model_done = function (msg) {
    this.socket_mutex = false;
    if (msg.error) {
        return;
    } else {
        model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
        this.prepareModel();

        let msg2 = {
            operation: 'get',
            user_id: user,
            project_id: project,
            operation_id: 'op2'
        }
        this.socketEmit("insModel", msg2);
    }
}

ioObj.prototype.io_save_model_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        return;
    }
}
/* instanceModel */
ioObj.prototype.io_get_insModel_done = function (msg) {
    this.socket_mutex = false;
    if (msg.error) {
        return;
    } else {
        let msg3 = {
            operation: 'rcmd_entity',
            user_id: user,
            project_id: project,
            operation_id: 'op3',
            topk: 100
        }
        this.socketEmit("insModel", msg3);

        instance_model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
        prepareNewEntity();
        //prepareNewEntity(instance_model,false);
        //detail.drawIndex();
        this.initmode=1;
        let msg4 = {
            operation: 'rcmd',
            user: user,
            project : project,
            operation_id: 'op4',
        }
        this.socketEmit("insModel",msg4);
        //showGlobal();//不知道为什么，动态宽高后，直接显示network不正常。
        detail.rightColumnShow(index);
    }
}

ioObj.prototype.io_normal_done = function (msg) {
    if (msg.error) {
        return
    } else {
        this.tmpMsgPop(msg.operationId);
        //console.log("pop>>>>>>>>>>>>>");
    }
}


ioObj.prototype.io_create_insModel_node_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        this.migrateEmitMsg(msg.migrate);
        let curMsg = this.tmpMsgPop(msg.operationId);
        tagReformat.id2value(curMsg);

        let node = curMsg.nodes //tmpMsg.emit.nodes;
        let nodeId;
        for (nodeId in node) {
            instance_model.nodes[nodeId] = node[nodeId];
            break;
        }
        if (msg.migrate[nodeId]) nodeId = msg.migrate[nodeId];
        this.migrate(msg.migrate);
        return;
    }
}

ioObj.prototype.io_remove_insModel_node_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        let node = this.tmpMsgPop(msg.operationId).nodes;
        console.log("io_remove_insModel_node_done");
        console.log(node);
        let nodeId;
        for (nodeId in node) break;
        console.log(nodeId);
        data.removeNode(nodeId);
        return;
    }
}

ioObj.prototype.io_create_insModel_relation_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        this.migrateEmitMsg(msg.migrate);
        let curMsg = this.tmpMsgPop(msg.operationId);
        let relation = curMsg.relations;
        console.log(curMsg);
        tagReformat.id2value(curMsg);
        //let relation = tmpMsgPop(msg.operationId).relations //tmpMsg.emit.nodes;
        let relationId;
        for (relationId in relation) {
            instance_model.relations[relationId] = relation[relationId];
            break;
        }
        console.log(msg.migrate);
        if (msg.migrate[relationId]) relationId = msg.migrate[relationId];
        this.migrate(msg.migrate);
        if(this.testmode==0) //调试时不刷新图
        {
            let centerId = $("g.center").attr("id");
            let nodeId;
            for (let n in instance_model.relations[relationId].roles) {
                nodeId = instance_model.relations[relationId].roles[n].node_id;
                if (nodeId != centerId) break;
            }

            //if(!prepareNewEntity(instance_model,true,isGetRcmd)){
            if (!prepareNewEntity(instance_model, !svgPending, isGetRcmd)) {
                let notRecommendation = $("g.center.isCentralized").attr("id");
                if (svgPending > 0) {
                    svgPending--;
                    if (svgPending == 0) {
                        console.log(isGetRcmd);
                        if (isGetRcmd) {
                            isGetRcmd = false;
                            svg.svg.select("g.entity.center").classed("isCentralized", true)
                            $("g.entity.center").trigger("dblclick");
                        } else {
                            $('.properties-revise .button-ok').trigger("click");
                        }
                    }
                    return;
                }
                if (!notRecommendation) {//如果实在推荐的状态下，就直接刷新中心节点吧。一般为添加属性的情况。
                    $("#" + centerId).click();
                    network.setData();
                    return;
                } else {
                    $("#" + centerId).click();
                    network.setData();
                    //transAnimation(centerId,nodeId,relationId,instance_model);
                }
            }
        }

        return;
    }
}

ioObj.prototype.io_remove_insModel_relation_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        let relation = this.tmpMsgPop(msg.operationId).relations;
        let relationId;
        for (relationId in relation) break;
        delete instance_model["relations"][relationId];
        return;
    }
}

ioObj.prototype.io_revise_insModel_relation_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        return;
    }
}

ioObj.prototype.io_recommend_insModel_node_done = function (msg) {
    if (msg.error) {
        return;
    } else {

        this.tmpMsgPop(msg.operationId);

        recommend_model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }

        if(this.initmode==1)//初始化recommend_model以实现network高亮
        {
            //alert(JSON.stringify(recommend_model));
            data.completeRcmdModel(recommend_model);
            prepareNewEntity(recommend_model, false);
            this.initmode=0;
            showGlobal();
        }
        else{//正常描绘推荐
            let centerId = $("g.center").attr("id");
            recommend_model.nodes[centerId] = instance_model.nodes[centerId];

            data.completeRcmdModel(recommend_model);


            prepareNewEntity(recommend_model, false);


            //alert(JSON.stringify(recommend_model));

            // for(key in recommend_model.nodes)
            // {
            //     console.log(recommend_model.nodes[key].value);
            //     if(recommend_model.nodes[key].value=="") delete recommend_model.nodes[key];
            // }
            // console.log(recommend_model);

            //let centerId = $("g.center").attr("id");
            let entity = svg.getEntity(centerId, recommend_model);
            //svg.drawEntity(centerId,recommend_model);
            svg.drawRecommendation(centerId, recommend_model, instance_model)
            //drawRecommendation(entity.neighbours, instance_model);    //绘制推荐模型
            //drawRecommendation(recommend_model, instance_model);    //绘制推荐模型
        }
        return;
    }
}

ioObj.prototype.io_recommend_insModel_index_done = function (msg) {
    this.socket_mutex = false;
    if (msg.error) {
        return;
    } else {
        this.tmpMsgPop(msg.operationId);

        let tmpModel = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
        prepareNewEntity(tmpModel, false);

        data.recommend_index_init();
        for (let key in tmpModel.nodes) {
            if (instance_model.nodes[key] == undefined) {
                if (data.isEntity(key, tmpModel)) {
                    //recommend_index.push(tmpModel.nodes[key].value);
                    recommend_index[tmpModel.nodes[key].tags[0]].push(tmpModel.nodes[key].value);
                }
            }
        }
        return;
    }
}

ioObj.prototype.io_recommend_insModel_entity_done = function (msg) {
    this.socket_mutex = false;
    if (msg.error) {
        return;
    } else {
        this.tmpMsgPop(msg.operationId);

        let tmpModel = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
        prepareNewEntity(tmpModel, false);
        data.recommend_index_init();
        for (let key in tmpModel.nodes) {
            if (instance_model.nodes[key] == undefined) {
                if (data.isEntity(key, tmpModel)) {
                    //recommend_index.push(tmpModel.nodes[key].value);
                    recommend_index[tmpModel.nodes[key].tags[0]].push(tmpModel.nodes[key].value);
                }
            }
        }
        return;
    }
}

ioObj.prototype.io_recommend_insModel_relation_done = function (msg) {
    if (msg.error) {
        return;
    } else {
        recommend_model = {
            "nodes": msg.nodes,
            "relations": msg.relations
        }
        return;
    }
}

ioObj.prototype.migrate = function (obj, model = instance_model) {
    if (obj == undefined) return;
    for (let key in obj) {
        if (key == obj[key]) continue;//对应推荐的情况；

        if (model["nodes"][key] != undefined) {
            if (model["nodes"][obj[key]] == undefined) model["nodes"][obj[key]] = {};
            copyObj(model["nodes"][obj[key]], model["nodes"][key])
            delete model["nodes"][key];

            for (let rel in model["relations"]) {
                for (let n in model["relations"][rel]["roles"]) {
                    let tmp = model["relations"][rel]["roles"][n];
                    if (tmp["node_id"] == key) tmp["node_id"] = obj[key];
                }
            }
        }
        if (model["relations"][key] != undefined) {
            if (model["relations"][obj[key]] == undefined) model["relations"][obj[key]] = {};
            copyObj(model["relations"][obj[key]], model["relations"][key])
            delete model["relations"][key];
        }
    }
    //console.log(tmpMsg.emit)
    return;
}

ioObj.prototype.migrateEmitMsg = function (obj) {
    if (obj == undefined) return;
    for (let key in obj) {
        if (key == obj[key]) continue; //实际上没有发生改变
        //if(key.indexOf("front_n")!=-1){
        //更新emit里面的id
        for (let emitMsgOrder in this.tmpMsg.emit) {
            let tmpMsp = this.tmpMsg.emit[emitMsgOrder];
            if (tmpMsp["nodes"]) {
                if (!tmpMsp["nodes"][key]) continue; //EmitArray可能不存在当前节点
                else {
                    if (tmpMsp["nodes"][obj[key]] == undefined) tmpMsp["nodes"][obj[key]] = {};
                    copyObj(tmpMsp["nodes"][obj[key]], tmpMsp["nodes"][key])
                    delete tmpMsp["nodes"][key];
                }
            }
            if (tmpMsp["relations"]) {
                for (let rel in tmpMsp["relations"]) {
                    for (let n in tmpMsp["relations"][rel]["roles"]) {
                        let tmp = tmpMsp["relations"][rel]["roles"][n];
                        if (tmp["node_id"] == key) {
                            tmp["node_id"] = obj[key];
                        }
                    }
                }
            }
            if (tmpMsp["keyAttr"]) {
                for(let i in tmpMsp["keyAttr"]){
                    if(tmpMsp["keyAttr"][i].id == key){
                        tmpMsp["keyAttr"][i].id = obj[key];
                    }
                    if(tmpMsp["keyAttr"][i].keyAttr == key){
                        tmpMsp["keyAttr"][i].keyAttr = obj[key];
                    }
                }
            }
        }
        //}
        //if(key.indexOf("front_r")!=-1){
        //更新emit里面的id
        for (let emitMsgOrder in this.tmpMsg.emit) {
            let tmpMsp = this.tmpMsg.emit[emitMsgOrder];
            if (tmpMsp["relations"]) {
                if (!tmpMsp["relations"][key]) continue; //EmitArray可能不存在当前节点
                else {
                    if (tmpMsp["relations"][obj[key]] == undefined) tmpMsp["relations"][obj[key]] = {};
                    copyObj(tmpMsp["relations"][obj[key]], tmpMsp["relations"][key])
                    delete tmpMsp["relations"][key];
                }
            }
        }
        //}
    }

    return;
}


ioObj.prototype.tmpMsgPop = function (operationId) {

    let tmpObj = {};
    for (let n in this.tmpMsg.emit) {
        if (this.tmpMsg.emit[n].operationId == operationId) {
            copyObj(tmpObj, this.tmpMsg.emit[n])
            this.tmpMsg.emit.splice(n, 1);
            this.tmpMsg.type.splice(n, 1)
        }
    }

    if (this.tmpMsg.emit.length > 0) {    //为什么明明等于0还是等进入
        this.socketEmit(this.tmpMsg.type[0], this.tmpMsg.emit[0]);
    } else {
        this.socket_mutex = false
    }
    return tmpObj;
}

ioObj.prototype.prepareModel = function (){
    symbolArray = [];
    keyValueArray = [];
    let key_attr_list;
    for (let key in model.nodes) {
        if (model.nodes[key].tag == "Symbol") symbolArray.push(model.nodes[key].value)
        if (model.nodes[key].tag == "Entity") {
            key_attr_list = model.nodes[key].key_attr_list;
            for (let i in key_attr_list) {
                keyValueArray.push(model.relations[key_attr_list[i]].value);
            }
        }
    }

    relationTypeArray = [];
    for (let key in model.relations) {
        let count = 0;
        for (let role of model.relations[key].roles) {
            if (model.nodes[role.node_id] == undefined) continue;
            if (model.nodes[role.node_id].tag == "Entity") {
                count++;
                if (count > 1) {
                    relationTypeArray.push(model.relations[key].value);
                    break;
                }
            }
        }
    }
}
