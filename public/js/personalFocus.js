/**
 * Created by Administrator on 2017/1/8.
 */
$(function () {
    $("#userFocus").click(function () {
        var id = JSON.parse(sessionStorage.user).user_id;
        $.ajax({
            url:'/personals/focus',
            data:{
                id:id
            },
            type:"POST",
            success:function (data) {
                // var obj = JSON.stringify(data[0]);//我关注的用户
                // var obj1 = JSON.stringify(data[1]);//关注我的人
                // console.log(data[1]);

                $("#page-focus").empty();

                addFocus();
                function addFocus() {
                    //关注的头部
                    $(".page").css({"display":"none"});
                    $("#page-focus").css({"display":"block"});

                    var userDiv = $("<div class='userDiv'></div>");

                    // var focusUser = $("<div class='focusUser'></div>");
                    var focusUl = $('<ul class="focusUl"></ul>');
                    var focusLi = $('<li class="focusUser focusLi fL">关注我的人（'+ data[1].length+'）</li>');
                    var focusedLi = $('<li class="focusedUser focusedLi fL">我关注的人（'+ data[0].length+ '）</li>');
                    focusUl.append(focusLi,focusedLi);
                    // focusUser.append(focusUl);

                    userDiv.append(focusUl);
                    var friend = $('<div class="friend"></div>');

                    $("#page-focus").append(userDiv,friend);
                }

                //我关注的人 页面添加
                focus();
                function focus() {
                    data[0].forEach(function (item) {
                        var friendContent = $('<div class="friendContent"></div>');

                        var ferhd = $('<div class="ferhd"></div>');
                        var ferA = $('<a class="ferA"></a>');
                        ferA.prop('href','/personalOther?id='+item.user_id);
                        var ferimg = $('<img>');
                        ferimg.attr('src','/images/'+item.user_portart);
                        ferA.append(ferimg);
                        ferhd.append(ferA);

                        var friendUser = $('<a class="friendUser"></a>');
                        friendUser.prop('href','/personalOther?id='+item.user_id);
                        var friendH4 = $('<h4></h4>');
                        friendH4.html(item.user_name);
                        friendUser.append(friendH4);

                        var userImg = $('<img class="userImg">');
                        if(item.user_sex == "女"){
                            userImg.attr('src','/images/icon/nv.png');
                        }
                        if(item.user_sex == "男"){
                            userImg.attr('src','/images/icon/nan.png');
                        }

                        var userBtn = $('<button class="userBtn">已关注</button>');
                        userBtn.attr('data-id',item.user_id);

                        friendContent.append(ferhd,friendUser,userImg,userBtn);
                        $('.friend').append(friendContent);
                    });
                }

                //关注我的人
                $('.focusUser').click(function () {
                    $('.friend').empty();
                    data[1].forEach(function (item) {
                        var friendContent = $('<div class="friendContent"></div>');

                        var ferhd = $('<div class="ferhd"></div>');
                        var ferA = $('<a class="ferA"></a>');
                        ferA.prop('href','/personals?id='+item.user_id);
                        var ferimg = $('<img>');
                        ferimg.attr('src','/images/'+item.user_portart);
                        ferA.append(ferimg);
                        ferhd.append(ferA);

                        var friendUser = $('<a class="friendUser"></a>');
                        friendUser.prop('href','/personals?id='+item.user_id);
                        var friendH4 = $('<h4></h4>');
                        friendH4.html(item.user_name);
                        friendUser.append(friendH4);

                        var userImg = $('<img class="userImg">');
                        if(item.user_sex == "女"){
                            userImg.attr('src','/images/icon/nv.png');
                        }
                        if(item.user_sex == "男"){
                            userImg.attr('src','/images/icon/nan.png');
                        }

                        var collectDiv = $('<div class="collectDiv"></div>');
                        var userCollect = $('<p class="userCollect"></p>');
                        userCollect.html(item.collect_count+'收藏数');
                        collectDiv.append(userCollect);

                        friendContent.append(ferhd,friendUser,userImg,collectDiv);
                        $('.friend').append(friendContent);
                    });
                });

                //我关注的人 页面切换
                $('.focusedUser').click(function () {
                    $('.friend').empty();
                    focus();
                });

                //取消关注
                $('.userBtn').click(function () {
                    $(this).parent().remove();
                    var id = $(this).data('id');
                    $.ajax({
                        url:'/personals/focus/delete',
                        data:{
                            userid:JSON.parse(sessionStorage.user).user_id,
                            id:id
                        },
                        type:"POST",
                        success:function (data) {
                            console.log(data);
                        },
                        error:function (err) {
                            console.log(err);
                        }
                    });
                });

                //关注  样式切换
                $('.fL').click(function () {
                    $('.focusedLi').addClass('focusLi');
                    $('.focusedLi').removeClass('focusedLi');
                    $(this).addClass('focusedLi');
                    $(this).removeClass('focusLi');

                });


            },
            error:function (err) {
                console.log(err)
            }
        });
    });
    
    $('#userCollect').click(function () {
        var id = JSON.parse(sessionStorage.user).user_id;
        $.ajax({
            url:'/personals/collect',
            data:{
                id:id
            },
            type:"POST",
            success:function (data) {
                var cook = data[0];
                var video = data[2];

                for(var i = 0 ; i < data[1].length ; i ++){
                    for(var j = 0 ; j < data[3].length ; j ++){
                        if( data[3][j].topic_id ==  data[1][i].topic_id){
                            data[1][i].img = data[3][j];
                        }
                    }
                    // console.log(data[1][i]);

                }
                var topic = data[1];
                // console.log(topic);


                $("#page-collect").empty();
                //收藏的头部
                addCollect();
                function addCollect() {
                    //关注的头部
                    $(".page").css({"display":"none"});
                    $("#page-collect").css({"display":"block"});

                    var userDiv = $("<div class='userDiv'></div>");

                    // var focusUser = $("<div class='focusUser'></div>");
                    var focusUl = $('<ul class="focusUl"></ul>');
                    var collCook = $('<li class="collCook focusedLi colC">菜谱（'+ cook.length+'）</li>');
                    var collVideo = $('<li class="collVideo focusLi colC">视频（'+ video.length+ '）</li>');
                    var collTopic = $('<li class="collTopic focusLi colC">话题（'+ topic.length+ '）</li>');
                    focusUl.append(collCook,collVideo,collTopic);
                    // focusUser.append(focusUl);

                    userDiv.append(focusUl);
                    var collect = $('<div class="collect"></div>');

                    $("#page-collect").append(userDiv,collect);
                }

                //菜谱收藏页面
                coll();
                function coll() {
                    var collectCook = $('<div class="collectCook"></div>');
                    
                    cook.forEach(function (item) {
                        var collectList = $('<div class="collectList"></div>');

                        var itemC = $('<div class="itemC" target="_blank"></div>');
                        var itemA = $('<a></a>');
                        itemA.prop('href','/cook/detail?id='+item.cook_id);
                        var itemImg = $('<img>');
                        itemImg.attr('src','/images/'+item.cook_images);
                        itemA.append(itemImg);

                        var cookMess = $('<div class="cookMess"></div>');
                        var messA = $('<a target="_blank"></a>');
                        messA.prop('href','/cook/detail?id='+item.cook_id);
                        var messH4 = $('<h4 class="itemC-user"></h4>');
                        messH4.attr('title',item.cook_name);
                        messH4.html(item.cook_name);
                        messA.append(messH4);

                        var span1 = $('<span></span>');
                        span1.html(item.cook_likes+'收藏');
                        var span2 = $('<span></span>');
                        span2.html(item.cook_collects+'评论');
                        var messP = $('<p class="cookDate"></p>');
                        messP.html(item.cook_date);

                        cookMess.append(messA,span1,span2,messP);

                        itemC.append(itemA,cookMess);

                        collectList.append(itemC);

                        collectCook.append(collectList);
                    });
                    
                    $('.collect').append(collectCook);
                }

                //视频页面的切换
                $('.collVideo').click(function () {
                    $('.collect').empty();
                    var collectCook = $('<div class="collectCook"></div>');

                    video.forEach(function (item) {
                        var collectList = $('<div class="collectList"></div>');

                        var itemC = $('<div class="itemC" target="_blank"></div>');
                        var itemA = $('<a></a>');
                        itemA.prop('href','/video/detail?id='+item.video_id);
                        var itemImg = $('<img>');
                        itemImg.attr('src','/video/videoIMG/'+item.video_img);
                        itemA.append(itemImg);

                        var cookMess = $('<div class="cookMess"></div>');
                        var messA = $('<a target="_blank"></a>');
                        messA.prop('href','/cook/detail?id='+item.video_id);
                        var messH4 = $('<h4 class="itemC-user"></h4>');
                        messH4.attr('title',item.video_name);
                        messH4.html(item.video_name);
                        messA.append(messH4);

                        var span1 = $('<span></span>');
                        span1.html(item.video_likes+'收藏');
                        var span2 = $('<span></span>');
                        span2.html(item.video_collects+'评论');
                        var messP = $('<p class="cookDate"></p>');
                        var a = item.video_time.substring(0,10);
                        messP.html(a);


                        cookMess.append(messA,span1,span2,messP);

                        itemC.append(itemA,cookMess);

                        collectList.append(itemC);

                        collectCook.append(collectList);
                    });

                    $('.collect').append(collectCook);
                });

                //话题页面的切换
                $('.collTopic').click(function () {
                    $('.collect').empty();
                    var collectCook = $('<div class="collectCook"></div>');

                    topic.forEach(function (item) {
                        var collectList = $('<div class="collectList"></div>');

                        var itemC = $('<div class="itemC" target="_blank"></div>');
                        var itemA = $('<a></a>');
                        itemA.prop('href','/cook/detail?id='+item.topic_id);
                        var itemImg = $('<img>');
                        itemImg.attr('src','/images/topic/'+item.img.img);
                        itemA.append(itemImg);

                        var cookMess = $('<div class="cookMess"></div>');
                        var messA = $('<a target="_blank"></a>');
                        messA.prop('href','/topics/detail?id='+item.topic_id);
                        var messH4 = $('<h4 class="itemC-user"></h4>');
                        messH4.attr('title',item.topic_title);
                        messH4.html(item.topic_title);
                        messA.append(messH4);

                        var span1 = $('<span></span>');
                        span1.html(item.topic_likecount+'收藏');
                        var span2 = $('<span></span>');
                        span2.html(item.topic_collectNum+'评论');
                        var messP = $('<p class="cookDate"></p>');
                        var a = item.topic_date.substring(0,10);
                        messP.html(a);


                        cookMess.append(messA,span1,span2,messP);

                        itemC.append(itemA,cookMess);

                        collectList.append(itemC);

                        collectCook.append(collectList);
                    });

                    $('.collect').append(collectCook);
                });

                $('.collCook').click(function () {
                    $('.collect').empty();
                    coll();
                });

                //头部样式的切换
                $('.colC').click(function () {
                    $('.focusedLi').addClass('focusLi');
                    $('.focusedLi').removeClass('focusedLi');
                    $(this).addClass('focusedLi');
                    $(this).removeClass('focusLi');

                });

            },
            error:function (err) {
                console.log(err)
            }
        });
    });


});