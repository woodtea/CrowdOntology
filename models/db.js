/**
 * Created by ChiangEarl on 17/12/28.
 */

var db = {
    user:[{ password: '123qwe', mail: 'u1@pku.edu.cn' }],
    instance_model:{
    },
    model: {
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

}

/*
db.instance_model["u1@pku.edu.cn"] = {
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
*/

module.exports = db;


