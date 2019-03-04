
var query = require('./connConfig.js');

//收藏、取消收藏
var collect = {
    like:function (collectType,userId,id,callback) {
        if(collectType === 'video'){
            query('call pro_collectvideo(?,?)',[id,userId],callback);
        }
        if(collectType === 'topic'){
            query('call pro_liketopic(?,?)',[userId,id],callback);
        }
        /**
         * 菜谱收藏
         * @param collectType 类型
         * @param userId 用户id
         * @param id 类型的相关id
         * @param callback
         */
        if(collectType === 'cook'){
            var sql = "SELECT * from t_collectcook where t_cook_cook_id=? and t_user_user_id=?";
            query(sql,[id,userId],function (result) {
                if (result.length == 1){
                    sql = "delete from t_collectcook where t_cook_cook_id=? and t_user_user_id=?";
                    query(sql,[id,userId],function (result) {
                        if (result.affectedRows == 1){
                            sql = "update t_cook set cook_collects=cook_collects-1 where cook_id=?";
                            query(sql, [id], function (result) {
                                if (result.affectedRows == 1) {
                                    sql = "select cook_collects from t_cook where cook_id=?";
                                    query(sql, [id], function (result) {
                                        var obj = {
                                            res: 2,
                                            collectnum: result[0].cook_collects
                                        };
                                        callback(obj);
                                        return;
                                    })
                                }
                            });
                        }
                    });
                }else {
                    sql = "insert into t_collectcook values(null,?,?)";
                    var params = [userId,id];
                    query(sql,params,function (result) {
                        if (result.affectedRows == 1){
                            sql = "update t_cook set cook_collects=cook_collects+1 where cook_id=?";
                            query(sql, [id], function (result) {
                                if (result.affectedRows == 1) {
                                    sql = "select cook_collects from t_cook where cook_id=?";
                                    query(sql, [id], function (result) {
                                        var obj = {
                                            res: 1,
                                            collectnum: result[0].cook_collects
                                        };
                                        callback(obj);
                                        return;
                                    })
                                }
                            });
                        }
                    })
                }
            });
        }
    }
};

module.exports = collect;






