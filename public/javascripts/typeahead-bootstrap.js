/*
function getClassArray(model = model){
    return [""];
}

function setAttributeValueTypeahead(array){
    $('#attribute-revise .value-input').typeahead({
        source: array,
        minLength: 0,
        autoSelect: true
    });
}
 */

//
function getIndexArray(model = instance_model){
    let indexArray = [];
    for (let id in model.nodes) {
        if (isEntity(id)) {
            indexArray.push(model.nodes[id].value);
        }
    }
    return indexArray;
}

function setIndexTypeahead(array){
    $('#stigmod-search-left-input').typeahead({
        source: array,
        minLength: 0,
        showHintOnFocus: true,
        autoSelect: true
    });
}

//
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
        autoSelect: true
    });
}

function setClassValueTypeahead(){
    $('#class-revise .value-input').typeahead({
        source: recommend_index,
        minLength: 0,
        showHintOnFocus: true,
        autoSelect: true
    });
}
//
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
    console.log(tmpAtrrArray);

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
        autoSelect: true
    });
}

//
function getRelationTypes(nodeId){
    let tmpArray = [];
    let wholeArray = [];
    let tmpR,n,m;
/*
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
        autoSelect: true
    });
}


//
function getRelationValues(nodeId){
    let array = [];
    for(let key in instance_model.nodes){
        if(key != nodeId){
            let tmp = instance_model.nodes[key];
            if(tmp.tags.indexOf("String")==-1) array.push(tmp.value);
        }
    }
    return array;
}


function setRelationValueTypeahead(array){
    $('#relation-revise .value-input').typeahead({
        source: array,
        minLength: 0,
        showHintOnFocus: true,
        autoSelect: true
    });
}
