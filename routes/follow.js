/**
 * Created by xueliang on 2016/12/26.
 */
var express = require("express");
var router = express.Router();
var followDao = require("../dao/followDAO.js");

router.post("/user",function (req, res) {
    followDao.followuser(req.body.userid1,req.body.userid2,function (result) {
        res.send(JSON.stringify(result));
    })
});

module.exports = router;

