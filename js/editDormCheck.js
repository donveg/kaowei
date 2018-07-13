(function(){
    var data_id = GetQueryString('data-id');
    $('.edit-cancel a').attr('href','dormCheck.html?data-id='+data_id);
    getList();
})()

$('.normal-list').on('click','i',function(){
    var id = $(this).attr('data-id');
    var status = $(this).attr('data-status');
    $.post(getApiUrl+'/dormitory/statistics/change-status?access_token='+sessionStorage.getItem("access_token"),{'id':id,'status':status},function(data){
        getList();
    })
});

function getList()
{
    var id = GetQueryString('data-id');
    var bid = GetQueryString('did');
    $.get(getApiUrl+'/dormitory/statistics/search?access_token='+sessionStorage.getItem("access_token"),{'bid':id,'did':bid},function(data){
        if(data.code == 0){
            var str = '';
            if(data.data.type == 1){ //白天状态
                if(data.data.list.abnormal.length >0) { //有异常
                    $.each(data.data.list.abnormal,function(k,v){
                        if(v.gender == 0)
                        {
                            gender = '未填写';
                        }
                        if(v.gender == 1)
                        {
                            gender = '男';
                        }
                        if(v.gender == 2)
                        {
                            gender = '女';
                        }

                        str += '<li class="night-normal-li">\
                            <div class="normal-list-left"><img src="images/ic-yes.png"></div>\
                            <div class="normal-list-middle">\
                                <p><span>'+v.username+'</span><i>'+v.grade_name+v.class_room_name+'</i><label>'+gender+'</label></p>\
                                <p>状态：在寝</p>\
                            </div>\
                            <div class="edit-list-right">\
                                <span><i data-status="4" data-id="'+v.id+'"></i>离寝</span>\
                                <span><i class="active" data-status="1" data-id="'+v.id+'"></i>在寝</span>\
                            </div>\
                        </li>';

                        //str += '<li class="day-normal-li">\
                        //    <div class="normal-list-left"><img src="images/ic-no.png"></div>\
                        //    <div class="normal-list-middle">\
                        //        <p><span>'+v.username+'</span><i>'+v.grade_name+v.class_room_name+'</i><label>'+gender+'</label></p>\
                        //        <p>状态：离寝中</p>\
                        //    </div>\
                        //    <div class="edit-list-right">\
                        //        <span><i class="active" data-status="4" data-id="'+v.id+'"></i>离寝</span>\
                        //        <span><i data-status="1" data-id="'+v.id+'"></i>在寝</span>\
                        //    </div>\
                        //</li>';
                    });
                }
                if(data.data.list.normal.length >0) { //正常
                    $.each(data.data.list.normal,function(k,v){
                        if(v.gender == 0)
                        {
                            gender = '未填写';
                        }
                        if(v.gender == 1)
                        {
                            gender = '男';
                        }
                        if(v.gender == 2)
                        {
                            gender = '女';
                        }

                        str += '<li class="day-normal-li">\
                            <div class="normal-list-left"><img src="images/ic-no.png"></div>\
                            <div class="normal-list-middle">\
                                <p><span>'+v.username+'</span><i>'+v.grade_name+v.class_room_name+'</i><label>'+gender+'</label></p>\
                                <p>状态：离寝中</p>\
                            </div>\
                            <div class="edit-list-right">\
                                <span><i class="active" data-status="4" data-id="'+v.id+'"></i>离寝</span>\
                                <span><i data-status="1" data-id="'+v.id+'"></i>在寝</span>\
                            </div>\
                        </li>';

                        //str += '<li class="night-normal-li">\
                        //    <div class="normal-list-left"><img src="images/ic-yes.png"></div>\
                        //    <div class="normal-list-middle">\
                        //        <p><span>'+v.username+'</span><i>'+v.grade_name+v.class_room_name+'</i><label>'+gender+'</label></p>\
                        //        <p>状态：在寝</p>\
                        //    </div>\
                        //    <div class="edit-list-right">\
                        //        <span><i data-status="4" data-id="'+v.id+'"></i>离寝</span>\
                        //        <span><i class="active" data-status="1" data-id="'+v.id+'"></i>在寝</span>\
                        //    </div>\
                        //</li>';
                    });
                }
            }else{//晚上
                if(data.data.list.abnormal.length >0) { //有异常
                    $.each(data.data.list.abnormal,function(k,v){
                        if(v.gender == 0)
                        {
                            gender = '未填写';
                        }
                        if(v.gender == 1)
                        {
                            gender = '男';
                        }
                        if(v.gender == 2)
                        {
                            gender = '女';
                        }

                        str += '<li class="day-normal-li">\
                            <div class="normal-list-left"><img src="images/ic-no.png"></div>\
                            <div class="normal-list-middle">\
                                <p><span>'+v.username+'</span><i>'+v.grade_name+v.class_room_name+'</i><label>'+gender+'</label></p>\
                                <p>状态：离寝中</p>\
                            </div>\
                            <div class="edit-list-right">\
                                <span><i class="active" data-status="4" data-id="'+v.id+'"></i>离寝</span>\
                                <span><i data-status="1" data-id="'+v.id+'"></i>在寝</span>\
                            </div>\
                        </li>';
                    });
                }
                if(data.data.list.normal.length >0) { //正常
                    $.each(data.data.list.normal,function(k,v){
                        if(v.gender == 0)
                        {
                            gender = '未填写';
                        }
                        if(v.gender == 1)
                        {
                            gender = '男';
                        }
                        if(v.gender == 2)
                        {
                            gender = '女';
                        }

                        str += '<li class="night-normal-li">\
                            <div class="normal-list-left"><img src="images/ic-yes.png"></div>\
                            <div class="normal-list-middle">\
                                <p><span>'+v.username+'</span><i>'+v.grade_name+v.class_room_name+'</i><label>'+gender+'</label></p>\
                                <p>状态：在寝</p>\
                            </div>\
                            <div class="edit-list-right">\
                                <span><i data-status="4" data-id="'+v.id+'"></i>离寝</span>\
                                <span><i class="active" data-status="1" data-id="'+v.id+'"></i>在寝</span>\
                            </div>\
                        </li>';
                    });
                }
            }
           $('.normal-list').html(str);
        }
    });        
}

//监听微信返回事件
$(function(){
    pushHistory();
    var bool=false;
    setTimeout(function(){
        bool=true;
    },1500);
    window.addEventListener("popstate", function(e) {
        if(bool)
        {
            var data_id = GetQueryString('data-id');
            window.location.href="dormCheck.html?data-id="+data_id;
        }
        pushHistory();
    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    }
});