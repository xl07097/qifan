/**
 * Created by jesus on 2016/12/21.
 */
var express = require('express');
var router = express.Router();
var personalDAO=require('../dao/personalDAO.js');
var focusDAO = require('../dao/focusDAO.js');
var userDAO = require('../dao/usersDAO.js');

var querystring = require('querystring');
var formidable = require('formidable');
var fs = require('fs');
/* 请求用户 */
router.get('/',function (req,res) {
    var userId = req.query.id;
    personalDAO.list(userId,function(result){
        res.render('personals',{
            title:'七饭网-个人中心',
            personalinfo:result[0],
            personalvideo:result[1],
            personalcook:result[2],
            personalTopic:result[3],
            topicImg:result[4],
            focus:result[5],
            collect:result[6]
        });
    });
});

router.post('/cookDelete',function (req,res) {
    var cookId = req.body.cookId;
    personalDAO.cookDelete(cookId,function (result) {
        res.send(result);
    })
});

router.post('/deleteViedo',function (req,res) {
    var videoid = req.body.videoid;
    personalDAO.deleteVideo(videoid,function(result){
        res.send(JSON.stringify(result));
    });
});

router.post('/deleteTopic',function (req,res) {
    personalDAO.topicDelete(req.body.id,function(result){
        res.send(JSON.stringify(result));
    });
});

//关注
router.post('/focus',function (req,res) {
    var userId = req.body.id;
    focusDAO.userFocus(userId,function (result) {
        result.id=userId;
        res.send(result);
    })
});
//取消关注
router.post('/focus/delete',function (req,res) {
    focusDAO.focusDelete(req.body.userid,req.body.id,function (result) {
        console.log(result);
    })
});

//收藏
router.post('/collect',function (req,res){
    // console.log(req.body);
    focusDAO.collect(req.body.id,function (result) {
        res.send(result);
        // console.log(result);
    })
});

//头像修改
router.post('/',function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (error,fields,files) {
        var extName = '';
        console.log(JSON.stringify(files));
        form.uploadDir = PUBLIC_PATH + "images/";     //设置上传目录
        form.keepExtensions = true;     //保留后缀
        form.maxFieldsSize = 1280 * 720;   //文件大小
        var fileName = saveImage(files['file0'],form.uploadDir);
        personalDAO.upPortart(fields.userId,fields.psw,fileName,function (result) {
            result.imgSrc=fileName;
            res.send(result);
        })
    });
});

//签名修改
router.post('/sign',function (req,res) {
    console.log(req.body.sign,req.body.id);
    personalDAO.upSign(req.body.id,req.body.sign,function (result) {
        res.send(result);
    })
});

//信息修改
router.get('/update',function (req,res){
    personalDAO.upMes(req.query.id,function (result) {
        res.render('messageUpdata',{
            title:'信息修改',
            mess:result[0]
        });
    });
});

router.post('/update',function (req,res) {
    var t = {
        name:req.body.name,
        sex:req.body.sex,
        tele:req.body.tele,
        bir:req.body.bir,
        mail:req.body.mail,
        id:req.body.id,
        psw:req.body.psw
    };
    personalDAO.upMess(t,function (result) {
        result.id=req.body.id;
        res.send(result);
    })
});

//密码修改
router.post('/upPsw',function (req,res){
    userDAO.updatepwd(req.body.id,req.body.psw,function (result) {
        res.send(result);
    });
});

/**
 * 保存图片
 * @param file 图片对象
 * @param uploadDir 图片保存目录
 */
function saveImage(file,uploadDir) {
    switch (file.type) {  //此处in_file  为页面端 <input type=file name=in_file>
        case 'image/jpeg':
            extName = 'jpeg';
            break;
        case 'image/jpg':
            extName = 'jpg';
            break;
        case 'image/png':
            extName = 'png';
            break;
        case 'image/x-png':
            extName = 'png';
        case 'video/mp4':
            extName = 'mp4';
            break;
    }

    try{
        if(extName.length === 0){
            res.render('error', { message: '只支持png和jpg格式图片' });
            return;
        }else {
            var fileName = Math.random() + '.' + extName;
            var newPath = uploadDir + fileName;

            //文件保存
            fs.renameSync(file.path, newPath);  //重命名

            return fileName;
        }
    }catch(error){
        console.log(error);
    }

}

module.exports = router;