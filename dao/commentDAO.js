
var query = require('./connConfig.js');

var comment = {
    //添加评论
    add:function (content,time,userId,id,commentType,callback) {
        //============菜谱评论
        if(commentType === 'cook'){
            var sqlI1 = 'insert into t_comment_cook values(null,?,?,?,?)';
            var params = [content,time,userId,id];
            query(sqlI1,params,function(result){
                if(result.affectedRows == 1) {
                    //查询添加的评论
                    sql = 'SELECT t_comment_cook.*,t_user.user_name,t_user.user_portart ' +
                        'FROM t_comment_cook,t_user ' +
                        'WHERE t_comment_cook.t_user_user_id=t_user.user_id AND t_comment_cook.commentcook_id=?';
                    query(sql,[result.insertId],function (result) {
                        callback(result);
                    })
                }
                else {
                    callback(null);
                }
            });
        }
        if(commentType == 'video'){
            var sqlI2 = 'insert into t_videocomment values(null,?,?,?,?)';
            var paramsV = [content,time,userId,id];
            var sqlS2 = 'select t_videocomment.*,t_user.user_name,t_user.user_portart from t_videocomment,t_user where t_videocomment.t_user_user_id = t_user.user_id and t_videocomment.videocomment_id = ?';
            query(sqlI2,paramsV,function(result){
                query(sqlS2,[result.insertId],callback);
            });
        }
        if(commentType == 'topic'){
            var sqlI3 = 'insert into t_videocomment values(null,?,?,?,?)';
            var paramsT = [content,time,userId,id];
            var sqlS3 = 'select t_commenttopic.*,t_user.user_name from t_commenttopic,t_user where t_commenttopic.user_id = t_user.t_user_user_id and t_commenttopic.commenttopic_id = ?';
            query(sqlI3,paramsT,function(result){
                query(sqlS3,[result.insertId],callback);
            });
        }
    }
};

module.exports = comment;