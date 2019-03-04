var express = require('express');
var router = express.Router();

var indexdao = require('../dao/indexDAO.js');


router.get('/', function(req, res, next) {
    indexdao.carousel(function (result) {

    var topic = result[3];
    var img = result[4];

    var topic_list = [];

    for(var i = 0 ; i < topic.length ; i++){
      var img_list = [];

      for(var j = 0 ;j < img.length ; j++){
        if(topic[i].topic_id == img[j].topic_id){
          img_list.push(img[j].img);
        }
      }
      
      if(img_list.length == 3){
        topic[i].img = img_list;
        topic_list.push(topic[i]);
      }
    }

    res.render('index', {
      title: '七饭网-首页',
      car_list:result[0],
      recom_cookList:result[1],
      recom_videoList:result[2],
      topic_list:topic_list,
      user_list:result[5]
    });


  });
});

//判断用户是否已关注
router.post("/",function (req, res) {
    indexdao.judge(req.body.userid,function (data){
        res.send(JSON.stringify(data))
    })
});

module.exports = router;
