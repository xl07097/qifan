/**
 * Created by Administrator on 2017/1/10.
 */
$(function () {
    $('#page-changepwd').hide();
    $('#mes').click(function () {
        $('.perfe').show();
        $('#page-changepwd').hide();
    });
    $('#paw').click(function () {
        $('.perfe').hide();
        $('#page-changepwd').show();
    });

    
    //密码修改
    $('#buttonChange').click(function () {
        var id = $(this).parent().data('id');

        if($('#newPwd').val() == $('#conPwd').val()){
            if($('#newPwd').val() != ""){
                var b = new Base64();
                var str = b.encode($('#newPwd').val());
                $.ajax({
                    url:'/personals/upPsw',
                    data:{
                        id:id,
                        psw:str
                    },
                    type:"POST",
                    success:function (data) {
                        if(data.affectedRows == 1){
                            // swal('密码修改成功，请重新登录');
                            swal({
                                    title: "密码修改成功，请重新登录",
                                    type: "success",
                                    showCancelButton: true,
                                    confirmButtonColor: "#6FBFB1",
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    closeOnConfirm: false
                                },
                                function(){
                                    location.href = "/users/login";
                                });
                        }
                        console.log(data.affectedRows);
                    },
                    error:function (err) {
                        console.log(err);
                    }
                });
            }else{
                swal('密码不能为空');
            }

        }else{
            swal('两次输入的密码不一致');
        }
        // console.log($('#newPwd').val());
        // console.log($('#conPwd').val());
    });

    //信息修改
    $('#buttonSave').click(function () {
        var name = $('#itName').val();
        var sex = $('.itSex:checked').val();
        var tele = $('#itTele').val();
        var bir = $('#birth').val();
        var mail = $('#itMail').val();
        var id = $('.perfe').data('id');
        var psw = (JSON.parse(sessionStorage.user)).user_password;
        
        $.ajax({
            url:'/personals/update',
            data:{
                name:name,
                sex:sex,
                tele:tele,
                bir:bir,
                mail:mail,
                id:id,
                psw:psw
            },
            type:"POST",
            success:function (data) {
                if(data.affectedRows == 1){
                    swal({
                        title: "信息修改成功",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonColor: "#6FBFB1",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: false
                        },
                        function(){
                            location.href = '/personals?id='+data.id;
                        }
                    );
                }
            },
            error:function (err) {
                console.log(err);
            }
        });
    });
});