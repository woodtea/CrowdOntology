/*
 * 中心区域的绘制
 */

const width = 870, height = 550;//, height = 600;
const r = 30;
const R = 5 * r;
const zoomR = 0.75
const zoomW = 1.25;
const zoomH = 1.75;
/* atomic functions */
/*
 const svg = d3
 .select("body .graph-row .middle-content")
 .append("svg")
 .classed("graph", true)
 .attr("width", width)
 .attr("height", height);
 */
const svg = d3.select("#modalWorkspace svg")
const properties = $("body .graph-row .properties");
const propertiesRevise = $("body .graph-row .properties-revise");
const index = $("body .graph-row .index");

//const draw = new draw2(d3.select("#modalWorkspace svg"));
const draw = new draw2(d3.select("body .graph-row .middle-content svg"));

/*
 基础元素绘制
 */
function drawTitle(str) {
    //svg.append("title")
    //    .text(str);
    $("body .graph-row .title").html("<h4>" + str + "</h4>");
}


function drawCircle(centX, centY, R) {
    svg
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

function drawModal(centX, centY, R) {
    svg
        .append("circle")
        .classed("auxiliary", true)
        .attr("cx", centX)
        .attr("cy", centY)
        .attr("r", R)
        .attr("fill", "#000")
        .attr("fill-opacity", "0.3");

}

function drawNode(centX, centY, r, centerNode, isCenter = false, isCentralized = false, isRecommendation = false) {
    let id, data;
    for (let tmpid in centerNode) {
        id = tmpid;
        data = {
            "id": id,
            "value": centerNode[id].value,
        }
    }
    let fillColor = "white";
    if (centerNode[id].tags) data["tags"] = centerNode[id].tags;
    if (centerNode[id].dataType) {//是实体
        fillColor = "#eee"
        data["dataType"] = centerNode[id].dataType;
    }

    svg
        .append("g")
        .classed("entity", true)
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
        .append("circle")
        .attr("r", r)
        .attr("fill", fillColor)
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "1,0") //虚线宽度
        .attr("stroke-width", 1)
    //svg.select("#" + data.id)
    svg.select("[id='" + data.id + "']")
        .append("text")
        .text(data.value)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.4em");

    if (isCenter) {
        //svg.select("#" + data.id)
        svg.select("[id='" + data.id + "']")
            .classed("center", true);
        //svg.select("#" + data.id)
        svg.select("[id='" + data.id + "']")
            .select("circle")
            .attr("fill", "#F8F8F8")
            .attr("stroke", "#00008B");
    }
    if (isCentralized) {
        //svg.select("#" + data.id)
        svg.select("[id='" + data.id + "']")
            .classed("isCentralized", true);
    }
    if (isRecommendation) {
        //svg.select("#" + data.id)
        svg.select("[id='" + data.id + "']")
            .classed("isRecommendation", true);
    }

}


function drawPath(path, centX = width / 2, centY = height / 2, textAnchor = "middle", startOffset = "50%") {
    svg
        .append("path")
        .style("stroke", "grey")
        .style("stroke-width", "1px")
        .style("fill", "none")
        //.attr("id", path.data.id)
        .attr("id", path.data.id + "-" + path.data.label)
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

    let originPosition = "" + centX + "px " + centY + "px";
    let rotateAngle = (path.rotate / (2 * Math.PI) * 360) % 360;
    $("#" + path.data.id + "-" + path.data.label).css({transformOrigin: originPosition}).css({rotate: rotateAngle});

    drawPathText(path, textAnchor, startOffset);
}

function drawPathText(path, textAnchor = "middle", startOffset = "50%") {
    svg
        .append("text")
        .attr("text-anchor", textAnchor)
        .attr("dy", "-5")
        .append("textPath")
        .attr("href", "#" + path.data.id)
        .attr("href", "#" + path.data.id + "-" + path.data.label)
        .attr("startOffset", startOffset)
        .style('font-size', '10px')
        .classed("textPath", true)
        .text(path.data.name);
}

//

/* index */
function drawIndex(model = instance_model, showIndex = true) {

    if (showIndex) {
        rightColumnShow(index);
    }

    $(index).children().remove();
    drawRightTitle(index, "索引", false, true);

    let html = "";
    let entities = {};
    for (let id in model.nodes) {
        if (data.isEntity(id)) {
            if (entities[model.nodes[id].tags[0]] == undefined) entities[model.nodes[id].tags[0]] = [];
            entities[model.nodes[id].tags[0]].push({value: model.nodes[id].value, id: id});
        }
    }

    html = "<div class='index-content' style='height: 490px;overflow: auto'></div>";
    $(index).append(html);
    let indexContent = $(index).children(".index-content");

    for (let tag in entities) {

        html = generateCollapseTitle(tag, "type");
        $(indexContent).append(html);

        html = "";
        for (let n in entities[tag]) {
            html += generateCollapseContent(tag, entities[tag][n].value, entities[tag][n].id);
        }
        $(indexContent).children().last().find(".list-group").append(html)

    }


    $(index).append(generateEntityPlusButton());
    let array = getIndexArray(instance_model);
    setIndexTypeahead(array);
}

/* compound functions */
function drawEntity(id, model = instance_model) {

    //draw.drawEntity(id,model);
    draw.centerNode = {
        id: id
    }

    let entity = data.getEntity(id, model);
    console.log(entity);
    if (entity == undefined) return false;  //如果不是实体的话

    //$(graph).children().remove();
    svg.selectAll("*").remove()
    drawCircle(width / 2, height / 2, R);
    drawNeighbours(width / 2, height / 2, r, R, entity.neighbours);
    drawNode(width / 2, height / 2, r, entity.centerNode, true, true);
    return true;
}

function drawRelation(id1, id2, model = instance_model) {
    //$(graph).children().remove();
    svg.selectAll("*").remove()
    let entity1 = data.getEntity(id1, model);
    let entity2 = data.getEntity(id2, model);
    //节点
    drawCircle(width / 2 - zoomW * R, height / 2, R * zoomR);
    drawNode(width / 2 - zoomW * R, height / 2, r * zoomR, entity1.centerNode);
    drawCircle(width / 2 + zoomW * R, height / 2, R * zoomR);
    drawNode(width / 2 + zoomW * R, height / 2, r * zoomR, entity2.centerNode);
    //节点间连线绘制
    let relations = {};
    relations[id2] = entity1.neighbours[id2];
    drawNeighbours(width / 2 - zoomW * R, height * 1 / 2, r * zoomR, R * zoomR, relations, 0);
    //共有节点绘制 //属性节点不属于共有节点
    drawCommons(id1, id2);
    //独有节点绘制
    drawUnique(id1, id2);
    //将两端节点放到前排
    svg.svgBringToFront($("#" + id1));
    svg.svgBringToFront($("#" + id2));
}


function drawRecommendation(rcmdNeighbours, model = instance_model) {
    let id = $("g.center.isCentralized").attr("id");
    if (!data.isEntity(id)) return false;
    let entity = data.getEntity(id, model);

    //一个问题是当前rcmdNeighbours包含自身的，所以覆盖了entity.neighbours
    for (let key in entity.neighbours) {
        delete rcmdNeighbours[key];
    }

    drawModal(width / 2, height / 2, R + 2 * r);
    drawCircle(width / 2, height / 2, 5 / 3 * R);
    drawRecommendNeighbours(width / 2, height / 2, r, 5 / 3 * R, entity.neighbours, rcmdNeighbours);
    $("g.center.isCentralized").remove();
    drawNode(width / 2, height / 2, r, entity.centerNode, true);
    return true;
}


function drawNeighbours(centX, centY, r, R, neighbours, startAngle = 0) {
    //let startAngle = 0; //应该是不确定的
    let paths = getPaths(centX, centY, R, r, startAngle, neighbours);
    for (let path of paths) {
        drawPath(path, centX, centY);
    }
    let nodes = getNodes(centX, centY, R, startAngle, neighbours);
    for (let node of nodes) {
        drawNode(node.cx, node.cy, r, node.data);
    }
}

function drawRecommendNeighbours(centX, centY, r, R, neighbours, rcmdNeighbours, startAngle = 0) {   //drawNeighbours的变种

    let paths = getRecommendPaths(centX, centY, R, r, startAngle, neighbours, rcmdNeighbours);
    for (let path of paths) {
        drawPath(path);//
    }
    let nodes = getRecommendNodes(centX, centY, R, startAngle, neighbours, rcmdNeighbours);
    for (let node of nodes) {
        drawNode(node.cx, node.cy, r, node.data, false, false, true);
    }
}


function getNodes(centX, centY, R, startAngle, neighbours) {
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


function getRecommendNodes(centX, centY, R, startAngle, neighbours, rcmdNeighbours) {
    let N = getJsonLength(neighbours);
    let RN = getJsonLength(rcmdNeighbours);
    let pRN = Math.ceil(RN / N);

    let nodes = [];
    let i = 0, cx, cy, angle;

    for (let key in rcmdNeighbours) {
        let data = {};
        data[key] = rcmdNeighbours[key]
        if ($("#" + key)[0]) {
            i++;
            continue;
        }      //如果已经存在就不画
        //angle = 2 * Math.PI * i / N + startAngle;
        angle = getAngle(N, RN, pRN, i) + startAngle;

        cx = centX + R * Math.cos(angle);
        cy = centY + R * Math.sin(angle);
        nodes.push({cx, cy, "data": data});
        //console.log(angle+" "+nodes);
        i++;
    }
    return nodes;
}

function getPaths(centX, centY, R, r, startAngle, neighbours) {
    let N = getJsonLength(neighbours);
    let paths = [];
    let i = 0;
    for (let key in neighbours) {
        neighbours[key].id = key;
        angle = 2 * Math.PI * i / N + startAngle;
        let path = getPath(centX, centY, R, r, angle, neighbours[key]);
        //console.log(path);
        paths.push(...path);
        i++;
    }
    //console.log(i);
    return paths;
}

function getPathTexts(centX, centY, R, r, startAngle, neighbours) {
    let N = getJsonLength(neighbours);//不知道为什么要+1
    let paths = [];
    let i = 0;
    for (let key in neighbours) {
        neighbours[key].id = key;
        angle = 2 * Math.PI * i / N + startAngle;
        let path = getPathText(centX, centY, R, r, angle, neighbours[key]);
        paths.push(...path);
        i++;
    }
    //console.log(i);
    return paths;
}

function getRecommendPaths(centX, centY, R, r, startAngle, neighbours, recommend) {
    let N = getJsonLength(neighbours);  //邻居数
    let RN = getJsonLength(recommend);  //推荐数
    let pRN = Math.ceil(RN / N);          //每片的推荐数
    if (N == 0) pRN = RN;
    //alert(N)
    //alert(RN)
    //alert(pRN)

    let paths = [];
    let i = 0;
    for (let key in recommend) {
        recommend[key].id = key;
        //angle = 2 * Math.PI * i / N + startAngle;
        angle = getAngle(N, RN, pRN, i) + startAngle;
        let path = getPath(centX, centY, R, r, angle, recommend[key]);
        paths.push(...path);
        i++;
    }
    //alert(paths.length);
    return paths;
}

function getPath(centX, centY, R, r, angle, node) {

    let rotate = angle;
    angle = 0; //2018.2.26更新，angle变为rotate处理

    let verAnglue = angle + Math.PI / 2; //angle的垂直方向
    let path = [];

    if ($("#" + node.id)[0]) {    //isRelation则变大
        r = 3 * r;
        R = zoomW * 2 * R / zoomR;
    }

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
    let n = node.relations.length;
    let m = n - n % 2;
    let shiftX = 0, shiftY = 0;

    if (m != 0) { //计算平移空间
        shiftX = r * Math.cos(verAnglue) / m;
        shiftY = r * Math.sin(verAnglue) / m;
    }

    if (m == n) m = m - 1;

    for (let i = 0; i < n; i++) {
        if ($("#" + node.relations[i].id)[0]) { //如果已存在就不画了
            //i++;
            continue;
        }

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

        let data = node.relations[i];
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
            data: node.relations[i]
            , rotate
        });
    }
    //console.log(path);
    return path;
}


function getPathText(centX, centY, R, r, angle, node) {
    let rotate = angle;
    angle = 0; //2018.2.26更新，angle变为rotate处理

    let verAnglue = angle + Math.PI / 2; //angle的垂直方向
    let path = [];

    if ($("#" + node.id)[0]) {    //isRelation则变大
        r = 3 * r;
        R = 3 * R + R / 12;
    }

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
    let n = node.relations.length;
    let m = n - n % 2;
    let shiftX = 0, shiftY = 0;
    if (m != 0) {
        shiftX = r * Math.cos(verAnglue) / m;
        shiftY = r * Math.sin(verAnglue) / m;
    }

    for (let i = 0; i < n; i++) {

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

        let data = node.relations[i];
        if (instance_model.relations[node.relations[i].id] != undefined) {
            let roles = instance_model.relations[node.relations[i].id].roles;
            if (roles[0].rolename != "" && roles[1].rolename != "") {
                if (roles[1].node_id == node.id) {
                    data.value = roles[0].rolename + " - " + roles[1].rolename;
                } else {
                    data.value = roles[1].rolename + " - " + roles[0].rolename;
                }
            }
        }

        if ((i - m / 2) == -1 && m == n) m = m - 2;
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
            data: node.relations[i]
            , rotate
        });
    }
    //console.log(path);
    return path;
}


function refillNode(data) {
    //svg.select("#" + data.id + " circle")
    svg.select("[id='" + data.id + "']" + " circle")
        .attr("fill", "#eee")
        .attr("stroke", "gray")
        .attr("stroke-width", 1);
    //svg.select("#" + data.id + " text")
    svg.select("[id='" + data.id + "']" + " text")

        .text(data.value)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.4em");
}


function drawCommons(id1, id2) {

    let entity1 = data.getEntity(id1);
    let entity2 = data.getEntity(id2);

    let commonIds = [];
    for (let key in entity1.neighbours) {
        if (entity2.neighbours[key] != undefined) {
            //if(data.isEntity(key)) commonIds.push(key);
            commonIds.push(key);
        }
    }
    let offset = -2;//-2、2、-3、3 ...
    let node, paths;
    for (let n = 0; n < commonIds.length; n++) {
        node = {};
        node[commonIds[n]] = entity1.neighbours[commonIds[n]];
        paths = drawCommonRelations(width / 2 - zoomW * R, height / 2, r * zoomR, R * zoomR, 0, zoomH * r * offset, entity1.neighbours[commonIds[n]], false);
        drawPath(paths[0], width / 2 - zoomW * R, height / 2, "middle", "35%");//暂时这么处理吧，不太好看

        node = {};
        node[commonIds[n]] = entity2.neighbours[commonIds[n]];
        paths = drawCommonRelations(width / 2 - zoomW * R, height / 2, r * zoomR, R * zoomR, 0, zoomH * r * offset, entity2.neighbours[commonIds[n]], true);
        drawPath(paths[0], width / 2 - zoomW * R, height / 2, "middle", "65%");//暂时这么处理吧，不太好看

        drawNode(width / 2, height / 2 + zoomH * r * offset, r * zoomR, node);
    }
}

function drawCommonRelations(centX, centY, r, R, shiftX, shiftY, node, reverse = false) {

    angle = 0;
    let rotate = angle;

    let verAnglue = angle + Math.PI / 2; //angle的垂直方向
    let path = [];

    r = 3 * r;
    R = zoomW * 2 * R / zoomR;


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


    //算是偏移后 cx/y1文本起始点，cx/y2文本起终止
    cx1 = mx1 + shiftX;
    cx2 = mx2 + shiftX;
    cy1 = my1 + shiftY;
    cy2 = my2 + shiftY;

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

    let data = node.relations[0];
    let nodeId = data.getEntityIdByValue(node.value, instance_model)[0];
    if (instance_model.relations[data.id] != undefined) {
        let roles = instance_model.relations[data.id].roles;
        if (roles[0].rolename != "" && roles[1].rolename != "") {
            console.log(roles[1].node_id)
            console.log(nodeId)
            if (roles[1].node_id == nodeId ^ reverse) {
                data.value = roles[0].rolename + "-" + roles[1].rolename;
            } else {
                data.value = roles[1].rolename + "-" + roles[0].rolename;
            }
        }
    }
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
    return path;
}


function drawUnique(id1, id2) {

    let entity1 = data.getEntity(id1);
    let entity2 = data.getEntity(id2);

    let commonIds = [];
    let key;
    for (let key in entity1.neighbours) {
        if (entity2.neighbours[key] != undefined) {
            //if(data.isEntity(key)) commonIds.push(key);
            commonIds.push(key);
        }
    }

    let commonLength = commonIds.length + 1;

    let allLength1 = getJsonLength(entity1.neighbours);
    let startAngle1 = Math.PI * (commonLength + 1) / allLength1;
    drawUniqueNeighbours(width / 2 - zoomW * R, height / 2, r * zoomR, R * zoomR, entity1.neighbours, [...commonIds, id2], startAngle1);

    let allLength2 = getJsonLength(entity2.neighbours);
    let startAngle2 = Math.PI * (commonLength + 1) / allLength2;//+Math.PI
    drawUniqueNeighbours(width / 2 + zoomW * R, height / 2, r * zoomR, R * zoomR, entity2.neighbours, [...commonIds, id1], startAngle2 + Math.PI);

    return;
}

function drawUniqueNeighbours(centX, centY, r, R, neighbours, filterArray, startAngle = 0) {
    let paths = getUniquePaths(centX, centY, R, r, startAngle, neighbours, filterArray);
    for (let path of paths) {
        drawPath(path, centX, centY);
    }
    let nodes = getUniqueNodes(centX, centY, R, startAngle, neighbours, filterArray);
    for (let node of nodes) {
        drawNode(node.cx, node.cy, r, node.data);
    }
}

function getUniquePaths(centX, centY, R, r, startAngle = 0, neighbours, filterArray) {
    let N = getJsonLength(neighbours);
    let paths = [];
    let i = 0;
    for (let key in neighbours) {
        if (filterArray.indexOf(key) != -1) continue;
        neighbours[key].id = key;
        angle = 2 * Math.PI * i / N + startAngle;
        let path = getPath(centX, centY, R, r, angle, neighbours[key]);
        //console.log(path);
        paths.push(...path);
        i++;
    }
    //console.log(i);
    return paths;
}


function getUniqueNodes(centX, centY, R, startAngle, neighbours, filterArray) {
    let N = getJsonLength(neighbours);
    let nodes = [];
    let i = 0, cx, cy, angle;

    for (let key in neighbours) {
        if (filterArray.indexOf(key) != -1) continue;
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
