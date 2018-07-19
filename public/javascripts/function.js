/*
 * 点击事件和函数
 */

var clicks = 0;
var mutex = 0;
var indexMutex = false;
var faEditClicked = false; //很不好
var isRevise = false; //很不好
$(function () {

    //使得提示工具Tooltip生效
    $('[data-tooltip="tooltip"]').tooltip()

    $(document).on("click", '#stigmod-search-left-btn', function () {
        let value = $(this).parent().parent().children("input[type=text]").val();
        let nodeId = data.getEntityIdByValue(value, instance_model);
        if (nodeId != undefined) {
            svg.drawEntity(nodeId, instance_model); //画出中心区域
            $("#" + nodeId).click();    //点击中心节点
        } else {
            $("#modelSearch .modal-body h5").text('未找到"' + value + '"，' + '是否创建？');
            $("#modelSearch").modal("show");
        }
    })

    $(document).on("click", '#modelSearch .btn-primary', function () {
        $("#modelSearch").modal("hide");
        $(".fa-plus[type='class']").trigger("click");
        $("#class-revise .value-input").val($("#stigmod-search-left-input").val());
    })

    /*
     * 主区域
     * */
    //点击索引
    $(document).on("click", '.index li', function () {
        let id = $(this).attr("nodeid");
        drawEntity(id, instance_model); //画出中心区域
        $("#" + id).click();    //点击中心节点
    })

    //单击节点
    $(document).on("click", 'g.entity', function () {

        svg.svg.selectAll("g.relation").classed("active", false);
        svg.svg.selectAll("path").classed("active", false);

        let item = this;
        if (d3.select(this).classed("isRecommendation") == true) {
            clickTimeout.set(function () {
                let id = $(item).attr('id');
                alert("双击节点可以直接节点与对应关系");
            });
        } else {
            clickTimeout.set(function () {
                let id = $(item).attr('id');
                id = id.split("-")["0"];
                if (instance_model.nodes[id] == undefined) {
                    $(".properties-revise .button-left").click();
                    $(properties).children().remove();
                    detail.drawIndex();
                    svg.drawEntity(nodeId);
                    $(graph).children().remove();
                } else {
                    drawNodeDetails(id);
                }
            });
        }
    })

    $(document).on("click", 'g.relation', function () {
        let relationId = $(this).attr("id")
        //删除历史active
        svg.svg.selectAll("g.relation").classed("active", false);
        svg.svg.selectAll("path").classed("active", false);

        //增加新的active
        let classStr = $(this).attr("class");
        $(this).attr("class",classStr+" active");

        $("path[id^='"+relationId+"']").each(function(i){
            let str = $(this).attr("class");
            $(this).attr("class",classStr+" active");
        })

        let id = $(this).attr('id');
        drawRelationDetails(id);

        return;
    })

    $(document).on('click', '.list-group-item.stigmod-hovershow-trig.entity', function () {
        if (indexMutex) return;

        indexMutex = true;
        let item = this;
        clickTimeout.set(function () {  //这样的话只执行一遍
            indexMutex = false;
        });

        let nodeId = $(item).find(".nodeId").attr("value");
        $("body .graph-row .index .active").removeClass("active");
        $(item).addClass("active");
        svg.drawEntity(nodeId, instance_model); //画出中心区域
    })

    $(document).on('dblclick', '.list-group-item.stigmod-hovershow-trig.entity', function () {
        clickTimeout.clear();
        indexMutex = false;
        let item = this;
        let nodeId = $(item).find(".nodeId").attr("value");
        $("#" + nodeId).click();    //点击中心节点
    })

    //双击节点
    $(document).on("dblclick", 'g', function () {
        if (d3.select(this).classed("isRecommendation") == true) { //双击推荐信息 -> 引用推荐
            isGetRcmd = true;
            clickTimeout.clear();
            //引用推荐节点
            let nodeId = $(this).attr("id");

            if (instance_model["nodes"][nodeId] == undefined) {   //不存在节点的话创建

                if (data.isEntity(nodeId, recommend_model)) {//是实体节点，需要创建3重信息

                    let value = recommend_model["nodes"][nodeId].value
                    let entity = {
                        tags: recommend_model["nodes"][nodeId].tags,
                        value: value,
                        nodeId: nodeId,
                        valueId: generateFrontNodeID(value, "v"),
                        relationId: generateFrontRelationID()
                    }
                    connection.io_create_insModel_entity(entity);

                } else {//不是实体节点，需要创建节点信息
                    let value = recommend_model["nodes"][nodeId].value
                    let nodes = {};
                    let nodeId = generateFrontNodeID(value);
                    nodes[nodeId] = {
                        "dataType": recommend_model["nodes"][nodeId].tags,
                        "value": value
                    }
                    connection.io_create_insModel_node(nodes)
                }
            }
            //创建关系
            let centerId = $("g.center").attr("id");
            let relationsArray = getRelations(centerId, nodeId, recommend_model);

            let relations;
            for (let n in relationsArray) {
                let rcmdR = recommend_model["relations"][relationsArray[n]];
                relations = {};
                relations[relationsArray[n]] = {
                    roles: rcmdR.roles,
                    tag: rcmdR.tag,
                    type: rcmdR.type
                };
                connection.io_create_insModel_relation(relations);
            }
        } else {
            if (d3.select(this).classed("isCentralized") == false) {
                return;
            }
            clickTimeout.clear();

            let nodeId = $(this).attr("id");
            let node = {}
            node[nodeId] = eval('(' + JSON.stringify(instance_model.nodes[nodeId]) + ')');
            connection.io_recommend_insModel_node(node);
        }
    })

    //点击关系文本
    $(document).on("click", 'textPath', function () {
        $($(this).attr("href")).click();
    })

    //点击关系
    $(document).on("click", 'path', function () {
        let item = this;
        let id = $(item).attr('id');
        id = id.split("-")[0];
        $("#"+id).trigger("click");
        //drawRelationDetails(id);
    })

    /*
     * 右侧栏
     * */
    // 右划
    $(document).on("click", '.index .button-right', function () {
        detail.rightColumnShow(properties)
    })
    $(document).on("click", '.properties .button-right', function () {
        let item = $(this).parent().parent().parent().parent();
        $(item).children(".properties").hide();
        $(item).children(".properties-revise").show();
    })
    // 左划
    $(document).on("click", '.properties .button-left', function () {
        detail.rightColumnShow(index)
    })
    $(document).on("click", '.properties-revise .button-left', function () {
        let item = $(this).parent().parent().parent().parent();
        $(item).children(".properties").show();
        $(item).children(".properties-revise").hide();
        $(".properties .active").removeClass("active");
    })

    // 点击添加
    $(document).on("click", '.fa-plus', function () {

        $(".properties .active").removeClass("active");

        if(faEditClicked) isRevise = true;
        else isRevise = false;

        faEditClicked = false;

        let type = $(this).attr("type");
        switch (type) {
            case "class":
                detail.classRevise(this, "add");
                break;
            case "attribute":
                detail.attributeRevise(this, "add");
                break;
            case "relation":
                detail.relationRevise(this, "add");
                break;
            case "role":
                break;
        }
    });

    // 点击属性修改
    $(document).on("click", '#attribute .fa-edit', function () {

        faEditClicked = true;

        let item = $(this).parent().parent();

        let type = $(item).find(".type").attr("value");
        let value = $(item).find(".value").attr("value");

        $(item).parent().find('.fa-plus').click();
        $(".properties-revise").find(".type-input").val(type);
        $(".properties-revise").find(".value-input").val(value);

        $(item).addClass("active");

        //给一个标志位吧
    });

    // 点击关系修改
    $(document).on("click", '#relation .fa-edit', function () {

        faEditClicked = true;

        let item = $(this).parent().parent();

        let type = $(item).find(".type").attr("value");
        let value = $(item).find(".value").attr("value");

        $(item).parent().find('.fa-plus').click();
        $(".properties-revise").find(".type-input").val(type);
        $(".properties-revise .type-input").keyup();

        let relationId = $(item).find(".relationId").attr("value");
        let roles = instance_model.relations[relationId].roles;

        for(let i in roles){
            let tag = roles[i].rolename;
            let id = roles[i].node_id;
            $('span[value='+tag+']').parent().children(".node").children("input").eq(0).val(instance_model.nodes[id].value);
        }
        $(item).addClass("active");
    });

    // 点击修改成功
    $(document).on("click", '.properties-revise .button-ok', function () {
        //alert("修改成功");
        let item = $(this).parent().parent();
        switch ($(item).attr("id")) {
            case "class-revise":
                detail.classReviseSubmit(item);
                break;
            case "attribute-revise":
                detail.attributeReviseSubmit(item);
                break;
            case "relation-revise":
                detail.relationReviseSubmit(item);
                break;
        }
    });


    // 点击修改取消
    $(document).on("click", '.properties-revise .button-cancel', function () {
        let item = $(this).parent().parent();
        switch ($(item).attr("id")) {
            case "class-revise":
                detail.rightColumnShow(index);
                break;
            case "attribute-revise":
                detail.rightColumnShow(properties);
                break;
            case "relation-revise":
                detail.rightColumnShow(properties);
                break;
        }
    });

    // 点击修改删除
    $(document).on("click", '.properties-revise .button-remove', function () {
        let item = $(this).parent().parent();
        switch ($(item).attr("id")) {
            case "class-revise":
                break;
            case "attribute-revise":
                detail.attributeRemoveSubmit(item);
                break;
            case "relation-revise":
                //$(".properties-revise .button-left").click();
                detail.relationRemoveSubmit(item);
                break;
        }
    });

    $(document).on("click", '.index .fa-search-plus', function () {
        $(this).parent().parent().trigger("dblclick");
    })


    //关系修改时触发时间
    $(document).on("change keyup", "#relation-revise .stigmod-input.type-input", function () {
        //读取类型
        let type = $(this).val();

        //查找model，找到对应的角色名
        let relationId, roles;
        for (let key in model.relations) {
            if (model.relations[key].value == type) {
                relationId = key;
                roles = model.relations[key].roles;
                break;
            }
        }
        //更新role信息
        let subHtml,item;
        let centerId = $("g.center").attr("id");
        let entities = getRelationValues(centerId)
        if (relationId != undefined && roles != undefined) {
            $("#roles").children().remove();
            for (let i in roles) {
                subHtml = detail.generateRole(roles[i].rolename, "", model.nodes[roles[i].node_id].value, relationId);
                $("#roles").append(subHtml);

                item=$("#roles").children().last();
                setRelationRoleValueTypeahead(item,entities,centerId);
            }
        }
        //默认填充当前节点
        let centerTag = instance_model.nodes[centerId].tags[0];
        let subItem = $('span[value='+centerTag+']').parent().children(".node").children("input").eq(0).val(instance_model.nodes[centerId].value);

        $("#roles").parent().show();
        return;
    })
})

/*
* 右侧区域的绘制
* */
function drawNodeDetails(id) {
    let isEntity = svg.drawEntity(id, instance_model);
    if (isEntity) {
        $("body .graph-row .index .active").removeClass("active");
        let item = $(".list-group-item.stigmod-hovershow-trig.entity .nodeId[value="+id+"]");
        $(item).parent().addClass("active");
        //处理后面
        detail.rightColumnShow(properties);
        $(properties).children().remove();
        detail.drawPropertyTitle();
        detail.drawTypes(id);
        detail.drawAttributes(id);
        detail.drawRelations(id);
    }
}

function drawRelationDetails(id) {
    detail.rightColumnShow(properties);
    $(properties).children().remove();
    detail.drawPropertyTitle();
    detail.drawTypes(id);
    detail.drawRoles(id);
}


function drawRecommendDetail(){
    //如果是属性
    //如果是节点
}

function getJsonLength(json) {
    let length = 0;
    for (let key in json) length++;
    return length;
}

function filterAttributes(neighbours) {

    let attributes = []
    for (let id in neighbours) {
        if (!data.isEntity(id)) {
            //此时属于attribute
            for (let relation of neighbours[id].relations) {
                attributes.push({
                    relationId: relation.id,
                    nodeId: id,
                    type: relation.value,
                    value: instance_model.nodes[id].value
                })
            }
        }
    }
    return attributes;
}

function filterRelations(neighbours) {

    let relations = []
    for (let id in neighbours) {
        if (data.isEntity(id)) {
            //此时属于relation
            for (let relation of neighbours[id].relations) {
                relations.push({
                    relationId: relation.id,
                    nodeId: id,
                    type: relation.value,
                    value: instance_model.nodes[id].value
                })
            }
        }
    }
    return relations;
}

function getRoles(relation) {
    let type, value, roles = [];
    for (let role of relation.roles) {
        type = relation.type;
        if (role.rolename != "") type = role.rolename;
        value = instance_model.nodes[role.node_id].value;
        roles.push({type: type, value: value, id: role.node_id});
    }
    return roles;
}

function generateFrontNodeID(val,type="e") {
    let n = getJsonLength(instance_model.nodes);
    if(val) n=val;
    let nodeId = "front_n" + type + n;

    while (instance_model.nodes[nodeId] != undefined) {
        n++;
        nodeId = "front_n" + type + n;
    }

    return nodeId;
}

var OperationCounter = 0;
function generateFrontOperationID() {

    OperationCounter = (OperationCounter+1)%100;
    //let id = localStorage.mongoMachineId + new Date().valueOf() + OperationCounter;
    let id = hash(user) + new Date().valueOf() + OperationCounter;
    return id;
}

var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

function hash(input){
    var hash = 5381;
    var i = input.length - 1;

    if(typeof input == 'string'){
        for (; i > -1; i--)
            hash += (hash << 5) + input.charCodeAt(i);
    }
    else{
        for (; i > -1; i--)
            hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF;

    var retValue = '';
    do{
        retValue += I64BIT_TABLE[value & 0x3F];
    }
    while(value >>= 6);

    return retValue;
}

function generateFrontRelationID() {
    let n = getJsonLength(instance_model.relations);
    let relationId = "front_r" + n;

    while (instance_model.relations[relationId] != undefined) {
        n++;
        relationId = "front_r" + n;
    }

    return relationId;
}

let clickTimeout = {
    _timeout: null,
    set: function (fn) {
        var that = this;
        that.clear();
        that._timeout = window.setTimeout(fn, 300);
    },
    clear: function () {
        var that = this;
        if (that._timeout) {
            window.clearTimeout(that._timeout);
        }
    }
};

function checkRecommendation(recommend_model, instance_model) {
    for (let relation in recommend_model.relations) {
        if (instance_model.relations[relation] != undefined) {
            delete recommend_model.relations[relation];
        }
    }
    return recommend_model;
}

function getAngle(N, RN, pRN, i) {

    if(N == 0) return 2 * Math.PI * i/RN;

    let gap = Math.floor(i / pRN) + 1;
    let angle;
    if (gap != N) {
        angle = 2 * Math.PI * (i + gap) / (N * (pRN + 1));
    }
    if (gap == N) { //最后一块进行平分
        let resti = i - (gap - 1) * pRN + 1;
        let restpRN = RN - Math.floor(RN/N)*N;
        angle = 2 * Math.PI * (gap - 1) / N + 2 * Math.PI * (resti) / (N * (restpRN + 1));
    }
    angle = 2 * Math.PI * (i + gap) / (N * (pRN + 1));  //test不错处理

    //console.log(i+" "+gap+" "+N+" "+ pRN +" "+angle);

    return angle;
}

function getRank(id,entity){
    let i = 0;
    for(let key in entity.neighbours){
        if(key == id) break;
        i++;
    }
    return i;
}



function refreshText(entity){
    $(".textPath").remove();
    let paths = getPathTexts(width / 2, height / 2, R, r, 0, entity.neighbours);
    //console.log(paths);
    for (let path of paths) {
        drawPathText(path);
    }
}

let svgOperation = {
    clickNode : function(nodeId,model=instance_model){
        detail.drawIndex();
        svg.drawEntity(nodeId);
        $("#" + nodeId).click();
    }
}

let tagReformat = {
    value2id : function(msg) {
        //console.log("******value2id")
        //console.log("beforTrans"+msg)
        if(msg.nodes){
            //alert("nodes")
            for(let nodeId in msg.nodes){
                if(msg.nodes[nodeId].tags == undefined) msg.nodes[nodeId].tags = ["String"];
                let tmp = msg.nodes[nodeId].tags;
                for(let n in tmp){
                    //if(tmp[n]) alert(getValueId(tmp[n],model.nodes))
                    tmp[n] = getValueId(tmp[n],model.nodes);
                }
            }
        }
        if(msg.relations){
            //alert(relations)
            for(let relationId in msg.relations){
                let tmp = msg.relations[relationId].type; //前后不统一
                msg.relations[relationId].type = getValueId(tmp,model.relations);
            }
        }
        //console.log("afterTrans"+msg);
        //console.log("value2id******")
    },
    id2value : function(msg) {
        if(msg.nodes){
            for(let nodeId in msg.nodes){

                let tmp = msg.nodes[nodeId].tags;
                //临时处理recommend没有tags的问题 - 开始
                if(tmp == undefined){
                    if(msg.nodes[nodeId]["value"] == "") {
                        msg.nodes[nodeId].tags = ["人"]
                    }else{
                        msg.nodes[nodeId].tags = ["String"]
                    }
                    continue;
                }
                ////临时处理recommend没有tags的问题 - 结束
                for(let n in tmp){
                    tmp[n] = model.nodes[tmp[n]].value
                }
            }
        }
        if(msg.relations){
            for(let relationId in msg.relations){
                //alert(msg.relations[relationId].type)//创建操作，因为数据都是前台的所以都是给的type
                //alert(msg.relations[relationId].tag)//get操作，因为数据是前台的所以是tag
                let tmp = msg.relations[relationId].tag;    //前台获得情况
                if(tmp == undefined) tmp = msg.relations[relationId].type;   //获取本地的情况
                msg.relations[relationId].type = model.relations[tmp].value;

                //临时处理recommend没有tags的问题 - 开始
                let roles = msg.relations[relationId].roles;

                if(roles[0]["node_id"] == undefined){
                    msg.relations[relationId].roles = [
                        {rolename:"",node_id:roles[0]},
                        {rolename:"",node_id:roles[1]}
                    ]
                }
                ////临时处理recommend没有tags的问题 - 结束
            }
        }
    }
}

getValueId = function(value,item){
    for(let key in item){
        if(item[key]["value"] == value) return key;
    }
}

function prepareNewEntity(model=instance_model,refreshSvg = true,getRcmd = false,showIndex=false){

    let hasCenterNode = false, centerNode;

    for(let rId in model["relations"]){
        let r = model["relations"][rId];
        if(keyValueArray.indexOf(r.type) == -1) continue;//不是主属性

        let nId0,nId1,tags0,tags1;
        nId0 = r.roles[0].node_id;
        nId1 = r.roles[1].node_id;

        //如果是推荐，好像就会出现id不存在的情况

        if(model["nodes"][nId0] != undefined) {
            tags0 = model["nodes"][nId0]["tags"];
        }else{
            console.log("alert");
            console.log("not found nId0:"+nId0);
            console.log("model:"+model);
            continue;
        }
        if(model["nodes"][nId1] != undefined) {
            tags1 = model["nodes"][nId1]["tags"];
        }else{
            console.log("alert");
            console.log("not found nId1:"+nId1);
            console.log("model:"+model);
            continue;
        }

        let entityId,valueId;
        if(tags0 != undefined){
            if(symbolArray.indexOf(tags0[0]) == -1){   //说明是Entity节点
                entityId = nId0;
                valueId = nId1;
            }else{
                entityId = nId1;
                valueId = nId0;
            }
        }else{
            if(symbolArray.indexOf(tags1[0]) == -1){   //说明是Entity节点
                entityId = nId1;
                valueId = nId0;
            }else{
                entityId = nId0;
                valueId = nId1;
            }
        }

        model["nodes"][entityId]["value"] = model["nodes"][valueId]["value"];
        model["nodes"][entityId]["dataType"] = r.type;

        data.removeNodeInRecommendIndex(model["nodes"][entityId]["tags"][0],model["nodes"][entityId]["value"]);

        delete model["nodes"][valueId];
        delete model["relations"][rId];

        if(!hasCenterNode) {//第一个Entity节点作为center节点
            hasCenterNode = true;
            centerNode = entityId;
        }
    }
    if(hasCenterNode && refreshSvg){
        detail.drawIndex(instance_model,showIndex);
        svg.drawEntity(centerNode);
        $("#" + centerNode).delay("10").click();
        //$("#" + centerNode).delay("500").trigger("dblclick");
        if(getRcmd){
            isGetRcmd = false;
            $("#" + centerNode).delay("500").trigger("dblclick");
        }
        return true;
    }
    if(getRcmd){
        isGetRcmd = false;
        //$("#" + centerNode).delay("500").trigger("dblclick");
    }
    return false;
}

function getRelations(id1,id2,model=instance_model){
    let relation,roles,relationArray=[];
    for(relation in model["relations"]){
        roles = model["relations"][relation]["roles"];
        if(roles[0].node_id == id1){
            if(roles[1].node_id == id2)  relationArray.push(relation);
        }
        else if(roles[1].node_id == id1){
            if(roles[0].node_id == id2)  relationArray.push(relation);
        }
    }

    return relationArray;
}

function isCreationIllegal(type,tag,value,roles){
    let hasError;
    let err="";
    switch (type){
        case "class":
            hasError = true;
            for(let key in model.nodes){
                if(model.nodes[key].value == tag) hasError = false;
            }
            if(tag == "String") hasError = true;
            if(hasError) err += "创建类型不合法\n 请检查关系类型和对应的承担者";

            hasError = false;
            for(let key in instance_model.nodes){
                if(data.isEntity(key) && instance_model.nodes[key].value == value) {hasError = true;break;}
            }
            if(hasError) err +="创建实体已存在\n";
            break;
        case "attribute":
            hasError = true;
            for(let key in model.relations){
                if(model.relations[key].value == tag){
                    let roles = model.relations[key].roles;
                    for(let n in roles){
                        if(model.nodes[roles[n].node_id].tag == "Symbol"){
                            hasError = false;
                            break;
                        }
                    }
                }
            }
            if(hasError) err += "创建类型不合法\n";

            hasError = false;
            for(let key in instance_model.relations){
                if(instance_model.relations[key].type == tag) {
                    let centerId = $("g.center").attr("id");
                    let roles = instance_model.relations[key].roles;
                    for(let n in roles){
                        if(roles[n].node_id == centerId){
                            if(isRevise){
                                //判断属性是否修改
                                if(roles[1-n].node_id == data.getEntityIdByValue(value)){
                                    hasError = true
                                    break;
                                }
                            }else{//同名属性
                                hasError = true
                                break;
                            }
                        }
                    }
                    if(hasError) break;
                }
            }
            if(hasError) err += "创建属性已存在\n";
            break;
        case "relation":
            //角色与承担者是否一致
            for(let i in roles){
                if(roles[i].nodeId != undefined) {
                    if (roles[i].tag != instance_model.nodes[roles[i].nodeId].tags[0]) {
                        err += "角色\""+roles[i].tag+"\"无法由\""+roles[i].node+"\"承担";
                        break
                    }
                }
            }
            //关系是否已经存在
            break;
            hasError = true;
            for(let key in model.relations){
                if(model.relations[key].value == tag){
                    hasError = false;
                    let roles = model.relations[key].roles;
                    //model.nodes[roles[0].node_id].value
                    //model.nodes[roles[1].node_id].value
                    let tags0 = instance_model.nodes[node0Id].tags;
                    let tags1 = instance_model.nodes[node1Id].tags;
                    if(model.nodes[roles[0].node_id].value != tags0 || model.nodes[roles[1].node_id].value != tags1){
                        hasError = true;
                        break;
                    }
                    if(!hasError) break;
                }
            }
            if(hasError) err += "创建类型不合法\n";

            hasError = false;
            //let centerId = $("g.center").attr("id");
            for(let key in instance_model.relations){
                if(instance_model.relations[key].type != tag) continue;
                let roles = instance_model.relations[key].roles;
                if(roles[0].node_id == node0Id && roles[1].node_id == node1Id){
                    hasError = true
                    break;
                }
            }
            if(hasError) err += "创建关系已存在\n";
            break;
    }
    return err;
}



function alert(text){
    $("#modalAlert .modal-body h5").text(text);
    $("#modalAlert").modal("show");
}


copyObj = function(obj1,obj2){

    for(let key in obj2){
        obj1[key] = obj2[key];
    }
    return;
}

removeNode = function(nodeId,model=instance_model){
    /* 是因为早期版本无法进行删除？
    for(let rel in model["relations"]){
        for(let n in model["relations"][rel]["roles"]){
            let tmp = model["relations"][rel]["roles"][n];
            if(tmp["node_id"] == nodeId)  {
                if(model.nodes[nodeId].tags != undefined){
                    alert("存在其他关系，节点无法删除")
                }
                return;
            }
        }
    }
    */
    delete model["nodes"][nodeId];
}
