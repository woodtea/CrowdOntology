outputPolicy = function(){
    let nodes = instance_model.nodes;
    let relations = instance_model.relations;
    for(let key in nodes)
    {
        let node = nodes[key];
        if(node.tags[0]=='国家政策事件'&&node.value!="") console.log(user+'\t'+node.value+'\t'+key)
    }
    //console.log(relations);
    for(let key in relations)
    {
        let relation = relations[key];
        let type = relation.type;
        //console.log(type);
        if(type!='政策依据'&&type!='前期政策') continue;
        let thisone,otherone;
        for(let role of relation.roles)
        {
            if(role.rolename=='当前政策') thisone=nodes[role.node_id].value;
            else otherone=nodes[role.node_id].value;
        }
        if(thisone!=""&&otherone!="") console.log(user+'\t'+type+'\t'+thisone+'\t'+otherone+'\t'+key);
    }
}

policyStat = async function(){
    let userlist = ['user1@mail', '2010301155@pku.edu.cn', '2010301140@pku.edu.cn', '2010301125@pku.edu.cn', '2010301148@pku.edu.cn', '2010301135@pku.edu.cn', '2010301141@pku.edu.cn', '2010301113@pku.edu.cn', '2010301114@pku.edu.cn', '2010301203@pku.edu.cn', '2010301210@pku.edu.cn', '2010301122@pku.edu.cn', '2010301156@pku.edu.cn', '2010301152@pku.edu.cn', '2010301108@pku.edu.cn', '2010301218@pku.edu.cn', '2010301120@pku.edu.cn', '2010301129@pku.edu.cn', '2010301220@pku.edu.cn', '2010301124@pku.edu.cn', '2010301115@pku.edu.cn', '2010301126@pku.edu.cn', '2010301157@pku.edu.cn', '2010301134@pku.edu.cn', '2010301205@pku.edu.cn', '2010301133@pku.edu.cn', '2010301149@pku.edu.cn', '2010301151@pku.edu.cn', '2010301112@pku.edu.cn', '2010301143@pku.edu.cn', '2010301209@pku.edu.cn', '2010301128@pku.edu.cn', '2010301103@pku.edu.cn', '2010301118@pku.edu.cn', '2010301117@pku.edu.cn', '2010301132@pku.edu.cn', '2010301131@pku.edu.cn', '2010301119@pku.edu.cn', '2010301123@pku.edu.cn', '2010301145@pku.edu.cn', '2010301207@pku.edu.cn', '2010301137@pku.edu.cn', '2010301204@pku.edu.cn', '2010301150@pku.edu.cn', '2010301101@pku.edu.cn', '2010301201@pku.edu.cn', '2010301212@pku.edu.cn', '2010301121@pku.edu.cn', '2010301138@pku.edu.cn', '2010301107@pku.edu.cn', '2010301130@pku.edu.cn', '2010301102@pku.edu.cn', '2010301154@pku.edu.cn', '2010301111@pku.edu.cn', '2010301110@pku.edu.cn', '2010301146@pku.edu.cn', '2010301144@pku.edu.cn', '2010301105@pku.edu.cn', '2010301104@pku.edu.cn', '2010301127@pku.edu.cn', '2010301116@pku.edu.cn', '2010301219@pku.edu.cn', '2010301106@pku.edu.cn', '0006178148@pku.edu.cn', '2010301255@pku.edu.cn', 'nick2002@pku.edu.cn', '2010301214@pku.edu.cn', '2010301216@pku.edu.cn', '2010301139@pku.edu.cn', '2010301136@pku.edu.cn', '2010301153@pku.edu.cn', '2010301109@pku.edu.cn', '2010301208@pku.edu.cn', '2010301147@pku.edu.cn', '2010301206@pku.edu.cn', '2010301211@pku.edu.cn']

    let finalans =  {}
    let cnoden =0 , crelan = 0;
    let cnode = {}
    let crela = {}
    for(let u of userlist)
    {
        user = u;
        connection.testmode = 1;
        connection.io_get_insModel();
            while(connection.socket_mutex) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        finalans[u]={};
        let nodes = instance_model.nodes;
        let relations = instance_model.relations;
        let nodenum=0,relanum=0;
        for(let key in nodes)
        {
            let node = nodes[key];
            if(node.tags[0]=='国家政策事件'&&node.value!=""){
                if(cnode[key]==undefined){
                    cnoden++;
                    cnode[key]=true;
                }
                nodenum++;
            }
        }
        //console.log(relations);
        for(let key in relations)
        {
            let relation = relations[key];
            let type = relation.type;
            //console.log(type);
            if(type!='政策依据'&&type!='前期政策') continue;
            let thisone,otherone;
            for(let role of relation.roles)
            {
                if(role.rolename=='当前政策') thisone=nodes[role.node_id].value;
                else otherone=nodes[role.node_id].value;
            }
            if(thisone!=""&&otherone!="") 
            {
                relanum++;
                if(crela[key]==undefined)
                {
                    crela[key]=relation;
                    crelan++
                }
            }
        }
        finalans[u]['nodenum']=nodenum;
        finalans[u]['relanum']=relanum;
    }
    finalans['crowd']={};
    finalans['crowd']['nodenum'] = cnoden;
    finalans['crowd']['relanum'] = crelan;
    console.log(finalans);
    console.log(JSON.stringify(finalans));
}

policyStat = async function(){
    
    let userlist = [];
    let finalans =  {}
    let cnoden =0 , crelan = 0;
    let cnode = {}
    let crela = {}
    for(let u of userlist)
    {
        user = u;
        connection.testmode = 1;
        connection.io_get_insModel();
            while(connection.socket_mutex) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        finalans[u]={};
        let nodes = instance_model.nodes;
        let relations = instance_model.relations;
        let nodenum=0,relanum=0;
        for(let key in nodes)
        {
            let node = nodes[key];
            if(node.tags[0]=='国家政策事件'&&node.value!=""){
                if(cnode[key]==undefined){
                    cnoden++;
                    cnode[key]=true;
                }
                nodenum++;
            }
        }
        //console.log(relations);
        for(let key in relations)
        {
            let relation = relations[key];
            let type = relation.type;
            //console.log(type);
            if(type!='政策依据'&&type!='前期政策') continue;
            let thisone,otherone;
            for(let role of relation.roles)
            {
                if(role.rolename=='当前政策') thisone=nodes[role.node_id].value;
                else otherone=nodes[role.node_id].value;
            }
            if(thisone!=""&&otherone!="") 
            {
                relanum++;
                if(crela[key]==undefined)
                {
                    crela[key]=relation;
                    crelan++
                }
            }
        }
        finalans[u]['nodenum']=nodenum;
        finalans[u]['relanum']=relanum;
    }
    finalans['crowd']={};
    finalans['crowd']['nodenum'] = cnoden;
    finalans['crowd']['relanum'] = crelan;
    console.log(finalans);
    console.log(JSON.stringify(finalans));
}

hlmStat = async function(){
    
    let userlist = ['2010301113@pku.edu.cn', '2010301252@pku.edu.cn', '2010301108@pku.edu.cn', '2010301246@pku.edu.cn', '2010301131@pku.edu.cn', '2010301156@pku.edu.cn', '2010301147@pku.edu.cn', '2010301241@pku.edu.cn', '2010301230@pku.edu.cn', '2010301103@pku.edu.cn', '2010301146@pku.edu.cn', '2010301207@pku.edu.cn', '2010301138@pku.edu.cn', '2010301120@pku.edu.cn', '2010301116@pku.edu.cn', '2010301124@pku.edu.cn', '2010301102@pku.edu.cn', '2010301114@pku.edu.cn', '2010301129@pku.edu.cn', '2010301211@pku.edu.cn', '2010301223@pku.edu.cn', '2010301140@pku.edu.cn', '2010301233@pku.edu.cn', '2010301222@pku.edu.cn', '2010301142@pku.edu.cn', '2010301232@pku.edu.cn', '2010301130@pku.edu.cn', '2010301218@pku.edu.cn', '2010301137@pku.edu.cn', '2010301219@pku.edu.cn', '2010301213@pku.edu.cn', '2010301127@pku.edu.cn']

    let finalans =  {}
    let cnoden =0 , crelan = 0;
    let cnode = {}
    let crela = {}
    for(let u of userlist)
    {
        user = u;
        connection.testmode = 1;
        connection.io_get_insModel();
            while(connection.socket_mutex) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        finalans[u]={};
        let nodes = instance_model.nodes;
        let relations = instance_model.relations;
        let nodenum=0,relanum=0;
        for(let key in nodes)
        {
            let node = nodes[key];
            if(node.tags[0]!='String'&&node.value!=""){
                if(cnode[key]==undefined){
                    cnoden++;
                    cnode[key]=true;
                }
                nodenum++;
            }
            else{
                delete nodes[key];//不统计属性
            } 
        }
        //console.log(relations);
        finalans[u]['relations']=[];
        out:for(let key in relations)
        {
            let relation = relations[key];
            let type = relation.type;
            //console.log(type);
            for(let role of relation.roles)
            {
                if(nodes[role.node_id]==undefined) continue out; //不统计属性
            }
            finalans[u]['relations'].push(key);
            relanum++;
            if(crela[key]==undefined)
            {
                crela[key]=relation;
                crelan++
            }
        }
        finalans[u]['nodenum']=nodenum;
        finalans[u]['relanum']=relanum;
    }
    finalans['crowd']={};
    finalans['crowd']['nodenum'] = cnoden;
    finalans['crowd']['relanum'] = crelan;
    console.log(finalans);
    console.log(JSON.stringify(finalans));
}

loadTest = function(){
    let nodeId = $('g.entity.center').attr("id");
    let node = {}
    node[nodeId] = eval('(' + JSON.stringify(instance_model.nodes[nodeId]) + ')');
    setInterval(function(){connection.io_recommend_insModel_node(node)},10);
}

testFunc = function(){
    //吴京
    entity0 = {
        tags: ["人"],
        value: "吴京",
        nodeId: "front_e0",
        valueId: "front_v0",
        relationId: "front_r0"
    }
    connection.io_create_insModel_entity(entity0);
    entity1 = {
        tags: ["电影人物"],
        value: "冷锋",
        nodeId: "front_e1",
        valueId: "front_v1",
        relationId: "front_r1"
    }
    connection.io_create_insModel_entity(entity1);
    entity2 = {
        tags: ["电影"],
        value: "战狼",
        nodeId: "front_e2",
        valueId: "front_v2",
        relationId: "front_r2"
    }
    connection.io_create_insModel_entity(entity2);

    //余男
    entity3 = {
        tags: ["人"],
        value: "余男",
        nodeId: "front_e3",
        valueId: "front_v3",
        relationId: "front_r3"
    }
    connection.io_create_insModel_entity(entity3);
    entity4 = {
        tags: ["电影人物"],
        value: "龙小云",
        nodeId: "front_e4",
        valueId: "front_v4",
        relationId: "front_r4"
    }
    connection.io_create_insModel_entity(entity4);

    relation0 = {
        "front_rr0":{
            id:"front_rr0",
            roles:[
                {rolename:"演员",node_id:"front_e0"},
                {rolename:"角色",node_id:"front_e1"},
                {rolename:"电影",node_id:"front_e2"},
            ],
            "type":"出演"
        }
    }
    connection.io_create_insModel_relation(relation0);

    relation1 = {
        "front_rr1":{
            id:"front_rr1",
            roles:[
                {rolename:"演员",node_id:"front_e3"},
                {rolename:"角色",node_id:"front_e4"},
                {rolename:"电影",node_id:"front_e2"},
            ],
            "type":"出演"
        }
    }
    connection.io_create_insModel_relation(relation1);

    //
    value0 = {
        "front_va0":{
            "tags": ["String"],
            "value": "男"
        }
    }
    connection.io_create_insModel_node(value0)

    attribute0 = {
        "front_ra0":{
            id:"front_ra0",
            roles:[
                {rolename:"",node_id:"front_e0"},
                {rolename:"性别",node_id:"front_va0"},
            ],
            "type":"性别"
        }
    }
    connection.io_create_insModel_relation(attribute0);
}

testFunc2 = function () {
    candidate = 0;
    let value

    for(let key in hlm.entities){
        value = key;
        let entity = {
            tags: ["人"],
            value: value,
            nodeId: generateFrontNodeID(value, "e"),
            valueId: generateFrontNodeID(value, "v"),
            relationId: generateFrontRelationID(candidate)
        }
        connection.io_create_insModel_entity(entity);
        candidate++;
    }
    console.log(candidate);
}

testFunc3 = function () {

    candidate = 0;
    for(let key in hlm.relations){

        let entity1 = data.getEntityIdByValue(hlm.relations[key][0])[0];
        let entity2 = data.getEntityIdByValue(hlm.relations[key][1])[0];
        let type = hlm.relations[key][2];

        let relationId = generateFrontRelationID(candidate);

        let relations = {};
        relations[relationId] = {
            "type": type,
            "roles": [
                {"rolename": rolesMap[type][0], "node_id": entity1},
                {"rolename": rolesMap[type][1], "node_id": entity2}
            ]
        }
        connection.io_create_insModel_relation(relations);
        candidate++;
    }
    console.log(candidate);
}
singlePolicy = async function() { //单人建立项目
    let candidate = 0;
    connection.testmode=1;
    for(let key of policy.entities){
        let value = key;
        let entity = {
            tags: ["国家政策事件"],
            value: value,
            nodeId: generateFrontNodeID(value, "e"),
            valueId: generateFrontNodeID(value, "v"),
            relationId: generateFrontRelationID(candidate)
        }
        connection.io_create_insModel_entity(entity);
        candidate++;
    }
    connection.io_get_insModel();
    while(connection.socket_mutex){
        await new Promise(resolve => setTimeout(resolve, 1000));
    }//等待实体创建完成
    for(let key of policy.attrs){

        if(key[0]==key[2]) continue;
        if(key[2]=='') continue;
        let entity = data.getEntityIdByValue(key[0])[0];
        let type = key[1];
        let value = key[2];

        //生成节点
        let nodes = {}
        let nodeId = generateFrontNodeID(value)
        let tags = data.getAttrTags(type)
        nodes[nodeId] = {
            "dataType": type,
            "tags": tags,
            "value": value
        }
        console.log('<<<nodes'+JSON.stringify(nodes));
        connection.io_create_insModel_node(nodes)
        //生成关系
        let relationId = generateFrontRelationID(candidate);
        let relations = {};
        relations[relationId] = {
            "type": type,
            "roles": [
                {"rolename": "", "node_id": entity},
                {"rolename": type, "node_id": nodeId}
            ]
        }
        console.log('<<<relations'+JSON.stringify(relations));
        connection.io_create_insModel_relation(relations);
        candidate++;
    }
}
testPolicy =async function() { //建立项目的集成测试
    let userlist=["0006178148@pku.edu.cn","2010301116@pku.edu.cn","2010301257@pku.edu.cn","2010301256@pku.edu.cn","2010301255@pku.edu.cn","2010301254@pku.edu.cn","2010301253@pku.edu.cn","2010301252@pku.edu.cn","2010301251@pku.edu.cn","2010301250@pku.edu.cn","2010301249@pku.edu.cn","2010301248@pku.edu.cn","2010301247@pku.edu.cn","2010301246@pku.edu.cn","2010301245@pku.edu.cn","2010301244@pku.edu.cn","2010301243@pku.edu.cn","2010301242@pku.edu.cn","2010301241@pku.edu.cn","2010301240@pku.edu.cn","2010301239@pku.edu.cn","2010301238@pku.edu.cn","2010301237@pku.edu.cn","2010301236@pku.edu.cn","2010301235@pku.edu.cn","2010301234@pku.edu.cn","2010301233@pku.edu.cn","2010301232@pku.edu.cn","2010301231@pku.edu.cn","2010301230@pku.edu.cn","2010301229@pku.edu.cn","2010301228@pku.edu.cn","2010301227@pku.edu.cn","2010301226@pku.edu.cn","2010301225@pku.edu.cn","2010301224@pku.edu.cn","2010301223@pku.edu.cn","2010301222@pku.edu.cn","2010301221@pku.edu.cn","2010301220@pku.edu.cn","2010301219@pku.edu.cn","2010301218@pku.edu.cn","2010301217@pku.edu.cn","2010301216@pku.edu.cn","2010301215@pku.edu.cn","2010301214@pku.edu.cn","2010301213@pku.edu.cn","2010301212@pku.edu.cn","2010301211@pku.edu.cn","2010301210@pku.edu.cn","2010301209@pku.edu.cn","2010301208@pku.edu.cn","2010301207@pku.edu.cn","2010301206@pku.edu.cn","2010301205@pku.edu.cn","2010301204@pku.edu.cn","2010301203@pku.edu.cn","2010301202@pku.edu.cn","2010301201@pku.edu.cn","2010301157@pku.edu.cn","2010301156@pku.edu.cn","2010301155@pku.edu.cn","2010301154@pku.edu.cn","2010301153@pku.edu.cn","2010301152@pku.edu.cn","2010301151@pku.edu.cn","2010301150@pku.edu.cn","2010301149@pku.edu.cn","2010301148@pku.edu.cn","2010301147@pku.edu.cn","2010301146@pku.edu.cn","2010301145@pku.edu.cn","2010301144@pku.edu.cn","2010301143@pku.edu.cn","2010301142@pku.edu.cn","2010301141@pku.edu.cn","2010301140@pku.edu.cn","2010301139@pku.edu.cn","2010301138@pku.edu.cn","2010301137@pku.edu.cn","2010301136@pku.edu.cn","2010301135@pku.edu.cn","2010301134@pku.edu.cn","2010301133@pku.edu.cn","2010301132@pku.edu.cn","2010301131@pku.edu.cn","2010301130@pku.edu.cn","2010301129@pku.edu.cn","2010301128@pku.edu.cn","2010301127@pku.edu.cn","2010301126@pku.edu.cn","2010301125@pku.edu.cn","2010301124@pku.edu.cn","2010301123@pku.edu.cn","2010301122@pku.edu.cn","2010301121@pku.edu.cn","2010301120@pku.edu.cn","2010301119@pku.edu.cn","2010301118@pku.edu.cn","2010301117@pku.edu.cn","2010301115@pku.edu.cn","2010301114@pku.edu.cn","2010301113@pku.edu.cn","2010301112@pku.edu.cn","2010301111@pku.edu.cn","2010301110@pku.edu.cn","2010301109@pku.edu.cn","2010301108@pku.edu.cn","2010301107@pku.edu.cn","2010301106@pku.edu.cn","2010301105@pku.edu.cn","2010301104@pku.edu.cn","2010301103@pku.edu.cn","2010301102@pku.edu.cn","2010301101@pku.edu.cn","2001111331@pku.edu.cn","1901213333@pku.edu.cn","1900013732@pku.edu.cn","1900013712@pku.edu.cn","1801213680@pku.edu.cn","1701111326@pku.edu.cn"]
    //let userlist=["2010301236@pku.edu.cn","2010301235@pku.edu.cn"]
    let tempins=instance_model
    for(let u of userlist)
    {
        let candidate=0;
        instance_model=tempins
        while(connection.socket_mutex){
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        user = u;
        console.log(u+'loading')
        while(connection.socket_mutex){
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        connection.testmode=1;
        console.log(u+'begin')
        for(let key of policy.entities){
            let value = key;
            let entity = {
                tags: ["国家政策事件"],
                value: value,
                nodeId: generateFrontNodeID(value, "e"),
                valueId: generateFrontNodeID(value, "v"),
                relationId: generateFrontRelationID(candidate)
            }
            connection.io_create_insModel_entity(entity);
            candidate++;
        }
        connection.io_get_insModel();
        while(connection.socket_mutex){
            await new Promise(resolve => setTimeout(resolve, 1000));
        }//等待实体创建完成
        for(let key of policy.attrs){

            if(key[0]==key[2]) continue;
            if(key[2]=='') continue;
            let entity = data.getEntityIdByValue(key[0])[0];
            let type = key[1];
            let value = key[2];

            // if(type=='政策发文字号'||type=='政策发布日期')
            //     value=value.replace(/\s/g,"");
            //生成节点
            let nodes = {}
            let nodeId = generateFrontNodeID(value)
            let tags = data.getAttrTags(type)
            nodes[nodeId] = {
                "dataType": type,
                "tags": tags,
                "value": value
            }
            console.log('<<<nodes'+JSON.stringify(nodes));
            connection.io_create_insModel_node(nodes)
            //生成关系
            let relationId = generateFrontRelationID(candidate);
            let relations = {};
            relations[relationId] = {
                "type": type,
                "roles": [
                    {"rolename": "", "node_id": entity},
                    {"rolename": type, "node_id": nodeId}
                ]
            }
            console.log('<<<relations'+JSON.stringify(relations));
            connection.io_create_insModel_relation(relations);
            candidate++;
        }
    }

}
testPolicy1 = function () {
    let candidate = 0;
    let value
    connection.testmode=1;
    for(let key of policy.entities){
        value = key;
        let entity = {
            tags: ["国家政策事件"],
            value: value,
            nodeId: generateFrontNodeID(value, "e"),
            valueId: generateFrontNodeID(value, "v"),
            relationId: generateFrontRelationID(candidate)
        }
        connection.io_create_insModel_entity(entity);
        candidate++;
        console.log("finish"+candidate+key);
    }
    console.log(candidate);
}
testPolicy3 = function() {
    connection.testmode=1;
    let candidate = 0;
    for(let key of policy.attrs){

        if(key[0]==key[2]) continue;
        if(key[2]=='') continue;
        let entity = data.getEntityIdByValue(key[0])[0];
        let type = key[1];
        let value = key[2];

        //生成节点
        let nodes = {};
        let nodeId = generateFrontNodeID(value)
        let tags = data.getAttrTags(type)
        nodes[nodeId] = {
            "dataType": type,
            "tags": tags,
            "value": value
        }
        console.log('<<<nodes'+JSON.stringify(nodes));
        connection.io_create_insModel_node(nodes)
        //生成关系
        let relationId = generateFrontRelationID(candidate);
        let relations = {};
        relations[relationId] = {
            "type": type,
            "roles": [
                {"rolename": "", "node_id": entity},
                {"rolename": type, "node_id": nodeId}
            ]
        }
        console.log('<<<relations'+JSON.stringify(relations));
        connection.io_create_insModel_relation(relations);
        candidate++;
    }
    console.log(candidate);
}
//let candidate=0;
testHuman1 = function () {
    let candidate = 0;
    let value
    connection.testmode=1;
    for(let key of human.entities){
        value = key;
        let entity = {
            tags: ["Class"],
            value: value,
            nodeId: generateFrontNodeID(value, "e"),
            valueId: generateFrontNodeID(value, "v"),
            relationId: generateFrontRelationID(candidate)
        }
        connection.io_create_insModel_entity(entity);
        candidate++;
        console.log("finish"+candidate+key);
    }
    console.log(candidate);
}

testHuman2 = function () {
    connection.testmode=1;
    let candidate = 0;
    for(let key of human.relations){

        let entity1 = data.getEntityIdByValue(key[0])[0];
        let entity2 = data.getEntityIdByValue(key[1])[0];
        let type = key[2];

        let relationId = generateFrontRelationID(candidate);

        let relations = {};
        relations[relationId] = {
            "type": type,
            "roles": [
                {"rolename": rolesMap[type][0], "node_id": entity1},
                {"rolename": rolesMap[type][1], "node_id": entity2}
            ]
        }
        connection.io_create_insModel_relation(relations);
        candidate++;
    }
    console.log(candidate);
}

testHuman3 = function() {
    connection.testmode=1;
    let candidate = 0;
    for(let key of human.attrs){

        if(key[0]==key[2]) continue;

        let entity = data.getEntityIdByValue(key[0])[0];
        let type = key[1];
        let value = key[2];

        //生成节点
        let nodes = {};
        let nodeId = generateFrontNodeID(value)
        let tags = data.getAttrTags(type)
        nodes[nodeId] = {
            "dataType": type,
            "tags": tags,
            "value": value
        }
        console.log('<<<nodes'+JSON.stringify(nodes));
        connection.io_create_insModel_node(nodes)
        //生成关系
        let relationId = generateFrontRelationID(candidate);
        let relations = {};
        relations[relationId] = {
            "type": type,
            "roles": [
                {"rolename": "", "node_id": entity},
                {"rolename": type, "node_id": nodeId}
            ]
        }
        console.log('<<<relations'+JSON.stringify(relations));
        connection.io_create_insModel_relation(relations);
        candidate++;
    }
    console.log(candidate);
}



testMouse1 = function () {
    let candidate = 0;
    let value
    connection.testmode=1;
    for(let key of mouse.entities){
        value = key;
        let entity = {
            tags: ["Class"],
            value: value,
            nodeId: generateFrontNodeID(value, "e"),
            valueId: generateFrontNodeID(value, "v"),
            relationId: generateFrontRelationID(candidate)
        }
        connection.io_create_insModel_entity(entity);
        candidate++;
        console.log("finish"+candidate+key);
    }
    console.log(candidate);
}

testMouse2 = function () {
    connection.testmode=1;
    let candidate = 0;
    for(let key of mouse.relations){

        let entity1 = data.getEntityIdByValue(key[0])[0];
        let entity2 = data.getEntityIdByValue(key[1])[0];
        let type = key[2];

        let relationId = generateFrontRelationID(candidate);

        let relations = {};
        relations[relationId] = {
            "type": type,
            "roles": [
                {"rolename": rolesMap[type][0], "node_id": entity1},
                {"rolename": rolesMap[type][1], "node_id": entity2}
            ]
        }
        connection.io_create_insModel_relation(relations);
        candidate++;
    }
    console.log(candidate);
}

testMouse3 = function() {
    connection.testmode=1;
    let candidate = 0;
    for(let key of mouse.attrs){

        if(key[0]==key[2]) continue;

        let entity = data.getEntityIdByValue(key[0])[0];
        let type = key[1];
        let value = key[2];


        //生成节点
        let nodes = {};
        let nodeId = generateFrontNodeID(value)
        let tags = data.getAttrTags(type)
        nodes[nodeId] = {
            "dataType": type,
            "tags": tags,
            "value": value
        }
        console.log('<<<nodes'+JSON.stringify(nodes));
        connection.io_create_insModel_node(nodes)
        //生成关系
        let relationId = generateFrontRelationID(candidate);
        let relations = {};
        relations[relationId] = {
            "type": type,
            "roles": [
                {"rolename": "", "node_id": entity},
                {"rolename": type, "node_id": nodeId}
            ]
        }
        console.log('<<<relations'+JSON.stringify(relations));
        connection.io_create_insModel_relation(relations);
        candidate++;
    }
    console.log(candidate);
}

testMouse = function()
{
    testMouse1();
    testMouse3();
    testMouse2();
}

testMC = function(type,role1,role2,ev1,ev2) {
    let relationId = generateFrontRelationID(0);

    let relations = {};
    let e1,e2;
    for(let key in model.nodes){
        if(model.nodes[key].value == ev1) e1 = key;
        if(model.nodes[key].value == ev2) e2 = key;
    }
    relations[relationId] = {
        "roles": [
            {"rolename": role1, "node_id": e1},
            {"rolename": role2, "node_id": e2}
        ],
        "type":type
    }

    console.log(relations);
    connection.io_create_model_relation(relations);

}

var rolesMap = {
    "夫妻":["丈夫","妻子"],
    "夫妾":["丈夫","小妾"],

    "父子":["父亲","儿子"],
    "母子":["母亲","儿子"],
    "父女":["父亲","女儿"],
    "母女":["母亲","女儿"],

    "公媳":["公公","媳妇"],
    "婆媳":["婆婆","媳妇"],
    "翁婿":["岳父","女婿"],
    "姑婿":["岳母","女婿"],

    "兄弟":["哥哥","弟弟"],
    "兄妹":["哥哥","妹妹"],
    "姐妹":["姐姐","妹妹"],
    "姐弟":["姐姐","弟弟"],

    "主仆":["主人","奴仆"],
    "主人丫鬟":["主人","丫鬟"],
    "君臣":["君主","臣子"],

    "subClassOf":["children","parent"],
    "partOf":["part","whole"],
    "disjointWith":["",""]
}
testMedical1 = function () {
    let candidate = 0;
    let value
    connection.testmode=1;
    for(let str of medical.entities){
        let strs = str.split(" ")
        value = strs[0];
        let entity = {
            tags: [strs[1]],
            value: value,
            nodeId: generateFrontNodeID(value, "e"),
            valueId: generateFrontNodeID(value, "v"),
            relationId: generateFrontRelationID(candidate)
        }
        connection.io_create_insModel_entity(entity);
        candidate++;
    }
    console.log(candidate);
}

testMedical2 = function () {
    connection.testmode=1;
    let candidate = 0;
    for(let str of medical.relations){
        let strs = str.split(" ")
        let entity1 = data.getEntityIdByValue(strs[0])[0];
        let entity2 = data.getEntityIdByValue(strs[2])[0];
        let type = strs[4];

        let relationId = generateFrontRelationID(candidate);

        let relations = {};
        relations[relationId] = {
            "type": type,
            "roles": [
                {"rolename": strs[1], "node_id": entity1},
                {"rolename": strs[3], "node_id": entity2}
            ]
        }
        connection.io_create_insModel_relation(relations);
        candidate++;
    }
    console.log(candidate);
}
var mouse = {} //文件过大，在cmy本地保存
var human = {} //文件过大，在cmy本地保存
var policy = {
    "entities": [
        "关于做好因新冠肺炎疫情影响造成监护缺失的儿童救助保护工作的通知",
        "关于做好疫情防控建设项目用地保障工作的通知",
        "关于做好重点城市生活物资保供工作的通知",
        "关于支持新型冠状病毒感染的肺炎疫情防控有关税收征收管理事项的公告",
        "关于印发新型冠状病毒肺炎应急救治设施设计导则(试行)的通知",
        "关于加强新冠肺炎首诊隔离点医疗管理工作的通知",
        "关于做好新型冠状病毒肺炎疫情期间血液安全供应保障工作的通知",
        "关于联合开展打击野生动物违规交易专项执法行动的通知",
        "针对延期返校学生实施机票免费退改的通知",
        "关于积极应对新冠肺炎疫情加强外资企业服务和招商引资工作的通知",
        "新冠肺炎疫情防控税收优惠政策指引",
        "关于充分发挥税收职能作用助力 打赢疫情防控阻击战若干措施的通知",
        "关于应对新型冠状病毒肺炎疫情帮助中小企业复工复产共渡难关有关工作的通知",
        "最高人民法院 最高人民检察院 公安部 司法部印发《关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》的通知",
        "关于发挥政府储备作用支持应对疫情紧缺物资增产增供的通知",
        "关于全力做好春运返程高峰运输服务保障工作的紧急通知",
        "关于疫情防控期间免收农民工返岗包车公路通行费的通知",
        "关于贯彻落实习近平总书记重要指示精神统筹做好疫情防控加快公路水运工程复工开工建设加大交通投资力度的通知",
        "关于印发新型冠状病毒肺炎诊疗方案(试行第五版 修正版)的通知",
        "关于进一步加强疫情期间医用防护服严格分级分区使用管理的通知",
        "关于做好新型冠状病毒感染肺炎疫情防控期间稳定劳动关系支持企业复工复产的意见",
        "关于切实做好学校疫情防控经费保障工作的通知",
        "关于发布新型冠状病毒(2019-nCoV)现场快速检测产品研发应急项目申报指南的通知",
        "关于疫情防控期间做好企业债券工作的通知",
        "关于积极应对疫情创新做好招投标工作保障经济平稳运行的通知",
        "关于疫情防控期间采取支持性两部制电价政策 降低企业用电成本的通知",
        "关于做好新型冠状病毒肺炎疫情防控期间保障医务人员安全维护良好医疗秩序的通知",
        "关于积极做好新型冠状病毒感染的肺炎疫情防控工作的通知",
        "关于印发《养老机构新型冠状病毒感染的肺炎疫情防控指南(第二版)》的通知",
        "关于做好疫情防控期间电梯安全监管工作的通知",
        "关于依法从重从快严厉打击新型冠状病毒疫情防控期间违法行为的意见",
        "关于切实做好新型冠状病毒感染的肺炎疫情防控期间高校毕业生\"三支一扶\"计划有关工作的通知",
        "关于暂退部分旅游服务质量保证金支持旅行社应对经营困难的通知",
        "关于做好疫情防控期间生活物资对接调运保供有关工作的通知",
        "零售、餐饮企业在新型冠状病毒流行期间经营服务防控指南",
        "关于做好生活服务企业新型冠状病毒感染肺炎疫情防控工作的通知",
        "关于保障流通企业防护用品需要 做好市场保供工作的通知",
        "关于打赢疫情防控阻击战强化疫情防控重点保障企业资金支持的紧急通知",
        "关于疫情防控期间开展政府采购活动有关事项的通知",
        "关于做好疫情防控期间彩票发行销售工作有关事宜的通知",
        "关于疫情防控期间切实做好会计服务工作的通知",
        "关于新型冠状病毒感染的肺炎疫情防控期间免征部分行政事业性收费和政府性基金的公告",
        "关于支持新型冠状病毒感染的肺炎疫情防控有关个人所得税政策的公告",
        "关于支持新型冠状病毒感染的肺炎疫情防控有关捐赠税收政策的公告",
        "关于支持新型冠状病毒感染的肺炎疫情防控有关税收政策的公告",
        "关于加快医用防护服注册审批和生产许可的通知",
        "关于印发新型冠状病毒肺炎防控方案(第四版)的通知",
        "关于全国性行业协会商会进一步做好新型冠状病毒肺炎防控工作的指导意见",
        "关于疫情防控期间严厉打击口罩等防控物资生产领域价格违法行为的紧急通知",
        "关于做好新型冠状病毒感染的肺炎疫情防控期间人力资源市场管理有关工作的通知",
        "关于进一步做好春节后农民工返城",
        "关于切实做好新型冠状病毒感染肺炎疫情防控期间技能人才评价有关工作的通知",
        "关于做好新型冠状病毒感染肺炎疫情防控期间学生资助工作的通知",
        "关于切实做好疫情防控期间进一步便利企业申领进出口许可证件有关工作的通知",
        "关于组织做好商贸企业复工营业工作的通知",
        "关于应对新型冠状病毒感染肺炎疫情 支持鼓励劳动者参与线上职业技能培训的通知",
        "关于做好疫情防控期间有关就业工作的通知",
        "关于在疫情防控期间做好普通高等学校在线教学组织与管理工作的指导意见",
        "关于严厉打击制售假劣药品医疗器械违法行为 切实保障新型冠状病毒感染肺炎疫情防控药品医疗器械安全的通知",
        "关于加强信息化支撑新型冠状病毒感染的肺炎疫情防控工作的通知",
        "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第五版)的通知",
        "关于印发新型冠状病毒感染的肺炎防控中居家隔离医学观察感染防控指引(试行)的通知",
        "关于暂停部分内地往来香港口岸人员通行的公告",
        "关于维护畜牧业正常产销秩序保障肉蛋奶市场供应的紧急通知",
        "关于在新型冠状病毒感染肺炎疫情防控期间实施好质量认证相关工作的通知",
        "关于做好疫情防控期间煤炭供应保障有关工作的通知",
        "关于公布失业保险金网上申领平台的通知",
        "关于加强重点地区重点医院发热门诊管理及医疗机构内感染防控工作的通知",
        "关于加强疫情期间医用防护用品管理工作的通知",
        "关于部分消毒剂在新型冠状病毒感染的肺炎疫情防控期间紧急上市的通知",
        "关于做好新型冠状病毒感染的肺炎疫情防控期间烈士祭扫工作的通知",
        "关于大力推广居家科学健身方法的通知",
        "关于切实做好春节后煤矿复工复产工作有关事项的通知",
        "关于印发《殡葬服务机构新型冠状病毒感染肺炎患者遗体处置及疫情防控工作指引(试行)》的通知",
        "关于新型冠状病毒感染肺炎疫情防控期间做好市场主体登记注册工作的通知",
        "关于疫情防控期间进一步便利技术进出口有关工作的通知",
        "关于支持金融强化服务做好新型冠状病毒感染肺炎疫情防控工作的通知",
        "关于统筹做好春节后错峰返程疫情防控和交通运输保障工作的通知",
        "关于做好新型冠状病毒感染的肺炎疫情医疗污水和城镇污水监管工作的通知",
        "关于优化医疗保障经办服务 推动新型冠状病毒感染的肺炎疫情防控工作的通知",
        "关于新型冠状病毒感染肺炎疫情防控期间查处哄抬价格违法行为的指导意见",
        "关于切实保障疫情防控应急物资运输车辆顺畅通行的紧急通知",
        "应对疫情工作领导小组办公室关于有关事项的紧急通知",
        "关于做好新型冠状病毒感染的肺炎疫情防控中医疗机构辐射安全监管服务保障工作的通知",
        "关于进一步强化金融支持防控新型冠状病毒感染肺炎疫情的通知",
        "关于防控新型冠状病毒感染的肺炎疫情进口物资不实施对美加征关税措施的通知",
        "关于防控新型冠状病毒感染的肺炎疫情进口物资免税政策的公告",
        "关于印发新型冠状病毒感染的肺炎患者遗体处置工作指引(试行)的通知",
        "关于做好新型冠状病毒感染肺炎疫情防控和脱贫攻坚有关工作的通知",
        "关于新型冠状病毒感染肺炎疫情防控期间全面加强专利商标服务窗口业务管理的通知",
        "关于切实做好殡葬服务、婚姻登记等服务机构新型冠状病毒感染肺炎疫情防控工作的紧急通知",
        "关于坚决维护防疫用品市场价格秩序的公告",
        "关于切实做好疫情防控电力保障服务和当前电力安全生产工作的通知",
        "关于进一步做好新型冠状病毒感染的肺炎疫情防控工作的通知",
        "关于优化纳税缴费服务配合做好新型冠状病毒感染肺炎疫情防控工作的通知",
        "新型冠状病毒感染的肺炎疫情联防联控工作通知",
        "关于印发新型冠状病毒感染不同风险人群防护指南和预防新型冠状病毒感染的肺炎口罩使用指南的通知",
        "关于进一步动员城乡社区组织开展新型冠状病毒感染的肺炎疫情防控工作的紧急通知",
        "关于确保\"菜篮子\"产品和农业生产资料正常流通秩序的紧急通知",
        "关于切实做好新型冠状病毒感染的肺炎疫情防控期间事业单位人事管理工作有关问题的通知",
        "关于新型冠状病毒感染肺炎疫情防控有关经费保障政策的通知",
        "关于做好新型冠状病毒感染的肺炎疫情防控物资和人员应急运输优先保障工作的通知",
        "关于统筹做好疫情防控和交通运输保障工作的紧急通知",
        "关于做好应对2020年春节假期后就诊高峰工作的通知",
        "关于组织做好疫情防控重点物资生产企业复工复产和调度安排工作的紧急通知",
        "关于贯彻落实国务院安委办关于做好当前安全防范工作的通知",
        "关于印发公共交通工具消毒操作技术指南的通知",
        "关于专利、商标、集成电路布图设计受疫情影响相关期限事项的公告",
        "关于延长银行间市场休市时间安排的通知",
        "关于建立外汇政策绿色通道支持新型冠状病毒感染的肺炎疫情防控工作的通知",
        "关于2020年春季学期延期开学的通知",
        "关于暂停社会艺术水平考级活动的通知",
        "关于延长2020年彩票市场春节休市时间的公告",
        "关于印发新型冠状病毒感染的肺炎病例转运工作方案(试行)的通知",
        "关于进一步加强县域新型冠状病毒感染的肺炎医疗救治工作的通知",
        "关于做好新型冠状病毒感染的肺炎疫情期间医疗机构医疗废物管理工作的通知",
        "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第四版)的通知",
        "关于印发近期防控新型冠状病毒感染的肺炎工作方案的通知",
        "关于做好老年人新型冠状病毒感染肺炎疫情防控工作的通知",
        "关于妥善处理新型冠状病毒感染的肺炎疫情防控期间劳动关系问题的通知",
        "关于延长2020年春节假期小型客车免费通行时段的通知",
        "关于加强基层医疗卫生机构新型冠状病毒感染的肺炎疫情防控工作的通知",
        "关于印发新型冠状病毒感染的肺炎疫情紧急心理危机干预指导原则的通知",
        "关于延长2020年春节假期的通知",
        "关于动员慈善力量依法有序参与新型冠状病毒感染的肺炎疫情防控工作的公告",
        "关于禁止野生动物交易的公告",
        "关于用于新型冠状病毒感染的肺炎疫情进口捐赠物资办理通关手续的公告",
        "关于疫情防控采购便利化的通知",
        "关于加强新型冠状病毒感染的肺炎疫情社区防控工作的通知",
        "关于防控新型冠状病毒感染的肺炎的公告",
        "关于严格预防通过交通工具传播新型冠状病毒感染的肺炎的通知",
        "关于免收民航机票退票费的通知",
        "关于进一步加强全力防控新型冠状病毒感染的肺炎疫情中医务工作者感人事迹宣传的通知",
        "关于做好新型冠状病毒感染的肺炎疫情医疗保障的通知",
        "关于因履行工作职责感染新型冠状病毒肺炎的医护及相关工作人员有关保障问题的通知",
        "关于做好新型冠状病毒感染的肺炎疫情防控工作的通知",
        "关于做好进出武汉交通运输工具管控全力做好疫情防控工作的紧急通知",
        "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第三版)的通知",
        "关于加强新型冠状病毒感染的肺炎重症病例医疗救治工作的通知",
        "关于印发医疗机构内新型冠状病毒感染预防与控制技术指南(第一版)的通知"
    ],
    "relations": [],
    "attrs": [
        [
            "关于做好因新冠肺炎疫情影响造成监护缺失的儿童救助保护工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/content/2020-03/15/content_5491581.htm"
        ],
        [
            "关于做好因新冠肺炎疫情影响造成监护缺失的儿童救助保护工作的通知",
            "政策发文字号",
            "民电〔2020〕19号"
        ],
        [
            "关于做好因新冠肺炎疫情影响造成监护缺失的儿童救助保护工作的通知",
            "政策发文机构",
            "民政部办公厅"
        ],
        [
            "关于做好因新冠肺炎疫情影响造成监护缺失的儿童救助保护工作的通知",
            "政策发布日期",
            "2020年2月11日"
        ],
        [
            "关于做好疫情防控建设项目用地保障工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/11/content_5477299.htm"
        ],
        [
            "关于做好疫情防控建设项目用地保障工作的通知",
            "政策发文字号",
            "自然资办函〔2020〕215号"
        ],
        [
            "关于做好疫情防控建设项目用地保障工作的通知",
            "政策发文机构",
            "自然资源部办公厅"
        ],
        [
            "关于做好疫情防控建设项目用地保障工作的通知",
            "政策发布日期",
            "2020年2月11日"
        ],
        [
            "关于做好重点城市生活物资保供工作的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-02/11/content_5477468.htm"
        ],
        [
            "关于做好重点城市生活物资保供工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于做好重点城市生活物资保供工作的通知",
            "政策发文机构",
            "商务部办公厅"
        ],
        [
            "关于做好重点城市生活物资保供工作的通知",
            "政策发布日期",
            "2020年2月11日"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关税收征收管理事项的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/11/content_5477136.htm"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关税收征收管理事项的公告",
            "政策发文字号",
            "国家税务总局公告2020年第4号"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关税收征收管理事项的公告",
            "政策发文机构",
            "税务总局"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关税收征收管理事项的公告",
            "政策发布日期",
            "2020年2月11日"
        ],
        [
            "关于印发新型冠状病毒肺炎应急救治设施设计导则(试行)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/11/content_5477301.htm"
        ],
        [
            "关于印发新型冠状病毒肺炎应急救治设施设计导则(试行)的通知",
            "政策发文字号",
            "国卫办规划函〔2020〕111号"
        ],
        [
            "关于印发新型冠状病毒肺炎应急救治设施设计导则(试行)的通知",
            "政策发文机构",
            "卫生健康委办公厅 住房城乡建设部办公厅"
        ],
        [
            "关于印发新型冠状病毒肺炎应急救治设施设计导则(试行)的通知",
            "政策发布日期",
            "2020年2月11日"
        ],
        [
            "关于加强新冠肺炎首诊隔离点医疗管理工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/11/content_5477233.htm"
        ],
        [
            "关于加强新冠肺炎首诊隔离点医疗管理工作的通知",
            "政策发文字号",
            "国卫办医函〔2020〕120号"
        ],
        [
            "关于加强新冠肺炎首诊隔离点医疗管理工作的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于加强新冠肺炎首诊隔离点医疗管理工作的通知",
            "政策发布日期",
            "2020年2月11日"
        ],
        [
            "关于做好新型冠状病毒肺炎疫情期间血液安全供应保障工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/11/content_5477191.htm"
        ],
        [
            "关于做好新型冠状病毒肺炎疫情期间血液安全供应保障工作的通知",
            "政策发文字号",
            "国卫办医函〔2020]113号"
        ],
        [
            "关于做好新型冠状病毒肺炎疫情期间血液安全供应保障工作的通知",
            "政策发文机构",
            "卫生健康委办公厅 中央军委后勤保障部卫生局"
        ],
        [
            "关于做好新型冠状病毒肺炎疫情期间血液安全供应保障工作的通知",
            "政策发布日期",
            "2020年2月11日"
        ],
        [
            "关于联合开展打击野生动物违规交易专项执法行动的通知",
            "来源",
            "http://www.moa.gov.cn/xw/bmdt/202002/t20200210_6336811.htm"
        ],
        [
            "关于联合开展打击野生动物违规交易专项执法行动的通知",
            "政策发文字号",
            "国市监稽〔2020〕28号"
        ],
        [
            "关于联合开展打击野生动物违规交易专项执法行动的通知",
            "政策发文机构",
            "市场监管总局 公安部 农业农村部 海关总署 国家林草局"
        ],
        [
            "关于联合开展打击野生动物违规交易专项执法行动的通知",
            "政策发布日期",
            "2020年2月10日"
        ],
        [
            "针对延期返校学生实施机票免费退改的通知",
            "来源",
            "http://www.caac.gov.cn/XXGK/XXGK/TZTG/202002/t20200210_200812.html"
        ],
        [
            "针对延期返校学生实施机票免费退改的通知",
            "政策发文字号",
            ""
        ],
        [
            "针对延期返校学生实施机票免费退改的通知",
            "政策发文机构",
            "民航局"
        ],
        [
            "针对延期返校学生实施机票免费退改的通知",
            "政策发布日期",
            "2020年2月10日"
        ],
        [
            "关于积极应对新冠肺炎疫情加强外资企业服务和招商引资工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-03/02/content_5485691.htm"
        ],
        [
            "关于积极应对新冠肺炎疫情加强外资企业服务和招商引资工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于积极应对新冠肺炎疫情加强外资企业服务和招商引资工作的通知",
            "政策发文机构",
            "商务部办公厅"
        ],
        [
            "关于积极应对新冠肺炎疫情加强外资企业服务和招商引资工作的通知",
            "政策发布日期",
            "2020年2月10日"
        ],
        [
            "新冠肺炎疫情防控税收优惠政策指引",
            "来源",
            "http://www.chinatax.gov.cn/chinatax/n810219/n810744/n3428471/n3428491/c5144685/content.html"
        ],
        [
            "新冠肺炎疫情防控税收优惠政策指引",
            "政策发文字号",
            ""
        ],
        [
            "新冠肺炎疫情防控税收优惠政策指引",
            "政策发文机构",
            "税务总局"
        ],
        [
            "新冠肺炎疫情防控税收优惠政策指引",
            "政策发布日期",
            "2020年2月10日"
        ],
        [
            "关于充分发挥税收职能作用助力 打赢疫情防控阻击战若干措施的通知",
            "来源",
            "http://www.chinatax.gov.cn/chinatax/n810341/n810755/c5143587/content.html"
        ],
        [
            "关于充分发挥税收职能作用助力 打赢疫情防控阻击战若干措施的通知",
            "政策发文字号",
            "税总发〔2020〕14号"
        ],
        [
            "关于充分发挥税收职能作用助力 打赢疫情防控阻击战若干措施的通知",
            "政策发文机构",
            "税务总局"
        ],
        [
            "关于充分发挥税收职能作用助力 打赢疫情防控阻击战若干措施的通知",
            "政策发布日期",
            "2020年2月10日"
        ],
        [
            "关于应对新型冠状病毒肺炎疫情帮助中小企业复工复产共渡难关有关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/10/content_5476684.htm"
        ],
        [
            "关于应对新型冠状病毒肺炎疫情帮助中小企业复工复产共渡难关有关工作的通知",
            "政策发文字号",
            "工信明电〔2020〕14号"
        ],
        [
            "关于应对新型冠状病毒肺炎疫情帮助中小企业复工复产共渡难关有关工作的通知",
            "政策发文机构",
            "工业和信息化部"
        ],
        [
            "关于应对新型冠状病毒肺炎疫情帮助中小企业复工复产共渡难关有关工作的通知",
            "政策发布日期",
            "2020年2月10日"
        ],
        [
            "最高人民法院 最高人民检察院 公安部 司法部印发《关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》的通知",
            "来源",
            "http://www.scio.gov.cn/xwfbh/xwbfbh/wqfbh/42311/42602/xgzc42608/Document/1674053/1674053.htm"
        ],
        [
            "最高人民法院 最高人民检察院 公安部 司法部印发《关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》的通知",
            "政策发文字号",
            "法发〔2020〕7号"
        ],
        [
            "最高人民法院 最高人民检察院 公安部 司法部印发《关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》的通知",
            "政策发文机构",
            "公安部 司法部 最高人民法院 最高人民检察院"
        ],
        [
            "最高人民法院 最高人民检察院 公安部 司法部印发《关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》的通知",
            "政策发布日期",
            "2020年2月10日"
        ],
        [
            "关于发挥政府储备作用支持应对疫情紧缺物资增产增供的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/10/content_5476852.htm"
        ],
        [
            "关于发挥政府储备作用支持应对疫情紧缺物资增产增供的通知",
            "政策发文字号",
            "发改运行〔2020〕184号"
        ],
        [
            "关于发挥政府储备作用支持应对疫情紧缺物资增产增供的通知",
            "政策发文机构",
            "发展改革委 财政部 工业和信息化部"
        ],
        [
            "关于发挥政府储备作用支持应对疫情紧缺物资增产增供的通知",
            "政策发布日期",
            "2020年2月10日"
        ],
        [
            "关于全力做好春运返程高峰运输服务保障工作的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/09/content_5476433.htm"
        ],
        [
            "关于全力做好春运返程高峰运输服务保障工作的紧急通知",
            "政策发文字号",
            ""
        ],
        [
            "关于全力做好春运返程高峰运输服务保障工作的紧急通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "关于全力做好春运返程高峰运输服务保障工作的紧急通知",
            "政策发布日期",
            "2020年2月9日"
        ],
        [
            "关于疫情防控期间免收农民工返岗包车公路通行费的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/09/content_5476383.htm"
        ],
        [
            "关于疫情防控期间免收农民工返岗包车公路通行费的通知",
            "政策发文字号",
            "交公路明电〔2020〕52号"
        ],
        [
            "关于疫情防控期间免收农民工返岗包车公路通行费的通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "关于疫情防控期间免收农民工返岗包车公路通行费的通知",
            "政策发布日期",
            "2020年2月9日"
        ],
        [
            "关于贯彻落实习近平总书记重要指示精神统筹做好疫情防控加快公路水运工程复工开工建设加大交通投资力度的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/09/content_5476379.htm"
        ],
        [
            "关于贯彻落实习近平总书记重要指示精神统筹做好疫情防控加快公路水运工程复工开工建设加大交通投资力度的通知",
            "政策发文字号",
            "交公路明电〔2020〕49号"
        ],
        [
            "关于贯彻落实习近平总书记重要指示精神统筹做好疫情防控加快公路水运工程复工开工建设加大交通投资力度的通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "关于贯彻落实习近平总书记重要指示精神统筹做好疫情防控加快公路水运工程复工开工建设加大交通投资力度的通知",
            "政策发布日期",
            "2020年2月9日"
        ],
        [
            "关于印发新型冠状病毒肺炎诊疗方案(试行第五版 修正版)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/09/content_5476407.htm"
        ],
        [
            "关于印发新型冠状病毒肺炎诊疗方案(试行第五版 修正版)的通知",
            "政策发文字号",
            "国卫办医函〔2020〕117号"
        ],
        [
            "关于印发新型冠状病毒肺炎诊疗方案(试行第五版 修正版)的通知",
            "政策发文机构",
            "卫生健康委办公厅 中医药局办公室"
        ],
        [
            "关于印发新型冠状病毒肺炎诊疗方案(试行第五版 修正版)的通知",
            "政策发布日期",
            "2020年2月9日"
        ],
        [
            "关于进一步加强疫情期间医用防护服严格分级分区使用管理的通知",
            "来源",
            "http://www.nhc.gov.cn/yzygj/s7659/202002/347d014977ce4346b922dc4fb5d9e014.shtml"
        ],
        [
            "关于进一步加强疫情期间医用防护服严格分级分区使用管理的通知",
            "政策发文字号",
            "国卫办医函〔2020〕118号"
        ],
        [
            "关于进一步加强疫情期间医用防护服严格分级分区使用管理的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于进一步加强疫情期间医用防护服严格分级分区使用管理的通知",
            "政策发布日期",
            "2020年2月9日"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控期间稳定劳动关系支持企业复工复产的意见",
            "来源",
            "http://www.gov.cn/xinwen/2020-03/03/content_5486420.htm"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控期间稳定劳动关系支持企业复工复产的意见",
            "政策发文字号",
            "人社部发〔2020〕8号"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控期间稳定劳动关系支持企业复工复产的意见",
            "政策发文机构",
            "人力资源社会保障部 中华全国总工会 中国企业联合会/中国企业家协会 中华全国工商业联合会"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控期间稳定劳动关系支持企业复工复产的意见",
            "政策发布日期",
            "2020年2月8日"
        ],
        [
            "关于切实做好学校疫情防控经费保障工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/08/content_5476037.htm"
        ],
        [
            "关于切实做好学校疫情防控经费保障工作的通知",
            "政策发文字号",
            "财办教〔2020〕11号"
        ],
        [
            "关于切实做好学校疫情防控经费保障工作的通知",
            "政策发文机构",
            "财政部办公厅 教育部办公厅"
        ],
        [
            "关于切实做好学校疫情防控经费保障工作的通知",
            "政策发布日期",
            "2020年2月8日"
        ],
        [
            "关于发布新型冠状病毒(2019-nCoV)现场快速检测产品研发应急项目申报指南的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-03/02/content_5485687.htm"
        ],
        [
            "关于发布新型冠状病毒(2019-nCoV)现场快速检测产品研发应急项目申报指南的通知",
            "政策发文字号",
            "国科发资〔2020〕28号"
        ],
        [
            "关于发布新型冠状病毒(2019-nCoV)现场快速检测产品研发应急项目申报指南的通知",
            "政策发文机构",
            "科技部"
        ],
        [
            "关于发布新型冠状病毒(2019-nCoV)现场快速检测产品研发应急项目申报指南的通知",
            "政策发布日期",
            "2020年2月8日"
        ],
        [
            "关于疫情防控期间做好企业债券工作的通知",
            "来源",
            "https://www.ndrc.gov.cn/xxgk/zcfb/tz/202002/t20200208_1220174.html"
        ],
        [
            "关于疫情防控期间做好企业债券工作的通知",
            "政策发文字号",
            "发改办财金〔2020〕111号"
        ],
        [
            "关于疫情防控期间做好企业债券工作的通知",
            "政策发文机构",
            "发展改革委办公厅"
        ],
        [
            "关于疫情防控期间做好企业债券工作的通知",
            "政策发布日期",
            "2020年2月8日"
        ],
        [
            "关于积极应对疫情创新做好招投标工作保障经济平稳运行的通知",
            "来源",
            "https://www.ndrc.gov.cn/xxgk/zcfb/tz/202002/t20200208_1220179.html"
        ],
        [
            "关于积极应对疫情创新做好招投标工作保障经济平稳运行的通知",
            "政策发文字号",
            "发改电〔2020〕170号"
        ],
        [
            "关于积极应对疫情创新做好招投标工作保障经济平稳运行的通知",
            "政策发文机构",
            "发展改革委办公厅"
        ],
        [
            "关于积极应对疫情创新做好招投标工作保障经济平稳运行的通知",
            "政策发布日期",
            "2020年2月8日"
        ],
        [
            "关于疫情防控期间采取支持性两部制电价政策 降低企业用电成本的通知",
            "来源",
            "https://www.ndrc.gov.cn/xxgk/zcfb/tz/202002/t20200207_1220156.html"
        ],
        [
            "关于疫情防控期间采取支持性两部制电价政策 降低企业用电成本的通知",
            "政策发文字号",
            "发改办价格〔2020〕110号"
        ],
        [
            "关于疫情防控期间采取支持性两部制电价政策 降低企业用电成本的通知",
            "政策发文机构",
            "发展改革委办公厅"
        ],
        [
            "关于疫情防控期间采取支持性两部制电价政策 降低企业用电成本的通知",
            "政策发布日期",
            "2020年2月8日"
        ],
        [
            "关于做好新型冠状病毒肺炎疫情防控期间保障医务人员安全维护良好医疗秩序的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/08/content_5476128.htm"
        ],
        [
            "关于做好新型冠状病毒肺炎疫情防控期间保障医务人员安全维护良好医疗秩序的通知",
            "政策发文字号",
            "国卫医函〔2020〕43号"
        ],
        [
            "关于做好新型冠状病毒肺炎疫情防控期间保障医务人员安全维护良好医疗秩序的通知",
            "政策发文机构",
            "国家卫生健康委 最高人民法院 最高人民检察院 公安部"
        ],
        [
            "关于做好新型冠状病毒肺炎疫情防控期间保障医务人员安全维护良好医疗秩序的通知",
            "政策发布日期",
            "2020年2月8日"
        ],
        [
            "关于积极做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "来源",
            "http://www.tobacco.gov.cn/html/49/90052493_n.html"
        ],
        [
            "关于积极做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文字号",
            "国烟办〔2020〕32号"
        ],
        [
            "关于积极做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文机构",
            "国家烟草专卖局"
        ],
        [
            "关于积极做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于印发《养老机构新型冠状病毒感染的肺炎疫情防控指南(第二版)》的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475906.htm"
        ],
        [
            "关于印发《养老机构新型冠状病毒感染的肺炎疫情防控指南(第二版)》的通知",
            "政策发文字号",
            "民电〔2020〕18号"
        ],
        [
            "关于印发《养老机构新型冠状病毒感染的肺炎疫情防控指南(第二版)》的通知",
            "政策发文机构",
            "民政部办公厅"
        ],
        [
            "关于印发《养老机构新型冠状病毒感染的肺炎疫情防控指南(第二版)》的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于做好疫情防控期间电梯安全监管工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475820.htm"
        ],
        [
            "关于做好疫情防控期间电梯安全监管工作的通知",
            "政策发文字号",
            "监特设函〔2020〕10号"
        ],
        [
            "关于做好疫情防控期间电梯安全监管工作的通知",
            "政策发文机构",
            "市场监管总局办公厅"
        ],
        [
            "关于做好疫情防控期间电梯安全监管工作的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于依法从重从快严厉打击新型冠状病毒疫情防控期间违法行为的意见",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475818.htm"
        ],
        [
            "关于依法从重从快严厉打击新型冠状病毒疫情防控期间违法行为的意见",
            "政策发文字号",
            "国市监法〔2020〕27号"
        ],
        [
            "关于依法从重从快严厉打击新型冠状病毒疫情防控期间违法行为的意见",
            "政策发文机构",
            "市场监管总局"
        ],
        [
            "关于依法从重从快严厉打击新型冠状病毒疫情防控期间违法行为的意见",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于切实做好新型冠状病毒感染的肺炎疫情防控期间高校毕业生\"三支一扶\"计划有关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/06/content_5490218.htm"
        ],
        [
            "关于切实做好新型冠状病毒感染的肺炎疫情防控期间高校毕业生\"三支一扶\"计划有关工作的通知",
            "政策发文字号",
            "人社厅明电〔2020〕9号"
        ],
        [
            "关于切实做好新型冠状病毒感染的肺炎疫情防控期间高校毕业生\"三支一扶\"计划有关工作的通知",
            "政策发文机构",
            "人力资源社会保障部办公厅"
        ],
        [
            "关于切实做好新型冠状病毒感染的肺炎疫情防控期间高校毕业生\"三支一扶\"计划有关工作的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于暂退部分旅游服务质量保证金支持旅行社应对经营困难的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475676.htm"
        ],
        [
            "关于暂退部分旅游服务质量保证金支持旅行社应对经营困难的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于暂退部分旅游服务质量保证金支持旅行社应对经营困难的通知",
            "政策发文机构",
            "文化和旅游部办公厅"
        ],
        [
            "关于暂退部分旅游服务质量保证金支持旅行社应对经营困难的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于做好疫情防控期间生活物资对接调运保供有关工作的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-02/08/content_5476086.htm"
        ],
        [
            "关于做好疫情防控期间生活物资对接调运保供有关工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于做好疫情防控期间生活物资对接调运保供有关工作的通知",
            "政策发文机构",
            "商务部办公厅"
        ],
        [
            "关于做好疫情防控期间生活物资对接调运保供有关工作的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "零售、餐饮企业在新型冠状病毒流行期间经营服务防控指南",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475725.htm"
        ],
        [
            "零售、餐饮企业在新型冠状病毒流行期间经营服务防控指南",
            "政策发文字号",
            ""
        ],
        [
            "零售、餐饮企业在新型冠状病毒流行期间经营服务防控指南",
            "政策发文机构",
            "商务部办公厅 卫生健康委办公厅"
        ],
        [
            "零售、餐饮企业在新型冠状病毒流行期间经营服务防控指南",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于做好生活服务企业新型冠状病毒感染肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475721.htm"
        ],
        [
            "关于做好生活服务企业新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于做好生活服务企业新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发文机构",
            "商务部办公厅 卫生健康委办公厅"
        ],
        [
            "关于做好生活服务企业新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于保障流通企业防护用品需要 做好市场保供工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475683.htm"
        ],
        [
            "关于保障流通企业防护用品需要 做好市场保供工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于保障流通企业防护用品需要 做好市场保供工作的通知",
            "政策发文机构",
            "商务部办公厅 发展改革委办公厅"
        ],
        [
            "关于保障流通企业防护用品需要 做好市场保供工作的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于打赢疫情防控阻击战强化疫情防控重点保障企业资金支持的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475962.htm"
        ],
        [
            "关于打赢疫情防控阻击战强化疫情防控重点保障企业资金支持的紧急通知",
            "政策发文字号",
            "财金〔2020〕5号"
        ],
        [
            "关于打赢疫情防控阻击战强化疫情防控重点保障企业资金支持的紧急通知",
            "政策发文机构",
            "财政部 发展改革委 工业和信息化部 人民银行 审计署"
        ],
        [
            "关于打赢疫情防控阻击战强化疫情防控重点保障企业资金支持的紧急通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于疫情防控期间开展政府采购活动有关事项的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475799.htm"
        ],
        [
            "关于疫情防控期间开展政府采购活动有关事项的通知",
            "政策发文字号",
            "财办库〔2020〕29号"
        ],
        [
            "关于疫情防控期间开展政府采购活动有关事项的通知",
            "政策发文机构",
            "财政部办公厅"
        ],
        [
            "关于疫情防控期间开展政府采购活动有关事项的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于做好疫情防控期间彩票发行销售工作有关事宜的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475790.htm"
        ],
        [
            "关于做好疫情防控期间彩票发行销售工作有关事宜的通知",
            "政策发文字号",
            "财综〔2020〕2号"
        ],
        [
            "关于做好疫情防控期间彩票发行销售工作有关事宜的通知",
            "政策发文机构",
            "财政部"
        ],
        [
            "关于做好疫情防控期间彩票发行销售工作有关事宜的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于疫情防控期间切实做好会计服务工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475784.htm"
        ],
        [
            "关于疫情防控期间切实做好会计服务工作的通知",
            "政策发文字号",
            "财会〔2020〕2号"
        ],
        [
            "关于疫情防控期间切实做好会计服务工作的通知",
            "政策发文机构",
            "财政部"
        ],
        [
            "关于疫情防控期间切实做好会计服务工作的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于新型冠状病毒感染的肺炎疫情防控期间免征部分行政事业性收费和政府性基金的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475536.htm"
        ],
        [
            "关于新型冠状病毒感染的肺炎疫情防控期间免征部分行政事业性收费和政府性基金的公告",
            "政策发文字号",
            "财政部发展改革委公告2020年第11号"
        ],
        [
            "关于新型冠状病毒感染的肺炎疫情防控期间免征部分行政事业性收费和政府性基金的公告",
            "政策发文机构",
            "财政部 发展改革委"
        ],
        [
            "关于新型冠状病毒感染的肺炎疫情防控期间免征部分行政事业性收费和政府性基金的公告",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关个人所得税政策的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475535.htm"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关个人所得税政策的公告",
            "政策发文字号",
            "财政部税务总局公告2020年第10号"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关个人所得税政策的公告",
            "政策发文机构",
            "财政部 税务总局"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关个人所得税政策的公告",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关捐赠税收政策的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475532.htm"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关捐赠税收政策的公告",
            "政策发文字号",
            "财政部税务总局公告2020年第9号"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关捐赠税收政策的公告",
            "政策发文机构",
            "财政部 税务总局"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关捐赠税收政策的公告",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关税收政策的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475528.htm"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关税收政策的公告",
            "政策发文字号",
            "财政部税务总局公告2020年第8号"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关税收政策的公告",
            "政策发文机构",
            "财政部 税务总局"
        ],
        [
            "关于支持新型冠状病毒感染的肺炎疫情防控有关税收政策的公告",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于加快医用防护服注册审批和生产许可的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-03/02/content_5485704.htm"
        ],
        [
            "关于加快医用防护服注册审批和生产许可的通知",
            "政策发文字号",
            "药监综械管函〔2020〕71号"
        ],
        [
            "关于加快医用防护服注册审批和生产许可的通知",
            "政策发文机构",
            "药监局综合司"
        ],
        [
            "关于加快医用防护服注册审批和生产许可的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于印发新型冠状病毒肺炎防控方案(第四版)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/07/content_5475813.htm"
        ],
        [
            "关于印发新型冠状病毒肺炎防控方案(第四版)的通知",
            "政策发文字号",
            "国卫办疾控函〔2020〕109号"
        ],
        [
            "关于印发新型冠状病毒肺炎防控方案(第四版)的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于印发新型冠状病毒肺炎防控方案(第四版)的通知",
            "政策发布日期",
            "2020年2月7日"
        ],
        [
            "关于全国性行业协会商会进一步做好新型冠状病毒肺炎防控工作的指导意见",
            "来源",
            "http://www.gov.cn/xinwen/2020-02/06/content_5475183.htm"
        ],
        [
            "关于全国性行业协会商会进一步做好新型冠状病毒肺炎防控工作的指导意见",
            "政策发文字号",
            ""
        ],
        [
            "关于全国性行业协会商会进一步做好新型冠状病毒肺炎防控工作的指导意见",
            "政策发文机构",
            "民政部社会组织管理局"
        ],
        [
            "关于全国性行业协会商会进一步做好新型冠状病毒肺炎防控工作的指导意见",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于疫情防控期间严厉打击口罩等防控物资生产领域价格违法行为的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/06/content_5475223.htm"
        ],
        [
            "关于疫情防控期间严厉打击口罩等防控物资生产领域价格违法行为的紧急通知",
            "政策发文字号",
            "国市监竞争〔2020〕24号"
        ],
        [
            "关于疫情防控期间严厉打击口罩等防控物资生产领域价格违法行为的紧急通知",
            "政策发文机构",
            "市场监管总局"
        ],
        [
            "关于疫情防控期间严厉打击口罩等防控物资生产领域价格违法行为的紧急通知",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控期间人力资源市场管理有关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/06/content_5475381.htm"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控期间人力资源市场管理有关工作的通知",
            "政策发文字号",
            "人社厅明电〔2020〕8号"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控期间人力资源市场管理有关工作的通知",
            "政策发文机构",
            "人力资源社会保障部办公厅"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控期间人力资源市场管理有关工作的通知",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于进一步做好春节后农民工返城",
            "来源",
            "http://www.gov.cn/xinwen/2020-02/07/content_5490211.htm"
        ],
        [
            "关于进一步做好春节后农民工返城",
            "政策发文字号",
            "国农工办发〔2020〕1号"
        ],
        [
            "关于进一步做好春节后农民工返城",
            "政策发文机构",
            "农民工工作司"
        ],
        [
            "关于进一步做好春节后农民工返城",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于切实做好新型冠状病毒感染肺炎疫情防控期间技能人才评价有关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/11/content_5477454.htm"
        ],
        [
            "关于切实做好新型冠状病毒感染肺炎疫情防控期间技能人才评价有关工作的通知",
            "政策发文字号",
            "人社厅函〔2020〕22号"
        ],
        [
            "关于切实做好新型冠状病毒感染肺炎疫情防控期间技能人才评价有关工作的通知",
            "政策发文机构",
            "职业能力建设司"
        ],
        [
            "关于切实做好新型冠状病毒感染肺炎疫情防控期间技能人才评价有关工作的通知",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控期间学生资助工作的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-02/10/content_5477005.htm"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控期间学生资助工作的通知",
            "政策发文字号",
            "教财司函〔2020〕30号"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控期间学生资助工作的通知",
            "政策发文机构",
            "教育部财务司 财政部科教和文化司"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控期间学生资助工作的通知",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于切实做好疫情防控期间进一步便利企业申领进出口许可证件有关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/06/content_5475372.htm"
        ],
        [
            "关于切实做好疫情防控期间进一步便利企业申领进出口许可证件有关工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于切实做好疫情防控期间进一步便利企业申领进出口许可证件有关工作的通知",
            "政策发文机构",
            "商务部办公厅"
        ],
        [
            "关于切实做好疫情防控期间进一步便利企业申领进出口许可证件有关工作的通知",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于组织做好商贸企业复工营业工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/06/content_5475370.htm"
        ],
        [
            "关于组织做好商贸企业复工营业工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于组织做好商贸企业复工营业工作的通知",
            "政策发文机构",
            "商务部办公厅"
        ],
        [
            "关于组织做好商贸企业复工营业工作的通知",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于应对新型冠状病毒感染肺炎疫情 支持鼓励劳动者参与线上职业技能培训的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/06/content_5475392.htm"
        ],
        [
            "关于应对新型冠状病毒感染肺炎疫情 支持鼓励劳动者参与线上职业技能培训的通知",
            "政策发文字号",
            "发改办就业〔2020〕100号"
        ],
        [
            "关于应对新型冠状病毒感染肺炎疫情 支持鼓励劳动者参与线上职业技能培训的通知",
            "政策发文机构",
            "发展改革委办公厅 人力资源社会保障部办公厅 工业和信息化部办公厅 全国总工会办公厅"
        ],
        [
            "关于应对新型冠状病毒感染肺炎疫情 支持鼓励劳动者参与线上职业技能培训的通知",
            "政策发布日期",
            "2020年2月6日"
        ],
        [
            "关于做好疫情防控期间有关就业工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/06/content_5475179.htm"
        ],
        [
            "关于做好疫情防控期间有关就业工作的通知",
            "政策发文字号",
            "人社部明电〔2020〕2号"
        ],
        [
            "关于做好疫情防控期间有关就业工作的通知",
            "政策发文机构",
            "人力资源社会保障部 教育部 财政部 交通运输部 国家卫生健康委"
        ],
        [
            "关于做好疫情防控期间有关就业工作的通知",
            "政策发布日期",
            "2020年2月5日"
        ],
        [
            "关于在疫情防控期间做好普通高等学校在线教学组织与管理工作的指导意见",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/05/content_5474733.htm"
        ],
        [
            "关于在疫情防控期间做好普通高等学校在线教学组织与管理工作的指导意见",
            "政策发文字号",
            "教高厅〔2020〕2号"
        ],
        [
            "关于在疫情防控期间做好普通高等学校在线教学组织与管理工作的指导意见",
            "政策发文机构",
            "教育部应对新型冠状病毒感染肺炎疫情工作领导小组办公室"
        ],
        [
            "关于在疫情防控期间做好普通高等学校在线教学组织与管理工作的指导意见",
            "政策发布日期",
            "2020年2月5日"
        ],
        [
            "关于严厉打击制售假劣药品医疗器械违法行为 切实保障新型冠状病毒感染肺炎疫情防控药品医疗器械安全的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/05/content_5474727.htm"
        ],
        [
            "关于严厉打击制售假劣药品医疗器械违法行为 切实保障新型冠状病毒感染肺炎疫情防控药品医疗器械安全的通知",
            "政策发文字号",
            "国药监法〔2020〕3号"
        ],
        [
            "关于严厉打击制售假劣药品医疗器械违法行为 切实保障新型冠状病毒感染肺炎疫情防控药品医疗器械安全的通知",
            "政策发文机构",
            "药监局"
        ],
        [
            "关于严厉打击制售假劣药品医疗器械违法行为 切实保障新型冠状病毒感染肺炎疫情防控药品医疗器械安全的通知",
            "政策发布日期",
            "2020年2月5日"
        ],
        [
            "关于加强信息化支撑新型冠状病毒感染的肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/05/content_5474692.htm"
        ],
        [
            "关于加强信息化支撑新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文字号",
            "国卫办规划〔2020〕100号"
        ],
        [
            "关于加强信息化支撑新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于加强信息化支撑新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年2月5日"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第五版)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/05/content_5474791.htm"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第五版)的通知",
            "政策发文字号",
            "国卫办医函〔2020〕103号"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第五版)的通知",
            "政策发文机构",
            "卫生健康委办公厅 中医药局办公室"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第五版)的通知",
            "政策发布日期",
            "2020年2月5日"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎防控中居家隔离医学观察感染防控指引(试行)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/05/content_5474688.htm"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎防控中居家隔离医学观察感染防控指引(试行)的通知",
            "政策发文字号",
            "国卫办医函〔2020〕106号"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎防控中居家隔离医学观察感染防控指引(试行)的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎防控中居家隔离医学观察感染防控指引(试行)的通知",
            "政策发布日期",
            "2020年2月5日"
        ],
        [
            "关于暂停部分内地往来香港口岸人员通行的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/04/content_5474568.htm"
        ],
        [
            "关于暂停部分内地往来香港口岸人员通行的公告",
            "政策发文字号",
            ""
        ],
        [
            "关于暂停部分内地往来香港口岸人员通行的公告",
            "政策发文机构",
            "移民局"
        ],
        [
            "关于暂停部分内地往来香港口岸人员通行的公告",
            "政策发布日期",
            "2020年2月4日"
        ],
        [
            "关于维护畜牧业正常产销秩序保障肉蛋奶市场供应的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/04/content_5474554.htm"
        ],
        [
            "关于维护畜牧业正常产销秩序保障肉蛋奶市场供应的紧急通知",
            "政策发文字号",
            ""
        ],
        [
            "关于维护畜牧业正常产销秩序保障肉蛋奶市场供应的紧急通知",
            "政策发文机构",
            "农业农村部办公厅"
        ],
        [
            "关于维护畜牧业正常产销秩序保障肉蛋奶市场供应的紧急通知",
            "政策发布日期",
            "2020年2月4日"
        ],
        [
            "关于在新型冠状病毒感染肺炎疫情防控期间实施好质量认证相关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/04/content_5474547.htm"
        ],
        [
            "关于在新型冠状病毒感染肺炎疫情防控期间实施好质量认证相关工作的通知",
            "政策发文字号",
            "市监认证〔2020〕9号"
        ],
        [
            "关于在新型冠状病毒感染肺炎疫情防控期间实施好质量认证相关工作的通知",
            "政策发文机构",
            "市场监管总局办公厅"
        ],
        [
            "关于在新型冠状病毒感染肺炎疫情防控期间实施好质量认证相关工作的通知",
            "政策发布日期",
            "2020年2月4日"
        ],
        [
            "关于做好疫情防控期间煤炭供应保障有关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/04/content_5474546.htm"
        ],
        [
            "关于做好疫情防控期间煤炭供应保障有关工作的通知",
            "政策发文字号",
            "国能综通煤炭〔2020〕7号"
        ],
        [
            "关于做好疫情防控期间煤炭供应保障有关工作的通知",
            "政策发文机构",
            "能源局综合司"
        ],
        [
            "关于做好疫情防控期间煤炭供应保障有关工作的通知",
            "政策发布日期",
            "2020年2月4日"
        ],
        [
            "关于公布失业保险金网上申领平台的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/04/content_5474595.htm"
        ],
        [
            "关于公布失业保险金网上申领平台的通知",
            "政策发文字号",
            "人社厅发〔2020〕9号"
        ],
        [
            "关于公布失业保险金网上申领平台的通知",
            "政策发文机构",
            "人力资源社会保障部办公厅"
        ],
        [
            "关于公布失业保险金网上申领平台的通知",
            "政策发布日期",
            "2020年2月4日"
        ],
        [
            "关于加强重点地区重点医院发热门诊管理及医疗机构内感染防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/04/content_5474597.htm"
        ],
        [
            "关于加强重点地区重点医院发热门诊管理及医疗机构内感染防控工作的通知",
            "政策发文字号",
            "国卫办医函〔2020〕102号"
        ],
        [
            "关于加强重点地区重点医院发热门诊管理及医疗机构内感染防控工作的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于加强重点地区重点医院发热门诊管理及医疗机构内感染防控工作的通知",
            "政策发布日期",
            "2020年2月4日"
        ],
        [
            "关于加强疫情期间医用防护用品管理工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/04/content_5474521.htm"
        ],
        [
            "关于加强疫情期间医用防护用品管理工作的通知",
            "政策发文字号",
            "国卫办医函〔2020〕98号"
        ],
        [
            "关于加强疫情期间医用防护用品管理工作的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于加强疫情期间医用防护用品管理工作的通知",
            "政策发布日期",
            "2020年2月4日"
        ],
        [
            "关于部分消毒剂在新型冠状病毒感染的肺炎疫情防控期间紧急上市的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/04/content_5474520.htm"
        ],
        [
            "关于部分消毒剂在新型冠状病毒感染的肺炎疫情防控期间紧急上市的通知",
            "政策发文字号",
            "国卫办监督函〔2020〕99号"
        ],
        [
            "关于部分消毒剂在新型冠状病毒感染的肺炎疫情防控期间紧急上市的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于部分消毒剂在新型冠状病毒感染的肺炎疫情防控期间紧急上市的通知",
            "政策发布日期",
            "2020年2月4日"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控期间烈士祭扫工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/03/content_5474279.htm"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控期间烈士祭扫工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控期间烈士祭扫工作的通知",
            "政策发文机构",
            "退役军人部办公厅"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控期间烈士祭扫工作的通知",
            "政策发布日期",
            "2020年2月3日"
        ],
        [
            "关于大力推广居家科学健身方法的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/03/content_5474274.htm"
        ],
        [
            "关于大力推广居家科学健身方法的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于大力推广居家科学健身方法的通知",
            "政策发文机构",
            "体育总局办公厅"
        ],
        [
            "关于大力推广居家科学健身方法的通知",
            "政策发布日期",
            "2020年2月3日"
        ],
        [
            "关于切实做好春节后煤矿复工复产工作有关事项的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/03/content_5474196.htm"
        ],
        [
            "关于切实做好春节后煤矿复工复产工作有关事项的通知",
            "政策发文字号",
            "煤安监行管〔2020〕5号"
        ],
        [
            "关于切实做好春节后煤矿复工复产工作有关事项的通知",
            "政策发文机构",
            "煤矿安监局"
        ],
        [
            "关于切实做好春节后煤矿复工复产工作有关事项的通知",
            "政策发布日期",
            "2020年2月3日"
        ],
        [
            "关于印发《殡葬服务机构新型冠状病毒感染肺炎患者遗体处置及疫情防控工作指引(试行)》的通知",
            "来源",
            "http://www.mca.gov.cn/article/xw/tzgg/202002/20200200023925.shtml"
        ],
        [
            "关于印发《殡葬服务机构新型冠状病毒感染肺炎患者遗体处置及疫情防控工作指引(试行)》的通知",
            "政策发文字号",
            "民办发〔2020〕2号"
        ],
        [
            "关于印发《殡葬服务机构新型冠状病毒感染肺炎患者遗体处置及疫情防控工作指引(试行)》的通知",
            "政策发文机构",
            "民政部办公厅"
        ],
        [
            "关于印发《殡葬服务机构新型冠状病毒感染肺炎患者遗体处置及疫情防控工作指引(试行)》的通知",
            "政策发布日期",
            "2020年2月3日"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间做好市场主体登记注册工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/03/content_5474268.htm"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间做好市场主体登记注册工作的通知",
            "政策发文字号",
            "市监注〔2020〕8号"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间做好市场主体登记注册工作的通知",
            "政策发文机构",
            "市场监管总局办公厅"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间做好市场主体登记注册工作的通知",
            "政策发布日期",
            "2020年2月3日"
        ],
        [
            "关于疫情防控期间进一步便利技术进出口有关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/03/content_5474331.htm"
        ],
        [
            "关于疫情防控期间进一步便利技术进出口有关工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于疫情防控期间进一步便利技术进出口有关工作的通知",
            "政策发文机构",
            "商务部办公厅"
        ],
        [
            "关于疫情防控期间进一步便利技术进出口有关工作的通知",
            "政策发布日期",
            "2020年2月3日"
        ],
        [
            "关于支持金融强化服务做好新型冠状病毒感染肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/03/content_5474105.htm"
        ],
        [
            "关于支持金融强化服务做好新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发文字号",
            "财金〔2020〕3号"
        ],
        [
            "关于支持金融强化服务做好新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发文机构",
            "财政部"
        ],
        [
            "关于支持金融强化服务做好新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年2月3日"
        ],
        [
            "关于统筹做好春节后错峰返程疫情防控和交通运输保障工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/03/content_5474330.htm"
        ],
        [
            "关于统筹做好春节后错峰返程疫情防控和交通运输保障工作的通知",
            "政策发文字号",
            "交运明电〔2020〕44号"
        ],
        [
            "关于统筹做好春节后错峰返程疫情防控和交通运输保障工作的通知",
            "政策发文机构",
            " 交通运输部 发展改革委 卫生健康委 铁路局 民航局 邮政局 国家铁路集团"
        ],
        [
            "关于统筹做好春节后错峰返程疫情防控和交通运输保障工作的通知",
            "政策发布日期",
            "2020年2月3日"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情医疗污水和城镇污水监管工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/02/content_5473898.htm"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情医疗污水和城镇污水监管工作的通知",
            "政策发文字号",
            "环办水体函〔2020〕52号"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情医疗污水和城镇污水监管工作的通知",
            "政策发文机构",
            "生态环境部办公厅"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情医疗污水和城镇污水监管工作的通知",
            "政策发布日期",
            "2020年2月2日"
        ],
        [
            "关于优化医疗保障经办服务 推动新型冠状病毒感染的肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-02/04/content_5474456.htm"
        ],
        [
            "关于优化医疗保障经办服务 推动新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于优化医疗保障经办服务 推动新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文机构",
            "国家医疗保障局办公室"
        ],
        [
            "关于优化医疗保障经办服务 推动新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年2月2日"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间查处哄抬价格违法行为的指导意见",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/02/content_5473889.htm"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间查处哄抬价格违法行为的指导意见",
            "政策发文字号",
            "国市监竞争〔2020〕21号"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间查处哄抬价格违法行为的指导意见",
            "政策发文机构",
            "市场监管总局"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间查处哄抬价格违法行为的指导意见",
            "政策发布日期",
            "2020年2月2日"
        ],
        [
            "关于切实保障疫情防控应急物资运输车辆顺畅通行的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/02/content_5473801.htm"
        ],
        [
            "关于切实保障疫情防控应急物资运输车辆顺畅通行的紧急通知",
            "政策发文字号",
            "交运明电〔2020〕37号"
        ],
        [
            "关于切实保障疫情防控应急物资运输车辆顺畅通行的紧急通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "关于切实保障疫情防控应急物资运输车辆顺畅通行的紧急通知",
            "政策发布日期",
            "2020年2月2日"
        ],
        [
            "应对疫情工作领导小组办公室关于有关事项的紧急通知",
            "来源",
            "http://www.chinacoal-safety.gov.cn/zfxxgk/fdzdgknr/tzgg/202002/t20200201_346970.shtml"
        ],
        [
            "应对疫情工作领导小组办公室关于有关事项的紧急通知",
            "政策发文字号",
            "煤安监司函办〔2020〕12号"
        ],
        [
            "应对疫情工作领导小组办公室关于有关事项的紧急通知",
            "政策发文机构",
            "煤矿安监局应对疫情工作领导小组办公室"
        ],
        [
            "应对疫情工作领导小组办公室关于有关事项的紧急通知",
            "政策发布日期",
            "2020年2月1日"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控中医疗机构辐射安全监管服务保障工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/01/content_5473757.htm"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控中医疗机构辐射安全监管服务保障工作的通知",
            "政策发文字号",
            "环办辐射函〔2020〕51号"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控中医疗机构辐射安全监管服务保障工作的通知",
            "政策发文机构",
            "生态环境部办公厅"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控中医疗机构辐射安全监管服务保障工作的通知",
            "政策发布日期",
            "2020年2月1日"
        ],
        [
            "关于进一步强化金融支持防控新型冠状病毒感染肺炎疫情的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/01/content_5473639.htm"
        ],
        [
            "关于进一步强化金融支持防控新型冠状病毒感染肺炎疫情的通知",
            "政策发文字号",
            "发〔2020〕29号"
        ],
        [
            "关于进一步强化金融支持防控新型冠状病毒感染肺炎疫情的通知",
            "政策发文机构",
            "中国人民银行 财政部 银保监会 证监会 国家外汇管理局"
        ],
        [
            "关于进一步强化金融支持防控新型冠状病毒感染肺炎疫情的通知",
            "政策发布日期",
            "2020年2月1日"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎疫情进口物资不实施对美加征关税措施的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/01/content_5473754.htm"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎疫情进口物资不实施对美加征关税措施的通知",
            "政策发文字号",
            "税委会〔2020〕6号"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎疫情进口物资不实施对美加征关税措施的通知",
            "政策发文机构",
            "国务院关税税则委员会"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎疫情进口物资不实施对美加征关税措施的通知",
            "政策发布日期",
            "2020年2月1日"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎疫情进口物资免税政策的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/01/content_5473748.htm"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎疫情进口物资免税政策的公告",
            "政策发文字号",
            "财政部海关总署税务总局公告2020年第6号"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎疫情进口物资免税政策的公告",
            "政策发文机构",
            "财政部 海关总署 税务总局"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎疫情进口物资免税政策的公告",
            "政策发布日期",
            "2020年2月1日"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎患者遗体处置工作指引(试行)的通知",
            "来源",
            "http://www.mca.gov.cn/article/xw/tzgg/202002/20200200023854.shtml"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎患者遗体处置工作指引(试行)的通知",
            "政策发文字号",
            "国卫办医函〔2020〕89号"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎患者遗体处置工作指引(试行)的通知",
            "政策发文机构",
            "国家卫生健康委办公厅,民政部办公厅,公安部办公厅"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎患者遗体处置工作指引(试行)的通知",
            "政策发布日期",
            "2020年2月1日"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控和脱贫攻坚有关工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/31/content_5473405.htm"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控和脱贫攻坚有关工作的通知",
            "政策发文字号",
            "国开办发〔2020〕2号"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控和脱贫攻坚有关工作的通知",
            "政策发文机构",
            "扶贫办"
        ],
        [
            "关于做好新型冠状病毒感染肺炎疫情防控和脱贫攻坚有关工作的通知",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间全面加强专利商标服务窗口业务管理的通知",
            "来源",
            "http://www.sipo.gov.cn/gztz/1145702.htm"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间全面加强专利商标服务窗口业务管理的通知",
            "政策发文字号",
            "国知办函运字〔2020〕74号"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间全面加强专利商标服务窗口业务管理的通知",
            "政策发文机构",
            "知识产权局办公室"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控期间全面加强专利商标服务窗口业务管理的通知",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "关于切实做好殡葬服务、婚姻登记等服务机构新型冠状病毒感染肺炎疫情防控工作的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/31/content_5473320.htm"
        ],
        [
            "关于切实做好殡葬服务、婚姻登记等服务机构新型冠状病毒感染肺炎疫情防控工作的紧急通知",
            "政策发文字号",
            "民电〔2020〕14号"
        ],
        [
            "关于切实做好殡葬服务、婚姻登记等服务机构新型冠状病毒感染肺炎疫情防控工作的紧急通知",
            "政策发文机构",
            "民政部办公厅"
        ],
        [
            "关于切实做好殡葬服务、婚姻登记等服务机构新型冠状病毒感染肺炎疫情防控工作的紧急通知",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "关于坚决维护防疫用品市场价格秩序的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/31/content_5473364.htm"
        ],
        [
            "关于坚决维护防疫用品市场价格秩序的公告",
            "政策发文字号",
            "市场监管总局公告2020年第3号"
        ],
        [
            "关于坚决维护防疫用品市场价格秩序的公告",
            "政策发文机构",
            "市场监管总局"
        ],
        [
            "关于坚决维护防疫用品市场价格秩序的公告",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "关于切实做好疫情防控电力保障服务和当前电力安全生产工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-03/25/content_5495520.htm"
        ],
        [
            "关于切实做好疫情防控电力保障服务和当前电力安全生产工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于切实做好疫情防控电力保障服务和当前电力安全生产工作的通知",
            "政策发文机构",
            "能源局综合司"
        ],
        [
            "关于切实做好疫情防控电力保障服务和当前电力安全生产工作的通知",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "关于进一步做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/31/content_5473306.htm"
        ],
        [
            "关于进一步做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文字号",
            "人社部明电〔2020〕1号"
        ],
        [
            "关于进一步做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文机构",
            "人力资源社会保障部"
        ],
        [
            "关于进一步做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "关于优化纳税缴费服务配合做好新型冠状病毒感染肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/31/content_5473310.htm"
        ],
        [
            "关于优化纳税缴费服务配合做好新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发文字号",
            "税总函〔2020〕19号"
        ],
        [
            "关于优化纳税缴费服务配合做好新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发文机构",
            "税务总局"
        ],
        [
            "关于优化纳税缴费服务配合做好新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "新型冠状病毒感染的肺炎疫情联防联控工作通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/31/content_5473400.htm"
        ],
        [
            "新型冠状病毒感染的肺炎疫情联防联控工作通知",
            "政策发文字号",
            ""
        ],
        [
            "新型冠状病毒感染的肺炎疫情联防联控工作通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "新型冠状病毒感染的肺炎疫情联防联控工作通知",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "关于印发新型冠状病毒感染不同风险人群防护指南和预防新型冠状病毒感染的肺炎口罩使用指南的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-01/31/content_5473401.htm"
        ],
        [
            "关于印发新型冠状病毒感染不同风险人群防护指南和预防新型冠状病毒感染的肺炎口罩使用指南的通知",
            "政策发文字号",
            "国卫办医函〔2020〕113号"
        ],
        [
            "关于印发新型冠状病毒感染不同风险人群防护指南和预防新型冠状病毒感染的肺炎口罩使用指南的通知",
            "政策发文机构",
            "卫生健康委"
        ],
        [
            "关于印发新型冠状病毒感染不同风险人群防护指南和预防新型冠状病毒感染的肺炎口罩使用指南的通知",
            "政策发布日期",
            "2020年1月31日"
        ],
        [
            "关于进一步动员城乡社区组织开展新型冠状病毒感染的肺炎疫情防控工作的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/30/content_5473085.htm"
        ],
        [
            "关于进一步动员城乡社区组织开展新型冠状病毒感染的肺炎疫情防控工作的紧急通知",
            "政策发文字号",
            "民发〔2020〕9号"
        ],
        [
            "关于进一步动员城乡社区组织开展新型冠状病毒感染的肺炎疫情防控工作的紧急通知",
            "政策发文机构",
            "民政部 卫生健康委"
        ],
        [
            "关于进一步动员城乡社区组织开展新型冠状病毒感染的肺炎疫情防控工作的紧急通知",
            "政策发布日期",
            "2020年1月30日"
        ],
        [
            "关于确保\"菜篮子\"产品和农业生产资料正常流通秩序的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/30/content_5473192.htm"
        ],
        [
            "关于确保\"菜篮子\"产品和农业生产资料正常流通秩序的紧急通知",
            "政策发文字号",
            "农办牧〔2020〕7号"
        ],
        [
            "关于确保\"菜篮子\"产品和农业生产资料正常流通秩序的紧急通知",
            "政策发文机构",
            "农业农村部办公厅 交通运输部办公厅 公安部办公厅"
        ],
        [
            "关于确保\"菜篮子\"产品和农业生产资料正常流通秩序的紧急通知",
            "政策发布日期",
            "2020年1月30日"
        ],
        [
            "关于切实做好新型冠状病毒感染的肺炎疫情防控期间事业单位人事管理工作有关问题的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/31/content_5473309.htm"
        ],
        [
            "关于切实做好新型冠状病毒感染的肺炎疫情防控期间事业单位人事管理工作有关问题的通知",
            "政策发文字号",
            "人社厅发〔2020〕8号"
        ],
        [
            "关于切实做好新型冠状病毒感染的肺炎疫情防控期间事业单位人事管理工作有关问题的通知",
            "政策发文机构",
            "人力资源社会保障部人才管理司"
        ],
        [
            "关于切实做好新型冠状病毒感染的肺炎疫情防控期间事业单位人事管理工作有关问题的通知",
            "政策发布日期",
            "2020年1月30日"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控有关经费保障政策的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-02/13/content_5478321.htm"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控有关经费保障政策的通知",
            "政策发文字号",
            "财社〔2020〕2号"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控有关经费保障政策的通知",
            "政策发文机构",
            "财政部 卫生健康委"
        ],
        [
            "关于新型冠状病毒感染肺炎疫情防控有关经费保障政策的通知",
            "政策发布日期",
            "2020年1月30日"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控物资和人员应急运输优先保障工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/30/content_5473116.htm"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控物资和人员应急运输优先保障工作的通知",
            "政策发文字号",
            "交公路明电〔2020〕27号"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控物资和人员应急运输优先保障工作的通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控物资和人员应急运输优先保障工作的通知",
            "政策发布日期",
            "2020年1月30日"
        ],
        [
            "关于统筹做好疫情防控和交通运输保障工作的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/30/content_5473114.htm"
        ],
        [
            "关于统筹做好疫情防控和交通运输保障工作的紧急通知",
            "政策发文字号",
            "交运明电〔2020〕33号"
        ],
        [
            "关于统筹做好疫情防控和交通运输保障工作的紧急通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "关于统筹做好疫情防控和交通运输保障工作的紧急通知",
            "政策发布日期",
            "2020年1月30日"
        ],
        [
            "关于做好应对2020年春节假期后就诊高峰工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/30/content_5473066.htm"
        ],
        [
            "关于做好应对2020年春节假期后就诊高峰工作的通知",
            "政策发文字号",
            "国卫办医函〔2020〕86号"
        ],
        [
            "关于做好应对2020年春节假期后就诊高峰工作的通知",
            "政策发文机构",
            "国家卫生健康委办公厅,中医药局办公室"
        ],
        [
            "关于做好应对2020年春节假期后就诊高峰工作的通知",
            "政策发布日期",
            "2020年1月30日"
        ],
        [
            "关于组织做好疫情防控重点物资生产企业复工复产和调度安排工作的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/content/2020-01/30/content_5473087.htm"
        ],
        [
            "关于组织做好疫情防控重点物资生产企业复工复产和调度安排工作的紧急通知",
            "政策发文字号",
            "国办发明电〔2020〕1号"
        ],
        [
            "关于组织做好疫情防控重点物资生产企业复工复产和调度安排工作的紧急通知",
            "政策发文机构",
            "国务院办公厅"
        ],
        [
            "关于组织做好疫情防控重点物资生产企业复工复产和调度安排工作的紧急通知",
            "政策发布日期",
            "2020年1月30日"
        ],
        [
            "关于贯彻落实国务院安委办关于做好当前安全防范工作的通知",
            "来源",
            "http://xxgk.mot.gov.cn/jigou/aqyzljlglj/202002/t20200204_3329700.html"
        ],
        [
            "关于贯彻落实国务院安委办关于做好当前安全防范工作的通知",
            "政策发文字号",
            "交安委明电〔2020〕4号"
        ],
        [
            "关于贯彻落实国务院安委办关于做好当前安全防范工作的通知",
            "政策发文机构",
            "交通运输部安委会"
        ],
        [
            "关于贯彻落实国务院安委办关于做好当前安全防范工作的通知",
            "政策发布日期",
            "2020年1月29日"
        ],
        [
            "关于印发公共交通工具消毒操作技术指南的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-01/29/content_5472905.htm"
        ],
        [
            "关于印发公共交通工具消毒操作技术指南的通知",
            "政策发文字号",
            "肺炎机制发〔2020〕13号"
        ],
        [
            "关于印发公共交通工具消毒操作技术指南的通知",
            "政策发文机构",
            "卫生健康委"
        ],
        [
            "关于印发公共交通工具消毒操作技术指南的通知",
            "政策发布日期",
            "2020年1月29日"
        ],
        [
            "关于专利、商标、集成电路布图设计受疫情影响相关期限事项的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-03/25/content_5495260.htm"
        ],
        [
            "关于专利、商标、集成电路布图设计受疫情影响相关期限事项的公告",
            "政策发文字号",
            "第三五零号"
        ],
        [
            "关于专利、商标、集成电路布图设计受疫情影响相关期限事项的公告",
            "政策发文机构",
            "知识产权局"
        ],
        [
            "关于专利、商标、集成电路布图设计受疫情影响相关期限事项的公告",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于延长银行间市场休市时间安排的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/28/content_5472811.htm"
        ],
        [
            "关于延长银行间市场休市时间安排的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于延长银行间市场休市时间安排的通知",
            "政策发文机构",
            "中国人民银行 国家外汇管理局"
        ],
        [
            "关于延长银行间市场休市时间安排的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于建立外汇政策绿色通道支持新型冠状病毒感染的肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/28/content_5472691.htm"
        ],
        [
            "关于建立外汇政策绿色通道支持新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文字号",
            "汇综发〔2020〕2号"
        ],
        [
            "关于建立外汇政策绿色通道支持新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文机构",
            "国家外汇管理局综合司"
        ],
        [
            "关于建立外汇政策绿色通道支持新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于2020年春季学期延期开学的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/28/content_5472571.htm"
        ],
        [
            "关于2020年春季学期延期开学的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于2020年春季学期延期开学的通知",
            "政策发文机构",
            "教育部"
        ],
        [
            "关于2020年春季学期延期开学的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于暂停社会艺术水平考级活动的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/28/content_5472728.htm"
        ],
        [
            "关于暂停社会艺术水平考级活动的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于暂停社会艺术水平考级活动的通知",
            "政策发文机构",
            "文化和旅游部教育司"
        ],
        [
            "关于暂停社会艺术水平考级活动的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于延长2020年彩票市场春节休市时间的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/28/content_5472800.htm"
        ],
        [
            "关于延长2020年彩票市场春节休市时间的公告",
            "政策发文字号",
            "中华人民共和国财政部公告2020年第5号"
        ],
        [
            "关于延长2020年彩票市场春节休市时间的公告",
            "政策发文机构",
            "财政部"
        ],
        [
            "关于延长2020年彩票市场春节休市时间的公告",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎病例转运工作方案(试行)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/29/content_5472894.htm"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎病例转运工作方案(试行)的通知",
            "政策发文字号",
            "国卫办医函〔2020〕76号"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎病例转运工作方案(试行)的通知",
            "政策发文机构",
            "国家卫生健康委办公厅"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎病例转运工作方案(试行)的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于进一步加强县域新型冠状病毒感染的肺炎医疗救治工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/29/content_5472891.htm"
        ],
        [
            "关于进一步加强县域新型冠状病毒感染的肺炎医疗救治工作的通知",
            "政策发文字号",
            "国卫办医函〔2020〕83号"
        ],
        [
            "关于进一步加强县域新型冠状病毒感染的肺炎医疗救治工作的通知",
            "政策发文机构",
            "国家卫生健康委办公厅"
        ],
        [
            "关于进一步加强县域新型冠状病毒感染的肺炎医疗救治工作的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情期间医疗机构医疗废物管理工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/28/content_5472796.htm"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情期间医疗机构医疗废物管理工作的通知",
            "政策发文字号",
            "国卫办医函〔2020〕81号"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情期间医疗机构医疗废物管理工作的通知",
            "政策发文机构",
            "国家卫生健康委办公厅"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情期间医疗机构医疗废物管理工作的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第四版)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/28/content_5472673.htm"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第四版)的通知",
            "政策发文字号",
            "国卫办医函〔2020〕77号"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第四版)的通知",
            "政策发文机构",
            "国家卫生健康委办公厅 国家中医药管理局办公室"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第四版)的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于印发近期防控新型冠状病毒感染的肺炎工作方案的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-01/28/content_5472795.htm"
        ],
        [
            "关于印发近期防控新型冠状病毒感染的肺炎工作方案的通知",
            "政策发文字号",
            "肺炎机制发〔2020〕9号"
        ],
        [
            "关于印发近期防控新型冠状病毒感染的肺炎工作方案的通知",
            "政策发文机构",
            "卫生健康委"
        ],
        [
            "关于印发近期防控新型冠状病毒感染的肺炎工作方案的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于做好老年人新型冠状病毒感染肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-01/28/content_5472793.htm"
        ],
        [
            "关于做好老年人新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发文字号",
            "肺炎机制发〔2020〕11号"
        ],
        [
            "关于做好老年人新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发文机构",
            "卫生健康委"
        ],
        [
            "关于做好老年人新型冠状病毒感染肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年1月28日"
        ],
        [
            "关于妥善处理新型冠状病毒感染的肺炎疫情防控期间劳动关系问题的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/27/content_5472508.htm"
        ],
        [
            "关于妥善处理新型冠状病毒感染的肺炎疫情防控期间劳动关系问题的通知",
            "政策发文字号",
            "人社厅明〔2020〕5号"
        ],
        [
            "关于妥善处理新型冠状病毒感染的肺炎疫情防控期间劳动关系问题的通知",
            "政策发文机构",
            "人力资源社会保障部"
        ],
        [
            "关于妥善处理新型冠状病毒感染的肺炎疫情防控期间劳动关系问题的通知",
            "政策发布日期",
            "2020年1月27日"
        ],
        [
            "关于延长2020年春节假期小型客车免费通行时段的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/27/content_5472530.htm"
        ],
        [
            "关于延长2020年春节假期小型客车免费通行时段的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于延长2020年春节假期小型客车免费通行时段的通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "关于延长2020年春节假期小型客车免费通行时段的通知",
            "政策发布日期",
            "2020年1月27日"
        ],
        [
            "关于加强基层医疗卫生机构新型冠状病毒感染的肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/27/content_5472401.htm"
        ],
        [
            "关于加强基层医疗卫生机构新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文字号",
            "国国卫办基层函〔2020〕72号"
        ],
        [
            "关于加强基层医疗卫生机构新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文机构",
            "卫生健康委"
        ],
        [
            "关于加强基层医疗卫生机构新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年1月27日"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎疫情紧急心理危机干预指导原则的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-01/27/content_5472433.htm"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎疫情紧急心理危机干预指导原则的通知",
            "政策发文字号",
            "肺炎机制发〔2020〕8号"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎疫情紧急心理危机干预指导原则的通知",
            "政策发文机构",
            "应对新型冠状病毒感染的肺炎疫情联防联控工作机制"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎疫情紧急心理危机干预指导原则的通知",
            "政策发布日期",
            "2020年1月27日"
        ],
        [
            "关于延长2020年春节假期的通知",
            "来源",
            "http://www.gov.cn/zhengce/content/2020-01/27/content_5472352.htm"
        ],
        [
            "关于延长2020年春节假期的通知",
            "政策发文字号",
            "国办发明电〔2020〕1号"
        ],
        [
            "关于延长2020年春节假期的通知",
            "政策发文机构",
            "国务院办公厅"
        ],
        [
            "关于延长2020年春节假期的通知",
            "政策发布日期",
            "2020年1月27日"
        ],
        [
            "关于动员慈善力量依法有序参与新型冠状病毒感染的肺炎疫情防控工作的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/26/content_5472289.htm"
        ],
        [
            "关于动员慈善力量依法有序参与新型冠状病毒感染的肺炎疫情防控工作的公告",
            "政策发文字号",
            "民政部公告第476号"
        ],
        [
            "关于动员慈善力量依法有序参与新型冠状病毒感染的肺炎疫情防控工作的公告",
            "政策发文机构",
            "民政部"
        ],
        [
            "关于动员慈善力量依法有序参与新型冠状病毒感染的肺炎疫情防控工作的公告",
            "政策发布日期",
            "2020年1月26日"
        ],
        [
            "关于禁止野生动物交易的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/26/content_5472280.htm"
        ],
        [
            "关于禁止野生动物交易的公告",
            "政策发文字号",
            "市场监管总局公告2020年第4号"
        ],
        [
            "关于禁止野生动物交易的公告",
            "政策发文机构",
            "市场监管总局 农业农村部 林草局"
        ],
        [
            "关于禁止野生动物交易的公告",
            "政策发布日期",
            "2020年1月26日"
        ],
        [
            "关于用于新型冠状病毒感染的肺炎疫情进口捐赠物资办理通关手续的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/26/content_5472254.htm"
        ],
        [
            "关于用于新型冠状病毒感染的肺炎疫情进口捐赠物资办理通关手续的公告",
            "政策发文字号",
            "海关总署公告2020年第17号"
        ],
        [
            "关于用于新型冠状病毒感染的肺炎疫情进口捐赠物资办理通关手续的公告",
            "政策发文机构",
            "海关总署"
        ],
        [
            "关于用于新型冠状病毒感染的肺炎疫情进口捐赠物资办理通关手续的公告",
            "政策发布日期",
            "2020年1月26日"
        ],
        [
            "关于疫情防控采购便利化的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/26/content_5472325.htm"
        ],
        [
            "关于疫情防控采购便利化的通知",
            "政策发文字号",
            "财办库〔2020〕23号"
        ],
        [
            "关于疫情防控采购便利化的通知",
            "政策发文机构",
            "财政部"
        ],
        [
            "关于疫情防控采购便利化的通知",
            "政策发布日期",
            "2020年1月26日"
        ],
        [
            "关于加强新型冠状病毒感染的肺炎疫情社区防控工作的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-01/26/content_5472235.htm"
        ],
        [
            "关于加强新型冠状病毒感染的肺炎疫情社区防控工作的通知",
            "政策发文字号",
            "肺炎机制发〔2020〕5号"
        ],
        [
            "关于加强新型冠状病毒感染的肺炎疫情社区防控工作的通知",
            "政策发文机构",
            "应对新型冠状病毒感染的肺炎疫情联防联控工作机制"
        ],
        [
            "关于加强新型冠状病毒感染的肺炎疫情社区防控工作的通知",
            "政策发布日期",
            "2020年1月26日"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎的公告",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/25/content_5472185.htm"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎的公告",
            "政策发文字号",
            "海关总署国家卫生健康委员会公告2020年第15号"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎的公告",
            "政策发文机构",
            "海关总署 国家卫生健康委员会"
        ],
        [
            "关于防控新型冠状病毒感染的肺炎的公告",
            "政策发布日期",
            "2020年1月25日"
        ],
        [
            "关于严格预防通过交通工具传播新型冠状病毒感染的肺炎的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-01/25/content_5472106.htm"
        ],
        [
            "关于严格预防通过交通工具传播新型冠状病毒感染的肺炎的通知",
            "政策发文字号",
            "肺炎机制发〔2020〕2号"
        ],
        [
            "关于严格预防通过交通工具传播新型冠状病毒感染的肺炎的通知",
            "政策发文机构",
            "应对新型冠状病毒感染的肺炎疫情联防联控工作小组"
        ],
        [
            "关于严格预防通过交通工具传播新型冠状病毒感染的肺炎的通知",
            "政策发布日期",
            "2020年1月25日"
        ],
        [
            "关于免收民航机票退票费的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/24/content_5471920.htm"
        ],
        [
            "关于免收民航机票退票费的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于免收民航机票退票费的通知",
            "政策发文机构",
            "民航局"
        ],
        [
            "关于免收民航机票退票费的通知",
            "政策发布日期",
            "2020年1月24日"
        ],
        [
            "关于进一步加强全力防控新型冠状病毒感染的肺炎疫情中医务工作者感人事迹宣传的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/24/content_5472027.htm"
        ],
        [
            "关于进一步加强全力防控新型冠状病毒感染的肺炎疫情中医务工作者感人事迹宣传的通知",
            "政策发文字号",
            "国卫办宣传函〔2020〕55号"
        ],
        [
            "关于进一步加强全力防控新型冠状病毒感染的肺炎疫情中医务工作者感人事迹宣传的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于进一步加强全力防控新型冠状病毒感染的肺炎疫情中医务工作者感人事迹宣传的通知",
            "政策发布日期",
            "2020年1月24日"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情医疗保障的通知",
            "来源",
            "http://www.gov.cn/xinwen/2020-01/30/content_5473177.htm"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情医疗保障的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情医疗保障的通知",
            "政策发文机构",
            "国家医疗保障局 财政部"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情医疗保障的通知",
            "政策发布日期",
            "2020年1月23日"
        ],
        [
            "关于因履行工作职责感染新型冠状病毒肺炎的医护及相关工作人员有关保障问题的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/23/content_5471922.htm"
        ],
        [
            "关于因履行工作职责感染新型冠状病毒肺炎的医护及相关工作人员有关保障问题的通知",
            "政策发文字号",
            "人社部函〔2020〕11号"
        ],
        [
            "关于因履行工作职责感染新型冠状病毒肺炎的医护及相关工作人员有关保障问题的通知",
            "政策发文机构",
            "人力资源社会保障部 财政部 卫生健康委"
        ],
        [
            "关于因履行工作职责感染新型冠状病毒肺炎的医护及相关工作人员有关保障问题的通知",
            "政策发布日期",
            "2020年1月23日"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/23/content_5471921.htm"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文字号",
            ""
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发文机构",
            "文化和旅游部办公厅 文物局办公室"
        ],
        [
            "关于做好新型冠状病毒感染的肺炎疫情防控工作的通知",
            "政策发布日期",
            "2020年1月23日"
        ],
        [
            "关于做好进出武汉交通运输工具管控全力做好疫情防控工作的紧急通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/23/content_5471864.htm"
        ],
        [
            "关于做好进出武汉交通运输工具管控全力做好疫情防控工作的紧急通知",
            "政策发文字号",
            "交运明电〔2020〕24号"
        ],
        [
            "关于做好进出武汉交通运输工具管控全力做好疫情防控工作的紧急通知",
            "政策发文机构",
            "交通运输部"
        ],
        [
            "关于做好进出武汉交通运输工具管控全力做好疫情防控工作的紧急通知",
            "政策发布日期",
            "2020年1月23日"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第三版)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/23/content_5471832.htm"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第三版)的通知",
            "政策发文字号",
            "国卫办医函〔2020〕66号"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第三版)的通知",
            "政策发文机构",
            "卫生健康委 中医药局"
        ],
        [
            "关于印发新型冠状病毒感染的肺炎诊疗方案(试行第三版)的通知",
            "政策发布日期",
            "2020年1月23日"
        ],
        [
            "关于加强新型冠状病毒感染的肺炎重症病例医疗救治工作的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/23/content_5471831.htm"
        ],
        [
            "关于加强新型冠状病毒感染的肺炎重症病例医疗救治工作的通知",
            "政策发文字号",
            "国卫办医函〔2020〕64号"
        ],
        [
            "关于加强新型冠状病毒感染的肺炎重症病例医疗救治工作的通知",
            "政策发文机构",
            "卫生健康委"
        ],
        [
            "关于加强新型冠状病毒感染的肺炎重症病例医疗救治工作的通知",
            "政策发布日期",
            "2020年1月23日"
        ],
        [
            "关于印发医疗机构内新型冠状病毒感染预防与控制技术指南(第一版)的通知",
            "来源",
            "http://www.gov.cn/zhengce/zhengceku/2020-01/23/content_5471857.htm"
        ],
        [
            "关于印发医疗机构内新型冠状病毒感染预防与控制技术指南(第一版)的通知",
            "政策发文字号",
            "国卫办医函〔2020〕65号"
        ],
        [
            "关于印发医疗机构内新型冠状病毒感染预防与控制技术指南(第一版)的通知",
            "政策发文机构",
            "卫生健康委办公厅"
        ],
        [
            "关于印发医疗机构内新型冠状病毒感染预防与控制技术指南(第一版)的通知",
            "政策发布日期",
            "2020年1月22日"
        ]
    ]
}
var hlm = { entities:
    { '贾源': true,
        '贾代善': true,
        '贾母': true,
        '老姨奶奶': true,
        '贾敏': true,
        '贾赦': true,
        '嫣红': true,
        '翠云': true,
        '娇红': true,
        '贾迎春': true,
        '贾政': true,
        '赵姨娘': true,
        '周姨娘': true,
        '贾珠': true,
        '贾琏': true,
        '尤二姐': true,
        '秋桐': true,
        '平儿': true,
        '贾宝玉': true,
        '薛宝衩': true,
        '花袭人': true,
        '贾桂': true,
        '娄氏': true,
        '贾菌': true,
        '周财主': true,
        '周秀才': true,
        '周妈妈': true,
        '孙亲太太': true,
        '孙绍祖': true,
        '邢夫人': true,
        '刑大舅二姐': true,
        '邢德全': true,
        '张大老爷': true,
        '张大老爷之女': true,
        '邢忠': true,
        '刑秞烟': true,
        '李婶': true,
        '李婶之弟': true,
        '李纹': true,
        '甄宝玉': true,
        '李绮': true,
        '甄宝玉祖母': true,
        '甄应嘉': true,
        '甄夫人': true,
        '大姑娘': true,
        '二姑娘': true,
        '三姑娘': true,
        '袭人之母': true,
        '袭人': true,
        '周琼之子': true,
        '贾探春': true,
        '林如海之父': true,
        '林如海': true,
        '林如海之子': true,
        '昭儿': true,
        '兴儿': true,
        '隆儿': true,
        '庆儿': true,
        '赵嬷嬷': true,
        '赵天梁': true,
        '赵天栋': true,
        '王信': true,
        '王信媳妇': true,
        '鲍二': true,
        '善姐': true,
        '绣桔': true,
        '莲花儿': true,
        '秦思祺': true,
        '篆儿': true,
        '李纨': true,
        '素云': true,
        '碧月': true,
        '贾元春': true,
        '抱琴': true,
        '宋嬷嬷': true,
        '叶茗烟': true,
        '锄药': true,
        '扫红': true,
        '墨雨': true,
        '引泉': true,
        '扫花': true,
        '挑云': true,
        '伴鹤': true,
        '双瑞': true,
        '双寿': true,
        '老叶妈': true,
        '李嬷嬷': true,
        '李贵': true,
        '李嬷嬷孙子': true,
        '王荣': true,
        '张若锦': true,
        '赵亦华': true,
        '王夫人': true,
        '周瑞': true,
        '周瑞女儿': true,
        '周嫂子的儿子': true,
        '白金钏': true,
        '白玉钏': true,
        '彩云': true,
        '彩鸾': true,
        '绣鸾': true,
        '绣凤': true,
        '白老媳妇': true,
        '彩霞之母': true,
        '彩霞': true,
        '小霞': true,
        '小鹊': true,
        '小吉祥': true,
        '钱槐': true,
        '贾环': true,
        '林黛玉': true,
        '雪雁': true,
        '紫鹊': true,
        '春纤': true,
        '藕官': true,
        '赖嬷嬷': true,
        '赖大': true,
        '赖尚荣': true,
        '赖大的女儿': true,
        '王熙凤': true,
        '来旺儿': true,
        '旺儿媳妇': true,
        '来喜家的': true,
        '丰儿': true,
        '彩明': true,
        '林红玉': true,
        '林之孝': true,
        '王善保': true,
        '费婆子': true,
        '金鸳鸯': true,
        '琥珀': true,
        '鹦鹉': true,
        '珍珠': true,
        '翡翠': true,
        '玻璃': true,
        '文官': true,
        '傻大姐的娘': true,
        '傻大姐': true,
        '金彩': true,
        '鸳鸯': true,
        '多官': true,
        '晴雯': true,
        '多姑娘儿': true,
        '吴贵': true,
        '花芳官': true,
        '媚人': true,
        '麝月': true,
        '茜雪': true,
        '秋纹': true,
        '绮霞': true,
        '碧痕': true,
        '檀云': true,
        '四儿': true,
        '佳蕙': true,
        '坠儿': true,
        '紫绡': true,
        '良儿': true,
        '何春燕': true,
        '厨房中的柳家媳妇': true,
        '柳五儿': true,
        '柳二媳妇的妹子': true,
        '侍书': true,
        '翠墨': true,
        '艾官': true,
        '小蝉': true,
        '何婆': true,
        '小鸠儿': true,
        '傅试': true,
        '傅秋芳': true,
        '太祖皇帝': true,
        '先皇': true,
        '太上皇': true,
        '皇太后': true,
        '皇帝': true,
        '吴贵妃': true,
        '周贵人': true,
        '周贵人父亲': true,
        '吴天佑': true,
        '戴权': true,
        '夏守忠': true,
        '贾演': true,
        '贾代化': true,
        '焦大': true,
        '贾敷': true,
        '贾敬': true,
        '贾惜春': true,
        '史侯': true,
        '史湘云爷爷': true,
        '史鼐': true,
        '史鼎': true,
        '史鼎的夫人': true,
        '湘云母': true,
        '史湘云': true,
        '卫若兰': true,
        '翠缕': true,
        '葵官': true,
        '王公': true,
        '凤姐之祖王夫人之父': true,
        '王夫人之大兄凤姐之父': true,
        '王子腾': true,
        '王子胜': true,
        '薛姨妈': true,
        '老舅太太': true,
        '王仁': true,
        '王子腾夫人': true,
        '王子腾之女': true,
        '保宁侯之子': true,
        '王成父': true,
        '王成': true,
        '王狗儿': true,
        '刘氏': true,
        '王青儿': true,
        '王板儿': true,
        '刘姥姥': true,
        '薛公': true,
        '宝钗祖父': true,
        '薛公之孙': true,
        '薛宝琴父': true,
        '薛宝钗': true,
        '薛蟠': true,
        '同喜': true,
        '同贵': true,
        '莺儿': true,
        '文杏': true,
        '喜儿': true,
        '蕊官': true,
        '夏金桂': true,
        '宝蟾': true,
        '小舍儿': true,
        '夏奶奶': true,
        '夏三': true,
        '香菱': true,
        '臻儿': true,
        '薛宝琴母': true,
        '薛蝌': true,
        '薛宝琴': true,
        '邢岫烟': true,
        '梅翰林之子': true,
        '小螺': true,
        '荳官': true,
        '梅翰林': true,
        '贾代儒': true,
        '贾瑞之父': true,
        '贾瑞之母': true,
        '贾瑞': true,
        '贾琼之母': true,
        '贾琼': true,
        '贾四姐': true,
        '贾王扁之母': true,
        '贾王扁': true,
        '贾喜鸾': true,
        '五嫂子卜氏': true,
        '贾芸': true,
        '小丫头子': true,
        '倪二': true,
        '倪儿娘子': true,
        '倪二女儿': true,
        '卜世仁': true,
        '卜世仁娘子': true,
        '卜银姐': true,
        '周氏': true,
        '贾芹': true,
        '贾璜': true,
        '金氏': true,
        '胡氏': true,
        '金荣': true,
        '贾化': true,
        '娇杏': true,
        '贾雨村子': true,
        '应天府门子': true,
        '天子之妻': true,
        '东平郡王': true,
        '东安郡王穆莳拜': true,
        '南安郡王': true,
        '南安王太妃': true,
        '西宁郡王': true,
        '西宁郡王妃': true,
        '水溶': true,
        '北静王少妃': true,
        '北静郡王长府官': true,
        '牛清': true,
        '镇国公诰命': true,
        '镇国公诰命长男': true,
        '缮国公': true,
        '缮国公诰命': true,
        '锦乡侯': true,
        '锦乡侯诰命': true,
        '韩奇': true,
        '神武将军冯唐': true,
        '冯紫英': true,
        '张大财主': true,
        '张金哥': true,
        '长安原任守备': true,
        '李公子': true,
        '尤老娘': true,
        '尤氏': true,
        '贾珍': true,
        '佩凤': true,
        '偕鸾': true,
        '文花': true,
        '茄官': true,
        '银蝶': true,
        '炒豆儿': true,
        '贾蓉': true,
        '秦可卿': true,
        '入画': true,
        '彩屏': true,
        '彩儿': true,
        '瑞珠': true,
        '宝珠': true,
        '秦业': true,
        '秦钟': true,
        '寿儿': true,
        '柳湘莲': true,
        '杏奴': true,
        '贾琮': true,
        '贾巧姐': true,
        '贾兰': true,
        '李守中': true,
        '尤三姐': true },
    relations:
        { '贾源贾代善父子': [ '贾源', '贾代善', '父子' ],
            '贾代善贾母夫妻': [ '贾代善', '贾母', '夫妻' ],
            '贾代善老姨奶奶夫妾': [ '贾代善', '老姨奶奶', '夫妾' ],
            '贾代善贾敏母女': [ '贾代善', '贾敏', '母女' ],
            '贾赦嫣红夫妾': [ '贾赦', '嫣红', '夫妾' ],
            '贾赦翠云夫妾': [ '贾赦', '翠云', '夫妾' ],
            '贾赦娇红夫妾': [ '贾赦', '娇红', '夫妾' ],
            '贾赦贾迎春母女': [ '贾赦', '贾迎春', '母女' ],
            '贾政赵姨娘夫妾': [ '贾政', '赵姨娘', '夫妾' ],
            '贾政周姨娘夫妾': [ '贾政', '周姨娘', '夫妾' ],
            '贾政贾珠父子': [ '贾政', '贾珠', '父子' ],
            '贾琏尤二姐夫妾': [ '贾琏', '尤二姐', '夫妾' ],
            '贾琏秋桐夫妾': [ '贾琏', '秋桐', '夫妾' ],
            '贾琏平儿夫妾': [ '贾琏', '平儿', '夫妾' ],
            '贾宝玉薛宝衩夫妻': [ '贾宝玉', '薛宝衩', '夫妻' ],
            '贾宝玉花袭人夫妾': [ '贾宝玉', '花袭人', '夫妾' ],
            '贾宝玉贾桂父子': [ '贾宝玉', '贾桂', '父子' ],
            '娄氏贾菌父子': [ '娄氏', '贾菌', '父子' ],
            '周财主周秀才父子': [ '周财主', '周秀才', '父子' ],
            '周妈妈周秀才母女': [ '周妈妈', '周秀才', '母女' ],
            '孙亲太太孙绍祖母女': [ '孙亲太太', '孙绍祖', '母女' ],
            '邢夫人刑大舅二姐姐妹': [ '邢夫人', '刑大舅二姐', '姐妹' ],
            '邢夫人邢德全姐弟': [ '邢夫人', '邢德全', '姐弟' ],
            '张大老爷张大老爷之女母女': [ '张大老爷', '张大老爷之女', '母女' ],
            '邢忠刑秞烟母女': [ '邢忠', '刑秞烟', '母女' ],
            '李婶李婶之弟姐弟': [ '李婶', '李婶之弟', '姐弟' ],
            '李婶李纹母女': [ '李婶', '李纹', '母女' ],
            '甄宝玉李绮夫妻': [ '甄宝玉', '李绮', '夫妻' ],
            '甄宝玉祖母甄应嘉父子': [ '甄宝玉祖母', '甄应嘉', '父子' ],
            '甄应嘉甄夫人夫妻': [ '甄应嘉', '甄夫人', '夫妻' ],
            '甄应嘉大姑娘母女': [ '甄应嘉', '大姑娘', '母女' ],
            '甄应嘉二姑娘母女': [ '甄应嘉', '二姑娘', '母女' ],
            '甄应嘉三姑娘母女': [ '甄应嘉', '三姑娘', '母女' ],
            '袭人之母袭人母女': [ '袭人之母', '袭人', '母女' ],
            '周琼之子贾探春夫妻': [ '周琼之子', '贾探春', '夫妻' ],
            '林如海之父林如海父子': [ '林如海之父', '林如海', '父子' ],
            '林如海林如海之子父子': [ '林如海', '林如海之子', '父子' ],
            '贾琏昭儿主仆': [ '贾琏', '昭儿', '主仆' ],
            '贾琏兴儿主仆': [ '贾琏', '兴儿', '主仆' ],
            '贾琏隆儿主仆': [ '贾琏', '隆儿', '主仆' ],
            '贾琏庆儿主仆': [ '贾琏', '庆儿', '主仆' ],
            '赵嬷嬷赵天梁父子': [ '赵嬷嬷', '赵天梁', '父子' ],
            '赵嬷嬷赵天栋父子': [ '赵嬷嬷', '赵天栋', '父子' ],
            '贾琏王信主仆': [ '贾琏', '王信', '主仆' ],
            '贾琏王信媳妇主仆': [ '贾琏', '王信媳妇', '主仆' ],
            '贾琏鲍二主仆': [ '贾琏', '鲍二', '主仆' ],
            '尤二姐善姐主人丫鬟': [ '尤二姐', '善姐', '主人丫鬟' ],
            '贾迎春绣桔主人丫鬟': [ '贾迎春', '绣桔', '主人丫鬟' ],
            '贾迎春莲花儿主人丫鬟': [ '贾迎春', '莲花儿', '主人丫鬟' ],
            '贾迎春秦思祺主人丫鬟': [ '贾迎春', '秦思祺', '主人丫鬟' ],
            '刑秞烟篆儿主人丫鬟': [ '刑秞烟', '篆儿', '主人丫鬟' ],
            '李纨素云主人丫鬟': [ '李纨', '素云', '主人丫鬟' ],
            '李纨碧月主人丫鬟': [ '李纨', '碧月', '主人丫鬟' ],
            '贾元春抱琴主人丫鬟': [ '贾元春', '抱琴', '主人丫鬟' ],
            '贾宝玉宋嬷嬷主仆': [ '贾宝玉', '宋嬷嬷', '主仆' ],
            '贾宝玉叶茗烟主仆': [ '贾宝玉', '叶茗烟', '主仆' ],
            '贾宝玉锄药主仆': [ '贾宝玉', '锄药', '主仆' ],
            '贾宝玉扫红主仆': [ '贾宝玉', '扫红', '主仆' ],
            '贾宝玉墨雨主仆': [ '贾宝玉', '墨雨', '主仆' ],
            '贾宝玉引泉主仆': [ '贾宝玉', '引泉', '主仆' ],
            '贾宝玉扫花主仆': [ '贾宝玉', '扫花', '主仆' ],
            '贾宝玉挑云主仆': [ '贾宝玉', '挑云', '主仆' ],
            '贾宝玉伴鹤主仆': [ '贾宝玉', '伴鹤', '主仆' ],
            '贾宝玉双瑞主仆': [ '贾宝玉', '双瑞', '主仆' ],
            '贾宝玉双寿主仆': [ '贾宝玉', '双寿', '主仆' ],
            '老叶妈叶茗烟母女': [ '老叶妈', '叶茗烟', '母女' ],
            '李嬷嬷李贵父子': [ '李嬷嬷', '李贵', '父子' ],
            '贾宝玉李嬷嬷孙子主仆': [ '贾宝玉', '李嬷嬷孙子', '主仆' ],
            '贾宝玉王荣主仆': [ '贾宝玉', '王荣', '主仆' ],
            '贾宝玉张若锦主仆': [ '贾宝玉', '张若锦', '主仆' ],
            '贾宝玉赵亦华主仆': [ '贾宝玉', '赵亦华', '主仆' ],
            '王夫人周瑞主仆': [ '王夫人', '周瑞', '主仆' ],
            '周瑞周瑞女儿母女': [ '周瑞', '周瑞女儿', '母女' ],
            '周瑞周嫂子的儿子父子': [ '周瑞', '周嫂子的儿子', '父子' ],
            '王夫人白金钏主人丫鬟': [ '王夫人', '白金钏', '主人丫鬟' ],
            '王夫人白玉钏主人丫鬟': [ '王夫人', '白玉钏', '主人丫鬟' ],
            '王夫人彩云主人丫鬟': [ '王夫人', '彩云', '主人丫鬟' ],
            '王夫人彩鸾主人丫鬟': [ '王夫人', '彩鸾', '主人丫鬟' ],
            '王夫人绣鸾主人丫鬟': [ '王夫人', '绣鸾', '主人丫鬟' ],
            '王夫人绣凤主人丫鬟': [ '王夫人', '绣凤', '主人丫鬟' ],
            '白老媳妇白金钏母女': [ '白老媳妇', '白金钏', '母女' ],
            '白老媳妇白玉钏母女': [ '白老媳妇', '白玉钏', '母女' ],
            '彩霞之母彩霞母女': [ '彩霞之母', '彩霞', '母女' ],
            '彩霞小霞姐妹': [ '彩霞', '小霞', '姐妹' ],
            '赵姨娘小鹊主人丫鬟': [ '赵姨娘', '小鹊', '主人丫鬟' ],
            '赵姨娘小吉祥主人丫鬟': [ '赵姨娘', '小吉祥', '主人丫鬟' ],
            '钱槐赵姨娘兄妹': [ '钱槐', '赵姨娘', '兄妹' ],
            '贾环钱槐主仆': [ '贾环', '钱槐', '主仆' ],
            '林黛玉雪雁主人丫鬟': [ '林黛玉', '雪雁', '主人丫鬟' ],
            '林黛玉紫鹊主人丫鬟': [ '林黛玉', '紫鹊', '主人丫鬟' ],
            '林黛玉春纤主人丫鬟': [ '林黛玉', '春纤', '主人丫鬟' ],
            '林黛玉藕官主人丫鬟': [ '林黛玉', '藕官', '主人丫鬟' ],
            '赖嬷嬷赖大母女': [ '赖嬷嬷', '赖大', '母女' ],
            '赖大赖尚荣父子': [ '赖大', '赖尚荣', '父子' ],
            '赖大赖大的女儿母女': [ '赖大', '赖大的女儿', '母女' ],
            '王熙凤来旺儿主仆': [ '王熙凤', '来旺儿', '主仆' ],
            '王熙凤旺儿媳妇主人丫鬟': [ '王熙凤', '旺儿媳妇', '主人丫鬟' ],
            '王熙凤来喜家的主仆': [ '王熙凤', '来喜家的', '主仆' ],
            '王熙凤丰儿主人丫鬟': [ '王熙凤', '丰儿', '主人丫鬟' ],
            '王熙凤彩明主人丫鬟': [ '王熙凤', '彩明', '主人丫鬟' ],
            '王熙凤林红玉主人丫鬟': [ '王熙凤', '林红玉', '主人丫鬟' ],
            '林之孝林红玉父子': [ '林之孝', '林红玉', '父子' ],
            '邢夫人王善保主仆': [ '邢夫人', '王善保', '主仆' ],
            '邢夫人费婆子主人丫鬟': [ '邢夫人', '费婆子', '主人丫鬟' ],
            '贾母金鸳鸯主人丫鬟': [ '贾母', '金鸳鸯', '主人丫鬟' ],
            '贾母琥珀主人丫鬟': [ '贾母', '琥珀', '主人丫鬟' ],
            '贾母鹦鹉主人丫鬟': [ '贾母', '鹦鹉', '主人丫鬟' ],
            '贾母珍珠主人丫鬟': [ '贾母', '珍珠', '主人丫鬟' ],
            '贾母翡翠主人丫鬟': [ '贾母', '翡翠', '主人丫鬟' ],
            '贾母玻璃主人丫鬟': [ '贾母', '玻璃', '主人丫鬟' ],
            '贾母文官主人丫鬟': [ '贾母', '文官', '主人丫鬟' ],
            '傻大姐的娘傻大姐母女': [ '傻大姐的娘', '傻大姐', '母女' ],
            '金彩鸳鸯父子': [ '金彩', '鸳鸯', '父子' ],
            '多官晴雯兄妹': [ '多官', '晴雯', '兄妹' ],
            '多官多姑娘儿夫妻': [ '多官', '多姑娘儿', '夫妻' ],
            '吴贵晴雯兄妹': [ '吴贵', '晴雯', '兄妹' ],
            '贾宝玉花芳官主人丫鬟': [ '贾宝玉', '花芳官', '主人丫鬟' ],
            '贾宝玉媚人主人丫鬟': [ '贾宝玉', '媚人', '主人丫鬟' ],
            '贾宝玉麝月主人丫鬟': [ '贾宝玉', '麝月', '主人丫鬟' ],
            '贾宝玉茜雪主人丫鬟': [ '贾宝玉', '茜雪', '主人丫鬟' ],
            '贾宝玉秋纹主人丫鬟': [ '贾宝玉', '秋纹', '主人丫鬟' ],
            '贾宝玉绮霞主人丫鬟': [ '贾宝玉', '绮霞', '主人丫鬟' ],
            '贾宝玉碧痕主人丫鬟': [ '贾宝玉', '碧痕', '主人丫鬟' ],
            '贾宝玉檀云主人丫鬟': [ '贾宝玉', '檀云', '主人丫鬟' ],
            '贾宝玉四儿主人丫鬟': [ '贾宝玉', '四儿', '主人丫鬟' ],
            '贾宝玉佳蕙主人丫鬟': [ '贾宝玉', '佳蕙', '主人丫鬟' ],
            '贾宝玉坠儿主人丫鬟': [ '贾宝玉', '坠儿', '主人丫鬟' ],
            '贾宝玉紫绡主人丫鬟': [ '贾宝玉', '紫绡', '主人丫鬟' ],
            '贾宝玉良儿主人丫鬟': [ '贾宝玉', '良儿', '主人丫鬟' ],
            '贾宝玉何春燕主人丫鬟': [ '贾宝玉', '何春燕', '主人丫鬟' ],
            '厨房中的柳家媳妇柳五儿母女': [ '厨房中的柳家媳妇', '柳五儿', '母女' ],
            '柳五儿柳二媳妇的妹子姐妹': [ '柳五儿', '柳二媳妇的妹子', '姐妹' ],
            '贾探春侍书主人丫鬟': [ '贾探春', '侍书', '主人丫鬟' ],
            '贾探春翠墨主人丫鬟': [ '贾探春', '翠墨', '主人丫鬟' ],
            '贾探春艾官主人丫鬟': [ '贾探春', '艾官', '主人丫鬟' ],
            '贾探春小蝉主人丫鬟': [ '贾探春', '小蝉', '主人丫鬟' ],
            '何婆何春燕母女': [ '何婆', '何春燕', '母女' ],
            '何春燕小鸠儿姐妹': [ '何春燕', '小鸠儿', '姐妹' ],
            '傅试傅秋芳姐妹': [ '傅试', '傅秋芳', '姐妹' ],
            '太祖皇帝先皇父子': [ '太祖皇帝', '先皇', '父子' ],
            '先皇太上皇父子': [ '先皇', '太上皇', '父子' ],
            '太上皇皇太后夫妻': [ '太上皇', '皇太后', '夫妻' ],
            '太上皇皇帝父子': [ '太上皇', '皇帝', '父子' ],
            '皇帝贾元春夫妻': [ '皇帝', '贾元春', '夫妻' ],
            '皇帝吴贵妃夫妻': [ '皇帝', '吴贵妃', '夫妻' ],
            '皇帝周贵人夫妻': [ '皇帝', '周贵人', '夫妻' ],
            '周贵人父亲周贵人父子': [ '周贵人父亲', '周贵人', '父子' ],
            '吴天佑吴贵妃父子': [ '吴天佑', '吴贵妃', '父子' ],
            '皇帝戴权君臣': [ '皇帝', '戴权', '君臣' ],
            '皇帝夏守忠君臣': [ '皇帝', '夏守忠', '君臣' ],
            '贾演贾代化父子': [ '贾演', '贾代化', '父子' ],
            '贾演焦大主仆': [ '贾演', '焦大', '主仆' ],
            '贾代化贾敷父子': [ '贾代化', '贾敷', '父子' ],
            '贾代化贾敬父子': [ '贾代化', '贾敬', '父子' ],
            '贾敬贾惜春母女': [ '贾敬', '贾惜春', '母女' ],
            '史侯史湘云爷爷父子': [ '史侯', '史湘云爷爷', '父子' ],
            '史湘云爷爷史鼐父子': [ '史湘云爷爷', '史鼐', '父子' ],
            '史湘云爷爷史鼎父子': [ '史湘云爷爷', '史鼎', '父子' ],
            '史鼎史鼎的夫人夫妻': [ '史鼎', '史鼎的夫人', '夫妻' ],
            '湘云母史湘云母女': [ '湘云母', '史湘云', '母女' ],
            '卫若兰史湘云夫妻': [ '卫若兰', '史湘云', '夫妻' ],
            '史湘云翠缕主人丫鬟': [ '史湘云', '翠缕', '主人丫鬟' ],
            '史湘云葵官主人丫鬟': [ '史湘云', '葵官', '主人丫鬟' ],
            '王公凤姐之祖王夫人之父父子': [ '王公', '凤姐之祖王夫人之父', '父子' ],
            '凤姐之祖王夫人之父王夫人之大兄凤姐之父父子': [ '凤姐之祖王夫人之父', '王夫人之大兄凤姐之父', '父子' ],
            '凤姐之祖王夫人之父王子腾父子': [ '凤姐之祖王夫人之父', '王子腾', '父子' ],
            '凤姐之祖王夫人之父王子胜父子': [ '凤姐之祖王夫人之父', '王子胜', '父子' ],
            '凤姐之祖王夫人之父王夫人母女': [ '凤姐之祖王夫人之父', '王夫人', '母女' ],
            '凤姐之祖王夫人之父薛姨妈母女': [ '凤姐之祖王夫人之父', '薛姨妈', '母女' ],
            '王夫人之大兄凤姐之父老舅太太夫妻': [ '王夫人之大兄凤姐之父', '老舅太太', '夫妻' ],
            '王夫人之大兄凤姐之父王仁父子': [ '王夫人之大兄凤姐之父', '王仁', '父子' ],
            '王夫人之大兄凤姐之父王熙凤母女': [ '王夫人之大兄凤姐之父', '王熙凤', '母女' ],
            '王子腾王子腾夫人夫妻': [ '王子腾', '王子腾夫人', '夫妻' ],
            '王子腾王子腾之女母女': [ '王子腾', '王子腾之女', '母女' ],
            '保宁侯之子王子腾之女夫妻': [ '保宁侯之子', '王子腾之女', '夫妻' ],
            '王成父王成父子': [ '王成父', '王成', '父子' ],
            '王成王狗儿父子': [ '王成', '王狗儿', '父子' ],
            '王狗儿刘氏夫妻': [ '王狗儿', '刘氏', '夫妻' ],
            '王狗儿王青儿母女': [ '王狗儿', '王青儿', '母女' ],
            '王狗儿王板儿父子': [ '王狗儿', '王板儿', '父子' ],
            '刘姥姥刘氏母女': [ '刘姥姥', '刘氏', '母女' ],
            '薛公宝钗祖父父子': [ '薛公', '宝钗祖父', '父子' ],
            '宝钗祖父薛公之孙父子': [ '宝钗祖父', '薛公之孙', '父子' ],
            '宝钗祖父薛宝琴父父子': [ '宝钗祖父', '薛宝琴父', '父子' ],
            '薛公之孙薛姨妈夫妻': [ '薛公之孙', '薛姨妈', '夫妻' ],
            '薛公之孙薛宝钗母女': [ '薛公之孙', '薛宝钗', '母女' ],
            '薛公之孙薛蟠父子': [ '薛公之孙', '薛蟠', '父子' ],
            '薛姨妈同喜主人丫鬟': [ '薛姨妈', '同喜', '主人丫鬟' ],
            '薛姨妈同贵主人丫鬟': [ '薛姨妈', '同贵', '主人丫鬟' ],
            '薛宝钗莺儿主人丫鬟': [ '薛宝钗', '莺儿', '主人丫鬟' ],
            '薛宝钗文杏主人丫鬟': [ '薛宝钗', '文杏', '主人丫鬟' ],
            '薛宝钗喜儿主人丫鬟': [ '薛宝钗', '喜儿', '主人丫鬟' ],
            '薛宝钗蕊官主人丫鬟': [ '薛宝钗', '蕊官', '主人丫鬟' ],
            '薛蟠夏金桂夫妻': [ '薛蟠', '夏金桂', '夫妻' ],
            '夏金桂宝蟾主人丫鬟': [ '夏金桂', '宝蟾', '主人丫鬟' ],
            '夏金桂小舍儿主人丫鬟': [ '夏金桂', '小舍儿', '主人丫鬟' ],
            '夏奶奶夏金桂母女': [ '夏奶奶', '夏金桂', '母女' ],
            '夏奶奶夏三父子': [ '夏奶奶', '夏三', '父子' ],
            '香菱臻儿主人丫鬟': [ '香菱', '臻儿', '主人丫鬟' ],
            '薛宝琴父薛宝琴母夫妻': [ '薛宝琴父', '薛宝琴母', '夫妻' ],
            '薛宝琴父薛蝌父子': [ '薛宝琴父', '薛蝌', '父子' ],
            '薛宝琴父薛宝琴母女': [ '薛宝琴父', '薛宝琴', '母女' ],
            '薛蝌邢岫烟夫妻': [ '薛蝌', '邢岫烟', '夫妻' ],
            '梅翰林之子薛宝琴夫妻': [ '梅翰林之子', '薛宝琴', '夫妻' ],
            '薛宝琴小螺主人丫鬟': [ '薛宝琴', '小螺', '主人丫鬟' ],
            '薛宝琴荳官主人丫鬟': [ '薛宝琴', '荳官', '主人丫鬟' ],
            '梅翰林梅翰林之子父子': [ '梅翰林', '梅翰林之子', '父子' ],
            '贾代儒贾瑞之父父子': [ '贾代儒', '贾瑞之父', '父子' ],
            '贾瑞之父贾瑞之母夫妻': [ '贾瑞之父', '贾瑞之母', '夫妻' ],
            '贾瑞之父贾瑞父子': [ '贾瑞之父', '贾瑞', '父子' ],
            '贾琼之母贾琼父子': [ '贾琼之母', '贾琼', '父子' ],
            '贾琼之母贾四姐母女': [ '贾琼之母', '贾四姐', '母女' ],
            '贾王扁之母贾王扁父子': [ '贾王扁之母', '贾王扁', '父子' ],
            '贾王扁之母贾喜鸾母女': [ '贾王扁之母', '贾喜鸾', '母女' ],
            '五嫂子卜氏贾芸父子': [ '五嫂子卜氏', '贾芸', '父子' ],
            '贾芸小丫头子主人丫鬟': [ '贾芸', '小丫头子', '主人丫鬟' ],
            '倪二倪儿娘子夫妻': [ '倪二', '倪儿娘子', '夫妻' ],
            '倪二倪二女儿母女': [ '倪二', '倪二女儿', '母女' ],
            '卜世仁卜世仁娘子夫妻': [ '卜世仁', '卜世仁娘子', '夫妻' ],
            '卜世仁卜银姐母女': [ '卜世仁', '卜银姐', '母女' ],
            '周氏贾芹父子': [ '周氏', '贾芹', '父子' ],
            '贾璜金氏夫妻': [ '贾璜', '金氏', '夫妻' ],
            '胡氏金荣父子': [ '胡氏', '金荣', '父子' ],
            '贾化娇杏夫妻': [ '贾化', '娇杏', '夫妻' ],
            '贾化贾雨村子父子': [ '贾化', '贾雨村子', '父子' ],
            '贾化应天府门子父子': [ '贾化', '应天府门子', '父子' ],
            '应天府门子天子之妻夫妻': [ '应天府门子', '天子之妻', '夫妻' ],
            '东平郡王东安郡王穆莳拜父子': [ '东平郡王', '东安郡王穆莳拜', '父子' ],
            '南安郡王南安王太妃夫妻': [ '南安郡王', '南安王太妃', '夫妻' ],
            '西宁郡王西宁郡王妃夫妻': [ '西宁郡王', '西宁郡王妃', '夫妻' ],
            '水溶北静王少妃夫妻': [ '水溶', '北静王少妃', '夫妻' ],
            '水溶北静郡王长府官君臣': [ '水溶', '北静郡王长府官', '君臣' ],
            '牛清镇国公诰命夫妻': [ '牛清', '镇国公诰命', '夫妻' ],
            '牛清镇国公诰命长男父子': [ '牛清', '镇国公诰命长男', '父子' ],
            '缮国公缮国公诰命夫妻': [ '缮国公', '缮国公诰命', '夫妻' ],
            '锦乡侯锦乡侯诰命夫妻': [ '锦乡侯', '锦乡侯诰命', '夫妻' ],
            '锦乡侯韩奇父子': [ '锦乡侯', '韩奇', '父子' ],
            '神武将军冯唐冯紫英父子': [ '神武将军冯唐', '冯紫英', '父子' ],
            '张大财主张金哥母女': [ '张大财主', '张金哥', '母女' ],
            '长安原任守备李公子父子': [ '长安原任守备', '李公子', '父子' ],
            '尤老娘尤氏母女': [ '尤老娘', '尤氏', '母女' ],
            '贾珍佩凤夫妾': [ '贾珍', '佩凤', '夫妾' ],
            '贾珍偕鸾夫妾': [ '贾珍', '偕鸾', '夫妾' ],
            '贾珍文花夫妾': [ '贾珍', '文花', '夫妾' ],
            '尤氏茄官主人丫鬟': [ '尤氏', '茄官', '主人丫鬟' ],
            '尤氏银蝶主人丫鬟': [ '尤氏', '银蝶', '主人丫鬟' ],
            '尤氏炒豆儿主人丫鬟': [ '尤氏', '炒豆儿', '主人丫鬟' ],
            '贾蓉秦可卿夫妻': [ '贾蓉', '秦可卿', '夫妻' ],
            '贾惜春入画主人丫鬟': [ '贾惜春', '入画', '主人丫鬟' ],
            '贾惜春彩屏主人丫鬟': [ '贾惜春', '彩屏', '主人丫鬟' ],
            '贾惜春彩儿主人丫鬟': [ '贾惜春', '彩儿', '主人丫鬟' ],
            '秦可卿瑞珠主人丫鬟': [ '秦可卿', '瑞珠', '主人丫鬟' ],
            '秦可卿宝珠主人丫鬟': [ '秦可卿', '宝珠', '主人丫鬟' ],
            '秦业秦钟父子': [ '秦业', '秦钟', '父子' ],
            '贾珍喜儿主仆': [ '贾珍', '喜儿', '主仆' ],
            '贾珍寿儿主仆': [ '贾珍', '寿儿', '主仆' ],
            '柳湘莲杏奴主仆': [ '柳湘莲', '杏奴', '主仆' ],
            '贾代善贾赦父子': [ '贾代善', '贾赦', '父子' ],
            '贾代善贾政父子': [ '贾代善', '贾政', '父子' ],
            '贾政贾敏姐妹': [ '贾政', '贾敏', '姐妹' ],
            '贾赦邢夫人夫妻': [ '贾赦', '邢夫人', '夫妻' ],
            '贾赦贾琏父子': [ '贾赦', '贾琏', '父子' ],
            '贾赦贾琮父子': [ '贾赦', '贾琮', '父子' ],
            '贾政王夫人夫妻': [ '贾政', '王夫人', '夫妻' ],
            '贾政贾元春母女': [ '贾政', '贾元春', '母女' ],
            '贾政贾宝玉父子': [ '贾政', '贾宝玉', '父子' ],
            '贾政贾探春母女': [ '贾政', '贾探春', '母女' ],
            '贾政贾环父子': [ '贾政', '贾环', '父子' ],
            '贾琏王熙凤夫妻': [ '贾琏', '王熙凤', '夫妻' ],
            '贾琏贾巧姐母女': [ '贾琏', '贾巧姐', '母女' ],
            '贾珠贾兰父子': [ '贾珠', '贾兰', '父子' ],
            '贾珠李纨夫妻': [ '贾珠', '李纨', '夫妻' ],
            '孙绍祖贾迎春夫妻': [ '孙绍祖', '贾迎春', '夫妻' ],
            '李守中李纨父子': [ '李守中', '李纨', '父子' ],
            '李婶李绮母女': [ '李婶', '李绮', '母女' ],
            '甄应嘉甄宝玉父子': [ '甄应嘉', '甄宝玉', '父子' ],
            '林如海贾敏夫妻': [ '林如海', '贾敏', '夫妻' ],
            '林如海林黛玉母女': [ '林如海', '林黛玉', '母女' ],
            '王夫人彩霞主人丫鬟': [ '王夫人', '彩霞', '主人丫鬟' ],
            '贾母傻大姐主人丫鬟': [ '贾母', '傻大姐', '主人丫鬟' ],
            '贾宝玉晴雯主人丫鬟': [ '贾宝玉', '晴雯', '主人丫鬟' ],
            '贾宝玉篆儿主人丫鬟': [ '贾宝玉', '篆儿', '主人丫鬟' ],
            '贾宝玉柳五儿主人丫鬟': [ '贾宝玉', '柳五儿', '主人丫鬟' ],
            '贾敬贾珍父子': [ '贾敬', '贾珍', '父子' ],
            '史侯贾母母女': [ '史侯', '贾母', '母女' ],
            '薛蟠香菱夫妾': [ '薛蟠', '香菱', '夫妾' ],
            '贾珍尤氏夫妻': [ '贾珍', '尤氏', '夫妻' ],
            '尤老娘尤二姐母女': [ '尤老娘', '尤二姐', '母女' ],
            '尤老娘尤三姐母女': [ '尤老娘', '尤三姐', '母女' ],
            '贾珍贾蓉父子': [ '贾珍', '贾蓉', '父子' ],
            '秦业秦可卿母女': [ '秦业', '秦可卿', '母女' ] } }
var medical = {
    entities:['阿尔茨海默病 疾病', '路易体痴呆 疾病', '血管性痴呆 疾病', '抑郁症 疾病', '克-雅病 疾病', '谵妄 疾病', '额颞叶痴呆 疾病', '西酞普兰 药物', '血小板电泳时间测定 诊疗', '精神障碍 症状', '食欲不振 症状', '烦躁不安 症状', '唐氏综合征 疾病', '5 羟吲哚乙酸 诊疗', '5羟色胺 诊疗', '血清钙 诊疗', '脑脊液压力 诊疗', '脑脊液生长抑素 诊疗', '感染 疾病', '睡眠障碍 疾病', '疼痛 疾病', '嗜睡 症状', '幻觉 症状', '高脂血症 疾病', '头孢呋辛 药物', '癸酸氟哌啶醇 药物', '泌尿道感染 疾病', '肾功 能衰竭 症状', '衰弱 症状', '感觉障碍 症状', '意识模糊 症状', '糖尿 症状', '憋气 症状', '眼花 症状', '硬化 症状', '偏盲  症状', '抽搐 症状', '头晕 症状', '颅内出血 疾病', '缺血性脑卒中 疾病', '类甲状腺功能减退症 疾病', '糖尿病 疾病', '癌症  疾病', '强迫症 疾病', '莱姆病 疾病', '焦虑障碍 疾病', '度洛西汀 药物', '帕罗西汀 药物', '舍曲林 药物', '阿米替林 药物', '氯米帕明 药物', '文拉法辛 药物', '吗氯贝胺 药物', '米氮平 药物', '奈法唑酮 药物', '氨磺必利 药物', '安非他酮 药物', '普瑞巴林 药物', '丙米嗪 药物', '氟西汀 药物', '氟伏沙明 药物', '马普替林 药物', '产后抑郁症 疾病', '双相情感障碍 疾病', ' 疲劳 症状', '体重增加 症状', '精神疾病 疾病', '自杀 疾病', '缺血性心脏病 疾病', '缺陷多动障碍 疾病', '广泛性焦虑障碍 疾 病', '红细胞沉降率 诊疗', '脑电图检查 诊疗', '瘫痪 疾病', '肺炎 疾病', '小脑性共济失调 症状', '抑郁 症状', '构音障碍 症 状', '体重减轻 症状', '血氨 诊疗', '脑病 疾病', '认知障碍 疾病', '肾炎 疾病', '营养不良 疾病', '痴呆 疾病', '健忘 症状', 'ect检查 诊疗', '精神分裂症 疾病', '染色体异常伴发的精神障碍 疾病', '代谢障碍性肝肿大 症状', '记忆障碍 疾病', '胃肠道癌 疾病', '功能性消化不良 疾病', '内皮素 诊疗', '奔豚气 症状', '呕吐 疾病', '吸入性肺炎 疾病', '硝苯地平 药物', '甘露醇 药物', '维生素k1 药物', '酚磺乙胺 药物', '电解质紊乱 疾病', '新生儿呕吐 疾病', '脱水 疾病', '呼吸困难 症状', '先天性甲状腺功能减退症 疾病', '心脏疾病 疾病', '先天性心脏病 疾病', '白血病 疾病', '脐疝 疾病', '癫痫发作 疾病', '气管食管瘘 疾病', '隐睾 疾病', '斜视 疾病', '癫痫持续状态 疾病', '甲种胎儿球蛋白试验 诊疗', '妊娠相关血浆蛋白a 诊疗', '尿液雌三醇 诊疗', '促甲状腺激素 药物', '充血性心力衰竭 疾病', '心绞痛 疾病', '心动过速 症状', '恶心 症状', '小儿甲状旁腺功能减退症 疾病', '甲状腺癌 疾病', '维生素b12 药物', '视神经炎 疾病', '充血 症状', '低血钾 症状', '瘙痒 症状', '贫血 疾病', '青光眼 疾病', '后葡萄膜炎 疾病', '再生障碍性贫血 疾病', '巨幼红细胞性贫血 疾病', '利培酮 药物', '面具脸 症状', '疲乏 症状', '视物模糊 症状', '浮肿 症状', '面部浮肿 症状', '高泌乳素血症 疾病', '地昔帕明 药物', '口干 症状', '劳拉西泮 药物', '呼吸抑制 症状', '失眠症 疾病', '原发性慢性闭角型青光眼 疾病'],
    relations:['阿尔茨海默病 疾病 路易体痴呆 疾病 鉴别诊断', '阿尔茨海默病 疾病 血管性痴呆 疾病 鉴别诊断', '阿尔茨海默病 疾病 抑郁症  疾病 鉴别诊断', '阿尔茨海默病 疾病 克-雅病 疾病 鉴别诊断', '阿尔茨海默病 疾病 谵妄 疾病 鉴别诊断', '阿尔茨海默病 疾病 额颞叶痴呆 疾病 鉴别诊断', '阿尔茨海默病 疾病 西酞普兰 药物 药物治疗', '阿尔茨海默病 疾病 血小板电泳时间测定 诊疗 影像学检查', '阿尔茨海默病 疾病 精神障碍 症状 临床症状及体征', '阿尔茨海默病 疾病 食欲不振 症状 临床症状及体征', '阿尔茨海默病  疾病 烦躁不安 症状 临床症状及体征', '阿尔茨海默病 疾病 唐氏综合征 疾病 高危因素', '阿尔茨海默病 疾病 5羟吲哚乙酸 诊疗 实验室检查', '阿尔茨海默病 疾病 5羟色胺 诊疗 实验室检查', '阿尔茨海默病 疾病 血清钙 诊疗 实验室检查', '阿尔茨海默病 疾病  脑脊液压力 诊疗 实验室检查', '阿尔茨海默病 疾病 脑脊液生长抑素 诊疗 实验室检查', '阿尔茨海默病 疾病 感染 疾病 并发症', '路易体痴呆 疾病 睡眠障碍 疾病 并发症', '路易体痴呆 疾病 疼痛 疾病 并发症', '路易体痴呆 疾病 精神障碍 症状 临床症状及体征', '路易体痴呆 疾病 嗜睡 症状 临床症状及体征', '路易体痴呆 疾病 幻觉 症状 临床症状及体征', '血管性痴呆 疾病 高脂血症 疾 病 高危因素', '血管性痴呆 疾病 头孢呋辛 药物 药物治疗', '血管性痴呆 疾病 癸酸氟哌啶醇 药物 药物治疗', '血管性痴呆 疾病  抑郁症 疾病 并发症', '血管性痴呆 疾病 泌尿道感染 疾病 并发症', '血管性痴呆 疾病 感染 疾病 并发症', '血管性痴呆 疾病 肾功能衰竭 症状 临床症状及体征', '血管性痴呆 疾病 精神障碍 症状 临床症状及体征', '血管性痴呆 疾病 衰弱 症状 临床症状及体征', '血管性痴呆 疾病 感觉障碍 症状 临床症状及体征', '血管性痴呆 疾病 意识模糊 症状 临床症状及体征', '血管性痴呆 疾病 糖尿  症状 临床症状及体征', '血管性痴呆 疾病 憋气 症状 临床症状及体征', '血管性痴呆 疾病 眼花 症状 临床症状及体征', '血管性痴 呆 疾病 硬化 症状 临床症状及体征', '血管性痴呆 疾病 偏盲 症状 临床症状及体征', '血管性痴呆 疾病 抽搐 症状 临床症状及体征', '血管性痴呆 疾病 头晕 症状 临床症状及体征', '血管性痴呆 疾病 幻觉 症状 临床症状及体征', '血管性痴呆 疾病 颅内出血 疾 病 病因', '血管性痴呆 疾病 缺血性脑卒中 疾病 病因', '抑郁症 疾病 类甲状腺功能减退症 疾病 鉴别诊断', '抑郁症 疾病 糖尿病 疾病 鉴别诊断', '抑郁症 疾病 癌症 疾病 鉴别诊断', '抑郁症 疾病 强迫症 疾病 鉴别诊断', '抑郁症 疾病 莱姆病 疾病 鉴别诊断', '抑郁症 疾病 焦虑障碍 疾病 鉴别诊断', '抑郁症 疾病 度洛西汀 药物 药物治疗', '抑郁症 疾病 帕罗西汀 药物 药物治疗', '抑 郁症 疾病 西酞普兰 药物 药物治疗', '抑郁症 疾病 舍曲林 药物 药物治疗', '抑郁症 疾病 阿米替林 药物 药物治疗', '抑郁症 疾 病 氯米帕明 药物 药物治疗', '抑郁症 疾病 文拉法辛 药物 药物治疗', '抑郁症 疾病 吗氯贝胺 药物 药物治疗', '抑郁症 疾病 米 氮平 药物 药物治疗', '抑郁症 疾病 奈法唑酮 药物 药物治疗', '抑郁症 疾病 氨磺必利 药物 药物治疗', '抑郁症 疾病 安非他酮  药物 药物治疗', '抑郁症 疾病 普瑞巴林 药物 药物治疗', '抑郁症 疾病 丙米嗪 药物 药物治疗', '抑郁症 疾病 氟西汀 药物 药物 治疗', '抑郁症 疾病 氟伏沙明 药物 药物治疗', '抑郁症 疾病 马普替林 药物 药物治疗', '抑郁症 疾病 产后抑郁症 疾病 病理分型', '抑郁症 疾病 双相情感障碍 疾病 病理分型', '抑郁症 疾病 疲劳 症状 临床症状及体征', '抑郁症 疾病 体重增加 症状 临床症状及体征', '抑郁症 疾病 精神疾病 疾病 并发症', '抑郁症 疾病 自杀 疾病 并发症', '抑郁症 疾病 缺血性心脏病 疾病 并发症', '抑郁症 疾病 焦虑障碍 疾病 并发症', '抑郁症 疾病 缺陷多动障碍 疾病 并发症', '抑郁症 疾病 广泛性焦虑障碍 疾病 并发症', '抑郁症 疾病 睡眠障碍 疾病 病因', '抑郁症 疾病 红细胞沉降率 诊疗 实验室检查', '克-雅病 疾病 脑电图检查 诊疗 检查', '克-雅病  疾病 瘫痪 疾病 并发症', '克-雅病 疾病 瘫痪 疾病 并发症', '克-雅病 疾病 感染 疾病 并发症', '克-雅病 疾病 肺炎 疾病 并发症', '克-雅病 疾病 小脑性共济失调 症状 临床症状及体征', '克-雅病 疾病 感觉障碍 症状 临床症状及体征', '克-雅病 疾病 抑郁 症状 临床症状及体征', '克-雅病 疾病 构音障碍 症状 临床症状及体征', '克-雅病 疾病 体重减轻 症状 临床症状及体征', '克-雅病  疾病 脑电图检查 诊疗 辅助检查', '谵妄 疾病 血氨 诊疗 实验室检查', '谵妄 疾病 脑病 疾病 病理分型', '谵妄 疾病 嗜睡 症状  临床症状及体征', '谵妄 疾病 意识模糊 症状 临床症状及体征', '谵妄 疾病 幻觉 症状 临床症状及体征', '谵妄 疾病 认知障碍 疾 病 病因', '谵妄 疾病 肾炎 疾病 病因', '谵妄 疾病 营养不良 疾病 病因', '谵妄 疾病 抑郁症 疾病 病因', '额颞叶痴呆 疾病 认 知障碍 疾病 并发症', '额颞叶痴呆 疾病 抑郁症 疾病 并发症', '额颞叶痴呆 疾病 泌尿道感染 疾病 并发症', '额颞叶痴呆 疾病 感染 疾病 并发症', '额颞叶痴呆 疾病 痴呆 疾病 并发症', '额颞叶痴呆 疾病 健忘 症状 临床症状及体征', '额颞叶痴呆 疾病 ect检 查 诊疗 辅助检查', '额颞叶痴呆 疾病 脑电图检查 诊疗 辅助检查', '精神障碍 症状 精神分裂症 疾病 相关疾病', '精神障碍 症状 染色体异常伴发的精神障碍 疾病 相关疾病', '精神障碍 症状 脑电图检查 诊疗 检查', '精神障碍 症状 代谢障碍性肝肿大 症状 相关症状', '记忆障碍 疾病 精神障碍 症状 临床症状及体征', '记忆障碍 疾病 阿尔茨海默病 疾病 病因', '食欲不振 症状 胃肠道癌 疾 病 相关疾病', '食欲不振 症状 功能性消化不良 疾病 相关疾病', '食欲不振 症状 代谢障碍性肝肿大 症状 相关症状', '烦躁不安 症状 内皮素 诊疗 检查', '烦躁不安 症状 奔豚气 症状 相关症状', '呕吐 疾病 吸入性肺炎 疾病 药物引起的并发症', '呕吐 疾病 硝 苯地平 药物 药物治疗', '呕吐 疾病 甘露醇 药物 药物治疗', '呕吐 疾病 维生素k1 药物 药物治疗', '呕吐 疾病 酚磺乙胺 药物 药物治疗', '呕吐 疾病 电解质紊乱 疾病 并发症', '呕吐 疾病 新生儿呕吐 疾病 并发症', '呕吐 疾病 脱水 疾病 并发症', '呕吐 疾 病 营养不良 疾病 并发症', '呕吐 疾病 呼吸困难 症状 临床症状及体征', '呕吐 疾病 血氨 诊疗 实验室检查', '唐氏综合征 疾病  先天性甲状腺功能减退症 疾病 鉴别诊断', '唐氏综合征 疾病 心脏疾病 疾病 并发症', '唐氏综合征 疾病 感染 疾病 并发症', '唐氏综合征 疾病 先天性心脏病 疾病 并发症', '唐氏综合征 疾病 先天性甲状腺功能减退症 疾病 并发症', '唐氏综合征 疾病 白血病 疾 病 并发症', '唐氏综合征 疾病 脐疝 疾病 并发症', '唐氏综合征 疾病 癫痫发作 疾病 并发症', '唐氏综合征 疾病 气管食管瘘 疾病 并发症', '唐氏综合征 疾病 隐睾 疾病 并发症', '唐氏综合征 疾病 斜视 疾病 并发症', '唐氏综合征 疾病 癫痫持续状态 疾病 并 发症', '唐氏综合征 疾病 阿尔茨海默病 疾病 并发症', '唐氏综合征 疾病 嗜睡 症状 临床症状及体征', '唐氏综合征 疾病 甲种胎儿球蛋白试验 诊疗 实验室检查', '唐氏综合征 疾病 妊娠相关血浆蛋白a 诊疗 实验室检查', '唐氏综合征 疾病 尿液雌三醇 诊疗 实验 室检查', '促甲状腺激素 药物 心脏疾病 疾病 禁忌症', '促甲状腺激素 药物 充血性心力衰竭 疾病 禁忌症', '促甲状腺激素 药物 心绞痛 疾病 禁忌症', '促甲状腺激素 药物 心动过速 症状 不良反应', '促甲状腺激素 药物 恶心 症状 不良反应', '促甲状腺激素 药 物 小儿甲状旁腺功能减退症 疾病 适应症', '促甲状腺激素 药物 甲状腺癌 疾病 适应症', '维生素b12 药物 视神经炎 疾病 禁忌症', '维生素b12 药物 充血 症状 不良反应', '维生素b12 药物 低血钾 症状 不良反应', '维生素b12 药物 瘙痒 症状 不良反应', '维生 素b12 药物 贫血 疾病 适应症', '维生素b12 药物 视神经炎 疾病 适应症', '维生素b12 药物 青光眼 疾病 适应症', '维生素b12 药 物 后葡萄膜炎 疾病 适应症', '维生素b12 药物 再生障碍性贫血 疾病 适应症', '维生素b12 药物 巨幼红细胞性贫血 疾病 适应症', '维生素b12 药物 巨幼红细胞性贫血 疾病 适应症', '利培酮 药物 面具脸 症状 不良反应', '利培酮 药物 疲乏 症状 不良反应', '利培酮 药物 视物模糊 症状 不良反应', '利培酮 药物 恶心 症状 不良反应', '利培酮 药物 浮肿 症状 不良反应', '利培酮 药物 面部浮肿 症状 不良反应', '利培酮 药物 疲劳 症状 不良反应', '利培酮 药物 嗜睡 症状 不良反应', '利培酮 药物 精神分裂症 疾病 适应症', '利培酮 药物 高泌乳素血症 疾病 禁忌症', '利培酮 药物 焦虑障碍 疾病 适应症', '利培酮 药物 谵妄 疾病 适应症', '利培酮 药物 精神疾病 疾病 适应症', '利培酮 药物 抑郁症 疾病 适应症', '地昔帕明 药物 头晕 症状 不良反应', '地昔帕明 药物 口干 症状 不良反应', '地昔帕明 药物 抑郁症 疾病 适应症', '劳拉西泮 药物 嗜睡 症状 不良反应', '劳拉西泮 药物 呼吸抑制 症状 不良反应', '劳拉西泮 药物 焦虑障碍 疾病 适应症', '劳拉西泮 药物 呕吐 疾病 适应症', '劳拉西泮 药物 失眠症 疾病 适应症', '劳拉西泮 药物 癌症 疾病 适应症', '劳拉西泮 药物 癫痫持续状态 疾病 适应症', '劳拉西泮 药物 原发性慢性闭角型青光眼 疾病 禁忌症', '劳拉西泮 药物 青光眼 疾病 禁忌症', '毒扁豆碱 药物 心动过缓 症状 不良反应', '毒扁豆碱 药物 恶心 症状 不良反应', '毒扁豆碱 药物 眼痛 症状 不良反应', '毒扁豆碱 药物 斜视 疾病 适应症', '毒扁豆碱 药物 青光眼 疾病 适应症', '毒扁豆碱 药物 心脏疾病 疾病 禁忌症', '毒扁豆碱 药物 哮喘 疾病 禁忌症', '毒扁豆碱 药物 肠梗阻 疾病 禁忌症', '毒扁豆碱 药物 糖尿病 疾病 禁忌症', '磷脂 药物 肝脏外伤 疾病 适应症', '磷脂 药物 肝炎 疾病 适应症', '磷脂 药物 脂肪肝 疾病 适应症', '磷脂 药物 蓖麻油 药物 成份', '磷脂 药物 氧 药物 成份', '磷脂 药物 脂肪肝 疾病 适应症', '磷脂 药物 药物性肝病 疾病 适应症', '磷脂 药物 肝炎 疾病 适应症', '磷脂 药物 胆石症 疾病 适应症', '磷脂 药物 肝性脑病 疾病 适应症', '磷脂 药物 银屑病 疾病 适应症', '磷脂 药物 早产儿 疾病 禁忌症', '磷脂 药物 早产 疾病 禁忌症', '他克林 药物 阿尔茨海默病 疾病 适应症', '三唑仑 药物 眼花 症状 不良反应', '三唑仑 药物 头晕 症状 不良反应', '三唑仑 药物 恶心 症状 不良反应', '三唑仑 药物 头昏眼花 症状 不良反应', '三唑仑 药物 嗜睡 症状 不良反应', '三唑仑 药物 头昏 症状 不良反应', '三唑仑 药物 青光眼 疾病 禁忌症', '三唑仑 药物 原发性慢性闭角型青光眼 疾病 禁忌症', '人参 药物 休克 疾病 适应症', '去甲替林 药物 嗜睡 症状 不良反应', '去甲替林 药物 视物模糊  症状 不良反应', '去甲替林 药物 心动过速 症状 不良反应', '去甲替林 药物 口干 症状 不良反应', '去甲替林 药物 心脏疾病 疾病 禁忌症', '去甲替林 药物 青光眼 疾病 禁忌症', '多塞平 药物 心悸 症状 不良反应', '多塞平 药物 紫癜 症状 不良反应', '多塞 平 药物 恶心 症状 不良反应', '多塞平 药物 手足麻木 症状 不良反应', '多塞平 药物 头晕 症状 不良反应', '多塞平 药物 嗜睡  症状 不良反应', '多塞平 药物 食欲缺乏 症状 不良反应', '多塞平 药物 口干 症状 不良反应', '多塞平 药物 体重增加 症状 不良 反应', '多塞平 药物 疲劳 症状 不良反应', '多塞平 药物 视物模糊 症状 不良反应', '多塞平 药物 麻疹感染 疾病 适应症', '多塞平 药物 荨麻疹 疾病 适应症', '多塞平 药物 带状疱疹感染 疾病 适应症', '多塞平 药物 慢性荨麻疹 疾病 适应症', '多塞平 药物 恐怖症 疾病 适应症', '多塞平 药物 抑郁症 疾病 适应症', '多塞平 药物 皮炎 疾病 适应症', '多塞平 药物 疱疹 疾病 适应症', '多塞平 药物 哮喘 疾病 禁忌症', '多塞平 药物 ST段抬高型心肌梗死 疾病 禁忌症', '多塞平 药物 青光眼 疾病 禁忌症', '多塞平  药物 精神分裂症 疾病 禁忌症', '硫利达嗪 药物 口干 症状 不良反应', '硫利达嗪 药物 充血 症状 不良反应', '硫利达嗪 药物 视 物模糊 症状 不良反应', '硫利达嗪 药物 心悸 症状 不良反应', '硫利达嗪 药物 喉头水肿 症状 不良反应', '硫利达嗪 药物 恶心  症状 不良反应', '硫利达嗪 药物 面色苍白 症状 不良反应', '硫利达嗪 药物 体重增加 症状 不良反应', '硫利达嗪 药物 乏力 症状 不良反应', '硫利达嗪 药物 紧张 症状 不良反应', '硫利达嗪 药物 头晕 症状 不良反应', '硫利达嗪 药物 神经官能症 疾病 适应 症', '硫利达嗪 药物 精神分裂症 疾病 适应症', '硫利达嗪 药物 焦虑障碍 疾病 适应症', '硫利达嗪 药物 昏迷 疾病 禁忌症', '短效胰岛素 药物 乏力 症状 不良反应', '短效胰岛素 药物 糖尿 症状 不良反应', '短效胰岛素 药物 瘙痒 症状 不良反应', '短效胰岛素 药物 心悸 症状 不良反应', '短效胰岛素 药物 失水 症状 不良反应', '短效胰岛素 药物 糖尿病 疾病 适应症', '短效胰岛素 药 物 胰岛素依赖性糖尿病 疾病 适应症', '短效胰岛素 药物 心律失常 疾病 适应症', '短效胰岛素 药物 肺结核 疾病 适应症', '短效 胰岛素 药物 登革热 疾病 适应症', '短效胰岛素 药物 休克 疾病 适应症', '短效胰岛素 药物 昏迷 疾病 适应症', '短效胰岛素 药 物 低血糖 疾病 适应症', '短效胰岛素 药物 肾小球肾炎 疾病 适应症', '短效胰岛素 药物 妊娠糖尿病 疾病 适应症', '胞磷胆碱 药物 意识障碍 疾病 适应症', '胞磷胆碱 药物 烦躁不安 症状 不良反应', '胞磷胆碱 药物 恶心 症状 不良反应', '胞磷胆碱 药物 复 视 症状 不良反应', '胞磷胆碱 药物 食欲不振 症状 不良反应', '胞磷胆碱 药物 心动过缓 症状 不良反应', '胞磷胆碱 药物 胃痛  症状 不良反应', '胞磷胆碱 药物 心动过速 症状 不良反应', '胞磷胆碱 药物 脑外伤 疾病 适应症', '胞磷胆碱 药物 意识障碍 疾病 适应症', '胞磷胆碱 药物 神经性耳聋 疾病 适应症', '胞磷胆碱 药物 耳聋 疾病 适应症', '胞磷胆碱 药物 耳鸣 疾病 适应症', ' 萘呋胺 药物 上腹部疼痛 症状 不良反应', '萘呋胺 药物 恶心 症状 不良反应', '萘呋胺 药物 糖尿病 疾病 适应症', '萘呋胺 药物 中风 疾病 适应症', '萘呋胺 药物 眩晕 疾病 适应症', '萘呋胺 药物 痴呆 疾病 适应症', '萘呋胺 药物 房室传导阻滞 疾病 禁忌症', '地西泮 药物 青光眼 疾病 禁忌症', '地西泮 药物 乏力 症状 不良反应', '地西泮 药物 恶心 症状 不良反应', '地西泮 药物 幻觉 症状 不良反应', '地西泮 药物 口干 症状 不良反应', '地西泮 药物 嗜睡 症状 不良反应', '地西泮 药物 头昏 症状 不良反应', '地西泮 药物 无力 症状 不良反应', '地西泮 药物 普通感冒 疾病 适应症', '地西泮 药物 焦虑障碍 疾病 适应症', '地西泮 药物 破伤风 疾病 适应症', '地西泮 药物 抑郁症 疾病 适应症', '地西泮 药物 僵人综合征 疾病 适应症', '地西泮 药物 失眠症 疾病 适应症', '地西泮 药物 癫痫持续状态 疾病 适应症', '地西泮 药物 恐怖症 疾病 适应症', '地西泮 药物 手足徐动型 疾病 适应症', '地西泮 药物 戒酒综合征 疾病 适应症', '地西泮 药物 运动神经元病 疾病 适应症', '奥沙西泮 药物 恶心 症状 不良反应', '奥沙西泮 药物 头昏 症状 不良反应', '奥沙西泮 药物 焦虑障碍 疾病 适应症', '奥沙西泮 药物 失眠症 疾病 适应症', '奋乃静 药物 心悸 症状 不良反应', '奋乃静 药物 口干 症状 不良反应', '奋乃静 药物 神经官能症 疾病 适应症', '奋乃静 药物 呕吐 疾病 适应症', '奋乃静 药物 呃逆 疾病 适应症', '奋乃静 药物 精神分裂症 疾病 适应症', '奋乃静 药物 药物过敏 疾病 禁忌症', '奥氮平 药物 口干 症状 不良反应', '奥氮平 药物 恶心 症状 不良反应', '奥氮平 药物 无力 症状 不良反应', '奥氮平 药物 心动过缓 症状 不良反应', '奥氮平 药物 衰弱 症状 不良反应', '奥氮平 药物 体重增加 症状 不良反应', '奥氮平 药物 嗜酸性粒细胞增多 症状 不良反应', '奥氮平 药物 乏力 症状 不良反应', '奥氮平 药物 精神分裂症 疾病 适应症', '奥氮平 药物 精神分裂症 疾病 适应症', '奥氮平 药物 精神疾病 疾病 适应症', '替马西泮 药物 紧张 症状 不良反应', '替马西泮 药物 疲乏 症状 不良反应', '替马西泮 药物 头晕 症状 不良反应', '替马西泮 药物 无力 症状 不良反应', '替马西泮 药物 嗜睡 症状 不良反应', '替马西泮 药物 口干 症状 不良反应', '替马西泮 药物 失眠症 疾病 适应症', '替马西泮 药物 焦虑障碍 疾病 适应症', '替马西泮 药物 早期妊娠 疾病 禁忌症', '氯贝胆碱 药物 肠梗阻 疾病 禁忌症', '氯贝胆碱 药物 癫痫持续状态 疾病 禁忌症', '氯贝胆碱 药物 哮喘 疾病 禁忌症', '氯贝胆碱 药物 消化性溃疡 疾病 禁忌症', '氯贝胆碱 药物 甲状旁腺功能亢进症 疾病 禁忌症', '氯贝胆碱 药物 传导阻滞 症状 不良反应', '氯贝胆碱 药物 腹部不适 症状 不良反应', '氯贝胆碱 药物 恶心 症状 不良反应', '氯贝胆碱 药物 尿急 症状 不良反应', '氯贝胆碱 药物 胀气 疾病 适应症', '多奈哌齐 药物 苯妥英钠 药物 药物相互作用', '多奈哌齐 药物 疲乏 症状 不良反应', '多奈哌齐 药物 头晕 症状 不良反应', '多奈哌齐 药物 疲劳 症状 不良反应', '多奈哌齐 药物 传导阻滞 症状 不良反应', '多奈哌齐 药物 胃痛 症 状 不良反应', '多奈哌齐 药物 体重减轻 症状 不良反应', '多奈哌齐 药物 心动过缓 症状 不良反应', '多奈哌齐 药物 厌食 症状  不良反应', '多奈哌齐 药物 嗜睡 症状 不良反应', '多奈哌齐 药物 幻觉 症状 不良反应', '多奈哌齐 药物 恶心 症状 不良反应', '多奈哌齐 药物 食欲减退 症状 不良反应', '多奈哌齐 药物 多梦 症状 不良反应', '多奈哌齐 药物 乏力 症状 不良反应', '多奈哌齐 药物 阿尔茨海默病 疾病 适应症', '多奈哌齐 药物 痴呆 疾病 适应症', '多奈哌齐 药物 阿尔茨海默病 疾病 适应症', '左旋多巴  药物 消化性溃疡 疾病 禁忌症', '左旋多巴 药物 糖尿病 疾病 禁忌症', '左旋多巴 药物 青光眼 疾病 禁忌症', '左旋多巴 药物 高 血压 疾病 禁忌症', '左旋多巴 药物 心律失常 疾病 禁忌症', '左旋多巴 药物 精神障碍 症状 不良反应', '左旋多巴 药物 心动过速 症状 不良反应', '左旋多巴 药物 食欲缺乏 症状 不良反应', '左旋多巴 药物 厌食 症状 不良反应', '左旋多巴 药物 恶心 症状 不良反应', '左旋多巴 药物 心悸 症状 不良反应', '左旋多巴 药物 幻觉 症状 不良反应', '左旋多巴 药物 消化性溃疡 疾病 适应症', '左旋多巴 药物 肝性脑病 疾病 适应症', '左旋多巴 药物 痴呆 疾病 适应症', '左旋多巴 药物 溃疡病 疾病 适应症', '利凡斯的明 药物 地西泮 药物 药物相互作用', '利凡斯的明 药物 华法令 药物 药物相互作用', '利凡斯的明 药物 痴呆 疾病 适应症', '利凡斯的明 药物 二氧化钛 药物 成份', '利凡斯的明 药物 氧 药物 成份', '利凡斯的明 药物 恶心 症状 不良反应', '利凡斯的明 药物 传导阻滞 症状 不良反应', '利凡斯的明 药物 无力 症状 不良反应', '利凡斯的明 药物 疲劳 症状 不良反应', '利凡斯的明 药物 食欲减退 症状 不良反应', '利凡斯的明 药物 阿尔茨海默病 疾病 适应症', '利凡斯的明 药物 痴呆 疾病 适应症', '苄丝肼 药物 帕金森病 疾病 适应症', '苄丝肼 药物 消化性溃疡 疾病 禁忌症', '西拉吲哚 药物 皮肤癌 疾病 禁忌症', '西拉吲哚 药物 青光眼 疾病 禁忌症', '西拉吲哚 药物 精神障碍 症状 不良反应', '西拉吲哚 药物 恶心 症状 不良反应', '西拉吲哚 药物 厌食 症状 不良反应', '西拉吲哚 药物 帕金森病 疾病 适应症', '培高利特 药物 窦性心动过速 疾病 禁忌症', '培高利特 药物 房性期前收缩 疾病 禁忌症', '培高利特 药物 眩晕 疾病 禁忌症', '培高利特 药物 精神疾病 疾病 禁忌症', '培高利特 药物 早搏 疾病 禁忌症', '培高利特 药 物 无力 症状 不良反应', '培高利特 药物 食欲减退 症状 不良反应', '培高利特 药物 胃痛 症状 不良反应', '培高利特 药物 抽搐 症状 不良反应', '培高利特 药物 心悸 症状 不良反应', '培高利特 药物 心动过速 症状 不良反应', '培高利特 药物 幻觉 症状 不 良反应', '培高利特 药物 恶心 症状 不良反应', '培高利特 药物 流鼻涕 症状 不良反应', '培高利特 药物 复视 症状 不良反应', '培高利特 药物 口干 症状 不良反应', '培高利特 药物 嗜睡 症状 不良反应', '培高利特 药物 肢端肥大症 疾病 适应症', '培高利特 药物 高泌乳素血症 疾病 适应症', '培高利特 药物 脑炎 疾病 适应症', '培高利特 药�� 帕金森病 疾病 适应症', '多巴胺 药物 嗜铬细胞瘤 疾病 禁忌症', '多巴胺 药物 高血压 疾病 禁忌症', '多巴胺 药物 心悸 症状 不良反应', '多巴胺 药物 恶心 症状 不良反应', '多巴胺 药物 心源性休克 疾病 适应症', '多巴胺 药物 休克 疾病 适应症', '多巴丝肼 药物 脑炎 疾病 适应症', '多巴丝肼 药物 动脉硬化 疾病 适应症', '多巴丝肼 药物 厌食 症状 不良反应', '多巴丝肼 药物 嗜睡 症状 不良反应', '多巴丝肼 药物 恶心 症状 不良反应', '多巴丝肼 药物 幻觉 症状 不良反应', '多巴丝肼 药物 脑炎 疾病 适应症', '多巴丝肼 药物 动脉硬化 疾病 适应症', '多巴丝肼 药物 内分泌失调 疾病 禁忌症', '性欲减退 症状 勃起功能障碍 疾病 相关疾病', '性欲减退 症状 尿浓缩试验 诊疗 检查', '纳差 症状 功能性消化不良 疾病 相关疾病', '纳差 症状 胃液潜血试验 诊疗 检查', '纳差 症状 胃液乳酸测定 诊疗 检查', '纳差 症状 吐血痰 症状 相关症状', '昏迷 疾病 脑电图检查 诊疗 影像学检查', '昏迷 疾病 中度昏迷 症状 临床症状及体征', '昏迷 疾病 大小便失禁 症状 临床症状及体征', '头孢呋辛 药物 葡萄糖酸钙 药物 药物相互作用', '头孢呋辛 药物 哌甲酯 药物 药物相互作用', '头孢呋辛 药物 间羟胺 药物 药物相互作用', '头孢呋辛 药物 氯化钙 药物 药物相互作用', '头孢呋辛 药物 去甲肾上腺素 药物 药物相互作用', '头孢呋辛 药物 苯妥英钠 药物 药物相互作用', '头孢呋辛 药物 林可霉素 药物 药物相互作用', '头孢呋辛  药物 卡那霉素 药物 药物相互作用', '头孢呋辛 药物 丙氯拉嗪 药物 药物相互作用', '头孢呋辛 药物 新霉素 药物 药物相互作用', '头孢呋辛 药物 甲氧西林 药物 药物相互作用', '头孢呋辛 药物 氨茶碱 药物 药物相互作用', '头孢呋辛 药物 利多卡因 药物 药物 相互作用', '头孢呋辛 药物 妥布霉素 药物 药物相互作用', '头孢呋辛 药物 庆大霉素 药物 药物相互作用', '头孢呋辛 药物 胆红素升高 症状 不良反应', '头孢呋辛 药物 无力 症状 不良反应', '头孢呋辛 药物 嗜酸性粒细胞增多 症状 不良反应', '头孢呋辛 药物 食欲减退 症状 不良反应', '头孢呋辛 药物 头晕 症状 不良反应', '头孢呋辛 药物 败血症 疾病 适应症', '头孢呋辛 药物 脑膜炎  疾病 适应症', '头孢呋辛 药物 淋病 疾病 适应症', '头孢呋辛 药物 精神分裂症 疾病 适应症', '头孢呋辛 药物 泌尿道感染 疾病  适应症', '头孢呋辛 药物 氧 药物 成份', '头孢呋辛 药物 直肠炎 疾病 适应症', '头孢呋辛 药物 急性支气管炎 疾病 适应症', '头孢呋辛 药物 气管炎 疾病 适应症', '头孢呋辛 药物 脑膜炎 疾病 适应症', '头孢呋辛 药物 流行性感冒 疾病 适应症', '头孢呋辛  药物 溶血性贫血 疾病 适应症', '头孢呋辛 药物 细菌性肺炎 疾病 适应症', '头孢呋辛 药物 细菌感染 疾病 适应症', '头孢呋辛 药物 疖 疾病 适应症', '头孢呋辛 药物 肺脓肿 疾病 适应症', '头孢呋辛 药物 上呼吸道感染 疾病 适应症', '头孢呋辛 药物 慢性肾 盂肾炎 疾病 适应症', '头孢呋辛 药物 肺炎 疾病 适应症', '头孢呋辛 药物 成人慢性支气管炎 疾病 适应症', '头孢呋辛 药物 蜂窝织炎 疾病 适应症', '头孢呋辛 药物 支气管炎 疾病 适应症', '头孢呋辛 药物 败血症 疾病 适应症', '头孢呋辛 药物 痛风 疾病 适应症', '头孢呋辛 药物 鼻旁窦炎 疾病 适应症', '头孢呋辛 药物 脓疱病 疾病 适应症', '头孢呋辛 药物 膀胱炎 疾病 适应症', '头孢呋辛 药物 支气管扩张 疾病 适应症', '头孢呋辛 药物 心内膜炎感染 疾病 适应症', '头孢呋辛 药物 肠炎 疾病 适应症', '头孢呋辛 药物 淋病 疾病 适应症', '头孢呋辛 药物 肾炎 疾病 适应症', '头孢呋辛 药物 泌尿道感染 疾病 适应症', '头孢呋辛 药物 咽炎 疾病 适应症', '头孢呋辛 药物 宫颈炎 疾病 适应症', '头孢呋辛 药物 感染 疾病 适应症', '头孢呋辛 药物 尿道炎 疾病 适应症', '头孢呋辛 药物 呼吸道感染 疾病 适应症', '头孢呋辛 药物 大咯血 疾病 适应症', '头孢呋辛 药物 中耳炎 疾病 适应症', '尼麦角林 药物 嗜睡 症状 不良反应', '尼麦角林 药物 恶心 症状 不良反应', '尼麦角林 药物 头晕 症状 不良反应', '尼麦角林 药物 头昏眼花 症状 不良反应', '尼麦角林 药物 头昏 症状 不良反应', '尼麦角林 药物 眼花 症状 不良反应', '尼麦角林 药物 烦躁不安 症 状 不良反应', '尼麦角林 药物 心动过缓 症状 不良反应', '尼麦角林 药物 胃痛 症状 不良反应', '尼麦角林 药物 耳鸣 疾病 适应 症', '尼麦角林 药物 语言障碍 疾病 适应症', '尼麦角林 药物 失眠症 疾病 适应症', '尼麦角林 药物 IgA肾病 疾病 适应症', '尼 麦角林 药物 低血压 疾病 禁忌症', '甲磺酸双氢麦角毒碱 药物 充血 症状 不良反应', '甲磺酸双氢麦角毒碱 药物 嗜睡 症状 不良反应', '甲磺酸双氢麦角毒碱 药物 视物模糊 症状 不良反应', '甲磺酸双氢麦角毒碱 药物 恶心 症状 不良反应', '甲磺酸双氢麦角毒碱 药物 乏力 症状 不良反应', '甲磺酸双氢麦角毒碱 药物 厌食 症状 不良反应', '甲磺酸双氢麦角毒碱 药物 眩晕 疾病 适应症', '甲磺酸双氢麦角毒碱 药物 耳鸣 疾病 适应症', '甲磺酸双氢麦角毒碱 药物 缺陷多动障碍 疾病 适应症', '甲磺酸双氢麦角毒碱 药物 痴呆 疾病 适应症', '甲磺酸双氢麦角毒碱 药物 偏头痛 疾病 适应症', '甲磺酸双氢麦角毒碱 药物 高泌乳素血症 疾病 适应症', '甲磺酸双氢麦角毒碱 药物 帕金森病 疾病 适应症', '甲磺酸双氢麦角毒碱 药物 动脉硬化 疾病 禁忌症', '阿米三嗪 药物 嗜睡 症状 不良反应', '阿米三嗪 药物 胃痛 症状 不良反应', '阿米三嗪 药物 头晕 症状 不良反应', '阿米三嗪 药物 心动过速 症状 不良反应', '阿米三嗪 药物 呼吸急促 症状 不良反应', '阿米三嗪 药物 心悸 症状 不良反应', '阿米三嗪 药物 恶心 症状 不良反应', '阿米三嗪 药物 耳鸣 疾病 适应症', '阿米三嗪 药物 耳聋 疾病 适应症', '阿米三嗪 药物 老年性耳聋 疾病 适应症', '阿米三嗪 药物 眩晕  疾病 适应症', '脑蛋白水解物 药物 痴呆 疾病 适应症', '脑蛋白水解物 药物 中风 疾病 适应症', '脑蛋白水解物 药物 脑损伤 疾病 适应症', '脑蛋白水解物 药物 颅脑损伤 疾病 适应症', '脑蛋白水解物 药物 谷氨酸 药物 成份', '脑蛋白水解物 药物 氧 药物 成 份', '脑蛋白水解物 药物 胰蛋白酶 药物 成份', '脑蛋白水解物 药物 赖氨酸 药物 成份', '脑蛋白水解物 药物 阿普唑仑 药物 成份', '脑蛋白水解物 药物 腺苷蛋氨酸 药物 成份', '脑蛋白水解物 药物 甘露醇 药物 成份', '脑蛋白水解物 药物 憋气 症状 不良反应', '脑蛋白水解物 药物 恶心 症状 不良反应', '脑蛋白水解物 药物 紫绀 症状 不良反应', '脑蛋白水解物 药物 口干 症状 不良反应', '脑蛋白水解物 药物 心悸 症状 不良反应', '脑蛋白水解物 药物 斑丘疹 症状 不良反应', '脑蛋白水解物 药物 气短 症状 不良反应', '脑蛋白水解物 药物 头晕 症状 不良反应', '脑蛋白水解物 药物 背痛 症状 不良反应', '脑蛋白水解物 药物 紧张 症状 不良反应', '脑蛋白水解物 药物 皮肤瘙痒 症状 不良反应', '脑蛋白水解物 药物 心动过速 症状 不良反应', '脑蛋白水解物 药物 丘疹 症 状 不良反应', '脑蛋白水解物 药物 寒战 症状 不良反应', '脑蛋白水解物 药物 斑疹 症状 不良反应', '脑蛋白水解物 药物 呼吸急 促 症状 不良反应', '脑蛋白水解物 药物 中风 疾病 适应症', '脑蛋白水解物 药物 绝经与阿尔茨海默病综合征 疾病 适应症', '脑蛋白水解物 药物 阿尔茨海默病 疾病 适应症', '脑蛋白水解物 药物 脑外伤 疾病 适应症', '脑蛋白水解物 药物 痴呆 疾病 适应症', '脑蛋白水解物 药物 绝经 疾病 适应症', '脑蛋白水解物 药物 癫痫持续状态 疾病 禁忌症', '茴拉西坦 药物 记忆障碍 疾病 适应症', '茴拉西坦 药物 痴呆 疾病 适应症', '茴拉西坦 药物 头昏 症状 不良反应', '茴拉西坦 药物 头晕 症状 不良反应', '茴拉西坦 药 物 厌食 症状 不良反应', '茴拉西坦 药物 食欲减退 症状 不良反应', '茴拉西坦 药物 嗜睡 症状 不良反应', '茴拉西坦 药物 口干 症状 不良反应', '茴拉西坦 药物 贫血 疾病 适应症', '茴拉西坦 药物 脑外伤 疾病 适应症', '茴拉西坦 药物 阿尔茨海默病 疾病  适应症', '人纤维蛋白原 药物 出血 疾病 适应症', '阿米三嗪萝巴新 药物 眩晕 疾病 适应症', '阿米三嗪萝巴新 药物 抽搐 症状 不良反应', '阿米三嗪萝巴新 药物 胃痛 症状 不良反应', '阿米三嗪萝巴新 药物 胸闷 症状 不良反应', '阿米三嗪萝巴新 药物 体重减轻 症状 不良反应', '阿米三嗪萝巴新 药物 心悸 症状 不良反应', '阿米三嗪萝巴新 药物 尿急 症状 不良反应', '阿米三嗪萝巴新  药物 恶心 症状 不良反应', '阿米三嗪萝巴新 药物 头晕 症状 不良反应', '阿米三嗪萝巴新 药物 哮喘 疾病 禁忌症', '核糖核酸染 色 诊疗 先天性白血病 疾病 相关疾病', '核糖核酸染色 诊疗 白血病 疾病 相关疾病', '核糖核酸染色 诊疗 贫血 疾病 相关疾病', '核糖核酸染色 诊疗 单核细胞白血病 疾病 相关疾病', '核糖核酸染色 诊疗 持续性发热 症状 相关症状', '核糖核酸染色 诊疗 齿龈出血 症状 相关症状', '阿司匹林 药物 牙痛 疾病 适应症', '阿司匹林 药物 流行性感冒 疾病 适应症', '阿司匹林 药物 痛风 疾病 适应症', '阿司匹林 药物 头痛 疾病 适应症', '阿司匹林 药物 血栓形成 疾病 适应症', '阿司匹林 药物 痛经 疾病 适应症', '阿司匹林 药物 偏头痛 疾病 适应症', '阿司匹林 药物 发热 疾病 适应症', '阿司匹林 药物 疼痛 疾病 适应症', '阿司匹林 药物 氧 药物 成份', '阿司匹林 药物 碳酸钙 药物 成份', '阿司匹林 药物 淀粉 药物 成份', '阿司匹林 药物 聚维酮 药物 成份', '阿司匹林 药 物 胸闷 症状 不良反应', '阿司匹林 药物 腹部不适 症状 不良反应', '阿司匹林 药物 恶心 症状 不良反应', '阿司匹林 药物 充血 症状 不良反应', '阿司匹林 药物 听力下降 症状 不良反应', '阿司匹林 药物 颅内压增高 症状 不良反应', '阿司匹林 药物 厌食 症状 不良反应', '阿司匹林 药物 结膜充血 症状 不良反应', '阿司匹林 药物 瘙痒 症状 不良反应', '阿司匹林 药物 头晕 症状 不良 反应', '阿司匹林 药物 动静脉瘘 疾病 适应症', '阿司匹林 药物 巩膜炎 疾病 适应症', '阿司匹林 药物 缺血性心脏病 疾病 适应症', '阿司匹林 药物 慢性心房颤动 疾病 适应症', '阿司匹林 药物 腹泻病 疾病 适应症', '阿司匹林 药物 心脏疾病 疾病 适应症', '阿司匹林 药物 慢性稳定型心绞痛 疾病 适应症', '阿司匹林 药物 脊椎炎 疾病 适应症', '阿司匹林 药物 心肌炎 疾病 适应症', '阿司匹林 药物 咽炎 疾病 适应症', '阿司匹林 药物 骨性关节炎 疾病 适应症', '阿司匹林 药物 风湿热 疾病 适应症', '阿司匹林 药 物 不稳定型心绞痛 疾病 适应症', '阿司匹林 药物 骨关节炎 疾病 适应症', '阿司匹林 药物 强直性脊柱炎 疾病 适应症', '阿司匹 林 药物 流行性感冒 疾病 适应症', '阿司匹林 药物 脂性渐进性坏死 疾病 适应症', '阿司匹林 药物 风湿性关节炎 疾病 适应症', '阿司匹林 药物 蛔虫病 疾病 适应症', '阿司匹林 药物 心绞痛 疾病 适应症', '阿司匹林 药物 鼻咽炎 疾病 适应症', '阿司匹林 药 物 普通感冒 疾病 适应症', '阿司匹林 药物 胆道蛔虫症 疾病 适应症', '阿司匹林 药物 虹膜睫状体炎 疾病 适应症', '阿司匹林 药物 痛风 疾病 适应症', '阿司匹林 药物 血管炎 疾病 适应症', '阿司匹林 药物 牙痛 疾病 适应症', '阿司匹林 药物 血友病 疾病  禁忌症', '阿司匹林 药物 十二指肠溃疡 疾病 禁忌症', '阿司匹林 药物 免疫缺陷病 疾病 禁忌症', '阿司匹林 药物 贫血 疾病 禁忌症', '阿司匹林 药物 消化性溃疡 疾病 禁忌症', '阿司匹林 药物 哮喘 疾病 禁忌症', '氟桂利嗪 药物 眩晕 疾病 适应症', '氟桂利嗪 药物 前庭功能紊乱 疾病 适应症', '氟桂利嗪 药物 水肿 疾病 适应症', '氟桂利嗪 药物 偏头痛 疾病 适应症', '氟桂利嗪 药物 动脉硬化 疾病 适应症', '氟桂利嗪 药物 小儿癫痫 疾病 适应症', '氟桂利嗪 药物 疼痛 疾病 适应症', '氟桂利嗪 药物 血栓形成  疾病 适应症', '氟桂利嗪 药物 头痛 疾病 适应症', '氟桂利嗪 药物 耳鸣 疾病 适应症', '氟桂利嗪 药物 睡眠障碍 疾病 适应症', '氟桂利嗪 药物 呕吐 疾病 适应症', '氟桂利嗪 药物 桂利嗪 药物 成份', '氟桂利嗪 药物 胃痛 症状 不良反应', '氟桂利嗪 药物  呆滞 症状 不良反应', '氟桂利嗪 药物 肌肉酸痛 症状 不良反应', '氟桂利嗪 药物 恶心 症状 不良反应', '氟桂利嗪 药物 体重增加 症状 不良反应', '氟桂利嗪 药物 嗜睡 症状 不良反应', '氟桂利嗪 药物 口干 症状 不良反应', '氟桂利嗪 药物 眩晕 疾病 适应症', '氟桂利嗪 药物 前庭功能紊乱 疾病 适应症', '氟桂利嗪 药物 出血性疾病 疾病 禁忌症', '氟桂利嗪 药物 脑梗 疾病 禁忌症', '氟桂利嗪 药物 高血压脑出血 疾病 禁忌症', '葛根素 药物 碳酸氢钠 药物 成份', '葛根素 药物 甘露醇 药物 成份', '葛根素 药物 葡萄糖 药物 成份', '葛根素 药物 葛根 药物 成份', '葛根素 药物 枸橼酸钠 药物 成份', '葛根素 药物 恶心 症状 不良反应', '葛根素 药物 寒战 症状 不良反应', '葛根素 药物 脑梗 疾病 适应症', '葛根素 药物 强直性脊柱炎 疾病 适应症', '葛根素 药物 心脏疾病 疾病 适应症', '葛根素 药物 耳聋 疾病 适应症', '葛根素 药物 室性心动过速 疾病 适应症', '葛根素 药物 缺血性心脏病 疾 病 适应症', '葛根素 药物 突发性耳聋 疾病 适应症', '葛根素 药物 心绞痛 疾病 适应症', '葛根素 药物 心律失常 疾病 适应症', '葛根素 药物 室性期前收缩 疾病 适应症', '葛根素 药物 早搏 疾病 适应症', '葛根素 药物 糖尿病 疾病 适应症', '葛根素 药物  心肌炎 疾病 适应症', '葛根素 药物 耳聋 疾病 适应症', '葛根素 药物 心肌梗塞 疾病 适应症', '葛根素 药物 突发性耳聋 疾病 适应症', '葛根素 药物 心绞痛 疾病 适应症', '石杉碱甲 药物 滑石 药物 成份', '石杉碱甲 药物 淀粉 药物 成份', '石杉碱甲 药物 乏力 症状 不良反应', '石杉碱甲 药物 恶心 症状 不良反应', '石杉碱甲 药物 头晕 症状 不良反应', '石杉碱甲 药物 嗜睡 症状 不良反应', '石杉碱甲 药物 阿尔茨海默病 疾病 适应症', '石杉碱甲 药物 痴呆 疾病 适应症', '石杉碱甲 药物 记忆障碍 疾病 适应症', '石杉碱甲 药物 痴呆 疾病 适应症', '石杉碱甲 药物 记忆障碍 疾病 适应症', '石杉碱甲 药物 性病 疾病 适应症', '石杉碱甲  药物 低血压 疾病 禁忌症', '石杉碱甲 药物 哮喘 疾病 禁忌症', '石杉碱甲 药物 心绞痛 疾病 禁忌症', '石杉碱甲 药物 肠梗阻 疾病 禁忌症', '吡硫醇 药物 口干 症状 不良反应', '吡硫醇 药物 食欲减退 症状 不良反应', '吡硫醇 药物 恶心 症状 不良反应', ' 吡硫醇 药物 脑外伤 疾病 适应症', '吡硫醇 药物 脑膜炎 疾病 适应症', '吡硫醇 药物 脑炎 疾病 适应症', '吡硫醇 药物 阿尔茨海默病 疾病 适应症', '腺苷 药物 心房扑动 疾病 禁忌症', '腺苷 药物 慢性心房颤动 疾病 禁忌症', '腺苷 药物 哮喘 疾病 禁忌症', '腺苷 药物 房室传导阻滞 疾病 禁忌症', '腺苷 药物 病态窦房结综合征 疾病 禁忌症', '腺苷 药物 心动过缓 症状 不良反应', '腺苷 药物 背痛 症状 不良反应', '腺苷 药物 心悸 症状 不良反应', '腺苷 药物 恶心 症状 不良反应', '腺苷 药物 头昏 症状 不良反应', '腺苷 药物 头晕 症状 不良反应', '腺苷 药物 阵发性室上性心动过速 疾病 适应症', '三七总皂苷 药物 头昏 症状 不良反应', '三七总皂苷 药物 脑出血后遗症 疾病 适应症', '三七总皂苷 药物 瘫痪 疾病 适应症', '三七总皂苷 药物 高血压脑出血 疾病 适应症', '维生素b6 药物 发热 疾病 适应症', '维生素b6 药物 肠炎 疾病 适应症', '维生素b6 药物 脑病 疾病 适应症', '维生素b6 药 物 感染 疾病 适应症', '维生素b6 药物 功能性消化不良 疾病 适应症', '维生素b6 药物 腹泻病 疾病 适应症', '维生素b6 药物 神 经炎 疾病 适应症', '维生素b6 药物 营养不良 疾病 适应症', '维生素b6 药物 乙醇中毒 疾病 适应症', '维生素b6 药物 共济失调  疾病 适应症', '维生素b6 药物 甲状旁腺功能亢进症 疾病 适应症', '维生素b6 药物 聚维酮 药物 成份', '维生素b6 药物 聚乙二醇 药物 成份', '维生素b6 药物 维生素b1 药物 成份', '维生素b6 药物 淀粉 药物 成份', '维生素b6 药物 滑石 药物 成份', '维生素b6 药物 羧甲基淀粉代血浆 药物 成份', '维生素b6 药物 氧 药物 成份', '维生素b6 药物 浮肿 症状 不良反应', '维生素b6 药物 食 欲缺乏 症状 不良反应', '维生素b6 药物 食欲减退 症状 不良反应', '维生素b6 药物 经前期综合征 疾病 适应症', '维生素b6 药物 小儿胱氨酸病 疾病 适应症', '维生素b6 药物 麻疹感染 疾病 适应症', '维生素b6 药物 贫血 疾病 适应症', '维生素b6 药物 呕吐  疾病 适应症', '维生素b6 药物 失眠症 疾病 适应症', '维生素b6 药物 癫痫持续状态 疾病 适应症', '维生素b6 药物 脱发 疾病 适 应症', '维生素b6 药物 强直性脊柱炎 疾病 适应症', '维生素b6 药物 痤疮 疾病 适应症', '维生素b6 药物 湿疹 疾病 适应症', '维生素b6 药物 视神经炎 疾病 适应症', '维生素b6 药物 荨麻疹 疾病 适应症', '维生素b6 药物 酒渣鼻 疾病 适应症', '维生素b6 药 物 皮炎 疾病 适应症', '维生素b6 药物 网膜炎 疾病 适应症', '维生素b6 药物 癫痫发作 疾病 适应症', '维生素b6 药物 烟酸缺乏 疾病 适应症', '维生素b6 药物 瘢痕 疾病 适应症', '维生素b6 药物 唇炎 疾病 适应症', '维生素b6 药物 神经性皮炎 疾病 适应症', '维生素b6 药物 脂溢性皮炎 疾病 适应症', '川芎嗪 药物 中风 疾病 适应症', '川芎嗪 药物 心脏疾病 疾病 适应症', '川芎嗪 药物 高血压 疾病 适应症', '尼莫地平 药物 枸橼酸钠 药物 成份', '尼莫地平 药物 聚维酮 药物 成份', '尼莫地平 药物 硝苯地平 药物 成份', '尼莫地平 药物 聚乙二醇 药物 成份', '尼莫地平 药物 复视 症状 不良反应', '尼莫地平 药物 体重减轻 症状 不良反应', '尼莫地平 药物 瘙痒 症状 不良反应', '尼莫地平 药物 胃胀 症状 不良反应', '尼莫地平 药物 无力 症状 不良反应', '尼莫地平 药物 心动过缓 症状 不良反应', '尼莫地平 药物 心绞痛 疾病 适应症', '尼莫地平 药物 缺血性心脏病 疾病 适应症', '尼莫地平 药物 痴呆 疾病 适应症', '尼莫地平 药物 心脏疾病 疾病 适应症', '尼莫地平 药物 耳聋 疾病 适应症', '尼莫地平 药物 突发性耳聋 疾病 适应症', '尼莫地平 药物 阿尔茨海默病 疾病 适应症', '尼莫地平 药物 强直性脊柱炎 疾病 适应症', '尼莫地平 药物 中风 疾病 适应症', '尼莫地平 药物 头痛 疾病 适应症', '尼莫地平 药物 血栓形成 疾病 适应症', '尼莫地平 药物 突发性耳聋 疾病 适应 症', '尼莫地平 药物 耳聋 疾病 适应症', '尼莫地平 药物 高血压 疾病 适应症', '尼莫地平 药物 痴呆 疾病 适应症', '尼莫地平  药物 原发性高血压 疾病 适应症', '尼莫地平 药物 心绞痛 疾病 适应症', '尼莫地平 药物 出血 疾病 适应症', '尼莫地平 药物 偏 头痛 疾病 适应症', '尼莫地平 药物 低血压 疾病 禁忌症', '尼莫地平 药物 水肿 疾病 禁忌症', 'γ氨酪酸 药物 无力 症状 不良反应', 'γ氨酪酸 药物 恶心 症状 不良反应', 'γ氨酪酸 药物 头昏 症状 不良反应', 'γ氨酪酸 药物 呼吸抑制 症状 不良反应', 'γ氨酪酸 药物 胸闷 症状 不良反应', 'γ氨酪酸 药物 气急 症状 不良反应', 'γ氨酪酸 药物 肝性脑病 疾病 适应症', 'γ氨酪酸 药 物 昏迷 疾病 适应症', 'γ氨酪酸 药物 偏瘫 疾病 适应症', 'γ氨酪酸 药物 记忆障碍 疾病 适应症', '噻氯匹定 药物 动脉硬化 疾病 适应症', '噻氯匹定 药物 心肌梗塞 疾病 适应症', '噻氯匹定 药物 中风 疾病 适应症', '噻氯匹定 药物 血栓形成 疾病 适应症', '噻氯匹定 药物 紫癜 症状 不良反应', '噻氯匹定 药物 恶心 症状 不良反应', '噻氯匹定 药物 糖尿 症状 不良反应', '噻氯匹定 药物 瘀斑 症状 不良反应', '噻氯匹定 药物 齿龈出血 症状 不良反应', '噻氯匹定 药物 斑丘疹 症状 不良反应', '噻氯匹定 药物  丘疹 症状 不良反应', '噻氯匹定 药物 缺血性心脏病 疾病 适应症', '噻氯匹定 药物 动脉硬化 疾病 适应症', '噻氯匹定 药物 心脏疾病 疾病 适应症', '噻氯匹定 药物 强直性脊柱炎 疾病 适应症', '噻氯匹定 药物 中风 疾病 适应症', '噻氯匹定 药物 溃疡病 疾 病 禁忌症', '三磷酸腺苷 药物 哮喘 疾病 禁忌症', '三磷酸腺苷 药物 病态窦房结综合征 疾病 禁忌症', '三磷酸腺苷 药物 房室传 导阻滞 疾病 禁忌症', '三磷酸腺苷 药物 恶心 症状 不良反应', '三磷酸腺苷 药物 心动过缓 症状 不良反应', '三磷酸腺苷 药物 传导阻滞 症状 不良反应', '三磷酸腺苷 药物 心动过速 症状 不良反应', '三磷酸腺苷 药物 头晕 症状 不良反应', '烟酸 药物 胃胀  症状 不良反应', '烟酸 药物 食欲缺乏 症状 不良反应', '烟酸 药物 糖尿 症状 不良反应', '烟酸 药物 无力 症状 不良反应', '烟 酸 药物 瘙痒 症状 不良反应', '烟酸 药物 皮肤干燥 症状 不良反应', '烟酸 药物 头昏 症状 不良反应', '烟酸 药物 雷诺病 疾病 适应症', '烟酸 药物 后葡萄膜炎 疾病 适应症', '烟酸 药物 节段性透明性血管炎 疾病 适应症', '烟酸 药物 动脉硬化 疾病 适应症', '烟酸 药物 高脂血症 疾病 适应症', '烟酸 药物 IgA肾病 疾病 适应症', '烟酸 药物 网状青斑 疾病 适应症', '烟酸 药物 眩晕 疾病 适应症', '烟酸 药物 多形红斑 疾病 适应症', '烟酸 药物 冻伤 疾病 适应症', '烟酸 药物 营养不良 疾病 适应症', '烟酸 药物 冻伤 疾病 适应症', '烟酸 药物 雷诺综合征 疾病 适应症', '烟酸 药物 血管炎 疾病 适应症', '烟酸 药物 心律失常 疾病 禁忌 症', '烟酸 药物 消化性溃疡 疾病 禁忌症', '烟酸 药物 糖尿病 疾病 禁忌症', '烟酸 药物 低血压 疾病 禁忌症', '肾功能衰竭 症 状 急性肾衰竭 疾病 相关疾病', '肾功能衰竭 症状 肾图检查 诊疗 检查', '肾功能衰竭 症状 急性肾功能衰竭诊断试验 诊疗 检查', '肾功能衰竭 症状 管型蛋白尿 症状 相关症状', '感觉障碍 症状 颈椎椎管狭窄症 疾病 相关疾病', '感觉障碍 症状 中枢神经系统肉 芽肿性血管炎 疾病 相关疾病', '感觉障碍 症状 脑电图检查 诊疗 检查', '感觉障碍 症状 脑诱发电位 诊疗 检查', '感觉障碍 症状 半身麻木 症状 相关症状', '感觉障碍 症状 手足肿胀 症状 相关症状', '耳聋 疾病 唾液尿素氮 诊疗 实验室检查', '耳聋 疾病 先天性畸形 疾病 病因', '耳聋 疾病 关节退行性病变 疾病 病因', '耳聋 疾病 噪声性耳聋 疾病 病因', '耳聋 疾病 梅尼埃病 疾病 病因', '面神经麻痹 疾病 缓冲液 诊疗 实验室检查', '面神经麻痹 疾病 红细胞沉降率 诊疗 实验室检查', '面神经麻痹 疾病 血清免疫球蛋白d 诊疗 实验室检查', '面神经麻痹 疾病 血清乳酸脱氢酶 诊疗 实验室检查', '面神经麻痹 疾病 眼底检查 诊疗 辅助检查', '面 神经麻痹 疾病 感染 疾病 病因', '面神经麻痹 疾病 颅内肿瘤 疾病 病因', '面神经麻痹 疾病 肿瘤 疾病 病因', '偏盲 症状 眼及眶区ct检查 诊疗 检查', '偏盲 症状 半身麻木 症状 相关症状', '颅内出血 疾病 血凝酶 药物 药物治疗', '颅内出血 疾病 维生素k1  药物 药物治疗', '颅内出血 疾病 高血压脑出血 疾病 病理分型', '颅内出血 疾病 原发性蛛网膜下腔出血 疾病 病理分型', '颅内出 血 疾病 NICH 疾病 病理分型', '颅内出血 疾病 脑室周围-脑室内出血 疾病 病理分型', '颅内出血 疾病 窒息 疾病 并发症', '颅内 出血 疾病 意识障碍 疾病 并发症', '颅内出血 疾病 脑内积水 疾病 并发症', '颅内出血 疾病 偏瘫 疾病 并发症', '颅内出血 疾病 上消化道出血 疾病 并发症', '颅内出血 疾病 出血 疾病 并发症', '颅内出血 疾病 电解质紊乱 疾病 并发症', '颅内出血 疾病 惊厥 疾病 并发症', '颅内出血 疾病 脑电图检查 诊疗 辅助检查', '缺血性脑卒中 疾病 依诺肝素钠 药物 药物治疗', '缺血性脑卒中 疾 病 阿替普酶 药物 药物治疗', '缺血性脑卒中 疾病 肝素 药物 药物治疗', '缺血性脑卒中 疾病 阿司匹林 药物 药物治疗', '缺血性 脑卒中 疾病 心电图检查 诊疗 影像学检查', '缺血性脑卒中 疾病 西洛他唑 药物 预防', '缺血性脑卒中 疾病 华法林 药物 预防', '缺血性脑卒中 疾病 双嘧达莫 药物 预防', '缺血性脑卒中 疾病 阿司匹林 药物 预防', '缺血性脑卒中 疾病 氯吡格雷 药物 预防', '缺血性脑卒中 疾病 糖尿 症状 临床症状及体征', '缺血性脑卒中 疾病 偏盲 症状 临床症状及体征', '缺血性脑卒中 疾病 复视 症状 临床症状及体征', '缺血性脑卒中 疾病 凝视麻痹 症状 临床症状及体征', '缺血性脑卒中 疾病 恶心 症状 临床症状及体征', '缺血性脑卒中 疾病 感觉障碍 症状 临床症状及体征', '缺血性脑卒中 疾病 眼肌麻痹 症状 临床症状及体征', '缺血性脑卒中 疾病 精神障碍 症状 临床症状及体征', '缺血性脑卒中 疾病 意识模糊 症状 临床症状及体征', '缺血性脑卒中 疾病 大小便失禁 症状 临床症状及体征', '缺血性脑卒中 疾病 颅内压增高 症状 临床症状及体征', '缺血性脑卒中 疾病 反应迟钝 症状 临床症状及体征', '缺血性脑卒中 疾病 静脉血栓形成 疾病 病因', '缺血性脑卒中 疾病 镰状细胞贫血 疾病 病因', '缺血性脑卒中 疾病 脑动脉硬化症 疾病 病因', '缺血性脑卒中 疾病 糖尿病 疾病 高危因素', '缺血性脑卒中 疾病 慢性心房颤动 疾病 高危因素', '缺血性脑卒中 疾病 颈动脉狭窄  疾病 高危因素', '缺血性脑卒中 疾病 肥胖 疾病 高危因素', '缺血性脑卒中 疾病 抑郁症 疾病 并发症', '缺血性脑卒中 疾病 腹泻 病 疾病 并发症', '缺血性脑卒中 疾病 出血 疾病 并发症', '缺血性脑卒中 疾病 瘫痪 疾病 并发症', '缺血性脑卒中 疾病 睡眠障碍 疾病 并发症', '缺血性脑卒中 疾病 感染 疾病 并发症', '缺血性脑卒中 疾病 应激性溃疡 疾病 并发症', '缺血性脑卒中 疾病 失眠症 疾病 并发症', '缺血性脑卒中 疾病 上消化道出血 疾病 并发症', '缺血性脑卒中 疾病 吸入性肺炎 疾病 并发症', '缺血性脑卒中 疾病 溃疡 疾病 并发症', '缺血性脑卒中 疾病 癫痫发作 疾病 并发症', '缺血性脑卒中 疾病 上消化道出血 疾病 并发症', '缺血性脑卒中 疾病 颅内出血 疾病 并发症', '缺血性脑卒中 疾病 凝血酶原时间 诊疗 实验室检查', '缺血性脑卒中 疾病 低血糖 疾病 鉴别诊断', '缺血性脑卒中 疾病 高血压脑病 疾病 鉴别诊断', '缺血性脑卒中 疾病 颅内出血 疾病 鉴别诊断', '缺血性脑卒中 疾病 短暂性脑缺血发作 疾病 鉴别诊断', '缺血性脑卒中 疾病 韦尼克脑病 疾病 鉴别诊断', '癌症 疾病 支气管肺癌 疾病 病理分型', '癌症  疾病 肝癌 疾病 病理分型', '癌症 疾病 非霍奇金淋巴瘤 疾病 病理分型', '癌症 疾病 恶病质 症状 临床症状及体征', '癌症 疾病  体重减轻 症状 临床症状及体征', '癌症 疾病 视力障碍 症状 临床症状及体征', '癌症 疾病 呕血 症状 临床症状及体征', '癌症 疾 病 食欲不振 症状 临床症状及体征', '癌症 疾病 乏力 症状 临床症状及体征', '金刚烷胺 药物 食欲缺乏 症状 不良反应', '金刚烷 胺 药物 恶心 症状 不良反应', '金刚烷胺 药物 充血 症状 不良反应', '金刚烷胺 药物 咽喉炎 症状 不良反应', '金刚烷胺 药物 幻觉 症状 不良反应', '金刚烷胺 药物 硬化 症状 不良反应', '金刚烷胺 药物 败血症 疾病 适应症', '金刚烷胺 药物 肺炎 疾病 适应症', '金刚烷胺 药物 脑炎 疾病 适应症', '金刚烷胺 药物 帕金森病 疾病 适应症', '金刚烷胺 药物 原发性震颤 疾病 适应症', '干扰素 药物 华法令 药物 药物相互作用', '干扰素 药物 茶碱 药物 药物相互作用', '干扰素 药物 地西泮 药物 药物相互作用', '干扰素 药物 病毒性肝炎 疾病 适应症', '干扰素 药物 外阴恶性黑色素瘤 疾病 适应症', '干扰素 药物 生殖器疣 疾病 适应症', '干扰素 药物 流行性感冒 疾病 适应症', '干扰素 药物 上呼吸道感染 疾病 适应症', '干扰素 药物 肺炎 疾病 适应症', '干扰素 药物 基底细胞癌 疾病 适应症', '干扰素 药物 慢性乙型肝炎 疾病 适应症', '干扰素 药物 毛细胞白血病 疾病 适应症', '干扰素 药物 宫颈炎 疾病 适应症', '干扰素 药物 角膜炎 疾病 适应症', '干扰素 药物 病毒性肺炎 疾病 适应症', '干扰素 药物 肾细胞癌 疾病 适应症', '干扰素 药物 小儿呼吸道合胞病毒肺炎 疾病 适应症', '干扰素 药物 巩膜炎 疾病 适应症', '干扰素 药物 疣 疾病 适应症', '干扰素 药物 性病 疾病 适应症', '干扰素 药物 慢性宫颈炎 疾病 适应症', '干扰素 药物 出血 疾病 适应症', '干扰素 药物 疱疹 疾 病 适应症', '干扰素 药物 淋巴瘤 疾病 适应症', '干扰素 药物 流行性出血热 疾病 适应症', '干扰素 药物 唇疱疹 疾病 适应症', '干扰素 药物 呼吸道感染 疾病 适应症', '干扰素 药物 单纯疱疹感染 疾病 适应症', '干扰素 药物 蕈样肉芽肿病 疾病 适应症', ' 干扰素 药物 HIV感染 疾病 适应症', '干扰素 药物 生殖器疱疹感染 疾病 适应症', '干扰素 药物 软组织类型的横纹肌肉瘤 疾病 适 应症', '干扰素 药物 急性淋巴细胞白血病 疾病 适应症', '干扰素 药物 带状疱疹感染 疾病 适应症', '干扰素 药物 病毒感染 疾病 适应症', '干扰素 药物 感染 疾病 适应症', '干扰素 药物 鼻乳头状瘤 疾病 适应症', '干扰素 药物 结膜炎 疾病 适应症', '干扰素 药物 膀胱癌 疾病 适应症', '干扰素 药物 多发性骨髓瘤 疾病 适应症', '干扰素 药物 白血病 疾病 适应症', '干扰素 药物 肝炎  疾病 适应症', '干扰素 药物 赖氨酸 药物 成份', '干扰素 药物 磷酸二氢钠 药物 成份', '干扰素 药物 苯甲酸 药物 成份', '干扰 素 药物 重组人干扰素α2b 药物 成份', '干扰素 药物 甘露醇 药物 成份', '干扰素 药物 人血白蛋白 药物 成份', '干扰素 药物 山梨醇 药物 成份', '干扰素 药物 甘油 药物 成份', '干扰素 药物 白及 药物 成份', '干扰素 药物 氯化钠 药物 成份', '干扰素 药 物 枸橼酸钠 药物 成份', '干扰素 药物 口干 症状 不良反应', '干扰素 药物 疲劳 症状 不良反应', '干扰素 药物 肌肉酸痛 症状  不良反应', '干扰素 药物 瘙痒 症状 不良反应', '干扰素 药物 腰酸 症状 不良反应', '干扰素 药物 白带 症状 不良反应', '干扰素 药物 寒战 症状 不良反应', '干扰素 药物 刺痛 症状 不良反应', '干扰素 药物 心动过速 症状 不良反应', '干扰素 药物 充血 症 状 不良反应', '干扰素 药物 体重减轻 症状 不良反应', '干扰素 药物 结膜充血 症状 不良反应', '干扰素 药物 急性淋巴细胞白血 病 疾病 适应症', '干扰素 药物 生殖器疱疹 疾病 适应症', '干扰素 药物 瘢痕 疾病 适应症', '干扰素 药物 巩膜炎 疾病 适应症', '干扰素 药物 膀胱癌 疾病 适应症', '干扰素 药物 肺炎 疾病 适应症', '干扰素 药物 软组织类型的横纹肌肉瘤 疾病 适应症', '干扰素 药物 肝炎 疾病 适应症', '干扰素 药物 毛细胞白血病 疾病 适应症', '干扰素 药物 硬皮病 疾病 适应症', '干扰素 药物 流行性出血热 疾病 适应症', '干扰素 药物 肾细胞癌 疾病 适应症', '干扰素 药物 结膜炎 疾病 适应症', '干扰素 药物 疣 疾病 适应症', '干扰素 药物 皮肤肿瘤 疾病 适应症', '干扰素 药物 生殖器疣 疾病 适应症', '干扰素 药物 淋巴瘤 疾病 适应症', '干扰素 药 物 角膜炎 疾病 适应症', '干扰素 药物 眼睑带状疱疹 疾病 适应症', '干扰素 药物 眼部肿瘤 疾病 适应症', '干扰素 药物 带状疱 疹感染 疾病 适应症', '干扰素 药物 单纯疱疹感染 疾病 适应症', '干扰素 药物 带状疱疹性角膜炎 疾病 适应症', '干扰素 药物 白血病 疾病 适应症', '干扰素 药物 慢性乙型肝炎 疾病 适应症', '干扰素 药物 霍奇金淋巴瘤 疾病 适应症', '干扰素 药物 病毒性肝炎 疾病 适应症', '干扰素 药物 瘢痕疙瘩 疾病 适应症', '干扰素 药物 虹膜睫状体炎 疾病 适应症', '干扰素 药物 疱疹 疾病 适应症', '干扰素 药物 卡波西肉瘤 疾病 适应症', '干扰素 药物 流行性出血性结膜炎 疾病 适应症', '干扰素 药物 非霍奇金淋巴瘤 疾 病 适应症', '干扰素 药物 乙型肝炎 疾病 适应症', '干扰素 药物 小儿呼吸道合胞病毒肺炎 疾病 适应症', '干扰素 药物 皮肤病 疾病 适应症', '干扰素 药物 多发性骨髓瘤 疾病 适应症', '干扰素 药物 基底细胞癌 疾病 适应症', '干扰素 药物 皮炎 疾病 适应症', '干扰素 药物 癫痫持续状态 疾病 禁忌症', '干扰素 药物 心绞痛 疾病 禁忌症', '继发感染 症状 食管念珠菌感染 疾病 相关疾病', '继发感染 症状 葡萄球菌感染 疾病 相关疾病', '小脑性共济失调 症状 描图试验 诊疗 检查', '小脑性共济失调 症状 核磁共振成 像mri 诊疗 检查', '抑郁 症状 广泛性焦虑障碍 疾病 相关疾病', '抑郁 症状 酒精性脑萎缩 疾病 相关疾病', '抑郁 症状 产前抑郁 症 症状 相关症状', '抑郁 症状 发癫 症状 相关症状', '构音障碍 症状 半身麻木 症状 相关症状', '认知障碍 疾病 西酞普兰 药物 药物治疗', '认知障碍 疾病 幻觉 症状 临床症状及体征', '认知障碍 疾病 感觉迟钝 症状 临床症状及体征', '普萘洛尔 药物 恶心  症状 不良反应', '普萘洛尔 药物 乏力 症状 不良反应', '普萘洛尔 药物 头晕 症状 不良反应', '普萘洛尔 药物 嗜睡 症状 不良反 应', '普萘洛尔 药物 传导阻滞 症状 不良反应', '普萘洛尔 药物 充血 症状 不良反应', '普萘洛尔 药物 心动过缓 症状 不良反应', '普萘洛尔 药物 疲乏 症状 不良反应', '普萘洛尔 药物 头昏 症状 不良反应', '普萘洛尔 药物 皮肤干燥 症状 不良反应', '普萘洛尔 药物 反应迟钝 症状 不良反应', '普萘洛尔 药物 心律失常 疾病 适应症', '普萘洛尔 药物 心绞痛 疾病 适应症', '普萘洛尔 药 物 原发性震颤 疾病 适应症', '普萘洛尔 药物 原发性高血压 疾病 适应症', '普萘洛尔 药物 缺血性心脏病 疾病 适应症', '普萘洛 尔 药物 心脏疾病 疾病 适应症', '普萘洛尔 药物 高血压 疾病 适应症', '普萘洛尔 药物 强直性脊柱炎 疾病 适应症', '普萘洛尔  药物 肥厚型心肌病 疾病 适应症', '普萘洛尔 药物 嗜铬细胞瘤 疾病 适应症', '普萘洛尔 药物 高血压 疾病 适应症', '普萘洛尔 药物 早搏 疾病 适应症', '普萘洛尔 药物 室性心律失常 疾病 适应症', '普萘洛尔 药物 心绞痛 疾病 适应症', '普萘洛尔 药物 慢性 心房颤动 疾病 适应症', '普萘洛尔 药物 肌病 疾病 适应症', '普萘洛尔 药物 心肌病 疾病 适应症', '普萘洛尔 药物 晕厥 疾病 适应症', '普萘洛尔 药物 心律失常 疾病 适应症', '普萘洛尔 药物 充血性心力衰竭 疾病 禁忌症', '普萘洛尔 药物 病态窦房结综合征 疾病 禁忌症', '普萘洛尔 药物 鼻炎 疾病 禁忌症', '普萘洛尔 药物 休克 疾病 禁忌症', '普萘洛尔 药物 房室传导阻滞 疾病 禁忌症', '普萘洛尔 药物 哮喘 疾病 禁忌症', '普萘洛尔 药物 低血压 疾病 禁忌症', '普萘洛尔 药物 窦性心动过缓 疾病 禁忌症', '普萘洛尔 药物 心源性休克 疾病 禁忌症', '健忘 症状 麻痹性痴呆 疾病 相关疾病', '健忘 症状 单发脑梗死性痴呆 疾病 相关疾病', 'ect检查 诊疗 卡波西肉瘤 疾病 相关疾病', 'ect检查 诊疗 非霍奇金淋巴瘤 疾病 相关疾病', 'ect检查 诊疗 低血糖 疾病 相关疾病', 'ect检查 诊疗 淋巴瘤 疾病 相关疾病', 'ect检查 诊疗 骨肿瘤 疾病 相关疾病', 'ect检查 诊疗 多发性内分泌肿瘤综合征I型 疾病 相关疾病', 'ect检查 诊疗 软组织类型的横纹肌肉瘤 疾病 相关疾病', 'ect检查 诊疗 霍奇金淋巴瘤 疾病 相关疾病', 'ect检查 诊 疗 痛风 疾病 相关疾病', 'ect检查 诊疗 创伤性关节炎 疾病 相关疾病', 'ect检查 诊疗 甲状腺癌 疾病 相关疾病', 'ect检查 诊疗 膀胱癌 疾病 相关疾病', 'ect检查 诊疗 血管网织细胞瘤 疾病 相关疾病', 'ect检查 诊疗 老年人甲状腺癌 疾病 相关疾病', 'ect检 查 诊疗 转移性骨肿瘤 疾病 相关疾病', 'ect检查 诊疗 颅内转移瘤 疾病 相关疾病', 'ect检查 诊疗 灾难反应 症状 相关症状', 'ect检查 诊疗 血小板聚集增强 症状 相关症状', 'ect检查 诊疗 淡漠型甲亢 症状 相关症状', 'ect检查 诊疗 心音异常 症状 相关症状', 'ect检查 诊疗 身痛 症状 相关症状', 'ect检查 诊疗 关节疼痛 症状 相关症状', '代谢障碍性肝肿大 症状 脂肪肝 疾病 相关疾病', '代谢障碍性肝肿大 症状 脾—肝综合征 疾病 相关疾病', '代谢障碍性肝肿大 症状 肝胆胰脾的mri检查 诊疗 检查', '胃肠道癌 疾 病 疲劳 症状 临床症状及体征', '胃肠道癌 疾病 结节 症状 临床症状及体征', '胃肠道癌 疾病 呕血 症状 临床症状及体征', '胃肠 道癌 疾病 体重减轻 症状 临床症状及体征', '胃肠道癌 疾病 气短 症状 临床症状及体征', '胃肠道癌 疾病 恶心 症状 临床症状及体征', '胃肠道癌 疾病 乏力 症状 临床症状及体征', '胃肠道癌 疾病 大肠癌 疾病 病因', '胃肠道癌 疾病 胃癌 疾病 病因', '奔豚气 症状 抽搐 症状 相关症状', '奔豚气 症状 心悸 症状 相关症状', '酚磺乙胺 药物 恶心 症状 不良反应', '酚磺乙胺 药物 高血压脑出血 疾病 适应症', '新生儿呕吐 疾病 血氨 诊疗 实验室检查', '新生儿呕吐 疾病 甘氨酸 诊疗 实验室检查', '新生儿呕吐 疾病 吸入性肺炎 疾病 并发症', '新生儿呕吐 疾病 窒息 疾病 并发症', '新生儿呕吐 疾病 出血 疾病 并发症', '新生儿呕吐 疾病 猝死 疾 病 并发症', '新生儿呕吐 疾病 食欲缺乏 症状 临床症状及体征', '呼吸困难 症状 红细胞破坏部位测定 诊疗 检查', '呼吸困难 症状 发热胸闷 症状 相关症状', '呼吸困难 症状 憋气 症状 相关症状', '先天性甲状腺功能减退症 疾病 黏多糖贮积病 疾病 鉴别诊断', '先天性甲状腺功能减退症 疾病 软骨发育不良 疾病 鉴别诊断', '先天性甲状腺功能减退症 疾病 先天性巨结肠 疾病 鉴别诊断', '先 天性甲状腺功能减退症 疾病 唐氏综合征 疾病 鉴别诊断', '先天性甲状腺功能减退症 疾病 心包积液 疾病 并发症', '先天性甲状腺功能减退症 疾病 胸腔积液 疾病 并发症', '先天性甲状腺功能减退症 疾病 散发性先天性甲低 疾病 病理分型', '先天性甲状腺功能减退症 疾病 感觉迟钝 症状 临床症状及体征', '先天性甲状腺功能减退症 疾病 皮肤粗糙 症状 临床症状及体征', '先天性甲状腺功能减退症 疾病 嗜睡 症状 临床症状及体征', '先天性甲状腺功能减退症 疾病 表情淡漠 症状 临床症状及体征', '先天性甲状腺功能减退症  疾病 心脏扩大 症状 临床症状及体征', '先天性甲状腺功能减退症 疾病 反应迟钝 症状 临床症状及体征', '先天性甲状腺功能减退症 疾病 听力下降 症状 临床症状及体征', '先天性心脏病 疾病 风湿性心脏病 疾病 相关转化', '先天性心脏病 疾病 感染性心内膜炎 疾病 相关转化', '先天性心脏病 疾病 主动脉瓣狭窄 疾病 病理分型', '先天性心脏病 疾病 室间隔缺损 疾病 病理分型', '先天性心脏 病 疾病 儿童先天性动脉导管未闭 疾病 病理分型', '先天性心脏病 疾病 疲乏 症状 临床症状及体征', '先天性心脏病 疾病 呼吸急促 症状 临床症状及体征', '先天性心脏病 疾病 无力 症状 临床症状及体征', '先天性心脏病 疾病 心悸 症状 临床症状及体征', '脐疝 疾病 腹水 疾病 并发症', '脐疝 疾病 肠梗阻 疾病 并发症', '脐疝 疾病 瘢痕 疾病 并发症', '脐疝 疾病 疼痛 疾病 并发症', '脐疝 疾病 上消化道出血 疾病 并发症', '脐疝 疾病 上消化道出血 疾病 并发症', '脐疝 疾病 出血 疾病 并发症', '气管食管瘘 疾病 新生儿呼吸窘迫综合征 疾病 并发症', '气管食管瘘 疾病 呼吸道感染 疾病 并发症', '气管食管瘘 疾病 感染 疾病 并发症', '气管食管瘘 疾病 肺炎 疾病 并发症', '气管食管瘘 疾病 吸入性肺炎 疾病 并发症', '气管食管瘘 疾病 食管内异物 疾病 病因', '隐睾 疾 病 尿促卵泡成熟素 诊疗 实验室检查', '隐睾 疾病 尿黄体生成素 诊疗 实验室检查', '隐睾 疾病 尿睾酮 诊疗 实验室检查', '隐睾 疾病 睾丸损伤 疾病 并发症', '隐睾 疾病 压痛 症状 临床症状及体征', '隐睾 疾病 胃肠道症状 症状 临床症状及体征', '斜视 疾病 弱视 疾病 并发症', '斜视 疾病 疲劳 症状 临床症状及体征', '斜视 疾病 复视 症状 临床症状及体征', '牙周炎 疾病 无力 症状  临床症状及体征', '牙周炎 疾病 压痛 症状 临床症状及体征', '牙周炎 疾病 牙龈出血 症状 临床症状及体征', '牙周炎 疾病 口臭  症状 临床症状及体征', '牙周炎 疾病 牙结石 疾病 病因', '甲种胎儿球蛋白试验 诊疗 肝纤维板层癌 疾病 相关疾病', '甲种胎儿球 蛋白试验 诊疗 软组织类型的横纹肌肉瘤 疾病 相关疾病', '甲种胎儿球蛋白试验 诊疗 原发性肝脂肪肉瘤 疾病 相关疾病', '甲种胎儿球蛋白试验 诊疗 肝炎 疾病 相关疾病', '甲种胎儿球蛋白试验 诊疗 脂肪肉瘤 疾病 相关疾病', '甲种胎儿球蛋白试验 诊疗 肝区痛  症状 相关症状', '甲种胎儿球蛋白试验 诊疗 肝郁气滞 症状 相关症状', '甲种胎儿球蛋白试验 诊疗 肝气不足 症状 相关症状', '甲 种胎儿球蛋白试验 诊疗 紧张 症状 相关症状', '甲种胎儿球蛋白试验 诊疗 脉沉弦 症状 相关症状', '甲种胎儿球蛋白试验 诊疗 肝阴虚 症状 相关症状', '甲种胎儿球蛋白试验 诊疗 肝被膜紧张 症状 相关症状', '甲种胎儿球蛋白试验 诊疗 肝气犯脾 症状 相关症状', '小儿甲状旁腺功能减退症 疾病 血清钙 诊疗 实验室检查', '小儿甲状旁腺功能减退症 疾病 甲状旁腺激素 诊疗 实验室检查', '小儿甲状旁腺功能减退症 疾病 共济失调 疾病 并发症', '小儿甲状旁腺功能减退症 疾病 低血压 疾病 并发症', '小儿甲状旁腺功能减退症 疾病 感染 疾病 并发症', '小儿甲状旁腺功能减退症 疾病 营养不良 疾病 并发症', '小儿甲状旁腺功能减退症 疾病 尿失禁 疾病 并发症', '小儿甲状旁腺功能减退症 疾病 充血性心力衰竭 疾病 并发症', '小儿甲状旁腺功能减退症 疾病 癫痫持续状态 疾病 并发症', '小儿甲状旁腺功能减退症 疾病 头痛 疾病 并发症', '小儿甲状旁腺功能减退症 疾病 脱屑 症状 临床症状及体征', '小儿甲状旁腺功能减退症 疾病 烦躁不安 症状 临床症状及体征', '小儿甲状旁腺功能减退症 疾病 抽搐 症状 临床症状及体征', '小儿甲状旁腺功能减退症 疾病 心悸 症状 临床症状及体征', '小儿甲状旁腺功能减退症 疾病 心电图检查 诊疗 辅助检查', '低血钾 症状 小儿周期性高血钾性麻痹 疾病 相关疾病', '低血钾 症状 小腿乏力 症状 相关症状', '再生障碍性贫血 疾病 感染 疾病 并发症', '再生障碍性贫血  疾病 心脏疾病 疾病 并发症', '再生障碍性贫血 疾病 贫血 疾病 并发症', '再生障碍性贫血 疾病 发热 疾病 并发症', '再生障碍性 贫血 疾病 耳鸣 疾病 并发症', '再生障碍性贫血 疾病 月经过多 疾病 并发症', '再生障碍性贫血 疾病 呕吐 疾病 并发症', '再生障碍性贫血 疾病 出血 疾病 并发症', '再生障碍性贫血 疾病 头痛 疾病 并发症', '再生障碍性贫血 疾病 败血症 疾病 并发症', '再生障碍性贫血 疾病 颅内出血 疾病 并发症', '再生障碍性贫血 疾病 鼻出血 疾病 并发症', '再生障碍性贫血 疾病 重型再障Ⅱ型 疾病 病理分型', '再生障碍性贫血 疾病 急性再障 疾病 病理分型', '再生障碍性贫血 疾病 白血病 疾病 鉴别诊断', '再生障碍性贫血 疾 病 骨髓纤维化 疾病 鉴别诊断', '再生障碍性贫血 疾病 巨幼红细胞性贫血 疾病 鉴别诊断', '再生障碍性贫血 疾病 恶性淋巴瘤 疾病 鉴别诊断', '再生障碍性贫血 疾病 T细胞淋巴瘤 疾病 鉴别诊断', '再生障碍性贫血 疾病 噬血细胞性淋巴组织细胞增生症 疾病 鉴别诊断', '再生障碍性贫血 疾病 脾功能亢进 疾病 鉴别诊断', '原发性慢性闭角型青光眼 疾病 激发试验 诊疗 检查', '原发性慢性闭角型青光眼 疾病 青光眼 疾病 并发症', '原发性慢性闭角型青光眼 疾病 虹膜睫状体炎 疾病 并发症', '原发性慢性闭角型青光眼 疾病 水肿 疾病 并发症', '原发性慢性闭角型青光眼 疾病 出血 疾病 并发症', '原发性慢性闭角型青光眼 疾病 开角型青光眼 疾病 并发症', '原发性慢性闭角型青光眼 疾病 继发性青光眼 疾病 并发症', '原发性慢性闭角型青光眼 疾病 恶心 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 视物模糊 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 充血 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 眼痛 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 虹视 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 疲劳 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 紧张 症状 临床症状及体征', '原发性慢性闭角型青光眼  疾病 青光眼斑 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 视野缺损 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 角膜混浊 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 眼压升高 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 头昏 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 寒战 症状 临床症状及体征', '原发性慢性闭角型青光眼 疾病 眼 胀 症状 临床症状及体征', '手足麻木 症状 糖尿病 疾病 相关疾病', '手足麻木 症状 右腿麻木 症状 相关症状', '手足麻木 症状 手足肿胀 症状 相关症状', '慢性荨麻疹 疾病 食欲缺乏 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 反流食管炎 疾病 鉴别诊断', 'ST段抬高型心肌梗死 疾病 肺炎 疾病 鉴别诊断', 'ST段抬高型心肌梗死 疾病 氯吡格雷 药物 药物治疗', 'ST段抬高型心肌梗死  疾病 多巴酚丁胺 药物 药物治疗', 'ST段抬高型心肌梗死 疾病 肝素 药物 药物治疗', 'ST段抬高型心肌梗死 疾病 吗啡 药物 药物治 疗', 'ST段抬高型心肌梗死 疾病 链激酶 药物 药物治疗', 'ST段抬高型心肌梗死 疾病 埃替非巴肽 药物 药物治疗', 'ST段抬高型心肌梗死 疾病 替罗非班 药物 药物治疗', 'ST段抬高型心肌梗死 疾病 心电图检查 诊疗 影像学检查', 'ST段抬高型心肌梗死 疾病 心源性休克 疾病 相关疾病', 'ST段抬高型心肌梗死 疾病 心动过速 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 心悸 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 面色苍白 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 压痛 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 头昏 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 恶心 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 烦躁不安 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 气急 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 憋气  症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 反应迟钝 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 意识模糊 症状 临 床症状及体征', 'ST段抬高型心肌梗死 疾病 抽搐 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 无尿 症状 临床症状及体征', 'ST段抬高型心肌梗死 疾病 心电图检查 诊疗 辅助检查', 'ST段抬高型心肌梗死 疾病 代谢综合征 疾病 高危因素', 'ST段抬高型心肌梗死 疾病 肥胖 疾病 高危因素', 'ST段抬高型心肌梗死 疾病 充血性心力衰竭 疾病 并发症', 'ST段抬高型心肌梗死 疾病 胸膜炎 疾病 并发症', 'ST段抬高型心肌梗死 疾病 血栓形成 疾病 并发症', 'ST段抬高型心肌梗死 疾病 充血性心力衰竭 疾病 并发症', 'ST段抬高型心肌梗死 疾病 窦性心动过缓 疾病 并发症', 'ST段抬高型心肌梗死 疾病 心包炎 疾病 并发症', 'ST段抬高型心肌梗死 疾病 高热  疾病 并发症', 'ST段抬高型心肌梗死 疾病 心源性休克 疾病 并发症', 'ST段抬高型心肌梗死 疾病 心律失常 疾病 并发症', 'ST段抬 高型心肌梗死 疾病 急性冠脉综合征 疾病 病理分型', 'ST段抬高型心肌梗死 疾病 便秘 疾病 病因', 'ST段抬高型心肌梗死 疾病 血清肌酸激酶同工酶 诊疗 实验室检查', 'ST段抬高型心肌梗死 疾病 α羟丁酸脱氢酶 诊疗 实验室检查', 'ST段抬高型心肌梗死 疾病 脑脊液丙氨酸氨基转移酶 诊疗 实验室检查', 'ST段抬高型心肌梗死 疾病 血清磷酸肌酸激酶 诊疗 实验室检查', 'ST段抬高型心肌梗死 疾 病 血清乳酸脱氢酶 诊疗 实验室检查', '喉头水肿 症状 喉痹 疾病 相关疾病', '喉头水肿 症状 毒素皮肤试验 诊疗 检查', '接触性 皮炎 疾病 感染 疾病 并发症', '接触性皮炎 疾病 皮炎 疾病 并发症', '接触性皮炎 疾病 脓疱 症状 临床症状及体征', '接触性皮炎 疾病 脱屑 症状 临床症状及体征', '接触性皮炎 疾病 丘疹 症状 临床症状及体征', '接触性皮炎 疾病 结痂 症状 临床症状及体征', '接触性皮炎 疾病 恶心 症状 临床症状及体征', '视觉障碍 疾病 青光眼 疾病 药物引起的并发症', '视觉障碍 疾病 白内障 疾病 药物引起的并发症', '视觉障碍 疾病 复视 症状 临床症状及体征', '视觉障碍 疾病 畏光 症状 临床症状及体征', '视觉障碍 疾病 芬戈莫德 药物 药物治疗', '视觉障碍 疾病 金刚烷胺 药物 药物治疗', '视觉障碍 疾病 加巴喷丁 药物 药物治疗', '闭经 疾病 雌激素  诊疗 实验室检查', '闭经 疾病 尿黄体生成素 诊疗 实验室检查', '闭经 疾病 尿促卵泡成熟素 诊疗 实验室检查', '闭经 疾病 孕酮 诊疗 实验室检查', '闭经 疾病 催乳素 诊疗 实验室检查', '闭经 疾病 血清无机磷 诊疗 实验室检查', '闭经 疾病 创伤 症状 临床 症状及体征', '闭经 疾病 嗅觉丧失 症状 临床症状及体征', '闭经 疾病 紧张 症状 临床症状及体征', '闭经 疾病 子宫出血 症状 临床症状及体征', '闭经 疾病 乏力 症状 临床症状及体征', '闭经 疾病 食欲减退 症状 临床症状及体征', '闭经 疾病 嗜睡 症状 临床症状及体征', '闭经 疾病 视力障碍 症状 临床症状及体征', '闭经 疾病 尿急 症状 临床症状及体征', '闭经 疾病 厌食 症状 临床症状及体征', '闭经 疾病 视野缺损 症状 临床症状及体征', '闭经 疾病 尿痛 症状 临床症状及体征', '闭经 疾病 体重减轻 症状 临床症状及体征', '闭经 疾病 不孕 症状 临床症状及体征', '闭经 疾病 结节 症状 临床症状及体征', '闭经 疾病 皮肤干燥 症状 临床症状及体征', '闭经 疾病 压痛 症状 临床症状及体征', '神经官能症 疾病 疲劳 症状 临床症状及体征', '神经官能症 疾病 头晕 症状 临床症状及体征', '神经官能症 疾病 心悸 症状 临床症状及体征', '神经官能症 疾病 气短 症状 临床症状及体征', '神经官能症 疾 病 紧张 症状 临床症状及体征', '神经官能症 疾病 乏力 症状 临床症状及体征', '神经官能症 疾病 胸闷 症状 临床症状及体征', ' 神经官能症 疾病 肠鸣 症状 临床症状及体征', '失水 症状 小儿腹泻病 疾病 相关疾病', '失水 症状 多汗症 疾病 相关疾病', '失水 症状 腹泻病 疾病 相关疾病', '失水 症状 泻物清稀如米泔水 症状 相关症状', '胰岛素依赖性糖尿病 疾病 肺炎 疾病 鉴别诊断', '胰岛素依赖性糖尿病 疾病 急腹症 疾病 鉴别诊断', '胰岛素依赖性糖尿病 疾病 脑膜炎 疾病 鉴别诊断', '胰岛素依赖性糖尿病 疾病 败血症 疾病 鉴别诊断', '胰岛素依赖性糖尿病 疾病 二甲双胍 药物 药物治疗', '胰岛素依赖性糖尿病 疾病 妊娠期高血压 疾病 相关疾病', '胰岛素依赖性糖尿病 疾病 乏力 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 反应迟钝 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 胃纳减退 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 糖尿 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 尿糖 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 失水 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 多饮 症 状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 恶心 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 口渴 症状 临床症状及体 征', '胰岛素依赖性糖尿病 疾病 体重减轻 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 嗜睡 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 视力障碍 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 多尿 症状 临床症状及体征', '胰岛素依赖性糖尿病 疾病 眼底检查 诊疗 辅助检查', '胰岛素依赖性糖尿病 疾病 唾液尿素氮 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 葡萄糖耐量试验 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 实际碳酸氢盐 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 一氧化碳 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 阴离子间隙 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 血清肌酐 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 标准碳酸氢盐 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 乳糜微粒 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 尿β羟丁酸 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 尿酸度 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 血液尿素氮与肌酐比值 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 二氧化碳结合力 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 缓冲液 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 糖化血红蛋白 诊疗 实验室检查', '胰岛素依赖性糖尿病 疾病 糖尿病视网膜病变  疾病 并发症', '胰岛素依赖性糖尿病 疾病 神经炎 疾病 并发症', '胰岛素依赖性糖尿病 疾病 昏迷 疾病 并发症', '胰岛素依赖性糖 尿病 疾病 糖尿病并发症 疾病 并发症', '胰岛素依赖性糖尿病 疾病 视网膜病变 疾病 并发症', '胰岛素依赖性糖尿病 疾病 肾小球肾炎 疾病 并发症', '胰岛素依赖性糖尿病 疾病 糖尿病肾病 疾病 并发症', '胰岛素依赖性糖尿病 疾病 酮症酸中毒 疾病 并发症', '胰岛素依赖性糖尿病 疾病 糖尿病 疾病 并发症', '肺结核 疾病 真菌感染 疾病 鉴别诊断', '肺结核 疾病 组织胞浆菌病 疾病 鉴别诊断', '肺结核 疾病 莫西沙星 药物 药物治疗', '肺结核 疾病 乙胺丁醇 药物 药物治疗', '肺结核 疾病 阿米卡星 药物 药物治疗', '肺结核 疾病 卡那霉素 药物 药物治疗', '肺结核 疾病 吡嗪酰胺 药物 药物治疗', '肺结核 疾病 克拉维酸 药物 药物治疗', '肺结核  疾病 奈韦拉平 药物 药物治疗', '肺结核 疾病 替诺福韦酯 药物 药物治疗', '肺结核 疾病 环丝氨酸 药物 药物治疗', '肺结核 疾病 维生素b6 药物 药物治疗', '肺结核 疾病 丙硫异烟胺 药物 药物治疗', '肺结核 疾病 氯法齐明 药物 药物治疗', '肺结核 疾病 阿 巴卡韦 药物 药物治疗', '肺结核 疾病 亚胺培南 药物 药物治疗', '肺结核 疾病 支气管扩张 疾病 相关疾病', '肺结核 疾病 脓胸  疾病 相关疾病', '肺结核 疾病 乳糜泻 疾病 高危因素', '肺结核 疾病 淋巴瘤 疾病 高危因素', '肺结核 疾病 糖尿病 疾病 高危因 素', '肺结核 疾病 大咯血 疾病 并发症', '肺结核 疾病 支气管扩张 疾病 并发症', '肺结核 疾病 新生儿呼吸窘迫综合征 疾病 并发症', '肺结核 疾病 复钙时间 诊疗 实验室检查', '肺结核 疾病 乏力 症状 临床症状及体征', '肺结核 疾病 胸闷 症状 临床症状及体征', '肺结核 疾病 咳痰 症状 临床症状及体征', '肺结核 疾病 寒战 症状 临床症状及体征', '肺结核 疾病 气急 症状 临床症状及体征', '肺结核 疾病 食欲减退 症状 临床症状及体征', '肺结核 疾病 疲劳 症状 临床症状及体征', '肺结核 疾病 心悸 症状 临床症状及体征', '肺结核 疾病 无力 症状 临床症状及体征', '登革热 疾病 泼尼松龙琥珀酸钠 药物 药物治疗', '登革热 疾病 洛伐他汀 药 物 药物治疗', '登革热 疾病 对乙酰氨基酚 药物 药物治疗', '登革热 疾病 腹水 疾病 相关疾病', '登革热 疾病 血小板减少症 疾病 相关疾病', '登革热 疾病 谵妄 疾病 相关疾病', '登革热 疾病 关节疼痛 症状 临床症状及体征', '登革热 疾病 腰酸 症状 临床症 状及体征', '登革热 疾病 剧烈头痛 症状 临床症状及体征', '登革热 疾病 紫癜 症状 临床症状及体征', '登革热 疾病 上腹不适 症 状 临床症状及体征', '登革热 疾病 背痛 症状 临床症状及体征', '登革热 疾病 斑疹 症状 临床症状及体征', '登革热 疾病 瘀斑 症状 临床症状及体征', '登革热 疾病 继发感染 症状 临床症状及体征', '登革热 疾病 嗜睡 症状 临床症状及体征', '登革热 疾病 恶 心 症状 临床症状及体征', '登革热 疾病 胃肠道症状 症状 临床症状及体征', '登革热 疾病 厌食 症状 临床症状及体征', '登革热  疾病 寒战 症状 临床症状及体征', '登革热 疾病 皮肤湿冷 症状 临床症状及体征', '登革热 疾病 脱屑 症状 临床症状及体征', '登 革热 疾病 食欲不振 症状 临床症状及体征', '登革热 疾病 皮肤干燥 症状 临床症状及体征', '登革热 疾病 荨麻疹 疾病 治疗引起的并发症', '登革热 疾病 过敏性休克 疾病 治疗引起的并发症', '登革热 疾病 肥胖 疾病 高危因素', '登革热 疾病 贫血 疾病 并发症', '登革热 疾病 新生儿呼吸窘迫综合征 疾病 并发症', '登革热 疾病 噬血细胞性淋巴组织细胞增生症 疾病 并发症', '登革热 疾病 感染 疾病 并发症', '登革热 疾病 疼痛 疾病 并发症', '登革热 疾病 胆囊炎 疾病 并发症', '登革热 疾病 急性肾衰竭 疾病 并发症', '登革热 疾病 糖尿病 疾病 并发症', '登革热 疾病 急性阑尾炎 疾病 并发症', '登革热 疾病 心肌炎 疾病 并发症', '登革热 疾 病 肝炎 疾病 并发症', '登革热 疾病 急性胰腺炎 疾病 并发症', '登革热 疾病 心律失常 疾病 并发症', '登革热 疾病 脑炎 疾病  并发症', '登革热 疾病 肝性脑病 疾病 并发症', '登革热 疾病 出血 疾病 并发症', '登革热 疾病 溃疡病 疾病 病因', '登革热 疾 病 感染 疾病 病因', '登革热 疾病 神经病性关节病 疾病 病因', '登革热 疾病 补体结合试验 诊疗 实验室检查', '登革热 疾病 复 钙时间 诊疗 实验室检查', '登革热 疾病 脑脊液压力 诊疗 实验室检查', '登革热 疾病 血红蛋白 诊疗 实验室检查', '登革热 疾病 糖化血红蛋白 诊疗 实验室检查', '登革热 疾病 唾液尿素氮 诊疗 实验室检查', '登革热 疾病 核糖核酸染色 诊疗 实验室检查', '登革热 疾病 白细胞数 诊疗 实验室检查', '登革热 疾病 红细胞比容 诊疗 实验室检查', '登革热 疾病 血清谷草转氨酶 诊疗 实验室检查', '登革热 疾病 红细胞计数 诊疗 实验室检查', '登革热 疾病 钩端螺旋体病 疾病 鉴别诊断', '登革热 疾病 风疹 疾病 鉴别诊断', '登革热 疾病 基孔肯雅热病毒 疾病 鉴别诊断', '登革热 疾病 传染性单核细胞增多症 疾病 鉴别诊断', '登革热 疾病 疟疾感染  疾病 鉴别诊断', '登革热 疾病 拉沙热 疾病 鉴别诊断', '登革热 疾病 立克次体病 疾病 鉴别诊断', '妊娠糖尿病 疾病 葡萄糖耐量 试验 诊疗 检查', '妊娠糖尿病 疾病 巨大胎儿 疾病 并发症', '妊娠糖尿病 疾病 感染 疾病 并发症', '妊娠糖尿病 疾病 糖尿病乳酸性酸中毒 疾病 并发症', '妊娠糖尿病 疾病 妊娠期高血压 疾病 并发症', '妊娠糖尿病 疾病 糖尿病 疾病 并发症', '妊娠糖尿病 疾 病 乳酸酸中毒 疾病 并发症', '妊娠糖尿病 疾病 早产 疾病 并发症', '妊娠糖尿病 疾病 昏迷 疾病 并发症', '妊娠糖尿病 疾病 低 血糖 疾病 并发症', '妊娠糖尿病 疾病 高血压 疾病 并发症', '妊娠糖尿病 疾病 多饮 症状 临床症状及体征', '妊娠糖尿病 疾病 多尿 症状 临床症状及体征', '妊娠糖尿病 疾病 糖尿 症状 临床症状及体征', '妊娠糖尿病 疾病 糖化血红蛋白 诊疗 实验室检查', '妊娠糖尿病 疾病 全血糖化hb 诊疗 实验室检查', '妊娠糖尿病 疾病 血红蛋白 诊疗 实验室检查', '妊娠糖尿病 疾病 葡萄糖耐量试验  诊疗 实验室检查', '妊娠糖尿病 疾病 雌激素 诊疗 实验室检查', '妊娠糖尿病 疾病 肾血流量 诊疗 实验室检查', '上腹部疼痛 症状 胰头癌 疾病 相关疾病', '上腹部疼痛 症状 结核病 疾病 相关疾病', '上腹部疼痛 症状 感染性腹泻 疾病 相关疾病', '上腹部疼痛 症状 腹部外形触诊 诊疗 检查', '上腹部疼痛 症状 饭后胃痛 症状 相关症状', '上腹部疼痛 症状 大便变细 症状 相关症状', '肝功 能衰竭 疾病 代谢性酸中毒 疾病 并发症', '肝功能衰竭 疾病 呼吸性碱中毒 疾病 并发症', '肝功能衰竭 疾病 急性肝衰竭 疾病 病理分型', '肝功能衰竭 疾病 肝衰竭综合征 疾病 病理分型', '肝功能衰竭 疾病 慢性肝衰竭 疾病 病理分型', '肝功能衰竭 疾病 食欲下降 症状 临床症状及体征', '肝功能衰竭 疾病 扑翼样震颤 症状 临床症状及体征', '肝功能衰竭 疾病 嗜睡 症状 临床症状及体征', '肝功能衰竭 疾病 神志不清 症状 临床症状及体征', '肝功能衰竭 疾病 恶心 症状 临床症状及体征', '肝功能衰竭 疾病 烦躁不安 症 状 临床症状及体征', '异丙肾上腺素 药物 休克 疾病 适应症', '异丙肾上腺素 药物 房室传导阻滞 疾病 适应症', '异丙肾上腺素 药物 三度房室传导阻滞 疾病 适应症', '异丙肾上腺素 药物 感染 疾病 适应症', '异丙肾上腺素 药物 肾上腺素 药物 成份', '异丙肾 上腺素 药物 心悸 症状 不良反应', '异丙肾上腺素 药物 恶心 症状 不良反应', '异丙肾上腺素 药物 乏力 症状 不良反应', '异丙肾上腺素 药物 头晕 症状 不良反应', '异丙肾上腺素 药物 无力 症状 不良反应', '异丙肾上腺素 药物 房室传导阻滞 疾病 适应症', '异丙肾上腺素 药物 休克 疾病 适应症', '异丙肾上腺素 药物 哮喘 疾病 适应症', '异丙肾上腺素 药物 慢性心房颤动 疾病 禁忌症', '异丙肾上腺素 药物 心肌炎 疾病 禁忌症', '异丙肾上腺素 药物 心律失常 疾病 禁忌症', '异丙肾上腺素 药物 心绞痛 疾病 禁忌症', '异丙肾上腺素 药物 嗜铬细胞瘤 疾病 禁忌症', '药物过敏 疾病 充血 症状 临床症状及体征', '药物过敏 疾病 风团 症状 临床症状及体征', '药物过敏 疾病 易激动 症状 临床症状及体征', '药物过敏 疾病 寒战 症状 临床症状及体征', '药物过敏 疾病 脱屑 症 状 临床症状及体征', '药物过敏 疾病 心悸 症状 临床症状及体征', '药物过敏 疾病 刺痛 症状 临床症状及体征', '药物过敏 疾病  瘀斑 症状 临床症状及体征', '药物过敏 疾病 紫癜 症状 临床症状及体征', '药物过敏 疾病 恶心 症状 临床症状及体征', '药物过敏 疾病 糖尿 症状 临床症状及体征', '药物过敏 疾病 头晕 症状 临床症状及体征', '药物过敏 疾病 结痂 症状 临床症状及体征', '药物过敏 疾病 丘疹 症状 临床症状及体征', '药物过敏 疾病 结节 症状 临床症状及体征', '早期妊娠 疾病 食欲不振 症状 临床症状及体征', '早期妊娠 疾病 乏力 症状 临床症状及体征', '早期妊娠 疾病 嗜睡 症状 临床症状及体征', '早期妊娠 疾病 恶心 症状 临床症状及体征', '早期妊娠 疾病 头晕 症状 临床症状及体征', '早期妊娠 疾病 结节 症状 临床症状及体征', '早期妊娠 疾病 妊娠试验 诊疗 检查']
}