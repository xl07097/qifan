

$(function () {
    if (sessionStorage.user){
        $(".beforeLogin").css("display","none");
        $(".afterLogin").css("display","block");

        var obj = JSON.parse(sessionStorage.user);
        $("li.after a").attr("href","/personals?id="+JSON.parse(sessionStorage.user).user_id+"");
        if (obj.user_portart){
            $(".afterLogin a").html("<img src='/images/"+obj.user_portart+"' class='user-image' title='"+obj.user_name+"'>");

        }else {
            $(".afterLogin a").html("<img src='/images/1000.jpg' class='user-image'>");
        }
    }
    else {
        $(".beforeLogin").css("display","block");
        $(".afterLogin").css("display","none");

    }

    /*搜索信息分类的鼠标事件*/
    $(".nested").mouseover(function () {
        $(".area-list").css("display","block");
    });
    $(".nested").mouseout(function () {
        $(".area-list").mouseover(function () {
            $(".area-list").css("display","block");
        });
        $(".area-list").mouseout(function () {
            $(".area-list").css("display","none");
        });
        $(".area-list").css("display","none");
    });

    $(".area-list a").click(function () {
        $(".nested span").html($(this).html());
        $(".search").attr("placeholder","搜索"+$(this).html());
        $(".area-list").css("display","none");
    });

    $("#logout").click(function () {
        sessionStorage.removeItem("user");
        $("li.after a").attr("href","/users/login");
        location.href = "/";
    });

    $('#public').click(function () {
        if (sessionStorage.user == undefined){
            swal({
                    title: "请先登录",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                },
                function(){
                    location.href = "/users/login";
                });
        }else{
            location.href = '/users/public';
        }
    });

    $(".searchBtn").click(function () {
        search()
    });

    $('.search-input').bind('keypress',function(event){
        if(event.keyCode == "13")
        {
            if ($('.search').val() != ""){
                location.href = "/search/?key="+$('.search').val()+"&type="+$('.nested span').html()+"";
            }
        }
    });

    function search() {
        if ($('.search').val() != ""){
            $('.searchlink').attr('href',"/search/?key="+$('.search').val()+"&type="+$('.nested span').html()+"");
        }
    }
});