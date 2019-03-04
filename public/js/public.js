/**
 * Created by Administrator on 2016/12/21.
 */
$(function () {

    function dosageLeft(a) {
        var name = a.prop('id').substring(0,3);
        // console.log(name);
        for(var i = 0 ; i < 3 ; i++){
            var n = i + 1;
            var dosageAdd = $("<div class='dosageAddMore'></div>");
            var dosageInputL = $('<input type="text" class="dosageInputLL" value="">');
            dosageInputL.addClass(name+'Name');
            // console.log(dosageInputL.prop('name'));
            var dosageInputR = $('<input type="text" class="dosageInputRR" value="">');
            dosageInputR.addClass(name+'Num');
            var dosageImg = $('<img src="/images/ic_mes.png"  class="dosImg">');

            a.append(dosageAdd);
            dosageAdd.append(dosageInputL,dosageInputR,dosageImg);
        }
        var addMore = $("<div class='addMore'></div>");
        var  addOne = $('<a  class="addOne">增加一栏</a>');
        addMore.append(addOne);

        a.append(addMore);

    }
    //动态添加 用料栏
    dosageLeft($('#mater'));
    dosageLeft($('#submater'));

    //动态添加步骤
    function addStep() {
        var  stepBox = $('<ul class="stepBox"></ul>');
        $('.addStep').append(stepBox);

        for(var i = 0 ; i < 3 ; i++){
            var n = i + 1;
            var stepLi = $('<li class="stepLi"></li>');
            stepLi.attr('data-id',n);

            var stepDiv = $('<div class="stepDiv"></div>');
            var stepImg = $('<img src="">');
            stepImg.prop('id','img'+n);
            stepDiv.append(stepImg);
            var stepBtn = $('<input type="file" class="stepBtn" style="display: none">');
            stepBtn.prop('name','stepFile'+n);
            stepBtn.prop('id','stepBtn'+n);

            var stepNum = $('<input type="text"  class="stepNum">');
            // stepNum.prop('name','stepNum'+n);
            stepNum.val(n);
            var stepText = $('<textarea class="stepText"></textarea>');
            // stepText.prop('name','stepText'+n);

            var imgDiv = $('<div class="imgDiv"></div>');
            imgDiv.attr('data-id',n);
            var upImg = $('<img src="/images/publicHtml/up.png" class="upImg">');
            var downImg = $('<img src="/images/publicHtml/down.png" class="downImg">');
            var deleteImg = $('<img src="/images/publicHtml/delete.png" class="deleteImg">');
            imgDiv.append(upImg,downImg,deleteImg);

            stepLi.append(stepDiv,stepBtn,stepNum,stepText,imgDiv);

            stepBox.append(stepLi);
        }

        var addMore = $('<div class="addMore"></div>');
        var addOne = $('<a class="addOneMore">增加一步</a>');
        addMore.append(addOne);

        $('.addStep').append(addMore);
    }
    addStep();

    //菜系选择
    //设置默认typeid为1
    var flag = 1;

    $('.selType').each(function (index) {
        $('.selType').eq(index).addClass('selHide');
        // $('.selType').eq(0).removeClass('selHide');
        $('.selType').eq(0).addClass('selShow');
    });

    $('.selType').change(function () {
        var selected = $(".selType option:selected");
        flag = selected.data('id');
        return flag;
    });
    $("#sel1").change(function(){
        var selected = $("#sel1 option:selected");
        // console.log(selected.data('id'));
        for(var i = 0 ; i < $('.selType').length ; i++){
            var sel = $('.selType').eq(i);
            if(selected.data('id') == sel.data('id')){
                // console.log(sel);
                $('.selShow').removeClass('selShow');
                sel.addClass('selShow');
                sel.change(function () {
                    var select = $(this).children('option:selected');
                    flag = select.data('id');
                    return flag;
                });
            }
        }

    });
    
    //发布菜谱请求
    $('#publicCook').click(function () {
        // console.log($("#img0").attr("src"));
        if($("#img0").attr("src") == "/images/publicHtml/bg_jiaic.jpg"){
            swal({
                title:'菜谱图片不能为空',
                type:"warning",
                confirmButtonColor: "#6FBFB1"
            });
            return;
        }
        var fd = new FormData($('#form1')[0]);

        var matArr = [];
        var subArr = [];
        var stepArr = [];

        function fZ(a,arr){
            for(var i = 0 ; i < a.length ; i++){
                var matObj = {
                    "matName":a.eq(i).val(),
                    'matNum':a.eq(i).next().val()
                };
                arr.push(matObj);
            }
            return arr;
        }
        fZ($('.matName'),matArr);

        for(var j = 0 ; j < $('.subName').length ; j++){
            var sub = $('.subName').eq(j);
            var subObj = {
                'subName': sub.val(),
                'subNum': sub.next().val()
            };
            subArr.push(subObj);
        }

        for(var i = 0 ; i < $('.stepNum').length ; i++){
            var step = $('.stepNum').eq(i);
            var stepObj = {
                'stepNum': step.val(),
                'stepText': step.next().val()
            };
            stepArr.push(stepObj);
        }

        fd.append('typeId',flag);
        fd.append('userId',(JSON.parse(sessionStorage.user)).user_id);
        fd.append('material',JSON.stringify(matArr));
        fd.append('submaterial',JSON.stringify(subArr));
        fd.append('cookStep',JSON.stringify(stepArr));


        $.ajax({
            url:'/users/public',
            data:fd,
            type:'POST',
            async:false,//async:异步
            cache:false,
            contentType:false,
            processData:false,
            success:function (data) {
                // console.log('success:'+JSON.stringify(data));
                if(data.affectedRows == '1'){
                    // swal('发布菜谱成功');
                    swal({
                            title: "确定发布吗",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#6FBFB1",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: true
                        },
                        function(){
                            var cookId = data.insertId;
                            publicSuccess('cook',cookId);
                        });

                }
            },
            error:function (err) {
                console.log(err);
            }
        });
    });

    //标题样式变化
    $('.selectPublic h2').click(function () {
            $('.selected').removeClass('selected');
            $(this).addClass('selected');
        });

    //视频页面的添加
    function addVideo() {
        var form2 = $('<form id="form2"></form>');
        var publicContent = $('<div class="publicContent"></div>');

        var contentTitle = $('<div class="titleContent"></div>');
        var titleName = $('<p class="titleName">视频标题</p>');
        var titleInput = $('<input type="text" class="contentInput" placeholder="视频名称" name="title">');
        contentTitle.append(titleName,titleInput);

        var videoContent = $('<div class="videoContent"></div>');
        var imgP = $('<p class="imgP">视频封面</p>');

        var upLoad = $('<div class="videoloadImg"></div>');
        var imgLoad = $('<img src="/images/publicHtml/bg_jiaic.jpg">');
        upLoad.append(imgLoad);
        var imgVideoInput = $('<input type="file" name="file1" id="imgBtn">');



        var videoP = $('<p class="videoP">视频文件</p>');
        var videoFile = $('<input type="file" name="file2">');

        videoContent.append(imgP,upLoad,imgVideoInput,videoP,videoFile);

        publicContent.append(contentTitle,videoContent);

        var buttonPublic = $('<div class="buttonPublic"></div>');
        var publicBtn = $('<input  type="button" class="public" value="发布">');
        publicBtn.prop('id','publicVideo');

        buttonPublic.append(publicBtn);
        form2.append(publicContent,buttonPublic);

        $('.publicHome').append(form2);
    }
    addVideo();


    //话题页面的添加
    function addTopic() {
        var form3 = $('<form id="form3"></form>');
        var publicContent = $('<div class="publicContent"></div>');

        var contentTitle = $('<div class="titleContent"></div>');
        var titleName = $('<p class="titleName">标题</p>');
        var titleInput = $('<input type="text" class="contentInput" placeholder="话题名称" name="title">');
        contentTitle.append(titleName,titleInput);

        var topicContent = $('<div class="topicContent"></div>');
        var topicP = $('<p class="topicP">内容</p>');
        var topicText = $('<textarea class="topicText" name="content"></textarea>');
        topicContent.append(topicP,topicText);

        var topicImg = $('<div class="topicImg"></div>');
        var imgP = $('<p class="imgTopic">上传图片</p>');
        var fileBox = $('<div class="fileBox"></div>');
        var addDiv = $('<div class="addMore"></div>');
        var addImg = $('<a class="addImg">添加图片</a>');
        addDiv.append(addImg);
        topicImg.append(imgP,fileBox,addDiv);

        for(var i = 0 ; i < 3 ;i++){
            var loadDiv = $('<div class="loadDiv"></div>');
            var loadImg = $('<img src="">');
            var deleteBtn = $('<span class="deleteBtn"></span>');
            loadDiv.append(loadImg,deleteBtn);

            var imgFile = $('<input type="file" class="imgFile">');
            imgFile.attr('name','file'+i);
            fileBox.append(loadDiv,imgFile);
        }

        publicContent.append(contentTitle,topicContent,topicImg);

        var buttonPublic = $('<div class="buttonPublic"></div>');
        var publicBtn = $('<input  type="button" class="public" value="发布">');
        publicBtn.prop('id','publicTopic');

        buttonPublic.append(publicBtn);
        form3.append(publicContent,buttonPublic);

        $('.publicHome').append(form3);
    }
    addTopic();

    //话题页面图片框的增加
    $('.addImg').click(function () {
        //获取最后一个input
        var num = parseInt($(this).parent().prev().children('input:last').prop('name').substring(4)) + 1;

        var loadDiv = $('<div class="loadDiv"></div>');
        var loadImg = $('<img src="">');
        var deleteBtn = $('<span class="deleteBtn"></span>');
        loadDiv.append(loadImg,deleteBtn);

        var imgFile = $('<input type="file" class="imgFile">');
        imgFile.attr('name','file'+num);
        $('.fileBox').append(loadDiv,imgFile);
    });

    //话题页面图片框的删除
    $('.publicHome').on('click','.deleteBtn',function () {
        $(this).parent().remove();
    });

    //视频发布页面
    $('.selectVideo').click(function () {
        $('#form2').css('display','block');
        $('#form1').css('display','none');
        $('#form3').css('display','none');

        $('#publicVideo').click(function () {

            var fv = new FormData($('#form2')[0]);

            fv.append('userId',(JSON.parse(sessionStorage.user)).user_id);
            // console.log(fv);

            $.ajax({
                url:'/users/public/video',
                data:fv,
                type:'POST',
                async:false,//async:异步
                cache:false,
                contentType:false,
                processData:false,
                success:function (data) {
                    swal({
                            title: "确定发布吗",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#6FBFB1",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: true
                        },
                        function(){
                            var publicId = data.insertId;
                            publicSuccess('video',publicId);
                        });
                    // console.log('success:'+JSON.stringify(data));
                    // if(data.affectedRows == '1'){
                    //     swal('发布视频成功',"","success");
                    //     var publicId = data.insertId;
                    //
                    //     publicSuccess('video',publicId);
                    // }
                },
                error:function (err) {
                    // console.log(err);
                    swal('请上传至少一张png、jpg或jpeg格式的图片');
                }
            });
        });

    });

    //话题发布页面
    $('.selectTopic').click(function () {
        $('#form3').css('display','block');
        $('#form1').css('display','none');
        $('#form2').css('display','none');

        $('#publicTopic').click(function () {

            var ft = new FormData($('#form3')[0]);

            ft.append('userId',(JSON.parse(sessionStorage.user)).user_id);
            // console.log(ft);

            $.ajax({
                url:'/users/public/topic',
                data:ft,
                type:'POST',
                async:false,//async:异步
                cache:false,
                contentType:false,
                processData:false,
                success:function (data) {
                    swal({
                            title: "确定发布吗",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#6FBFB1",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: true
                        },
                        function(){
                            var publicId = data.insertId;
                            publicSuccess('topic',publicId);
                        });
                    console.log('success:'+JSON.stringify(data));
                    // if(data.affectedRows == '1'){
                    //     alert('发布话题成功');
                    //     var publicId = data.insertId;
                    //     publicSuccess('topic',publicId);
                    // }
                },
                error:function (err) {
                    // console.log(err);
                    alert('请上传至少一张png、jpg或jpeg格式的图片');
                }
            });
        });
    });

    //菜谱发布页面
    $('.selectCook').click(function () {
        $('#form1').css('display','block');
        $('#form2').css('display','none');
        $('#form3').css('display','none');
    });

    //发布成功的页面
    function publicSuccess(type,id) {
        //跳转到发布成功的页面
        $('.publicHome').empty();
        var successHome = $('<div class="successHome"></div>');

        var successDiv = $('<div class="successDiv"></div>');
        var successIcon = $('<img src="/images/234516-15101911350055.png">');
        var successText = $('<h1>发布成功</h1>');
        successDiv.append(successIcon,successText);

        var seeDiv = $('<div class="seeDiv"></div>');
        var seeDetail = $('<a></a>');
        seeDetail.prop('href','/'+ type +'/detail?id='+id);
        var seeP = $('<p class="seeP">查看详情</p>');
        seeDetail.append(seeP);
        var back = $('<a></a>');
        back.prop('href','/users/public');
        var backP = $('<p class="backP">返回发布</p>');
        back.append(backP);
        var backHome = $('<a></a>');
        backHome.prop('href','/users/public');
        var homeP = $('<p class="homeP">回到首页</p>');
        backHome.append(homeP);

        seeDiv.append(seeDetail,back,backHome);

        successHome.append(successDiv,seeDiv);

        $('.publicHome').append(successHome);
    }
    
});