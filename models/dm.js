// data manager

const ogmneo = require('ogmneo');

function DataManager(cfg) {
    console.log('[config] ' + cfg);
    ogmneo.Connection.connect('neo4j', cfg.passwd, cfg.address);
    ogmneo.Connection.logCypherEnabled = true;
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
                    .then(function(result){
                        callback(result);
                        session.close();
                    })
                    .catch(function (err){
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
DataManager.prototype.mCreateNode = function (msg, callback){
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
DataManager.prototype.mCreateRelation = function(msg, callback){
    var session = ogmneo.Connection.session();
    var relation = msg.relations[0];
    var roles = relation.roles;

    var start_str = 'START ';
    var role_str = '';
    for (var i = 0; i < roles.length; i++){
        var role = roles[i];
        start_str += 'role' + i.toString() + '=node(' + role.node_id + ') ';
        if (i != roles.length - 1) start_str += ',';
        role_str += 'CREATE (r)-[:has_role {name:\''+ role.role_name +'\'}]->(role' + i.toString() + ') ';
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

module.exports = DataManager;