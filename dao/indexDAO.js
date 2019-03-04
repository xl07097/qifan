/**
 * Created by Administrator on 2016/12/22.
 */
var query = require('./connConfig.js');

var index = {
    carousel:function (callback) {
        query('call pro_index()',null,callback);
    },
    judge:function (userid,callback) {
        query("SELECT * from t_followuser where t_followuser.followuser_userid=?",[userid],callback)
    }
};

module.exports = index;