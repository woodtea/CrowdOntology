// data manager

const ogmneo = require('ogmneo');

function DataManager(cfg) {
    console.log('[config] ' + cfg);
    ogmneo.Connection.connect('neo4j', cfg.passwd, cfg.address);
    ogmneo.Connection.logCypherEnabled = true;
}

DataManager.prototype.handle = function (msg, callback) {
    console.log(msg);
    try{
        switch (msg.operation) {
            case 'init':
                this.initDatabse(msg, callback);
                break;
            case 'create_user':
                // [type, content] = this.createUser(msg);
                this.createUser(msg, callback);
                break;
            default:
                throw 'unknown operation';
        }
    }
    catch (err){
        callback(err);
    }
}

//dev
DataManager.prototype.initDatabse = function (msg, callback) {
    var session = ogmneo.Connection.session();
    session
        .run('MATCH (n) DETACH DELETE n')
        .then(function (result) {
            session.run('CREATE CONSTRAINT ON (u:User) ASSERT u.name IS UNIQUE')
                .then(function (result) {
                    console.log(result);
                    session.close();
                })
                .catch(function (err) {
                    console.log(err);
                    throw err;
                });
        })
        .catch(function (err) {
            console.log(err);
            throw err;
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
        .run('CREATE (u:User {name : {nameParam}})', {nameParam: msg.name})
        .then(function (res){
            console.log(res);
            session.close();
            callback(res);
        })
        .catch(function (err){
            callback(err);
        });

}

module.exports = DataManager;