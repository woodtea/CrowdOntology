$(function () {

    $(document).on("click", '#stigmod-fullscreen-btn .glyphicon-fullscreen', function () {
        let docElm = document.documentElement;
        if(docElm.requestFullscreen) {//W3C
            docElm.requestFullscreen();
        }else if(docElm.mozRequestFullScreen) {//FireFox
            docElm.mozRequestFullScreen();
        }else if(docElm.webkitRequestFullScreen) {//Chrome等
            docElm.webkitRequestFullScreen();
        }else if  (docElm.msRequestFullscreen) {//IE
            docElm.msRequestFullscreen();
        }
    })

    $(document).on("click", '#stigmod-fullscreen-btn .glyphicon-resize-small', function () {
        //console.log("cancle");
        let docElm = document;
        // console.log(docElm.exitFullscreen)
        // console.log(docElm.mozCancelFullScreen)
        // console.log(docElm.webkitCancelFullScreen)
        // console.log(docElm.msExitFullscreen)
        if(docElm.exitFullscreen) {//W3C
            docElm.cancelFullscreen();
        }else if(docElm.mozCancelFullScreen) {//FireFox
            docElm.mozCancelFullScreen();
        }else if(docElm.webkitCancelFullScreen) {//Chrome等
            //console.log("bbb");
            docElm.webkitCancelFullScreen();
        }else if  (docElm.msExitFullscreen) {//IE
            docElm.msExitFullscreen();
        }
    })

    document.addEventListener("webkitfullscreenchange", function(e) {
        var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
        if (isFull === undefined) {isFull = false;}

        if(isFull){
            $("#stigmod-fullscreen-btn .glyphicon-fullscreen").addClass("glyphicon-resize-small");
            $("#stigmod-fullscreen-btn .glyphicon-fullscreen").removeClass("glyphicon-fullscreen");
            $(".navbar-fixed-top").hide();
            $(".graph-row").children(".col-xs-3").hide();
            $(".graph-row").children(".col-xs-9").addClass("col-xs-12");
            $(".graph-row").children(".col-xs-9").removeClass("col-xs-9");
        }else{
            $("#stigmod-fullscreen-btn .glyphicon-resize-small").addClass("glyphicon-fullscreen")
            $("#stigmod-fullscreen-btn .glyphicon-resize-small").removeClass("glyphicon-resize-small");
            $(".navbar-fixed-top").show();
            $(".graph-row").children(".col-xs-3").show();
            $(".graph-row").children(".col-xs-12").addClass("col-xs-9");
            $(".graph-row").children(".col-xs-12").removeClass("col-xs-12");
        }
    });

    //modalAddRelInModel
    $(document).on("blur", "#modalAddRelInModel .desc-input", function () {
        let item = $("#modalAddRelInModel input[type='checkbox']");
        if($(item).prop("checked") == false){
            if($(this).val().replace(/\s/g,"") == ""){
                $(this).val("");
                return;
            }
            $("#modalAddRelInModel input[type='checkbox']").trigger("click");
        }
    });


    $(document).on("click", "#modalAddRelInModel input[type='checkbox']", function () {
        if($(this).prop("checked")){    //checked
            let that = $("#modalAddRelInModel .desc-input");

            let desc = $(that).val();
            let rel = fetchNewRel();
            let err,str;
            [err,str] = checkNewRel(rel);

            $("#modalAddRelInModel .modal-body .alert").children().remove();
            $("#modalAddRelInModel .modal-body .desc-text").children().remove();
            if(err){
                //处理提示
                let html = '<div class="alert alert-danger alert-dismissible"><p>'+str+'</p></div>';
                $("#modalAddRelInModel .modal-body .alert").append(html);
            }else{
                //处理文字v
                let descF = formatDesc(desc,rel)
                $("#modalAddRelInModel .modal-body .desc-text").html(descF);
                $("#modalAddRelInModel .modal-body .desc-text").show();
                $("#modalAddRelInModel .modal-body .desc-input").hide();
            }
        }else{  //unchecked
            $("#modalAddRelInModel .modal-body .desc-text").hide();
            $("#modalAddRelInModel .modal-body .desc-input").show();
        }
    })

    $(document).on("click","#modalAddRelInModel .fa-plus",function(){
        let item = $("#modalAddRelInModel .modal-body")
        $(item).find("#relation-add .roles").append(generateNewRole("","","",""));
        setRawRelationRoleValueTypeahead($("#relation-add .roles").children().last());
    })

    $(document).on("click","#modalAddRelInModel2 .fa-plus",function(){
        let item = $("#modalAddRelInModel2 .modal-body")
        $(item).find("#relation-add .roles").append(generateNewRole("","","","",true,true));
        setRawRelationRoleValueTypeahead2($("#relation-add .roles").children().last());
    })


    $(document).on("click","#modalAddRelInModel .glyphicon-trash",function(){
        $(this).parent().remove();
    })

    $(document).on("click","#modalAddRelInModel2 .glyphicon-trash",function(){
        $(this).parent().remove();
    })

    $(document).on("click","#modalAddRelInModel .btn-primary",function(){
        //创建
        let rel = fetchNewRel();
        let err,str;
        [err,str] = checkNewRel(rel);

        $("#modalAddRelInModel .modal-body .alert").children().remove();
        $("#modalAddRelInModel .modal-body .desc-text").children().remove();
        if(err){
            //处理提示
            let html = '<div class="alert alert-danger alert-dismissible"><p>'+str+'</p></div>';
            $("#modalAddRelInModel .modal-body .alert").append(html);
        }else{
            //生成model
            let relationId = generateFrontRelationID();
            let relations = {};
            relations[relationId] = {
                "type":rel.type,
                "roles": [],
            }
            let entityName,entityId,entityType,entityTypeId;
            for(let i in rel.roles){
                entityName = rel.roles[i][1];
                entityId = data.getEntityIdByValue(entityName)[0];
                entityType = instance_model.nodes[entityId].tags[0];
                for(let key in model.nodes){
                    if(model.nodes[key].value == entityType) entityTypeId=key;
                }
                relations[relationId].roles.push({"rolename": rel.roles[i][0], "node_id": entityTypeId},)
            }
            if(rel.desc!=undefined&&rel.desc!="") relations[relationId].desc = rel.desc;
            connection.io_create_model_relation(relations);
            $("#modalAddRelInModel").modal("hide");

            let insRelationId = generateFrontRelationID(1);
            let insRelations = {};
            insRelations[insRelationId] = {
                "type":rel.type,
                "roles": [],
                "referInfo":"",
                "timeArray":[],
            }
            for(let i in rel.roles){
                entityName = rel.roles[i][1];
                entityId = data.getEntityIdByValue(entityName)[0];
                insRelations[insRelationId].roles.push({"rolename": rel.roles[i][0], "node_id": entityId},)
            }
            data.pendingInsRel.push(insRelations);
            //connection.io_create_insModel_relation(insRelations);
        }
    })

    $(document).on("click","#modalAddRelInModel2 .btn-primary",function(){
        //创建
        let rel = fetchNewRel2();
        let err,str;
        [err,str] = checkNewRel(rel);

        $("#modalAddRelInModel2 .modal-body .alert").children().remove();

        if(err){
            //处理提示
            let html = '<div class="alert alert-danger alert-dismissible"><p>'+str+'</p></div>';
            $("#modalAddRelInModel2 .modal-body .alert").append(html);
        }else{
            //生成model
            let relationId = generateFrontRelationID();
            let relations = {};
            relations[relationId] = {
                "type":rel.type,
                "roles": [],
            }
            let entityType,entityTypeId;
            for(let i in rel.roles){
                entityType = rel.roles[i][1];
                for(let key in model.nodes){
                    if(model.nodes[key].value == entityType) entityTypeId=key;
                }
                relations[relationId].roles.push({"rolename": rel.roles[i][0], "node_id": entityTypeId})
            }
            if(rel.desc!=undefined&&rel.desc!="") relations[relationId].desc = rel.desc;
            connection.io_create_model_relation(relations);
            $("#modalAddRelInModel2").modal("hide");
        }
    })

    function formatDesc(desc,rel){
        let parts=[desc],tmpParts;
        let pos=[];
        let i,j;
        for(i=0;i<rel.roles.length;i++){
            for(j=0;j<parts.length;j++){
                tmpParts = parts[j].split(rel.roles[i][1]);
                if(tmpParts.length >= 2){
                    parts.push(parts[j].substr(parts[j].indexOf(rel.roles[i][1])+rel.roles[i][1].length));
                    parts[j] = tmpParts[0];
                    pos.push(j)
                    break;
                }
            }
            if(j==parts.length) pos.push(j);
        }

        let html ="";
        let end = parts.length-1;
        for(i=rel.roles.length;i>=0;i--){
            if(pos[i]<end+1){
                j = pos[i];
                parts[j] = parts[j] + "<b> [" + rel.roles[i][0] + "]"+ rel.roles[i][1] + " </b>"+ parts[end];
                end--;
            }
        }
        html = "<p style='margin: 5px;'>"+parts[0]+"</p>";
        return html;
    }

    function checkNewRel(rel){
        let err=false,str="";
        if(rel.type == ""){
            err=true;
            str+="关系名不可为空<br/>";
        }
        let centerId = $("g.center").attr("id");
        let array = getRelationTypes(centerId);
        if (array.indexOf(rel.type) != -1) {
            err=true;
            str+="当前关系名已存在<br/>";
        }
        for(let i=0;i<rel.roles.length;i++){
            if(rel.roles[i][0] == ""){
                err=true;
                str+="角色不可为空<br/>";
                break;
            }
        }
        for(let i=0;i<rel.roles.length;i++){
            if(rel.roles[i][1] == ""){
                err=true;
                str+="承担者不可为空<br/>";
                break;
            }
        }
        let entityArray = getIndexArray2();
        for(let i=0;i<rel.roles.length;i++){
            if(rel.roles[i][1] != "" && entityArray.indexOf(rel.roles[i][1])==-1 ){
                err=true;
                str+='承担者"'+rel.roles[i][1]+'"不存在<br/>';
                break;
            }
        }
        return [err,str];
    }

    function fetchNewRel(){
        let rel = {
            type: $("#modalAddRelInModel").find(".type-input").first().val(),
            roles: []
        }

        let inputs = $("#modalAddRelInModel .roles input");
        for(let i=0;i<$(inputs).length/2;i++){
            rel.roles.push([$(inputs).eq(i*2).val(),$(inputs).eq(i*2+1).val()]);
        }

        let desc = $("#modalAddRelInModel .description input").val();
        if(desc!=""&&desc!=undefined) rel.desc = desc;
        return rel;
    }

    function fetchNewRel2(){
        let rel = {
            type: $("#modalAddRelInModel2").find(".type-input").first().val(),
            roles: []
        }

        let inputs = $("#modalAddRelInModel2 .roles input");
        for(let i=0;i<$(inputs).length/3;i++){
            for(let j=0;j<$(inputs).eq(i*3+2).val();j++)
            {
                rel.roles.push([$(inputs).eq(i*3).val(),$(inputs).eq(i*3+1).val()]);
            }
        }

        let desc = "";
        if(desc!=""&&desc!=undefined) rel.desc = desc;
        return rel;
    }
})