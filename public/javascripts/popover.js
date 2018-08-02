/**
 * Created by ChiangEarl on 18/7/26.
 */

//使得提示工具Popover生效
$('#stigmod-add-left-btn[data-popover="popover"]').popover({
    "animation":true,
    "title":"新建",
    "trigger":"focus",
    "placement":"bottom",
    "container": 'body',
    "html":true,
    "content":'<div class="btn-group"><button class="btn btn-primary add-class">实体</button><button class="btn btn-success add-relation">关系</button></div>'
    // "content":'<div class="btn-group" data-toggle="buttons"><label class="btn btn-primary active"> <input type="checkbox" autocomplete="off" checked>实体</label><label class="btn btn-primary"><input type="checkbox" autocomplete="off">关系</label></div>'
})



$('[data-popover="popover"]').popover()

/*
$(document).on("mouseover", 'li', function () {
    console.log($(this));
    $(this).popover({
        "animation":true,
        "title":"详情",
        "trigger":"hover",
        "placement":"left",
        "container": 'body',
        "html":true,
        "content":'<p>test1234</p>'
    })

    $(this).popover("show")
})
*/

$(document).on("mouseover", '.rcmdMask', function () {
    console.log($(this));
    $(this).popover({
        "animation":true,
        "title":"推荐信息",
        "trigger":"hover",
        "placement":"left",
        "container": 'body',
        "html":true,
        "content":'<p>(双击元素后，添加至当前图谱)</p>'
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

//使得提示工具Tooltip生效
//不再使用
//$('[data-tooltip="tooltip"]').tooltip()