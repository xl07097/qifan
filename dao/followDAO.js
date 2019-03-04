
var query = require('./connConfig.js');

var follow = {
    /**
     *
     * @param userid1 关注者的id
     * @param userid2 被关注者的id
     * @param callback 回调函数
     */
    followuser:function (userid1, userid2,callback) {
        var sql = "select * from t_followuser where followuser_userid=? and t_user_user_id=?";
        query(sql,[userid1,userid2],function (result) {
            if (result.length == 1){
                var sql = "delete from t_followuser where followuser_userid=? and t_user_user_id=?";
                query(sql,[userid1,userid2],function (result) {
                    if (result.affectedRows == 1){
                        callback({re:2});
                        return;
                    }
                    callback({re:0});
                });
                return;
            }
            sql = "insert into t_followuser values(null,?,?)";
            query(sql,[userid1,userid2],function (result) {
                if (result.affectedRows == 1){
                    callback({re:1});
                    return;
                }
                callback({re:0});
            })
        });

    }
};


module.exports = follow;

