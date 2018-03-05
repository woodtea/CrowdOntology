// data manager

const ogmneo = require('ogmneo');

function DataManager(cfg) {
    console.log('[config] ' + cfg);
    ogmneo.Connection.connect('neo4j', cfg.passwd, cfg.address);
    ogmneo.Connection.logCypherEnabled = true;
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
    // var uniqCyp = 'CREATE CONSTRAINT ON (u:User) ASSERT u.name IS UNIQUE\
    // CREATE CONSTRAINT ON (u:Project) ASSERT p.name IS UNIQUE';
    session
        .run('MATCH (n) DETACH DELETE n')
        .then(function (result) {
            session.run('CREATE CONSTRAINT ON (u:User) ASSERT u.name IS UNIQUE')
                .then(function (result) {
                    session
                        .run('CREATE CONSTRAINT ON (p:Project) ASSERT p.name IS UNIQUE')
                        .then(function (result) {
                            callback(result);
                            session.close();
                        })
                        .catch(function (err) {
                            callback(err);
                        })
                })
                .catch(function (err) {
                    callback(err);
                });
        })
        .catch(function (err) {
            callback(err);
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
    session
        .run('CREATE (u:User {name : {nameParam}})', {
            nameParam: msg.name
        })
        .then(function (res) {
            console.log(res);
            session.close();
            callback(res);
        })
        .catch(function (err) {
            callback(err);
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
    session
        .run('CREATE (p:Project {name : {nameParam}})', {
            nameParam: msg.name
        })
        .then(function (res) {
            console.log(res);
            session.close();
            callback(res);
        })
        .catch(function (err) {
            callback(err);
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
    session
        .run(cypher, {
            pname: msg.project_id,
            ctag: msg.nodes[0].tag,
            cvalue: msg.nodes[0].value
        })
        .then(function (res) {
            var nodeId = res.records[0].get('nodeId').toString(); //获取id
            session.close();
            callback(nodeId);
        })
        .catch(function (err) {
            callback(err);
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
                role_name : 'r1',
                node_id : 7,
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
        role_str += 'CREATE (r)-[:has_role {name:\'' + role.role_name + '\'}]->(role' + i.toString() + ') ';
    }
    var cypher = start_str + 'MATCH (p:Project {name: {pname}})\
    CREATE (p)-[:has]->(r:Relation {value: {rname}})' + role_str +
        'RETURN id(r) AS relationId, r AS relation';

    session
        .run(cypher, {
            pname: msg.project_id,
            rname: relation.value
        })
        .then(function (res) {
            var nodeId = res.records[0].get('relationId').toString(); //获取id
            session.close();
            callback(nodeId);
        })
        .catch(function (err) {
            callback(err);
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
                    var model = {
                        nodes: nodes,
                        relations: relations
                    };
                    console.log(model);
                    callback(model);
                });
            // session.close();
        })
        .catch(function (err) {
            callback(err);
        });
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
            callback(nodeId);
        })
        .catch(function (err) {
            callback(err);
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
                role_name : 'r1',
                node_id : 7,
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
        roleCypher += 'CREATE (r)-[:has_role {name:\'{role_name}\'}]->({rolei})\n'.format({
            role_name: role.role_name,
            rolei: 'role' + i.toString()
        });
    }
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
    console.log('[CYPHER]');
    console.log(cypher);

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id,
            rname: relation.value,
            tag: relation.tag
        })
        .then(function (res) {
            var nodeId = res.records[0].get('relationId').toString(); //获取id
            session.close();
            callback(nodeId);
        })
        .catch(function (err) {
            callback(err);
        });
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
                            var model = {
                                nodes: nodes,
                                relations: relations
                            };
                            console.log(model);
                            callback(model);
                        });
                });
            // session.close();
        })
        .catch(function (err) {
            callback(err);
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

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id,
            nodeId: msg.nodes[0]
        })
        .then(function (res) {
            // var nodeId = res.records[0].get('relationId').toString(); //获取id
            console.log(res);
            session.close();
            callback(res);
        })
        .catch(function (err) {
            callback(err);
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

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id,
            relationId: msg.relations[0]
        })
        .then(function (res) {
            // var nodeId = res.records[0].get('relationId').toString(); //获取id
            console.log(res);
            session.close();
            callback(res);
        })
        .catch(function (err) {
            callback(err);
        });
}

module.exports = DataManager;