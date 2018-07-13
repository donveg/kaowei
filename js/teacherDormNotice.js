(function(){
    var calendar6 = new datePicker();
    calendar6.init({
        'trigger': '#Time', /*选择器，触发弹出插件*/
        'type': 'date',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate':'1900-1-1',/*最小日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var arr = calendar6.value.split(' ');
            var ymdArr = arr[0].split('-');

            //$('#addendTime').val(ymdArr[0]+'年'+ymdArr[1]+'月'+ymdArr[2]+'日 '+arr[1])
        },
        'onClose':function(){/*取消时触发事件*/

        }
    });

    var calendar5 = new datePicker();
    calendar5.init({
        'trigger': '#addTime', /*选择器，触发弹出插件*/
        'type': 'date',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate':'1900-1-1',/*最小日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var arr = calendar5.value.split(' ');
            var ymdArr = arr[0].split('-');

            //$('#addendTime').val(ymdArr[0]+'年'+ymdArr[1]+'月'+ymdArr[2]+'日 '+arr[1])
        },
        'onClose':function(){/*取消时触发事件*/

        }
    });

    var calendar3 = new datePicker();
    calendar3.init({
        'trigger': '#addstartTime', /*选择器，触发弹出插件*/
        'type': 'time',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate':'1900-1-1',/*最小日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var arr = calendar3.value.split(' ');
            var ymdArr = arr[0].split('-');

            //$('#addstartTime').val(ymdArr[0]+'年'+ymdArr[1]+'月'+ymdArr[2]+'日 '+arr[1])
        },
        'onClose':function(){/*取消时触发事件*/

        }
    });

    var calendar4 = new datePicker();
    calendar4.init({
        'trigger': '#addendTime', /*选择器，触发弹出插件*/
        'type': 'time',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate':'1900-1-1',/*最小日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var arr = calendar4.value.split(' ');
            var ymdArr = arr[0].split('-');

            //$('#addendTime').val(ymdArr[0]+'年'+ymdArr[1]+'月'+ymdArr[2]+'日 '+arr[1])
        },
        'onClose':function(){/*取消时触发事件*/

        }
    });

    var calendar2 = new datePicker();
    calendar2.init({
        'trigger': '#startTime', /*选择器，触发弹出插件*/
        'type': 'time',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate':'1900-1-1',/*最小日期*/
        'onSubmit':function(e){/*确认时触发事件*/
            var arr = calendar2.value.split(' ');
            var ymdArr = arr[0].split('-');

            //$('#startTime').val(ymdArr[0]+'年'+ymdArr[1]+'月'+ymdArr[2]+'日 '+arr[1])
            
        },
        'onClose':function(){/*取消时触发事件*/
            
        }
    });

    var calendar = new datePicker();
    calendar.init({
        'trigger': '#endTime', /*选择器，触发弹出插件*/
        'type': 'time',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate':'1900-1-1',/*最小日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var arr = calendar.value.split(' ');
            var ymdArr = arr[0].split('-');

            //$('#endTime').val(ymdArr[0]+'年'+ymdArr[1]+'月'+ymdArr[2]+'日 '+arr[1])
        },
        'onClose':function(){/*取消时触发事件*/

        }
    });

    //获取列表
    getList(1);

    //发布
    $('.save-new-notice').click(function(){
        addList('',1);
    });

    //编辑
    $('.notice-list').on('click','li',function(){
        $('.notice-list').hide();
        $('.add-edit-notice-box').show();
        $('.add-edit-notice-box input[name="id"]').val($(this).attr('data-id'));
        $.get(getApiUrl+'/teacher/notice/edit?access_token='+sessionStorage.getItem('access_token')+'&id='+$(this).attr('data-id'),function(data){
            if(data.code == 0){
                var times = new Date(parseInt(data.data.start) * 1000);
                var endTimes = new Date(parseInt(data.data.end) * 1000);
                var mm = times.getMonth()+1;
                $('.edit-title').val(data.data.title);
                $('.Time').val(times.getFullYear()+'-'+mm+'-'+times.getDate());
                $('.startTime').val(times.getHours()+':'+times.getMinutes());
                $('.endTime').val(endTimes.getHours()+':'+endTimes.getMinutes());
                $('.edit-content').val(data.data.content);
            }
        });
    });

    //保存修改
    $('.save-modify').click(function(){
        addList($('input[name="id"]').val(),2);
    });
    //删除
    $('.delete-notice').click(function(){
        if(confirm('确定要删除吗？'))
        {
            var id = $('.add-edit-notice-box input[name="id"]').val();
            $.get(getApiUrl+'/teacher/notice/delete?access_token='+sessionStorage.getItem('access_token')+'&id='+id,function(data){
                if(data.code == 0)
                {
                    window.location.href="teacher-dorm-notice.html";
                }else{
                    alert(data.message)
                }
            });
        }
        
    });
    
    //切换
    $('.add-new-notice').click(function(){
        $('.notice-list').hide();
        $('.add-new-notice-box').show();
    });
})()

function addList(id,status) // 1代表新增  2代表编辑 保存
{
    var date = '';
    var start = '';
    var end = '';
    var title = '';
    var content = '';
    if(status == 1){
        date = $('.addTime').val();
        start = $('.addstartTime').val();
        end = $('.addendTime').val();
        title= $('.edit-notice-title').val(),
        content =$('.new-content').val();
    }else{
        date = $('.Time').val();
        start = $('.startTime').val();
        end = $('.endTime').val();
        title= $('.edit-title').val(),
        content =$('.edit-content').val();
    }
    var data = {
        'id':id,
        'title':title,
        'start':date+start,
        'end':date+end,
        'content':content,
    }
    //var data = $('.add-new-notice-box input').serialize();
    //data += '&'+$('.add-new-notice-box textarea').serialize();

    $.post(getApiUrl+'/teacher/notice/update?access_token='+sessionStorage.getItem('access_token'),data,function(data){
        if(data.code == 0)
        {
            window.location.href="teacher-dorm-notice.html";
        }else{
            alert(data.message)
        }
    });
}

function getList(page) //获取通知列表
{
    var str = '';
    $.get(getApiUrl+'/teacher/notice?access_token='+sessionStorage.getItem('access_token')+'&page='+page,function(data){

        if(data.code == 14){
            $('.maskk,.no-access').show();
            return
        }

        //获取总页数和当前页
        if(data.code == 0){
            if(data.data.currentPage && data.data.totalPage){
                $('.caseud').attr('data-nowPage',data.data.currentPage);
                $('.caseud').attr('data-allPage',data.data.totalPage);
            }
        }

        if(data.data){
            $.each(data.data.list,function(key,value){
                var times = new Date(parseInt(value.start) * 1000);
                var endTimes = new Date(parseInt(value.end) * 1000);
                if(value.status == 1){
                    var mm = times.getMonth()+1;
                    str += '<li data-id="'+value.id+'">\
                        <p class="notice-head"><span>'+times.getFullYear()+'-'+mm+'-'+times.getDate()+' </span><span class="notice-time active">'+times.getHours()+':'+times.getMinutes()+'-'+endTimes.getHours()+':'+endTimes.getMinutes()+'</span></p>\
                        <div>\
                            <span class="notice-list-left"><img src="images/ic-playing.png"/></span>\
                            <span class="notice-list-right">\
                                <p>'+value.title+'<i class="active">'+value.username+'</i></p>\
                                <p>'+value.content+'</p>\
                            </span>\
                        </div>\
                    </li>';
                }else{
                    var mm = times.getMonth()+1;
                    str += '<li data-id="'+value.id+'">\
                        <p class="notice-head"><span>'+times.getFullYear()+'-'+mm+'-'+times.getDate()+' </span><span class="notice-time">'+times.getHours()+':'+times.getMinutes()+'-'+endTimes.getHours()+':'+endTimes.getMinutes()+'</span></p>\
                        <div>\
                            <span class="notice-list-left"><img src="images/ic-overdue.png"/></span>\
                            <span class="notice-list-right">\
                                <p>'+value.title+'<i>'+value.username+'</i></p>\
                                <p>'+value.content+'</p>\
                            </span>\
                        </div>\
                    </li>';
                }

            });
        }

        $('.notice-list>ul').html(str);
    });
}

//记录状态
var state=true;
//滚动条滚动的时候
$(window).scroll(function(){
    //获取当前加载更多按钮距离顶部的距离
    var bottomsubmit = $('.caseud').offset().top;
    //获取当前页面底部距离顶部的高度距离
    var nowtop = $(document).scrollTop()+$(window).height();
    //获取当前页数，默认第一页
    var now = $('.caseud').attr('data-nowPage');
    //获取总页数，PHP分页的总页数
    var num = $('.caseud').attr('data-allPage');
    //当当前页面的高度大于按钮的高度的时候开始触发加载更多数据
    if(nowtop>bottomsubmit){
        $('.caseud').show();
        //如果为真继续执行，这个是用于防止滚动获取过多的数据情况
        if(state==true){
            //执行一次获取数据并停止再进来获取数据
            state=false;

            setTimeout(function(){
                //当前页数++
                now++;
                //记录当前为第二页
                $('.caseud').attr('data-nowPage',now);
                $.ajax({
                    //通过ajax传页数参数获取当前页数的数据
                    url:getApiUrl+'/teacher/notice?access_token='+sessionStorage.getItem('access_token')+'&page='+$('.caseud').attr('data-nowPage'),
                    type:'GET',
                    cache:false,
                    dataType:"html",
                    success:function(data){
                        var data = JSON.parse(data);
                        var str = '';
                        $.each(data.data.list,function(key,value){
                            var times = new Date(parseInt(value.start) * 1000);
                            var endTimes = new Date(parseInt(value.end) * 1000);
                            if(value.status == 1){
                                var mm = times.getMonth()+1;
                                str += '<li data-id="'+value.id+'">\
                                <p class="notice-head"><span>'+times.getFullYear()+'-'+mm+'-'+times.getDate()+' </span><span class="notice-time active">'+times.getHours()+':'+times.getMinutes()+'-'+endTimes.getHours()+':'+endTimes.getMinutes()+'</span></p>\
                                <div>\
                                    <span class="notice-list-left"><img src="images/ic-playing.png"/></span>\
                                    <span class="notice-list-right">\
                                        <p>'+value.title+'<i class="active">'+value.username+'</i></p>\
                                        <p>'+value.content+'</p>\
                                    </span>\
                                </div>\
                            </li>';
                                    }else{
                                        var mm = times.getMonth()+1;
                                        str += '<li data-id="'+value.id+'">\
                                <p class="notice-head"><span>'+times.getFullYear()+'-'+mm+'-'+times.getDate()+' </span><span class="notice-time">'+times.getHours()+':'+times.getMinutes()+'-'+endTimes.getHours()+':'+endTimes.getMinutes()+'</span></p>\
                                <div>\
                                    <span class="notice-list-left"><img src="images/ic-overdue.png"/></span>\
                                    <span class="notice-list-right">\
                                        <p>'+value.title+'<i>'+value.username+'</i></p>\
                                        <p>'+value.content+'</p>\
                                    </span>\
                                </div>\
                            </li>';
                            }

                        });
                    //把通过php处理的html和数据，写入容器底部
                    $('.notice-list ul').append(str);
                    //如果当前页大于等于总页数就提示没有更多数据
                    if(now>=num){
                        $('.caseud a').text('没有更多数据了哦。。。');
                        //并把状态设置为假，下次下滑滚动时不再通过ajax获取数据
                        state=false;
                    }else{
                       // 否则继续
                        state=true;
                    }
                },
                error:function(){
                    $('.caseud a').text('加载错误,请刷新页面！');
                }
            });
        },500);
    }
}
});

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
              $('.add-edit-notice-box').hide();
              $('.add-new-notice-box').hide();
              $('.notice-list').show();
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