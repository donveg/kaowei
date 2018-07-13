garname='';claname='';kename='';
new_type = 2; //考勤模式  1代表学校考勤
globalData = {};
globalSemester =[];
globalTotalWay = 1;
globalStart = '';
globalEnd = '';
(function(){

    $.ajaxSetup({
        async: false,  
    });
   // setExhibition(100,50,30,20);
    $('.class-info-list').click(function(){
        $('.teach-my-schedule').hide();
        $('.screening-course').show();
        $.get(getApiUrl+'/teacher/schedule/grade?access_token='+sessionStorage.getItem('access_token'),function(data){
            if(data.code == 1 || data.code == 14){
                $('.maskk,.no-access').show();
                $('.change-menu,.teach-my-schedule,.date-schedule').hide();return;
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

    $('.button').click(function(){
        $('.teach-my-schedule').show();
        $('.screening-course').hide();
        if(globalTotalWay == 1){
            setInfo();
        }else{
            setInfo2(globalStart,globalEnd);
        }
    });

    $('.change-chart').click(function(){
        if($(this).attr('data-type') == '1'){
            $(this).attr('data-type',2);
        }else{
            $(this).attr('data-type',1);
        }
        if(globalTotalWay == 1){
            setInfo();
        }else{
            setInfo2(globalStart,globalEnd);
        }
    });

    $('.grade').change(function(){
        getClassData();
    });
    $('.class').change(function(){
        getLesson();
    });

    setDate(year,month,date);

    if(new_type ==1 )
    {
        document.title = '学校考勤'; //head头部的title
        $('.change-chart').hide();
        $('.screening-course p').eq(2).hide();
        $('.seating-chart-box').hide();
        $('.change-chart').attr('data-type',2);
        $('.class-info-list .info').html('<span>请选择·请选择</label>');
        //setInfo();
        if(globalTotalWay == 1){
            setInfo();
        }else{
            setInfo2();
        }
    }else{
        document.title = '教室考勤'; //head头部的title
    }

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
    })

})()

//点击修改状态
//$('.schedule-table').on('click','img',function(event){
//    event.stopPropagation();
//    $('.modify-stu-info div label').removeClass('active');
//    $('.modify-stu-info .time').text('');
//    var type = $(this).parent().attr('data-type');
//    var time = $(this).parent().attr('data-time');
//    var name = $(this).parent().attr('data-name');
//    var state = $(this).parent().attr('data-status');
//    var id = $(this).parent().attr('data-id');
//
//    var date = new Date(time*1000);
//    if(parseInt(type) == 1){
//        type = '系统';
//    }else if(parseInt(type) == 2){
//        type = '人工';
//    }
//    $('.info-name').text(name);
//    if(state == 1){
//        var obj = $('.a .time');
//        var checkIcon = $('.a label');
//    }
//    if(state == 2){
//        var obj = $('.b .time');
//        var checkIcon = $('.b label');
//    }
//    if(state == 3){
//        var obj = $('.c .time');
//        var checkIcon = $('.c label');
//    }
//    if(state == 4){
//        var obj = $('.d .time');
//        var checkIcon = $('.d label');
//    }
//
//    $('.modify-stu-info .checked-icon').attr('data-id',id);
//    var month = parseInt(date.getMonth())+1;
//    checkIcon.addClass('active');
//    obj.text('（'+month+'月'+date.getDate()+'日 '+date.getHours()+':'+date.getMinutes()+' '+type+'记录）');
//    $('.mask,.modify-stu-info').show();
//    setInfo();
//});

//修改页面列表内容显示 1:正常 2:迟到  3:早退  4:旷课
globalSelectVal = null;
globalJsonObj = [];
globalStatus = [{1:'正常'},{2:'迟到'},{3:'早退'},{4:'旷课'}];
globalSelectText = null;
function chooseStatus(val){
    var selectVal = null;
    var selectText = $(".change-status").find("option:selected").text();
    globalSelectText = selectText;
    if(val == 999){ //默认进来的先筛选正常的
        selectVal = 1;
        globalSelectVal = selectVal;
    }else if(val == 0){ //下拉选择的
        selectVal = $('.change-status').val();
        globalSelectVal = selectVal;
    }else{
        var la = $('.lesson option:selected').val();
        var gid = $('.grade option:selected').val();
        var cid = $('.class option:selected').val();
        var da = year+'-'+month+'-'+date;
        $.get(getApiUrl+'/teacher/attendance/statistics?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid+'&date='+da+'&lesson='+la,function(data){
            globalData = data.data.list.list;
            globalSemester = data.data.semester; //学期列表
            globalChangeSelect = data.data.year;//学年列表
            selectVal = val;
        });
    }
    $('.change-selected-status li').removeClass('active');

    var jsonObj = [];
    var str = '';
    $.each(globalData,function(k,v){
        if( v.s_status == selectVal ){
            jsonObj.push({"id":v.id,"name":v.username,"status": v.s_status});
        }
        if(selectVal == 4 ){ //处理不在班级里s_status:0 的为旷课状态
            if(v.s_status == 0){
                jsonObj.push({"id":v.id,"name":v.username,"status": v.s_status});
            }
        }
    });
    globalJsonObj = jsonObj;
    var statusStr = '';
    $.each(globalStatus,function(m,n){
        var ss = m+1;
        $.each(n,function(m1,n1){
            if(ss == selectVal){
                statusStr += '<li class="active" data-status="'+ss+'" >'+n1+'</li>';
            }else{
                statusStr += '<li data-status="'+ss+'">'+n1+'</li>';
            }
        })
    })
    if(jsonObj.length == 0){
        $('.modify-check-status-list').html('<img src="../images/nodataImg.png" class="no-data"/><div class="no-data-text">没有数据呢！</div>');
        return;
    }else{
        $.each(jsonObj,function(k1,v1){
            str += '<div class="be-selected-status"><p>'+v1.name+'<span class="active"></span><label>'+selectText+'</label></p>\
            <ul class="change-selected-status" data-id = "'+v1.id+'">'+statusStr+'</ul></div>';
        })
    }
    $('.modify-check-status-list').html(str);
}

//点击展开和收缩修改状态列表
$('.modify-check-status-list').on('click','.be-selected-status p',function(){
    $(this).parent().find('.change-selected-status').toggle();
    $(this).find('span').toggleClass('active');
});
//输入框筛选
$('.search-btn').click(function(){
    var name = $('.do-search').val();
    var string = '';
    var  vStr = '';
    if(name){
        $.each(globalStatus,function(m,n){
            var ss = m+1;
            $.each(n,function(m1,n1){
                if(ss == globalSelectVal){
                    vStr += '<li class="active" data-status="'+ss+'" >'+n1+'</li>';
                }else{
                    vStr += '<li data-status="'+ss+'">'+n1+'</li>';
                }
            })
        })
        if(globalJsonObj.length == 0){
            $('.modify-check-status-list').html('<img src="../images/nodataImg.png" class="no-data"/><div class="no-data-text">没有数据呢！</div>');
            return;
        }else{
            $.each(globalJsonObj,function(m,n){
                if(n.name == name && n.status == globalSelectVal){
                    string +='<div class="be-selected-status"><p>'+n.name+'<span class="active"></span><label>'+globalSelectText+'</label></p>\
                    <ul class="change-selected-status" data-id = "'+n.id+'">'+vStr+'</ul></div>';
                }
            });
        }
        if(string == '' || string == null){
            $('.modify-check-status-list').html('<img src="../images/nodataImg.png" class="no-data"/><div class="no-data-text">没有该学生呢！</div>');
            return;
        }
        $('.modify-check-status-list').html(string);
    }else{
        chooseStatus(globalSelectVal);
    }
});
//跳转修改考勤状态页面
$('.modify-check-status span').click(function(){
    $('.teach-my-schedule').hide();
    $('.modify-check-status-box').show();

    chooseStatus(999); //默认进去值设为1正常
});

$('.modify-check-status-list').on('click','.change-selected-status li',function(){
    $(this).parent().find('li').removeClass('active');
    $(this).addClass('active');
    var id = $(this).parent().attr('data-id');
    var status = $(this).attr('data-status');
    var data = getApi(getApiUrl+'/teacher/attendance/change?access_token='+sessionStorage.getItem('access_token'),{'id':id,'status':status});
    chooseStatus(globalSelectVal);
});

//$('.modify-stu-info').on('click','.checked-icon',function(){
//    $('.modify-stu-info div label').removeClass('active');
//    $(this).parent().find('label').addClass('active');
//    $('.mask,.modify-stu-info').hide();
//    var id = $(this).attr('data-id');
//    var status = $(this).attr('data-status');
//
//    getApi(getApiUrl+'/teacher/attendance/change?access_token='+sessionStorage.getItem('access_token'),{'id':id,'status':status});
//    setInfo();
//});
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

//调用选择年月插件
var calendar2 = new datePicker();
calendar2.init({
    'trigger': '.teach-my-title-month', /*按钮选择器，用于触发弹出插件*/
    'type': 'ym',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
    'minDate':'1900-1-1',/*最小日期*/
    'maxDate':'2100-12-31',/*最大日期*/
    'onSubmit':function(){/*确认时触发事件*/
        var dateArr = calendar2.value.split('-');
        $('.lesson option[value="0"]').prop('selected','selected');
        setDateMonth(dateArr[0],dateArr[1]);
    },
    'onClose':function(){/*取消时触发事件*/
    }
});

function changeTotalType(){ //统计类型切换
    var typeVal = $(".change").val(); // 1:日统计 2:月统计 3:学期统计 4:学年统计
    if(typeVal == 1){
        globalTotalWay = 1;
        setDate(year,month,date);
        $('.teach-my-title').show();
        $('.teach-my-title-month,.teach-my-title-term,.teach-my-title-year').hide();
    }else if(typeVal == 2){
        globalTotalWay = 2;
        setDateMonth(year,month);
        $('.teach-my-title-month').show();
        $('.teach-my-title,.teach-my-title-term,.teach-my-title-year').hide();
    }else if(typeVal == 3){
        globalTotalWay = 2;
        var ss = '';
        var value ='';
        var startT ='';
        var endT ='';
        var timestamp =  parseInt(new Date().getTime()/1000);
        $.each(globalSemester,function(k,v){
            if(timestamp < toTimeStamp(v.end) && timestamp > toTimeStamp(v.start)){
                value = k;
                startT = v.start;
                endT = v.end;
            }
            ss += '<option data-start="'+ v.start+'" data-end="'+ v.end+'" value="'+k+'">'+ v.name+'</option>';
        });
        $('.semesterSelect').html(ss);
        $('.semesterSelect option[value='+value+']').attr('selected',true);
        $('.teach-my-title-term').show();
        $('.teach-my-title-month,.teach-my-title,.teach-my-title-year').hide();
        setInfo2(startT,endT);
    }else if(typeVal == 4){
        globalTotalWay = 2;
        var ss = '';
        var value ='';
        var startT ='';
        var endT ='';
        var timestamp =  parseInt(new Date().getTime()/1000);
        $.each(globalChangeSelect,function(k,v){
            if(timestamp < toTimeStamp(v.end) && timestamp > toTimeStamp(v.start)){
                value = k;
                startT = v.start;
                endT = v.end;
            }
            ss += '<option data-start="'+ v.start+'" data-end="'+ v.end+'" value="'+k+'">'+ v.name+'</option>';
        });
        $('.yearChangeSelect').html(ss);
        $('.yearChangeSelect option[value='+value+']').attr('selected',true);

        $('.teach-my-title-year').show();
        $('.teach-my-title-month,.teach-my-title-term,.teach-my-title').hide();
        setInfo2(startT,endT);
    }
}
//时间段转时间戳
function toTimeStamp(time){
    time = time.substring(0,19);
    time = time.replace(/-/g,'/');
    var timestamp = new Date(time).getTime();
    return parseInt(timestamp/1000);
}
//学期列表切换
function changeSemester(){
    var start = $(".semesterSelect").find("option:selected").attr('data-start');
    var end = $(".semesterSelect").find("option:selected").attr('data-end');
    $('.lesson option[value="0"]').prop('selected','selected');
    setInfo2(start,end);
}

//学年列表切换
function changeYearSelect(){
    var start = $(".yearChangeSelect").find("option:selected").attr('data-start');
    var end = $(".yearChangeSelect").find("option:selected").attr('data-end');
    $('.lesson option[value="0"]').prop('selected','selected');
    setInfo2(start,end);
}
function setInfo(){
    var gr = $('.grade option:selected').text();
    var cl = $('.class option:selected').text();
    var xu = $('.lesson option:selected').text();
    var la = $('.lesson option:selected').val();
    kename = la;
    var gid = $('.grade option:selected').val();
    var cid = $('.class option:selected').val();

    var da = year+'-'+month+'-'+date;

    if(new_type != 1)
    {
        $('.info').html('<span>'+gr+'·'+cl+' | '+xu+'</span><label>（第'+la+'节）</label>');
    }else{
        $('.info').html('<span>'+gr+'·'+cl+'</label>');        
    }

    $.get(getApiUrl+'/teacher/attendance/statistics?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid+'&date='+da+'&lesson='+la,function(data){

        if(data.code == 1 || data.code == 14){
           // showError(1,'您的账号暂未开通考勤、排课服务。 请联系本校教师或拨打服务热线','');return;
           $('.maskk,.no-access').show();
           $('.change-menu,.teach-my-schedule').hide();
        }
        if(data.code == 0){
            new_type = data.data.type;
            globalSemester = data.data.semester; //学期列表
            globalChangeSelect = data.data.year;//学年列表
            allNum = 0;num = 0;chi = 0;que = 0;tui=0;shitao=0;
            $('.kuang').html('');$('.chi').html('');$('.zao').html('');
            if(data.data.list.list.length == 0){
                $('.no-data-box').html('<img src="../images/nodataImg.png" class="no-data"/><div class="no-data-text">暂时没有数据呢！</div>');
                $('.schedule-table').hide();
                $('.modify-check-status,.be-late,.be-miss,.be-tui').hide();
                $('.num i').eq(0).text(0);
                $('.num i').eq(1).text(0);
                //return;
            }else{

                globalData = data.data.list.list;

                $('.no-data-box').html('');
                $('.schedule-table').show();
                $('.modify-check-status,.be-late,.be-miss,.be-tui').show();
                $.each(data.data.list.statistics,function(k,v){
                    if(v.name == '正常'){
                        allNum += v.count;
                        num += v.count;
                        shitao += v.count;
                    }
                    if(v.name == '缺勤' || v.name == '不在班级里'){
                        allNum += v.count;
                        que += v.count;

                        var str = '';
                        $.each(v.username,function(q,w){
                            str += '<li>'+w+'</li>';
                        });
                        $('.kuang').html(str).hide();

                    }
                    if(v.name == '迟到'){
                        allNum += v.count;
                        chi += v.count;
                        shitao += v.count;
                        var str = '';
                        $.each(v.username,function(q,w){
                            str += '<li>'+w+'</li>';
                        });
                        $('.chi').html(str).hide();
                    }
                    if(v.name == '早退'){
                        tui += v.count;
                        allNum += v.count;
                        var str = '';
                        $.each(v.username,function(q,w){
                            str += '<li>'+w+'</li>';
                        });
                        $('.zao').html(str).hide();
                    }
                });
            }

            $('.num i').eq(0).text(allNum);
            $('.num i').eq(1).text(shitao);

            if($('.change-chart').attr('data-type') == 1){
                $('.change-chart span').html('饼状图');
                $('.seating-chart-box').css('visibility','visible');
                $('.bing-box').css('visibility','hidden');
                $('.normal-head-span').text(num);
                $('.late-head-span').text(chi);
                $('.leaving-head-span').text(tui);
                $('.miss-head-span').text(que);
                setList(data.data.list.list);
            }else{
                $('.change-chart span').html('座位图');
                $('.seating-chart-box').css('visibility','hidden');
                $('.bing-box').css('visibility','visible');
                setExhibition(num,chi,que,tui);
            }
        }
    });
}
function setInfo2(start,end){
    var gr = $('.grade option:selected').text();
    var cl = $('.class option:selected').text();
    var xu = $('.lesson option:selected').text();
    var la = $('.lesson option:selected').val();
    kename = la;
    var gid = $('.grade option:selected').val();
    var cid = $('.class option:selected').val();

    var da = year+'-'+month+'-'+date;

    if(new_type != 1)
    {
        $('.info').html('<span>'+gr+'·'+cl+' | '+xu+'</span><label>（第'+la+'节）</label>');
    }else{
        $('.info').html('<span>'+gr+'·'+cl+'</label>');
    }

    $.get(getApiUrl+'/teacher/attendance/statistics?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid+'&start='+start+'&end='+end+'&lesson='+la,function(data){

        if(data.code == 1 || data.code == 14){
            // showError(1,'您的账号暂未开通考勤、排课服务。 请联系本校教师或拨打服务热线','');return;
            $('.maskk,.no-access').show();
            $('.change-menu,.teach-my-schedule').hide();
        }
        if(data.code == 0){
            new_type = data.data.type;
            globalSemester = data.data.semester; //学期列表
            allNum = 0;num = 0;chi = 0;que = 0;tui=0;shitao=0;
            $('.kuang').html('');$('.chi').html('');$('.zao').html('');
            if(data.data.list.list.length == 0){
                $('.no-data-box').html('<img src="../images/nodataImg.png" class="no-data"/><div class="no-data-text">暂时没有数据呢！</div>');
                $('.schedule-table').hide();
                $('.modify-check-status,.be-late,.be-miss,.be-tui').hide();
                $('.num i').eq(0).text(0);
                $('.num i').eq(1).text(0);
                //return;
            }else{

                globalData = data.data.list.list;

                $('.no-data-box').html('');
                $('.schedule-table').show();
                $('.modify-check-status,.be-late,.be-miss,.be-tui').show();
                $.each(data.data.list.statistics,function(k,v){
                    if(v.name == '正常'){
                        allNum += v.count;
                        num += v.count;
                        shitao += v.count;
                    }
                    if(v.name == '缺勤' || v.name == '不在班级里'){
                        allNum += v.count;
                        que += v.count;

                        var str = '';
                        $.each(v.username,function(q,w){
                            str += '<li>'+w+'</li>';
                        });
                        $('.kuang').html(str).hide();

                    }
                    if(v.name == '迟到'){
                        allNum += v.count;
                        chi += v.count;
                        shitao += v.count;
                        var str = '';
                        $.each(v.username,function(q,w){
                            str += '<li>'+w+'</li>';
                        });
                        $('.chi').html(str).hide();
                    }
                    if(v.name == '早退'){
                        tui += v.count;
                        allNum += v.count;
                        var str = '';
                        $.each(v.username,function(q,w){
                            str += '<li>'+w+'</li>';
                        });
                        $('.zao').html(str).hide();
                    }
                });
            }

            $('.num i').eq(0).text(allNum);
            $('.num i').eq(1).text(shitao);

            if($('.change-chart').attr('data-type') == 1){
                $('.change-chart span').html('饼状图');
                $('.seating-chart-box').css('visibility','visible');
                $('.bing-box').css('visibility','hidden');
                $('.normal-head-span').text(num);
                $('.late-head-span').text(chi);
                $('.leaving-head-span').text(tui);
                $('.miss-head-span').text(que);
                setList(data.data.list.list);
            }else{
                $('.change-chart span').html('座位图');
                $('.seating-chart-box').css('visibility','hidden');
                $('.bing-box').css('visibility','visible');
                setExhibition(num,chi,que,tui);
            }
        }
    });
}
function setList(data) {
    var all = Math.ceil(data.length/8);
    trStr = '';
    for(i=1;i<=all;i++){
        var tdStr = '';
        var key = 0;
        $.each(data,function(k,v){
            ++key;
            if((k < i*8) && (k >= (i-1)*8) ){
                var classStr = 'images/ic-normal.png';
                if(v.s_status == 2) {
                    classStr = 'images/ic-late.png';
                }
                if(v.s_status == 3) {
                    classStr = 'images/ic-tui.png';
                }
                if(v.s_status == 4 || v.s_status == 0) {
                    classStr = 'images/ic-miss.png';
                }
                tdStr += '<td data-type="'+v.type+'" data-status="'+v.s_status+'" data-name="'+v.username+'" data-time="'+v.updated_at+'" data-id="'+v.id+'"><img src="'+classStr+'"></td>';
            }
        });
        if(key < 8){
            for(w=0;w<(8-key);w++){
                tdStr += '<td></td>';
            }
        }
        trStr += '<tr>'+tdStr+'</tr>';
    }
    $('.schedule-table tbody').html(trStr);
}
function getClassData(){
    var gid = $('.grade option:selected').val();
    garname = gid;
    $.get(getApiUrl+'/teacher/schedule/class-room?access_token='+sessionStorage.getItem('access_token')+'&id='+gid,function(data){
        if(data.code == 1 || data.code == 14){
          //  showError(1,'您的账号暂未开通考勤、排课服务。请联系本校教师或拨打服务热线','');return;
            $('.maskk,.no-access').show();
            $('.change-menu,.teach-my-schedule,.date-schedule').hide();
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
        if(data.code == 1 || data.code == 14){
            $('.maskk,.no-access').show();
            $('.change-menu,.teach-my-schedule,.date-schedule').hide();
           // showError(1,'您的账号暂未开通考勤、排课服务。请联系本校教师或拨打服务热线','');return;
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
function setDate(y,m,d) { //日统计
    year = y;
    month = m;
    date = d;
    $('.teach-my-title').html(y+'-'+m+'-'+d+' '+getWeek(y,m-1,d)+'<span><img src="images/common-ic-more.png"/></span>');
    setInfo();
}

function setDateMonth(y,m) { //月统计
    year = y;
    month = m;
    $('.teach-my-title-month').html(y+'-'+m+'<span><img src="images/common-ic-more.png"/></span>');
    globalStart = y+'-'+m+'-01';
    globalEnd = y+'-'+m+'-31';
    setInfo2(y+'-'+m+'-01',y+'-'+m+'-31');
}

 flagName = [];
 flagJson = new Array;
 flagBg = [];
function setExhibition(a,b,c,d){
    if( a == 0 && b == 0 && c == 0 && d == 0){
        $('#brokenLine').html('<img src="../images/nodataImg.png" class="no-data"/><div class="no-data-text">暂时没有数据呢！</div>');
        $('.modify-check-status,.be-late,.be-miss,.be-tui').hide();
        return;
    }
    $('.modify-check-status,.be-late,.be-miss,.be-tui').show();
    classification(a,b,c,d);
    var myChart = echarts.init(document.getElementById('brokenLine'));
    option = {
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
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
   // if( a == 0 && b == 0 && c == 0 && d == 0){ //全没数据
       // console.log('nooo');
        //flagName[0] = '没数据';
        //flagJson = [
        //    {value:0, name:'没数据'},
        //];
        //flagBg[0] = ' #999';
     //   $('.bing-box').html('<img src="../images/nodataImg.png"/>');
   // }else{ //有数据
        flagName = ['正常','迟到','旷课','早退'];
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
            {value:b, name:'迟到',itemStyle:{
               normal:{
                    label:{
                        show: true,
                    },
                    labelLine: {
                        show: true
                    }
               }
            }},
            {value:c, name:'旷课',itemStyle:{
               normal:{
                    label:{
                        show: true,
                    },
                    labelLine: {
                        show: true
                    }
               }
            }},
            {value:d, name:'早退',itemStyle:{
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
   // }
}

//点击浏览器的返回按钮
//防止返回历史记录
pushHistory();
function pushHistory() {
    var state = {
        title: "title",
        url: "#"    };
    window.history.pushState(state, "title", "#");
};
window.onpopstate = function() {
    $('.teach-my-schedule').show();
    $('.screening-course,.modify-check-status-box').hide();
    chooseStatus(999); //默认进去值设为1正常
};
// 点击空白处隐藏弹出窗口
$(document).click(function(event){
    var _con = $('#modify-stu-info');
    if(!_con.is(event.target) && _con.has(event.target).length === 0){
        $('.mask ,.modify-stu-info').fadeOut();
    }
});