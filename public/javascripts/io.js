var socket = io();

socket.on('chat message', function(msg){
    alert(msg);
});

socket.on('data', function(msg){
    instance_model = msg.instance_model;
    recommend_model = msg.recommend_model;
    model = msg.model;
    indexArray = getIndexArray(instance_model);

    drawIndex();
    drawRelation("n0", "n2", instance_model);
});



function socketEmit(type,msg){
    socket.emit(type, msg);
}