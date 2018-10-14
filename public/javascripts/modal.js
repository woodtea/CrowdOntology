$(function () {
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

    $(document).on("click","#modalAddRelInModel .glyphicon-trash",function(){
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
        let entityArray = getIndexArray();
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
})