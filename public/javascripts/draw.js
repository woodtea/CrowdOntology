/*
 * 中心区域的绘制
 */

const width = 700, height = 550;//, height = 600;
const r = 30;
const R = 5 * r;

/* atomic functions */
/*
const svg = d3
    .select("body .graph-row .middle-content")
    .append("svg")
    .classed("graph", true)
    .attr("width", width)
    .attr("height", height);
*/
const svg = d3.select("body .graph-row .middle-content svg")
const property = $("body .graph-row .properties");
const graph = $("body .graph-row .graph");
const index = $("body .graph-row .index");


/*
    基础元素绘制
 */
function drawTitle(str) {
    //svg.append("title")
    //    .text(str);
    $("body .graph-row .title").html("<h4>"+str+"</h4>");
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

function drawModal(centX, centY, R){
    svg
        .append("circle")
        .classed("auxiliary", true)
        .attr("cx", centX)
        .attr("cy", centY)
        .attr("r", R)
        .attr("fill", "#000")
        .attr("fill-opacity","0.3");

}

function drawNode(centX, centY, r, centerNode, isCenter = false, isCentralized = false, isRecommendation = false) {
    let id;
    for (let tmpid in centerNode) {
        id = tmpid;
        data = {
            "id": id,
            "value": centerNode[id].value,
        }
    }
    if (centerNode[id].tags) data["tags"] = centerNode[id].tags;
    if (centerNode[id].dataType) data["dataType"] = centerNode[id].dataType;

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
        .attr("fill", "#eee")
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
    svg.select("#" + data.id)
        .append("text")
        .text(data.value)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.4em");

    if (isCenter) {
        svg.select("#" + data.id)
            .classed("center", true);
        svg.select("#" + data.id)
            .select("circle")
            .attr("fill", "#F8F8F8")
            .attr("stroke", "#00008B");
    }
    if (isCentralized) {
        svg.select("#" + data.id)
            .classed("isCentralized", true);
    }
    if (isRecommendation) {
        svg.select("#" + data.id)
            .classed("isRecommendation",true);
    }

}


function drawPath(path,centX=width/2, centY=height/2) {
    svg
        .append("path")
        .style("stroke", "grey")
        .style("stroke-width", "1px")
        .style("fill", "none")
        .attr("id", path.data.id)
        .attr("d", function (d) {
            if (path.cx1 == undefined) {
                return "M" + path.sx + "," + path.sy + "L" + path.ex + "," + path.ey;
            } else {
                /*
                 let str;
                 if(path.sx<path.ex){
                 str =  "M" + path.sx + "," + path.sy +
                 "Q"+ path.nx1 + "," + path.ny1 + "," + path.cx1 + "," +path.cy1 +
                 "L"+ path.cx2 + "," + path.cy2 +
                 "Q"+ path.nx2 + "," + path.ny2 + "," + path.ex + "," + path.ey;
                 }else{
                 str =  "M" + path.ex + "," + path.ey +
                 "Q"+ path.nx2 + "," + path.ny2 + "," + path.cx2 + "," +path.cy2 +
                 "L"+ path.cx1 + "," + path.cy1 +
                 "Q"+ path.nx1 + "," + path.ny1 + "," + path.sx + "," + path.sy;
                 }
                 return str;
                 */
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
    $("#"+path.data.id).css({transformOrigin: originPosition}).css({rotate: rotateAngle});

    svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-5")
        .append("textPath")
        .attr("href", "#" + path.data.id)
        .attr("startOffset", "50%")
        .style('font-size', '10px')
        .classed("textPath", true)
        .text(path.data.value);
}

function drawPathText(path) {
    svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-5")
        .append("textPath")
        .attr("href", "#" + path.data.id)
        .attr("startOffset", "50%")
        .style('font-size', '10px')
        .classed("textPath", true)
        .text(path.data.value);
}

//

/* index */
function drawIndex(model = instance_model) {
    $(index).find("li").remove();
    var html = "";
    for (let id in model.nodes) {
        if (model.nodes[id].tags != undefined) {
            html += generateIndex(model.nodes[id].value, id);
        }
    }
    //console.log(html);
    $(index).append(html);
}

/* compound functions */
function drawEntity(id, model = instance_model) {
    let entity = getEntity(id, model);
    if (entity == undefined) return false;  //如果不是实体的话

    $(graph).children().remove();
    drawCircle(width / 2, height / 2, R);
    drawNeighbours(width / 2, height / 2, r, R, entity.neighbours);
    drawNode(width / 2, height / 2, r, entity.centerNode, true, true);
    return true;
}

function drawRelation(id1, id2, model = instance_model) {
    //有一个bug，对共享节点未作处理
    //对于偏移的处理
    $(graph).children().remove();
    let entity1 = getEntity(id1, model);
    let entity2 = getEntity(id2, model);

    let [startAngle1,startAngle2] = getStartAngle(entity1,entity2);

    drawCircle(width * 1 / 4, height * 1 / 2, R * 3 / 4);
    drawNode(width * 1 / 4, height * 1 / 2, r * 3 / 4, entity1.centerNode);


    //let entity2 = getEntity(id2, model);
    drawCircle(width * 3 / 4, height * 1 / 2, R * 3 / 4);
    drawNode(width * 3 / 4, height * 1 / 2, r * 3 / 4, entity2.centerNode);

    drawNeighbours(width * 1 / 4, height * 1 / 2, r * 3 / 4, R * 3 / 4, entity1.neighbours, startAngle1);
    drawNeighbours(width * 3 / 4, height * 1 / 2, r * 3 / 4, R * 3 / 4, entity2.neighbours, startAngle2 +Math.PI);

    svgBringToFront($("#"+id1));
    svgBringToFront($("#"+id2));
/*
    $("#" + id1).remove();
    $("#" + id2).remove();
    drawNode(width * 1 / 4, height * 1 / 2, r * 3 / 4, entity1.centerNode, true);
    drawNode(width * 3 / 4, height * 1 / 2, r * 3 / 4, entity2.centerNode, true);
*/
}


function drawRecommendation(recommend, model = instance_model) {

    //recommend=checkRecommendation(recommend,instance_model);
    let id = $("g.center.isCentralized").attr("id");
    let entity = getEntity(id, model);
    if (entity == undefined) return false;  //如果不是实体的话
    //fortest
    //if (entity.centerNode["n0"] == undefined) return false;  //如果不是实体的话

    //$(graph).children().remove();
    drawModal(width / 2, height / 2, R+2*r);
    drawCircle(width / 2, height / 2, 5/3*R);
    //console.log(width / 2 +" "+ height / 2 +" "+ r +" "+ 5/3*R)
    drawRecommendNeighbours(width / 2, height / 2, r, 5/3*R, entity.neighbours, recommend);
    $("g.center.isCentralized").remove();
    drawNode(width / 2, height / 2, r, entity.centerNode, true);
    return true;
}


function drawNeighbours(centX, centY, r, R, neighbours, startAngle = 0) {
    //let startAngle = 0; //应该是不确定的
    let paths = getPaths(centX, centY, R, r, startAngle, neighbours);
    for (let path of paths) {
        drawPath(path,centX, centY);
    }
    let nodes = getNodes(centX, centY, R, startAngle, neighbours);
    for (let node of nodes) {
        drawNode(node.cx, node.cy, r, node.data);
    }
}

function drawRecommendNeighbours(centX, centY, r, R, neighbours, recommend, startAngle = 0) {
    let paths = getRecommendPaths(centX, centY, R, r, startAngle, neighbours, recommend);
    //alert(paths.length);
    for (let path of paths) {
        drawPath(path);
    }
    let nodes = getRecommendNodes(centX, centY, R, startAngle, neighbours, recommend);
    for (let node of nodes) {
        drawNode(node.cx, node.cy, r, node.data,false,false,true);
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


function getRecommendNodes(centX, centY, R, startAngle, neighbours,recommend) {
    let N = getJsonLength(neighbours);
    let RN = getJsonLength(recommend);
    let pRN = Math.ceil(RN/N);

    let nodes = [];
    let i = 0, cx, cy, angle;

    for (let key in recommend) {
        let data = {};
        data[key] = recommend[key]
        if ($("#" + key)[0]) {
            i++;
            continue;
        }      //如果已经存在就不画
        //angle = 2 * Math.PI * i / N + startAngle;
        angle = getAngle(N,RN,pRN,i)+startAngle;

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
    let pRN = Math.ceil(RN/N);          //每片的推荐数
    if(N==0) pRN=RN;
    //alert(N)
    //alert(RN)
    //alert(pRN)

    let paths = [];
    let i = 0;
    for (let key in recommend) {
        recommend[key].id = key;
        //angle = 2 * Math.PI * i / N + startAngle;
        angle = getAngle(N,RN,pRN,i)+startAngle;
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
        if ($("#" + node.relations[i].id)[0]) {
            i++;
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
            ,rotate
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
            ,rotate
        });
    }
    //console.log(path);
    return path;
}



function refillNode(data) {
    svg.select("#" + data.id + " circle")
        .attr("fill", "#eee")
        .attr("stroke", "gray")
        .attr("stroke-width", 1);
    svg.select("#" + data.id + " text")
        .text(data.value)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.4em");
}


/*
 function relationUnfolding(x,y){
 let centerNode = {
 "id":"rn1",
 "value":"知己",
 "tags":"关系"
 };
 drawCircle(x,y,R*3/8);
 drawNode(x,y,r*3/8,centerNode);

 let neighboursx = [
 {
 "id":"rn2",
 "value":"1600-1620",
 "tags":"String",
 "relations":[{
 "id":"nr1",
 "value":"起止时间"
 }]
 }
 ]
 //drawNeighbours2(x,y,r*3/4,R*3/4,neighboursx)
 centerNode = {
 "id":"rn2",
 "value":"1600-1620",
 "tags":"String"
 };
 drawNode(x,y-R*3/8,r*3/8,centerNode);
 }
 */



