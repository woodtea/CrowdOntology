// data manager

const ogmneo = require('ogmneo');

function DataManager(cfg){
    console.log(cfg);
    ogmneo.Connection.connect('neo4j', cfg.passwd, cfg.address);
    ogmneo.Connection.logCypherEnabled = true;
}

DataManager.prototype.handle = function(msg){
    console.log(msg);
    return "got: " + msg;
}

module.exports = DataManager;