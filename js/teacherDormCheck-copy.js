garname='';claname='';kename='';
//饼状图展示
flagName = [];
flagJson = new Array;
flagBg = [];
(function(){

    $.ajaxSetup({
        async: false
    });
    $.get(getApiUrl+'/teacher/dormitory/statistics?access_token='+sessionStorage.getItem('access_token'),function(data){
        var str = '';
        if(data.code == 0)
        {
            $.each(data.data.list,function(k,v){
                if(k == 0)
                {
                    str += '<option value="'+v.class_room_id+'" data-id="'+v.mac+'" selected="selected">'+v.class_room_name+'</option>';
                }else{
                    str += '<option value="'+v.class_room_id+'" data-id="'+v.mac+'">'+v.class_room_name+'</option>';
                    
                }
            });

            $('.teach-my-dorm-title select').html(str);
        }
    });

    $.ajaxSetup({
        async: true
    });
    setExhibition(0,0,0,0);
    //选择具体班级和年级的筛选信息
    $('.class-info-list').click(function(){
        $('.teach-my-schedule').hide();
        $('.screening-course').show();
        $.get(getApiUrl+'/teacher/schedule/grade?access_token='+sessionStorage.getItem('access_token'),function(data){
            if(data.code == 1){
                $('.maskk,.no-access').show();
                $('.change-menu,.teach-my-schedule,.date-schedule').hide();
               // showError(1,'您的账号暂未开通考勤、排课服务。 请联系本校教师或拨打服务热线','');return;
            }
            var str = '';
            $.each(data.data,function(k,v){
                if(garname && (garname == v.id)){
                    str += '<option value="'+v.id+'" selected="selected">'+v.name+'</option>';
                }else{
                    str += '<option value="'+v.id+'">'+v.name+'</option>';
                }
                
            });

            $('.grade').html(str);
            getClassData();
            getLesson();
        });
    });

    //筛选课程消息保存按钮
    $('.button').click(function(){
        $('.teach-my-schedule').show();
        $('.screening-course').hide();
        setInfo();
    });

    $('.grade').change(function(){
        getClassData();
    });
    $('.class').change(function(){
        getLesson();
    });

    date = parseInt(date);
    
    if(date <= 1){
        month = month-1;
        date = DayNumOfMonth(year,month);
    // date = 1;
    }else{
        date -= 1;
    }

    setDate(year,month,date);

    
    //统计考勤状态详情列表展开和收缩
    $('.be-late').click(function(){
        $('.be-late ul').toggle();
        $(this).find('span').toggleClass('active');
    });
    $('.be-miss').click(function(){
        $('.be-miss ul').toggle();
        $(this).find('span').toggleClass('active');
    })
    $('.be-tui').click(function(){
        $('.be-tui ul').toggle();
        $(this).find('span').toggleClass('active');
    });


    $('.teach-dorm-title-select').change(function(){
        var id = $('.teach-my-dorm-title option:selected').attr('data-id');
        websocket.send(JSON.stringify({'bind' : id}));
    });

})()

//楼层显示隐藏
$('.floor-list-ul').on('click','.part-one',function(){
    if($(this).parent().find('.room-number-list').css("display")==='none' ){
        $('.floor-list-ul .part-one i').removeClass('active');
        $(this).find('i').addClass('active');
        $(this).parent().find('.part-three label').addClass('active');
    }else{
        $('.floor-list-ul .part-one i').removeClass('active');
    }
    $(this).parent().find('div').toggle();
    $('.floor-list-ul').children('li').not($(this).parent()).find('div').hide();
});


//实时考勤寝室列表和寝室详情切换
$('.floor-list-ul').on('click','.room-name-list',function(){
    $('.floor-list-ul').hide();
    $('.floor-list-detail').show();

    var l_name = $(this).parents('li').children('p').find('span').text();
    var s_name = $(this).parents('.room-number-list').children('p').children('span').eq(0).text();
    var s_num = $(this).parents('.room-number-list').children('p').children('span').eq(2).text();

    var id = $(this).parents('div').attr('data-id');
    var bid = $('.teach-my-dorm-title option:selected').val();
    $.get(getApiUrl+'/teacher/dormitory/search?access_token='+sessionStorage.getItem("access_token"),{'bid':id,'did':bid},function(data){
        var str = '';
        if(data.code == 0)
        {
            str += '<p>'+l_name+s_name+'<span>'+s_num+'</span></p><table>\
            <thead>\
                <tr><th>姓名</th><th>年级</th><th>班级</th><th>状态</th></tr>\
            </thead>\
            <tbody>';
            $.each(data.data,function(k,v){
                if(v.status != 0)
                {
                    str += '<tr><td>'+v.username+'</td><td>'+v.grade_name+'</td><td>'+v.class_room_name+'</td><td class="active">在寝</td></tr>';
                }else{
                    str += '<tr><td>'+v.username+'</td><td>'+v.grade_name+'</td><td>'+v.class_room_name+'</td><td>离寝</td></tr>';                    
                }

            });

            str += ' </tbody></table>';
        }

        $('.floor-list-detail').html(str);
    });

});


//宿舍显示隐藏
$('.floor-list-ul').on('click','.part-three',function(){
    if($(this).parents('.room-number-list').find('.room-name-list').css("display")==='none' ){
        $(this).find('label').addClass('active');
    }else{
        $(this).find('label').removeClass('active');
    }
    $(this).parents('.room-number-list').find('.room-name-list').toggle();
});

wsUri = getSockUrl;
websocket = new WebSocket(wsUri);
websocket.onopen = function(evt) {
    var id = $('.teach-my-dorm-title option:selected').attr('data-id');
    websocket.send(JSON.stringify({'bind' : id}));
    //onOpen(evt)
};
websocket.onclose = function(evt) {
    //onClose(evt)
};
websocket.onmessage = function(evt) {
    $('.maskk,.no-data').hide();
    getListData(JSON.parse(evt.data));
};
websocket.onerror = function(evt) {
    $('.maskk,.no-data').show();
    //onError(evt)
};

function uploadPage(){
    window.location.reload();
}

function getListData(data)
{
    if(!data.data)
        return;
    var str = '';
    $.each(data.data.floor,function(k,v){
        str += '<li><p class="part-one"><span>'+ v.floor +'楼</span> ('+v.in+'/'+v.total+')<i></i></p>';
        $.each(v.bedroom,function(b_k,b_v){
            str += '<div class="room-number-list" data-id="'+b_v.id+'">\
                        <p class="part-two"><span>'+b_v.name+'室</span>\
                            <span class="already-people-num">';
                                for(var i=0;i<b_v.in;i++){
                                    str += '<i class="active"></i>';
                                }
                                for(var i=0;i<b_v.total-b_v.in;i++){
                                    str += '<i></i>';
                                }
                            str += '</span><span class="part-three">'+b_v.in+'/'+b_v.total+' <label></label></span>\
                        </p>';


            if(b_k == 0)
            {
                str += '<ul class="room-name-list">';
            } else {
                str += '<ul class="room-name-list" style="display:none">';
            }
            
            $.each(b_v.list,function(l_k,l_v){
                if((l_v.status == 1 ) || (l_v.status == 2)){
                    str += '<li class="active" data-uid="'+l_v.user_id+'">'+l_v.username+'</li>';
                }else{
                    str += '<li data-uid="'+l_v.user_id+'">'+l_v.username+'</li>';
                }
                
            });

            str += '</ul></div>';
        });

        str += '</li>';

    });

    $('.floor-list-ul').html(str);
    setDivShow(0);
}


function setDivShow(state)
{
    if(state == 0)
    {
        $('.floor-list-ul li').not($('.floor-list-ul li').eq(0)).find('div').hide();
        $('.floor-list-ul li').eq(0).children('p').find('i').addClass('active');
        $('.floor-list-ul li').eq(0).find('.room-number-list').eq(0).find('.part-three label').addClass('active');
    }
}

//日期选择
var calendar = new datePicker();
calendar.init({
    'trigger': '.teach-my-title', /*按钮选择器，用于触发弹出插件*/
    'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
    'minDate':'1900-1-1',/*最小日期*/
    'maxDate':'2100-12-31',/*最大日期*/
    'onSubmit':function(){/*确认时触发事件*/
        var dateArr = calendar.value.split('-');
        $('.lesson option[value="0"]').prop('selected','selected');
        setDate(dateArr[0],dateArr[1],dateArr[2]);

    },
    'onClose':function(){/*取消时触发事件*/
    }
});


function setInfo()
{
    var gr = $('.grade option:selected').text();
    var cl = $('.class option:selected').text();
    var gid = $('.grade option:selected').val();
    var cid = $('.class option:selected').val();
    var da = year+'-'+month+'-'+date;
    $('.info').html('<span>'+gr+'·'+cl+'</span>');


    $.get(getApiUrl+'/teacher/dormitory?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid+'&date='+da,function(data){
        if(data.code == 1){
           // showError(1,'您的账号暂未开通考勤、排课服务。 请联系本校教师或拨打服务热线','');return;
           $('.maskk,.no-access').show();
           $('.change-menu,.teach-my-schedule').hide();
        }
        if(data.code == 0){
            allNum = 0;zcnum=0;wgnum=0;z_cnum=0;w_gnum=0;ssnum=0;sdnum=0;
            $('.kuang').html('');$('.chi').html('');$('.zao').html('');
            if(data.data){
                $.each(data.data,function(k,v){
                    if(v.name == '正常'){
                        allNum += v.data.length;
                        zcnum = v.data.length;
                        sdnum += v.data.length;
                    }
                    if(v.name == '晚归'){
                        allNum += v.data.length;
                        sdnum += v.data.length;
                        wgnum = v.data.length;

                        var str = '';
                        $.each(v.data,function(d_k,d_v){
                            str += '<li>'+d_v.username+'</li>';
                        });

                        $('.chi').html(str);
                    }
                    if(v.name == '早出'){
                        allNum += v.data.length;
                        z_cnum = v.data.length;

                        var str = '';
                        $.each(v.data,function(d_k,d_v){
                            str += '<li>'+d_v.username+'</li>';
                        });

                        $('.kuang').html(str);
                    }
                    if(v.name == '未归'){
                        w_gnum = v.data.length;
                        allNum += v.data.length;

                        var str = '';
                        $.each(v.data,function(d_k,d_v){
                            str += '<li>'+d_v.username+'</li>';
                        });

                        $('.zao').html(str);
                    }
                    if(v.name == '不在宿舍里'){
                        allNum = v.data.length;
                        

                    }
                });
            }else{

            }

            $('.num i').eq(0).text(allNum);
            $('.num i').eq(1).text(sdnum);
            setExhibition(zcnum,wgnum,z_cnum,w_gnum);
        }
    });
}
function getClassData(){
    var gid = $('.grade option:selected').val();
    garname = gid;
    $.get(getApiUrl+'/teacher/schedule/class-room?access_token='+sessionStorage.getItem('access_token')+'&id='+gid,function(data){
        if(data.code == 1){
            showError(1,'您的账号暂未开通考勤、排课服务。请联系本校教师或拨打服务热线','');return;
        }
        var str = '<option value="0">请选择</option>';
        $.each(data.data,function(k,v){
            if(claname && (claname == v.id)){
                str += '<option value="'+v.id+'" selected="selected">'+v.name+'</option>';
            }else{
                str += '<option value="'+v.id+'">'+v.name+'</option>';
            }
        });
        $('.class').html(str);
    });
}
function getLesson() {
    var gid = $('.grade option:selected').val();
    var cid = $('.class option:selected').val();
    claname = cid;
    var da = year+'-'+month+'-'+date;
    $.get(getApiUrl+'/teacher/attendance/lesson?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid+'&date='+da,function(data){
        if(data.code == 1){
            showError(1,'您的账号暂未开通考勤、排课服务。请联系本校教师或拨打服务热线','');return;
        }
        var str = '<option value="0">请选择</option>';
        $.each(data.data,function(k,v){
            if(kename && (kename == v.lesson)){
                str += '<option value="'+v.lesson+'" selected="selected">第'+ v.lesson+'节 &nbsp;&nbsp;'+v.course+'</option>';
            }else{
                str += '<option value="'+v.lesson+'">第'+ v.lesson+'节 &nbsp;&nbsp;'+v.course+'</option>';
            }
            
        });
        $('.lesson').html(str);
    });
}
function setDate(y,m,d) {
    year = y;
    month = m;
    date = d;
    $('.teach-my-title').html(m+'月'+d+'日 '+getWeek(y,m-1,d)+'<i></i>');
    setInfo();
}


function setExhibition(a,b,c,d){
    classification(a,b,c,d);
    var myChart = echarts.init(document.getElementById('brokenLine'));
    option = {
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'left',
            data: flagName,
        },
        series : [
            {
                type: 'pie',
                radius : '72%',
               // stillShowZeroSum:flagBool,
                center: ['50%', '60%'],
                label: {
                    normal: {
                        position: 'inner',
                    }
                },
                data:flagJson,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
        color: flagBg,
    };
    
    if(a !=0 || b!=0 || c!=0 || d!= 0){
        var opt = option.series[0];
        lineHide(opt);
    }
    
    //数据为零时隐藏线段
    function lineHide(opt) {
        jQuery.each(opt.data, function (i, item) {
            if (item.value == 0) {
                item.itemStyle.normal.labelLine.show = false;
                item.itemStyle.normal.label.show = false;
            }
        });
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
function classification(a,b,c,d){
    if( a == 0 && b == 0 && c == 0 && d == 0){ //全没数据
        flagName[0] = '没数据';
        flagJson = [
            {value:0, name:'没数据'},
        ];
        flagBg[0] = ' #999';
    }else{ //有数据
        flagName = ['正常','晚归','早出','未归'];
        flagJson =[
            //使用该种方法记得要加上itemStyle属性，不然会找不到show属性报错的
            {
                value:a, 
                name:'正常',
            itemStyle:{
               normal:{
                    label:{
                        show: true,
                    },
                    labelLine: {
                        show: true
                    }
               }
            }},
            {value:b, name:'晚归',itemStyle:{
               normal:{
                    label:{
                        show: true,
                    },
                    labelLine: {
                        show: true
                    }
               }
            }},
            {value:c, name:'早出',itemStyle:{
               normal:{
                    label:{
                        show: true,
                    },
                    labelLine: {
                        show: true
                    }
               }
            }},
            {value:d, name:'未归',itemStyle:{
               normal:{
                    label:{
                        show: true,
                    },
                    labelLine: {
                        show: true
                    }
               }
            }}
        ];
        flagBg = [' #3699ED','#FAD48F','#FBA2AA','#70CBDC'];
    }
}

//底部导航切换
$('.change-menu span').click(function(){
    $('.change-menu span').removeClass('active');
    $(this).addClass('active');
    if($(this).hasClass('total')){
        $('.teach-my-schedule').css('visibility','visible');
        $('.actual-dorm-data').css('display','none');
    }else{
        $('.actual-dorm-data').css('display','inline-block');
        $('.teach-my-schedule').css('visibility','hidden');
    }
});


// 点击空白处隐藏弹出窗口
$(document).click(function(event){
    var _con = $('#modify-stu-info');
    if(!_con.is(event.target) && _con.has(event.target).length === 0){
        $('.mask ,.modify-stu-info').fadeOut();
    }
});