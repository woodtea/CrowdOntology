var instance_model = {nodes:{}, relations:{}}
var model = {nodes:{}, relations:{}}
var recommend_model = {nodes:{}, relations:{}}
var recommend_model_whole = {}
var recommend_index = {}



function recommend_index_init(){
    for(let key in model.nodes){
        if(model.nodes[key].tag == "Entity"){
            recommend_index[model.nodes[key].value] = [];
        }
    }
}

function removeNodeInRecommendIndex(type,value){
    if(recommend_index[type] != undefined) {
        let order = recommend_index[type].indexOf(value);
        if(order != -1) recommend_index[type].splice(order,1);
    }

    return;
}
