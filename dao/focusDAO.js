
var query = require('./connConfig.js');
var focus = {
    userFocus:function (id,callback) {
        var sql = "call pro_personalFocus(?)";
        query(sql,[id],callback);
    },
    focusDelete:function (userid,id,callback) {
        var sql="DELETE from t_followuser where followuser_userid=? and t_user_user_id=?";
        query(sql,[userid,id],callback);
    },
    collect:function (id,callback) {
        var sql = "call pro_perCollect(?)";
        query(sql,[id],callback);
    }
};
module.exports = focus;