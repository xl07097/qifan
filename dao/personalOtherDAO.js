/**
 * Created by Administrator on 2017/1/9.
 */
var query = require('./connConfig.js');
var personalOther = {
    list:function (userId,callback) {
        query("call pro_personal(?)",[userId],callback);
    }
};

module.exports = personalOther;