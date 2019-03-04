/**
 * Created by Administrator on 2016/12/21.
 */
var query = require('./connConfig.js');

var publics = {
    type:function (callback) {
        query('call pro_public()',null,callback);
    },
    add:function (obj,callback) {
        var sql = "INSERT INTO t_cook(cook_name,cook_difficulty,cook_content,cook_images,cook_time,cook_date,t_cooktype_small_smalltype_id,t_user_id) VALUES(?,?,?,?,?,?,?,?)";
        query(sql,[obj.cookName,obj.difficult,obj.cookContent,obj.cookImg,obj.cookTime,obj.cookDate,obj.typeId,obj.userId],callback);
    },
    addMater:function (obj,id,callback) {
        var sql = 'INSERT INTO t_material VALUES(null,?,?,?)';
        query(sql,[obj.matName,obj.matNum,id],callback);
    },
    addSub:function (obj,id,callback) {
        var sql = 'INSERT INTO t_submaterial VALUES(null,?,?,?)';
        query(sql,[obj.subName,obj.subNum,id],callback);
    },
    addStep:function (obj,file,id,callback) {
        var sql = 'INSERT INTO t_step VALUES(null,?,?,?,?)';
        query(sql,[obj.stepNum,file,obj.stepText,id],callback);
    },
    addVideo:function (obj1,img,video,callback) {
        var sql = "INSERT INTO t_video(video_name,t_user_user_id,video_img,video_src,video_time) VALUES(?,?,?,?,?)";
        query(sql,[obj1.videoName,obj1.userId,img,video,obj1.time],callback);
    },
    addTopic:function (obj,callback) {
        var sql = "INSERT INTO t_topic(topic_title,topic_date,topic_content,t_user_user_id) VALUES(?,?,?,?)";
        query(sql,[obj.title,obj.time,obj.content,obj.userId],callback);
    },
    addTopicImg:function (file,userId,topicId,callback) {
        var sql = "INSERT INTO t_images(img,user_id,topic_id) VALUES(?,?,?)";
        query(sql,[file,userId,topicId],callback);
    }
};

module.exports = publics;