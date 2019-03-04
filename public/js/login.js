
$(function () {
    $(".loginBtn").click(function () {
        if($(".tel").val() == "" || $(".password").val() == ""){
            alert("请输入完整的信息");
            return;
        }
        var b = new Base64();
        var str = b.encode($(".password").val());
        $.ajax({
            url: '/users/login',
            data:{
                tel:$(".tel").val(),
                password:str
            },
            type:'POST',
            success:function (data) {
                var obj = JSON.parse(data);
                if (obj.length == 0){
                    alert("登录失败，用户名或密码错误");
                    return false;
                }
                else{
                    sessionStorage.user = JSON.stringify(obj[0]);
                    location.href='/';
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
    });
});
