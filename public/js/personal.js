/**
 * Created by jesus on 2016/11/28.
 */
$(function(){

    $(".n-text").mouseover(function(){
        $(this).css( "color", "#00a1d6" );
    });
    $(".n-text").mouseout(function(){
        $(this).css("color","#222");
    });

    $(".a-2-part1").mouseover(function(){
        $(this).css( "background", "#00a1d6" );
    });
    $(".a-2-part1").mouseout(function(){
        $(this).css("background","#F4F0EC");
    });

    $("#page-video").hide();
    $("#page-forum").hide();
    $("#page-topic").hide();
    $("#page-index").show();

    $("#num-a").click(function(){
        if($("#page-index").is(":hidden"))
        {
            $("#page-video").hide();
            $("#page-forum").hide();
            $("#page-topic").hide();
            $("#page-index").show();
        }
    });


    $("#num-b").click(function(){
        if($("#page-video").is(":hidden"))
        {
            $("#page-index").hide();
            $("#page-forum").hide();
            $("#page-topic").hide();
            $("#page-video").show();
        }
    });
    $("#num-c").click(function(){
        if($("#page-forum").is(":hidden"))
        {
            $("#page-index").hide();
            $("#page-forum").show();
            $("#page-topic").hide();
            $("#page-video").hide();
        }
    });
    $("#num-d").click(function(){
        if($("#page-topic").is(":hidden"))
        {
            $("#page-index").hide();
            $("#page-video").hide();
            $("#page-forum").hide();
            $("#page-topic").show();
        }
    });

    $("#addVideo").click(function(){
        var div = "<div class='a-2-part1'></div>";
        $("#video-list").append(div);
    });
    $("#addVideo1").click(function(){
        var div = "<div class='a-2-part1'></div>";
        $("#video-list1").append(div);
    });


    showImg($('.h-user'),'.h-avatar','#userPor');

    //图片预览
    function showImg(a,b,c) {
        //图片预览
        a.on('change',c,function () {
            var objUrl = getObjectURL(this.files[0]) ;
            // console.log($(this)) ;
            if (objUrl) {
                $(this).prev().children().attr("src", objUrl) ;
            }
        });

        //点击图片显示上传
        a.on('click',b,function () {
            // console.log($(this).parent());
            $(this).next().click();
        });


    }
    //建立一個可存取到file的url
    function getObjectURL(file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    }


    // //头像上传
    $('#userPor').change(function () {
        // console.log('1');
        var fd = new FormData($('#form6')[0]);

        fd.append('userId',(JSON.parse(sessionStorage.user)).user_id);
        fd.append('psw',(JSON.parse(sessionStorage.user)).user_password);
        // console.log(fd);

        $.ajax({
            url:'/personals',
            data:fd,
            type:'POST',
            async:false,//async:异步
            cache:false,
            contentType:false,
            processData:false,
            success:function (data) {
                // var obj = JSON.parse(data);
                // console.log(data.affectedRows);
                if(data.affectedRows ==1){
                    var a = JSON.parse(sessionStorage.user);
                    a.user_portart = data.imgSrc;
                    var user = JSON.stringify(a);

                    sessionStorage.removeItem("user");
                    sessionStorage.setItem("user",user);
                    // console.log();

                    $('header.topHeader').find('img').eq(1).attr('src','/images/'+JSON.parse(sessionStorage.user).user_portart);

                }

            },
            error:function (err) {
                console.log(err);
            }
        });
    });


    $('.ensure').hide();

    //签名修改
    $('.editSign').click(function () {
        var sign = $('.userSign').html();
        $('.userSign').css({'display':'none'});

        var signInput = $('<input type="text" class="signInput">');
        signInput.val(sign);
        signInput.insertBefore($('.editSign'));

        $('.editSign').hide();
        $('.ensure').show();

    });

    $('.ensure').click(function () {
        var sign = $('.signInput').val();
        
        // console.log($('.signInput').val());
        $.ajax({
            url:'/personals/sign',
            data:{
                id:(JSON.parse(sessionStorage.user)).user_id,
                sign:sign
            },
            type:'POST',
            success:function (data) {
                if(data.affectedRows == 1){
                    $('.editSign').show();
                    $('.ensure').hide();
                    $('.userSign').html(sign);

                    $('.signInput').css({'display':'none'});
                    $('.userSign').css({'display':'inline-block'});

                    // console.log();
                }

            },
            error:function (err) {
                console.log(err);
            }
        });
    });

    if (JSON.parse(sessionStorage.user).user_portart){
        $("#h-avatar").porp("src","/images/'+JSON.parse(sessionStorage.user).user_portart+'");
    }
    else {
        $("#h-avatar").attr("src","/images/1000.jpg");
    }
    
});


