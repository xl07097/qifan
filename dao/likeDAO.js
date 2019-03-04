/**
 * Created by Administrator on 2016/12/15.
 */
var query = require('./connConfig.js');

//点赞和取消点赞
var likes = {
    like:function (likeType,userId,id,callback) {
        if (likeType == 'cook') {
            var sql = "select * from t_likecook where t_cook_cook_id=? and t_user_user_id=?";
            query(sql, [id, userId], function (result) {
                if (result.length == 1) {
                    sql = "delete from t_likecook where t_cook_cook_id=? and t_user_user_id=?";
                    //============取消点赞
                    query(sql, [id, userId], function (result) {
                        if (result.affectedRows == 1) {
                            sql = "update t_cook set cook_likes=cook_likes-1 where cook_id=?";
                            query(sql, [id], function (result) {
                                if (result.affectedRows == 1) {
                                    sql = "select cook_likes from t_cook where cook_id=?";
                                    query(sql, [id], function (result) {
                                        var obj = {
                                            res: 2,
                                            likenum: result[0].cook_likes
                                        };
                                        callback(obj);
                                        return;
                                    })
                                }
                            });
                        }
                    });
                }
                else {
                    sql = "insert into t_likecook values(null,?,?)";
                    var params = [id, userId];
                    //===========点赞
                    query(sql, params, function (result) {
                        if (result.affectedRows == 1) {
                            sql = "update t_cook set cook_likes=cook_likes+1 where cook_id=?";
                            query(sql, [id], function (result) {
                                if (result.affectedRows == 1) {
                                    sql = "select cook_likes from t_cook where cook_id=?";
                                    query(sql, [id], function (result) {
                                        var obj = {
                                            res: 1,
                                            likenum: result[0].cook_likes
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
        if(likeType == 'video'){
            query('call pro_likevideo(?,?)',[userId,id],callback);
        }
        if(likeType == 'topic'){
            query('call pro_collecttopic(?,?)',[userId,id],callback);
        }
    }
};

module.exports = likes;