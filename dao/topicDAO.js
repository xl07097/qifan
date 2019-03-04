/**
 * Created by Administrator on 2016/12/14.
 */
var query = require('./connConfig.js');

var topics = {
    list:function (callback) {
        query("call pro_topiclist(?)",[null],callback);
    },
    add:function(context,time,userId,topicid,callback){
        var sqlI3 = 'insert into t_commenttopic values(null,?,?,?,?)';
        var paramsT = [context,time,userId,topicid];
        var sqlS3 = 'SELECT t_topic.*,t_user.user_portart,t_commenttopic.* FROM t_topic,t_user,t_commenttopic WHERE t_user.user_id=t_commenttopic.t_user_user_id AND t_topic.topic_id=t_commenttopic.t_topoc_topic_id AND t_topic.topic_id=?';
        query(sqlI3,paramsT,function(result){
            query(sqlS3,[result.insertId],callback);
        });
    },
    topicdetail: function(topicID,callback){
        query("call pro_topicdetail(?)",[topicID],callback);
    }
};


module.exports = topics;