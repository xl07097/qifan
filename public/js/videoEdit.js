/**
 * Created by Administrator on 2017/1/9.
 */
$(function () {
    //视频编辑
    $('#editVideo').click(function () {

        // console.log('1');
        var id = JSON.parse(sessionStorage.user).user_id;
        var videoId = $('.publicContent').data('id');
        var fv = new FormData($('#form5')[0]);

        var imgString = $('#img0').attr('src').substring(16).split('.');//数组
        var attrLen = imgString.length -1 ;//数组中最后一个

        var videoString = $('#videoFile').attr('value').substring(13).split('.');//数组
        var videoAttr = videoString.length -1 ;//数组中最后一个

        // console.log(videoString);
        var imgSrc = {
            name:$('#img0').attr('src').substring(16),
            type:'image/'+imgString[attrLen]
        };
        var videoSrc = {
            name:$('#videoFile').attr('value').substring(13),
            type:'video/'+videoString[videoAttr]
        };
        
        fv.append('userId',(JSON.parse(sessionStorage.user)).user_id);
        fv.append('imgSrc',JSON.stringify(imgSrc));
        fv.append('videoSrc',JSON.stringify(videoSrc));
        fv.append("videoId",videoId);
        // console.log(fv);

        $.ajax({
            url:'/edit/video',
            data:fv,
            type:'POST',
            async:false,//async:异步
            cache:false,
            contentType:false,
            processData:false,
            success:function (data) {
                swal({
                        title: "确定修改吗",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#6FBFB1",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnConfirm: true
                    },
                    function(){
                        publicSuccess('video',videoId,id);
                    });

            },
            error:function (err) {
                // console.log(err);
                swal('请上传至少一张png、jpg或jpeg格式的图片');
            }
        });
    });

    //发布成功的页面
    function publicSuccess(type,id,userId) {
        //跳转到发布成功的页面
        $('.publicHome').empty();
        var successHome = $('<div class="successHome"></div>');

        var successDiv = $('<div class="successDiv"></div>');
        var successIcon = $('<img src="/images/234516-15101911350055.png">');
        var successText = $('<h1>修改成功</h1>');
        successDiv.append(successIcon,successText);

        var seeDiv = $('<div class="seeDiv"></div>');
        var seeDetail = $('<a></a>');
        seeDetail.prop('href','/'+ type +'/detail?id='+id);
        var seeP = $('<p class="seeP">查看详情</p>');
        seeDetail.append(seeP);
        var back = $('<a></a>');
        back.prop('href','/personals?id='+userId);
        var backP = $('<p class="backP">返回个人中心</p>');
        back.append(backP);
        var backHome = $('<a></a>');
        backHome.prop('href','/');
        var homeP = $('<p class="homeP">回到首页</p>');
        backHome.append(homeP);

        seeDiv.append(seeDetail,back,backHome);

        successHome.append(successDiv,seeDiv);

        $('.publicHome').append(successHome);
    }
});