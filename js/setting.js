/**
 * Created by Administrator on 2017/10/17 0017.
 */
//设置成rem单位
(function(){
    var vHtml = document.documentElement;
    var vWidth = vHtml.getBoundingClientRect().width;
    vHtml.style.fontSize = vWidth / 15 + 'px';
})()
function getterApi(url,data){
    $.ajaxSetup({
        async : false
    });
    var returnData;
    $.get(url,data,function(data){
        if(typeof(data) != "object")
        {
            data = JSON.parse(data);
        }

        /*if(returnData.code != 200){
         showError('','服务器错误',3);
         }*/

        returnData = data;
    });
    return returnData;
}