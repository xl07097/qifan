/**
 * Created by Administrator on 2017/1/5.
 */
$(function () {

    //删除
    $('.cookDelete').click(function () {
        var cookId = $(this).parents('.cookList').data('id');

        var that = $(this).parents('.cookList');

        $.ajax({
            url:'/personals/cookDelete',
            data:{
                cookId:cookId
            },
            type:'POST',
            success:function (data) {
                that.remove();
                swal("删除成功!", " ", "success");
            },
            error:function (err) {
                console.log(err);
            }
        })
    });

    add();
    function add() {
        var num = 8;//每页显示的个数
        var cooksNum = $('.cookList').length;//家常菜的总量
        var totlePage = Math.ceil(cooksNum/num); //能够分成的页数
        var flag = 0;

        //将家常菜每9个进行划分
        var cooks = [];
        for(var i = 0 ; i < cooksNum ;i+=8){
            cooks.push($('.cookList').slice(i,i+8));
        }

        //第一页显示，剩下的数据隐藏
        for(var j = 0 ; j < cooks.length-1 ; j++){
            var cooksJq = $(cooks[j+1]);
            cooksJq.addClass('jsHide');
        }

        //分页按钮的添加
        var cookBtn = $('<div class="cookBtn"></div>');

        var menBtn = $('<div class="menBtn"></div>');
        var menuBtnUp = $('<button class="menuBtnUp"></button>');
        menuBtnUp.html("上一页");
        var menuBtnDown = $('<button class="menuBtnDown"></button>');
        menuBtnDown.html("下一页");

        var btnSpan = $('<span> 转到第 <input type="text" value="" class="skipText"> 页</span>');
        var menuBtnSkip = $('<button class="menuBtnSkip">跳转</button>');

        cookBtn.append(menBtn);
        menBtn.append(menuBtnUp,menuBtnDown,btnSpan,menuBtnSkip);

        $('.clist').append(cookBtn);

        for(var k = 1; k <= totlePage ; k++){
            var menuBtnNum = $('<button></button>');
            menuBtnNum.prop('class','menuBtnNum');
            menuBtnNum.html(k);
            menBtn.append(menuBtnNum);

            menuBtnNum.insertBefore(menuBtnDown);
        }

        $('.menuBtnNum').eq(0).addClass('clickBtn');

        //分页
        $('.menuBtnNum').click(function () {
            var showNum = $(this).html();
            // console.log(showNum);
            flag = showNum - 1;
            // console.log(cooks[flag]);
            //点击后页面的切换
            $('.jsShow').removeClass('jsShow');
            $('.cookList').addClass('jsHide');
            $(cooks[flag]).removeClass('jsHide');
            $(cooks[flag]).addClass('jsShow');

            //点击后按钮的样式
            $('.clickBtn').removeClass('clickBtn');
            $(this).addClass('clickBtn');

            return flag;
        });

        //上一页
        $('.menuBtnUp').click(function () {
            $('.menuBtnDown').removeAttr('disabled');

            if(flag == 0){
                $('.menuBtnUp').attr('disabled','disabled');
            }
            else {

                flag = flag - 1;
                // console.log(flag);
                //页面显示
                $('.jsShow').removeClass('jsShow');
                $('.cookList').addClass('jsHide');
                $(cooks[flag]).removeClass('jsHide');
                $(cooks[flag]).addClass('jsShow');

                //按钮样式
                $('.clickBtn').removeClass('clickBtn');
                $('.menuBtnNum').eq(flag).addClass('clickBtn');

            }

            return flag;
        });

        //下一页
        $('.menuBtnDown').click(function () {
            $('.menuBtnUp').removeAttr('disabled');
            if(flag == totlePage-1){
                $('.menuBtnDown').attr('disabled','disabled');
            }
            else{

                flag = flag +1;
                // console.log(flag);
                //页面显示
                $('.jsShow').removeClass('jsShow');
                $('.cookList').addClass('jsHide');
                $(cooks[flag]).removeClass('jsHide');
                $(cooks[flag]).addClass('jsShow');

                //按钮样式
                $('.clickBtn').removeClass('clickBtn');
                $('.menuBtnNum').eq(flag).addClass('clickBtn');

            }

            return flag;
        });
        // console.log(flag);

        //跳转页面
        $('.menuBtnSkip').click(function () {
            var skip = $('.skipText').val();
            if( skip > totlePage ){
                swal('您输入的页面不存在，请输入小于等于'+ totlePage +'的数字');
                window.go(-1);
            }
            flag = skip - 1;

            //页面切换显示
            $('.jsShow').removeClass('jsShow');
            $('.cookList').addClass('jsHide');
            $(cooks[flag]).removeClass('jsHide');
            $(cooks[flag]).addClass('jsShow');

            //按钮显示
            $('.clickBtn').removeClass('clickBtn');
            $('.menuBtnNum').eq(flag).addClass('clickBtn');
        });

        //分页显示
        var btnAttr = [];
        var btnLength = $('.menuBtnNum').length;//按钮的总页数
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

        for(var z = 0 ; z < btnAttr.length ; z++){
            // console.log(btnAttr[z].length);
            for(var x = 0 ; x < btnAttr[z].length ; x ++){

                var btn = btnAttr[z][btnAttr[z].length-1];//每组的最后一个btn元素
                var firstBtn = btnAttr[z][0];//每组第一个
                var lastBtn = btnAttr[btnAttr.length-1][btnAttr[btnAttr.length-1].length-1];//所有的最后一个
                var eachBtn = btnAttr[z][x];

                //点击第一个之后的样式
                $(btnAttr[0][0]).click(function () {
                    $('.pointBtn').remove();
                    // console.log(btnAttr[0]);
                    $('.menuBtnNum').css({'display':'none'});
                    $(btnAttr[0]).css({'display':'inline-block'});
                    $(lastBtn).css({'display':'inline-block'});

                    point.insertAfter($(btnAttr[0][2]));
                });

                //中间的btn
                //点击第一组最后一个的时候
                if($(eachBtn).html() == 3){
                    $(eachBtn).click(function () {
                        $('.pointBtn').remove();
                        $('.menuBtnNum').css({'display':'none'});
                        $(btnAttr[0]).css({'display':'inline-block'});
                        $(lastBtn).css({'display':'inline-block'});
                        $(this).next().css({'display':'inline-block'});
                        point.insertBefore($(lastBtn));
                    })
                }
                //点击每组的第一个，除了第一组
                if($(eachBtn).html() == $(firstBtn).html() && $(eachBtn).html() != 1){
                    $(eachBtn).click(function () {
                        $('.pointBtn').remove();
                        $('.menuBtnNum').css({'display':'none'});
                        $('.menuBtnNum').eq(0).css({'display':'inline-block'});
                        $(lastBtn).css({'display':'inline-block'});
                        $(this).css({'display':'inline-block'});
                        $(this).next().css({'display':'inline-block'});
                        $(this).next().next().css({'display':'inline-block'});
                        pointBefore.insertBefore($(this));
                        point.insertBefore($(lastBtn));
                    })
                }
                //点击中间其他组的最后一个
                if($(eachBtn).html() == $(btn).html() && $(eachBtn).html() != $(lastBtn).html() && $(eachBtn).html() != 3){
                    $(eachBtn).click(function () {
                        $('.pointBtn').remove();
                        $('.menuBtnNum').css({'display':'none'});
                        $('.menuBtnNum').eq(0).css({'display':'inline-block'});
                        $(lastBtn).css({'display':'inline-block'});
                        $(this).next().css({'display':'inline-block'});
                        $(this).prev().css({'display':'inline-block'});
                        $(this).prev().prev().css({'display':'inline-block'});

                        pointBefore.insertAfter($('.menuBtnNum').eq(0));
                        point.insertBefore($(lastBtn));
                        // console.log();
                    })
                }

                //点击最后一个的样式
                if($(eachBtn).html() == $(lastBtn).html() ){
                    $(eachBtn).click(function () {
                        $('.pointBtn').remove();
                        $('.menuBtnNum').css({'display':'none'});
                        $('.menuBtnNum').eq(0).css({'display':'inline-block'});//第一个显示
                        point.insertAfter($('.menuBtnNum').eq(0));
                        $(btnAttr[btnAttr.length-1]).css({'display':'inline-block'});

                    })
                }
            }
        }


    }

});