function networkObj() {

    //this.colorsArray = ["#778899","#F08080","#008B8B","#D2E5FF"]

    let that = this;
    //console.log('draw begin');
    //let container = that.getContainer() , data = that.getData() , options = that.getOptions();
    //console.log("data end");
    this.network = new vis.Network(that.getContainer(),that.getData(),that.getOptions());
    //console.log("draw end");


    this.network.on("click", function (params) {
        if (params.nodes.length == 1) {
            let item = $(index).find(".nodeId[value^='" + params.nodes[0] + "']")
            $(index).find(".active").removeClass("active");
            $(item).parent().addClass("active");
        } else if (params.edges.length == 1) {
            //clickOnEdge
            let id = params.edges[0]
            let edge = that.network.body.data.edges._data[id];

            if (that.network.body.data.nodes._data[edge.from].group == "__relation") {
                that.network.selectNodes([edge.from])
            } else if (that.network.body.data.nodes._data[edge.to].group == "__relation") {
                that.network.selectNodes([edge.to])
            }
        }
    });

    this.network.on("doubleClick", function (params) {
        if (params.nodes.length == 1) {
            let id = params.nodes[0]
            that.showNodeDetail(id)
        } else if (params.edges.length == 1) {
            //clickOnEdge
            let id = params.edges[0]
            let edge = that.network.body.data.edges._data[id];
            if (that.network.body.data.nodes._data[edge.from].group == "__relation") {
                that.network.selectNodes([edge.from])
            } else if (that.network.body.data.nodes._data[edge.to].group == "__relation") {
                that.network.selectNodes([edge.to])
            }
        }
    });

    this.network.on("beforeDrawing", function(params) {
        that.loading("show");
    });

    this.network.on("afterDrawing", function() {
        that.loading("hide");

    });

    this.recommend = false;

    this.muterelations = new Set();
}

networkObj.prototype.setData = function () {
    this.network.setData(this.getData());
}


networkObj.prototype.showNodeDetail = function (nodeId) {
    //$("#modalNetwork").modal('hide')
    svg.drawEntity(nodeId, instance_model); //画出中心区域
    //$("#" + nodeId).trigger("click"); //这条好像不需要
    drawNodeDetails(nodeId);
    showLocal();
}


networkObj.prototype.getContainer = function () {
    return $("div.global")[0];//因为要求的是js对象
    //return $("#modalNetwork .modal-body")[0];//因为要求的是js对象
}

networkObj.prototype.getOptions = function () {
    var options = {
        nodes: {
            shape: 'dot',
            size: 16,
            color: {
                background: '#D2E5FF',
                border: '#2B7CE9',
                highlight: {
                    background: '#F9D456',
                    border: '#f0ad4e'
                }
            },
            shapeProperties: {
                interpolation: false    // 'true' for intensive zooming
            }
        },
        edges: {
            color: {
                color: '#337ab7',//#2e6da4
                highlight: '#f0ad4e'//#eea236
            }
        },
        groups: {},
        layout:{
            improvedLayout:false,
        },
        physics:{
            enabled: true,
            stabilization: {
                iterations: 20
            }
        }
        // tooltip: {
        //     delay: 50,
        //     fontColor: "black",
        //     fontSize: 14,
        //     fontFace: "verdana",
        //     color: {
        //         border: "#666",
        //         background: "#FFFFC6"
        //     }
        // },
        // clustering: {
        //     enabled: false,
        //     clusterEdgeThreshold: 50
        // },
        // physics:{
        //     barnesHut:{
        //         gravitationalConstant: -60000,
        //         springConstant:0.02
        //     }
        // },
        // smoothCurves: {dynamic:false},
        // hideEdgesOnDrag: true,
        // stabilize: true,
        // stabilizationIterations: 100,
        // zoomExtentOnStabilize: true,
        // navigation: true,
        // keyboard: true,
    };

    let i = 0;
    for (let key in model.nodes) {
        if (model.nodes[key].tag == "Entity") {
            let group = model.nodes[key].value;
            options.groups[group] = {
                color: {
                    background: this.colorsArray[i],//'#D2E5FF',
                    border: '#2B7CE9'
                }
            }
            i++;
        }
    }

    options.groups["__relation"] = {
        shape: "diamond",
        size: 12,
        font: {
            size: 14
        }
    }

    return options;
}

networkObj.prototype.getData = function () {

    let nodes = [], edges = [];
    let nodeSet = new Set();
    for (let id in instance_model.nodes) {
        if (data.isEntity(id)) {
            let width=1;
            let hidden = false;
            if(this.recommend) hidden = true;
            // let node = {}
            // node[id] = eval('(' + JSON.stringify(instance_model.nodes[id]) + ')');
            // connection.io_recommend_insModel_node(node);
            out:for (let relationId in recommend_model.relations) {
                if(this.muterelations.has(relationId)) continue;
                for (let roleIndex in recommend_model.relations[relationId].roles) {
                    if (id == recommend_model.relations[relationId].roles[roleIndex].node_id) {
                        width=5;
                        hidden = false;
                        break out;
                    }
                }
            }
            if(!hidden)
            {
                nodeSet.add(id);
                nodes.push({
                    id: id,
                    label: instance_model.nodes[id].value,
                    group: instance_model.nodes[id].tags[0],
                    // color:{
                    //     border: '#000000',
                    // }
                    borderWidth:width,
                })
            }
        }
    }

    for (let id in instance_model.relations) {
        let isAttribute = false;
        let hidden = false;
        if(this.recommend) hidden = true;
        let roles = instance_model.relations[id].roles;
        for (let i in roles) {
            if (!data.isEntity(roles[i].node_id)) {
                isAttribute = true;
                break;
            }
            if(nodeSet.has(roles[i].node_id)) hidden=false;
        }

        if (isAttribute) continue;
        if(hidden) continue;

        nodes.push({
            id: id,
            label: instance_model.relations[id].type,
            group: "__relation"
        })

        for (let i in roles) {
            edges.push({from: id, to: roles[i].node_id})
        }
    }

    return {
        nodes: nodes,
        edges: edges
    };
}

networkObj.prototype.uniqueEdges = function (edges) {
    let record = {};
    for (let i in edges) {
        if (record[edges[i].from] == undefined) record[edges[i].from] = {};
        if (record[edges[i].from][edges[i].to] == undefined) record[edges[i].from][edges[i].to] = 1;
        else {
            edges.splice(i, 1);
        }
    }
}

networkObj.prototype.focusNode = function (id) {
    this.network.selectNodes([id])
}

networkObj.prototype.loading = function(type){
    switch(type){
        case "show":
            //$("body").loading({overlay: $("#custom-overlay")});
            $("#custom-overlay").show();
            break;
        case "hide":
            //$("body").loading("stop");
            $("#custom-overlay").hide();
            break;
        default://toogle
            //$("body").loading("toggle");
            $("#custom-overlay").toggle();
            break;
    }
}

