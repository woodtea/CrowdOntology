
const colorsArray = ["#D2E5FF","#778899","#008B8B","#F08080"]

var network
function getContainer(){
    return $("#modalNetwork .modal-body")[0];//因为要求的是js对象
}

function getOptions(){
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
                    background: colorsArray[i],//'#D2E5FF',
                    border:'#2B7CE9'
                }
            }
            i++;
        }
    }
    console.log(options)

    return options;
}

function getData(){
    let nodes = [],edges = [];
    for(let id in instance_model.nodes){
        if(isEntity(id)) {
            nodes.push({
                id: id,
                label: instance_model.nodes[id].value,
                group: instance_model.nodes[id].tags[0]
            })
        }
    }

    for(let id in instance_model.relations){
        let roles = instance_model.relations[id].roles;
        let order = 0;
        if(roles[0].node_id>roles[1].node_id){
            order = 1;
        }
        edges.push({from:roles[order].node_id,to:roles[1-order].node_id})
        uniqueEdges(edges);
    }

    var data = {
        nodes: nodes,
        edges: edges
    };
console.log(data);
    return data;
}

function initNetwork(){
    network = new vis.Network(getContainer(), getData(), getOptions());

    network.on("doubleClick", function (params) {
        if(params.nodes.length==1){
            showNodeDetail(params.nodes[0])
        }else if(params.edges.length == 1){
            //network.edges(params.edges[0])
        }
    });

    //network.redraw();
}

function uniqueEdges(edges){
    let record = {};
    for(let i in edges){
        if(record[edges[i].from] == undefined) record[edges[i].from]={};
        if(record[edges[i].from][edges[i].to] == undefined) record[edges[i].from][edges[i].to] = 1;
        else{
            edges.splice(i,1);
        }
    }
}

function showNodeDetail(nodeId){
    $("#modalNetwork").modal('hide')
    $("#"+nodeId).trigger("click");
}

$("#modalNetwork").on('shown.bs.modal',function(){
    initNetwork();
})