/**
 * Created by Administrator on 2017/1/6.
 */
$(function () {

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
        stepBtn.prop('name','stepFile'+showNum);
        stepBtn.prop('id','stepBtn'+showNum);

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