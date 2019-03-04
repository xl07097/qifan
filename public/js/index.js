/**
 * Created by Administrator on 2016/11/22.
 */
$(function () {
    //判断是否已关注
    if (sessionStorage.user){
        $.ajax({
            url:"/",
            data:{
                userid:JSON.parse(sessionStorage.user).user_id
            },
            type:'POST',
            success:function (data) {
                var obj = JSON.parse(data);
                for(var j = 0 ; j < $('.expertBtn').length ; j++){
                    for(var i = 0 ; i < obj.length ; i++){
                        if($('.expertBtn').eq(j).data("id") == obj[i].t_user_user_id){
                            $('.expertBtn').eq(j).html('已关注');
                        }
                    }
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
    }

    //点击关注
    $('.expertBtn').click(function () {
        var userId = $(this).data('id');
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
        if (JSON.parse(sessionStorage.user).user_id == userId){
            swal({
                title:"自己不能关注自己！",
                confirmButtonColor: "#6FBFB1"
            });
            return
        }
        var that = $(this);
        $.ajax({
            url:'/follow/user',
            data:{
                userid1:JSON.parse(sessionStorage.user).user_id,
                userid2:userId
            },
            type:"POST",
            success:function (data) {
                var obj = JSON.parse(data);
                console.log(obj.re);
                if (obj.re == 1){
                    // console.log(that.html());
                    return that.html("已关注");
                }
                if (obj.re == 2){

                    return that.html("+关注");
                }
            },
            error:function (err) {
                return alert(err);
            }
        })
    });
});