/**
 * Created by ChiangEarl on 18/7/5.
 */


function svgObj(svg=""){

    this.width = 870;
    this.height = 550;
    this.r = 30;
    this.R = 4 * this.r; //5 * r;
    this.R2 = 2 * this.R ;
    /*
    this.width = 1000,
    this.height = 800;
    this.r = 30;
    this.R = 5 * r;
    this.R2 = 2 * R;
    */
    this.zoomR = 0.75
    this.zoomW = 1.25;
    this.zoomH = 1.75;

    if(svg == ""){
        this.svg = d3.select("body .graph-row .middle-content svg")
    }else{
        this.svg = svg
    }

    //this.initSVG();

    this.index = $("body .graph-row .index");
    this.properties = $("body .graph-row .properties");
    this.propertiesRevise = $("body .graph-row .properties-revise");

}

svgObj.prototype.initSVG = function(){
/* 不知道为什么无效
    let tmp = this.svg;
    tmp.style("width",this.width)
    tmp.style("height",this.height)

    tmp = tmp.select(function(){return this.parentNode});
    tmp.style("width",this.width)
    tmp.style("height",this.height)

    tmp = tmp.select(function(){return this.parentNode.parentNode.parentNode});
    tmp.style("width",this.width)
*/
    let tmp = $("#modalWorkspace svg");
    $(tmp).width(this.width);
    $(tmp).height(this.height);

    tmp = $(tmp).parent();
    $(tmp).width(this.width);
    $(tmp).height(this.height);

    tmp = $(tmp).parent().parent();
    $(tmp).width(this.width+30);

}

svgObj.prototype.drawEntity = function(id, model = instance_model) {
    let entity = this.getEntity(id, model);
    if (entity == undefined) return false;  //如果不是实体的话

    this.centerNode = {
        id: id,
        x: this.width/2,
        y: this.height/2
    }

    this.svg.selectAll("*").remove()
    this.drawCircle(this.width / 2, this.height / 2, this.R);
    this.drawCircle(this.width / 2, this.height / 2, this.R2);

    this.drawNode(this.width / 2, this.height / 2, this.r, entity.centerNode, "entity", true, true);
    this.drawRelations(this.width / 2, this.height / 2, this.r, this.R, entity.relations);
    this.svgBringAllToFront();
    return true;
}

svgObj.prototype.drawRelations = function(centX, centY, r, R, relations, startAngle = 0){
    let N = getJsonLength(relations);
    let i = 0;
    for (let key in relations) {
        this.drawRelation(centX,centY,r,R,relations[key],startAngle,i,N)
        i++;
    }
/*
    let nodes = this.getNodes(centX, centY, R, startAngle, relations);
    for (let node of nodes) {
        this.drawNode(node.cx, node.cy, r, node.data, "relation");
    }
*/
}

svgObj.prototype.drawRelation = function(centX, centY, r, R, relation, startAngle, iR, N){
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
            nData = instance_model.nodes[relation.roles[i].node_id];
            nData.id = relation.roles[i].node_id+"-"+relation.id;
            nData.type = "entity";

            node = this.getNode(rX, rY, R, nAngle, nData);//明明应该是对象，为什么return的是数组
            node.type = "entity";
            nodes.push(node);
        }
    }

    for(let i in paths){
        this.drawPath(paths[i],rX, rY);
    }

    for(let i in nodes){
        this.drawNode(nodes[i].cx, nodes[i].cy, r, nodes[i].data, nodes[i].type);
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
    if (node[id].dataType) {//当为实体时
        fillColor = "#eee"
        data["dataType"] = node[id].dataType;
    }

    if(isColorful){//采用network中的配色
        if (node[id].dataType) {
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
        this.svg.select("[id='" + data.id+"']")
            .append("text")
            .text(data.value)
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.4em");
    }
    //核心节点
    if (isCenter) {
        this.svg.select("[id='" + data.id+"']")
            .classed("center", true);
        this.svg.select("[id='" + data.id+"']")
            .select("circle")
            .attr("fill", "#F8F8F8")
            .attr("stroke", "#00008B");
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

svgObj.prototype.getEntity = function(id, model = instance_model) {
    //判断是否是实体
    if (!data.isEntity(id)) return;
    //包括自己和邻接信息
    let entity = {
        centerNode: {},
        neighbours: {},
        relations: {}
    }
    //处理自己的事件
    entity.centerNode[id] = {
        "id":id,
        "value": model.nodes[id].value,
        "tags": model.nodes[id].tags,
        "dataType": model.nodes[id].dataType
    }
    //处理邻接信息
    for (let relationId in model.relations) {
        for (let roleIndex in model.relations[relationId].roles) {
            if (id == model.relations[relationId].roles[roleIndex].node_id) {
                entity.relations[relationId] = model.relations[relationId]
                entity.relations[relationId].id = relationId;
                break;
            }
        }
    }
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

svgObj.prototype.drawPath = function(path,centX=width/2, centY=height/2,textAnchor="middle",startOffset="50%") {
    this.svg
        .append("path")
        .style("fill", "none")

        .attr("id", path.data.id+"-"+path.data.label)
        .attr("d", function (d) {
            if (path.cx1 == undefined) {
                return "M" + path.sx + "," + path.sy + "L" + path.ex + "," + path.ey;
            } else {
                let str;
                if (path.sx < path.ex) {
                    str = "M" + path.sx + "," + path.sy +
                        "C" + path.ox1 + "," + path.oy1 + "," + path.nx1 + "," + path.ny1 + "," + path.cx1 + "," + path.cy1 +
                        "L" + path.cx2 + "," + path.cy2 +
                        "C" + path.nx2 + "," + path.ny2 + "," + path.ox2 + "," + path.oy2 + "," + path.ex + "," + path.ey;
                } else {
                    str = "M" + path.ex + "," + path.ey +
                        "Q" + path.nx2 + "," + path.ny2 + "," + path.cx2 + "," + path.cy2 +
                        "L" + path.cx1 + "," + path.cy1 +
                        "Q" + path.nx1 + "," + path.ny1 + "," + path.sx + "," + path.sy;
                }
                return str;
            }
        });

    let originPosition = ""+centX+"px "+centY+"px";
    let rotateAngle = (path.rotate/(2*Math.PI)*360)%360;
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