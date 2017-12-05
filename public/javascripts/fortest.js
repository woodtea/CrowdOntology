function drawIndex(model = instance_model) {
    $(index).find("li").remove();
    var html = "";
    for (let id in model.nodes) {
        if (model.nodes[id].tags != undefined) {
            html += generateIndex(model.nodes[id].value, id);
        }
    }
    $(index).append(html);
}

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

    $("#" + id1).remove();
    $("#" + id2).remove();
    drawNode(width * 1 / 4, height * 1 / 2, r * 3 / 4, entity1.centerNode, true);
    drawNode(width * 3 / 4, height * 1 / 2, r * 3 / 4, entity2.centerNode, true);
}


function drawRecommendation(recommend, model = instance_model) {

    //recommend=checkRecommendation(recommend,instance_model);
    let id = $("g.center.isCentralized").attr("id");
    let entity = getEntity(id, model);
    if (entity == undefined) return false;  //如果不是实体的话
    //fortest
    if (entity.centerNode["n0"] == undefined) return false;  //如果不是实体的话

    //$(graph).children().remove();
    drawModal(width / 2, height / 2, R+2*r);
    drawCircle(width / 2, height / 2, 5/3*R);
    drawRecommendNeighbours(width / 2, height / 2, r, 5/3*R, entity.neighbours, recommend);
    $("g.center.isCentralized").remove();
    drawNode(width / 2, height / 2, r, entity.centerNode, true);
    return true;
}


//drawIndex();
//drawRelation("n0", "n2", instance_model);
//drawTitle("属性");
