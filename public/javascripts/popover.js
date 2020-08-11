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

// $('#stigmod-history-btn').popover({
//     "animation": true,
//     "trigger": "focus",
//     "placement": "bottom",
//     "container": 'body',
//     'min-width': '2000px',
//     "html": true,
//
// })


$('[data-popover="popover"]').popover()

$(document).on("mouseover", '.showPopover.li', function () {

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

    //console.log(content)

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

$(document).on("mouseover",".ellipsis",function(){
    // 放在.entity.isRecommendation之后，优先显示ellipsis内容
    $(this).popover({
        "animation": true,
        "trigger": "hover",
        "container": 'body',
        "html": true,
        "content": $(this).attr('datatext')
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
        detail.classRevise(this, "add");
    })
    $(document).on("click", '.popover-content .add-relation', function () {
        detail.relationRevise(this, "add");
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

