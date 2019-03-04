/**
 * Created by xueliang on 2016/12/22.
 */
Date.prototype.Format = function(fmt) {
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

//菜谱评论事件
$(function () {
    //================判断是否点赞收藏
    if (sessionStorage.user){
        $("div.user-portart a").attr("href","/users/personl?id="+JSON.parse(sessionStorage.user).user_id+"");
        if (JSON.parse(sessionStorage.user).user_portart){
            $("div.user-portart a").attr("href","/users/personal?id="+JSON.parse(sessionStorage.user).user_id+"");
            $("div.user-portart a").html("<img src='/images/"+JSON.parse(sessionStorage.user).user_portart+"'>");
        }
        else {
            $("div.user-portart a").attr("href","/users/personal?id="+JSON.parse(sessionStorage.user).user_id+"");
            $("div.user-portart a").html("<img src='/images/1000.jpg'>");
        }
        $.ajax({
            url:"/cook/judge",
            data:{
                cookid:$("#main").data("id"),
                userid:JSON.parse(sessionStorage.user).user_id,
                user_id:$(".foc").data("id")
            },
            type:'POST',
            success:function (data) {
                var obj = JSON.parse(data);
                if (obj[0].length == 1){
                    $(".collect").addClass("icon-2");
                    $(".collect").removeClass("icon-1");
                }
                if (obj[1].length == 1){
                    $(".foc").text("已关注");
                }
                if(obj[2].length == 1){
                    $(".like").addClass("icon-2");
                    $(".like").removeClass("icon-1");
                }
            }
        })
    }

    //================发布评论
    $(".postBtn").click(function () {
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
            url:'/cook/comment/add',
            data:{
                content:$("#comt-comment").val(),
                time:(new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                userid:JSON.parse(sessionStorage.user).user_id,
                cookid:$("#main").data("id")
            },
            type:"POST",
            success:function (data) {
                var comment = JSON.parse(data);
                var wro_div = $(' <div class="citem"></div>');
                var ul = $('<ul class="cmt_info"></ul>');
                wro_div.append(ul);
                var iconDiv = $('<li class="portart"><img src="/images/'+comment.user_portart+'"></li>');
                var commonArea = $('<li class="cmt_content"></li>');
                var p = $('<span class="cmt_user">'+comment.user_name+'</span>&nbsp;&nbsp; <span class="cmt_time">'+comment.commentcook_time +'</span> <p class="content">'+comment.commentcook_content +'</p>');
                commonArea.append(p);
                ul.append(iconDiv,commonArea);
                $(".clist").prepend(wro_div);
                add();
            },
            error:function (err) {
                alert(err);
            }
        })
    });

    //================菜谱点赞事件
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
            url:'/cook/like/add',
            data:{
                userid:JSON.parse(sessionStorage.user).user_id,
                cookid:$("#main").data("id")
            },
            type:"POST",
            success:function (data) {
                // alert(data);
                var obj = JSON.parse(data);
                //取消点赞
                if (obj.res == 2){
                    $(".like").addClass("icon-1");
                    $(".like").removeClass("icon-2");
                    // $(".like-num").text(parseInt($(".like-num").text())-1);
                    $(".like-num").text(obj.likenum);
                    return;
                }

                //点赞
                if (obj.res == 1){
                    $(".like").addClass("icon-2");
                    $(".like").removeClass("icon-1");
                    // $(".like-num").text(parseInt($(".like-num").text())+1);
                    $(".like-num").text(obj.likenum);
                    return;
                }
            },
            error:function (err) {
                return alert(err);
            }
        })
    });

    //================收藏菜谱事件
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
            url:'/cook/collect/add',
            data:{
                userid:JSON.parse(sessionStorage.user).user_id,
                cookid:$("#main").data("id")
            },
            type:"POST",
            success:function (data) {
                var obj = JSON.parse(data);
                if (obj.res == 2){
                    $(".collect").addClass("icon-1");
                    $(".collect").removeClass("icon-2");
                    $(".collect-num").text(obj.collectnum);
                    return;
                }
                // if (obj.re == 0){
                //     return alert("收藏失败");
                // }
                if (obj.res == 1){
                    $(".collect").addClass("icon-2");
                    $(".collect").removeClass("icon-1");
                    $(".collect-num").text(obj.collectnum);
                    return;
                }
            },
            error:function (err) {
                return alert(err);
            }
        })
    });

    //================关注用户事件
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
            alert("自己不能关注自己！");
            return
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
                // if (obj.re == 0){
                //     $(".foc").text();
                //     return;
                // }
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

    add();
    function add() {
        $(".commentBtn").remove();
        var num = 8;//每页显示的个数
        var commentsNum = $(".clist").data("length");//评论的总数
        var totlePage = Math.ceil(commentsNum/num); //能够分成的页数
        var flag = 0;

        //将评论进行
        var comments = [];
        for(var i = 0 ; i < commentsNum ;i+=8){
            comments.push($('.citem').slice(i,i+8));
        }

        //第一页显示，剩下的数据隐藏
        for(var j = 0 ; j < comments.length-1 ; j++){
            var commentsJq = $(comments[j+1]);
            commentsJq.remove();
        }

        //分页按钮的添加
        var commentBtn = $('<div class="commentBtn"></div>');

        var menBtn = $('<div class="menBtn"></div>');
        var menuBtnUp = $('<button class="menuBtnUp"></button>');
        menuBtnUp.html("上一页");
        var menuBtnDown = $('<button class="menuBtnDown"></button>');
        menuBtnDown.html("下一页");

        var btnSpan = $('<span> 转到第 <input type="text" value="" class="skipText"> 页</span>');
        var menuBtnSkip = $('<button class="menuBtnSkip">跳转</button>');

        commentBtn.append(menBtn);
        menBtn.append(menuBtnUp,menuBtnDown,btnSpan,menuBtnSkip);

        $('.commentArea').append(commentBtn);

        for(var j = 1; j <= totlePage ; j++){
            var menuBtnNum = $('<button></button>');
            menuBtnNum.prop('class','menuBtnNum');
            menuBtnNum.html(j);
            menBtn.append(menuBtnNum);

            menuBtnNum.insertBefore(menuBtnDown);
        }
        $('.menuBtnNum').eq(0).addClass('clickBtn');

        //数字分页
        $('.menuBtnNum').click(function () {
            var showNum = $(this).html();
            flag = showNum - 1;
            //点击后按钮的样式
            $('.clickBtn').removeClass('clickBtn');
            $(this).addClass('clickBtn');
            $.ajax({
                url:"/jpage/cookComment",
                data:{
                    num:showNum,
                    cookid:$("#main").data("id")
                },
                type:"POST",
                success:function (data) {

                    $(".clist").empty();
                    var comment = JSON.parse(data);
                    comment.forEach(function (item) {
                        var wro_div = $(' <div class="citem"></div>');
                        var ul = $('<ul class="cmt_info"></ul>');
                        wro_div.append(ul);
                        var iconDiv = $('<li class="portart"><img src="/images/'+item.user_portart+'"></li>');
                        var commonArea = $('<li class="cmt_content"></li>');
                        var p = $('<span class="cmt_user">'+item.user_name+'</span>&nbsp;&nbsp; <span class="cmt_time">'+item.commentcook_time +'</span> <p class="content">'+item.commentcook_content +'</p>');
                        commonArea.append(p);
                        ul.append(iconDiv,commonArea);
                        $(".clist").append(wro_div);
                    });

                    return flag;
                },
                error:function (err) {
                    console.log(err)
                }
            })

        });

        //上一页
        $('.menuBtnUp').click(function () {
            $('.menuBtnDown').removeAttr('disabled');

            if(flag == 0){
                $('.menuBtnUp').attr('disabled','disabled');
            }
            else {
                flag = flag - 1;
                //按钮样式
                $('.clickBtn').removeClass('clickBtn');
                $('.menuBtnNum').eq(flag).addClass('clickBtn');
                $.ajax({
                    url:"/jpage/cookComment",
                    data:{
                        num:$('.menuBtnNum').eq(flag).html(),
                        cookid:$("#main").data("id")
                    },
                    type:"POST",
                    success:function (data) {
                        $(".clist").empty();
                        var comment = JSON.parse(data);
                        comment.forEach(function (item) {
                            var wro_div = $(' <div class="citem"></div>');
                            var ul = $('<ul class="cmt_info"></ul>');
                            wro_div.append(ul);
                            var iconDiv = $('<li class="portart"><img src="/images/'+item.user_portart+'"></li>');
                            var commonArea = $('<li class="cmt_content"></li>');
                            var p = $('<span class="cmt_user">'+item.user_name+'</span>&nbsp;&nbsp; <span class="cmt_time">'+item.commentcook_time +'</span> <p class="content">'+item.commentcook_content +'</p>');
                            commonArea.append(p);
                            ul.append(iconDiv,commonArea);
                            $(".clist").append(wro_div);
                        });
                        return flag;
                    },
                    error:function (err) {
                        console.log(err)
                    }
                })
            }
        });

        //下一页
        $('.menuBtnDown').click(function () {
            $('.menuBtnUp').removeAttr('disabled');
            if(flag == totlePage-1){
                $('.menuBtnDown').attr('disabled','disabled');
            }
            else{
                flag = flag +1;
                //按钮样式
                $('.clickBtn').removeClass('clickBtn');
                $('.menuBtnNum').eq(flag).addClass('clickBtn');
                $.ajax({
                    url:"/jpage/cookComment",
                    data:{
                        num:$('.menuBtnNum').eq(flag).html(),
                        cookid:$("#main").data("id")
                    },
                    type:"POST",
                    success:function (data) {
                        $(".clist").empty();
                        var comment = JSON.parse(data);
                        comment.forEach(function (item) {
                            var wro_div = $(' <div class="citem"></div>');
                            var ul = $('<ul class="cmt_info"></ul>');
                            wro_div.append(ul);
                            var iconDiv = $('<li class="portart"><img src="/images/'+item.user_portart+'"></li>');
                            var commonArea = $('<li class="cmt_content"></li>');
                            var p = $('<span class="cmt_user">'+item.user_name+'</span>&nbsp;&nbsp; <span class="cmt_time">'+item.commentcook_time +'</span> <p class="content">'+item.commentcook_content +'</p>');
                            commonArea.append(p);
                            ul.append(iconDiv,commonArea);
                            $(".clist").append(wro_div);
                        });

                        return flag;
                    },
                    error:function (err) {
                        console.log(err)
                    }
                })
            }
        });

        //跳转页面
        $('.menuBtnSkip').click(function () {
            var skip = $('.skipText').val();
            if(skip > totlePage){
                alert('您输入的页面不存在，请输入小于等于'+ totlePage +'的数字');
                return;
            }
            flag = skip - 1;
            //按钮显示
            $('.clickBtn').removeClass('clickBtn');
            $('.menuBtnNum').eq(flag).addClass('clickBtn');
            $.ajax({
                url:"/jpage/cookComment",
                data:{
                    num:$('.menuBtnNum').eq(flag).html(),
                    cookid:$("#main").data("id")
                },
                type:"POST",
                success:function (data) {
                    $(".clist").empty();
                    var comment = JSON.parse(data);
                    comment.forEach(function (item) {
                        var wro_div = $(' <div class="citem"></div>');
                        var ul = $('<ul class="cmt_info"></ul>');
                        wro_div.append(ul);
                        var iconDiv = $('<li class="portart"><img src="/images/'+item.user_portart+'"></li>');
                        var commonArea = $('<li class="cmt_content"></li>');
                        var p = $('<span class="cmt_user">'+item.user_name+'</span>&nbsp;&nbsp; <span class="cmt_time">'+item.commentcook_time +'</span> <p class="content">'+item.commentcook_content +'</p>');
                        commonArea.append(p);
                        ul.append(iconDiv,commonArea);
                        $(".clist").append(wro_div);
                    });
                    return flag;
                },
                error:function (err) {
                    console.log(err)
                }
            })
        });
    }
});

