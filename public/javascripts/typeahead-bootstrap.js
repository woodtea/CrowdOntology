
let indexArray;

function setSource(array){
    return array;
}

function getIndexArray(model = instance_model){
    let indexArray = [];
    for (let id in model.nodes) {
        if (isEntity(id)) {
            indexArray.push(model.nodes[id].value);
        }
    }
    return indexArray;
}

function setIndexTypeahead(array){
    $('#stigmod-search-left-input').typeahead({
        source: setSource(array),
        autoSelect: true
    });
}

function getClassArray(model = model){
    return [""];
}

function setClassTypeTypeahead(array){
    $('#class-revise .type-input').typeahead({
        source: setSource(array),
        autoSelect: true
    });
}

function setAttributeTypeTypeahead(array){
    $('#attribute-revise .type-input').typeahead({
        source: setSource(array),
        autoSelect: true
    });
}

function setAttributeValueTypeahead(array){
    $('#attribute-revise .value-input').typeahead({
            source: setSource(array),
            autoSelect: true
        });
}

function setRelationTypeTypeahead(array){
    $('#relation-revise .type-input').typeahead({
        source: setSource(array),
        autoSelect: true
    });
}

function setRelationValueTypeahead(array){
    $('#relation-revise .value-input').typeahead({
        source: setSource(array),
        autoSelect: true
    });
}
