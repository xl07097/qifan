/**
 * Created by Administrator on 2016/11/22.
 */
$(function () {
    var div = $("div");
    footerItemList = ["关于我们","客户服务","手机七饭","友情链接"];
    footerItemList1 = ["关于七饭","加入七饭","用户协议"];
    footerItemList2 = ["帮助中心","意见反馈","联系客服"];
    footerItemList3 = ["七饭菜谱","七饭 android 版"];
    footerItemList4 = ["菜谱网","美食杰","美食天下"];
    for(var i=0;i < 4;i++){
        var dl = $("<dl></dl>");
        var dt = $("<dt></dt>");
        dl.append(dt);
        div.append(dl);
        dt.html(footerItemList[i]);
        for(var j = 0;j < 3;j++){
            var dd = $("<dd></dd>");
            dd.html(footerItemList(i+1)[j]);
            dl.append(dd);
        }
    }
});