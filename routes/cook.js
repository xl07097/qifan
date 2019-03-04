/**
 * Created by Administrator on 2016/12/14.
 */
var express = require('express');
var router = express.Router();

var cookdao = require('../dao/cookDAO.js');
var commentdao = require('../dao/commentDAO.js');//评论
var likedao = require('../dao/likeDAO.js');//点赞
var collectdao = require('../dao/collectDAO.js');//收藏


router.get('/',function (req,res) {
    var typeId = req.query.id;
    cookdao.list(typeId,function (result) {
        res.render('cook',{
            title:'七饭网-菜谱分类',
            cooks_bigName:result[0],
            cooks_smallName:result.slice(1,5),
            cooks_list:result[5]
        });
    });
});

router.post('/',function (req,res) {
    var typeId = req.body.typeId;
    var sort = req.body.sortId;
    cookdao.sort(sort,typeId,function (result) {
        res.send(result);
    });
    
});

//菜谱详情页数据
router.get("/detail",function (req, res) {
    //1、获取发过来的数据，你要查看哪个商品的详情

    //2、数据库操作，result是二位数组
    cookdao.detail(req.query.id,function (result) {
        // console.log(result);
        //3、将结果发给模板
        res.render("cookdetail",{
            title:"七饭网-菜谱详情",
            cook:result[0][0],
            user:result[2][0],
            comment:result[1],
            materiallist:result[3],
            submateriallist:result[4],
            steplist:result[5],
            cookrecommend:result[6]
        })
    })
});

//菜谱评论
router.post("/comment/add",function (req, res) {
    commentdao.add(req.body.content,req.body.time,req.body.userid,req.body.cookid,"cook",function (data) {
        res.send(JSON.stringify(data[0]));
    });
});

//菜谱点赞
router.post("/like/add",function (req, res) {
    likedao.like("cook",req.body.userid,req.body.cookid,function (data) {
        res.send(JSON.stringify(data));
    })
});

//调用菜谱收藏函数
router.post("/collect/add",function (req, res) {
    collectdao.like("cook",req.body.userid,req.body.cookid,function (data) {
        res.send(JSON.stringify(data));
    })
});

//判断是否点赞收藏
router.post("/judge",function (req, res) {
    cookdao.judge(req.body.user_id,req.body.cookid,req.body.userid,function (data){
        res.send(JSON.stringify(data))
    })
});

// cookdao.detail(2,function (data) {
//     console.log(data[6]);
// });

module.exports = router;
