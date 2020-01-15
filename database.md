# neo4j接口说明v0.01
基于官方的js接口实现。

## 使用说明
```javascript
//neo4j服务器配置
var server_config = {
    passwd:"",
    address:"localhost:7687"
};
var DataManager = require('./dm');
var dm = new DataManager(server_config);

dm.handle(msg, function(rep){
    //console.log('[CALLBACK]')
    //console.log(rep);
});
```

msg格式基本参照**接口-v0.02**，具体可参考`models/dm.js`和`models/__backup__io.js`

## 支持的功能
1. 创建用户
2. 创建项目
3. 添加模型层概念
4. 添加模型层关系
5. 获取模型层数据
6. 添加实例层节点
7. 添加实例层关系
8. 删除实例层节点
9. 删除实例层关系
10. 获取实例层数据

目前所有的添加删除操作，都只能操作单个的点或者边，无法一次添加多个节点
