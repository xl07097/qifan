/**
 * Created by jesus on 2016/12/22.
 */
var query = require('./connConfig.js');
var personals = {
    list:function (userId,callback) {
        query("call pro_personal(?)",[userId],callback);
    },
    cookDelete:function(cookId,callback) {
        query("call pro_cookDelete(?)",[cookId],callback);
    },
    deleteVideo:function(videoid,callback){
        query("call pro_deleteVideo(?)",[videoid],callback);
    },
    topicDelete:function (id,callback) {
        query('call pro_deleteTopic(?)',[id],callback);
    },
    upPortart:function (id,psw,file,callback) {
        var sql = 'UPDATE t_user SET user_portart=?,user_password=? WHERE user_id=?';
        query(sql,[file,psw,id],callback);
    },
    //修改签名
    upSign:function (id,sign,callback) {
        var sql = 'UPDATE t_user SET user_sign=? WHERE user_id=?';
        query(sql,[sign,id],callback);
    },
    //信息修改页面
    upMes:function (id,callback) {
        var sql = 'select t_user.* from t_user where user_id=?';
        query(sql,[id],callback);
    },
//    信息修改
    upMess:function (obj,callback) {
        var sql = 'UPDATE t_user SET user_name=?,user_password=?,user_sex=?,user_tele=?,user_birth=?,user_email=? WHERE user_id=?';
        query(sql,[obj.name,obj.psw,obj.sex,obj.tele,obj.bir,obj.mail,obj.id],callback);
    }
};

module.exports = personals;