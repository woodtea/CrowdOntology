/*
 * 点击事件和函数
 */

var clicks = 0;
$(function () {
    $('[data-tooltip="tooltip"]').tooltip()
    //点击导航
    $(document).on("click", '.index li', function () {
        let id = $(this).attr("nodeid");
        drawEntity(id, instance_model);
        $("#" + id).click();//这个不对哦
    })
    //点击节点
    $(document).on("click", 'g', function () {
        let item = this;
        if(d3.select(this).classed("isRecommendation") == true){
            clickTimeout.set(function () {
                let id = $(item).attr('id');
                alert("显示推荐详细");
            });
        }else{
            clickTimeout.set(function () {
                let id = $(item).attr('id');
                drawNodeDetails(id);
            });
        }
    })
    $(document).on("dblclick", 'g', function () {
        if (d3.select(this).classed("isRecommendation") == true) { //forTest
            clickTimeout.clear();
            //进行添加
            let nodeID = $(this).attr("id");
            instance_model.nodes[nodeID] = {
                "dataType": recommend_model[nodeID].dataType,
                "value": recommend_model[nodeID].value
            }
            if(recommend_model[nodeID].tags) instance_model.nodes[nodeID].tags = recommend_model[nodeID].tags;

            //生成关系
            let centerID = $(".graph .center").attr("id");
            for(let relation of recommend_model[nodeID].relations){
                relationID = relation.id;
                value = relation.value;
                instance_model.relations[relationID] = {
                    "type": value,
                    "roles": [
                        {"rolename": "", "node_id": centerID},
                        {"rolename": "", "node_id": nodeID}
                    ]
                }
            }
            $("#"+centerID).click();
            drawIndex();
        } else {
            if (d3.select(this).classed("isCentralized") == false) {
                return;
            }
            clickTimeout.clear();
            let nodeID = $(this).attr("id");
            recommend_model = shiftModel(recommend_model_whole,nodeID);
            //console.log("recommend_model");
            //console.log(recommend_model);
            drawRecommendation(recommend_model, instance_model);
        }
    })

    //点击关系
    $(document).on("click", 'text', function () {
        $(this).prev("path").click();
    })
    //点击关系
    $(document).on("click", 'path', function () {
        let item = this;
        let id = $(item).attr('id');
        drawPathDetails(id);
    })

    $(document).on("click", '.properties .button-right', function () {
        let item = $(this).parent().parent().parent().parent();
        $(item).children(".properties").hide();
        $(item).children(".properties-revise").show();
    })

    $(document).on("click", '.properties-revise .button-left', function () {
        let item = $(this).parent().parent().parent().parent();
        $(item).children(".properties").show();
        $(item).children(".properties-revise").hide();
    })


    $(document).on("click", '.fa-plus', function () {

        $(".properties .active").removeClass("active");

        let type = $(this).attr("type");
        switch (type) {
            case "class":
                classRevise(this, "add");
                break;
            case "attribute":
                attributeRevise(this, "add");
                break;
            case "relation":
                relationRevise(this, "add");
                break;
            case "role":
                break;
        }
    });

    $(document).on("click", '#attribute .fa-edit', function () {

        let item = $(this).parent().parent();

        let type = $(item).find(".type").attr("value");
        let value = $(item).find(".value").attr("value");

        $(item).parent().find('.fa-plus').click();
        $(".properties-revise").find(".type-input").val(type);
        $(".properties-revise").find(".value-input").val(value);

        $(item).addClass("active");

        //给一个标志位吧
    });

    $(document).on("click", '#relation .fa-edit', function () {

        let item = $(this).parent().parent();

        let type = $(item).find(".type").attr("value");
        let value = $(item).find(".value").attr("value");

        $(item).parent().find('.fa-plus').click();
        $(".properties-revise").find(".type-input").val(type);
        $(".properties-revise").find(".value-input").val(value);

        $(item).addClass("active");

    });

    $(document).on("click", '.properties-revise .glyphicon-ok', function () {
        //alert("修改成功");
        let item = $(this).parent().parent();
        switch ($(item).attr("id")) {
            case "class-revise":
                classReviseSubmit(item);
                break;
            case "attribute-revise":
                attributeReviseSubmit(item);
                break;
            case "relation-revise":
                relationReviseSubmit(item);
                break;
        }
    });

    $(document).on("click", '.properties-revise .glyphicon-ban-circle', function () {
        let item = $(this).parent().parent();
        switch ($(item).attr("id")) {
            case "class-revise":
                break;
            case "attribute-revise":
                $(".properties-revise .button-left").click();
                break;
            case "relation-revise":
                $(".properties-revise .button-left").click();
                break;
        }
    });
});

/* draw detail */
function drawNodeDetails(id) {
    let isEntity = drawEntity(id, instance_model);
    if (isEntity) {
        //处理后面
        $(".properties-revise .button-left").click();
        $(property).children().remove();
        drawPropertyTitle();
        drawTypes(id);
        drawAttributes(id);
        drawRelations(id);
    }
}


function drawPathDetails(id) {
    let nodeIDs = getEntityIdByRelation(id, instance_model);
    if (nodeIDs.length > 2) {
        alert("多元关系");
        return;
    }
    //以下只处理了二元关系
    //如果是属性则不做处理
    let entity1 = getEntity(nodeIDs[0], instance_model);
    let entity2 = getEntity(nodeIDs[1], instance_model);

    if (entity1 == undefined || entity2 == undefined) return;
    //如果是关系则进行绘制
    drawRelation(nodeIDs[0], nodeIDs[1], instance_model);
    //关系的属性处理
    $(property).children().remove();
    drawPropertyTitle();
    drawTypes(id);
    drawRoles(id);
}

function drawRecommendDetail(){
    //如果是属性
    //如果是节点
}

function drawPropertyTitle() {
    $(property).append('<div class="row">' +
        '<div class="col-xs-2"><!--span class="glyphicon glyphicon-chevron-left button-left"></span--></div>' +
        '<div class="col-xs-8"><h4>详情</h4></div>' +
        '<div class="col-xs-2"><span class="glyphicon glyphicon-chevron-right button-right"></span></div>' +
        '</div>' +
        '<hr class="stigmod-hr-narrow">');
}

function drawTypes(id) {
    let html = generateTitle("数据类型", "type");
    $(property).append(html);

    let type, value;
    if (instance_model.nodes[id]) {
        type = "实体";
        value = instance_model.nodes[id].tags
    }
    if (instance_model.relations[id]) {
        type = "关系";
        value = instance_model.relations[id].type
    }
    html = generateContent(type, value);
    $(property).find("#type").append(html);
}

function drawAttributes(id) {

    let html = generateTitle("属性", "attribute");
    $(property).append(html);

    let entity = getEntity(id, instance_model);
    let attributes = filterAttributes(entity.neighbours);
    html = "";
    html += generateContent(instance_model.nodes[id].dataType, instance_model.nodes[id].value);
    for (let attribute of attributes) {
        html += generateContent(attribute.type, attribute.value, attribute.nodeID, attribute.relationID);
    }
    $(property).find("#attribute").append(html);

    $(property).find("#attribute").append(generatePlusLogo("attribute"));

}

function drawRelations(id) {

    let html = generateTitle("关系", "relation");
    $(property).append(html);


    let entity = getEntity(id, instance_model);
    let relations = filterRelations(entity.neighbours);
    html = "";
    for (let relation of relations) {
        html += generateContent(relation.type, relation.value);
    }
    $(property).find("#relation").append(html);

    $(property).find("#relation").append(generatePlusLogo("relation"));

}

function drawRoles(id) {
    let html = generateTitle("角色", "role");
    $(property).append(html);

    let roles = getRoles(instance_model.relations[id]);
    html = "";
    for (let role of roles) {
        html += generateContent(role.type, role.value);
    }
    $(property).find("#role").append(html);

    $(property).find("#role").append(generatePlusLogo("role"));
}

function classRevise(item, type = "add") {
    $(".properties").hide();
    $(".properties-revise").show();
    $(".properties-revise").children().remove();
    let html = '<div class="row">' +
        '<div class="col-xs-2"><span class="glyphicon glyphicon-chevron-left button-left" style="display: none"></span></div>' +
        '<div class="col-xs-8"><h4>添加</h4></div>' +
        '<div class="col-xs-2"></div>' +
        '</div>' +
        '<hr style="margin:8px">';
    $(".properties-revise").append(html);


    html = generateTitle("实体", "class-revise");
    $(".properties-revise").append(html);

    html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<div class="row">' +
        '<div class="col-xs-4" style="padding: 3px"><input type="text" class="stigmod-input type-input" stigmod-inputcheck="class-modify" value="" placeholder="类型"></div>' +
        '<div class="col-xs-8" style="padding: 3px"><input type="text" class="stigmod-input value-input" stigmod-inputcheck="class-modify" value="" placeholder="名称:String"></div>' +
        '</div></a>';
    $(".properties-revise").find("#class-revise").append(html);

    html = generateSubmitLogo();
    $(".properties-revise").find("#class-revise").append(html);

    let array = ["人", "住址"];
    setClassTypeTypeahead(array);
}

function attributeRevise(item, type = "add") {
    $(".properties").hide();
    $(".properties-revise").show();
    $(".properties-revise").children().remove();
    let html = '<div class="row">' +
        '<div class="col-xs-2"><span class="glyphicon glyphicon-chevron-left button-left"></span></div>' +
        '<div class="col-xs-8"><h4>修改</h4></div>' +
        '<div class="col-xs-2"></div>' +
        '</div>' +
        '<hr style="margin:8px">';
    $(".properties-revise").append(html);


    html = generateTitle("属性", "attribute-revise");
    $(".properties-revise").append(html);

    html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<div class="row">' +
        '<div class="col-xs-4" style="padding: 3px"><input type="text" class="stigmod-input type-input" stigmod-inputcheck="attribute-modify" value="" placeholder="类型"></div>' +
        '<div class="col-xs-8" style="padding: 3px"><input type="text" class="stigmod-input value-input" stigmod-inputcheck="attribute-modify" value="" placeholder="属性值:String"></div>' +
        '</div></a>';
    $(".properties-revise").find("#attribute-revise").append(html);

    html = generateSubmitLogo();
    $(".properties-revise").find("#attribute-revise").append(html);

    let array = ["身高", "性别"]
    setAttributeTypeTypeahead(array);
}


function relationRevise(item, type = "add") {
    $(".properties").hide();
    $(".properties-revise").show();
    $(".properties-revise").children().remove();
    let html = '<div class="row">' +
        '<div class="col-xs-2"><span class="glyphicon glyphicon-chevron-left button-left"></span></div>' +
        '<div class="col-xs-8"><h4>修改</h4></div>' +
        '<div class="col-xs-2"></div>' +
        '</div>' +
        '<hr style="margin:8px">';
    $(".properties-revise").append(html);


    html = generateTitle("关系", "relation-revise");
    $(".properties-revise").append(html);

    html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<div class="row">' +
        '<div class="col-xs-4" style="padding: 3px"><input type="text" class="stigmod-input type-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="关系"></div>' +
        '<div class="col-xs-8" style="padding: 3px"><input type="text" class="stigmod-input value-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="对象"></div>' +
        '</div></a>';
    $(".properties-revise").find("#relation-revise").append(html);

    html = generateSubmitLogo();
    $(".properties-revise").find("#relation-revise").append(html);

    let array = ["兄妹", "排行"]
    setRelationTypeTypeahead(array);
    array = ["贾宝玉", "林黛玉"]
    setRelationValueTypeahead(array);

}

function rolseRevise(item, type = "add") {
    $(".properties").hide();
    $(".properties-revise").show();
    $(".properties-revise").children().remove();
    let html = '<div class="row">' +
        '<div class="col-xs-2"><span class="glyphicon glyphicon-chevron-left button-left"></span></div>' +
        '<div class="col-xs-8"><h4>修改</h4></div>' +
        '<div class="col-xs-2"></div>' +
        '</div>' +
        '<hr style="margin:8px">';
    $(".properties-revise").append(html);


    html = generateTitle("角色", "role-revise");
    $(".properties-revise").append(html);

    html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<div class="row">' +
        '<div class="col-xs-4" style="padding: 3px"><input type="text" class="stigmod-input type-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="角色"></div>' +
        '<div class="col-xs-8" style="padding: 3px"><input type="text" class="stigmod-input value-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="对象"></div>' +
        '</div></a>';
    $(".properties-revise").find("#role-revise").append(html);

    html = generateSubmitLogo();
    $(".properties-revise").find("#role-revise").append(html);

}

function generateTitle(title, type) {
    let html = '<div class="panel panel-default">' +
        '<div class="panel-heading">' +
        '<div class="panel-title stigmod-rcmd-title">' + title + '</div>' +
        '</div>' +
        '<div class="list-group" id=' + type + '></div>' +
        '</div>';
    return html
}

function generateContent(type, value, nodeID = "", relationID = "") {
    //alert(nodeID);
    //alert(relationID);
    let html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<span class="nodeID" value=' + nodeID + '></span>' +
        '<span class="relationID" value=' + relationID + '></span>' +
        '<span class="type" value=' + type + '>' + type + '</span>' + ' : ' +
        '<span class="value" value=' + value + '>' + value + '</span>' +
        '<span class="pull-right stigmod-hovershow-cont">' +
        '<span class="fa fa-edit"></span>' +
        '</span></a>';
    return html;
}

function generatePlusLogo(type) {
    let html = '<a href="#" class="list-group-item stigmod-hovershow-trig" style="text-align: center">' +
        '<span class="fa fa-plus" type=' + type + '></span></a>';
    return html;
}

function generateSubmitLogo() {
    let html = '<a href="#" class="list-group-item stigmod-hovershow-trig" style="text-align: center">' +
        '<span class="glyphicon glyphicon-ok" type="ok"></span>' +
        '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
        '<span class="glyphicon glyphicon-ban-circle" type="remove"></span>' +
        '</a>';
    return html;
}

function generateIndex(text, nodeID) {
    var html = '<li style="text-align:left;margin: 10%;font-size:16px" nodeid=' + nodeID + '>' + text + '</li>';
    return html;
}

function getJsonLength(json) {
    let length = 0;
    for (let key in json) length++;
    return length;
}

function filterAttributes(neighbours) {

    let attributes = []
    for (let id in neighbours) {
        if (neighbours[id].tags == undefined) {
            //此时属于attribute
            for (let relation of neighbours[id].relations) {
                attributes.push({
                    relationID: relation.id,
                    nodeID: id,
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
        if (neighbours[id].tags != undefined) {
            //此时属于relation
            for (let relation of neighbours[id].relations) {
                relations.push({
                    relationID: relation.id,
                    nodeID: id,
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

/*
 function generateAttr(text) {
 var html = '<div class="panel-heading" style="text-align:left"><div class="panel-title stigmod-rcmd-title">' + text + '</div></div>';
 return html;
 }
 */

function generateFrontNodeID(val) {
    let n = getJsonLength(instance_model.nodes);
    if(val) n=val;
    let nodeID = "front_n" + n;

    while (instance_model.nodes[nodeID] != undefined) {
        n++;
        nodeID = "front_n" + n;
    }

    return nodeID;
}

function generateFrontRelationID() {
    let n = getJsonLength(instance_model.relations);
    let relationID = "front_r" + n;

    while (instance_model.relations[relationID] != undefined) {
        n++;
        relationID = "front_r" + n;
    }

    return relationID;
}

function classReviseSubmit(item) {

    let type = $(item).find(".type-input").val();
    let value = $(item).find(".value-input").val();

    //生成值节点，理论上应该先检查
    let nodeID = generateFrontNodeID(value);        //let n = getJsonLength(instance_model.nodes);
    //let nodeID = "n" + n;
    instance_model.nodes[nodeID] = {
        "tags":[type],
        "dataType": "姓名",
        "value": value
    }

    drawIndex();
    drawEntity(nodeID);
    indexArray = getIndexArray();
    setIndexTypeahead(indexArray);

    $("#" + nodeID).click();
    //$(".properties-revise").children().remove();

    return;

}

function attributeReviseSubmit(item) {

    let type = $(item).find(".type-input").val();
    let value = $(item).find(".value-input").val();

    //生成值节点，理论上应该先检查
    let nodeID = generateFrontNodeID(value);        //let n = getJsonLength(instance_model.nodes);
    //let nodeID = "n" + n;
    instance_model.nodes[nodeID] = {
        "dataType": "String",
        "value": value
    }

    //生成关系
    let centerID = $(".graph .center").attr("id");
    let relationID = generateFrontRelationID();
    //let r = getJsonLength(instance_model.relations);
    //let relationID = "r" + r;
    instance_model.relations[relationID] = {
        "type": type,
        "roles": [
            {"rolename": "", "node_id": centerID},
            {"rolename": "", "node_id": nodeID}
        ]
    }

    //删除旧的关系
    let origItem = $(".properties").find(".active");
    let origNode = $(origItem).find(".nodeID").attr("value");
    let origRelation = $(origItem).find(".relationID").attr("value");
    if (origNode != undefined) {
        delete instance_model.nodes[origNode];
    }
    if (origRelation != undefined) {
        delete instance_model.relations[origRelation];
    }
    //更新页面
    //$("#" + centerID).click();
    transAnimation(centerID,nodeID,relationID,instance_model);
}

function relationReviseSubmit(item) {

    let type = $(item).find(".type-input").val();
    let value = $(item).find(".value-input").val();
    //关系的节点已经存在
    let nodeID = getEntityIdByValue(value, instance_model);
    if (nodeID == undefined) {
        alert("输入对象不存在");
        return;
    }

    let centerID = $(".graph .center").attr("id");
    let relationID = generateFrontRelationID();

    instance_model.relations[relationID] = {
        "type": type,
        "roles": [
            {"rolename": "", "node_id": centerID},
            {"rolename": "", "node_id": nodeID}
        ]
    }

    //删除旧的关系
    let origItem = $(".properties").find(".active");
    let origNode = $(origItem).find(".nodeID").attr("value");
    let origRelation = $(origItem).find(".relationID").attr("value");
    if (origNode != undefined) {
        delete instance_model.nodes[origNode];
    }
    if (origRelation != undefined) {
        delete instance_model.relations[origRelation];
    }

    //更新页面
    $("#" + centerID).click();
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

function getStartAngle(entity1,entity2){
    let id1,id2;
    let i=0,j=0;
    let offset1,offset2;
    for(id1 in entity1.centerNode){}
    for(id2 in entity2.centerNode){}

    for(let tmp in entity1.neighbours){
        if(tmp == id2){
            offset1 = i;
        }
        i++;
    }
    for(let tmp in entity2.neighbours){
        if(tmp == id1){
            offset2 = j;
        }
        j++;
    }

    return [-(2 * Math.PI * offset1 / i),-(2 * Math.PI * offset2 / j)];

}

function shiftModel(recommend_model_whole,nodeID) {

    //console.log("recommend_model_whole");
    //console.log(recommend_model_whole);
    let tmpModel = {};
    for(let relation in recommend_model_whole.relations){
        for(let n in recommend_model_whole.relations[relation].roles){
            if(recommend_model_whole.relations[relation].roles[n]["node_id"] == nodeID){
                let id = recommend_model_whole.relations[relation].roles[1-n]["node_id"];
                if(instance_model.nodes[id]) break;
                tmpModel[id] = recommend_model_whole["nodes"][id]
                tmpModel[id].id = id;
                tmpModel[id].relations = [];
                tmpModel[id].relations.push({"id":relation,"value":recommend_model_whole.relations[relation].type});
                break;
            }
        }
    }
    return tmpModel;

}

function transAnimation(centerID,neighbourID,relationID,model) {
    //获取新增节点信息
    let entity = getEntity(centerID, model);
    if (entity == undefined) return false;  //如果不是实体的话

    let neighbours = getJsonLength(entity.neighbours);
    let relations = getJsonLength(entity.neighbours[neighbourID].relations);
    //如果是两个节点间形成多个关系，则直接重绘
    if(relations>1) {
        $("#" + centerID).click();
        return;
    }
    //如果是新的节点，则需要移动老的节点
    /*
    //获取坐标信息
    let gList = $("g");
    for (let n=0;n<gList.length;n++) {
        let id = $(gList[n]).attr("id");
        if(id == centerID) continue;    //如果是中心的话不操作

        // 移动圆圈位置
        let angle = 2 * Math.PI * getRank(id,entity) / neighbours + 0;
        cx = width/2 + R * Math.cos(angle);
        cy = height/2 + R * Math.sin(angle);
        $(gList[n]).transition({x:cx,y:cy});

    }
    */
    /*
    $("path").next().remove();
    $("path").remove();
    */

    let n,tmpNodeID,tmpRelationID,tmpItem;
    let originPosition,rotateAngle;
    for(tmpNodeID in entity.neighbours){
        tmpItem = $("#"+tmpNodeID)
        let angle = 2 * Math.PI * getRank(tmpNodeID,entity) / neighbours + 0;
        cx = width/2 + R * Math.cos(angle);
        cy = height/2 + R * Math.sin(angle);
        $(tmpItem).transition({x:cx,y:cy});
        //旋转关系反转比较麻烦
        for(n in entity.neighbours[tmpNodeID].relations){//旋转关系
            tmpRelationID = entity.neighbours[tmpNodeID].relations[n].id;
            tmpItem = $("#"+tmpRelationID);
            originPosition = ""+width/2+"px "+height/2+"px";
            //rotateAngle = (360 * (getRank(tmpNodeID,entity) / neighbours - (getRank(tmpNodeID,entity)-1) / (neighbours-1)))%360;
            rotateAngle = (360 * (getRank(tmpNodeID,entity) / neighbours ))%360;
            $(tmpItem).css({transformOrigin: originPosition}).transition({rotate: rotateAngle});
            $(tmpItem).next()
        }

    }
    /*
    let paths = getPaths(width / 2, height / 2, R, r, 0, entity.neighbours);
    console.log(paths);
    for (let path of paths) {
        drawPath(path);
    }*/
    //画出新增节点
    let tmpNode = {};
    tmpNode[neighbourID] = entity.neighbours[neighbourID];
    drawNeighbours(width / 2, height / 2, r, R, entity.neighbours,2 * Math.PI * (getRank(neighbourID,entity)+1) / neighbours);//不知道为什么要+1

    $(".textPath").remove();
    let paths = getPathTexts(width / 2, height / 2, R, r, 0, entity.neighbours);
    //console.log(paths);
    for (let path of paths) {
        drawPathText(path);
    }
    //将圆圈更新到前面
    svgBringToFront($("#"+centerID));

    //更新详细栏目信息
    if (entity) {
        //处理后面
        $(".properties-revise .button-left").click();
        $(property).children().remove();
        drawPropertyTitle();
        drawTypes(centerID);
        drawAttributes(centerID);
        drawRelations(centerID);
    }
    return true;
}

function getRank(id,entity){
    let i = 0;
    for(let key in entity.neighbours){
        if(key == id) break;
        i++;
    }
    return i;
}

function svgBringToFront(item) {
    var parent = $(item).parent();
    $(item).remove();
    $(parent).append(item);
}