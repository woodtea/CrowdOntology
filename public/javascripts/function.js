/*
 * 点击事件和函数
 */

var clicks = 0;
var mutex = 0;
var indexMutex = false;
var faEditClicked = false; //很不好
var isRevise = false; //很不好
var switching = false; //不好
var defaultLocalRec = true; //默认局部推荐 开
var defaultGlobalRec = false; //默认全局推荐 关

$(function () {

    $(document).on("click", '#stigmod-search-left-btn', function () {
        let value = $(this).parent().parent().children("input[type=text]").val();
        let nodeId = data.getEntityIdByValue(value, instance_model)[0];
        if (nodeId != undefined) {
            showLocal();
            svg.drawEntity(nodeId, instance_model); //画出中心区域
            $("#" + nodeId).click();    //点击中心节点
        } else {
            $("#modalSearch .modal-body h5").text('未找到"' + value + '"，' + '是否创建？');
            $("#modalSearch").modal("show");
        }
    })

    $(document).on("click", '#stigmod-history-btn', function () {
        let list = $('#history-list');
        list.empty();
        for(let i=historylist.length-1;i>=0;i--)
        {
            let id = historylist[i];
            if(instance_model.nodes[id]==undefined) continue;
            let value = instance_model.nodes[id].value;
            let content= ' <li class="historyitem" value="'+id+'"><a>'+value+'</a></li> ';
            list.append(content);
        }
    })

    $(document).on('click','.historyitem',function(){
        let id = $(this).attr('value');
        clickTimeout.set(function () {
            if (instance_model.nodes[id] == undefined) {//这个是要干嘛??
                $(".properties-revise .button-left").click();
                $(properties).children().remove();
                detail.drawIndex();
                svg.drawEntity(id);

            } else {//大多数时候执行这个
                drawNodeDetails(id);
            }
        });
    })

    $('#mute-window').on('show.bs.modal', function () {
        connection.io_get_reject();
    })

    $('#mute-window').on('hide.bs.modal',function(){
        //TODO 模型重绘,暂时使用直接刷新的简单方案，优化效率请参考引用推荐关系
        let nodeId = $('g.entity.center').attr("id");
        let node = {}
        node[nodeId] = eval('(' + JSON.stringify(instance_model.nodes[nodeId]) + ')');
        connection.io_recommend_insModel_node(node);
    })

    $(document).on("click", ".btn.recover-reject", function () {
        connection.io_recover_relation($(this).attr('value'));
        $(this).prop('disabled',true);
    })


    $(document).on("click", ".btn-group.workspace", function () {
        switching=true;
        if ($(this).children(".btn-default").hasClass("off")) {
            //全局图谱
            //if ($(".btn.recommend").hasClass("active")) $(".btn.recommend").trigger("click");    //当前是推荐的状态的话先关闭推荐 //严重怀疑，一条好像不需要
            if ($(".btn.recommend").hasClass("active")) {//当前是推荐的状态的话先关闭推荐 //严重怀疑，一条好像不需要
                $(".btn.recommend").removeClass("active");
                $(".btn.change-btn").hide();
            }

            $("svg.local").hide();
            if(defaultGlobalRec) {// 根据defult判断是否推荐
                $(".btn.recommend").addClass("active");
                network.recommend = true;
            }
            network.setData();
            network.recommend = false;

            $("div.global").show();
            let item = $(index).find(".active");
            let id = $(item).children(".nodeId").attr("value");
            if(id!=undefined){
                network.focusNode(id);
            }
            detail.drawIndex(instance_model, true, id);
            //Edited by cui on 2019/11/5 筛选栏仅在局部图谱显示
            $(".btn.filter-btn").hide();
        } else {
            //局部图谱
            if ($(".btn.recommend").hasClass("active")) $(".btn.recommend").removeClass('active') //关掉全局图谱推荐状态//严重怀疑，一条好像不需要
            $("div.global").hide()
            //$("svg.local").show()
            $("svg.local").css("display", "block");
            $(".btn.filter-btn").show();

            if(defaultLocalRec & d3.select(".entity.center").classed("isRecommendation") == false) {// 根据defult判断是否推荐
                $(".btn.recommend").addClass("active");
                $(".btn.change-btn").show();
                let nodeId = $(".entity.center").attr("id");
                let node = {}
                node[nodeId] = eval('(' + JSON.stringify(instance_model.nodes[nodeId]) + ')');
                //console.log(node);
                connection.io_recommend_insModel_node(node);
            }
        }
        switching = false;
    })

    $(document).on("click", ".btn.recommend", function () {
        if((!!$(".btn-group.workspace").children(".btn-default").hasClass('off'))^switching)
        {//全局图谱
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                if(!switching) defaultGlobalRec = false; //非转换状态下，重新定义默认推荐
                network.recommend = false;
                network.setData();
            } else {//全局图谱推荐
                $(this).addClass("active");
                if(!switching) defaultGlobalRec = true; //非转换状态下，重新定义默认推荐
                network.recommend = true;
                network.setData();
                network.recommend = false;
            }

        }else{
            //局部图谱
            if ($(this).hasClass("active")) {
                //$(this).removeClass("active");
                if(!switching) defaultLocalRec = false;  //非转换状态下，重新定义默认推荐
                let rcmdNode = $(".entity.center.isCentralized");
                if (!$(rcmdNode).length) $(".entity.center").trigger("dblclick");
                $(".change-btn").hide();
            } else {//推荐时需要显示局部图谱
                //$(this).addClass("active");
                if(!switching) defaultLocalRec = true;  //非转换状态下，重新定义默认推荐
                showLocal();
                checkRcmd = true;
                let rcmdNode = $(".entity.center.isCentralized");
                if ($(rcmdNode).length) $(".entity.center").trigger("dblclick");
                $(".change-btn").show();
            }
        }

    })

    //筛选栏层级选择效果
    $(document).on("change",".filter-checkbox:checkbox",function(){
        var checked = $(this).prop("checked"),
            container = $(this).parent().parent(),
            siblings = container.siblings();
        container.find('input[type="checkbox"]').prop({
            indeterminate: false,
            checked: checked
        });
        function checkSiblings(el) {
            var parent = el.parent().parent(),
                all = true;
            el.siblings().each(function() {
                let returnValue = all = ($(this).children().children('input[type="checkbox"]').prop("checked") === checked);
                return returnValue;
            });
            if (all && checked) {
                parent.children().children('input[type="checkbox"]').prop({
                    indeterminate: false,
                    checked: checked
                });
                checkSiblings(parent);
            } else if (all && !checked) {
                parent.children().children('input[type="checkbox"]').prop("checked", checked);
                parent.children().children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));
                checkSiblings(parent);
            } else {
                el.parents("li").children().children('input[type="checkbox"]').prop({
                    indeterminate: true,
                    checked: false
                });
            }
        }
        checkSiblings(container);
    })

    $(document).on("click", ".btn.filter-cancel", function () {//在取消筛选时恢复筛选框效果
        $(".filter-checkbox.entity:checkbox").each(function(){
            if($(this).prop("checked")^svg.valuelist.entity.has($(this).attr("value"))){
                $(this).trigger("click");
            }
        });
        $(".filter-checkbox.relation:checkbox").each(function(){
            if($(this).prop("checked")^svg.valuelist.relation.has($(this).attr("value"))){
                $(this).trigger("click");
            }
        });
    })
    $(document).on("click", ".btn.filter-apply", function () {
        svg.valuelist.fresh = false;
        svg.valuelist.init();
        $(".filter-checkbox.entity:checkbox").each(function(){
            if($(this).prop("checked")){
                svg.valuelist.entity.add($(this).attr("value"));
                //svg.mutelist.entity.delete($(this).attr("value"));
                if(svg.mape2r!=undefined)
                {
                    if(svg.mape2r[$(this).attr("value")]!=undefined)
                    {
                        for(let r of svg.mape2r[$(this).attr("value")])
                        {
                            network.muterelations.delete(r);
                        }
                    }
                }
            }
            else
            {
                //if(!svg.mutelist.entity.has($(this).attr("value")))
                {
                    if(svg.mape2r!=undefined)
                    {
                        if(svg.mape2r[$(this).attr("value")]!=undefined)
                        {
                            for(let r of svg.mape2r[$(this).attr("value")])
                            {
                                network.muterelations.add(r);
                            }
                        }
                    }
                }
                //svg.mutelist.entity.add($(this).attr("value"));
            }
        });
        $(".filter-checkbox.relation:checkbox").each(function(){
            if($(this).prop("checked")){
                svg.valuelist.relation.add($(this).attr("value"));
                svg.mutelist.relation.delete($(this).attr("value"));
            }
            else
            {
                svg.mutelist.relation.add($(this).attr("value"));
            }
        });
        let id= svg.centerNode.id;
        if($(".btn.recommend").hasClass("active"))
        {
            if ($(".entity.center").attr("id") == id){  //如果就是当前推荐的话，直接画
                svg.drawRecommendation(id);
            }
            else {  //如果是非当前元素的话，先画元素；然后再画推荐
                svg.drawEntity(id);
                let node = {}
                node[id] = eval('(' + JSON.stringify(instance_model.nodes[id]) + ')');
                connection.io_recommend_insModel_node(node);
                svg.drawRecommendation(id);
            }
        }else{
            svg.drawEntity(id);
        }
        svg.valuelist.fresh=true;
    })

    $(document).on("click",".btn.change-btn",function(){
        svg.rcmd.fresh=false;
        svg.rcmd.jumpLen+=svg.rcmd.showLen;
        let centerNode = $(".entity.center");
        let id= centerNode.attr("id");
        svg.drawRecommendation(id);
        svg.rcmd.fresh=true;
    })

    $(document).on("click",".filter-fold.glyphicon",function(){
        if($(this).hasClass("glyphicon-chevron-down"))
        {
            $(this).siblings("ul").hide();
            $(this).removeClass("glyphicon-chevron-down");
            $(this).addClass("glyphicon-chevron-right");
        }
        else
        {
            $(this).siblings("ul").show();
            $(this).removeClass("glyphicon-chevron-right");
            $(this).addClass("glyphicon-chevron-down");
        }
    })


    $(document).on("click", '#modalSearch .btn-primary', function () {
        $("#modalSearch").modal("hide");
        //$(".fa-plus[type='class']").trigger("click");
        detail.classRevise(this, "add");
        $("#class-revise .value-input").val($("#stigmod-search-left-input").val());
    })

    $(document).on("click", '#modalAddEntity .btn-primary', function () {
        //isRefreshSVG = false;
        let item = $("#modalAddEntity .modal-body span");
        svgPending = item.length - 1;//第一个span是x号
        for (let i = 1; i < item.length; i++) {
            detail.classReviseSubmit(item[i], i);
        }
        $("#modalAddEntity").modal('hide')
    })

    $(document).on("click", '#modalRec .btn-primary', function () {
        //console.log('clicked');
        $("#modalRec").modal('hide')
        isGetRcmd = true;   //跟显示图元有关
        connection.io_cite_recommend(0);
        console.log(rcmd_pending);
        for (let i in rcmd_pending.entities) {
            connection.io_create_insModel_entity(rcmd_pending.entities[i]);
        }
        if (getJsonLength(rcmd_pending.nodes) > 0) {
            connection.io_create_insModel_node(rcmd_pending.nodes)
        }
        if (getJsonLength(rcmd_pending.relations) > 0) {
            connection.io_create_insModel_relation(rcmd_pending.relations);
            //console.log(rcmd_pending.relations);
        }
        connection.io_cite_recommend(1);
    })


    $(document).on("click",'#modalRec .btn-warning',function(){
        $('#modalRec').modal('hide')
        if (getJsonLength(rcmd_pending.relations) > 0) {
            //connection.io_create_insModel_relation(rcmd_pending.relations);
            //console.log(rcmd_pending.relations);
            connection.io_reject_rcmdModel_relation(rcmd_pending.relations);
        }

    })

    //@deprecated
    $(document).on("click", '#modalCiteRcmd .btn-primary', function () {
        $("#modalCiteRcmd").modal('hide')
        connection.io_cite_recommend(0);
        for (let i in rcmd_pending.entities) {
            connection.io_create_insModel_entity(rcmd_pending.entities[i]);
        }
        if (getJsonLength(rcmd_pending.nodes) > 0) {
            connection.io_create_insModel_node(rcmd_pending.nodes)
        }
        if (getJsonLength(rcmd_pending.relations) > 0) {
            connection.io_create_insModel_relation(rcmd_pending.relations);
        }
        connection.io_cite_recommend(1);
    })

    $(document).on("click", '#modalRevise button', function () {

        if($(this).hasClass("revise")){//直接修改
            alert("由于后台限制，当前无法使用")
            return;
        }else if($(this).hasClass("replace")){//直接修改
            let id = $(this).parent().parent().parent().find(".nodeId").attr("value");
            revise_pending.remove.entities.push(id);
        }else if($(this).hasClass("merge")){//直接修改
            let id = $(this).parent().parent().parent().find(".nodeId").attr("value");
            reviseMergeFilter(id);
        }else if($(this).hasClass("cancel")){//直接修改
            return;
        }

        $("#modalRevise").modal('hide')

        //操作
        for (let i in revise_pending.remove.entities) {
            connection.io_remove_insModel_node(revise_pending.remove.entities[i]);
        }
        for (let i in revise_pending.remove.relations) {
            connection.io_remove_insModel_relation(revise_pending.remove.relations[i]);
        }
        //add
        for (let i in revise_pending.add.entities) {
            connection.io_create_insModel_entity(revise_pending.add.entities[i]);
        }
        for (let i in revise_pending.add.nodes) {
            connection.io_create_insModel_node(revise_pending.add.nodes[i])
        }
        for (let i in revise_pending.add.relations) {
            connection.io_create_insModel_relation(revise_pending.add.relations[i]);
        }

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
    $(document).on('mouseover','g.entity.isRecommendation',function(){
        let id = $(this).attr('id');
        id = id.split("-")["0"];
        if(data.isEntity(id,instance_model,false)) $(this).attr("fill","white");
    })
    $(document).on('mouseout','g.entity.isRecommendation',function(){
       $(this).attr("fill","black");
    })

    //单击节点
    $(document).on("click", 'g.entity', function () {
        svg.svg.selectAll("g.relation").classed("active", false);
        svg.svg.selectAll("path").classed("active", false);
        //$(".btn.recommend").removeClass("active"); //保持原来的推荐状态
        let item = this;
        if (d3.select(this).classed("isRecommendation") == true) {
            clickTimeout.set(function () {
                let id = $(item).attr('id');
                id = id.split("-")["0"];
                //alert("双击节点可以直接节点与对应关系");
                // 就是这里
                if(data.isEntity(id,instance_model,false)) drawNodeDetails(id);
            });
        } else {
            clickTimeout.set(function () {
                let id = $(item).attr('id');
                id = id.split("-")["0"];
                if (instance_model.nodes[id] == undefined) {//这个是要干嘛??
                    $(".properties-revise .button-left").click();
                    $(properties).children().remove();
                    detail.drawIndex();
                    svg.drawEntity(id);

                } else {//大多数时候执行这个
                    drawNodeDetails(id);
                }
            });
        }
        $(".popover.fade.right.in").hide(); //隐藏不必要的popover
    })

    $(document).on("click", 'g.relation', function () {
        let relationId = $(this).attr("id")
        //删除历史active
        svg.svg.selectAll("g.relation").classed("active", false);
        svg.svg.selectAll("path").classed("active", false);

        //增加新的active
        let classStr = $(this).attr("class");
        $(this).attr("class", classStr + " active");

        $("path[id^='" + relationId + "']").each(function (i) {
            let str = $(this).attr("class");
            $(this).attr("class", classStr + " active");
        })
        //detail部分
        let id = $(this).attr('id');
        //drawRelationDetails(id);
        let item = $("span.relationId[value^='" + id + "']").parent();
        $("body .graph-row .properties .active").removeClass("active");
        $(item).addClass("active");

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
        showLocal();
        $("#" + nodeId).click();    //点击中心节点
    })

    // 响应推荐事件
    // $(document).on("click", '.entity.isRecommendation', function () {
    // $(document).on("click", 'g.isRecommendation', function () {
    //     // 初始化
    //     let item = $("#modalRec .modal-body")
    //     let id = $(this).attr("id");
    //
    //     clickTimeout.set(function () {
    //
    //         $(item).children().remove();
    //
    //         let ids = id.split("-");
    //         let nodeId = ids[0]
    //         let relationId = ids[ids.length - 1];
    //
    //         // 获取构建信息
    //         rcmd_pending = detail.getRecommendationDetail(relationId)
    //         // let content = detail.getRecommendationContent(relationId, rcmd_pending)
    //         content = detail.getRecommendationContentEntity(relationId, rcmd_pending)
    //         content += detail.getRecommendationContentRel(relationId, rcmd_pending)
    //         $(item).append(content)
    //
    //         // 获取推荐实体信息
    //         // content = generatePoperContent(nodeId,recommend_model);
    //         // $(item).append(content)
    //
    //         $("#modalRec").modal("show")
    //     });
    // })

    //双击节点
    $(document).on("dblclick", 'g', function () {
        if (d3.select(this).classed("element-group") == true)
        {
            return;
        }
        if (d3.select(this).classed("isRecommendation") == true) { //双击推荐信息 -> 引用推荐
            // clickTimeout.clear();
            //
            // let id = $(this).attr("id");
            // let ids = id.split("-");
            // let relationId = ids[ids.length - 1];
            //
            // detail.citeRecommendation(relationId);
            let item = $("#modalRec .modal-body")
            let id = $(this).attr("id");

            clickTimeout.set(function () {

                $(item).children().remove();

                let ids = id.split("-");
                let nodeId = ids[0]
                let relationId = ids[ids.length - 1];

                // 获取构建信息
                rcmd_pending = detail.getRecommendationDetail(relationId)
                // let content = detail.getRecommendationContent(relationId, rcmd_pending)
                content = ""
                //content = detail.getRecommendationContentEntity(relationId, rcmd_pending)
                content += detail.getRecommendationContentRel(relationId, rcmd_pending)
                $(item).append(content)
                //console.log(content);

                // 获取推荐实体信息
                // content = generatePoperContent(nodeId,recommend_model);
                // $(item).append(content)

                $("#modalRec").modal("show")
                //detail.citeRecommendation(relationId);
            });
        } else {
            clickTimeout.clear();

            if (d3.select(this).classed("isCentralized") == false) {//推荐状态的节点
                if (d3.select(this).classed("center") == true)
                    $(".btn.recommend").removeClass("active");    //保持推荐状态
                $(this).trigger("click");
                return;
            } else {//非推荐状态
                $(".btn.recommend").addClass("active");
                let nodeId = $(this).attr("id");
                let node = {}
                node[nodeId] = eval('(' + JSON.stringify(instance_model.nodes[nodeId]) + ')');
                connection.io_recommend_insModel_node(node);
            }
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
        $("#" + id).trigger("click");
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

        if (faEditClicked) isRevise = true;
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

        for (let i in roles) {
            let tag = roles[i].rolename;
            let id = roles[i].node_id;
            $('span[value=' + tag + ']').parent().children(".node").children("input").eq(0).val(instance_model.nodes[id].value);
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

    $(document).on("change keyup", "#class-revise .stigmod-input.type-input", function () {

        let type = $(this).val();
        let array = getEntityTypes();
        if (array.indexOf(type) == -1) {
            //console.log($(this).parent().children("ul").css("display")+"      "+$(this).is(":focus"))
            if (($(this).parent().children("ul").css("display") == 'none'||$(this).parent().children("ul").css("display") == undefined) && $(this).is(":focus")) {
            //if (($(this).parent().children("ul").css("display") == 'none') && $(this).is(":focus")) {
                let content = '<p>是否新建实体类型?</p>';
                content += '<div href="#" style="text-align: center" class="addEntityInModel">' +
                    '<span class="button-ok" type="ok"><button class="btn btn-default btn-sm" type="button" >是</button></span>' +
                    '<span>&nbsp;</span>' +
                    '<span class="button-cancel" type="cancel"><button class="btn btn-default btn-sm" type="button" >否</button></span>' +
                    '<span>&nbsp;</span>' +
                    '</div>';
                $(this).popover({
                    "animation": true,
                    "title": "未找到输入实体类型",
                    "trigger": "manual",
                    "placement": "bottom",
                    "container": 'body',
                    "html": true,
                    "content": content
                })
                $(this).popover("show");
            }
        } else {
            $(this).popover("hide")
        }
    });

    $(document).on("click",".addEntityInModel .button-ok",function(){

        $("#modalAddEntityInModel input.type").val($("#class-revise .stigmod-input.type-input").val());
        $("#modalAddEntityInModel input.attr").val("");
        $("#modalAddEntityInModel").modal("show");
        return;
    })

    $(document).on("click","#modalAddEntityInModel .btn-primary",function(){
        let type = $("#modalAddEntityInModel input.type").val();
        let attr = $("#modalAddEntityInModel input.attr").val();

        let array = getEntityTypes();
        if (array.indexOf(type) != -1) {
            alert("实体类型名称已经存在!");
            return;
        }
        if(type.replace(/\s/g,"")==""){
            alert("实体类型名称不能为空!");
            return;
        }
        if(attr.replace(/\s/g,"")==""){
            alert("主属性不能为空!");
            return;
        }
        let valueId;
        for(let key in model.nodes){
            if(model.nodes[key].tag == "Symbol"){
                valueId = key;
                break;
            }
        }
        //if(valueId==undefined) valueId=0;
        let entity = {
            "nodeId": generateFrontNodeID(),
            "relationId": generateFrontRelationID(),
            "valueId": valueId,
            "tag": "Entity",
            "value": type,
            "keyAttr": attr
        };
        connection.io_create_model_entity(entity)
    });

    //属性处理
    $(document).on("change keyup", "#attribute-revise .stigmod-input.type-input", function () {

        let type = $(this).val();
        let centerId = $("g.center").attr("id");

        let array = getAttributeTypes(centerId);
        if (array.indexOf(type) == -1) {
            if (($(this).parent().children("ul").css("display") == 'none' || array.length == 0)&& $(this).is(":focus")) {
                let content = '<p>是否新建属性类型?</p>';
                content += '<div href="#" style="text-align: center" class="addAttrInModel">' +
                    '<span class="button-ok" type="ok"><button class="btn btn-default btn-sm" type="button" >是</button></span>' +
                    '<span>&nbsp;</span>' +
                    '<span class="button-cancel" type="cancel"><button class="btn btn-default btn-sm" type="button" >否</button></span>' +
                    '<span>&nbsp;</span>' +
                    '</div>';
                $(this).popover({
                    "animation": true,
                    "title": "未找到输入属性类型",
                    "trigger": "manual",
                    "placement": "bottom",
                    "container": 'body',
                    "html": true,
                    "content": content
                })
                $(this).popover("show");
            }
        } else {
            $(this).popover("hide")
        }
    });

    $(document).on("click",".addAttrInModel .button-ok",function(){
        $("#modalAddAttrInModel input.attr").val($("#attribute-revise .stigmod-input.type-input").val());
        $("#modalAddAttrInModel input.type").val("String");
        $("#modalAddAttrInModel input.type").attr("disabled","disabled");
        $("#modalAddAttrInModel").modal("show");
        return;
    })

    $(document).on("click","#modalAddAttrInModel .btn-primary",function(){
        let attr = $("#modalAddAttrInModel input.attr").val();
        let type = $("#modalAddAttrInModel input.type").val();

        let centerId = $("g.center").attr("id");
        let array = getAttributeTypes(centerId);
        if (array.indexOf(attr) != -1) {
            alert("属性类型已经存在!");
            return;
        }
        if(type.replace(/\s/g,"")==""){
            alert("属性对象类型不能为空!");
            return;
        }

        let classId,attributeId;
        let entityType = instance_model.nodes[centerId].tags[0];
        for(let key in model.nodes){
            if(model.nodes[key].value == entityType){
                classId = key;
                break;
            }
        }
        for(let key in model.nodes){
            if(model.nodes[key].tag == "Symbol"){
                attributeId = key;
                break;
            }
        }
        let relationId = generateFrontRelationID();
        let relations = {};
        relations[relationId] = {
            "type":attr,
            "roles": [
                {"rolename": "", "node_id": classId},
                {"rolename": attr, "node_id": attributeId}
            ],
        }
        connection.io_create_model_relation(relations);
    });

    //关系修改时触发时间
    $(document).on("change keyup", "#relation-revise .stigmod-input.type-input", function () {
        //读取类型
        let type = $(this).val();
        //处理不匹配情况
        let centerId = $("g.center").attr("id");
        let array = getRelationTypes(centerId);
        if (array.indexOf(type) == -1) {
            $("#roles").parent().hide();
            //$("#relation-revise .button-ok").parent().hide();
            $(".properties-revise").find("#relation-revise").find(".button-ok").children().attr("disabled", true);
            if (($(this).parent().children("ul").css("display") == 'none'|| array.length == 0) && $(this).is(":focus")) {
                let content = '<p>是否新建关系类型?</p>';//type+'"</p>';
                content += '<div href="#" style="text-align: center" class="addRelInModel">' +
                    '<span class="button-ok" type="ok"><button class="btn btn-default btn-sm" type="button" >是</button></span>' +
                    '<span>&nbsp;</span>' +
                    '<span class="button-cancel" type="cancel"><button class="btn btn-default btn-sm" type="button" >否</button></span>' +
                    '<span>&nbsp;</span>' +
                    '</div>';
                $(this).popover({
                    "animation": true,
                    "title": "未找到输入关系类型",
                    "trigger": "manual",
                    "placement": "bottom",
                    "container": 'body',
                    "html": true,
                    "content": content
                })
                $(this).popover("show");
            }
            return;
        } else {
            $(this).popover("hide")
        }

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
        let subHtml, item;
        //let centerId = $("g.center").attr("id");
        let entities = getRelationValues(centerId)
        if (relationId != undefined && roles != undefined) {
            $("#roles").children().remove();
            for (let i in roles) {
                subHtml = detail.generateRole(roles[i].rolename, "", model.nodes[roles[i].node_id].value, relationId);
                $("#roles").append(subHtml);

                item = $("#roles").children().last();
                setRelationRoleValueTypeahead(item, entities, centerId);
            }
            //对《新冠政策知识图谱》进行特殊处理，保证"当前政策"在前
            if (project.substring(0,8) == "新冠政策知识图谱") {
                if ($("#roles").children().eq(1).children("span").eq(0).attr("value") == "当前政策") {
                    $("#roles").children().eq(1).prependTo("#roles");
                }
            }
        }
        //默认填充当前节点
        let centerTag = instance_model.nodes[centerId].tags[0];
        let subItem = $('span[value=' + centerTag + ']').parent().children(".node").children("input").eq(0).val(instance_model.nodes[centerId].value);

        $("#roles").parent().show();
        //$("#relation-revise .button-ok").parent().show();
        $(".properties-revise").find("#relation-revise").find(".button-ok").children().attr("disabled", false);
        return;
    })



    $(document).on("click",".addRelInModel .button-ok",function(){
        $("#modalAddRelInModel").modal("show");

        //中间区域修改
        html = detail.generateTitle("关系", "relation-add");
        let item = $("#modalAddRelInModel .modal-body")
        $(item).children().remove();
        $(item).append(html);

        html = '<a href="#" class="list-group-item stigmod-hovershow-trig">' +
            '<div class="row">' +
            '<div class="col-xs-12"><input type="text" class="stigmod-input type-input typeahead" stigmod-inputcheck="relation-modify" value="" placeholder="关系" style="text-align:center;"></div>' +
            '</div></a>';
        $(item).find("#relation-add").append(html);



        //显示关系
        html = '<div class="panel panel-default list-group-item showPopover" style="margin: 0px">' +
            '<div class="panel-heading" style="padding-top:5px;padding-bottom: 5px">' +
            '<div class="stigmod-rcmd-title row">' +
            '<span class="col-xs-4">' + "角色" + '</span>' +
            '<span class="col-xs-8">' + "承担者" + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="list-group roles">' +
            '</div>' +
            '</div>';
        $(item).find("#relation-add").append(html);

        $(item).find("#relation-add .type-input").val($("#relation-revise .stigmod-input.type-input").val());

        //提交按钮
        let content = '<div style="text-align: center;padding: 0px;margin: 0px;" class="addRelRolesInModel">' +
            '<span class="button-ok" type="ok"><button class="btn btn-default btn-sm" type="button" >+</button></span>' +
            '</div>';
        $(item).find("#relation-add").append(detail.generatePlusLogo("relRole"));

        //自动填充
        let centerId = $("g.center").attr("id");
        $(item).find("#relation-add .roles").append(generateNewRole("",instance_model.nodes[centerId].value,instance_model.nodes[centerId].tags[0],"",false));
        setRawRelationRoleValueTypeahead($("#relation-add .roles").children().last());
        $(item).find("#relation-add .roles").append(generateNewRole("","","","",false));
        setRawRelationRoleValueTypeahead($("#relation-add .roles").children().last());

        //显示描述
        html = '<div class="panel panel-default list-group-item showPopover" style="margin: 0px">' +
            '<div class="panel-heading" style="padding-top:5px;padding-bottom: 5px">' +
            '<div class="stigmod-rcmd-title row">' +
            '<span class="col-xs-12">' + "描述" + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="list-group description">' +
            '<div class="list-group-item stigmod-hovershow-trig row ">' +
            '<span class="col-xs-12 input-group" style="padding: 0px">' +
                '<span class="input-group-addon"><input type="checkbox"></span>' +
                '<input type="text" class="stigmod-input typeahead desc-input" placeholder="请用一句话描述当前关系，包含关系中的各承担者"></input>' +
                '<span class="vcenter desc-text" style="display: none;border: 1px solid #ccc;background-color:#eee;width: 100%"></span>' +
            '</span>' +
            '</div>'+
            '</div>'+
            '</div>';
        $(item).find("#relation-add").append(html);
        //提示
        html = '<div class="alert"></div>';
        $(item).append(html);
    })

    $(document).on("click",".addRelInModel .button-cancel",function(){
        $("#relation-add .stigmod-input.type-input").popover("hide")
    })

    $(document).on("click","#modalAlert .modal-footer .refresh",function(){
        window.location.reload()
    })
})

/*
 * 右侧区域的绘制
 * */
function drawNodeDetails(id) {
    let isEntity = svg.drawEntity(id, instance_model);
    if (isEntity) {
        $("body .graph-row .index .active").removeClass("active");
        let item = $(".list-group-item.stigmod-hovershow-trig.entity .nodeId[value=" + id + "]");
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


function drawRecommendDetail() {
    //如果是属性
    //如果是节点
}

function getJsonLength(json) {
    let length = 0;
    for (let key in json) length++;
    return length;
}

function filterAttributes(neighbours,tmpModel=instance_model) {

    let attributes = []
    for (let id in neighbours) {
        if (!data.isEntity(id,tmpModel)) {
            //此时属于attribute
            for (let relation of neighbours[id].relations) {
                attributes.push({
                    relationId: relation.id,
                    nodeId: id,
                    type: relation.value,
                    value: tmpModel.nodes[id].value
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

function generateFrontNodeID(val, type = "e") {
    let n = getJsonLength(instance_model.nodes);
    if (val) n = val;
    let nodeId = "front_n" + type + n;

    while (instance_model.nodes[nodeId] != undefined) {
        n++;
        nodeId = "front_n" + type + n;
    }

    return nodeId;
}

var OperationCounter = 0;
function generateFrontOperationID() {

    OperationCounter = (OperationCounter + 1) % 100;
    //let id = localStorage.mongoMachineId + new Date().valueOf() + OperationCounter;
    let id = hash(user) + new Date().valueOf() + OperationCounter;
    return id;
}

var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

function hash(input) {
    var hash = 5381;
    var i = input.length - 1;

    if (typeof input == 'string') {
        for (; i > -1; i--)
            hash += (hash << 5) + input.charCodeAt(i);
    }
    else {
        for (; i > -1; i--)
            hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF;

    var retValue = '';
    do {
        retValue += I64BIT_TABLE[value & 0x3F];
    }
    while (value >>= 6);

    return retValue;
}

function generateFrontRelationID(shift = 0) {
    //好像并不能完全解决问题
    let n = getJsonLength(instance_model.relations) + shift;
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

    if (N == 0) return 2 * Math.PI * i / RN;

    let gap = Math.floor(i / pRN) + 1;
    let angle;
    if (gap != N) {
        angle = 2 * Math.PI * (i + gap) / (N * (pRN + 1));
    }
    if (gap == N) { //最后一块进行平分
        let resti = i - (gap - 1) * pRN + 1;
        let restpRN = RN - Math.floor(RN / N) * N;
        angle = 2 * Math.PI * (gap - 1) / N + 2 * Math.PI * (resti) / (N * (restpRN + 1));
    }
    angle = 2 * Math.PI * (i + gap) / (N * (pRN + 1));  //test不错处理

    //console.log(i+" "+gap+" "+N+" "+ pRN +" "+angle);

    return angle;
}

function getRank(id, entity) {
    let i = 0;
    for (let key in entity.neighbours) {
        if (key == id) break;
        i++;
    }
    return i;
}


function refreshText(entity) {
    $(".textPath").remove();
    let paths = getPathTexts(width / 2, height / 2, R, r, 0, entity.neighbours);
    //console.log(paths);
    for (let path of paths) {
        drawPathText(path);
    }
}

let svgOperation = {
    clickNode: function (nodeId, model = instance_model) {
        detail.drawIndex();
        svg.drawEntity(nodeId);
        $("#" + nodeId).click();
    }
}

let tagReformat = {
    value2id: function (msg) {
        //console.log("******value2id")
        //console.log("beforTrans"+msg)
        if (msg.nodes) {
            //alert("nodes")
            for (let nodeId in msg.nodes) {
                if (msg.nodes[nodeId].tags == undefined) msg.nodes[nodeId].tags = ["String"];
                let tmp = msg.nodes[nodeId].tags;
                for (let n in tmp) {
                    //if(tmp[n]) alert(getValueId(tmp[n],model.nodes))
                    tmp[n] = getValueId(tmp[n], model.nodes);
                }
            }
        }
        if (msg.relations) {
            //alert(relations)
            for (let relationId in msg.relations) {
                //TODO 此处有问题，在判断relation时（如，一个entity和它属性的关系)不应该只看relation的名字
                let tmp = msg.relations[relationId].type; //前后不统一
                msg.relations[relationId].type = getValueId(tmp, model.relations);
            }
        }
        //console.log("afterTrans"+msg);
        //console.log("value2id******")
    },
    id2value: function (msg) {
        if (msg.nodes) {
            for (let nodeId in msg.nodes) {

                let tmp = msg.nodes[nodeId].tags;
                //临时处理recommend没有tags的问题 - 开始
                if (tmp == undefined) {
                    if (msg.nodes[nodeId]["value"] == "") {
                        msg.nodes[nodeId].tags = ["人"]
                    } else {
                        msg.nodes[nodeId].tags = ["String"]
                    }
                    continue;
                }
                ////临时处理recommend没有tags的问题 - 结束
                for (let n in tmp) {
                    tmp[n] = model.nodes[tmp[n]].value
                }
            }
        }
        if (msg.relations) {
            for (let relationId in msg.relations) {
                //alert(msg.relations[relationId].type)//创建操作，因为数据都是前台的所以都是给的type
                //alert(msg.relations[relationId].tag)//get操作，因为数据是前台的所以是tag
                let tmp = msg.relations[relationId].tag;    //前台获得情况
                if (tmp == undefined) tmp = msg.relations[relationId].type;   //获取本地的情况

                if(model.relations[tmp]==undefined){
                    alert("存在未知的数据错误，请刷新后重试.","refresh");
                    return;
                }
                msg.relations[relationId].type = model.relations[tmp].value;

                //临时处理recommend没有tags的问题 - 开始
                let roles = msg.relations[relationId].roles;

                if (roles[0]["node_id"] == undefined) {
                    msg.relations[relationId].roles = [
                        {rolename: "", node_id: roles[0]},
                        {rolename: "", node_id: roles[1]}
                    ]
                }
                ////临时处理recommend没有tags的问题 - 结束
            }
        }
    }
}

getValueId = function (value, item) {
    for (let key in item) {
        if (item[key]["value"] == value) return key;
    }
    return value;//可能会出问题
}

function prepareNewEntity(model = instance_model, refreshSvg = true, getRcmd = false, showIndex = false) {

    let hasCenterNode = false, centerNode;
    let deleteArray = [];


    for (let rId in model["relations"]) {
        let r = model["relations"][rId];
        if (keyValueArray.indexOf(r.type) == -1) continue;//不是主属性

        let nId0, nId1, tags0, tags1;
        nId0 = r.roles[0].node_id;
        nId1 = r.roles[1].node_id;

        //如果是推荐，好像就会出现id不存在的情况

        if (model["nodes"][nId0] != undefined) {
            tags0 = model["nodes"][nId0]["tags"];
        } else {
            console.log("alert");
            console.log("not found nId0:" + nId0);
            console.log("model:" + model);
            continue;
        }
        if (model["nodes"][nId1] != undefined) {
            tags1 = model["nodes"][nId1]["tags"];
        } else {
            console.log("alert");
            console.log("not found nId1:" + nId1);
            console.log("model:" + model);
            continue;
        }

        let entityId, valueId;
        if (tags0 != undefined) {
            if (symbolArray.indexOf(tags0[0]) == -1) {   //说明是Entity节点
                entityId = nId0;
                valueId = nId1;
            } else {
                entityId = nId1;
                valueId = nId0;
            }
        } else {
            if (symbolArray.indexOf(tags1[0]) == -1) {   //说明是Entity节点
                entityId = nId1;
                valueId = nId0;
            } else {
                entityId = nId0;
                valueId = nId1;
            }
        }

        model["nodes"][entityId]["value"] = model["nodes"][valueId]["value"];
        model["nodes"][entityId]["dataType"] = r.type;

        data.removeNodeInRecommendIndex(model["nodes"][entityId]["tags"][0], model["nodes"][entityId]["value"]);

        //delete model["nodes"][valueId];
        //delete model["relations"][rId];
        deleteArray.push({valueId,rId})//因为一个值节点可能出现在多个关系中

        if (!hasCenterNode) {//第一个Entity节点作为center节点
            hasCenterNode = true;
            centerNode = entityId;
        }
    }
    for(let i in deleteArray){
        delete model["nodes"][deleteArray[i].valueId];
        delete model["relations"][deleteArray[i].rId];
    }
    if (hasCenterNode && refreshSvg) {
        network.setData();
        detail.drawIndex(instance_model, showIndex);
        svg.drawEntity(centerNode);
        if (!$(".btn-group.workspace .btn-default").hasClass("off")) {
            $("#" + centerNode).delay("10").click();
        } else {
            drawNodeDetails(centerNode);
        }
        //$("#" + centerNode).delay("500").trigger("dblclick");
        if (getRcmd) {
            isGetRcmd = false;
            $("#" + centerNode).delay("500").trigger("dblclick");
        }
        return true;
    }
    return false;
}

function getRelations(id1, id2, model = instance_model) {
    let relation, roles, relationArray = [];
    for (relation in model["relations"]) {
        roles = model["relations"][relation]["roles"];
        if (roles[0].node_id == id1) {
            if (roles[1].node_id == id2) relationArray.push(relation);
        }
        else if (roles[1].node_id == id1) {
            if (roles[0].node_id == id2) relationArray.push(relation);
        }
    }

    return relationArray;
}

function alert(text,type="alert") {
    $("#modalAlert .modal-body h5").text(text);
    if(type=="refresh"){
        $("#modalAlert .modal-footer .dismiss").hide();
        $("#modalAlert .modal-footer .refresh").show();
    }else{
        $("#modalAlert .modal-footer .dismiss").show();
        $("#modalAlert .modal-footer .refresh").hide();
    }
    $("#modalAlert").modal("show");
}


copyObj = function (obj1, obj2) {

    for (let key in obj2) {
        obj1[key] = obj2[key];
    }
    return;
}

showLocal = function () {
    let isGlobal = $(".btn-group.workspace .btn-default").hasClass("off");
    if (isGlobal) {
        $(".btn-group.workspace").children().trigger("click");
    }
}

showGlobal = function () {
    let isGlobal = $(".btn-group.workspace .btn-default").hasClass("off");
    if (!isGlobal) {
        $(".btn-group.workspace").children().trigger("click");
    }
}

reviseMergeFilter = function (newId,tmpModel=instance_model) {
    let entity = svg.getEntity(newId, instance_model);
    let obj = revise_pending.add;
    let roles,relationId;
    //revise all ids
    let oldId = obj.entities[0].nodeId;
    obj.entities[0].nodeId = newId;
    for(let i in obj.relations){
        for(relationId in obj.relations[i]){
            roles = obj.relations[i][relationId].roles
        }
        for(let j in roles){
            if(roles[j].node_id == oldId) {
                roles[j].node_id = newId;
            }
        }
        console.log(entity);
        if(relationCompare(entity.relations,obj.relations[i][relationId])){
            console.log("xxx"+i);
            obj.relations.splice(i,1);
        }
    }
    return;
}

relationCompare = function (relations,relation){
    console.log(relations);
    console.log(relation);
    let cpObj = {};
    let flag = false;
    for(let id in relations){
        if(relations[id].type == relation.type){
            if(relationTypeArray.indexOf(relation.type)!=-1){
                flag = true;
                //关系
                for(let i in relation.roles){
                    cpObj[relation.roles[i].node_id] = relation.roles[i].rolename;
                }
                for(let i in relations[id].roles){
                    let role = relations[id].roles[i];
                    if(cpObj[role.node_id] != role.rolename) flag = false;
                }
            }else{
                flag = true;
            }
        }
    }

    return flag;
}

function generateNewRole(role, node, tag, relationId,needTrash=true){
    let html = '<div class="list-group-item stigmod-hovershow-trig row ">' +
        '<span class="col-xs-4 role vcenter" style="padding: 0px"><input type="text" class="stigmod-input" placeholder="角色名" value=' + role + '></input></span>' +
        '<span class="col-xs-7 node vcenter" style="padding: 0px"><input type="text" class="stigmod-input typeahead" placeholder="承担者" value=' + node + '></input></span>';
    if(needTrash) html+= '<span class="col-xs-1 glyphicon glyphicon-trash vcenter"</span>'
    html+= '<span class="tag" style="display: none" value=' + tag + '>' +
        '<span class="relation" style="display: none" value=' + relationId + '>' +
        '</div>';
    return html;
}

function ellipsisDisplay(node, line, space, str,basicem=0.5)
{
    var regex = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    if(regex.test(str))
    {
        let tempstr=str;
        node.on('click',function(){
            window.open(tempstr);
        })
    }
    let len=str.length;
    let nowline=1;
    let actualine=Math.ceil(len/space);
    if(actualine>line) actualine=line;
    basicem=basicem-(actualine-1)/2.0;
    for(let i=1;i<actualine;i++)
    {
        node.append("text")
            .text(str.substring(0,space))
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", (basicem+i-1)+"em");
        str=str.substring(space);
    }
    if(str.length>space)
    {
        node.append("text")
            .text("...")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", (basicem+actualine-1)+"em");
        node.classed("ellipsis","true");
    }
    else
    {
        node.append("text")
            .text(str)
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", (basicem+actualine-1)+"em");
    }


}


// function svgRepaint()
// {
//     svg.valuelist.fresh = false;
//     svg.valuelist.init();
//     $(".filter-checkbox.entity:checkbox").each(function(){
//         if($(this).prop("checked")){
//             svg.valuelist.entity.add($(this).attr("value"));
//             svg.mutelist.entity.delete($(this).attr("value"));
//         }
//         else
//         {
//             svg.mutelist.entity.add($(this).attr("value"));
//         }
//     });
//     $(".filter-checkbox.relation:checkbox").each(function(){
//         if($(this).prop("checked")){
//             svg.valuelist.relation.add($(this).attr("value"));
//             svg.mutelist.relation.delete($(this).attr("value"));
//         }
//         else
//         {
//             svg.mutelist.relation.add($(this).attr("value"));
//         }
//     });
//     let id= svg.centerNode.id;
//     if($(".btn.recommend").hasClass("active"))
//     {
//         svg.drawRecommendation(id);
//     }else{
//         svg.drawEntity(id);
//     }
//     svg.valuelist.fresh=true;
// }
//
// function hierarchyFilter(checkbox){
//     var checked = checkbox.prop("checked"),
//         container = checkbox.parent().parent(),
//         siblings = container.siblings();
//     container.find('input[type="checkbox"]').prop({
//         indeterminate: false,
//         checked: checked
//     });
//     function checkSiblings(el) {
//         var parent = el.parent().parent(),
//             all = true;
//         el.siblings().each(function() {
//             let returnValue = all = (checkbox.children().children('input[type="checkbox"]').prop("checked") === checked);
//             return returnValue;
//         });
//         if (all && checked) {
//             parent.children().children('input[type="checkbox"]').prop({
//                 indeterminate: false,
//                 checked: checked
//             });
//             checkSiblings(parent);
//         } else if (all && !checked) {
//             parent.children().children('input[type="checkbox"]').prop("checked", checked);
//             parent.children().children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));
//             checkSiblings(parent);
//         } else {
//             el.parents("li").children().children('input[type="checkbox"]').prop({
//                 indeterminate: true,
//                 checked: false
//             });
//         }
//     }
//     checkSiblings(container);
// }