var user;
var project;
var symbolArray  = ["String"];
var keyValueArray = ["姓名","名字","名称"];

var recommend_model = {}
/*
  * 其实可以改模型为类
  * class model {
  *  constructor(){}
  * */

function getModel() {
    return instance_model;
}

function updateModel() {

}

function getIndex(model = instance_model) {
    let index = {};
    for (let id in model.nodes) {
        if (isEntity(id)) {
            index[id] = model.nodes[id].value;
        }
    }
    return index;
}


function getEntity(id, model = instance_model) {
    //判断是否是实体
    if (!isEntity(id)) return;
    //包括自己和邻接信息
    let entity = {
        centerNode: {},
        neighbours: {}
    }
    //处理自己的事件
    entity.centerNode[id] = {
        "value": model.nodes[id].value,
        "tages": model.nodes[id].tags
    }
    //处理邻接信息
    for (let relationID in model.relations) {
        let isRelated = false;
        for (let roleIndex in model.relations[relationID].roles) {
            if (id == model.relations[relationID].roles[roleIndex].node_id) isRelated = true;
        }
        if (isRelated) {
            let relation = {
                "id": relationID,
                "value": model.relations[relationID].type
            }
            for (let roleIndex in model.relations[relationID].roles) {
                let neighbourID = model.relations[relationID].roles[roleIndex].node_id;
                if (id == neighbourID) continue;
                //判断是否存在，如果尚未存在则初始化
                if (entity.neighbours[neighbourID] == undefined) {
                    entity.neighbours[neighbourID] = {
                        "value": model.nodes[neighbourID].value,
                        "relations": []
                    }
                    if (model.nodes[neighbourID].tags != undefined) entity.neighbours[neighbourID].tags = model.nodes[neighbourID].tags;
                    if (model.nodes[neighbourID].dataType != undefined) entity.neighbours[neighbourID].dataType = model.nodes[neighbourID].dataType;
                }
                //插入关系
                entity.neighbours[neighbourID].relations.push(relation);
                //这里好像没有处理relationRole
            }
        }
    }
    return entity;
}

function isEntity(id,model=instance_model){
    if (model.nodes[id].tags == undefined) return; //数据结构异常

    let tags = model.nodes[id].tags;
    for(let n in tags){
        if(symbolArray.indexOf(tags[n]) == -1){
            return true; //isEntity
        }
    }

    return false;
}


function getRelation(id1, id2, model = instance_model) {
    let entity1 = getEntity(id1, model);
    let entity2 = getEntity(id2, model);
    return [entity1, entity2];
}

function getEntityIdByRelation(relationId, model = instance_model) {

    if(model.relations[relationId] == undefined) return;    //rcmd中比较常见

    let roles = model.relations[relationId].roles;
    let nodeIDs = [];
    for (let role of roles) {
        nodeIDs.push(role.node_id);
    }
    return nodeIDs;
}

function getEntityIdByValue(value, model = instance_model) {
    for(let id in model.nodes){
        if(model.nodes[id].value == value ){
            return id;
        }
    }
    return ;
}

function getEntityTagsById(id,model=instance_model){
    alert(id)
    for(let key in model.nodes){
        alert(model.nodes[key].value);
        if(model.nodes[key].value == id) return model.nodes[key].tags;
    }
    return;
}