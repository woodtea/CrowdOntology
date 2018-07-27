/**
 * Created by ChiangEarl on 18/7/26.
 */

//使得提示工具Popover生效
$('#stigmod-add-left-btn[data-popover="popover"]').popover({
    "animation":true,
    "title":"新建",
    "trigger":"focus",
    "placement":"right",
    "container": 'body',
    "html":true,
    "content":'<div class="btn-group"><button class="btn btn-primary add-class">实体</button><button class="btn btn-success add-relation">关系</button></div>'
    // "content":'<div class="btn-group" data-toggle="buttons"><label class="btn btn-primary active"> <input type="checkbox" autocomplete="off" checked>实体</label><label class="btn btn-primary"><input type="checkbox" autocomplete="off">关系</label></div>'
})

$('[data-popover="popover"]').popover()

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