
var query = require("./connConfig.js");

//=================分页DAO=============
var page = {
    //=========菜谱详情页评论
    cookcomment:function (n, cookid, callback) {
        var m = (n-1)*8;
        var sql = " SELECT t_comment_cook.*,t_user.user_name,t_user.user_portart " +
            "FROM t_comment_cook,t_user " +
            "WHERE t_comment_cook.t_user_user_id=t_user.user_id and t_comment_cook.t_cook_cook_id=? ORDER BY t_comment_cook.commentcook_time DESC limit "+m+" ,8";
        query(sql,[cookid],callback);
    },

    //============菜谱搜索页面
    cooksearch:function (n, key, callback) {
        var m = (n-1)*15;
        var sql = " SELECT t_cook.*,t_user.user_name,t_user.user_portart " +
            "FROM t_cook,t_user " +
            "WHERE t_user.user_id=t_cook.t_user_id and t_cook.cook_name like '%"+key+"%' ORDER BY t_cook.cook_date DESC limit "+m+" ,15";
        query(sql,[null],callback);
    },

    //==============帖子搜索页面
    topicsearch:function (n,key,callback) {
        var m = (n-1)*15;
        var sql1 = " SELECT t_topic.*,t_user.user_name " +
            "FROM t_topic,t_user " +
            "WHERE t_user.user_id=t_topic.t_user_user_id and t_topic.topic_title like '%"+key+"%' ORDER BY t_topic.topic_date DESC limit "+m+" ,15";
        query(sql1,[null],function (r1) {
            var sql2 = "SELECT * FROM t_images";
            query(sql2,[null],function (r2) {
                var topic = r1;
                var img = r2;
                var topic_list = [];
                for(var i = 0 ; i < topic.length ; i++){
                    var img_list = [];
                    for(var j = 0 ;j < img.length ; j++){
                        if(topic[i].topic_id == img[j].topic_id){
                            img_list.push(img[j].img);
                        }
                    }
                    topic[i].img = img_list;
                    topic_list.push(topic[i]);
                }
                callback(topic_list);
            })
        });
    },

    //==============视频搜索页面
    videosearch:function (n,key,callback) {
        var m = (n-1)*15;
        var sql = " SELECT t_video.*,t_user.user_name,t_user.user_portart " +
            "FROM t_videoc,t_user " +
            "WHERE t_video.video_id=t_video.t_user_user_id and t_video.video_name like '%"+key+"%' order by tvideo.video_time limit "+m+" ,15";
        query(sql,[null],callback);
    },

    //==============用户搜索页面
    usersearch:function (n,key,callback) {
        var m = (n-1)*15;
        var sql = " SELECT * FROM t_user WHERE user_name like '%"+key+"%' limit "+m+" ,15";
        query(sql,[null],callback);
    },

    //=============帖子列表的分页和帖子搜索页的分页
    topiclist:function (n, callback) {
        var m = (n-1)*15;
        query("call pro_topiclist(?)",[m],callback)
    }
};

module.exports = page;