var mysql = require('mysql');

//访问mysql数据库的配置
var config = {
    // host:'192.168.3.3',
    host: 'localhost',
    port: 3306,
    database: 'qfdb',
    user: 'root',
    password: '123456'
};

//创建连接池
var pool = mysql.createPool(config);

/**
 * 数据库查询操作封装
 * @param sql 执行的sql语句
 * @param params sql语句中的参数
 * @param callback  回调函数
 */

var query = function (sql, params, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log('创建数据库连接失败,', err);
        }
        connection.query(sql, params, function (err, result) {
            if (err) {
                return console.log('数据查询失败,', err);
            }
            callback(result);
            connection.release();
        });

    })
};

module.exports = query;

query('select * from t_user', null, function(result){
    console.log(result)
})