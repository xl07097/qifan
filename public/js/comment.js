/**
 * Created by Administrator on 2016/12/22.
 */
$(function(){

    /*===========点赞功能===========*/
    $("#videolike").click(function(){
        if(sessionStorage.user == undefined){
            swal({
                    title: "请先登录",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#6FBFB1",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },
                function(){
                    location.href = "/users/login";
                });

            return;
        }

        //用ajax发送请求给数据库
        $.ajax({
            url:'/video/detail/like',
            data:{
                userid:JSON.parse(sessionStorage.user).user_id,
                videoid:$('#video-info').data("id")
            },
            type:'POST',
            success: function (data) {
                //alert('拿到的数据：',data);
                var result = JSON.parse(data);//转为对象
                var likeRecord = result[1];
                console.log('likeRecord:',likeRecord);
                if(likeRecord.length != 0){
                    $('#videolike').attr('src','/images/icon/lheart-r.png');
                }
                else{
                    $('#videolike').attr('src','/images/icon/lheart-e.png');
                }

            },
            error:function (err) {
                alert(err);
            }
        });


    });
    /*===========收藏功能===========*/
    $("#videocollect").click(function(){
        if(sessionStorage.user == undefined){
            swal({
                    title: "请先登录",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#6FBFB1",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },
                function(){
                    location.href = "/users/login";
                });

            return;
        }
        $.ajax({
            url:'/video/detail/collect',
            data:{
                userid:JSON.parse(sessionStorage.user).user_id,
                videoid:$('#video-info').data("id")
            },
            type:'POST',
            success: function (data) {
                //alert('拿到的数据：',data);
                var result = JSON.parse(data);//转为对象
                console.log('收藏：',result);
                var collectRecord = result[1];
                console.log('collectRecord:',collectRecord);
                if(collectRecord.length != 0){
                    $('#videocollect').attr('src','/images/icon/lstar-y.png');
                }
                else{
                    $('#videocollect').attr('src','/images/icon/lstar-e.png');
                }

            },
            error:function (err) {
                alert(err);
            }
        });

    });


    /*===========圆形“登录”功能===========*/
    $("#Rlogin").click(function(){
        if(sessionStorage.user == undefined){
            location.href = '/users/login';
            return;
        }
        //$("#Rlogin").attr({"disabled":"disabled"});
    });

    /*===========发表功能===========*/
        Date.prototype.Format = function(fmt)
        { //author: meizz
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        };
    $("#cmtPost").click(function () {
        if(sessionStorage.user == undefined){
            swal({
                    title: "请先登录",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#6FBFB1",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },
                function(){
                    location.href = "/users/login";
                });

            return;
        }
        // console.log($(this).data('type'));
        $.ajax({
            url:'/video/detail/add',
            data:{
                content:$("#areacontent").val(),
                time:(new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                userid:JSON.parse(sessionStorage.user).user_id,
                videoid:$(this).data('id'),
                commentType:$(this).data('type')

            },
            type:'POST',
            success:function (data) {
                //alert('评论data:',data);
                var videocmt = JSON.parse(data);
                console.log(data);

                //发表成功后,将新的一条评论添加的列表前面

                //视频评论UI
                var citem = $("<div class='citem'></div>");
                var cmt_info = $("<ul class='cmt_info'></ul>");
                var portart = $("<li class='portart'></li>");
                var img = $("<img src='/images/"+videocmt[0].user_portart+"'>");
                var cmt_content = $("<li class='cmt_content'></li>");
                var cmt_user = $("<span class='cmt_user'>"+videocmt[0].user_name+"</span>");
                var cmt_time = $("<span class='cmt_time'>"+videocmt[0].videocomment_time+"</span>");
                var cmt_video = $("<p class='cmt_video'>"+videocmt[0].videocomment_content+"</p>");

                citem.append(cmt_info);
                cmt_info.append(portart,cmt_content);
                portart.append(img);
                cmt_content.append(cmt_user,cmt_time,cmt_video);

                $("#clist").prepend(citem);

            },
            error:function (err) {
                alert(err);
            }

        });
    });




});