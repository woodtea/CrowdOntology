//config
var user = $(".glyphicon-user").parent().text().slice(1);
var project = $("#project").text();

//model
var instance_model = {nodes: {}, relations: {}}
var model = {nodes: {}, relations: {}}
var recommend_model = {nodes: {}, relations: {}}
var recommend_index = {}
var rcmd_pending = {
    "entities": [],
    "nodes": {},
    "relations": {}
}

var revise_pending = {
    "remove":{
        "entities": [],
        "relations": []
    },
    "add":{
        "entities": [],
        "nodes": {},
        "relations": {}
    }
}

var symbolArray = [];
var keyValueArray = [];
var relationTypeArray = [];
var isGetRcmd = false;

//io
var svgPending = 0;
//colors
var isColorful = true;
var checkRcmd = false;
//html
const properties = $("body .graph-row .properties");
const propertiesRevise = $("body .graph-row .properties-revise");
const index = $("body .graph-row .index");

//JSFiles
const data = new modelObj();
const svg = new svgObj(d3.select("body .graph-row .middle-content svg"));
const detail = new detailObj();
const network = new networkObj();
const connection = new ioObj();

connection.init();
io_test2 = function (msg = "hello") {
    connection.socket.emit('iotest', msg);
}

let msg = {
    operation: 'mget',  //先这么用着再说吧
    user_id: user,
    project_id: project,
    operation_id: 'op1'
};
connection.socketEmit("model", msg);
