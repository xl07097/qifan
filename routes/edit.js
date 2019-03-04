/**
 * Created by Administrator on 2017/1/6.
 */
var express = require('express');
var router = express.Router();
var editDAO=require('../dao/editDAO.js');

var formidable = require('formidable');
var fs = require('fs');

var querystring = require('querystring');
/* 请求编辑菜谱 */
router.get('/',function (req,res) {
    var cookId = req.query.id;

    editDAO.list(cookId,function (result) {
        var cook = result[5][0];
        cook.material = result[6];
        cook.submaterial = result[7];
        cook.step = result[8];

        res.render('cookEdit',{
            title:'七饭网-菜谱编辑',
            cookType:result[0],
            smallType:result.slice(1,5),
            cookContent:cook
        });
    });
});

router.post('/',function (req,res) {
    var form = new formidable.IncomingForm();

    form.parse(req,function (error,fields,files) {
        //fields接收文字,files接收文件(视频，图片，压缩包等)

        form.uploadDir = PUBLIC_PATH + 'images/';//上传目录
        form.keepExtensions = true; //保留后缀
        form.maxFieldsSize = 2*1024; //文件大小

        if(files["file1"].type == "application/octet-stream"){
            files["file1"].name = JSON.parse(fields.imgSrc).name;
            files["file1"].type = JSON.parse(fields.imgSrc).type;
            var f1 = files["file1"];
            var fileName = saveImage(f1,form.uploadDir,0);
        }else{
            var f1 = files["file1"];
            var fileName = saveImage(f1,form.uploadDir,1);
        }

        var c = {
            cookName:fields.title,
            difficult:fields.difficult,
            cookContent:fields.story,
            cookImg:fileName,
            cookTime:fields.cookTime,
            cookDate:new Date().Format("yyyy-MM-dd hh:mm:ss"),
            typeId:fields.typeId,
            userId:fields.userId,
            cookId:fields.cookId
        };

        var mater = JSON.parse(fields.material);
        var sub = JSON.parse(fields.submaterial);
        var step = JSON.parse(fields.cookStep);

        //修改菜谱
        editDAO.editCook(c,function (result) {
            res.send(result);

            //修改主料
            for(var m in mater){
                var mat = mater[m];

                editDAO.editMat(mat,fields.cookId,function (r1) {
                });
            }
            //修改辅料
            for(var b in sub){
                var su = sub[b];
                editDAO.editSub(su,fields.cookId,function (r2) {
                });
            }

            //修改步骤
            for(var key in files) {
                var extName = '';  //后缀名
                if(key == 'file1')
                    continue;

                //强行匹配
                var a = key.substring(8)-1;

                var sp = step[a];

                var file = files[key];
                form.uploadDir = PUBLIC_PATH + "images/";     //设置上传目录
                form.keepExtensions = true;     //保留后缀
                form.maxFieldsSize = 2 * 1024;   //文件大小
                if(file.type == "application/octet-stream"){
                    file.name = (JSON.parse(fields.stepImg)[a]).name;
                    file.type = (JSON.parse(fields.stepImg)[a]).type;
                    var filename = saveImage(file,form.uploadDir,0);
                }else{
                    var filename = saveImage(file,form.uploadDir,1);
                }
                // var filename = saveImage(file,form.uploadDir,0);

                editDAO.editStep(sp,filename,fields.cookId,function (r3) {
                    console.log(r3);
                });
            }

        });

    });
});

router.get('/video',function (req,res) {
    var videoId = req.query.id;
    editDAO.videoList(videoId,function (result) {
        res.render('videoEdit',{
            title:'七饭网-视频编辑',
            videoList:result[0]
        });
    })
});

router.post('/video',function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (error,fields,files) {

        var v = {
            videoName:fields.title,
            userId:fields.userId,
            videoId:fields.videoId,
            time:new Date().Format("yyyy-MM-dd hh:mm:ss")
        };
        var extName = '';

        var keyImg = 'file1';
        var keyVideo = 'file2';

        if(keyVideo){
            form.uploadDir = PUBLIC_PATH + "video/video/";     //设置上传目录
            form.keepExtensions = true;     //保留后缀
            form.maxFieldsSize = 1280 * 720;   //文件大小
            if(files[keyVideo].type == "application/octet-stream"){
                files[keyVideo].name = JSON.parse(fields.videoSrc).name;
                files[keyVideo].type = JSON.parse(fields.videoSrc).type;
                var fileVideo = saveImage(files[keyVideo],form.uploadDir,0);
            }else{
                var fileVideo = saveImage(files[keyVideo],form.uploadDir,1);
            }
            // var fileVideo = saveImage(files[keyVideo],form.uploadDir,1);
        }
        if(keyImg){
            form.uploadDir = PUBLIC_PATH + "video/videoIMG/";     //设置上传目录
            form.keepExtensions = true;     //保留后缀
            form.maxFieldsSize = 2 * 1024;   //文件大小

            if(files[keyImg].type == "application/octet-stream"){
                files[keyImg].name = JSON.parse(fields.imgSrc).name;
                files[keyImg].type = JSON.parse(fields.imgSrc).type;
                var fileImg = saveImage(files[keyImg],form.uploadDir,0);
                console.log(fileImg);
            }else{
                var fileImg = saveImage(files[keyImg],form.uploadDir,1);
            }

            // var fileImg = saveImage(files[keyImg],form.uploadDir);
        }
        editDAO.editVideo(v,fileImg,fileVideo,function (result) {
            res.send(result);
        });
    });
});

/**
 * 保存图片
 * @param file 图片对象
 * @param uploadDir 图片保存目录
 */
function saveImage(file,uploadDir,type) {
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

    if(extName.length == 0){
        res.render('error', { message: '只支持png和jpg格式图片' });
        // return;
    }
    if(type == 0){
        var fileName = file.name;
        // console.log(fileName);
        return fileName;
    }
    if(type == 1){
        var fileName = Math.random() + '.' + extName;
        var newPath = uploadDir + fileName;
        // console.log(fileName);
        //文件保存
        fs.renameSync(file.path,newPath);  //重命名
        return fileName;
    }

}

//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
module.exports = router;