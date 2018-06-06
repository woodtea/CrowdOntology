// data manager

const ogmneo = require('ogmneo');
var keyAttributeArray = ["姓名","名字","名称","片名"];

function DataManager(cfg) {
    console.log('[config] ' + cfg);
    ogmneo.Connection.connect('neo4j', cfg.passwd, cfg.address);
    ogmneo.Connection.logCypherEnabled = true;
}

function extractBasic(msg) {
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
    console.log("DataManager.prototype.handle");
    console.log(msg);
    try {
        switch (msg.operation) {
            case 'init':
                this.initDatabse(msg, callback);
                break;
            case 'create_user':
                this.createUser(msg, callback);
                break;
            case 'get_user':
                this.getUser(msg, callback);
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
            case 'rcmd':
                this.recommend(msg, callback);
                break;
            case 'rcmd_entity':
                this.recommendEntity(msg, callback);
                break;
            case 'rcmdIndex':
                this.recommendIndex(msg, callback);
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
    operation: 'get_user',
    operation_id: 'opt1',
    name: 'wahaha'
}
*/
// 返回该user是否存在
DataManager.prototype.getUser = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run('MATCH (u:User {name : {nameParam}}) \
            RETURN id(u) AS uid', {
            nameParam: msg.name
        })
        .then(function (res) {
            var records = res.records;
            var uid = -1;
            if (records.length != 0)
                uid = records[0].get('uid').toString();
            session.close();
            resp.msg = 'Success';
            resp.user_id = uid;
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

function is_eq(l1, l2) {
    if (l1.length != l2.length)
        return false;
    l1.sort();
    l2.sort();
    //var is_eq = true;
    for (var i = 0; i < l1.length; ++i) {
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

    if (is_value) {
        var tagMsg = extractBasic(msg);
        tagMsg.error = false;
        tagMsg.operation += '/get_tags';
        // tagMsg.operation_id += 'gt';
        tagMsg.node = {
            value: node.value
        };
        DataManager.prototype.getTags(tagMsg, function (rep) {
            var info = rep.info;

            var sameNode = -1;
            for (k in info) {
                var ik = info[k];
                var tmpTags = [];
                for (t in ik) {
                    tmpTags.push(t);
                }
                var eq = is_eq(tmpTags, tags);
                if (eq) {
                    sameNode = k;
                    break;
                }
            }
            if (sameNode == -1) {
                msg.operation += "/create_node";
                DataManager.prototype.createNode(msg, callback);
            } else {
                var referMsg = extractBasic(msg);
                referMsg.error = false;
                referMsg.operation += '/refer';
                // referMsg.operation_id += 'rf';
                referMsg.node = {
                    front_id: node.front_id,
                    refer_id: sameNode
                }
                DataManager.prototype.refer(referMsg, callback);
            }
        });
    } else {
        msg.operation += "/create_node";
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
        MATCH (u:User {name: {uname}})\n' +
        'MATCH (tag) WHERE id(tag)={tag}\n'.format({
            tag: relation.tag
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
//特殊处理姓名关系
//默认姓名关系建立时，对应的实例还没有建立其他关系
//根据姓名，找到其他实例，refer实例，并且删除原有的实例
DataManager.prototype.createRelationProxy = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var relation = msg.relations[0];
    var roles = relation.roles;

    var resp = extractBasic(msg);
    resp.error = false;

    //判断是否是引用，默认id为后台id时，是引用
    var rid = parseInt(relation.front_id);
    if (!isNaN(rid)){
        var referMsg = extractBasic(msg);
        referMsg.error = false;
        referMsg.operation += '/refer';
        // referMsg.operation_id += 'rf';
        referMsg.node = {
            front_id: relation.front_id,
            refer_id: rid
        };
        DataManager.prototype.refer(referMsg, function (resp) {
            resp.migrate = {};
            resp.migrate[relation.front_id] = rid;
            callback(resp);
        });
        return;
    }

    //先判断关系是否已经建立，不管是否已经引用
    var startCypher = '';
    var roleCypher = '';
    for (var i = 0; i < roles.length; i++) {
        var role = roles[i];
        startCypher += 'MATCH ({rolei}) WHERE id({rolei})={node_id}\n'.format({
            rolei: 'role' + i.toString(),
            node_id: role.node_id
        });
        roleCypher += 'MATCH (r)-[:has_role {name:\'{rolename}\'}]->({rolei})\n'.format({
            rolename: role.rolename,
            rolei: 'role' + i.toString()
        });
    }
    var cypher = 'MATCH (p:Project {name: {pname}})\n\
    MATCH (u:User {name: {uname}})\n' +
        'MATCH (tag) WHERE id(tag)={tag}\n'.format({
            tag: relation.tag
        }) +
        startCypher +
        'MATCH (p)-[:has]->(r:RelInst)\n\
    MATCH (r)-[:from]->(iof:inst_of)-[:to]->(tag)\n\
    MATCH (p)-[:has]->(iof)' +
        roleCypher +
        'RETURN id(r) AS relationId, r AS relation';
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
            //关系已经建立
            if (res.records.length != 0) {
                var relationId = res.records[0].get('relationId').toString(); //获取rid
                var referMsg = extractBasic(msg);
                referMsg.error = false;
                referMsg.operation += '/refer';
                // referMsg.operation_id += 'rf';
                referMsg.node = {
                    front_id: relation.front_id,
                    refer_id: relationId
                };
                DataManager.prototype.refer(referMsg, function (resp) {
                    resp.migrate = {};
                    resp.migrate[relation.front_id] = relationId;
                    callback(resp);
                });
            } else //关系没有建立
            {
                if (roles.length == 2) {
                    var is_name = false;
                    var inst_id = -1;
                    var name_id = -1;
                    for (i in roles) {
                        var r = roles[i];
                        //if (r.rolename == '姓名') {
                        if (keyAttributeArray.indexOf(r.rolename) != -1) {
                            is_name = true;
                            name_id = r.node_id;
                        } else {
                            inst_id = r.node_id;
                        }
                    }
                    //如果是姓名关系
                    if (is_name) {
                        var cypher = 'MATCH (p:Project {name: {pname}})\n\
            MATCH (u:User {name: {uname}})\n\
            MATCH (name) WHERE id(name)={name_id}\n\
            MATCH (i)<-[:has_role]-(rel:RelInst)-[hr:has_role]->(name) WHERE hr.name IN {keyAttributeArray} \n\
            RETURN id(i) AS iid, id(rel) AS relid'.format({
                            name_id: name_id
                        });
                        var resp = extractBasic(msg);
                        resp.error = false;
                        session
                            .run(cypher, {
                                pname: msg.project_id,
                                uname: msg.user_id,
                                keyAttributeArray: keyAttributeArray
                            })
                            .then(function (res) {
                                // var relationId = res.records[0].get('relationId').toString(); //获取id
                                //能找到其他实例
                                if (res.records.length != 0) {
                                    var iid = res.records[0].get('iid').toString();
                                    var relid = res.records[0].get('relid').toString();
                                    var referMsg = extractBasic(msg);
                                    referMsg.error = false;
                                    referMsg.operation += '/refer';
                                    // referMsg.operation_id += 'rf';
                                    referMsg.node = {
                                        front_id: inst_id,
                                        refer_id: iid
                                    }
                                    //引用其他实例
                                    DataManager.prototype.refer(referMsg, function (resp) {
                                        referMsg.node = {
                                            front_id: relation.front_id,
                                            refer_id: relid
                                        };

                                        //还需要添加原来实例里面没有的tag

                                        //引用实例-姓名之间的关系
                                        DataManager.prototype.refer(referMsg, function (resp) {
                                            var removeMsg = extractBasic(msg);
                                            removeMsg.operation += '/remove_node';
                                            // removeMsg.operation_id += 'rn';
                                            removeMsg.nodes = [inst_id];
                                            //删除原来的实例
                                            DataManager.prototype.removeNode(removeMsg, function (resp) {
                                                resp.migrate = {};
                                                resp.migrate[inst_id] = iid;
                                                callback(resp);
                                            });
                                        });
                                    });
                                } else {
                                    msg.operation += '/create_relation';
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

                    } else {
                        msg.operation += '/create_relation';
                        DataManager.prototype.createRelation(msg, callback);
                    }
                } else {
                    DataManager.prototype.createRelation(msg, callback);
                }
                // session.close();
            }

        })
        .catch(function (err) {
            resp.error = true;
            resp.msg = err;
            callback(resp);
        });
};

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
            console.log("[Node]");
            for (var i = 0; i < res.records.length; i++) {
                var rec = res.records[i];
                var nodeId = rec.get('nodeId').toString();
                var prop = rec.get('node').properties;
                // prop.id = nodeId;
                prop['tags'] = [];
                nodes[nodeId] = prop;

                console.log(nodeId);
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
                                    relations[iId].tag = jId;
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
        DELETE r0, r1, r2, r3'.format({
            nodeId: msg.nodes[0]
        });

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
//这个函数目前有bug，应该写成和removeNode类似才对
DataManager.prototype.removeRelation = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var cypher = 'MATCH (p:Project {name: {pname}})\n\
    MATCH (u:User {name: {uname}})\n\
    MATCH (r) WHERE id(r)={relationId}\n\
    MATCH (p)-[:has]->(r:RelInst)<-[r0:refer]-(u)\n\
    MATCH (r)-[:from]->(:inst_of)<-[r1:refer]-(u)\n\
    DELETE r0, r1\n'.format({
        relationId: msg.relations[0]
    });

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
DataManager.prototype.getTags = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var nodeCypher = 'MATCH (i {value:\'{value}\'})'.format({
        value: msg.node.value
    });
    if (msg.node.id != undefined) {
        nodeCypher = 'MATCH (i) WHERE id(i)={nodeId}'.format({
            nodeId: msg.node.id
        })
    }
    var cypher = 'MATCH (p:Project {name: {pname}})\n' +
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
                if (info[iid] == undefined) {
                    info[iid] = {};
                }
                if (info[iid][tagid] == undefined) {
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
    MERGE (u)-[:refer]->(i)'.format({
        refer_id: msg.node.refer_id
    });

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


function unique(arr) {
    if (arr.length == 0 || arr.length == 1)
        return arr;
    arr.sort();
    var res = [];
    res.push(arr[0]);
    var last = arr[0];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != last) {
            res.push(arr[i]);
            last = arr[i];
        }
    }
    return res;
}

/*
msg : {
    operation: 'rcmd',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    nodes:{
        '7':{//内部信息目前都用不着
            tags: [],
            value: 
        }
    }
}
*/
/*
匹配距离为1和2的关系
并统计关系的引用情况

先保证一个点的情况可用，并且这个点使一个概念的实例
*/
/*
目前返回{
    nodes:{
        '7': {value:'xx'}
    },
    relations:{
        '17'：{
            roles: [1, 2, 3]，
            tag: 17，
            refer_u: 18
        }
    }，
    rcmd_relations:[17]
}
relations包含所有的一级关系和二级关系
rcmd_relations是所有的一级关系
*/
DataManager.prototype.recommend = function (msg, callback) {
    var session = ogmneo.Connection.session();
    var nodes = [];
    for (k in msg.nodes) {
        nodes.push(k);
    }

    var cypher = 'MATCH (p:Project {name: {pname}})\n\
    MATCH (u:User {name: {uname}})\n\
    MATCH (i) WHERE id(i)={rcmd_id}\n\
    MATCH (i)<-[r1r1:has_role]-(r1)-[r1r2:has_role]->(i2)\n\
    MATCH (otheru1)-[:refer]->(r1)-[:from]->(iof1:inst_of)-[:to]->(tag1)\n\
    OPTIONAL MATCH (i2)<-[r2r1:has_role]-(r2)-[r2r2:has_role]->(i3)\n\
    OPTIONAL MATCH (otheru2)-[:refer]->(r2)-[:from]->(iof2:inst_of)-[:to]->(tag2)\n\
    RETURN id(r1) AS r1, id(tag1) AS tag1, id(otheru1) AS otheru1, i2, id(r2) AS r2, id(tag2) AS tag2, id(otheru2) AS otheru2, i3'.format({
        rcmd_id: nodes[0]
    })

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
            var records = res.records;
            resp.records = [];
            var nodes = {};
            var relations = {};
            var rcmd_relations = [];
            for (var i in records) {
                var r = records[i];
                var r1 = r.get('r1').toString();
                var r2 = r.get('r2').toString();
                var tag1 = r.get('tag1').toString();
                var tag2 = r.get('tag2').toString();
                var otheru1 = r.get('otheru1').toString();
                var otheru2 = r.get('otheru1').toString();
                var i2 = r.get('i2');
                var i2id = i2.identity.toString();
                var i3 = r.get('i3');
                var i3id = i3.identity.toString();

                // resp.records.push([r1, i2, r2, i3]);
                rcmd_relations.push(r1);
                if (relations[r1] == undefined) {
                    relations[r1] = {
                        roles: [],
                        refer_u: [],
                        tag: tag1
                    };
                }
                if (relations[r2] == undefined) {
                    relations[r2] = {
                        roles: [],
                        refer_u: [],
                        tag: tag2
                    };
                }
                var ids = [i2id, i3id];
                for (var j in ids) {
                    if (nodes[ids[j]] == undefined) {
                        nodes[ids[j]] = {};
                    }
                }

                relations[r1].roles.push(i2id);
                relations[r1].refer_u.push(otheru1);
                relations[r2].roles.push(i2id);
                relations[r2].roles.push(i3id);
                relations[r2].refer_u.push(otheru2);

                nodes[i2id] = i2.properties;
                nodes[i3id] = i3.properties;
            }

            for (var i in relations) {
                var rel = relations[i];
                relations[i].roles = unique(relations[i].roles);
                relations[i].refer_u = (unique(relations[i].refer_u)).length;

            }

            session.close();
            resp.msg = 'Success';
            resp.migrate = {};
            resp.relations = relations;
            resp.rcmd_relations = unique(rcmd_relations);
            resp.nodes = nodes;
            // resp.res = res;
            // resp.migrate[msg.node.front_id] = msg.node.refer_id;
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
    operation: 'rcmd_entity',
    user_id : 'u1',
    project_id : 'p1',
    operation_id : 'op2',
    topk: 7
}
*/
/*
返回项目中建的最多并且没有被当前用户引用的几个实体，
value为空的才认为是实体，带value的认为是值，不会返回
*/

DataManager.prototype.recommendEntity = function(msg, callback){
    var session = ogmneo.Connection.session();
    var cypher = 'MATCH (p:Project {name: {pname}})\n\
    MATCH (u:User {name: {uname}})\n\
    MATCH (p)-[:has]->(i:Inst {value:""})<-[:refer]-(ou) WHERE NOT (i)<-[:refer]-(u)\n\
    MATCH (i)-[:from]->(:inst_of)-[:to]->(tag) \n\
    RETURN id(i) AS iid, count(ou) AS refer_u, collect(distinct id(tag)) AS tags\n\
    order by refer_u DESC\n\
    limit {topk}'.format({
        topk:msg.topk
    });
    console.log('CYPHER');
    console.log(cypher);

    var resp = extractBasic(msg);
    resp.error = false;

    session
        .run(cypher, {
            pname: msg.project_id,
            uname: msg.user_id
        })
        .then(function (res){
            var nodes = {};
            var rcmd_list = [];
            for (var i = 0; i < res.records.length; i++){
                var rec = res.records[i];
                var iid = rec.get('iid').toString();
                var refer_u = rec.get('refer_u').toString();
                var tags = rec.get('tags');
                var tmp = [];
                for (t in tags){
                    tmp.push(tags[t].toString());
                }
                nodes[iid] = {
                    refer_u : refer_u,
                    tags: tmp
                };
                rcmd_list.push(iid);
            }


            var id_list_str = '[' + rcmd_list.toString() + ']';

            var relationCypher = 'MATCH (p:Project {name: {pname}})\n\
            MATCH (u:User {name: {uname}})\n\
            MATCH (i) WHERE id(i) in {id_list} \n\
            MATCH (i)<-[:has_role]-(rel)\n\
            MATCH (rel)-[hr:has_role]->(role)\n\
            MATCH (rel)-[:from]->(:inst_of)-[:to]->(tag)\n\
            RETURN rel, collect(distinct [hr.name, role]) AS role_info,  collect(distinct id(tag)) AS tags'.format({
                id_list: id_list_str
            }); 
            session
                .run(relationCypher, {
                    pname: msg.project_id,
                    uname: msg.user_id
                })
                .then(function(res){
                    var relations = {};
                    for (var i = 0; i < res.records.length; i++){
                        var rec = res.records[i];
                        var rid = rec.get('rel').identity.toString();
                        var role_info = rec.get('role_info');
                        var role_tmp = [];
                        for (var j in role_info){
                            var rname = role_info[j][0];
                            var rnode = role_info[j][1];
                            var roleid = rnode.identity.toString();
                            if (nodes[roleid] == undefined)
                                nodes[roleid] = {};
                            for (k in rnode.properties){
                                nodes[roleid][k] = rnode.properties[k];
                            }
                            // nodes[roleid] = rnode.properties;
                            role_tmp.push({
                                role_name: rname,
                                node_id: roleid
                            });
                        }
                        relations[rid] = rec.get('rel').properties;
                        relations[rid]['role_info'] = role_tmp;
                        relations[rid]['tag'] = rec.get('tags')[0].toString();//关系应该不会有多个tag
                    }
                    
                    session.close();
                    resp.msg = 'Success';
                    resp.nodes = nodes;
                    resp.rcmd_list = rcmd_list;
                    resp.relations = relations;
                    callback(resp);
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


DataManager.prototype.recommendIndex = function (msg, callback) {
    //问题1 没有给引用数
    //问题2 没有排除当前user
    var session = ogmneo.Connection.session();
    var nodeCypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (p)-[:has]->(i:Inst)<-[:refer]-(u)\n\
        RETURN id(i) AS nodeId, i AS node';
    var relationCypher = 'MATCH (p:Project {name: {pname}})\n\
        MATCH (p)-[:has]->(r:RelInst)<-[:refer]-(u)\n\
        MATCH (r)-[hr:has_role]->(tgt)\n\
        RETURN id(r) AS relationId, hr.name AS roleName, id(tgt) AS roleId';
    var instCypher = 'MATCH (p:Project {name: {pname}})\n\
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
            console.log("[Node]");
            for (var i = 0; i < res.records.length; i++) {
                var rec = res.records[i];
                var nodeId = rec.get('nodeId').toString();
                var prop = rec.get('node').properties;
                // prop.id = nodeId;
                prop['tags'] = [];
                nodes[nodeId] = prop;

                console.log(nodeId);
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
                                    relations[iId].tag = jId;
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
module.exports = DataManager;