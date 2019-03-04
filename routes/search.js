/**
 * Created by xueliang on 2016/12/27.
 */
var express = require("express");
var router = express.Router();
var searchdao = require("../dao/searchDAO.js");

//搜索
router.get("/",function (req, res) {
    searchdao.search(req.query.type,req.query.key,function (result) {
        if (req.query.type == "菜谱"){
            res.render("searchcook",{
                title:'七饭网-菜谱搜索',
                key:req.query.key,
                searchlist:result
            });
        }

        if (req.query.type == "视频"){
            res.render("searchvideo22",{
                title:'七饭网-视频搜索',
                key:req.query.key,
                searchlist:result
            })
        }

        if (req.query.type == "帖子"){
            for (i = 0;i < result.length;i++){
                result[i].topic_content = result[i].topic_content.substr(0,130);
            }
            res.render("searchtopic",{
                title:'七饭网-帖子搜索',
                key:req.query.key,
                topiclist:result
            })
        }

        if (req.query.type == "用户"){
            res.render("searchuser",{
                title:'七饭网-用户搜索',
                key:req.query.key,
                searchlist:result
            })
        }

    })
});

module.exports = router;