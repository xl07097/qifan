/**
 * Created by Administrator on 2017/1/9.
 */
var express = require('express');
var router = express.Router();
var personOtherDAO=require('../dao/personalOtherDAO.js');

router.get('/',function (req,res) {
    var userId = req.query.id;
    // console.log(userId);
    personOtherDAO.list(userId,function(result){
        res.render('personalsOther',{
            title:'七饭网-其他用户',
            personalinfo:result[0],
            personalvideo:result[1],
            personalcook:result[2],
            focus:result[5],
            collect:result[6]
        });
    });
});


module.exports = router;