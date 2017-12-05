
let indexArray;

function getIndexArray(model = instance_model){
    let indexArray = [];
    for (let id in model.nodes) {
        if (model.nodes[id].tags != undefined) {
            indexArray.push(instance_model.nodes[id].value);
        }
    }
    return indexArray;
}

function setSource(array){
    let newArray = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: array
    });

    return newArray;
}

$('#stigmod-search-left-input').typeahead({
        hint: true,
        highlight: true,
        minLength: 0
    },
    {
        name: 'IndexNames',
        source: setSource(indexArray)
    });

function setAttributeTypeTypeahead(array){
    $('#attribute-revise .type-input').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        },
        {
            name: 'attributeNames',
            source: setSource(array)
        });
}

function setAttributeValueTypeahead(array){
    $('#attribute-revise .value-input').typeahead({
            hint: true,
            highlight: true,
            minLength: 0,
        },
        {
            name: 'attributeNames',
            source: setSource(array)
        });
}

function setRelationTypeTypeahead(array){
    $('#relation-revise .type-input').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        },
        {
            name: 'attributeNames',
            source: setSource(array)
        });
}

function setRelationValueTypeahead(array){
    $('#relation-revise .value-input').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        },
        {
            name: 'attributeNames',
            source: setSource(array)
        });
}

const typeaheadDefaultConfig = {
    hint: true,
    highlight: true,
    minLength: 0,
    items:5
}