/**
 * Created by Administrator on 2017/1/6.
 */
$(function () {
    //烹饪等级
    $('.cookingLevel').click(function () {
        $(this).children().css({'display':'none'});

        var option1 = $("<option>烹饪难度</option>");
        var option2 = $("<option>切墩(初级)</option>");
        var option3 = $("<option>配菜(中级)</option>");
        var option4 = $("<option>掌勺(高级)</option>");

        $(this).append(option1,option2,option3,option4);
    });

    //烹饪时间
    $('.cookingTime').click(function () {
        $(this).children().css({'display':'none'});

        var option1 = $("<option>烹饪时间</option>");
        var option2 = $("<option>10分钟左右</option>");
        var option3 = $("<option>10-30分钟</option>");
        var option4 = $("<option>30-60分钟</option>");
        var option5 = $("<option>1小时以上</option>");

        $(this).append(option1,option2,option3,option4,option5);
    });

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
    
    
    //菜谱编辑
    $('#editCook').click(function () {

        var cookId = $('.publicContent').data('id');
        var fd = new FormData($('#form4')[0]);
        // console.log(fd);

        var matArr = [];
        var subArr = [];
        var stepArr = [];

        function fZ(a,arr){
            for(var i = 0 ; i < a.length ; i++){
                var matObj = {
                    "matId":a.eq(i).parent().data('id'),
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
                "subId":sub.parent().data('id'),
                'subName': sub.val(),
                'subNum': sub.next().val()
            };
            subArr.push(subObj);
        }

        for(var i = 0 ; i < $('.stepNum').length ; i++){
            var step = $('.stepNum').eq(i);
            var stepObj = {
                "stepId":step.parent().prop('id'),
                'stepNum': step.val(),
                'stepText': step.next().val()
            };
            stepArr.push(stepObj);
        }
        
        var imgString = $('#img0').attr('src').substring(8).split('.');//数组
        var attrLen = imgString.length -1 ;//数组中最后一个

        var imgSrc = {
            name:$('#img0').attr('src').substring(8),
            type:'image/'+imgString[attrLen]
        };

        var srcImg = [];
        for(var n = 0 ; n < $('.stepUpload img').length ; n ++){
            var src = $(".stepUpload img").eq(n).attr('src');
            console.log(src);

            var string = src.substring(8).split('.');
            var len = string.length -1;

            var img = {
                name:src.substring(8),
                type:'image/'+string[len]
            };
            srcImg.push(img);
        }
        // console.log(srcImg);


        // fd.append('type','cook');
        fd.append('typeId',flag);
        fd.append('userId',(JSON.parse(sessionStorage.user)).user_id);
        fd.append('cookId',cookId);
        fd.append('imgSrc',JSON.stringify(imgSrc));
        fd.append('material',JSON.stringify(matArr));
        fd.append('submaterial',JSON.stringify(subArr));
        fd.append('cookStep',JSON.stringify(stepArr));
        fd.append('stepImg',JSON.stringify(srcImg));

        $.ajax({
            url:'/edit',
            data:fd,
            type:'POST',
            async:false,//async:异步
            cache:false,
            contentType:false,
            processData:false,
            success:function (data) {

                // console.log('success:'+JSON.stringify(data));
                if(data.affectedRows === '1'){
                    swal({
                        title: "确定修改吗",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#6FBFB1",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnConfirm: true
                    },
                        function () {
                            publicSuccess('cook',cookId,(JSON.parse(sessionStorage.user)).user_id);
                        }

                    );
                    
                }
            },
            error:function (err) {
                // console.log(err.statusText);
                alert('请上传至少一张png、jpg或jpeg格式的图片');
            }
        });

    });

    

    //发布成功的页面
    function publicSuccess(type,id,userId) {
        //跳转到发布成功的页面
        $('.publicHome').empty();
        var successHome = $('<div class="successHome"></div>');

        var successDiv = $('<div class="successDiv"></div>');
        var successIcon = $('<img src="/images/234516-15101911350055.png">');
        var successText = $('<h1>修改成功</h1>');
        successDiv.append(successIcon,successText);

        var seeDiv = $('<div class="seeDiv"></div>');
        var seeDetail = $('<a></a>');
        seeDetail.prop('href','/'+ type +'/detail?id='+id);
        var seeP = $('<p class="seeP">查看详情</p>');
        seeDetail.append(seeP);
        var back = $('<a></a>');
        back.prop('href','/personals?id='+userId);
        var backP = $('<p class="backP">返回个人中心</p>');
        back.append(backP);
        var backHome = $('<a></a>');
        backHome.prop('href','/');
        var homeP = $('<p class="homeP">回到首页</p>');
        backHome.append(homeP);

        seeDiv.append(seeDetail,back,backHome);

        successHome.append(successDiv,seeDiv);

        $('.publicHome').append(successHome);
    }


    //增加用料栏
    $('.addOne').click(function () {
        var addMore = $(this).parent().prevUntil('.dosageAdd');
        var name = addMore.children().prop('name').substring(0,3);
        // console.log(addMore.children().prop('name').substring(0,3));
        var dosageAdd = $("<div class='dosageAddMore'></div>");
        var dosageInputL = $('<input type="text" class="dosageInputLL" value="">');
        dosageInputL.addClass(name+'Name');
        var dosageInputR = $('<input type="text" class="dosageInputRR" value="">');
        dosageInputR.addClass(name+'Num');

        var dosageImg = $('<img src="/images/ic_mes.png"  class="dosImg">');

        dosageAdd.append(dosageInputL,dosageInputR,dosageImg);

        var n = $(this).parent();
        // n.parent().append()
        dosageAdd.insertBefore(n);

        $('.dosImg').click(function () {
            $(this).parent().remove();
        });
    });

    // 删除相应的用料栏
    $('.dosImg').click(function () {
        $(this).parent().remove();
    });

    //增加步骤
    $('.addOneMore').click(function () {
        var findNode = $(this).parent().prev().children('li:last-child');
        var getNode = findNode.children('.stepNum').val();
        var showNum = parseInt(getNode) + 1;

        var stepLi = $('<li class="stepLi"></li>');
        stepLi.attr('data-id',showNum);

        var stepDiv = $('<div class="stepDiv"></div>');
        var stepImg = $('<img src="">');
        stepImg.prop('id','img'+showNum);
        stepDiv.append(stepImg);
        var stepBtn = $('<input type="file" class="stepBtn" style="display: none">');
        stepBtn.prop('name','editFile'+showNum);
        stepBtn.prop('id','editStep'+showNum);
        // var stepBtn = $('<input type="file" class="stepBtn">');
        // stepBtn.prop('name','stepFile'+showNum);

        var stepNum = $('<input type="text"  class="stepNum">');
        stepNum.val(showNum);

        var stepText = $('<textarea class="stepText"></textarea>');

        var imgDiv = $('<div class="imgDiv"></div>');
        imgDiv.attr('data-id',showNum);
        var upImg = $('<img src="/images/publicHtml/up.png" class="upImg">');
        var downImg = $('<img src="/images/publicHtml/down.png" class="downImg">');
        var deleteImg = $('<img src="/images/publicHtml/delete.png" class="deleteImg">');
        imgDiv.append(upImg,downImg,deleteImg);

        stepLi.append(stepDiv,stepBtn,stepNum,stepText,imgDiv);

        $('.stepBox').append(stepLi);
    });

    showImg($('.addContent'),'#uploadImg','#fileBtn');
    showImg($('.addStep'),'.stepDiv','.stepBtn');
    showImg($('.publicHome'),'.videoloadImg','#imgBtn');
    showImg($('.publicHome'),'.loadDiv','.imgFile');
    showImg($('.editContent'),'#editImg','#fileBtn');
    showImg($('.stepLi'),'.stepUpload','.editStep');
    showImg($('.h-user'),'.h-avatar','#userPor');

    //图片预览
    function showImg(a,b,c) {
        //点击图片显示上传
        a.on('click',b,function () {
            // console.log($(this).parent());
            $(this).next().click();
        });
        //图片预览
        a.on('change',c,function () {
            var objUrl = getObjectURL(this.files[0]) ;
            // console.log($(this)) ;
            if (objUrl) {
                $(this).prev().children().attr("src", objUrl) ;
            }
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


    //步骤上移 第一步禁止上移
    $('.addStep').on('click','.upImg',function () {
        var parents = $(this).parents('li');//当前整个元素
        var prev = $(this).parents('li').prev();//上一个元素

        // console.log(prev.data('id'));
        // console.log(parents.clone(true));
        if(prev.html() == undefined){
            //如果是第一个，提示用户不能上移
            alert('这已经是第一步了，不能上移哦^_^');
        }else{
            var cloneObj = parents.clone(true);//克隆要移动的元素
            prev.before(cloneObj);//并将其置于上一个元素之上
            parents.remove();//删除原来的元素

            var prevNum = prev.children('input').eq(1).val();//获取上一个元素的步骤数
            var thisNum = cloneObj.children('input').eq(1).val();//获取当前的步骤数

            //交换的步骤数对换
            cloneObj.children('input').eq(1).val(" ");//清空克隆元素的value值
            cloneObj.children('input').eq(1).val(prevNum);//并赋值给克隆元素
            prev.children('input').eq(1).val(" ");
            prev.children('input').eq(1).val(thisNum);

        }


    });

    //下移
    $('.addStep').on('click','.downImg',function () {
        var parents = $(this).parents('li');//当前整个元素
        var next = $(this).parents('li').next();//下一个元素

        if(next.html() == undefined){
            //如果是最后一个，提示用户不能下移
            alert('这已经是最后一步了，不能下移哦^_^');
        }else{
            var cloneObj = parents.clone(true);//克隆要移动的元素
            next.after(cloneObj);//并将其置于下一个元素之下
            parents.remove();//删除原来的元素

            var nextNum = next.children('input').eq(1).val();//获取下一个元素的步骤数
            var thisNum = cloneObj.children('input').eq(1).val();//获取当前的步骤数

            //交换的步骤数对换
            cloneObj.children('input').eq(1).val(" ");//清空克隆元素的value值
            cloneObj.children('input').eq(1).val(nextNum);//并赋值给克隆元素
            next.children('input').eq(1).val(" ");
            next.children('input').eq(1).val(thisNum);

        }


    });

    //删除当前步骤
    $('.addStep').on('click','.deleteImg',function () {
        var parents = $(this).parents('li');//当前整个元素
        var prev = $(this).parents('li').prev();//上一个元素
        var next = $(this).parents('li').next();//下一个元素

        var prevNum = prev.children('input').eq(1).val();//获取上一个元素的步骤数
        var nextNum = next.children('input').eq(1).val();//获取下一个元素的步骤数
        var thisNum = parents.children('input').eq(1).val();//获取当前的步骤数

        parents.remove();//删除

        var lostNum = $('.stepLi').length;//删除后的剩下的步骤个数
        // console.log(lostNum);

        var obj = $('.stepLi').children('input:odd');
        // console.log(obj.eq(1));

        for(var i = 0 ; i < lostNum ; i++){
            var a = i + 1;
            obj.eq(i).val(" ");
            obj.eq(i).val(a);
            // console.log(obj.eq(i));
        }

    });
});