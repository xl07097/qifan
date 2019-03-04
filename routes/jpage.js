/**
 * Created by xueliang on 2017/1/6.
 */
var express = require("express");
var router = express.Router();
var jpagedao = require('../dao/jpageDAO.js');

//菜谱详情页的 评论 分页
router.post("/cookComment",function (req, res) {
    var num = req.body.num;
    var cookid = req.body.cookid;
    jpagedao.cookcomment(num,cookid,function (result) {
        res.send(JSON.stringify(result));
    })
});

// 菜谱搜索页的分页
router.post("/cooksearch",function (req, res) {
    var num = req.body.num;
    var key = req.body.key;
    jpagedao.cooksearch(num,key,function (result) {
        res.send(JSON.stringify(result));
    })
});

//帖子列表的分页
router.post("/topiclist",function (req, res) {
    jpagedao.topiclist(req.body.num,function (result) {
        res.send(JSON.stringify(result));
    })
});

//用户搜索页的分页
router.post("/usersearch",function (req, res) {
    var num = req.body.num;
    var key = req.body.key;
    jpagedao.usersearch(num,key,function (result) {
        res.send(JSON.stringify(result));
    })
});

//视频搜索页的分页
router.post("/videosearch",function (req, res) {
    var num = req.body.num;
    var key = req.body.key;
    jpagedao.videosearch(num,key,function (result) {
        res.send(JSON.stringify(result));
    })
});

module.exports = router;