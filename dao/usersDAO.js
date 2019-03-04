/**
 * Created by Administrator on 2016/12/14.
 */

var query = require('./connConfig.js');

var users = {

    /**
     * 用户登陆函数
     * @param tel 手机号
     * @param password 登陆密码
     * @param callback 回调函数
     */
    login: function (tel, password, callback) {
        var sql = "select * from t_user where user_tele=? and user_password=?";
        query(sql, [tel, password], callback);
    },

    /**
     * 用户注册函数
     * @param name 用户注册名
     * @param tel 用户手机号（用于找回密码）
     * @param password 用户注册密码
     * @param callback 回调函数
     */
    register: function (password, tel, callback) {
        query("call pro_register(?,?)", [password, tel], callback);
    },

    /**
     * 修改密码
     * @param userid 用户id
     * @param oldpassword 老密码
     * @param newpassword 新密码
     * @param callback 回调函数
     */
    updatepwd:function (userid,newpassword,callback) {
        var sql2 = "UPDATE t_user SET user_password=? where user_id=?";
        query(sql2,[newpassword,userid],callback);
    }
    
};

module.exports = users;