function modelObj(svg = "") {
    /*
     this.instance_model = {nodes:{}, relations:{}}
     this.model = {nodes:{}, relations:{}}
     this.recommend_model = {nodes:{}, relations:{}}
     this.recommend_index = {}

     this.user = "";
     this.project = "";
     this.symbolArray  = ["String"];
     this.keyValueArray = ["姓名","名字","名称","片名"];
     this.isGetRcmd = false;
     */
    this.pendingInsRel = [];
}


modelObj.prototype.getEntity = function (id, tmpModel = instance_model) {
    //判断是否是实体
    if (!this.isEntity(id,tmpModel)) return;
    //包括自己和邻接信息
    let entity = {
        centerNode: {},
        neighbours: {}
    }
    //处理自己的事件
    entity.centerNode[id] = {
        "value": tmpModel.nodes[id].value,
        "tages": tmpModel.nodes[id].tags,
        "dataType": tmpModel.nodes[id].dataType
    }
    //处理邻接信息
    for (let relationId in tmpModel.relations) {
        let isRelated = false;
        let centerIndex;
        let centerRolename;
        for (let roleIndex in tmpModel.relations[relationId].roles) {
            if (id == tmpModel.relations[relationId].roles[roleIndex].node_id) {
                isRelated = true;
                centerIndex = roleIndex;
                centerRolename = tmpModel.relations[relationId].roles[roleIndex].rolename;
            }
        }
        if (isRelated) {
            for (let roleIndex in tmpModel.relations[relationId].roles) {
                //节点为当前节点
                if (roleIndex == centerIndex) continue;
                //当前跳过了指向自己的情况
                let neighbourID = tmpModel.relations[relationId].roles[roleIndex].node_id;
                if (id == neighbourID) continue;
                //判断是否存在，如果尚未存在则初始化
                if (entity.neighbours[neighbourID] == undefined) {
                    if (tmpModel.nodes[neighbourID] == undefined) {
                        alert("Not found!" + neighbourID);
                        console.log("alert notfound in getEntity");
                        console.log(neighbourID);
                        console.log(tmpModel);
                        continue;
                    }
                    entity.neighbours[neighbourID] = {
                        "value": tmpModel.nodes[neighbourID].value,
                        "relations": []
                    }
                    if (tmpModel.nodes[neighbourID].tags != undefined) entity.neighbours[neighbourID].tags = tmpModel.nodes[neighbourID].tags;
                    if (tmpModel.nodes[neighbourID].dataType != undefined) entity.neighbours[neighbourID].dataType = tmpModel.nodes[neighbourID].dataType;
                }
                //插入关系
                let relation = {
                    "id": relationId,
                    "value": tmpModel.relations[relationId].type,
                    "roleIndex": roleIndex,
                    "name": centerRolename + " - " + tmpModel.relations[relationId].roles[roleIndex].rolename,
                    "label": centerIndex + "-" + roleIndex
                }
                if (centerRolename == "") {
                    relation.name = tmpModel.relations[relationId].roles[roleIndex].rolename;
                }
                entity.neighbours[neighbourID].relations.push(relation);
            }
        }
    }

    return entity;
}

modelObj.prototype.removeNode = function (nodeId, tmpModel = instance_model) {
    console.log(nodeId);
    console.log("removeNode");
    let entity = svg.getEntity(nodeId);
    console.log(entity);
    delete tmpModel.nodes[nodeId];
    for(let relationId in entity.relations){
        delete tmpModel.relations[relationId];
    }
    network.setData();
    return;
}

modelObj.prototype.getAttrTags = function (nodeId, attribute) {
    return ["String"];
}

modelObj.prototype.isEntity = function (id, model = instance_model, alertmode=true) {

    if (model.nodes[id] == undefined) {
        if(alertmode)
        {
            console.log("Alert: entity not found!")
            console.log("entity id:" + id);
        }
        return;
    }
    if (model.nodes[id].tags == undefined) return; //数据结构异常

    let tags = model.nodes[id].tags;
    for (let n in tags) {
        if (symbolArray.indexOf(tags[n]) == -1) {
            return true; //isEntity
        }
    }

    return false;
}

modelObj.prototype.getEntityIdByRelation = function (relationId, index0, index1, model = instance_model) {

    if (model.relations[relationId] == undefined) return;    //rcmd中比较常见

    let roles = model.relations[relationId].roles;
    let nodeIds = [];
    nodeIds.push(roles[index0].node_id);
    nodeIds.push(roles[index1].node_id);

    for (let i in roles) {
        if (i != index0 && i != index1) {
            nodeIds.push(roles[i].node_id);
        }
    }

    return nodeIds;
}

modelObj.prototype.getEntityIdByValue = function (value, tmpModel = instance_model, type) {

    let ids = [];

    for (let id in tmpModel.nodes) {
        if (tmpModel.nodes[id].value == value) {
            if(type!=undefined){
                if(type != tmpModel.nodes[id].tags[0]) continue;
            }
            ids.push(id);

        }
    }

    return ids;
}

modelObj.prototype.getKeyAttribute = function (entityIdArray) {
    let entityId = entityIdArray[0];
    //在model中获取所有类型
    let n, tmpR;
    for (let r in model.relations) {
        tmpR = model.relations[r];
        for (n = 0; n < tmpR.roles.length; n++) {
            if (tmpR.roles[n].node_id == entityId) break;
        }
        if (tmpR.roles[n] != undefined) {
            if (keyValueArray.indexOf(tmpR.value) != -1)  return tmpR.value;
        }
    }
    return "姓名";//default
}


modelObj.prototype.recommend_index_init = function () {
    for (let key in model.nodes) {
        if (model.nodes[key].tag == "Entity") {
            recommend_index[model.nodes[key].value] = [];
        }
    }
}

modelObj.prototype.removeNodeInRecommendIndex = function (type, value) {
    if (recommend_index[type] != undefined) {
        let order = recommend_index[type].indexOf(value);
        if (order != -1) recommend_index[type].splice(order, 1);
    }
    return;
}

modelObj.prototype.completeRcmdModel = function (rcmdModel = recommend_model, tmpModel = instance_model) {
    for (let id in rcmdModel.nodes) {
        if (rcmdModel.nodes[id].value == "") {
            if (tmpModel.nodes[id] != undefined) {
                rcmdModel.nodes[id].value = tmpModel.nodes[id].value;
                rcmdModel.nodes[id].dataType = tmpModel.nodes[id].dataType;
            }
        }
    }

}

modelObj.prototype.isCreationIllegal = function (type, tag, value, roles) {
    let hasError;
    let err = "";
    switch (type) {
        case "class":
            hasError = true;
            for (let key in model.nodes) {
                if (model.nodes[key].value == tag) hasError = false;
            }
            if (tag == "String") hasError = true;
            if (hasError) err += "创建类型不合法\n 请检查关系类型和对应的承担者";

            hasError = false;
            for (let key in instance_model.nodes) {
                if (data.isEntity(key) && instance_model.nodes[key].value == value && instance_model.nodes[key].tags[0] == tag) {
                    hasError = true;
                    break;
                }
            }
            if (hasError) err += "创建实体已存在\n";
            break;
        case "attribute":
            hasError = true;
            for (let key in model.relations) {
                if (model.relations[key].value == tag) {
                    let roles = model.relations[key].roles;
                    for (let n in roles) {
                        if (model.nodes[roles[n].node_id].tag == "Symbol") {
                            hasError = false;
                            break;
                        }
                    }
                }
            }
            if (hasError) err += "创建类型不合法\n";

            hasError = false;
            for (let key in instance_model.relations) {
                if (instance_model.relations[key].type == tag) {
                    let centerId = $("g.center").attr("id");
                    let roles = instance_model.relations[key].roles;
                    for (let n in roles) {
                        if (roles[n].node_id == centerId) {
                            if (isRevise) {
                                //判断属性是否修改
                                if (roles[1 - n].node_id == data.getEntityIdByValue(value)[0]) {
                                    hasError = true
                                    break;
                                }
                            } else {//同名属性
                                hasError = true
                                break;
                            }
                        }
                    }
                    if (hasError) break;
                }
            }
            if (hasError) err += "创建属性已存在\n";
            break;
        case "relation":
            //角色与承担者是否一致
            for (let i in roles) {
                if (roles[i].nodeId != undefined) {
                    if (roles[i].tag != instance_model.nodes[roles[i].nodeId].tags[0]) {
                        err += "角色\"" + roles[i].rolename + "(" + roles[i].tag + ")\"无法由\"" +
                            roles[i].node + "(" + instance_model.nodes[roles[i].nodeId].tags[0] + ")\"承担";
                        break
                    }
                }
            }
            //关系是否已经存在
            break;
            hasError = true;
            for (let key in model.relations) {
                if (model.relations[key].value == tag) {
                    hasError = false;
                    let roles = model.relations[key].roles;
                    //model.nodes[roles[0].node_id].value
                    //model.nodes[roles[1].node_id].value
                    let tags0 = instance_model.nodes[node0Id].tags;
                    let tags1 = instance_model.nodes[node1Id].tags;
                    if (model.nodes[roles[0].node_id].value != tags0 || model.nodes[roles[1].node_id].value != tags1) {
                        hasError = true;
                        break;
                    }
                    if (!hasError) break;
                }
            }
            if (hasError) err += "创建类型不合法\n";

            hasError = false;
            //let centerId = $("g.center").attr("id");
            for (let key in instance_model.relations) {
                if (instance_model.relations[key].type != tag) continue;
                let roles = instance_model.relations[key].roles;
                if (roles[0].node_id == node0Id && roles[1].node_id == node1Id) {
                    hasError = true
                    break;
                }
            }
            if (hasError) err += "创建关系已存在\n";
            break;
    }
    return err;
}


