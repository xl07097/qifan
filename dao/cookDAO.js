
var query = require('./connConfig.js');

var cooks = {
    /**
     * 菜谱分类列表
     * @param callback 回调函数
     */
    list:function (typeId,callback) {
        //select * from t_ where type = jiachangcai
        query('call pro_cooklist(?)',[typeId],callback);
    },
    /**
     * 菜谱详情
     * @param cookId 菜谱id
     * @param callback
     */
    //菜谱页详情
    detail:function (cookid, callback) {
        query("call pro_cookdetail(?)",[cookid],callback);
    },
    /**
     *
     * @param userid1 被关注这的id
     * @param cookid 菜谱id
     * @param userid2 登陆者的id
     * @param callback
     */
    judge:function (userid1,cookid,userid2,callback) {
        query("call pro_judge(?,?,?)",[cookid,userid1,userid2],callback)
    },
    
    sort:function (id,typeId,callback) {
        if(id == '0'){
            var sql1 = "SELECT cook_id,cook_images,cook_name,cook_likes,cook_collects,cook_date,user_id,user_name,user_portart FROM t_cook,t_user WHERE t_cook.t_user_id=t_user.user_id AND t_cooktype_small_smalltype_id=? ORDER BY cook_likes DESC";
            query(sql1,[typeId],callback);
        }
        if(id == '1'){
            var sql2 = 'SELECT cook_id,cook_images,cook_name,cook_likes,cook_collects,cook_date,user_id,user_name,user_portart FROM t_cook,t_user WHERE t_cook.t_user_id=t_user.user_id AND  t_cooktype_small_smalltype_id=? ORDER BY cook_collects DESC';
            query(sql2,[typeId],callback);
        }
        if(id == '2'){
            var sql3 = "SELECT cook_id,cook_images,cook_name,cook_likes,cook_collects,cook_date,user_id,user_name,user_portart FROM t_cook,t_user WHERE t_cook.t_user_id=t_user.user_id AND  t_cooktype_small_smalltype_id=? ORDER BY cook_date DESC";
            query(sql3,[typeId],callback);
        }
    }
};

module.exports = cooks;

