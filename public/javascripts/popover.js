/**
 * Created by ChiangEarl on 18/7/26.
 */

//使得提示工具Popover生效
$('#stigmod-add-left-btn[data-popover="popover"]').popover({
    "animation": true,
    "title": "新建",
    "trigger": "focus",
    "placement": "bottom",
    "container": 'body',
    "html": true,
    "content": '<div class="btn-group"><button class="btn btn-primary add-class">实体</button><button class="btn btn-success add-relation">关系</button></div>'
    // "content":'<div class="btn-group" data-toggle="buttons"><label class="btn btn-primary active"> <input type="checkbox" autocomplete="off" checked>实体</label><label class="btn btn-primary"><input type="checkbox" autocomplete="off">关系</label></div>'
})


$('[data-popover="popover"]').popover()


$(document).on("mouseover", '.showPopover li', function () {

    let nodeId = data.getEntityIdByValue($(this).text())[0];
    let content = generatePoperContent(nodeId);

    $(this).popover({
        "animation": true,
        "title": "详情",
        "trigger": "hover",
        "placement": "left",
        "container": 'body',
        "html": true,
        "content": content
    })

    $(this).popover("show")
})

$(document).on("mouseover", '.entity.isRecommendation', function () {

    let id = $(this).attr('id');
    id = id.split("-")["0"];
    let content = generatePoperContent(id,recommend_model);

    $(this).popover({
        "animation": true,
        "title": "详情",
        "trigger": "hover",
        "placement": "left",
        "container": 'body',
        "html": true,
        "content": content
    })

    $(this).popover("show")
})

$(document).on("mouseover", '.rcmdMask', function () {
    $(this).popover({
        "animation": true,
        "title": "推荐信息",
        "trigger": "hover",
        "placement": "left",
        "container": 'body',
        "html": true,
        "content": '<p>(双击元素后，添加至当前图谱)</p>'
    })

    $(this).popover("show")
})

$(document).on("mouseover", '#modalRevise .revise-helper', function () {

    let content = "<p><b>直接修改:</b>直接修改实体名称</p>" +
        "<p><b>替换实体:</b>使用修改实体替换行内实体，行内实体相关的属性和关系被删除</p>" +
        "<p><b>融合实体:</b>修改实体与行内实体进行融合，用修改实体补充行内实体，行内实体原有的施行和关系不变</p>"


    $(this).popover({
        "animation": true,
        "title": "帮助",
        "trigger": "hover",
        "placement": "right",
        "container": 'body',
        "html": true,
        "content": content
    })

    $(this).popover("show")
})

$(document).on("mouseover", '.duplicated-item', function () {

    let nodeId = $(this).find(".nodeId").attr("value");
    let content = generatePoperContent(nodeId);

    $(this).popover({
        "animation": true,
        "title": "详情",
        "trigger": "hover",
        "placement": "left",
        "container": 'body',
        "html": true,
        "content": content
    })

    $(this).popover("show")
})

$(function () {
    $(document).on("click", '.popover-content .add-class', function () {
        //实例层
        if($(".btn-group.workspace2 .btn-default").hasClass("off")){
            detail.classRevise(this, "add");
        }
        //模型层
        else{
            $("#modalAddEntityInModel").modal("show");
        }

    })
    $(document).on("click", '.popover-content .add-relation', function () {
        if($(".btn-group.workspace2 .btn-default").hasClass("off")) {
            detail.relationRevise(this, "add");
        }
        else{
            $("#modalAddRelInModel2").modal("show");
            html = detail.generateTitle("模型层关系", "model-relation-add");
            let item = $("#modalAddRelInModel2 .modal-body");
            $(item).children().remove();
            $(item).append(html);
            html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
                '<div class="row">' +
                '<div class="col-xs-12"><input type="text" class="stigmod-input type-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="关系" style="text-align:center;"></div>' +
                '</div></a>';
            $(item).find("#model-relation-add").append(html);
            html = '<div class="panel panel-default list-group-item showPopover" style="margin: 0px">' +
                '<div class="panel-heading" style="padding-top:5px;padding-bottom: 5px">' +
                '<div class="stigmod-rcmd-title row">' +
                '<span class="col-xs-4">' + "角色" + '</span>' +
                '<span class="col-xs-4">' + "承担者" + '</span>' +
                '<span class="col-xs-4">' + "数量" + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="list-group roles">' +
                '</div>' +
                '</div>';
            $(item).find("#model-relation-add").append(html);
            $(item).find("#model-relation-add").append(detail.generatePlusLogo("relRole"));
            $(item).find("#model-relation-add .roles").append(generateNewRole("","","","",false,true));
            setRawRelationRoleValueTypeahead2($("#model-relation-add .roles").children().last());
            html = '<div class="alert"></div>';
            $(item).append(html);

        }
    })
});

generatePoperContent = function (id,tmpModel=instance_model) {
    let content = "";
    //drawTypes
    content += generatePoperLine("实体 : " + tmpModel.nodes[id].tags[0])
    //drawAttributes
    content += generatePoperLine(tmpModel.nodes[id].dataType + " : " + tmpModel.nodes[id].value)//主属性

    entity = data.getEntity(id,tmpModel);
    let attributes = filterAttributes(entity.neighbours,tmpModel);

    attributes.forEach(function (attribute,index,array) {//其他属性
        content += generatePoperLine(attribute.type + " : " + attribute.value)
    })

    //drawRelations
    entity = svg.getEntity(id,tmpModel);
    let relations = detail.filterRelations(entity.relations,id,tmpModel);
    let relationArray = [];
    for (let i in relations) {
        let relation = relations[i];
        if (relationArray.indexOf(relation.relationId) == -1) {
            relationArray.push(relation.relationId);
            content += generatePoperLine(relation.type + " : " + relation.value);
        }
    }

    return content;
}

generatePoperLine = function (text) {
    return '<p>' + text + '</p>';
}

popoverHide = function(){
    $('.rcmdMask').popover("hide");
    $('.entity.isRecommendation').popover("hide");
}

$(document).on("click", '.popover', function () {
    $(this).hide();
})
