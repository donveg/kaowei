(function(){
    globalYear = year;
    globalMonth = month;
    globalDate = date;
    weekArray = {'1':[1,2,3,4,5,6,7],'2':[8,9,10,11,12,13,14],'3':[15,16,17,18,19,20,21],'4':[22,23,24,25,26,27,28],'5':[29,30,31]};
    currentWeek = parseInt(getDefaultWeek().week);
    globalWeek = parseInt(getDefaultWeek().week);
    globalWeekk = parseInt(getDefaultWeek().week);
    semesterArr = new Array();
    semesterArrKey = 0;
    startPeriod = '';
    endPeriod = '';
    currentDay = date; //当天日期数
    currentMonth = month;//当前月份数
    defaultStartDay = getDefaultWeek().start;
    defaultEndDay = getDefaultWeek().end;
    globalTermKey = 4;
    $('.date-select-monthh label').html(year+'年'+currentMonth+'月');
    getPunchData2(year+'-'+month+'-'+date);
    //考勤页当前日期信息显示
    $('.nav-date').html(year+'年'+month+'月'+date+'日&nbsp;&nbsp; '+getWeek(year,month-1,date));
    //底部导航切换
    $('.change-menu span').click(function(){
        $('.single-tui-box,.single-chi-box,.kuang-list-box,.week-select,.save-button').hide();
       // $('.tab-change-list,.week-list').show();
        $('.change-menu span').removeClass('active');
        $(this).addClass('active');

        if($(this).hasClass('total')){
            $('.punchClock').hide();
            $('.totalNumber').show();
            $('.week-list p label').html('第'+currentWeek+'周（'+globalMonth+'月'+defaultStartDay+'日~'+globalMonth+'月'+defaultEndDay+'日）');
            month = globalMonth;
            getTotalData2('',globalYear+'-'+globalMonth+'-'+defaultStartDay,globalYear+'-'+globalMonth+'-'+defaultEndDay);
        }else{
            getPunchData2(year+'-'+month+'-'+date);
            $('.punchClock').show();
            $('.totalNumber').hide();
        }
    });

    // 考勤前一天后一天切换
    var dateLength = DayNumOfMonth(year,month);

    $('.before-icon').parent().click(function(){
        date = parseInt(date);
        month = parseInt(month);
        $('.change-day button .after-icon').parent().attr("disabled",false);
        date = parseInt(date);
       if(date <= 1){
           month = month-1;
           date = DayNumOfMonth(year,month);
           // date = 1;
        }else{
            date -= 1;
        }
       setDate(year,month,date);
    });
    $('.after-icon').parent().click(function(){
        monthAllData = DayNumOfMonth(year,month);
        date = parseInt(date);
        month = parseInt(month);
        if(date >= monthAllData) {
           // date = monthAllData;
              month = month+1;
              date = 1;
            $('.change-day button .after-icon').parent().attr("disabled",'disabled');
        }else{
            date += 1;
        }
        setDate(year,month,date);
    });

    //统计月考勤前一月后一月切换
    $('.before-m-icon').parent().click(function(){
        $('.change-dayy button .after-m-icon').parent().attr("disabled",false); 
        month = parseInt(month);
        if(month <= 1) {
            year -=1;
            month = 12;
        }else{
            month -= 1;
        }
        $('.month-list .month-time').html(year+'年'+month+'月');
      //  getTotalData2(month,'','');
        getTotalData2(month,year+'-'+month+'-01',year+'-'+month+'-'+DayNumOfMonth(year,month));
    });
    $('.after-m-icon').parent().click(function(){

        $('.change-dayy button .before-m-icon').parent().removeClass('disabled');
        $('.change-dayy button').removeClass('active');
        $(this).addClass('active');
        month = parseInt(month);
        if(month >= globalMonth) {
            month = globalMonth;
        }else{
            month += 1;
        }
        if(month >= globalMonth) {
            $('.change-dayy button .after-m-icon').parent().attr("disabled",'disabled');
        }
        $('.month-list .month-time').html(globalYear+'年'+month+'月');
        getTotalData2(month,year+'-'+month+'-01',year+'-'+month+'-'+DayNumOfMonth(year,month));
       // getTotalData2(month,'','');
    });
    //统计部分,头部信息切换
    $('.week').click(function(){
        month = globalMonth;
        $('.single-tui-box,.single-chi-box,.kuang-list-box,.week-select,.save-button').hide();
        $('.tab-change-list span label').removeClass('active');
        $(this).find('label').addClass('active');
        $('.week-list').show();
        $('.month-list,.term-list').hide();
        getTotalData2('',globalYear+'-'+globalMonth+'-'+defaultStartDay,globalYear+'-'+globalMonth+'-'+defaultEndDay);
    });
    $('.month').click(function(){
        $('.month-list .month-time').html(globalYear+'年'+globalMonth+'月');
        $('.single-tui-box,.single-chi-box,.kuang-list-box,.week-select,.save-button').hide();
        $('.tab-change-list span label').removeClass('active');
        $(this).find('label').addClass('active');
        $('.month-list').show();
        $('.term-list,.week-list').hide();
        //timeDatePick2('.date-select-month');
      //  getTotalData2(month,'','');
        year = globalYear;
        month = globalMonth;
        getTotalData2(globalMonth,'','');
        if(year == globalYear && month == globalMonth ){
            $('.change-dayy button .after-m-icon').parent().attr("disabled",'disabled');
        }

    });
    $('.term').click(function(){
        $('.single-tui-box,.single-chi-box,.kuang-list-box,.week-select,.save-button').hide();
        $('.tab-change-list span label').removeClass('active');
        $(this).find('label').addClass('active');
        $('.term-list').show();
        $('.month-list,.week-list').hide();
        getTotalData2('','2017-9-1','2018-2-15');
    });
    timeDatePick('#date-selected');

    //学期考勤统计前后学期切换
    $('.semester button').click(function(){
        
        if($(this).find('i').hasClass('before-x-icon')){
            $('.semester button .after-x-icon').parent().removeAttr('disabled');
            if(semesterArrKey <= 0){
                semesterArrKey = 0;
                $('.semester button .before-x-icon').parent().attr('disabled','disabled');
            }else{
                --semesterArrKey;
            }
            
        }else{
            $('.semester button .before-x-icon').parent().removeAttr('disabled');
            if(semesterArrKey >= 3){
                semesterArrKey = 4;
                $('.semester button .after-x-icon').parent().attr('disabled','disabled');
            }else{
                ++semesterArrKey;
            }
        }
        $('.term-list .termKey').attr('data-key',semesterArrKey);
        $('.term-list p label').html(semesterArr[semesterArrKey].name);
        getTotalData2('',semesterArr[semesterArrKey].start,semesterArr[semesterArrKey].end);
    });

    //调用年月时间选择器
    setYearMonth('.date-select-month','.month-list .month-time',1);
    setYearMonth('.date-select-monthh','.date-select-monthh label',0);
})()
//获取当前所在的周
function getDefaultWeek(){
    var obj = {}
    $.each(weekArray,function(a,b){
        if(in_array(date,b)){
            currentWeek = a;
            obj ={'week':a,'start':weekArray[a][0],'end':weekArray[a][b.length-1]};
        }
    });
    return obj;
}
function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}
//根据当前周获取起始时间
function getTimePeriod(a){
    var str = '';
    startPeriod = year+'-'+currentMonth+'-'+weekArray[a][0];
    endPeriod = year+'-'+currentMonth+'-'+weekArray[a][weekArray[a].length-1];
    str = '第'+a+'周（'+currentMonth+'月'+weekArray[a][0]+'日~'+currentMonth+'月'+weekArray[a][weekArray[a].length-1]+'日）';
    return str;
}
//前一周后一周
$('.before-w-icon').parent().click(function(){
    console.log('month='+month+'globalMonth='+globalMonth+'currentWeek='+currentWeek);
    if(year == globalYear && month < globalMonth){
        $('.week-list button .after-w-icon').parent().removeAttr('disabled');
    }
    currentWeek = parseInt(currentWeek);
    if(currentWeek <= 2) {
        currentWeek = 1;
        $('.week-list button .before-w-icon').parent().attr('disabled','disabled');
    }else{
        currentWeek -= 1;
    }
    $('.week-list p label').html(getTimePeriod(currentWeek));
    getTotalData2(currentMonth,startPeriod,endPeriod);
});
$('.after-w-icon').parent().click(function(){
    $('.week-list button .before-w-icon').parent().removeAttr('disabled');
    currentWeek = parseInt(currentWeek);

    if(year == globalYear && currentMonth >= globalMonth){
        if(currentWeek >= globalWeek-1) {
            currentWeek = globalWeek;
            $('.week-list button .after-w-icon').parent().attr('disabled','disabled');
        }
    }else if(currentWeek < getTotalWeek(year,currentMonth)){
        currentWeek += 1;
    }else{
        $('.week-list button .after-w-icon').parent().attr('disabled','disabled');
    }
    $('.week-list p label').html(getTimePeriod(currentWeek));
    getTotalData2(currentMonth,startPeriod,endPeriod);
});

//通过年月获得多少周
function getTotalWeek(y,m){
    var allDay = DayNumOfMonth(y,m);
    if(allDay <=28){
        return 4;
    }else{
        return 5;
    }
}
//考勤时间选择插件确定
function setDate(y,m,d) {
    d = parseInt(d);
    if(y>globalYear || (y==globalYear && m> globalMonth) ||(y==globalYear && m == globalMonth && d > globalDate)){
        alert('不可选择未来日期');return false;
    }else if(y<=globalYear && m<globalMonth && d >= 1){
        $('.change-day button .after-icon').parent().attr("disabled",false);
    }else if(d<globalDate){
        $('.change-day button .after-icon').parent().attr("disabled",false); 

    }

    year = y;
    month = m;
    date = d;
    $('.nav-date').html(y+'年'+m+'月'+d+'日&nbsp;&nbsp; '+getWeek(y,m-1,d));
    getPunchData2(y+'-'+m+'-'+d);
    
}
//获取月考勤数据第一页面
function getPunchData2(date) {
    var data = getApi(getApiUrl+'/student/attendance?access_token='+sessionStorage.getItem('access_token')+'&date='+date);
    var listData;
    var listDataNew;
    var dataType;
    switch(data.code)
    {
        case 0:
            listData = data.data.list;
            listDataNew = data.data.list.data;
            dataType = data.data.type;
            break;
        case 1: //账号不存在的情况
            $('.maskk,.no-access').show();
            $('.change-menu,.punchClock').hide();
            break;
        default:
            listData = [];
            listDataNew = [];
            break;
    }
    if(dataType == 2){//type: 1 学校考勤 2 教室考勤
        $('.clock-table').show();
        $('.clock-ul').hide();
        document.title = '教室考勤'; //head头部的title
    }else if(dataType == 1){
        $('.clock-table').hide();
        $('.clock-ul').show();
        document.title = '学校考勤';
    }
    //教室考勤表格展示
    if(listData < 1) {
        $('.clock-table tbody').html('<tr><td colspan="5">今日无考勤数据</td></tr>');
        return;
    }
    var str = '';
    $.each(listData,function(m,n){
        var amStardTime = (new Date(n.start*1000)).getHours()+':'+(new Date(n.start*1000)).getMinutes();
        var apEndTime = (new Date(n.end*1000)).getHours()+':'+(new Date(n.end*1000)).getMinutes();
        var updatedTime = (new Date(n.updated_at*1000)).getHours()+':'+(new Date(n.updated_at*1000)).getMinutes();
        str +=' <tr><td><span>'+ n.course_name+'</span><span>'+ n.grade_name+'·'+ n.class_room_name+'</span></td><td>'+amStardTime+'</td><td>'+apEndTime+'</td><td class="sign-flag be-late">'+updatedTime+'</td><td>'+ n.status+'</td></tr>';
    });
    $('.clock-table tbody').html(str);

    //学校考勤列表式展示
    if(listDataNew < 1){
        $('.clock-ul ul').html('<p>今日无考勤数据</p>');
        return;
    }
    var liStr = '';
    if(listDataNew){
        $.each(listDataNew,function(a,b){
            var status = '';
            $.each(b.status,function(c,d){
                var liClass = '';
                var labelClass = '';
                var liTime = '';
                if(d == 0 || d == 2 || d == 3 || d== 5){
                    liClass = 'i-miss';
                    labelClass = 'l-miss';
                }else if(d ==1){
                    liClass = 'i-normal';
                    labelClass = 'l-normal';
                }else{
                    liClass = 'i-late';
                    labelClass = 'l-late';
                }
                status = data.data.list.state[d];
                liStr += '<li><i class="'+liClass+'"></i><p><span>'+status+'</span><span>进校时间： <label class="'+labelClass+'">'+ formatDate(new  Date(b.created_at[c]*1000)) +'</label></span></p></li>';
            });
        });
    }

    $('.clock-ul ul').html(liStr);
}

function   formatDate(now)
{
    var   hour=now.getHours();
    var   minute=now.getMinutes();
    var   second=now.getSeconds();
    return  hour+":"+minute+":"+second;
}
//获取统计数据
//获取月考勤数据
function getTotalData2(val1,val2,val3){
    $('.kuang-box,.chi-box,.zao-box').hide();
    var data = getApi(getApiUrl+'/student/attendance/statistics?access_token='+sessionStorage.getItem('access_token')+'&month='+val1+'&start'+'='+val2+'&end'+'='+val3);
    var listData;
    switch(data.code)
    {
        case 0:
            listData = data;
            break;
        default:
            listData = [];
            break;
    }

    $.each(listData,function(x,y){
        $('.ying').html(y.shouldBeSchedule+'天');
        $('.shi').html(y.actualSchedule+'天');

    });
    if(listData.data.lesson.length>0){
        var que = '';
        var chi ='';
        var zao ='';
       // $('.kuang-box,.chi-box,.zao-box').show();
        $.each(listData.data.lesson,function(m,n){
            if(n.name=='缺勤'){
               if(n.number){
                    $('.kuang').html(n.number);
                    $('.kuang-box').show();
                }else{
                    $('.kuang-box').hide();
                }
                $.each(n.data,function(a,b){
                    var mm = parseInt((new Date(b.updated_at*1000)).getMonth())+1;
                    var ddd = (new Date(b.updated_at*1000)).getFullYear()+'-'+mm+'-'+(new Date(b.updated_at*1000)).getDate();
                    que +=' <p><span>'+ ddd+'</span><span>第'+ b.lesson+'节 | '+ b.course_name+'</span></p>';
                });
                $('.kuang-list-box').html(que);
            }else if(n.name=='迟到'){
                $('.chi-box').show();
                if(n.number){
                    $('.chi').html(n.number);
                }else{
                    $('.chi-box').hide();
                }
                $.each(n.data,function(a,b){
                    var mm = parseInt((new Date(b.updated_at*1000)).getMonth())+1;
                    var ddd = (new Date(b.updated_at*1000)).getFullYear()+'-'+mm+'-'+(new Date(b.updated_at*1000)).getDate();

                    chi += '<div><p><span>'+ddd+' 周'+ b.week+' </span><span>第'+b.lesson+'节 | '+ b.course_name+'课</span></p><label>迟到5分钟</label></div>';
                });
                $('.single-chi-box').html(chi);

            }else if(n.name=='早退'){
            
                $('.zao-box').show();
                if(n.number){
                    $('.zao').html(n.number);
                }else{
                    $('.zao-box').hide();
                }
                $.each(n.data,function(a,b){
                    var mm = parseInt((new Date(b.updated_at*1000)).getMonth())+1;
                    var ddd = (new Date(b.updated_at*1000)).getFullYear()+'-'+mm+'-'+(new Date(b.updated_at*1000)).getDate();

                    zao += '<div><p><span>'+ddd+' 周'+ b.week+' </span><span>第'+b.lesson+'节 | '+ b.course_name+'课</span></p><label>早退5分钟</label></div>';
                });
                $('.single-zao-box').html(zao);
             }
        });
    }else{
        $('.kuang-box,.chi-box,.zao-box').hide();
    }
}
//时间选择插件 年-月-日
function timeDatePick(obj){
    var calendar = new datePicker();
    calendar.init({
        'trigger': obj, /*按钮选择器，用于触发弹出插件*/
        'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
        'minDate':'1900-1-1',/*最小日期*/
        'maxDate':globalYear+'-'+globalMonth+'-'+globalDate,/*最大日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var dateArr = calendar.value.split('-');
            setDate(dateArr[0],dateArr[1],dateArr[2]);
        },
        'onClose':function(){/*取消时触发事件*/
        }
    });
}
//时间选择插件 年-月
function setYearMonth(obj,obj2,type) {
    var calendar = new datePicker();
    calendar.init({
        'trigger': obj, /*按钮选择器，用于触发弹出插件*/
        'type': 'ym',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
        'minDate':'1900-1',/*最小日期*/
        'maxDate':globalYear+'-'+globalMonth,/*最大日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var dateArr = calendar.value.split('-');
            $(obj2).html(dateArr[0]+'年'+dateArr[1]+'月');

            year = dateArr[0];
            month = dateArr[1];
            currentYear = dateArr[0];
            currentMonth = dateArr[1];
            if(type == 1){
                if(month >= globalMonth){
                    $('.change-dayy button .after-m-icon').parent().attr("disabled",'disabled');
                }else{
                    $('.change-dayy button .after-m-icon').parent().attr("disabled",false);
                }
                getTotalData2(dateArr[1],dateArr[0]+'-'+dateArr[1]+'-01',dateArr[0]+'-'+dateArr[1]+'-'+DayNumOfMonth(dateArr[0],dateArr[1]));
            }else if(type == 0){
                currentYear = dateArr[0];
                currentMonth = dateArr[1];
                currentWeek = 1;
                weekSelect = 1;
                daySelect1 = 1;
                daySelect2 = 7;
                $('.week-select-month label').html('第'+currentWeek+'周');
            }
        },
        'onClose':function(){/*取消时触发事件*/
        }
    });
}

//获取学期信息
var flagKey = 4; //页面上显示的当前的
getTermList(flagKey);

$('.date-select-term').click(function(event){
    event.stopPropagation();
    var dataKey = $('.term-list .termKey').attr('data-key');
    getTermList(dataKey);
});

//获取学期列表
function getTermList(check){
    semesterArrKey = check;    
    $.get(getApiUrl+'/student/attendance/semester?access_token='+sessionStorage.getItem('access_token'),function(data){
        var str = '';
        $.each(data.data,function(k,v){
            semesterArr.push(v);
            if(k == check){
                str += '<li data-start='+v.start+' data-end="'+v.end+'" data-key="'+k+'"><span>'+v.name+'</span><label class="checked-icon active"></label></li>';
            }else if(k>flagKey){
                str += '<li data-start='+v.start+' data-end="'+v.end+'" data-key="'+k+'"><span>'+v.name+'</span></li>';
            }else{
                str += '<li data-start='+v.start+' data-end="'+v.end+'" data-key="'+k+'"><span>'+v.name+'</span><label class="checked-icon "></label></li>';
            }
        });
        $('.select-term-box ul').html(str);
    });
}

//周考勤日期选择
$('.term-list .date-select').click(function(){
    $('.maskk,.select-term-box').show();
});

$('.select-term-box').on('click','li',function(){
    $('.select-term-box ul li label').removeClass('active');
    $(this).find('label').addClass('active');
    $('.term-list .termKey').attr('data-key',$(this).attr('data-key'))
    $('.term-list .termKey').html($(this).text());
    $('.maskk,.select-term-box').hide();
    semesterArrKey = $(this).attr('data-key');
    if(semesterArrKey < globalTermKey){
        $('.after-x-icon').parent().removeAttr('disabled');
    }
    getTotalData2('',$(this).attr('data-start'),$(this).attr('data-end'));
});

//周考勤选择器
$('.data-select-week').click(function(){
    $('.week-select-month label').html('第'+currentWeek+'周');
    $('.totalNumber').hide();
    $('.sselct-choose-week-list,.week-select,.save-button').show();
});

function singleJump(num){
    switch(num){
        case 1:
            $('.tab-change-list,.week-list,.month-list,.term-list,.single-chi-box,.single-zao-box').hide();
            $('.kuang-list-box').show();
            break;
        case 2:
            $('.tab-change-list,.week-list,.term-list,.single-zao-box,.kuang-list-box').hide();
            $('.single-chi-box').show();
            break;
        case 3:
            $('.tab-change-list,.week-list,.term-list,.kuang-list-box,.single-chi-box').hide();
            $('.single-zao-box').show();
            break;
        default :
            console.log('bug');
    }
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
    $('.change-menu .total').click();
    $('.term-list,.month-list').hide();
    $('.tab-change-list,.week-list').show();
    $('.tab-change-list label').removeClass('active');
    $('.tab-change-list .week label').addClass('active');
};

// 点击空白处隐藏弹出窗口
$(document).click(function(event){
    var _con = $('#select-term-box');
    if(!_con.is(event.target) && _con.has(event.target).length === 0){
        $('.maskk ,.select-term-box').fadeOut();
    }
});
