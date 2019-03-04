/**
 * Created by xueliang on 2016/12/29.
 */
/**********************************************
 ********菜谱搜索页面的js
 ***********************************************/
$(function () {

    add();
    function add() {
        var num = 15;//每页显示的个数
        var searchNum = $(".showList").data("length");//搜索总量
        var totlePage = Math.ceil(searchNum/num); //能够分成的页数
        var flag = 0;

        //==========将搜索数15个进行划分
        var search = [];
        for(var i = 0 ; i < searchNum ;i+=15){
            search.push($('.cItem').slice(i,i+15));
        }
        //第一页显示，剩下的数据remove
        for(var j = 0 ; j < search.length-1 ; j++){
            var searchJq = $(search[j+1]);
            searchJq.remove();
        }

        //===================分页按钮的添加
        var searchBtn = $('<div class="searchbtn"></div>');

        var menBtn = $('<div class="menBtn"></div>');
        var menuBtnUp = $('<button class="menuBtnUp"></button>');
        menuBtnUp.html("上一页");
        var menuBtnDown = $('<button class="menuBtnDown"></button>');
        menuBtnDown.html("下一页");

        var btnSpan = $('<span> 转到第 <input type="text" value="" class="skipText"> 页</span>');
        var menuBtnSkip = $('<button class="menuBtnSkip">跳转</button>');

        searchBtn.append(menBtn);
        menBtn.append(menuBtnUp,menuBtnDown,btnSpan,menuBtnSkip);

        $('.reAllList').append(searchBtn);

        for(var j = 1; j <= totlePage ; j++){
            var menuBtnNum = $('<button></button>');
            menuBtnNum.prop('class','menuBtnNum');
            menuBtnNum.html(j);
            menBtn.append(menuBtnNum);

            menuBtnNum.insertBefore(menuBtnDown);
        }
        $('.menuBtnNum').eq(0).addClass('clickBtn');

        //=================分页
        $('.menuBtnNum').click(function () {
            var showNum = $(this).html();
            flag = showNum - 1;
            //点击后按钮的样式
            $('.clickBtn').removeClass('clickBtn');
            $(this).addClass('clickBtn');
            $.ajax({
                url:"/jpage/cooksearch",
                data:{
                    num:showNum,
                    key:$(".search-key").html()
                },
                type:"POST",
                success:function (data) {
                    $(".showList").empty();
                    var cook = JSON.parse(data);
                    cook.forEach(function (item) {
                        var wro_div = $(' <li class="cItem"></li>');

                        var spanImg = $('<span class="img"></span>');
                        wro_div.append(spanImg);
                        var iconA = $('<a href="/cook/detail?id='+item.cook_id+'">' +
                            '<img src="/images/'+item.cook_images+'" alt="'+item.cook_name+'" title="'+item.cook_name+'"> ' +
                            '</a>');
                        spanImg.append(iconA);

                        var divText = $('<div class="text"></div>');
                        var pName = $('<p class="name">' +
                            '<a href="/cook/detail?id='+item.cook_id+'">'+item.cook_name+'</a>' +
                            '<span class="postDate">'+item.cook_date+'</span></p>');
                        var pInfo = $('<p class="info"><span class="content">'+item.cook_content+'</span></p>');
                        var spanUsername = $('<span class="username">by <a href="/users/personal?id='+item.t_user_id+'">'+item.user_name+'</a></span>');
                        var spanCollect = $('<span class="collect">收藏<span class="collectCount">'+item.cook_collects+'</span></span>');
                        var spanLike = $('<span class="comment like">喜欢<span class="commentCount">'+item.cook_likes+'</span></span>');
                        divText.append(pName,pInfo,spanUsername,spanCollect,spanLike);
                        wro_div.append(spanImg,divText);
                        $(".showList").append(wro_div);
                    });

                    return flag;
                },
                error:function (err) {
                    console.log(err)
                }
            });
        });

        //==================上一页
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
                    url:"/jpage/cooksearch",
                    data:{
                        num:$('.menuBtnNum').eq(flag).html(),
                        key:$(".search-key").html()
                    },
                    type:"POST",
                    success:function (data) {
                        $(".showList").empty();
                        var cook = JSON.parse(data);

                        cook.forEach(function (item) {
                            var wro_div = $(' <li class="cItem"></li>');

                            var spanImg = $('<span class="img"></span>');
                            wro_div.append(spanImg);
                            var iconA = $('<a href="/cook/detail?id='+item.cook_id+'">' +
                                '<img src="/images/'+item.cook_images+'" alt="'+item.cook_name+'" title="'+item.cook_name+'"> ' +
                                '</a>');
                            spanImg.append(iconA);

                            var divText = $('<div class="text"></div>');
                            var pName = $('<p class="name">' +
                                '<a href="/cook/detail?id='+item.cook_id+'">'+item.cook_name+'</a>' +
                                '<span class="postDate">'+item.cook_date+'</span></p>');
                            var pInfo = $('<p class="info"><span class="content">'+item.cook_content+'</span></p>');
                            var spanUsername = $('<span class="username">by <a href="/users/personal?id='+item.t_user_id+'">'+item.user_name+'</a></span>');
                            var spanCollect = $('<span class="collect">收藏<span class="collectCount">'+item.cook_collects+'</span></span>');
                            var spanLike = $('<span class="comment like">喜欢<span class="commentCount">'+item.cook_likes+'</span></span>');
                            divText.append(pName,pInfo,spanUsername,spanCollect,spanLike);
                            wro_div.append(spanImg,divText);
                            $(".showList").append(wro_div);
                        });

                        return flag;
                    },
                    error:function (err) {
                        console.log(err)
                    }
                });
            }
        });

        //================下一页
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
                    url:"/jpage/cooksearch",
                    data:{
                        num:$('.menuBtnNum').eq(flag).html(),
                        key:$(".search-key").html()
                    },
                    type:"POST",
                    success:function (data) {
                        $(".showList").empty();
                        var cook = JSON.parse(data);

                        cook.forEach(function (item) {
                            var wro_div = $(' <li class="cItem"></li>');

                            var spanImg = $('<span class="img"></span>');
                            wro_div.append(spanImg);
                            var iconA = $('<a href="/cook/detail?id='+item.cook_id+'">' +
                                '<img src="/images/'+item.cook_images+'" alt="'+item.cook_name+'" title="'+item.cook_name+'"> ' +
                                '</a>');
                            spanImg.append(iconA);

                            var divText = $('<div class="text"></div>');
                            var pName = $('<p class="name">' +
                                '<a href="/cook/detail?id='+item.cook_id+'">'+item.cook_name+'</a>' +
                                '<span class="postDate">'+item.cook_date+'</span></p>');
                            var pInfo = $('<p class="info"><span class="content">'+item.cook_content+'</span></p>');
                            var spanUsername = $('<span class="username">by <a href="/users/personal?id='+item.t_user_id+'">'+item.user_name+'</a></span>');
                            var spanCollect = $('<span class="collect">收藏<span class="collectCount">'+item.cook_collects+'</span></span>');
                            var spanLike = $('<span class="comment like">喜欢<span class="commentCount">'+item.cook_likes+'</span></span>');
                            divText.append(pName,pInfo,spanUsername,spanCollect,spanLike);
                            wro_div.append(spanImg,divText);
                            $(".showList").append(wro_div);
                        });

                        return flag;
                    },
                    error:function (err) {
                        console.log(err)
                    }
                });
            }
        });

        //================跳转页面
        $('.menuBtnSkip').click(function () {
            var skip = $('.skipText').val();
            if(skip > totlePage){
                alert('您输入的页面不存在，请输入小于等于'+ totlePage +'的数字');
            }
            flag = skip - 1;
            //按钮显示
            $('.clickBtn').removeClass('clickBtn');
            $('.menuBtnNum').eq(flag).addClass('clickBtn');
            $.ajax({
                url:"/jpage/cooksearch",
                data:{
                    num:$('.menuBtnNum').eq(flag).html(),
                    key:$(".search-key").html()
                },
                type:"POST",
                success:function (data) {
                    $(".showList").empty();
                    var cook = JSON.parse(data);

                    cook.forEach(function (item) {
                        var wro_div = $(' <li class="cItem"></li>');

                        var spanImg = $('<span class="img"></span>');
                        wro_div.append(spanImg);
                        var iconA = $('<a href="/cook/detail?id='+item.cook_id+'">' +
                            '<img src="/images/'+item.cook_images+'" alt="'+item.cook_name+'" title="'+item.cook_name+'"> ' +
                            '</a>');
                        spanImg.append(iconA);

                        var divText = $('<div class="text"></div>');
                        var pName = $('<p class="name">' +
                            '<a href="/cook/detail?id='+item.cook_id+'">'+item.cook_name+'</a>' +
                            '<span class="postDate">'+item.cook_date+'</span></p>');
                        var pInfo = $('<p class="info"><span class="content">'+item.cook_content+'</span></p>');
                        var spanUsername = $('<span class="username">by <a href="/users/personal?id='+item.t_user_id+'">'+item.user_name+'</a></span>');
                        var spanCollect = $('<span class="collect">收藏<span class="collectCount">'+item.cook_collects+'</span></span>');
                        var spanLike = $('<span class="comment like">喜欢<span class="commentCount">'+item.cook_likes+'</span></span>');
                        divText.append(pName,pInfo,spanUsername,spanCollect,spanLike);
                        wro_div.append(spanImg,divText);
                        $(".showList").append(wro_div);
                    });

                    return flag;
                },
                error:function (err) {
                    console.log(err)
                }
            });
        });

        //分页显示
        var btnAttr = [];

        var btnLength = $('.menuBtnNum').length;//按钮的总页数
        if (btnLength > 3){
            //将按钮每3个进行划分
            for(var y = 0 ; y < btnLength ;y+=3){
                btnAttr.push($('.menuBtnNum').slice(y,y+3));
            }

            var point = $('<span class="pointBtn">...</span>');
            var pointBefore = $('<span class="pointBtn">...</span>');
            //初始样式
            $('.menuBtnNum').css({'display':'none'});
            $('.menuBtnNum').eq(0).css({'display':'inline-block'});
            $('.menuBtnNum').eq(1).css({'display':'inline-block'});
            $('.menuBtnNum').eq(2).css({'display':'inline-block'});
            $('.menuBtnNum').eq(btnLength-1).css({'display':'inline-block'});
            point.insertBefore($('.menuBtnNum').eq(btnLength-1));

            for(var z = 0 ; z < btnAttr.length ; z++) {
                // console.log(btnAttr[z].length);
                for (var x = 0; x < btnAttr[z].length; x++) {

                    var btn = btnAttr[z][btnAttr[z].length - 1];//每组的最后一个btn元素
                    var firstBtn = btnAttr[z][0];//每组第一个
                    var lastBtn = btnAttr[btnAttr.length - 1][btnAttr[btnAttr.length - 1].length - 1];//所有的最后一个
                    var eachBtn = btnAttr[z][x];

                    //点击第一个之后的样式
                    $(btnAttr[0][0]).click(function () {
                        $('.pointBtn').remove();
                        // console.log(btnAttr[0]);
                        $('.menuBtnNum').css({'display': 'none'});
                        $(btnAttr[0]).css({'display': 'inline-block'});
                        $(lastBtn).css({'display': 'inline-block'});

                        point.insertAfter($(btnAttr[0][2]));
                    });

                    //中间的btn
                    //点击第一组最后一个的时候
                    if ($(eachBtn).html() == 3) {
                        $(eachBtn).click(function () {
                            $('.pointBtn').remove();
                            $('.menuBtnNum').css({'display': 'none'});
                            $(btnAttr[0]).css({'display': 'inline-block'});
                            $(lastBtn).css({'display': 'inline-block'});
                            $(this).next().css({'display': 'inline-block'});
                            point.insertBefore($(lastBtn));
                        })
                    }
                    //点击每组的第一个，除了第一组
                    if ($(eachBtn).html() == $(firstBtn).html() && $(eachBtn).html() != 1) {
                        $(eachBtn).click(function () {
                            $('.pointBtn').remove();
                            $('.menuBtnNum').css({'display': 'none'});
                            $('.menuBtnNum').eq(0).css({'display': 'inline-block'});
                            $(lastBtn).css({'display': 'inline-block'});
                            $(this).css({'display': 'inline-block'});
                            $(this).next().css({'display': 'inline-block'});
                            $(this).next().next().css({'display': 'inline-block'});
                            pointBefore.insertBefore($(this));
                            point.insertBefore($(lastBtn));
                        })
                    }
                    //点击中间其他组的最后一个
                    if ($(eachBtn).html() == $(btn).html() && $(eachBtn).html() != $(lastBtn).html() && $(eachBtn).html() != 3) {
                        $(eachBtn).click(function () {
                            $('.pointBtn').remove();
                            $('.menuBtnNum').css({'display': 'none'});
                            $('.menuBtnNum').eq(0).css({'display': 'inline-block'});
                            $(lastBtn).css({'display': 'inline-block'});
                            $(this).next().css({'display': 'inline-block'});
                            $(this).prev().css({'display': 'inline-block'});
                            $(this).prev().prev().css({'display': 'inline-block'});

                            pointBefore.insertAfter($('.menuBtnNum').eq(0));
                            point.insertBefore($(lastBtn));
                            // console.log();
                        })
                    }

                    //点击最后一个的样式
                    if ($(eachBtn).html() == $(lastBtn).html()) {
                        $(eachBtn).click(function () {
                            $('.pointBtn').remove();
                            $('.menuBtnNum').css({'display': 'none'});
                            $('.menuBtnNum').eq(0).css({'display': 'inline-block'});//第一个显示
                            point.insertAfter($('.menuBtnNum').eq(0));
                            $(btnAttr[btnAttr.length - 1]).css({'display': 'inline-block'});

                        })
                    }
                }
            }
        }
    }
});