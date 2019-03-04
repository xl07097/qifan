/**
 * Created by Administrator on 2016/12/14.
 */
var express = require('express');
var router = express.Router();
var commentdao = require('../dao/commentDAO.js');//评论
var topicDAO=require('../dao/topicDAO.js');

/* 请求帖子列表页面 */
router.get('/',function (req,res) {
    topicDAO.list(function(result){
        var topic = result[0];
        var img = result[1];
        var topic_list = [];
        for(var i = 0 ; i < topic.length ; i++){
            result[0][i].topic_content = result[0][i].topic_content.substr(0,100);
            var img_list = [];
            for(var j = 0 ;j < img.length ; j++){
                if(topic[i].topic_id == img[j].topic_id){
                    img_list.push(img[j].img);
                }
            }
            topic[i].img = img_list;
            topic_list.push(topic[i]);

        }
        res.render('topiclist',{
            title:'话题',
            topiclist:topic_list
        });
    });
});

router.post("/comment/add",function (req, res) {
    commentdao.add(req.body.content,req.body.time,req.body.userid,req.body.cookid,"cook",function (data) {

        res.send(JSON.stringify(data[0]));
    });
});

router.get("/detail",function(req,res){
    var topicid = req.query.id;
    topicDAO.topicdetail(topicid,function(result){
        res.render('topicdetail2',{
                title:'话题中心',
                topicdetail:result[0],
                image:result[1],
                user:result[2],
                topiccomment:result[3]
            }
        )
    })
});

router.post('/detail/add',function(req,res){
    topicDAO.add(req.body.content,req.body.userid,function(data){
        if(data == null){
            //添加失败
            res.send('null');
        }
        else{
            res.send(JSON.stringify(data));
        }
    })
});

module.exports = router;