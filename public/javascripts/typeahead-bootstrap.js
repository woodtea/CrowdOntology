//Index
function getIndexArray(tmpModel=instance_model){
    let indexArray = [];
    for (let id in tmpModel.nodes) {
        if (data.isEntity(id)) {
            indexArray.push(tmpModel.nodes[id].value);
        }
    }
    return indexArray;
}

function setIndexTypeahead(array){
    $('#stigmod-search-left-input').typeahead({
        source: array,
        minLength: 0,
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: true,
        items:8
    });
}

//Entity
function getEntityTypes(tmpModel=model){
    let array = [];
    for(let key in tmpModel.nodes){
        if(tmpModel.nodes[key].tag == "Entity"){
            array.push(tmpModel.nodes[key].value);
        }
    }
    return array;
}

function setClassTypeTypeahead(array){
    $('#class-revise .type-input').typeahead({
        source: array,
        minLength: 0,
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: true
    });
}

function setClassValueTypeahead(){
    $('#class-revise .value-input').typeahead({
        source: function(querry,process){
            let type = $('#class-revise .type-input').val();
            let array = [];
            if(type == ""){
                console.log("Alert: In ClassValueTypeahead, class type is \"\"");
                for(let key in recommend_index){
                    array.push(...recommend_index[key]);
                }
            }
            else if(recommend_index[type] == undefined) {
                array = [];
                console.log("Alert:recommend_index."+type+" is empty")
            }else{
                array = recommend_index[type];
            }
            //if(array.length == 0) array = ["[==Not Found==]"];
            return process(array);
        },
        minLength: 0,
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: true
        /*
        , afterSelect: function (item) {
            //选择项之后的事件 ，item是当前选中的。
            if(item == "[==Not Found==]") {
                alert(item);
                $('#class-revise .value-input').val("");
            }
        },
        */
    });
}

//ttribute
function getAttributeTypes(nodeId){
    let tmpAtrrArray = [];
    tmpAtrrArray.push(instance_model.nodes[nodeId].dataType);
    //keyValueArray
    let wholeAttrArray = [];
    let tmpR,n,m;
    //在instance_model中获取当前类型
    for(let r in instance_model.relations){
        tmpR = instance_model.relations[r];
        for(n=0;n<tmpR.roles.length;n++){
            if(tmpR.roles[n].node_id == nodeId) break;
        }
        if(tmpR.roles[n] != undefined) {
            tmpAtrrArray.push(tmpR.type);
        }
    }
    //console.log(tmpAtrrArray);

    //找到entityId
    let tag = instance_model.nodes[nodeId].tags[0];
    let entityId;
    for(entityId in model.nodes){
        if(model.nodes[entityId].value == tag) break;
    }

    //在model中获取所有类型
    for(let r in model.relations){
        tmpR = model.relations[r];
        for(n=0;n<tmpR.roles.length;n++){
            if(tmpR.roles[n].node_id == entityId) break;
        }
        if(tmpR.roles[n] != undefined) {
            //先判断是否为attr
            for(m=0;m<tmpR.roles.length;m++){
                if(model.nodes[tmpR.roles[m].node_id].tag == "Symbol") break;
            }
            //是attr所以介入
            if(tmpR.roles[m] != undefined) wholeAttrArray.push(tmpR.value);
        }
    }
    //求差集
    let array = [];
    wholeAttrArray.forEach((a)=>{
        let c = tmpAtrrArray.findIndex(b=>a == b);
        if (c == -1) array.push(a);
    })
    return array;
}

function setAttributeTypeTypeahead(array){
    $('#attribute-revise .type-input').typeahead({
        source: array,
        minLength: 0,
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: true
    });
}
/*
function setAttributeValueTypeahead(array){
    $('#attribute-revise .value-input').typeahead({
        source: array,
        minLength: 0,
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: true
    });
}
*/
//Relation
function getRelationTypes(nodeId){
    let tmpArray = [];
    let wholeArray = [];
    let tmpR,n,m;
/*  relation可以重复，故将tmpArray设置为空
    //在instance_model中获取当前类型
    for(let r in instance_model.relations){
        tmpR = instance_model.relations[r];
        for(n=0;n<tmpR.roles.length;n++){
            if(tmpR.roles[n].node_id == nodeId) break;
        }
        if(tmpR.roles[n] != undefined) tmpArray.push(tmpR.type);
    }
*/
    //找到entityId
    let tag = instance_model.nodes[nodeId].tags[0];
    let entityId;
    for(entityId in model.nodes){
        if(model.nodes[entityId].value == tag) break;
    }

    //在model中获取所有类型
    for(let r in model.relations){
        tmpR = model.relations[r];
        for(n=0;n<tmpR.roles.length;n++){
            if(tmpR.roles[n].node_id == entityId) break;
        }
        if(tmpR.roles[n] != undefined) {
            //先判断是否为relation
            for(m=0;m<tmpR.roles.length;m++){
                if(model.nodes[tmpR.roles[m].node_id].tag == "Symbol") break;
            }
            //是relation所以介入
            if(tmpR.roles[m] == undefined) wholeArray.push(tmpR.value);
        }
    }
    //求差集
    let array = [];
    wholeArray.forEach((a)=>{
        let c = tmpArray.findIndex(b=>a == b);
        if (c == -1) array.push(a);
    })
    return array;
}


function setRelationTypeTypeahead(array){
    $('#relation-revise .type-input').typeahead({
        source: array,
        minLength: 0,
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: true
    });
}


//
function getRelationValues(nodeId){
    //给关系和类型吧
    let entities = {};
    for(let key in instance_model.nodes){
        //if(key != nodeId){//关系的另一段可以是他本身
        let tmp = instance_model.nodes[key];
        if(symbolArray.indexOf(tmp.tags[0])==-1) {
            if(entities[tmp.tags[0]]==undefined) entities[tmp.tags[0]] = [];
            entities[tmp.tags[0]].push(tmp.value);
        }
        //}
    }
    return entities;
}

/*
function setRelationValueTypeahead(entities,nodeId){
    $('#relation-revise .value-input').typeahead({
        source: function(querry,process){
            let type = $('#relation-revise .type-input').val();
            type = getRoleUndertakerType(type,nodeId)[0];
            let array = [];
            if(type == ""){
                console.log("Alert: In setRelationValueTypeahead, relation type is \"\"");
                for(let key in entities){
                    array.push(...entities[key]);
                }
            }
            else if(entities[type] == undefined) {
                array = [];
                console.log("Alert:entities."+type+" is empty")
            }else{
                array = entities[type];
            }
            //if(array.length == 0) array = ["[==Not Found==]"];
            return process(array);
        },
        minLength: 0,
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: true
    });
}
*/

function setRelationRoleValueTypeahead(item,entities,nodeId){
    $(item).find('input.typeahead').typeahead({
        source: function(querry,process){
            let type = $(item).find(".tag").attr("value");
            if(entities[type] == undefined) {
                array = [];
                console.log("Alert:entities."+type+" is empty")
            }else{
                array = entities[type];
            }
            return process(array);
        },
        minLength: 0,
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: true
    });
}

function getRoleUndertakerType(relationType,uId){
    let types = [];
    let uType = instance_model.nodes[uId].tags[0];

    for(let r in model.relations){
        let countUId = 0;//UId在问题中出现的次数
        if(model.relations[r].value == relationType){//找到对应关系
            let relation = model.relations[r];
            for(let n in relation.roles){//遍历所有角色
                let tmpType = model.nodes[relation.roles[n].node_id].value;
                if(tmpType == uType){
                    countUId++;
                    continue;
                }else{
                    types.push(tmpType);
                }
            }
            if(countUId>1) types.push(uType);
        }
    }

    return unique(types);
}


function unique(arr) {
    if (arr.length == 0 || arr.length == 1)
        return arr;
    arr.sort();
    var res = [];
    res.push(arr[0]);
    var last = arr[0];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != last) {
            res.push(arr[i]);
            last = arr[i];
        }
    }
    return res;
}