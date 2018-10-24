var user = $("#stigmod-username").text();
let curTime = new Date();

wushuangProject();

function wushuangProject() {
    let startTimeC = new Date("2018-10-21 18:00");
    let endTimeC = new Date("2018-10-21 22:00");

    let startTimeI = new Date("2018-10-24 20:00");
    let endTimeI = new Date("2018-10-24 22:00");



    wushuangC = ["jiangy", "ciecwch", "wxmin", "luoyx", "zhangmy", "zhut", "464408345", "zhangxy",]
    wushuangI = ["yuxiaz", "symbolk", "liberion", "weiyh", "guojm", "2217496259"]

    if (wushuangC.indexOf(user) != -1) {
        if(startTimeC<=curTime && curTime<=endTimeC){
            $("#stigmod-model-info-container").append(generateProject("无双-电影人物关系图谱-群体", "中文", "无双-电影人物关系图谱", "Updated on " + curTime.toLocaleString()));
        }
    }
    if (wushuangI.indexOf(user) != -1) {
        if(user=="2217496259") user="qiaoxh";
        if(startTimeI<=curTime && curTime<=endTimeI) {
            $("#stigmod-model-info-container").append(generateProject("无双-电影人物关系图谱-" + user, "中文", "无双-电影人物关系图谱", "Updated on " + curTime.toLocaleString()));
        }
    }

    function generateProject(name, language, description, updateTime) {
        let html = '<div class="stigmod-modelshow"><div class="row">' +
            '<div class="col-xs-9 stigmod-modelshow-title"><a href="/workspace/' + name + '">' + name + '</a></div>' +
            '<div class="col-xs-3 stigmod-modelshow-info">' +
            '<i class="fa fa-language"></i>' +
            '<span class="stigmod-modelshow-language">' + language + '</span> &nbsp;&nbsp;</div></div>' +
            '<div class="row"><div class="col-xs-10 stigmod-modelshow-description">' + description + '</div><div class="col-xs-2"></div></div>' +
            '<div class="row"><div class="col-xs-12 stigmod-modelshow-date">' + updateTime + '</div></div><hr/></div>'

        return html;
    }
}



