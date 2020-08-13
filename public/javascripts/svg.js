/**
 * Created by ChiangEarl on 18/7/5.
 */


function svgObj(svg=""){

    if(svg == ""){
        this.svg = d3.select("body .graph-row .middle-content svg")
    }else{
        this.supersvg = svg
        this.svg=this.supersvg.append("g")
        this.svg.attr("class","element-group");
    }

    this.setSize();
    this.openZoom();
    this.rcmd = {
        isRcmd: false,      //true时表示要处理rcmd
        drawRcmd: false,    //true时表示当前绘制的是rcmd
        tmpLen: 0,          //当前图谱中，节点连接关系的个数
        rcmdLen: 0,         //推荐中，节点连接关系的个数
        wholeLen: 0,        //=tmpLen+rcmdLen
        jumpLen: 0,         //需要跳过的推荐节点个数
        showLen: 10,        //最大推荐个数
        fresh: true,
    }
    this.valuelist = {//表示当前要显示的元素的列表
        fresh: true, //true时表示要刷新过滤列表
        entity: new Set(),
        relation: new Set(),
        init: function(){
            this.entity= new Set();
            this.relation = new Set();
        }
    }
    this.mutelist = { //过滤列表，保持筛选器记忆
        //entity: new Set(),
        relation: new Set()
    }
    // let muterelations=['政策成文日期','政策对象','政策落款','政策有关事项','政策内容'];
    // for(let r of muterelations)
    // {
    //     if(project=='新冠政策知识图谱')
    //     {
    //         this.mutelist.relation.add(r);
    //     }
    // }
    this.mape2r={};
}

svgObj.prototype.initSVG = function(){//好像从来没用过
    let tmp = $("#modalWorkspace svg");
    $(tmp).width(this.width);
    $(tmp).height(this.height);

    tmp = $(tmp).parent();
    $(tmp).width(this.width);
    $(tmp).height(this.height);

    tmp = $(tmp).parent().parent();
    $(tmp).width(this.width+30);

}

svgObj.prototype.setSize = function () {

    let tmp = this.svg._groups[0];

    //this.width = 870;
    //this.height = 550;

    this.width = $(tmp).parent().width();//减去上檐
    this.height = $(tmp).parent().height()-70;

    this.ratio = 1;
    if(this.height<this.width){
        this.ratio =  1>this.height/600?1:this.height/600;
    }

    //this.r =  30;
    this.r = this.ratio * 30;
    this.R = 4 * this.r; //5 * r;
    this.R2 = 2 * this.R ;

    this.zoomR = 0.75;
    this.zoomW = 1.25;
    this.zoomH = 1.75;
}

function record(id)
{
    let index = historylist.indexOf(id);
    if(index!=-1) historylist.splice(index,1);
    historylist.push(id);
    if(historylist.length>10) historylist.shift();

}


svgObj.prototype.drawEntity = function(id, tmpModel = instance_model) {

    if(this.valuelist.fresh)
    {
        this.valuelist.init();
        record(id);
    }

    this.mape2r = undefined;

    let entity = this.getEntity(id, tmpModel);
    if (entity == undefined) return false;  //如果不是实体的话

    this.centerNode = {
        id: id,
        x: this.width/2,
        y: this.height/2
    }

    if(this.valuelist.fresh)
    {
        this.freshFilter();
        $(".btn.filter-apply").trigger("click");
        return true;
    }


    this.svg.selectAll("*").remove()
    //this.openZoom();
    this.drawCircle(this.width / 2, this.height / 2, this.R);
    this.drawCircle(this.width / 2, this.height / 2, this.R2);

    this.drawNode(this.width / 2, this.height / 2, this.r, entity.centerNode, "entity", true, true);
    this.drawRelations(this.width / 2, this.height / 2, this.r, this.R, entity.relations, 0, tmpModel);
    this.svgBringAllToFront();

    return true;
}

svgObj.prototype.drawRecommendation = function(id, rcmdModel = recommend_model, tmpModel = instance_model) {

    //console.log('drawrcmd');
    if(this.valuelist.fresh)
    {
        this.valuelist.init();
        this.mape2r = {};
        record(id);
    }
    if(this.rcmd.fresh) this.rcmd.jumpLen=0;


    let entity1 = this.getEntity(id, rcmdModel);
    if (entity1 == undefined) return false;  //如果不是实体的话

    let entity2 = this.getEntity(id, tmpModel);
    if (entity2 == undefined) return false;  //如果不是实体的话

    this.centerNode = {
        id: id,
        x: this.width/2,
        y: this.height/2
    }
    //console.log('drawRecommendation'+this.valuelist.fresh+this.rcmd.fresh)
    if(this.valuelist.fresh&&(this.rcmd.fresh!==false))
    {
        //console.log('drawRecommendation'+this.valuelist.fresh+this.rcmd.fresh)
        connection.io_report_recommend(JSON.parse(JSON.stringify(entity1.relations)));
        this.freshFilter();
        $(".btn.filter-apply").trigger("click");
        return true;
    }

    if(checkRcmd){
        checkRcmd = false;
        if(getJsonLength(entity1.relations)==0){
            alert("当前图谱信息较少，无推荐信息。");
        }
    }

    let rcmdLen = getJsonLength(entity1.relations);
    if(rcmdLen > this.rcmd.showLen)
    {
        let begin=this.rcmd.jumpLen%rcmdLen;
        let end=(this.rcmd.jumpLen+this.rcmd.showLen-1)%rcmdLen;
        let pointer=0;
        for(let key in entity1.relations)
        {
            //console.log(begin+"   "+end+"  "+pointer);
            if(begin<end)
            {
                if(pointer<begin||pointer>end) delete entity1.relations[key];
            }
            else
            {
                if(pointer>end&&pointer<begin) delete entity1.relations[key];
            }
            pointer++;
        }
        rcmdLen=getJsonLength(entity1.relations);
    }

    let tmpLen = getJsonLength(entity2.relations);
    let jumpLen=this.rcmd.jumpLen,showLen=this.rcmd.showLen,fresh=this.rcmd.fresh;
    this.rcmd = {
        isRcmd: true,
        drawRcmd: false,
        tmpLen: tmpLen,
        rcmdLen: rcmdLen,
        wholeLen: tmpLen+rcmdLen,
        jumpLen: jumpLen,
        showLen: showLen,
        fresh: fresh
    }


    this.svg.selectAll("*").remove()
    //this.openZoom();
    this.drawMask(this.width / 2, this.height / 2);

    this.drawCircle(this.width / 2, this.height / 2, this.R);
    this.drawCircle(this.width / 2, this.height / 2, this.R2);

    this.drawNode(this.width / 2, this.height / 2, this.r, entity1.centerNode, "entity", true, false);
    this.drawRelations(this.width / 2, this.height / 2, this.r, this.R, entity2.relations, 0, tmpModel);

    this.rcmd.drawRcmd = true;
    this.drawRelations(this.width / 2, this.height / 2, this.r, this.R, entity1.relations, 0, rcmdModel);

    this.svgBringAllToFront();

    this.rcmdDestroy();

    $('g.entity.isRecommendation').contextmenu({
        target:'#reject-entity',
        before: function(e,context) {
            e.preventDefault();
            $('popover').hide();
            // execute code before context menu if shown
        },
        onItem: function(context,e) {
            let id=context.attr('id')
            id= id.split("-")["0"];
            connection.io_reject_rcmdModel_entity(id)
            // execute on menu item selection
        }
    })

    return true;
}

svgObj.prototype.openZoom = function(){
    let zoom= d3.zoom()
        .scaleExtent([0.3, 3])
        .on('zoom', () => {
            this.svg.attr('transform', d3.event.transform);
        })
    this.supersvg.call(zoom).on("dblclick.zoom", null);;
    console.log("zoomed");
}

svgObj.prototype.freshFilter = function(){
    console.log('freshFilter');
    let foldButton="<span class=\"filter-fold glyphicon glyphicon-chevron-down\"></span>"
    let hideButton="<span class=\"filter-fold glyphicon glyphicon-chevron-right\"></span>"
    let temp=$(".filter-panel");
    temp.empty();
    //let list=$("<ul></ul>");
    let typeList=$("<ul></ul>");
    let relationList=$("<ul></ul>");
    let types=$("<li ></li>");
    let relations=$("<li ></li>");
    let typesarea=$("<div class=\"col-xs-6\" ></div>");
    let relationsarea=$("<div class=\"col-xs-6\" ></div>");
    //list.addClass("list-unstyled");
    temp.append(typesarea).append(relationsarea);
    typesarea.append(types); relationsarea.append(relations);

    types.append(foldButton+"<label class='container-check' for='entities'><input id='entities' type='checkbox' class='filter-checkbox' checked><span class='checkmark'></span>\n" +
        "      实体</label>").append(typeList);
    relations.append(foldButton+"<label class='container-check' for='relations'><input id='relations' type='checkbox' class='filter-checkbox' checked><span class='checkmark'></span>\n" +
        "      关系</label>").append(relationList);
    for(let value of this.valuelist.entity)
    {
        //console.log(value);
        let ventity=value.split('\t')[0];
        let vtype=value.split('\t')[1];
        let entities,entityList;
        entities=typeList.children("[value='"+vtype+"']");
        if(entities.length>0) {
            entityList=entities.children("ul");
        }else {
            entities=$("<li></li>");
            entityList=$("<ul style=\"display:none\"></ul>");
            entities.append(hideButton+"<label class='container-check' for='type"+vtype+"'><input id='type"+vtype+"' type='checkbox' class='filter-checkbox' checked><span class='checkmark'></span>\n" +
                vtype+"</label>").append(entityList);
            entities.attr("value",vtype);
            typeList.append(entities);
        }
        entityList.append("<li>\n" +
            "                <label class='container-check' for='entity"+ventity+"'>"+
            "                <input id='entity"+ventity+"'class=\"filter-checkbox entity\" type=\"checkbox\" value=\""+value+"\" checked>\n" +
            "                <span class='checkmark'></span>\n" +
                ventity+"</label>            </li>");
        //if(this.mutelist.entity.has(value)) $('.filter-checkbox.entity#entity'+ventity).trigger('click');

    }
    for(let value of this.valuelist.relation)
    {
        relationList.append("<li>\n" +
            "                <label class='container-check' for='relation"+value+"'>"+
            "                <input id='relation"+value+"'class=\"filter-checkbox relation\" type=\"checkbox\" value=\""+value+"\" checked>\n" +
            "                <span class='checkmark'></span>\n" +
            value+"</label>            </li>");
        if(this.mutelist.relation.has(value)) $('.filter-checkbox.relation#relation'+value).trigger('click');
    }
    $('.filter-checkbox.entity:first').trigger('click');
    $('.filter-checkbox.entity:first').trigger('click');
    $('.filter-checkbox.relation:first').trigger('click');
    $('.filter-checkbox.relation:first').trigger('click');
    //temp.append(list);
}

svgObj.prototype.drawRelations = function(centX, centY, r, R, relations, startAngle = 0, tmpModel = instance_model){
    let N=0, i=0;
    if(this.rcmd.isRcmd == false){
        N = getJsonLength(relations);
    }else{
        N = this.rcmd.wholeLen;
    }

    if(this.rcmd.drawRcmd == true){
        i = this.rcmd.wholeLen - this.rcmd.rcmdLen;
    }

    for (let key in relations) {
        this.drawRelation(centX,centY,r,R,relations[key],startAngle,i,N,tmpModel)
        i++;
    }
}

svgObj.prototype.drawRelation = function(centX, centY, r, R, relation, startAngle, iR, N, tmpModel = instance_model){
    //暂时没有处理一个实体承担多个角色的问题
    let rAngle = 2 * Math.PI * iR / N + startAngle;
    let rX = centX + R * Math.cos(rAngle);
    let rY = centY + R * Math.sin(rAngle);

    let path,paths=[];
    let node,nodes=[];
    let nAngle;
    let length = relation.roles.length-1;
    let shift = 0;
    for(let i in relation.roles){
        let pData = {
            "id":relation.id,
            "label":i,
            "name":relation.roles[i].rolename
        }
        let nData = {};
        //path
        if(relation.roles[i].node_id == this.centerNode.id){
            path = this.getPath(rX, rY, R, r, rAngle+Math.PI, pData);
            paths.push(...path);
            shift++;
        }else{
            nAngle = this.getAngle(i-shift,length,N,rAngle)
            path = this.getPath(rX, rY, R, r, nAngle, pData);
            paths.push(...path);
        }
        //node
        if(relation.roles[i].node_id == this.centerNode.id){
            //if(relation.roles.length < 3) continue;
            nData = {
                id: relation.id,
                dataType: relation.type,
                tags: [relation.tag],
                value: relation.type,
                type:"relation"
            }
            node = this.getNode(rX, rY, 0, 0, nData);
            node.type = "relation";
            nodes.push(node);
        }else{
            nData = tmpModel.nodes[relation.roles[i].node_id];
            nData.id = relation.roles[i].node_id+"-"+relation.id;
            nData.type = "entity";

            node = this.getNode(rX, rY, R, nAngle, nData);//明明应该是对象，为什么return的是数组
            if(data.isEntity(nData.id.split("-")[0],tmpModel)){
                node.type = "entity";
            }else{
                node.type = "symbol";
            }
            nodes.push(node);
        }
    }

    for(let i in paths){
        this.drawPath(paths[i],rX, rY);
    }

    let isRecommendation = false;
    if(this.rcmd.drawRcmd == true){
        isRecommendation = true;
    }

    for(let i in nodes){
        this.drawNode(nodes[i].cx, nodes[i].cy, r, nodes[i].data, nodes[i].type,false,false,isRecommendation);
    }

    return true;
}


//基础图元绘制
svgObj.prototype.drawCircle = function(centX, centY, R) {
    this.svg
        .append("circle")
        .classed("auxiliary", true)
        .attr("cx", centX)
        .attr("cy", centY)
        .attr("r", R)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "5, 5") //虚线宽度
        .attr("stroke-width", 1);
}

svgObj.prototype.drawNode = function(centX, centY, r, node, type, isCenter = false, isCentralized = false, isRecommendation = false) {
    let id,data;
    for (let tmpid in node) {
        id = tmpid;
        data = {
            "id": id,
            "value": node[id].value,
        }
    }
    let fillColor = "white";
    if (node[id].tags) data["tags"] = node[id].tags;
    //if (node[id].dataType) {//当为实体时
    if (type != "symbol") {//当为实体时
        fillColor = "#eee"
        data["dataType"] = node[id].dataType;
    }

    if(isColorful){//采用network中的配色
        //if (node[id].dataType) {
        if (type != "symbol") {
            if(network.network.groups.groups[data["tags"][0]] != undefined){
                fillColor = network.network.groups.groups[data["tags"][0]].color.background
            }else{
                //fillColor = network.network.groups.groups["__relation"].color.background
                fillColor = "#D2E5FF"
            }
        }
    }



    //添加图元
    this.svg
        .append("g")
        //.classed("entity", true)
        .classed(type, true)
        .attr("transform", "translate(" + centX + "," + centY + ")")
        .attr("id", data.id)
        .attr("tags", function (d) {
            let tags = "";
            if (data.tags) tags = data.tags[0];
            return tags
        })
        .attr("dataType", function (d) {
            let dataType = "";
            if (data.dataType) dataType = data.dataType;
            return dataType
        })
        .attr("datatext",data.value);
        //.append("circle")
        //.attr("r", r)
    //绘制图元
    if(type == "relation"){
        this.svg.select("[id='"+data.id+"']")
            .append("rect")
            .attr("x", -r/2)
            .attr("y", -r/2)
            .attr("width", r)
            .attr("height", r)
            .attr("fill", fillColor)
            .attr("stroke-dasharray", "1,0") //虚线宽度
            .attr("transform", "rotate(45)")
    }else{
        this.svg.select("[id='"+data.id+"']")
            .append("circle")
            .attr("r", r)
            .attr("fill", fillColor)
            .attr("stroke", "gray")
            .attr("stroke-dasharray", "1,0") //虚线宽度
            .attr("stroke-width", 1)
    }
    //添加文本
    if(type=="relation" && data.value.length>2) {
    //if(data.value.length>2){
        this.svg.select("[id='" + data.id+"']")
            .append("text")
            .text(data.value[0]+data.value[1])
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", "0em");
        this.svg.select("[id='" + data.id+"']")
            .append("text")
            .text("...")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", "1em");

    }else{
        // this.svg.select("[id='" + data.id+"']")
        //     .append("text")
        //     .text(data.value)
        //     .attr("font-size", "12px")
        //     .attr("text-anchor", "middle")
        //     .attr("dy", "0.4em");
        ellipsisDisplay(this.svg.select("[id='" + data.id+"']"),5,4,data.value);
    }
    //核心节点
    if (isCenter) {
        this.svg.select("[id='" + data.id+"']")
            .classed("center", true);
        /*
        this.svg.select("[id='" + data.id+"']")
            .select("circle")
            .attr("fill", "#F8F8F8")
            .attr("stroke", "#00008B");
        */
    }
    //以Entity方式显示时作为中心，用于判断是否可以进行推荐（区别于Relation下isCenter存在多个）
    if (isCentralized) {
        this.svg.select("[id='" + data.id+"']")
            .classed("isCentralized", true);
    }
    //节点处于推荐状态
    if (isRecommendation) {
        this.svg.select("[id='" + data.id+"']")
            .classed("isRecommendation",true);
    }
}

svgObj.prototype.drawEntityNode = function(centX, centY, r, node, isCenter = false, isCentralized = false, isRecommendation = false){
    this.drawNode(centX, centY, r, node, "entity", isCenter = false, isCentralized = false, isRecommendation = false);
}
svgObj.prototype.drawRelationNode = function(centX, centY, r, node, isCenter = false, isCentralized = false, isRecommendation = false){
    this.drawNode(centX, centY, r, node, "relation", isCenter = false, isCentralized = false, isRecommendation = false);
}

//复合操作
svgObj.prototype.getRelation = function(id, model = instance_model) {
    //包括自己和邻接信息
    let relation = {
        centerNode: {},
        neighbours: {}
    }
    //处理自己的事件
    relation.centerNode[id] = {
        "value": model.relations[id].type
    }

    //处理邻接信息
    let roles = model.relations[id].roles;
    for(let i=0;i<roles.length;i++){
        if(relation.neighbours[roles[i].node_id]==undefined){
            relation.neighbours[roles[i].node_id] = model.nodes[roles[i].node_id];
            relation.neighbours[roles[i].node_id].id = roles[i].node_id;
            relation.neighbours[roles[i].node_id].relations = []
        }
        let data = {
            "id": id,
            "value": model.relations[id].type,
            "roleIndex": i,
            "name": roles[i].rolename,
            "label": i
        }
        relation.neighbours[roles[i].node_id].relations.push(data);
    }
    return relation;
}

//
svgObj.prototype.getNode = function(centX, centY, R, angle, data) {

    cx = centX + R * Math.cos(angle);
    cy = centY + R * Math.sin(angle);

    let node = {
        cx,
        cy,
        data:{}
    }
    node.data[data.id] = data;
    return node;
}


svgObj.prototype.getNodes = function(centX, centY, R, startAngle, neighbours) {
    let N = getJsonLength(neighbours);
    let nodes = [];
    let i = 0, cx, cy, angle;

    for (let key in neighbours) {
        let data = {};
        data[key] = neighbours[key]
        if ($("#" + key)[0]) {
            i++;
            continue;
        }      //如果已经存在就不画
        angle = 2 * Math.PI * i / N + startAngle;
        cx = centX + R * Math.cos(angle);
        cy = centY + R * Math.sin(angle);
        nodes.push({cx, cy, "data": data});
        i++;
    }
    return nodes;
}

svgObj.prototype.getEntity = function(id, tmpModel = instance_model) {
    //判断是否是实体
    if (!data.isEntity(id,tmpModel)) return;
    //包括自己和邻接信息
    let entity = {
        centerNode: {},
        neighbours: {},
        relations: {}
    }
    //处理自己的事件
    entity.centerNode[id] = {
        "id":id,
        "value": tmpModel.nodes[id].value,
        "tags": tmpModel.nodes[id].tags,
        "dataType": tmpModel.nodes[id].dataType
    }
    //处理邻接信息
    for (let relationId in tmpModel.relations) {
        for (let roleIndex in tmpModel.relations[relationId].roles) {
            //console.log(tmpModel.relations[relationId]);
            if (id == tmpModel.relations[relationId].roles[roleIndex].node_id) {
                //Edited by Cui on 2019/10/22 对显示列表的相关处理
                let toShowE = false,toShowR = false;
                if(this.valuelist.fresh) {
                    this.valuelist.relation.add(tmpModel.relations[relationId].type);
                }
                else if(this.valuelist.relation.has(tmpModel.relations[relationId].type)){
                    toShowR = true;
                }
                for (let roleIndex1 in tmpModel.relations[relationId].roles) {
                    if(roleIndex1 == roleIndex) continue; //对除去中心节点本身的节点进行处理
                    let tmpRole = tmpModel.relations[relationId].roles[roleIndex1];
                    if(data.isEntity(tmpRole.node_id,tmpModel)){
                        if(this.valuelist.fresh) {
                            this.valuelist.entity.add(tmpModel.nodes[tmpRole.node_id].value+"\t"+tmpModel.nodes[tmpRole.node_id].tags[0]);
                            //这里选用实体的第一个tag作为它的类型
                            if(tmpModel==recommend_model&&this.mape2r!=undefined)
                            {
                                let nodevalue = tmpModel.nodes[tmpRole.node_id].value+"\t"+tmpModel.nodes[tmpRole.node_id].tags[0];
                                if(this.mape2r[nodevalue]==undefined) this.mape2r[nodevalue]=[];
                                this.mape2r[nodevalue].push(relationId);
                            }
                        }
                        else{
                            if(this.valuelist.entity.has(tmpModel.nodes[tmpRole.node_id].value+"\t"+tmpModel.nodes[tmpRole.node_id].tags[0])){
                                toShowE = true;
                            }
                        }
                    }
                    else toShowE=true; //TODO 在这里显示的应该是属性，属性可以做单独处理

                }
                if(this.valuelist.fresh||(toShowE&&toShowR)){
                    entity.relations[relationId] = tmpModel.relations[relationId]
                    entity.relations[relationId].id = relationId;
                }
                break;
            }
        }
    }
    //console.log(this.valuelist.showValue);
    return entity;
}

svgObj.prototype.getPaths = function(centX, centY, R, r, startAngle, relations) {
    let N = getJsonLength(relations);
    let paths = [];
    let i = 0;
    for (let key in relations) {
        relations[key].id = key;
        angle = 2 * Math.PI * i / N + startAngle;
        let path = this.getPath(centX, centY, R, r, angle, relations[key]);
        paths.push(...path);
        i++;
    }
    return paths;
}


svgObj.prototype.getPath = function(centX, centY, R, r, angle, data) {

    let rotate = angle;
    angle = 0; //2018.2.26更新，angle变为rotate处理

    let verAnglue = angle + Math.PI / 2; //angle的垂直方向
    let path = [];
/*
    if ($("#" + node.id)[0]) {    //isRelation则变大
        r = 3 * r;
        R = zoomW * 2 * R / zoomR;
    }
*/
    //sx/y起始点、ex/y终止点
    sx = centX;
    sy = centY;
    ex = centX + R * Math.cos(angle);
    ey = centY + R * Math.sin(angle);

    //mx/y1文本起始点，mx/y2文本起终止
    mx1 = sx + 1.3 * r * Math.cos(angle);
    mx2 = ex - 1.3 * r * Math.cos(angle);
    my1 = sy + 1.3 * r * Math.sin(angle);
    my2 = ey - 1.3 * r * Math.sin(angle);

    //对于组边的处理
    //let n = node.relations.length;
    let n = 1;
    let m = n - n % 2;
    let shiftX = 0, shiftY = 0;

    if (m != 0) { //计算平移空间
        shiftX = r * Math.cos(verAnglue) / m;
        shiftY = r * Math.sin(verAnglue) / m;
    }

    if(m == n) m = m-1;

    for (let i = 0; i < n; i++) {
        /*
        if ($("#" + node.relations[i].id)[0]) { //如果已存在就不画了
            //i++;
            continue;
        }
        */
        //算是偏移后 cx/y1文本起始点，cx/y2文本起终止
        cx1 = mx1 + shiftX * (i - m / 2);
        cx2 = mx2 + shiftX * (i - m / 2);
        cy1 = my1 + shiftY * (i - m / 2);
        cy2 = my2 + shiftY * (i - m / 2);

        //nx/y1,ox/y1起始点三次贝塞尔曲线
        nx1 = cx1 - 0.4 * r * Math.cos(angle);
        ny1 = cy1 - 0.4 * r * Math.sin(angle);
        ox1 = sx + 0.4 * r * Math.cos(angle);
        oy1 = sy + 0.4 * r * Math.sin(angle);
        //nx/y2,ox/y2起始点三次贝塞尔曲线
        nx2 = cx2 + 0.4 * r * Math.cos(angle);
        ny2 = cy2 + 0.4 * r * Math.sin(angle);
        ox2 = ex - 0.4 * r * Math.cos(angle);
        oy2 = ey - 0.4 * r * Math.sin(angle);

        //id,label,namec
        //let data = node.relations[i];
        /*
         if(instance_model.relations[data.id] != undefined){
         let roles = instance_model.relations[data.id].roles;
         if(roles[0].rolename!= "" && roles[1].rolename!= ""){
         if(roles[1].node_id == node.id){
         data.value = roles[0].rolename + "-" + roles[1].rolename;
         }else{
         data.value = roles[1].rolename + "-" + roles[0].rolename;
         }
         }
         }
         */
        //if ((i - m / 2) == -1 && m == n) m = m - 2; //避免双数情况下的中心边
        path.push({
            sx,
            sy,
            ex,
            ey,
            cx1,
            cy1,
            cx2,
            cy2,
            nx1,
            ny1,
            nx2,
            ny2,
            ox1,
            oy1,
            ox2,
            oy2,
            data,
            rotate
        });
    }
    return path;
}
svgObj.prototype.calPath = function(path,rot){
    if ((path.ex - path.sx) * Math.cos(rot * Math.PI / 180) < 0) {
        return "M" + path.ex + "," + path.ey + "L" + path.sx + "," + path.sy;
    } else {
        return "M" + path.sx + "," + path.sy + "L" + path.ex + "," + path.ey;
    }
}
svgObj.prototype.drawPath = function(path,centX=this.width/2, centY=this.height/2,textAnchor="middle",startOffset="50%") {
    let rotateAngle = (path.rotate/(2*Math.PI)*360)%360;
    this.svg
        .append("path")
        .style("fill", "none")

        .attr("id", path.data.id+"-"+path.data.label)
        .attr("d", this.calPath(path,rotateAngle))
        // .attr("d", function (d) {
        //     if (path.cx1 == undefined) {
        //         return "M" + path.sx + "," + path.sy + "L" + path.ex + "," + path.ey;
        //     } else {
        //         let str;
        //         if (path.sx < path.ex) {
        //             str = "M" + path.sx + "," + path.sy +
        //                 "C" + path.ox1 + "," + path.oy1 + "," + path.nx1 + "," + path.ny1 + "," + path.cx1 + "," + path.cy1 +
        //                 "L" + path.cx2 + "," + path.cy2 +
        //                 "C" + path.nx2 + "," + path.ny2 + "," + path.ox2 + "," + path.oy2 + "," + path.ex + "," + path.ey;
        //         } else {
        //             str = "M" + path.ex + "," + path.ey +
        //                 "Q" + path.nx2 + "," + path.ny2 + "," + path.cx2 + "," + path.cy2 +
        //                 "L" + path.cx1 + "," + path.cy1 +
        //                 "Q" + path.nx1 + "," + path.ny1 + "," + path.sx + "," + path.sy;
        //         }
        //         return str;
        //     }
        // });
    let originPosition = ""+centX+"px "+centY+"px";
    $("#"+path.data.id+"-"+path.data.label).css({transformOrigin: originPosition}).css({rotate: rotateAngle});

    this.drawPathText(path,textAnchor,startOffset);
}

svgObj.prototype.drawPathText = function(path,textAnchor="middle",startOffset="50%") {
    this.svg
        .append("text")
        .attr("text-anchor", textAnchor)
        .attr("dy", "-5")
        .append("textPath")
        .attr("href", "#" + path.data.id)
        .attr("href", "#" + path.data.id+"-"+path.data.label)
        .attr("startOffset", startOffset)
        .style('font-size', '10px')
        .classed("textPath", true)
        .text(path.data.name);
}
//
svgObj.prototype.svgBringAllToFront = function() {
    let that = this;
    this.svg.selectAll("g").each(function(d,i){
        that.svgBringToFront($(this));
    })
}

svgObj.prototype.svgBringToFront = function(item) {
    var parent = $(item).parent();
    $(item).remove();
    $(parent).append(item);
}

svgObj.prototype.getAngle = function(index,nLength,rLength,startAngle){
    let per = (nLength+rLength)*0.75;
    if(per<4) per=4;

    let m = (nLength - 1)/2;
    return startAngle + Math.PI/per*(index - m);
}

svgObj.prototype.transAnimation = function(centerID,neighbourID,relationId,model) {
    //未使用
    return;
    //获取新增节点信息
    let entity = data.getEntity(centerID, model);
    if (entity == undefined) return false;  //如果不是实体的话

    let neighbours = getJsonLength(entity.neighbours);
    let relations = getJsonLength(entity.neighbours[neighbourID].relations);
    //如果是两个节点间形成多个关系，则直接重绘
    if(relations>1) {
        $("#" + centerID).click();
        return;
    }

    //画出新增节点
    let tmpNode = {};
    tmpNode[neighbourID] = entity.neighbours[neighbourID];
    drawNeighbours(width / 2, height / 2, r, R, entity.neighbours,2 * Math.PI * getRank(neighbourID,entity)/neighbours);//不知道为什么要+1

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
            $(tmpItem).transition({rotate: rotateAngle}).end(refreshText(entity));
            //$(tmpItem).next()
            //d3.select("#"+tmpRelationID).transition().style("rotate",rotateAngle).on( "start", function() {
            d3.select("[id='" + tmpRelationID+"']").transition().style("rotate",rotateAngle).on( "start", function() {
                mutex++;
            }).on( "end", function() {
                if( --mutex === 0 ) {
                    refreshText(entity);   //更新pathText
                }
            });
        }

    }
    //将圆圈更新到前面
    this.svgBringToFront($("#"+centerID));
    //更新详细栏目信息
    if (entity) {
        //处理后面
        $(".properties-revise .button-left").click();
        $(properties).children().remove();
        detail.drawPropertyTitle();
        detail.drawTypes(centerID);
        detail.drawAttributes(centerID);
        detail.drawRelations(centerID);
    }
    return true;
}

svgObj.prototype.rcmdDestroy = function(){
    this.rcmd = {
        isRcmd: false,      //true时表示要处理rcmd
        drawRcmd: false,    //true时表示当前绘制的是rcmd
        tmpLen: 0,          //当前图谱中，节点连接关系的个数
        rcmdLen: 0,         //推荐中，节点连接关系的个数
        wholeLen: 0,        //=tmpLen+rcmdLen
        jumpLen: this.rcmd.jumpLen,
        showLen: this.rcmd.showLen,
        fresh: this.rcmd.fresh
    }
}

svgObj.prototype.drawMask = function(centX=this.width/2, centY=this.height/2){


    let that = this;
    let startAngle,stopAngle;

    if(this.rcmd.tmpLen == 0){
        this.rcmd.tmpLen = 0.0001;
    }

    if(this.rcmd.wholeLen == 0) {
        startAngle = 0;
        stopAngle = 2 * Math.PI;
    }else{
        startAngle = 2 * Math.PI * (this.rcmd.tmpLen - 0.5) / this.rcmd.wholeLen;
        stopAngle = 2 * Math.PI * (this.rcmd.wholeLen - 0.5) / this.rcmd.wholeLen;
    }


    let startX = centX + this.R2 * Math.cos(startAngle);
    let startY = centY + this.R2 * Math.sin(startAngle);

    let stopX = centX + this.R2 * Math.cos(stopAngle);
    let stopY = centY + this.R2 * Math.sin(stopAngle);

    let rotation = 0;
    let isDrawLarge = 0;
    let isClockWise = 1;

    if((stopAngle-startAngle)>Math.PI){
        isDrawLarge = 1;
    }


    this.svg
        //.append("mask")
        //.attr("id", "123")
        .append("path")
        .classed("rcmdMask", true)
        .style("fill", "#333")
        .style("opacity",0.2)
        .attr("d", function (d) {
            let str = "M" + startX + "," + startY +
                "A" + that.R2 + " " + that.R2 + "," + rotation + "," + isDrawLarge + "," + isClockWise + "," + stopX +  " " + stopY +
                "L" + centX + "," + centY +
                "Z";
            return str;
        });

}
