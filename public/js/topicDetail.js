/**
 * Created by jesus on 2016/12/29.
 */
$(function(){
    $("#cmtPost").click(function () {
        console.log(1);
        if(sessionStorage.user == undefined){
            alert('请先登录');
            location.href = '/users/login';
            return;
        }
        // console.log($(this).data('type'));
        $.ajax({
            url:'/topic/detail/add',
            data:{
                content:$("#areacontent").val(),
                time:(new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                userid:JSON.parse(sessionStorage.user).user_id,
                videoid:$(this).data('topic_id'),
                commentType:$(this).data('type')
            },
            type:'POST',
            success:function (data) {
                //alert('评论data:',data);
                var topiccmt = JSON.parse(data);
                console.log(data);

                //发表成功后,将新的一条评论添加的列表前面

                //视频评论UI
                var comment_list= $("<div class='comment_list'></div>");
                var comment_images = $("<div class='comment_images'></div>");
                var img = $("<img src='/images/"+topiccmt[0].user_portart+"'>");
                var comment_show = $("<div class='comment_show'></div>");
                var comment_p= $("<p class='comment_p'>"+topiccmt[0].commenttopic_context+"</p>");

                comment_list.append(comment_images);
                comment_images.append(img);
                comment_show.append(comment_p);
                $("#comment-list").prepend(comment_list);
            },
            error:function (err) {
                alert(err);
            }
        });
    });

});