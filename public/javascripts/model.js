
function modelObj(svg=""){
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
}


modelObj.prototype.getEntity = function(id, model = instance_model) {
    //判断是否是实体
    if (!this.isEntity(id)) return;
    //包括自己和邻接信息
    let entity = {
        centerNode: {},
        neighbours: {}
    }
    //处理自己的事件
    entity.centerNode[id] = {
        "value": model.nodes[id].value,
        "tages": model.nodes[id].tags,
        "dataType": model.nodes[id].dataType
    }
    //处理邻接信息
    for (let relationId in model.relations) {
        let isRelated = false;
        let centerIndex;
        let centerRolename;
        for (let roleIndex in model.relations[relationId].roles) {
            if (id == model.relations[relationId].roles[roleIndex].node_id) {
                isRelated = true;
                centerIndex = roleIndex;
                centerRolename = model.relations[relationId].roles[roleIndex].rolename;
            }
        }
        if (isRelated) {
            for (let roleIndex in model.relations[relationId].roles) {
                //节点为当前节点
                if(roleIndex == centerIndex) continue;
                //当前跳过了指向自己的情况
                let neighbourID = model.relations[relationId].roles[roleIndex].node_id;
                if (id == neighbourID) continue;
                //判断是否存在，如果尚未存在则初始化
                if (entity.neighbours[neighbourID] == undefined) {
                    if(model.nodes[neighbourID]==undefined){
                        alert("Not found!" + neighbourID);
                        console.log("alert notfound in getEntity");
                        console.log(neighbourID);
                        console.log(model);
                        continue;
                    }
                    entity.neighbours[neighbourID] = {
                        "value": model.nodes[neighbourID].value,
                        "relations": []
                    }
                    if (model.nodes[neighbourID].tags != undefined) entity.neighbours[neighbourID].tags = model.nodes[neighbourID].tags;
                    if (model.nodes[neighbourID].dataType != undefined) entity.neighbours[neighbourID].dataType = model.nodes[neighbourID].dataType;
                }
                //插入关系
                let relation = {
                    "id": relationId,
                    "value": model.relations[relationId].type,
                    "roleIndex": roleIndex,
                    "name": centerRolename + " - " +  model.relations[relationId].roles[roleIndex].rolename,
                    "label": centerIndex+"-"+roleIndex
                }
                if(centerRolename == ""){
                    relation.name = model.relations[relationId].roles[roleIndex].rolename;
                }
                entity.neighbours[neighbourID].relations.push(relation);
            }
        }
    }

    return entity;
}

modelObj.prototype.isEntity = function(id, model=instance_model){

    if(model.nodes[id] == undefined){
        console.log("Alert: entity not found!")
        console.log("entity id:"+id);
        return;
    }
    if (model.nodes[id].tags == undefined) return; //数据结构异常

    let tags = model.nodes[id].tags;
    for(let n in tags){
        if(symbolArray.indexOf(tags[n]) == -1){
            return true; //isEntity
        }
    }

    return false;
}

modelObj.prototype.getEntityIdByRelation = function(relationId,index0,index1, model=instance_model) {

    if(model.relations[relationId] == undefined) return;    //rcmd中比较常见

    let roles = model.relations[relationId].roles;
    let nodeIds = [];
    nodeIds.push(roles[index0].node_id);
    nodeIds.push(roles[index1].node_id);

    for(let i in roles){
        if(i!=index0&&i!=index1){
            nodeIds.push(roles[i].node_id);
        }
    }

    return nodeIds;
}

modelObj.prototype.getEntityIdByValue = function(value, model = instance_model) {
    for(let id in model.nodes){
        if(model.nodes[id].value == value ){
            return id;
        }
    }
    return ;
}

modelObj.prototype.getKeyAttribute = function(entityIdArray){
    let entityId = entityIdArray[0];
    //在model中获取所有类型
    let n,tmpR;
    for(let r in model.relations){
        tmpR = model.relations[r];
        for(n=0;n<tmpR.roles.length;n++){
            if(tmpR.roles[n].node_id == entityId) break;
        }
        if(tmpR.roles[n] != undefined) {
            if(keyValueArray.indexOf(tmpR.value) != -1)  return tmpR.value;
        }
    }
    return "姓名";//default
}


modelObj.prototype.recommend_index_init = function(){
    for(let key in model.nodes){
        if(model.nodes[key].tag == "Entity"){
            recommend_index[model.nodes[key].value] = [];
        }
    }
}

modelObj.prototype.removeNodeInRecommendIndex = function(type,value){
    if(recommend_index[type] != undefined) {
        let order = recommend_index[type].indexOf(value);
        if(order != -1) recommend_index[type].splice(order,1);
    }
    return;
}
