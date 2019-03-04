var express = require('express');
var router = express.Router();

var usersDao = require("../dao/usersDAO.js");
var publicDao = require('../dao/publicDAO.js');
var formidable = require('formidable');
var fs = require('fs');

//跳转到登陆界面
router.get("/login",function (req, res) {
    res.render("login");
});

//请求登录功能
router.post("/login",function (req, res) {
    //调用usersDAO中的login函数
    usersDao.login(req.body.tel,req.body.password,function (result) {
        res.send(JSON.stringify(result));
    })
});

//请求注册页面
router.get("/register",function (req, res) {
    res.render("register");
});

//请求注册功能
router.post("/register",function (req, res) {
    //监听数据
    usersDao.register(req.body.password,req.body.tel,function (result) {

        res.send(JSON.stringify(result));
    })
});

//请求发布页面
router.get('/public',function (req,res) {
  publicDao.type(function (result) {
    res.render('public',{
      title:'发布',
      cookType:result[0],
      smallType:result.slice(1,5)
    });
  });
});

//发布菜谱功能
router.post('/public',function (req,res) {
  var form = new formidable.IncomingForm();

  form.parse(req,function (error,fields,files) {
    //fields接收文字,files接收文件(视频，图片，压缩包等)
    // console.log('fields:',fields);
    // console.log('files:',files);

      form.uploadDir = PUBLIC_PATH + 'images/';//上传目录
      form.keepExtensions = true; //保留后缀
      form.maxFieldsSize = 2*1024; //文件大小
      var f1 = files["file1"];
      // console.log(f1.name);

      var fileName = saveImage(f1,form.uploadDir);

      var c = {
          cookName:fields.title,
          difficult:fields.difficult,
          cookContent:fields.story,
          cookImg:fileName,
          cookTime:fields.cookTime,
          cookDate:new Date().Format("yyyy-MM-dd hh:mm:ss"),
          typeId:fields.typeId,
          userId:fields.userId
      };

      var mater = JSON.parse(fields.material);
      var sub = JSON.parse(fields.submaterial);
      var step = JSON.parse(fields.cookStep);

      // console.log(mater);

      publicDao.add(c,function (result) {
          res.send(result);

          for(var m in mater){
              var mat = mater[m];
              // console.log(mater[m]);
              publicDao.addMater(mat,result.insertId,function (r1) {
                  console.log('主料上传成功',r1);
              });
          }
          for(var b in sub){
              var su = sub[b];
              publicDao.addSub(su,result.insertId,function (r2) {
                  console.log('辅料上传成功',r2);
              });
          }

          for(var key in files) {
              var extName = '';  //后缀名
              if(key == 'file1')
                  continue;

              //强行匹配
              var a = key.substring(8)-1;
              // console.log(a);
              var sp = step[a];

              var file = files[key];
              form.uploadDir = PUBLIC_PATH + "images/";     //设置上传目录
              form.keepExtensions = true;     //保留后缀
              form.maxFieldsSize = 2 * 1024;   //文件大小
              var filename = saveImage(file,form.uploadDir);

              publicDao.addStep(sp,filename,result.insertId,function (r3) {
                  console.log("步骤上传成功:",r3);
              });
          }

      });

  });

});
//发布视频功能
router.post('/public/video',function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (error,fields,files) {
        // console.log(fields);
        // console.log(files);

        var v = {
            videoName:fields.title,
            userId:fields.userId,
            time:new Date().Format("yyyy-MM-dd hh:mm:ss")
        };
        var extName = '';
            // var file = files[key];
        var keyImg = 'file1';
        var keyVideo = 'file2';
            // console.log(files[keyVideo]);
            // console.log(files[keyImg]);
        if(keyVideo){
                form.uploadDir = PUBLIC_PATH + "video/video/";     //设置上传目录
                form.keepExtensions = true;     //保留后缀
                form.maxFieldsSize = 1280 * 720;   //文件大小
                var fileVideo = saveImage(files[keyVideo],form.uploadDir);
        }
        if(keyImg){
                form.uploadDir = PUBLIC_PATH + "video/videoIMG/";     //设置上传目录
                form.keepExtensions = true;     //保留后缀
                form.maxFieldsSize = 2 * 1024;   //文件大小
                var fileImg = saveImage(files[keyImg],form.uploadDir);
        }

        // console.log(fileImg);
        // console.log(fileVideo);
        publicDao.addVideo(v,fileImg,fileVideo,function (result) {
            res.send(result);
        });


    });
});
//发布帖子功能
router.post('/public/topic',function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (error,fields,files) {
        // console.log(fields);
        console.log(files);

        var t = {
            title:fields.title,
            time:new Date().Format("yyyy-MM-dd hh:mm:ss"),
            content:fields.content,
            userId:fields.userId
        };

        publicDao.addTopic(t,function (result) {
            res.send(result);
            for(var key in files){
                var extName = '';
                var file = files[key];
                form.uploadDir = PUBLIC_PATH + "images/topic";     //设置上传目录
                form.keepExtensions = true;     //保留后缀
                form.maxFieldsSize = 2 * 1024;   //文件大小
                var filename = saveImage(file,form.uploadDir);

                publicDao.addTopicImg(filename,fields.userId,result.insertId,function (r1) {
                    console.log("话题图片上传成功:",r1);
                });
            }
        });

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
    // console.log('extName:',extName);

    try{
        if(extName.length == 0){
            res.render('error', { message: '只支持png和jpg格式图片' });
            return false;
        }else {
            var fileName = Math.random() + '.' + extName;
            var newPath = uploadDir + fileName;

            // console.log(newPath);
            // console.log("old" + file.path);

            //文件保存
            fs.renameSync(file.path, newPath);  //重命名

            return fileName;
        }
    }catch(error){
        console.log(error);
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

//修改密码功能
router.post("/updatepwd",function (req, res) {
    usersDao.updatepwd(req.body.userid,oldpassword,newpassword,function (result) {
        res.send(JSON.stringify(result));
    })
});


module.exports = router;
