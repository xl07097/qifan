var express = require('express');
var router = express.Router();

var videoDAO = require('../dao/videoDAO.js');
var likeDAO = require('../dao/likeDAO.js');
var commentDAO = require('../dao/commentDAO.js');
var collectDAO = require('../dao/collectDAO.js');


/*============================视频列表===============================*/
router.get('/', function(req,res) {
    videoDAO.list(function(result){
        res.render('video',{
            title:'视频中心',
            videoList:result,
            video_likes:result.video_likes,
            video_comments:result.video_comments,
            user_portart:result.user_portart
        });
    });
});
/*============================视频列表的点赞请求==============-=======*/
router.post('/list/like',function(req,res){
    var videoId = req.body.videoid;
    var userId = req.body.userid;

    likeDAO.like('video',userId,videoId,function(result){

        //发数组
        res.send(JSON.stringify(result));
    })
});

/*============================视频列表关键字搜索======================*/
router.post('/search',function(req,res){
    //获取请求参数
    req.on('data',function(data,err){
        var str = data.toString();
        var obj = JSON.parse(str);
        var key = obj.name;
        //交给DAO完成数据库操作
        videoDAO.search(key,function(result){
            //把数据返回给UI
            res.send(JSON.stringify(result));
        })
    });
});

/*==========================视频详情页====================================*/
/*
 video:result[0][0] : 单个视频的详细信息
 hotlist:result[1] ： 热度排行列表
 commentlist:result[2] ： 单个视频的评论列表
 */
router.get('/detail',function(req,res){
    var videoid = req.query.id;
    videoDAO.detail(videoid,function(result){
        res.render('videoDetail',{
            title:result[0][0].video_name,
            video:result[0][0],//console.log('这是video:',result[0][0]);
            hotlist:result[1],//console.log('hotlist:result[1]是',result[1]);热度排行（显示4个）
            commentlist:result[2]//console.log('这是commentlist:',result[2]);
        });
    });
});

/*==========================视频详情页点赞收藏情况=============================*/
router.post('/judge',function(req,res){
    var videoid = req.body.videoid;
    var userid = req.body.userid;

    videoDAO.judge(userid,videoid,function(result){

        res.send(JSON.stringify(result));
    })
});

router.post('/detail/like',function(req,res){
    var videoId = req.body.videoid;
    var userId = req.body.userid;

    likeDAO.like('video',userId,videoId,function(result){

        res.send(JSON.stringify(result));
    })
});

/*==========================视频详情页收藏请求=============================*/
router.post('/detail/collect',function(req,res){
    var videoId = req.body.videoid;
    var userId = req.body.userid;

    collectDAO.like('video',userId,videoId,function(result){
        res.send(JSON.stringify(result));
    })
});

/*==========================视频详情页添加评论=============================*/
router.post('/detail/add',function(req,res){
       commentDAO.add(req.body.content,req.body.time,req.body.userid,req.body.videoid,req.body.commentType,function(data){

          if(data == null){
              //添加失败
              res.send('null');
          }
           else{
              res.send(JSON.stringify(data));
          }
       })

});

/*============================视频列表JSON===============================*/
router.get('/videoJSON', function(req,res) {
    videoDAO.videoJSON (function(result){
        res.json(result);
    });
});

module.exports = router;
