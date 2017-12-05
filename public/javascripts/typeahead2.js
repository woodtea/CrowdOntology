// 默认处理的方法

var nflTeams = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    identify: function(obj) { return obj.team; },
    prefetch: '../data/nfl.json'
});

function nflTeamsWithDefaults(q, sync) {
    if (q === '') {
        sync(nflTeams.get('Detroit Lions', 'Green Bay Packers', 'Chicago Bears'));
    }

    else {
        nflTeams.search(q, sync);
    }
}

$('#default-suggestions .typeahead').typeahead({
        minLength: 0,
        highlight: true
    },
    {
        name: 'nfl-teams',
        display: 'team',
        source: nflTeamsWithDefaults
    });


