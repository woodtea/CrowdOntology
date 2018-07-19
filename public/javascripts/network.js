
function networkObj(){

    //this.colorsArray = ["#778899","#F08080","#008B8B","#D2E5FF"]

    let that = this;
    this.network = new vis.Network(that.getContainer(),that.getData(),that.getOptions());

    this.network.on("click", function (params) {
        if (params.nodes.length == 1) {
        }else if(params.edges.length == 1){
            //clickOnEdge
            let id = params.edges[0]
            let edge = that.network.body.data.edges._data[id];

            if(that.network.body.data.nodes._data[edge.from].group == "__relation"){
                that.network.selectNodes([edge.from])
            }else if(that.network.body.data.nodes._data[edge.to].group == "__relation"){
                that.network.selectNodes([edge.to])
            }
        }
    });

    this.network.on("doubleClick", function (params) {
        if(params.nodes.length==1){
            let id = params.nodes[0]
            that.showNodeDetail(id)
            console.log(that.network.body.data.nodes._data[id].group);
        }else if(params.edges.length == 1){
            //clickOnEdge
            let id = params.edges[0]
            let edge = that.network.body.data.edges._data[id];
            console.log(edge);
            if(that.network.body.data.nodes._data[edge.from].group == "__relation"){
                that.network.selectNodes([edge.from])
            }else if(that.network.body.data.nodes._data[edge.to].group == "__relation"){
                that.network.selectNodes([edge.to])
            }
        }
    });
}

networkObj.prototype.setData = function(){
    this.network.setData(this.getData());
}


networkObj.prototype.showNodeDetail = function(nodeId){
    $("#modalNetwork").modal('hide')
    svg.drawEntity(nodeId, instance_model); //画出中心区域
    //$("#"+nodeId).trigger("click");
}


networkObj.prototype.getContainer = function(){
    return $("#modalNetwork .modal-body")[0];//因为要求的是js对象
}

networkObj.prototype.getOptions = function(){
    var options = {
        nodes: {
            shape: 'dot',
            size: 16,
            color:{
                background:'#D2E5FF',
                border:'#2B7CE9',
                highlight:{
                    background:'#F9D456',
                    border:'#f0ad4e'
                }
            }
        },
        edges: {
            color:{
                color:'#337ab7',//#2e6da4
                highlight: '#f0ad4e'//#eea236
            }
        },
        groups:{

        }
    };

    let i = 0;
    for(let key in model.nodes){
        if(model.nodes[key].tag == "Entity"){
            let group = model.nodes[key].value;
            options.groups[group] = {
                color:{
                    background: this.colorsArray[i],//'#D2E5FF',
                    border:'#2B7CE9'
                }
            }
            i++;
        }
    }

    options.groups["__relation"] = {
        shape:"square",
        size : 6,
        font:{
            size:12
        }
    }

    return options;
}

networkObj.prototype.getData = function(){

    let nodes = [],edges = [];
    for(let id in instance_model.nodes){
        if(data.isEntity(id)) {
            nodes.push({
                id: id,
                label: instance_model.nodes[id].value,
                group: instance_model.nodes[id].tags[0]
            })
        }
    }

    for(let id in instance_model.relations){
        let isAttribute = false;
        let roles = instance_model.relations[id].roles;
        for(let i in roles){
            if(!data.isEntity(roles[i].node_id)) {
                isAttribute = true;
                break;
            }
        }

        if(isAttribute) continue;

        nodes.push({
            id: id,
            label: instance_model.relations[id].type,
            group: "__relation"
        })

        for(let i in roles){
            edges.push({from:id,to:roles[i].node_id})
       }
    }

    return {
        nodes: nodes,
        edges: edges
    };
}

networkObj.prototype.uniqueEdges = function(edges){
    let record = {};
    for(let i in edges){
        if(record[edges[i].from] == undefined) record[edges[i].from]={};
        if(record[edges[i].from][edges[i].to] == undefined) record[edges[i].from][edges[i].to] = 1;
        else{
            edges.splice(i,1);
        }
    }
}
