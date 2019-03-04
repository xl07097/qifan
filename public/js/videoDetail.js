/**
 * Created by Administrator on 2016/12/29.
 */
$(function(){

    /*================================判断================================*/
    if(sessionStorage.user == undefined){

    }else{
        $.ajax({
            url:'/video/judge',
            data:{
                userid:JSON.parse(sessionStorage.user).user_id,
                videoid:$('#video-info').data("id")
            },
            type:'POST',
            success: function (data) {
                var obj = JSON.parse(data);
                console.log('obj:',obj);
                var collect = obj[0];
                var like = obj[1];
                if (obj[0].length == 1){
                    $(".collect").addClass("icon-2");
                }
                if (obj[1].length == 1){
                    $(".like").addClass("icon-2");

                }
                if(obj[2].length == 1){
                    $(".foc").text("已关注");
                }

            },
            error:function (err) {
                alert(err);
            }
        });
    }

    /*================================点赞================================*/
    $(".like").click(function () {
        if (sessionStorage.user == undefined){
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
            url:'/video/detail/like',
            data:{
                userid:JSON.parse(sessionStorage.user).user_id,
                videoid:$(".like").data("id")
            },
            type:"POST",
            success:function (data) {
                var result = JSON.parse(data);
                var likeRecord = result[1];
                console.log('result:',result);
                //console.log('likeRecord:',likeRecord);
                if(likeRecord.length != 0){
                    $(".like").addClass("icon-2");
                    $(".like-num").text(parseInt($(".like-num").text())+1);
                    return;
                }
                else{
                    $(".like").removeClass("icon-2");
                    $(".like-num").text(parseInt($(".like-num").text())-1);
                    return;
                }
            },
            error:function (err) {
                return alert(err);
            }
        })
    });

    /*================================收藏================================*/
    $(".collect").click(function () {
        if (sessionStorage.user == undefined){
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
                videoid:$(".collect").data("id")
            },
            type:"POST",
            success:function (data) {
                var result = JSON.parse(data);
                var collectRecord = result[1];
                console.log('result:',result);
                //console.log('collectRecord:',collectRecord);
                if(collectRecord.length != 0){
                    $(".collect").addClass("icon-2");
                    $(".collect-num").text();
                    $(".collect-num").text(parseInt($(".collect-num").text())+1);
                    return;
                }
                else{
                    $(".collect").removeClass("icon-2");
                    $(".collect-num").text(parseInt($(".collect-num").text())-1);
                    return;
                }
            },
            error:function (err) {
                return alert(err);
            }
        })
    });

    /*================================关注================================*/
    $(".foc").click(function () {
        if (sessionStorage.user == undefined){
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
        if (JSON.parse(sessionStorage.user).user_id == $(".foc").data("id")){
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
            url:'/follow/user',
            data:{
                userid1:JSON.parse(sessionStorage.user).user_id,
                userid2:$(".foc").data("id")
            },
            type:"POST",
            success:function (data) {
                var obj = JSON.parse(data);
                if (obj.re == 1){
                    return $(".foc").text("已关注");
                }
                if (obj.re == 2){
                    $(".foc").text("关注");
                    return;
                }
            },
            error:function (err) {
                return alert(err);
            }
        })
    });


});