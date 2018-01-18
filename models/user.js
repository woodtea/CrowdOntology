/**
 * Created by ChiangEarl on 17/12/28.
 */
var db = require('./db');

function User(user) {

    // 核心属性
    this.password = user.password;
    //this.state = user.state;
    this.mail = user.mail;
    //this.link = user.link;

    // 附加信息属性
    //this.name = user.name;
    //this.location = user.location;
    //this.url = user.url;
    //this.sign_up_date = user.sign_up_date;
    //this.avatar = user.avatar;
};

module.exports = User;

User.prototype.save = function save() {

    //外部已先做了一次存在性判断
    var user = {
        password: this.password,
        //state: 0,
        mail: this.mail,
        //link: this.link,
        //name: this.name,
        //location: this.location,
        //url: this.url,
        //sign_up_date: this.sign_up_date,
        //avatar: this.avatar
    };
    db.user.push(user);

    console.log(db);
    return;
};

User.prototype.activate = function activate(callback) {

};

User.prototype.updateLink = function updateLink(callback) {

};

User.prototype.updatePW = function updatePW(pw, callback) {

};

// 更新用户 profile
User.prototype.updateProfile = function updateProfile(profile, callback) {

};

User.get = function get(mail) {
    var getOneUser;
    for(let n in db.user){
        if(db.user[n].mail == mail) {
            getOneUser = db.user[n];
            break;
        }
    }
    return getOneUser;
};