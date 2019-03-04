
var query = require('./connConfig.js');
var edit = {
    list:function (cookId,callback) {
        query("call pro_cookEdit(?)",[cookId],callback);
    },
    editCook:function (obj,callback) {
        var sql = 'UPDATE t_cook SET cook_name=?,cook_difficulty=?,cook_content=?,cook_images=?,cook_time=?,cook_date=?,t_cooktype_small_smalltype_id=?,t_user_id=? WHERE cook_id=?';
        query(sql,[obj.cookName,obj.difficult,obj.cookContent,obj.cookImg,obj.cookTime,obj.cookDate,obj.typeId,obj.userId,obj.cookId],callback);
    },
    editMat:function (obj,id,callback) {
        var sql = 'UPDATE t_material SET material_name=?,material_num=? WHERE t_cook_cook_id=? AND material_id=?';
        query(sql,[obj.matId,obj.matName,obj.matNum,id],callback);
    },
    editSub:function (obj,id,callback) {
        var sql = 'UPDATE t_submaterial SET submaterial_name=?,submaterial_num=? WHERE t_cook_cook_id=? AND submaterial_id=?';
        query(sql,[obj.subId,obj.subName,obj.subNum,id],callback);
    },
    editStep:function (obj,file,id,callback) {
        var sql = 'UPDATE t_step SET step_num=?,step_img=?,step_content=? WHERE t_cook_cook_id=? AND step_id=?';
        query(sql,[obj.stepNum,file,obj.stepText,id,obj.stepId],function (result) {
            if( result.affectedRows == 0){
                var sql1 = 'INSERT INTO t_step VALUES(null,?,?,?,?)';
                query(sql1,[obj.stepNum,file,obj.stepText,id],callback);
            }

        });
    },
    videoList:function (id,callback) {
        var sql = ' SELECT * FROM t_video WHERE video_id=?';
        query(sql,[id],callback);
    },
    editVideo:function (obj,img,file,callback) {
        var sql = 'UPDATE t_video SET video_name=?,video_img=?,video_src=?,t_user_user_id=?,video_time=? WHERE video_id=?';
        query(sql,[obj.videoName,img,file,obj.userId,obj.time,obj.videoId],callback);
    }
};

module.exports = edit;