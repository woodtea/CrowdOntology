
var instance_model = {
    nodes: {
        "n0": {
            "tags": ["人"],
            "value": "贾宝玉",
            "dataType": "姓名"
        },
        "n1": {
            "value": "男",
            "dataType": "String"
        },
        "n2": {
            "tags": ["人"],
            "value": "林黛玉",
            "dataType":"姓名"
        },
        "n3": {
            "value": "女",
            "dataType": "String"
        }
    },
    relations: {
        "r0": {
            "type": "发小",
            "roles": [
                {"rolename": "", "node_id": "n0"},
                {"rolename": "", "node_id": "n2"}
            ]
        },
        "r1": {
            "type": "知己",
            "roles": [
                {"rolename": "", "node_id": "n0"},
                {"rolename": "", "node_id": "n2"}
            ]
        },
        "r2": {
            "type": "性别",
            "roles": [
                {"rolename": "", "node_id": "n0"},
                {"rolename": "", "node_id": "n1"}
            ]
        },
        "r3": {
            "type": "性别",
            "roles": [
                {"rolename": "", "node_id": "n2"},
                {"rolename": "", "node_id": "n3"}
            ]
        }
    }
}


var model = {
    "nodes":{
        "n0":{
            "tag":"实体",
            "value": "人"
        },
        "n1":{
            "tag":"符号",
            "value": "String"
        }
    },
    "relations":{
        "r0":{
            "value": "夫妻",
            "roles": [
                {"rolename": "丈夫", "node_id": "n0","multiplicity":"0..n"},
                {"rolename": "妻子", "node_id": "n0","multiplicity":"0..n"}
            ]
        },
        "r1":{
            "value": "知己",
            "roles": [
                {"rolename": "", "node_id": "n0","multiplicity":"0..n"},
                {"rolename": "", "node_id": "n0","multiplicity":"0..n"}
            ]
        },
        "r2":{
            "value": "兄妹",
            "roles": [
                {"rolename": "", "node_id": "n0","multiplicity":"0..n"},
                {"rolename": "", "node_id": "n0","multiplicity":"0..n"}
            ]
        },
        "r3":{
            "value": "姓名",
            "roles": [
                {"rolename": "", "node_id": "n0","multiplicity":"0..n"},
                {"rolename": "姓名", "node_id": "n1","multiplicity":"1"}
            ]
        },
        "r4":{
            "value": "性别",
            "roles": [
                {"rolename": "", "node_id": "n0","multiplicity":"0..n"},
                {"rolename": "性别", "node_id": "n1","multiplicity":"1"}
            ]
        }
    }
}

var recommend_model = {
    "n4":{
        id:"n4",
        dataType: "String",
        value:"1",
        relations:[
            {"id":"r5",value:"排行"}
        ]
    },
    "n5":{
        id:"n5",
        dataType: "String",
        value:"175",
        relations:[
            {"id":"r6",value:"身高"}
        ]
    },
    "n6":{
        id:"n6",
        dataType: "姓名",
        value:"薛宝钗",
        tags:["人"],
        relations:[
            {"id":"r7",value:"知己"}
        ]
    }
}

var data = {
    model : model,
    instance_model : instance_model,
    recommend_model: recommend_model
}


module.exports = data;





