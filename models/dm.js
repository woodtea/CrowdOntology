// data manager

const ogmneo = require('ogmneo');

function DataManager(cfg) {
    console.log('[config] ' + cfg);
    ogmneo.Connection.connect('neo4j', cfg.passwd, cfg.address);
    ogmneo.Connection.logCypherEnabled = true;
}

function extractBasic(msg){
    console.log(msg);
    return {
        operation: msg.operation,
        user_id: msg.user_id,
        project_id: msg.project_id,
        operation_id: msg.operation_id
    };
}

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

DataManager.prototype.handle = function (msg, callback) {
    console.log(msg);
    try {
        switch (msg.operation) {
            case 'init':
                this.initDatabse(msg, callback);
                break;
            case 'create_user':
                this.createUser(msg, callback);
                break;
            case 'create_project':
                this.createProject(msg, callback);
                break;
            case 'mcreate_node':
                this.mCreateNode(msg, callback);
                break;
            case 'mcreate_relation':
                this.mCreateRelation(msg, callback);
                break;
            case 'mget':
                this.mGet(msg, callback);
                break;
            case 'create_node':
                this.createNode(msg, callback);
                break;
            case 'create_relation':
                this.createRelation(msg, callback);
                break;
            case 'get':
                this.get(msg, callback);
                break;
            case 'remove_node':
                this.removeNode(msg, callback);
                break;
            case 'remove_relation':
                this.removeRelation(msg, callback);
                break;
            case 'get_tags':
                this.getTags(msg, callback);
                break;
            case 'refer':
                this.refer(msg, callback);
                break;
            case 'create_node_proxy':
                this.createNodeProxy(msg, callback);
                break;
            case 'create_relation_proxy':
                this.createRelationProxy(msg, callback);
                break;
            default:
                throw 'unknown operation';
        }
    } catch (err) {
        callback(err);
    }
}

//dev
DataManager.prototype.initDatabse = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run('MATCH (n) DETACH DELETE n')
        .then(function (result) {
            session.run('CREATE CONSTRAINT ON (u:User) ASSERT u.name IS UNIQUE')
                .then(function (result) {
                    session
                        .run('CREATE CONSTRAINT ON (p:Project) ASSERT p.name IS UNIQUE')
                        .then(function (result) {
                            session.close();
                            resp.msg = 'Success';
                            callback(resp);
                        })
                        .catch(function (err) {
                            resp.error = true;
                            resp.msg = err;
                            callback(resp);
                        })
                })
                .catch(function (err) {
                    resp.error = true;
                    resp.msg = err;
                    callback(resp);
                });
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });

}

/*
msg : {
    operation: 'create_user',
    operation_id: 'opt1',
    name: 'wahaha'
}
*/
DataManager.prototype.createUser = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run('CREATE (u:User {name : {nameParam}})', {
            nameParam: msg.name
        })
        .then(function (res) {
            session.close();
            resp.msg = 'Success';
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });

}

/*
msg : {
    operation: 'create_project',
    operation_id: 'opt2',
    name: '西游记'
}
*/
DataManager.prototype.createProject = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run('CREATE (p:Project {name : {nameParam}})', {
            nameParam: msg.name
        })
        .then(function (res) {
            session.close();
            resp.msg = 'Success';
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

/*
msg : {
    operation: 'mcreate_node',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    nodes :[
        {
            front_id: '',
            tag : 'xxx',
            value: 'xxx'
        }
    ]
}
*/
//先保证一个点的情况
DataManager.prototype.mCreateNode = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var cypher = 'MATCH (p:Project {name: {pname}})\
        CREATE (p)-[:has]->(c:Concept {tag: {ctag}, value:{cvalue}})\
        RETURN id(c) AS nodeId, c AS node';
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            ctag: msg.nodes[0].tag,
            cvalue: msg.nodes[0].value
        })
        .then(function (res) {
            var nodeId = res.records[0].get('nodeId').toString(); //获取id
            resp.migrate = {};
            resp.migrate[msg.nodes[0].front_id] = nodeId;
            session.close();
            resp.msg = 'Success';
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}


/*
msg : {
    operation: 'mcreate_relation',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    relations:[
        {
            front_id:'',
            value: '',
            roles:[
                {
                rolename : 'r1',
                node_id : 7,
                }
                ...
            ]
        }
    ]
}
*/
//先考虑一个关系，并且没有多元性多重性
DataManager.prototype.mCreateRelation = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var relation = msg.relations[0];
    var roles = relation.roles;
    //match id(n) = id better
    var start_str = 'START ';
    var role_str = '';
    for (var i = 0; i < roles.length; i++) {
        var role = roles[i];
        start_str += 'role' + i.toString() + '=node(' + role.node_id + ') ';
        if (i != roles.length - 1) start_str += ',';
        role_str += 'CREATE (r)-[:has_role {name:\'' + role.rolename + '\'}]->(role' + i.toString() + ') ';
    }
    var cypher = start_str + 'MATCH (p:Project {name: {pname}})\
    CREATE (p)-[:has]->(r:Relation {value: {rname}})' + role_str +
        'RETURN id(r) AS relationId, r AS relation';

    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            rname: relation.value
        })
        .then(function (res) {
            var relationId = res.records[0].get('relationId').toString(); //获取id
            resp.migrate = {};
            resp.migrate[relation.front_id] = relationId;
            resp.msg = 'Success';
            session.close();
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

/*
msg : {
    operation : 'mget',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
}
*/
DataManager.prototype.mGet = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var nodeCypher = 'MATCH (p:Project {name: {pname}})\
        MATCH (p)-[:has]->(c:Concept)\
        RETURN id(c) AS nodeId, c AS node';
    var relationCypher = 'MATCH (p:Project {name: {pname}})\
        MATCH (p)-[:has]->(r:Relation)\
        MATCH (r)-[hr:has_role]->(tgt)\
        RETURN id(r) AS relationId, r.value AS value, hr.name AS roleName, id(tgt) AS roleId';

    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(nodeCypher, {
            pname: msg.project_id
        })
        .then(function (res) {
            var nodes = {};
            for (var i = 0; i < res.records.length; i++) {
                var rec = res.records[i];
                var nodeId = rec.get('nodeId').toString();
                var prop = rec.get('node').properties;
                // prop.id = nodeId;
                nodes[nodeId] = prop;
                console.log(prop);
            }
            session.run(relationCypher, {
                    pname: msg.project_id
                })
                .then(function (res) {
                    var relations = {};

                    for (var i = 0; i < res.records.length; i++) {
                        var rec = res.records[i];
                        var relationId = rec.get('relationId').toString();
                        var relationName = rec.get('value');
                        var roleName = rec.get('roleName');
                        var roleId = rec.get('roleId').toString();

                        if (relations[relationId] == undefined) {
                            relations[relationId] = {
                                value: relationName,
                                roles: []
                            };
                        }
                        relations[relationId].roles.push({
                            rolename: roleName,
                            node_id: roleId
                        });
                        // console.log(relationId, relationName, roleName, roleId);
                    }
                    session.close();
                    resp.nodes = nodes;
                    resp.relations = relations;
                    resp.msg = 'Success';
                    // console.log(model);
                    callback(resp);
                });
            // session.close();
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

function is_eq(l1, l2){
    if(l1.length != l2.length)
        return false;
    l1.sort();
    l2.sort();
    //var is_eq = true;
    for (var i = 0; i < l1.length; ++i){
        if (l1[i] != l2[i])
            return false;
    }
    return true;
}

/*
msg : {
    operation: 'create_node',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    nodes :[
        {
            front_id: '',
            tags : [12, 3], //tag用id表示
            value: 'xxx' //实体的value为空
        }
    ]
}
*/
//先保证一个点的情况
//创建带有value的点时，先判断同样tag同样value的点是否已经存在，如果已经存在，则直接refer
DataManager.prototype.createNodeProxy = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var node = msg.nodes[0];
    var tags = node.tags;

    var is_value = (node.value != '' && node.value != undefined);
    
    var resp = extractBasic(msg);
    resp.error = false;

    if (is_value){
        var tagMsg = extractBasic(msg);
        tagMsg.error = false;
        tagMsg.operation = 'get_tags';
        tagMsg.operation_id += 'gt';
        tagMsg.node = {
            value: node.value
        };
        DataManager.prototype.getTags(tagMsg, function(rep){
            var info = rep.info;

            var sameNode=-1;
            for (k in info){
                var ik = info[k];
                var tmpTags = [];
                for (t in ik){
                    tmpTags.push(t);
                }
                var eq = is_eq(tmpTags, tags);
                if(eq){
                    sameNode = k;
                    break;
                }
            }
            if (sameNode == -1){
                DataManager.prototype.createNode(msg, callback);
            }
            else{
                var referMsg = extractBasic(msg);
                referMsg.error = false;
                referMsg.operation = 'refer';
                referMsg.operation_id += 'rf';
                referMsg.node = {
                    front_id: node.front_id,
                    refer_id: sameNode
                }
                DataManager.prototype.refer(referMsg, callback);
            }
        });
    }
    else{
        DataManager.prototype.createNode(msg, callback);
    }
}



/*
msg : {
    operation: 'create_node',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    nodes :[
        {
            front_id: '',
            tags : [12, 3], //tag用id表示
            value: 'xxx' //实体的value为空
        }
    ]
}
*/
//先保证一个点的情况
DataManager.prototype.createNode = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var node = msg.nodes[0];
    var tags = node.tags;

    var tagCypher = '';
    var startCypher = '';
    for (var i = 0; i < tags.length; i++) {
        startCypher += 'MATCH ({ci}) WHERE id({ci})={tagid}\n'.format({
            ci: 'c' + i.toString(),
            tagid: tags[i]
        });
        tagCypher += 'CREATE (i)-[:from]->({iofi}:inst_of)-[:to]->({ci})\n'.format({
            ci: 'c' + i.toString(),
            iofi: 'iof' + i.toString()
        });
        tagCypher += 'CREATE (u)-[:refer]->({iofi})\n'.format({
            iofi: 'iof' + i.toString()
        });
        tagCypher += 'CREATE (p)-[:has]->({iofi})\n'.format({
            iofi: 'iof' + i.toString()
        });
    }

    var cypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (u:User {name: {uname}})\n' +
        startCypher +
        'CREATE (p)-[:has]->(i:Inst {value:{ivalue}})\n\
        CREATE (u)-[:refer]->(i)\n' +
        tagCypher +
        'RETURN id(i) AS nodeId, i AS node';
    console.log('[CYPHER]');
    console.log(cypher);
    
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            ctag: msg.nodes[0].tag,
            cvalue: msg.nodes[0].value,
            uname: msg.user_id,
            ivalue: node.value
        })
        .then(function (res) {
            var nodeId = res.records[0].get('nodeId').toString(); //获取id
            session.close();
            resp.msg = 'Success';
            resp.migrate = {};
            resp.migrate[msg.nodes[0].front_id] = nodeId;
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

/*
msg : {
    operation: 'create_relation',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    relations:[
        {
            front_id:'',
            tag: 7, //用tagid表示
            roles:[
                {
                rolename : 'r1',
                node_id : 7,
                }
                ...
            ]
        }
    ]
}
*/
//先考虑一个关系，并且没有多元性多重性
DataManager.prototype.createRelation = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var relation = msg.relations[0];
    var roles = relation.roles;

    var startCypher = '';
    var roleCypher = '';
    for (var i = 0; i < roles.length; i++) {
        var role = roles[i];
        startCypher += 'MATCH ({rolei}) WHERE id({rolei})={node_id}\n'.format({
            rolei: 'role' + i.toString(),
            node_id: role.node_id
        });
        roleCypher += 'CREATE (r)-[:has_role {name:\'{rolename}\'}]->({rolei})\n'.format({
            rolename: role.rolename,
            rolei: 'role' + i.toString()
        });
    }
    /*
    var cypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (u:User {name: {uname}})\n\
        MATCH (tag) WHERE id(tag)={tag}\n' +
        startCypher +
        'CREATE (p)-[:has]->(r:RelInst)\n\
        CREATE (u)-[:refer]->(r)\n\
        CREATE (r)-[:from]->(iof:inst_of)-[:to]->(tag)\n\
        CREATE (u)-[:refer]->(iof)\n\
        CREATE (p)-[:has]->(iof)' +
        roleCypher +
        'RETURN id(r) AS relationId, r AS relation';
        */
    var cypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (u:User {name: {uname}})\n'+
        'MATCH (tag) WHERE id(tag)={tag}\n'.format({
            tag:relation.tag
        }) +
        startCypher +
        'CREATE (p)-[:has]->(r:RelInst)\n\
        CREATE (u)-[:refer]->(r)\n\
        CREATE (r)-[:from]->(iof:inst_of)-[:to]->(tag)\n\
        CREATE (u)-[:refer]->(iof)\n\
        CREATE (p)-[:has]->(iof)' +
        roleCypher +
        'RETURN id(r) AS relationId, r AS relation';
    console.log('[CYPHER]');
    console.log(cypher);

    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id,
            rname: relation.value,
            tag: relation.tag
        })
        .then(function (res) {
            var relationId = res.records[0].get('relationId').toString(); //获取id
            
            resp.migrate = {};
            resp.migrate[relation.front_id] = relationId;
            resp.msg = 'Success';
            session.close();
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

/*
msg : {
    operation: 'create_relation',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    relations:[
        {
            front_id:'',
            tag: 7, //用tagid表示
            roles:[
                {
                rolename : 'r1',
                node_id : 7,
                }
                ...
            ]
        }
    ]
}
*/
//先考虑一个关系，并且没有多元性多重性
//特殊处理名字关系
//默认名字关系建立时，对应的实例还没有建立其他关系
//根据名字，找到其他实例，refer实例，并且删除原有的实例
DataManager.prototype.createRelationProxy = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var relation = msg.relations[0];
    var roles = relation.roles;
    
    var resp = extractBasic(msg);
    resp.error = false;

    if(roles.length == 2){
        var is_name = false;
        var inst_id = -1;
        var name_id = -1;
        for (i in roles){
            var r = roles[i];
            if (r.rolename == '名字'){
                is_name = true;
                name_id = r.node_id;
            }
            else{
                inst_id = r.node_id;
            }
        }
        //如果是名字关系
        if (is_name){
            var cypher = 'MATCH (p:Project {name: {pname}})\n\
            MATCH (u:User {name: {uname}})\n\
            MATCH (name) WHERE id(name)={name_id}\n\
            MATCH (i)<-[:has_role]-(rel:RelInst)-[:has_role {name:\'名字\'}]->(name)\n\
            RETURN id(i) AS iid, id(rel) AS relid'.format({
                name_id: name_id
            });
            var resp = extractBasic(msg);
            resp.error = false;
            session
            .run(cypher, {
                pname: msg.project_id,
                uname: msg.user_id
            })
            .then(function (res) {
                // var relationId = res.records[0].get('relationId').toString(); //获取id
                //能找到其他实例
                if (res.records.length != 0){
                    var iid = res.records[0].get('iid').toString();
                    var relid = res.records[0].get('relid').toString();
                    var referMsg = extractBasic(msg);
                    referMsg.error = false;
                    referMsg.operation = 'refer';
                    referMsg.operation_id += 'rf';
                    referMsg.node = {
                        front_id: inst_id,
                        refer_id: iid
                    }
                    //引用其他实例
                    DataManager.prototype.refer(referMsg, function(resp){
                        referMsg.node = {
                            front_id: relation.front_id,
                            refer_id: relid
                        };
                        
                        //还需要添加原来实例里面没有的tag
            
                        //引用实例-名字之间的关系
                        DataManager.prototype.refer(referMsg, function(resp){
                            var removeMsg = extractBasic(msg);
                            removeMsg.operation = 'remove_node';
                            removeMsg.operation_id += 'rn';
                            removeMsg.nodes = [inst_id];
                            //删除原来的实例
                            DataManager.prototype.removeNode(removeMsg, function(resp){
                                resp.migrate = {};
                                resp.migrate[inst_id] = iid;
                                callback(resp);
                            });
                        });
                    });
                }
                else{
                    DataManager.prototype.createRelation(msg, callback);
                }
                // resp.msg = 'Success';
                // session.close();
                // callback(resp);
            })
            .catch(function (err) {
                resp.error = true;
                resp.msg = err;
                callback(resp);
            });
            
        }
        else{
            DataManager.prototype.createRelation(msg, callback);
        }
    }
    else{
        DataManager.prototype.createRelation(msg, callback);
    }
    // session.close();

}

/*
msg : {
    operation : 'get',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
}
*/
DataManager.prototype.get = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var nodeCypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (u:User {name: {uname}})\n\
        MATCH (p)-[:has]->(i:Inst)<-[:refer]-(u)\n\
        RETURN id(i) AS nodeId, i AS node';
    var relationCypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (u:User {name: {uname}})\n\
        MATCH (p)-[:has]->(r:RelInst)<-[:refer]-(u)\n\
        MATCH (r)-[hr:has_role]->(tgt)\n\
        RETURN id(r) AS relationId, hr.name AS roleName, id(tgt) AS roleId';
    var instCypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (u:User {name: {uname}})\n\
        MATCH (p)-[:has]->(iof:inst_of)<-[:refer]-(u)\n\
        MATCH (i)-[:from]->(iof)-[:to]->(j)\n\
        RETURN id(i) AS iId, id(j) AS jId';

    console.log('[CYPHER]');
    console.log(nodeCypher);
    console.log(relationCypher);
    console.log(instCypher);
    
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(nodeCypher, {
            pname: msg.project_id,
            uname: msg.user_id
        })
        .then(function (res) {
            var nodes = {};
            for (var i = 0; i < res.records.length; i++) {
                var rec = res.records[i];
                var nodeId = rec.get('nodeId').toString();
                var prop = rec.get('node').properties;
                // prop.id = nodeId;
                prop['tags'] = [];
                nodes[nodeId] = prop;

                // console.log(prop);
            }
            session.run(relationCypher, {
                    pname: msg.project_id,
                    uname: msg.user_id
                })
                .then(function (res) {
                    var relations = {};

                    for (var i = 0; i < res.records.length; i++) {
                        var rec = res.records[i];
                        var relationId = rec.get('relationId').toString();
                        var roleName = rec.get('roleName');
                        var roleId = rec.get('roleId').toString();

                        if (relations[relationId] == undefined) {
                            relations[relationId] = {
                                roles: []
                            };
                        }
                        relations[relationId].roles.push({
                            rolename: roleName,
                            node_id: roleId
                        });
                    }
                    session.run(instCypher, {
                            pname: msg.project_id,
                            uname: msg.user_id
                        })
                        .then(function (res) {
                            for (var i = 0; i < res.records.length; i++) {
                                var rec = res.records[i];
                                var iId = rec.get('iId').toString();
                                var jId = rec.get('jId').toString();
                                console.log(iId, jId);
                                if (nodes[iId] != undefined) {
                                    nodes[iId].tags.push(jId);
                                } else if (relations[iId] != undefined) {
                                    relations[iId].value = jId;
                                } else {
                                    throw 'fatal error: no such iId';
                                }
                            }
                            session.close();
                            resp.msg = 'Success';
                            resp.nodes = nodes;
                            resp.relations = relations;
                            callback(resp);
                        });
                });
            // session.close();
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

/*
msg : {
    operation: 'remove_node',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    nodes: [
        'nodeId'
    ]
}
*/
//实际只是解除引用，先保证一个点的情况
DataManager.prototype.removeNode = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var cypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (u:User {name: {uname}})\n\
        MATCH (i) WHERE id(i)={nodeId}\n\
        MATCH (p)-[:has]->(i:Inst)<-[r0:refer]-(u)\n\
        OPTIONAL MATCH (rel:RelInst)-[:has_role]->(i)\n\
        OPTIONAL MATCH (p)-[:has]->(rel)<-[r1:refer]-(u)\n\
        OPTIONAL MATCH (rel)-[:from]->(:inst_of)<-[r2:refer]-(u)\n\
        OPTIONAL MATCH (i)-[:from]->(:inst_of)<-[r3:refer]-(u)\n\
        DELETE r0, r1, r2, r3';

    console.log('[CYPHER]');
    console.log(cypher);

    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id,
            nodeId: msg.nodes[0]
        })
        .then(function (res) {
            // var nodeId = res.records[0].get('relationId').toString(); //获取id
            // console.log(res);
            resp.msg = 'Success';
            session.close();
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}



/*
msg : {
    operation: 'remove_relation',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    relations: [
        'relationId'
    ]
}
*/
//实际也是解除引用
DataManager.prototype.removeRelation = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var cypher = 'MATCH (p:Project {name: {pname}})\n\
    MATCH (u:User {name: {uname}})\n\
    MATCH (r) WHERE id(r)={relationId}\n\
    MATCH (p)-[:has]->(r:RelInst)<-[r0:refer]-(u)\n\
    MATCH (r)-[:from]->(:inst_of)<-[r1:refer]-(u)\n\
    DELETE r0, r1\n';

    console.log('[CYPHER]');
    console.log(cypher);
    
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id,
            relationId: msg.relations[0]
        })
        .then(function (res) {
            // var nodeId = res.records[0].get('relationId').toString(); //获取id
            // console.log(res);
            resp.msg = 'Success';
            session.close();
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

/*
msg:{
    operation: 'get_tags',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    node:{
        id:'',
        value:''
    }
}
*/
DataManager.prototype.getTags = function(msg, callback){
    var session = ogmneo.Connection.session();
    var nodeCypher = 'MATCH (i {value:\'{value}\'})'.format({
        value:msg.node.value
    });
    if (msg.node.id != undefined){
        nodeCypher = 'MATCH (i) WHERE id(i)={nodeId}'.format({
            nodeId:msg.node.id
        })
    }
    var cypher = 'MATCH (p:Project {name: {pname}})\n'+
    nodeCypher +
    'MATCH (i)-[:from]->(iof:inst_of)-[:to]->(c:Concept)<-[:has]-(p)\n\
    MATCH (u)-[:refer]->(iof)\n\
    RETURN  id(i) AS iid, u.name AS user , id(c) AS tagid\n';

    console.log('[CYPHER]');
    console.log(cypher);
    
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id
        })
        .then(function (res) {
            // var nodeId = res.records[0].get('relationId').toString(); //获取id
            // console.log(res);
            console.log('[TAGS]');
            var info = {};
            for (var i = 0; i < res.records.length; i++) {
                var rec = res.records[i];
                var user = rec.get('user').toString();
                var tagid = rec.get('tagid').toString();
                var iid = rec.get('iid').toString();
                if (info[iid] == undefined){
                    info[iid] = {};
                }
                if (info[iid][tagid] == undefined){
                    info[iid][tagid] = [];
                }
                info[iid][tagid].push(user);
                console.log(iid, tagid, user);
            }
            console.log(info);
            resp.info = info;
            resp.msg = 'Success';
            session.close();
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

 
/*
msg : {
    operation: 'refer',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    node:{
        front_id: 11,
        refer_id: 7
    }
}
*/
//引用当前点，以及当前点的所有tag
//如果引用一个关系，不会自动引用关系的其他角色
DataManager.prototype.refer = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var cypher = 'MATCH (p:Project {name: {pname}})\n\
    MATCH (u:User {name: {uname}})\n\
    MATCH (i) WHERE id(i)={refer_id}\n\
    MATCH (i)-[:from]->(iof:inst_of)-[:to]->(tag)\n\
    MERGE (u)-[:refer]->(iof)\n\
    MERGE (u)-[:refer]->(i)'.format(
        {
            refer_id: msg.node.refer_id
        }
    );

    console.log('[CYPHER]');
    console.log(cypher);
    
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id
            
        })
        .then(function (res) {
            // var nodeId = res.records[0].get('nodeId').toString(); //获取id
            session.close();
            resp.msg = 'Success';
            resp.migrate = {};
            resp.migrate[msg.node.front_id] = msg.node.refer_id;
            callback(resp);
        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
}

/*
TODO:
add/remove tags
get context
*/
module.exports = DataManager;