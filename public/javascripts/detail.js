function detailObj() {
}

//三个模块
detailObj.prototype.drawIndex = function (model = instance_model, showIndex = true, nodeId) {

    if (showIndex) {
        this.rightColumnShow(index);
    }

    $(index).children().remove();
    this.drawRightTitle(index, "索引", false, true);

    let html = "";
    let entities = {};
    for (let id in model.nodes) {
        if (data.isEntity(id)) {
            if (entities[model.nodes[id].tags[0]] == undefined) entities[model.nodes[id].tags[0]] = [];
            entities[model.nodes[id].tags[0]].push({value: model.nodes[id].value, id: id});
        }
    }

    html = "<div class='index-content'></div>";
    $(index).append(html);
    let indexContent = $(index).children(".index-content");

    for (let tag in entities) {

        html = this.generateCollapseTitle(tag, "type");
        $(indexContent).append(html);

        html = "";
        for (let n in entities[tag]) {
            html += this.generateCollapseContent(tag, entities[tag][n].value, entities[tag][n].id);
        }
        $(indexContent).children().last().find(".list-group").append(html)

    }


    $(index).append(this.generateEntityPlusButton());
    let array = getIndexArray(instance_model);
    setIndexTypeahead(array);

    $(".nodeId[value^='" + nodeId + "']").parent().addClass("active");
}

detailObj.prototype.drawAttributes = function (id) {

    let html = this.generateTitle("属性", "attribute");
    $(properties).append(html);

    let entity = data.getEntity(id, instance_model);
    let attributes = filterAttributes(entity.neighbours);
    html = "";
    html += this.generateContent(instance_model.nodes[id].dataType, instance_model.nodes[id].value);
    for (let attribute of attributes) {
        html += this.generateContent(attribute.type, attribute.value, attribute.nodeId, attribute.relationId);
    }
    $(properties).find("#attribute").append(html);

    $(properties).find("#attribute").append(this.generatePlusLogo("attribute"));

}

detailObj.prototype.drawRelations = function (id) {

    let html = this.generateTitle("关系", "relation");
    $(properties).append(html);


    //let entity = data.getEntity(id, instance_model);
    //let relations = filterRelations(entity.neighbours);

    let entity = svg.getEntity(id, instance_model);
    let relations = this.filterRelations(entity.relations);

    let relationArray = [];
    for (let i in relations) {
        let relation = relations[i];
        if (relationArray.indexOf(relation.relationId) == -1) {
            relationArray.push(relation.relationId);
            html = this.generateContent(relation.type, relation.value, relation.nodeId, relation.relationId);
            $(properties).find("#relation").append(html);
        } else {
            /*
             let item = $("span.relationId[value^='"+relation.relationId+"']").parent();
             let subItem = $(item).children(".value");
             $(subItem).text($(subItem).text()+"、"+relation.value);
             */
        }
    }
    $(properties).find("#relation").append(this.generatePlusLogo("relation"));

}

//模块内条目
detailObj.prototype.drawTypes = function (id) {
    let html = this.generateTitle("类型", "type");
    $(properties).append(html);

    let type, value;
    if (instance_model.nodes[id]) {
        type = "实体";
        value = instance_model.nodes[id].tags
    }
    if (instance_model.relations[id]) {
        type = "关系";
        value = instance_model.relations[id].type
    }
    html = this.generateContent(type, value, 1);
    $(properties).find("#type").append(html);
    $(properties).find("#type").children().last().find(".stigmod-hovershow-cont").hide();
}

detailObj.prototype.drawRoles = function (id) {
    let html = this.generateTitle("角色", "role");
    $(properties).append(html);

    let roles = getRoles(instance_model.relations[id]);
    html = "";
    for (let role of roles) {
        html = this.generateContent(role.type, role.value);
        $(properties).find("#role").append(html);
    }
}

detailObj.prototype.drawPropertyTitle = function () {
    this.drawRightTitle(properties, "详情", true, false);
}

detailObj.prototype.drawRightTitle = function (item, title, hasLeft = false, hasRight = false) {
    $(item).append('<div class="row">' +
        '<div class="col-xs-2"><!--span class="glyphicon glyphicon-chevron-left button-left"></span--></div>' +
        '<div class="col-xs-8"><h4>' + title + '</h4></div>' +
        '<div class="col-xs-2"><!--span class="glyphicon glyphicon-chevron-right button-right"></span--></div>' +
        '</div>' +
        '<hr class="stigmod-hr-narrow">');
    if (hasLeft) {
        $(item).find(".row").last().find(".col-xs-2").first().append('<span class="glyphicon glyphicon-chevron-left button-left"></span>')
    }
    if (hasRight) {
        $(item).find(".row").last().find(".col-xs-2").last().append('<span class="glyphicon glyphicon-chevron-right button-right"></span>')
    }
}

//revise
detailObj.prototype.classRevise = function (item, type = "add") {

    this.rightColumnShow(propertiesRevise);

    $(".properties-revise").children().remove();
    this.drawRightTitle(propertiesRevise, "添加", false, false);

    html = this.generateTitle("实体", "class-revise");
    $(".properties-revise").append(html);

    html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<div class="row">' +
        '<div class="col-xs-4" style="padding: 3px"><input type="text" class="stigmod-input type-input" stigmod-inputcheck="class-modify" value="" placeholder="类型"></div>' +
        '<div class="col-xs-8" style="padding: 3px"><input type="text" class="stigmod-input value-input" stigmod-inputcheck="class-modify" value="" placeholder="名称:String"></div>' +
        '</div></a>';
    $(".properties-revise").find("#class-revise").append(html);

    html = this.generateSubmitLogo();
    $(".properties-revise").find("#class-revise").append(html);

    let array = getEntityTypes();
    setClassTypeTypeahead(array);
    setClassValueTypeahead();
}

detailObj.prototype.attributeRevise = function (item, type = "add") {
    $(".properties").hide();
    $(".properties-revise").show();
    $(".properties-revise").children().remove();
    this.drawRightTitle(propertiesRevise, "修改", false, false);

    html = this.generateTitle("属性", "attribute-revise");
    $(".properties-revise").append(html);

    html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<div class="row">' +
        '<div class="col-xs-4" style="padding: 3px"><input type="text" class="stigmod-input type-input" stigmod-inputcheck="attribute-modify" value="" placeholder="类型"></div>' +
        '<div class="col-xs-8" style="padding: 3px"><input type="text" class="stigmod-input value-input" stigmod-inputcheck="attribute-modify" value="" placeholder="属性值:String"></div>' +
        '</div></a>';
    $(".properties-revise").find("#attribute-revise").append(html);

    if (isRevise) $(".properties-revise").find("#attribute-revise .type-input").attr("disabled", "disabled");
    html = this.generateSubmitLogo(isRevise);
    $(".properties-revise").find("#attribute-revise").append(html);

    let centerId = $("g.center").attr("id");
    let array = getAttributeTypes(centerId);
    if (array.length == 0 && !isRevise) alert("已建立所有属性");
    setAttributeTypeTypeahead(array);
}

detailObj.prototype.relationRevise = function (item, type = "add") {
    //表头
    $(".properties-revise").children().remove();
    this.rightColumnShow(propertiesRevise);

    this.drawRightTitle(propertiesRevise, "修改", false, false);

    //中间区域修改
    html = this.generateTitle("关系", "relation-revise");
    $(".properties-revise").append(html);

    html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<div class="row">' +
        '<div class="col-xs-12"><input type="text" class="stigmod-input type-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="关系" style="text-align:center;"></div>' +
        '</div></a>';
    $(".properties-revise").find("#relation-revise").append(html);

    //显示关系
    html = '<div class="panel panel-default list-group-item showPopover" style="display: none">' +
        '<div class="panel-heading" style="padding-top:5px;padding-bottom: 5px">' +
        '<div class="stigmod-rcmd-title row">' +
        '<span class="col-xs-4">' + "角色" + '</span>' +
        '<span class="col-xs-8">' + "承担者" + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="list-group" id="roles">' +
        '</div>' +
        '</div>';

    $(".properties-revise").find("#relation-revise").append(html);
    $('#relation-revise [data-tooltip="tooltip"]').tooltip();

    if (isRevise) {
        $(".properties-revise").find("#relation-revise .type-input").attr("disabled", "disabled");
        //$(".properties-revise").find("#relation-revise .list-group-item").show();
    }

    //提交按钮
    html = this.generateSubmitLogo(isRevise);
    $(".properties-revise").find("#relation-revise").append(html);
    $(".properties-revise").find("#relation-revise").find(".button-ok").children().attr("disabled", true);

    //自动填充
    let centerId = $("g.center").attr("id");
    let array = getRelationTypes(centerId);
    setRelationTypeTypeahead(array);
}

detailObj.prototype.rolseRevise = function (item, type = "add") {
    $(".properties").hide();
    $(".properties-revise").show();
    $(".properties-revise").children().remove();
    this.drawRightTitle(propertiesRevise, "修改", false, false);

    html = this.generateTitle("角色", "role-revise");
    $(".properties-revise").append(html);

    html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<div class="row">' +
        '<div class="col-xs-4" style="padding: 3px"><input type="text" class="stigmod-input type-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="角色"></div>' +
        '<div class="col-xs-8" style="padding: 3px"><input type="text" class="stigmod-input value-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="对象"></div>' +
        '</div></a>';
    $(".properties-revise").find("#role-revise").append(html);

    html = this.generateSubmitLogo();
    $(".properties-revise").find("#role-revise").append(html);

}

//submit
detailObj.prototype.classReviseSubmit = function (item, candidate = 0) {

    let type = $(item).find(".type-input").val();
    let value = $(item).find(".value-input").val();

    let err = data.isCreationIllegal("class", type, value)
    if (err != "") {
        alert(err)
        return;
    }

    let entity = {
        tags: [type],
        value: value,
        nodeId: generateFrontNodeID(value, "e"),
        valueId: generateFrontNodeID(value, "v"),
        relationId: generateFrontRelationID(candidate)
    }

    //console.log(entity);
    connection.io_create_insModel_entity(entity);
}

detailObj.prototype.classKeyReviseSubmit = function (item, tmpModel = instance_model, checkDulp = true) {

    let centerId = $(".entity.center").attr("id");
    let entity = svg.getEntity(centerId);
    let value = entity.centerNode[centerId].value;
    let newValue = $(item).find(".value-input").val();

    revise_pending = {
        "remove":{
            "entities": [],
            "relations": []
        },
        "add":{
            "entities": [],
            "nodes": [],
            "relations": []
        }
    }

    let relationShift = 0;
    //删除旧节点
    //connection.io_remove_insModel_node(centerId);
    revise_pending.remove.entities.push(centerId);
    //生成新节点
    let newEntityId = generateFrontNodeID(newValue);
    let newEntity = {
        tags: entity.centerNode[centerId].tags,
        value: newValue,
        nodeId: newEntityId,
        valueId: generateFrontNodeID(newValue, "v"),
        relationId: generateFrontRelationID(relationShift++)
    }
    //connection.io_create_insModel_entity(newEntity);
    revise_pending.add.entities.push(newEntity);

    //生成新关系
    let newRelationObj,newRelationId;
    for(let relationId in entity.relations){
        newRelationObj = {};
        newRelationId = generateFrontRelationID(relationShift++);
        newRelationObj[newRelationId] = $.extend(true, {}, entity.relations[relationId]);
        let relation = newRelationObj[newRelationId];
        newRelationObj[newRelationId].id = newRelationId;//因为原来的关系并没有删除，所以不能用原来的关系
        for(let i in relation.roles){
            if(relation.roles[i].node_id==centerId) relation.roles[i].node_id = newEntityId;
        }
        //connection.io_create_insModel_relation(newRelationObj);
        revise_pending.add.relations.push(newRelationObj);
    }

    if(checkDulp){
        let ids = data.getEntityIdByValue(newValue,tmpModel,newEntity.tags[0]);
        if(ids.length>0){
            $("#modalRevise .modal-body").children().remove();

            let buttonGroup = '<span class="btn-group">' +
                '<button type="button" class="btn btn-sm btn-warning replace">替换实体</button>' +
                '<button type="button" class="btn btn-sm btn-success merge">融合实体</button>' +
                '</span>'
            let string = "";

            for(let i=0;i<ids.length;i++){
                string += '<div class="stigmod-rcmd-title row" style="width: 60%;margin: auto">' +
                '<span class="col-xs-6 duplicated-item" style="text-align: right;padding:5px">' + tmpModel.nodes[ids[i]].tags[0] + ' : ' + tmpModel.nodes[ids[i]].value + '<span style="display: none" class="nodeId" value='+ ids[i] +'></span></span>' +
                '<span class="col-xs-6" style="text-align: left">' + buttonGroup + '</span>' +
                '</div>'
            }

            let html = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            html += '<h4>当前图谱中存在同名元素</h4>';
            html += '<h5>请选择处理方式 <span class="glyphicon glyphicon-question-sign revise-helper"></span></h5>';
            html += '<br/>';
            html += string
            html += '<br/>';

            $("#modalRevise .modal-body").append(html)
            $("#modalRevise").modal("show");
            return;
        }
        /* 测试了下应该可以
        if(data.getEntityIdByValue(newValue,tmpModel).length>0){
            alert("由于后台限制，当前无法创建同名不同类型元素");
            return;
        }
        */
    }

    $('#modalRevise .revise-directly').trigger("click");
    return;
}

detailObj.prototype.classRemoveSubmit = function (item) {
    let centerId = $(".entity.center").attr("id");

    connection.io_remove_insModel_node(centerId);
    let $alternate = $(".middle-content .entity").not("#"+centerId);
    if($alternate.length) {
        detail.drawIndex(instance_model);
        $alternate.eq(0).delay("300").trigger("click")
    }else{
        for(let key in instance_model.nodes){
            if(key != centerId){
                network.setData();
                detail.drawIndex(instance_model);
                svg.drawEntity(key);
                if (!$(".btn-group.workspace .btn-default").hasClass("off")) {
                    $("#" + key).delay("10").click();
                } else {
                    drawNodeDetails(key);
                }
                return;
            }
        }
        //如果没有东西了
        detail.rightColumnShow(properties);
        $(properties).children().remove();
        detail.drawPropertyTitle();
    }
}

detailObj.prototype.attributeReviseSubmit = function (item) {

    let type = $(item).find(".type-input").val();
    let value = $(item).find(".value-input").val();

    let err = data.isCreationIllegal("attribute", type, value);
    if (err != "") {
        alert(err);
        return;
    }

    //删除旧的节点和关系
    let origItem = $(".properties").find(".active");
    let origNode = $(origItem).find(".nodeId").attr("value");
    let origRelation = $(origItem).find(".relationId").attr("value");
    let origValue = $(origItem).find(".value").attr("value");

    if(value == origValue){//未修改
        $(item).find(".button-cancel").trigger("click");
        return;
    }

    if(origItem.length>0){//为修改
        if (!(origRelation == "" || origRelation == undefined)) {   //好像肯定是有的，只是没有值而已
            connection.io_remove_insModel_relation(origRelation);
        }
        if (!(origNode == "" || origNode == undefined)) {
            connection.io_remove_insModel_node(origNode);
        } else {//则当前节点为中心节点
            this.classKeyReviseSubmit(item);
            return;
        }
    }
    //else为创建

    //生成节点
    let nodes = {};
    let nodeId = generateFrontNodeID(value)
    let tags = data.getAttrTags(type)
    nodes[nodeId] = {
        "dataType": type,
        "tags": tags,
        "value": value
    }
    connection.io_create_insModel_node(nodes)
    //生成关系
    let centerId = $(".entity.center").attr("id");
    let relationId = generateFrontRelationID();
    let relations = {};
    relations[relationId] = {
        "type": type,
        "roles": [
            {"rolename": "", "node_id": centerId},
            {"rolename": type, "node_id": nodeId}
        ]
    }
    connection.io_create_insModel_relation(relations);
    return;
}

detailObj.prototype.attributeRemoveSubmit = function (item) {

    let centerID = $(".entity.center").attr("id");

    //删除旧的关系
    let origItem = $(".properties").find(".active");
    let origNode = $(origItem).find(".nodeId").attr("value");
    let origRelation = $(origItem).find(".relationId").attr("value");

    if (!(origRelation == "" || origRelation == undefined)) {   //好像肯定是有的，只是没有值而已
        connection.io_remove_insModel_relation(origRelation);
    }
    if (!(origNode == "" || origNode == undefined)) {
        connection.io_remove_insModel_node(origNode);
    } else {//则当前节点为中心节点
        this.classRemoveSubmit();
        return;
    }
    //更新页面
    $("#" + centerID).click();  //这个在逻辑上有问题
    //transAnimation(centerID,null,null,instance_model);
}

detailObj.prototype.relationReviseSubmit = function (item) {

    let type = $(item).find(".type-input").val();
    //let value = $(item).find(".value-input").val();

    let length = $("#roles").children().length;
    let roles = [];
    let notExistArray = [];
    for (let i = 0; i < length; i++) {
        //判断承担者是否存在
        let node = $("#roles").children().find(".node input").eq(i).val();
        let nodeId = data.getEntityIdByValue(node, instance_model)[0];
        if (nodeId == undefined) {
            notExistArray.push({node: node, tag: $("#roles").children().find(".tag").eq(i).attr("value")})
        }
        //加入队列
        roles.push({
            rolename: $("#roles").children().find(".role").eq(i).attr("value"),
            tag: $("#roles").children().find(".tag").eq(i).attr("value"),
            node: node,
            nodeId: nodeId
        })
    }

    if (notExistArray.length > 0) {
        $("#modalAddEntity .modal-body").children().remove();
        let string = "";
        let span = "";
        for (let i = 0; i < notExistArray.length; i++) {
            string += '<p>实体' + notExistArray[i].node + '（类型：' + notExistArray[i].tag + '）</p>';
            span += '<span style="display: none;"><input class="type-input" type="text" value=' + notExistArray[i].tag + '><input class="value-input" type="text" value=' + notExistArray[i].node + '></span>';
        }
        let html = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        html += '<h4>以下实体尚未创建</h4>';
        html += '<br/>';
        html += string
        html += '<br/>';
        html += '<h5>是否自动创建实体，并完成关系的创建</h5>';
        html += span

        $("#modalAddEntity .modal-body").append(html)
        $("#modalAddEntity").modal("show");
        return;
    }

    //数据有效性检测
    let err = data.isCreationIllegal("relation", type, "", roles);
    if (err != "") {
        alert(err);
        return;
    }

    //删除旧的节点和关系
    let origItem = $(".properties").find(".active");
    let origRelation = $(origItem).find(".relationId").attr("value");
    if (!(origRelation == "" || origRelation == undefined)) {   //好像肯定是有的，只是没有值而已
        connection.io_remove_insModel_relation(origRelation);
    }

    //生成关系
    let centerId = $(".entity.center").attr("id");
    let relationId = generateFrontRelationID();
    let relations = {};
    relations[relationId] = {
        "type": type,
        "roles": []
    }
    for (let i in roles) {
        relations[relationId].roles[i] = {
            "rolename": roles[i].rolename,
            "node_id": roles[i].nodeId
        }
    }

    connection.io_create_insModel_relation(relations);
    return;
}

detailObj.prototype.relationRemoveSubmit = function (item) {
    let centerID = $(".entity.center").attr("id");

    //删除旧的关系
    let origItem = $(".properties").find(".active");
    let origNode = $(origItem).find(".nodeId").attr("value");
    let origRelation = $(origItem).find(".relationId").attr("value");
    /* 好像是不需要产出实体的
     if (origNode != "") {
     connection.io_remove_insModel_node(origNode);
     }else{//则当前节点为中心节点
     connection.io_remove_insModel_node($(".graph .center").attr("id"));
     }
     */
    if (!(origRelation == "" || origRelation == undefined)) {   //好像肯定是有的，只是没有值而已
        connection.io_remove_insModel_relation(origRelation);
    }
    //更新页面
    $("#" + centerID).click();  //这个在逻辑上有问题
    //transAnimation(centerID,null,null,instance_model);
}

//html
detailObj.prototype.generateTitle = function (title, type) {
    let html = '<div class="panel panel-default">' +
        '<div class="panel-heading">' +
        '<div class="panel-title stigmod-rcmd-title">' + title + '</div>' +
        //'<span class="panel-title stigmod-rcmd-title" style="margin-left: 30%;margin-right: 25%">' + title + '</span>' +
        //'<span class="glyphicon glyphicon-remove" type="remove" ></span>' +
        '</div>' +
        '<div class="list-group" id=' + type + '></div>' +
        '</div>';
    return html
}

detailObj.prototype.generateXTitle = function (title, type) {
    let html = '<div class="panel panel-default">' +
        '<div class="panel-heading">' +
        '<span class="panel-title stigmod-rcmd-title" style="margin-left: 30%;margin-right: 25%">' + title + '</span>' +
        //'<span class="glyphicon glyphicon-remove" type="remove" style="z-index: 2"></span>' +
        '</div>' +
        '<div class="list-group" id=' + type + '></div>' +
        '</div>';
    return html

}

detailObj.prototype.generateCollapseTitle = function (title, type) {
    let html = '<div class="panel panel-default">' +
        '<div class="panel-heading" data-toggle="collapse" data-parent="#accordion" href="#' + title + '" aria-expanded="true" aria-controls="collapseOne">' +
        '<span class="panel-title stigmod-rcmd-title" style="margin-left: 30%;margin-right: 25%">' + title + '</span>' +
        '<span class="pull-right glyphicon glyphicon-th-list" type="remove" style="z-index: 2;"></span>' +
        '</div>' +
        '<div class="list-group panel-collapse collaspe in" id=' + title + '></div>' +
        '</div>';
    return html
}

detailObj.prototype.generateEntityPlusButton = function () {
    let html = '<div class="panel panel-default">' +
        '<div class="panel-heading">' +
        '<span class="panel-title stigmod-rcmd-title" style="margin-left: 30%;margin-right: 25%">' +
        '<span class="fa fa-plus" type="class" style="z-index: 2"></span>' +
        '</span>' +
        '</div>' +
        '</div>';
    return html
}

detailObj.prototype.generateCollapseContent = function (type, value, nodeId = "") {
    if (type == undefined) type = "姓名";
    //alert(nodeId);
    //alert(relationId);
    let html = '<a href="#" class="list-group-item stigmod-hovershow-trig entity" style="text-align: center">' +
        '<span class="nodeId" value=' + nodeId + '></span>' +
        '<span class="type" value=' + type + '></span>' +
        '<span class="value" value=' + value + '>' + value + '</span>' +
        '<span class="pull-right stigmod-hovershow-cont">' +
        '<span class="fa fa-search-plus" style="z-index: 100"></span>' +
        '</span></a>';
    return html;
}

detailObj.prototype.generateContent = function (type, value, nodeId = "", relationId = "") {
    if (type == undefined) type = "姓名";
    //alert(nodeId);
    //alert(relationId);
    let html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
        '<span class="nodeId" value=' + nodeId + '></span>' +
        '<span class="relationId" value=' + relationId + '></span>' +
        '<span class="type" value=' + type + '>' + type + '</span>' + ' : ' +
        '<span class="value" value=' + value + '>' + value + '</span>' +
        '<span class="pull-right stigmod-hovershow-cont">' +
        '<span class="fa fa-edit"></span>' +
        '</span></a>';
    return html;
}

detailObj.prototype.generatePlusLogo = function (type) {
    let html = '<a href="#" class="list-group-item stigmod-hovershow-trig" style="text-align: center">' +
        '<span class="fa fa-plus" type=' + type + '></span></a>';
    return html;
}

detailObj.prototype.generateSubmitLogo = function (hasRemove = false) {
    let html = '<a href="#" class="list-group-item stigmod-hovershow-trig" style="text-align: center">' +
        '<span class="button-ok" type="ok"><button class="btn btn-default btn-sm" type="button" >确认</button></span>' +
        '<span>&nbsp;</span>' +
        '<span class="button-cancel" type="cancel"><button class="btn btn-default btn-sm" type="button" >取消</button></span>' +
        '<span>&nbsp;</span>';
    if (hasRemove) {
        html += '<span class="button-remove" type="remove"><button class="btn btn-default btn-sm" type="button" >删除</button></span>' +
            '</a>';
    }
    return html;
}

detailObj.prototype.generateIndex = function (tag, text, nodeId) {
    var html = '<li style="text-align:left;margin: 10%;font-size:16px" nodeid=' + nodeId + '>' + tag + " : " + text + '</li>';
    return html;
}

detailObj.prototype.generateRole = function (role, node, tag, relationId) {
    let html = '<div class="list-group-item stigmod-hovershow-trig row ">' +
        '<span class="col-xs-4 role vcenter" value=' + role + '>' + role + '</span>' +
        '<span class="col-xs-8 node vcenter" style="padding: 0px"><input type="text" class="stigmod-input typeahead" value=' + node + '></input></span>' +
        '<span class="tag" style="display: none" value=' + tag + '>' +
        '<span class="relation" style="display: none" value=' + relationId + '>' +
        '</div>';
    return html;
}

detailObj.prototype.rightColumnShow = function (item) {
    $(index).hide();
    $(properties).hide();
    $(propertiesRevise).hide();
    $(item).show();
}

detailObj.prototype.filterRelations = function (rawRelations,centerId,tmpModel=instance_model) {

    let relations = []
    for (let id in rawRelations) {
        let rawRelation = rawRelations[id];
        if (relationTypeArray.indexOf(rawRelation.type) != -1) {
            let nodeId = [];
            let value = [];
            if(centerId==undefined){
                let centerId = $("g.entity.center").attr("id");
            }
            let mutex = 0;

            for (let role of rawRelation.roles) {
                if (role.node_id != centerId || mutex) {
                    nodeId.push(role.node_id)
                    value.push(tmpModel.nodes[role.node_id].value)
                } else {
                    mutex++;
                }
            }

            relations.push({
                relationId: id,
                nodeId: nodeId,
                type: rawRelation.type,
                value: value
            })
        }
    }
    return relations;
}

detailObj.prototype.citeRecommendation = function (relationId, tmpModel = recommend_model) {

    isGetRcmd = true;
    svgPending = 0;

    popoverHide();

    if (tmpModel.relations[relationId] == undefined) {
        //console.log("citeRecommendation error!");
        return;
    }

    let entitiesStr = "";
    let nodesStr = "";
    let relationsStr = "";

    rcmd_pending = {
        "entities": [],
        "nodes": {},
        "relations": {}
    }

    let relationIdShift = 0;

    for (let i in tmpModel.relations[relationId].roles) {

        let nodeId = tmpModel.relations[relationId].roles[i].node_id;   //找到每一个承担者

        if (instance_model["nodes"][nodeId] == undefined) {   //不存在节点的话创建

            relationsStr += recommend_model["nodes"][nodeId].value + ","

            if (data.isEntity(nodeId, recommend_model)) {//是实体节点，需要创建3重信息
                let value = recommend_model["nodes"][nodeId].value
                let entity = {
                    tags: recommend_model["nodes"][nodeId].tags,
                    value: value,
                    nodeId: nodeId,
                    valueId: generateFrontNodeID(value, "v"),
                    relationId: generateFrontRelationID(relationIdShift++)
                }
                //connection.io_create_insModel_entity(entity);
                entitiesStr += value + ",";
                rcmd_pending.entities.push(entity);
                svgPending++;//每个实体都会有主属性的关系
            } else {//不是实体节点，需要创建节点信息
                let value = recommend_model["nodes"][nodeId].value
                let nodes = {};
                //let nodeId = generateFrontNodeID(value);
                nodes[nodeId] = {
                    "dataType": recommend_model["nodes"][nodeId].tags,
                    "value": value
                }
                //connection.io_create_insModel_node(nodes)
                nodesStr += value + ",";
                rcmd_pending.nodes = nodes;
            }
        } else {
            relationsStr += instance_model["nodes"][nodeId].value + ","
        }
    }

    //创建关系
    let relations = {};
    relations[relationId] = tmpModel.relations[relationId]
    //connection.io_create_insModel_relation(relations);
    relationsStr = " [" + tmpModel.relations[relationId].type + "] " + relationsStr;
    rcmd_pending.relations = relations;
    svgPending++;

    $("#modalCiteRcmd .modal-body").children().remove();
    let string = "";
    if (entitiesStr.length > 0) {
        string += "<p><b>实体: </b>" + entitiesStr.substring(0, entitiesStr.length - 1) + "</p>";
    }
    if (nodesStr.length > 0) {
        string += "<p><b>属性: </b>" + nodesStr.substring(0, nodesStr.length - 1) + "</p>";
    }
    if (relationsStr.length > 0) {
        string += "<p><b>关系: </b>" + relationsStr.substring(0, relationsStr.length - 1) + "</p>";
    }

    let html = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    html += '<h4>将要创建以下信息</h4>';
    html += '<br/>';
    html += string
    html += '<br/>';
    html += '<h5>是否创建？</h5>';

    $("#modalCiteRcmd .modal-body").append(html)
    $("#modalCiteRcmd").modal("show");

}