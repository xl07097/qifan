/**
 * Created by xueliang on 2016/12/20.
 */
$(function () {
    var count=0;

    //手机号码验证
    $(".tel").focus(function () {
        $(".prompt-message").html("请输入11位手机号");
    });
    $(".tel").blur(function () {
        var str = $(".tel").val();
        var n = checkPhone(str);
        if (n ==false){
            $(".icon1").addClass("judge1");
            $(".icon1").removeClass("judge2");
        }
        else {
            $(".icon1").addClass("judge2");
            $(".icon1").removeClass("judge1");
            count++;
        }
    });
    //密码
    $(".password").focus(function () {
        $(".prompt-message").html("密码由字母或数字组成最少六位");
    });
    $(".password").blur(function () {
        var str = $(".password").val();
        var n = checkPassword(str);
        if (n ==false){
            $(".icon2").addClass("judge1");
            $(".icon2").removeClass("judge2");
        }
        else {
            $(".icon2").addClass("judge2");
            $(".icon2").removeClass("judge1");
            count++;
        }
    });

    $(".registerBtn").click(function () {
        // console.log(2222);
        var b = new Base64();
        var str = b.encode($(".password").val());
        //解密
        // str = b.decode(str);
        if (count == 2){
            $.ajax({
                url: "/users/register",
                data: {
                    tel: $(".tel").val(),
                    password:str
                },
                type:"POST",
                success:function (data) {
                    var obj = JSON.parse(data);
                    // alert(data);

                    if (obj[0].length == 0){
                        alert("注册失败，手机号已注册");
                        return;
                    }
                    else{
                        location.href = "/users/login";
                    }
                },
                error:function (err) {
                    alert(err);
                }
            });
        }
        else {
            alert("账号已存在或注册信息不正确、不完善");
        }
    });
    //验证手机号函数
    function checkPhone(str) {
        var reg = /^1[3|5|7|8]\d{9}$/;
        if (reg.test(str)){
            return true;
        }
        else {
            return false;
        }
    }

    //验证密码函数
    function checkPassword(str) {
        var re = /^[a-zA-Z0-9]{6,15}$/;
        if (re.test(str)){
            return true;
        }
        else {
            return false;
        }
    }
});