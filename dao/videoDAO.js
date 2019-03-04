/**
 * Created by Administrator on 2016/12/14.
 */
var query = require('./connConfig.js');

var videos = {
    list:function(callback){
        query('select t_video.*,t_user.user_name,t_user.user_portart from t_video,t_user where t_video.t_user_user_id = t_user.user_id',null,callback);
    },
    detail:function(videoId,callback){
        query('call pro_videodetail(?)',[videoId],callback);
    },
    search:function(key,callback){
        var sql = "select * from t_video where video_name like '%"+key+"%'";
        query(sql,null,callback);
    },
    judge: function (userid,videoid,callback) {
        query("call pro_judgevideo(?,?)",[userid,videoid],callback);
    },
    videoJSON :function(callback){
        query('select t_video.*,t_user.user_name,t_user.user_portart from t_video,t_user where t_video.t_user_user_id = t_user.user_id',null,callback);
    }
};

module.exports = videos;
