/**
 * Created by xueliang on 2016/12/22.
 */
var query = require('./connConfig.js');

var search= {
    search:function (type,key,callback) {
        if (type == "菜谱"){
            query("select t_cook.*,t_user.user_name " +
                "from t_cook,t_user " +
                "where t_user.user_id=t_cook.t_user_id and t_cook.cook_name like '%" + key +"%' order by t_cook.cook_date desc",[key],callback);
        }

        if (type == "视频"){
            query("select t_video.* ,t_user.user_name " +
                "from t_video,t_user " +
                "where t_user.user_id=t_video.t_user_user_id and t_video.video_name like '%" + key +"%' order by t_video.video_time",[key],callback)
        }

        if (type == "帖子"){
            var sql1 = " SELECT t_topic.*,t_user.user_name " +
                "FROM t_topic,t_user " +
                "WHERE t_user.user_id=t_topic.t_user_user_id and t_topic.topic_title like '%"+key+"%' ORDER BY t_topic.topic_date DESC";
            query(sql1,[key],function (r1) {
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
            })
        }

        if (type == "用户"){
            query("select t_user.* from t_user where t_user.user_name like '%" + key +"%'",[key],callback)
        }
    }
};

module.exports = search;
