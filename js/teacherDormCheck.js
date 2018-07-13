garname='';claname='';kename='';
//饼状图展示
flagName = [];
flagJson = new Array;
flagBg = [];
globalSemester =[];
globalTotalWay = 1;
globalStart = '';
globalEnd = '';
globalType = 0;//1为白天 0为黑夜
globalYear = year;
globalMonth = month;
globalDate = date;
(function(){
    $.ajaxSetup({
        async: false
    });
    $.get(getApiUrl+'/teacher/dormitory/statistics?access_token='+sessionStorage.getItem('access_token'),function(data){
        var str = '';
        if(data.code == 0){
            globalType = data.data.type;
            if(data.data.list){
                $.each(data.data.list,function(k,v){
                    if(k == 0)
                    {
                        str += '<option value="'+v.class_room_id+'" data-id="'+v.mac+'" selected="selected">'+v.class_room_name+'</option>';
                    }else{
                        str += '<option value="'+v.class_room_id+'" data-id="'+v.mac+'">'+v.class_room_name+'</option>';
                    }
                });
            }
            $('.teach-my-dorm-title select').html(str);
        }else if(data.code == 1 || data.code == 14){
            $('.maskkk,.no-access').show();
            $('.change-menu,.teach-my-schedule,.date-schedule').hide();
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
            if(data.code == 1 || data.code == 14){
                $('.maskkk,.no-access').show();
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

    $.each($(this).parent().find('.room-number-list'),function(k,v){
        if(!$(this).find('.room-name-list').is(':visible')){
            $(this).find('.part-two label').removeClass('active');
        }
    });
});


//实时考勤寝室列表和寝室详情切换
$('.floor-list-ul').on('click','.room-name-list',function(){
    $('.floor-list-ul,.teach-my-dorm-title').hide();
    $('.floor-list-detail').show();

    var l_name = $(this).parents('li').children('p').find('span').text();
    var s_name = $(this).parents('.room-number-list').children('p').children('span').eq(0).text();
    var s_num = $(this).parents('.room-number-list').children('p').children('span').eq(2).text();

    var id = $(this).parents('div').attr('data-id');
    var bid = $('.teach-my-dorm-title option:selected').val();
    data_id = $(this).parents('.room-number-list').attr('data-id');
    $('.teach-detail-dorm-title a').attr('href','editDormCheck.html?data-id='+data_id+'&did='+bid);

    $.get(getApiUrl+'/teacher/dormitory/search?access_token='+sessionStorage.getItem("access_token"),{'bid':id,'did':bid},function(data){
        var str = '';
        var dormName = '';
        if(data.code == 0)
        {
            if(data.data.type == 1) //白天
            {
                if(data.data.list.abnormal.length >0){ //有异常
                    $('.abnormal-title span').html(data.data.list.abnormal.length+'人');
                    var str = '';
                    $.each(data.data.list.abnormal,function(k,v){

                        dormName = v.dormitory_name+ v.bedroom_name;
                        console.log('v.status='+v.status);
                        if(v.status == 2 ){ //晚归状态
                            str +=' <li class="day-abnormal-li"><div class="abnormal-list-left"><img src="images/ic-yes.png"/></div>\
                        <div class="abnormal-list-middle"> <p><span>'+ v.username+'</span><i>'+ v.grade_name+' · '+ v.class_room_name+'</i><label>'+filterGender(v.gender)+'</label></p>\
                        <p>此同学晚归寝室</p></div> <span class="abnormal-list-right" parents_phone="'+v.parents_phone+'" teacher_phone="'+v.teacher_phone+'"><img src="images/big-call.png"  class="phoneToCall"></span></li>';

                        }else if(v.status == 5){ //未归状态

                            str +=' <li class="day-abnormal-li"><div class="abnormal-list-left"><img src="images/ic-yes.png"/></div>\
                        <div class="abnormal-list-middle"> <p><span>'+ v.username+'</span><i>'+ v.grade_name+' · '+ v.class_room_name+'</i><label>'+filterGender(v.gender)+'</label></p>\
                        <p>此同学异常进入寝室</p></div> <span class="abnormal-list-right" parents_phone="'+v.parents_phone+'" teacher_phone="'+v.teacher_phone+'"><img src="images/big-call.png"  class="phoneToCall"></span></li>';

                        }else if(v.status == 1){
                            str +=' <li class="day-abnormal-li"><div class="abnormal-list-left"><img src="images/ic-yes.png"/></div>\
                        <div class="abnormal-list-middle"> <p><span>'+ v.username+'</span><i>'+ v.grade_name+' · '+ v.class_room_name+'</i><label>'+filterGender(v.gender)+'</label></p>\
                        <p>此同学在非在寝时间进入宿舍</p></div> <span class="abnormal-list-right" parents_phone="'+v.parents_phone+'" teacher_phone="'+v.teacher_phone+'"><img src="images/big-call.png"  class="phoneToCall"></span></li>';
                        }
                    });
                    $('.abnormal-list').html(str);
                }

                if(data.data.list.normal.length >0){ //正常
                    $('.normal-title span').html(data.data.list.normal.length+'人');
                    var str = '';
                    $.each(data.data.list.normal,function(k,v){
                        dormName = v.dormitory_name+ v.bedroom_name;

                        str +=' <li class="night-abnormal-li"><div class="abnormal-list-left"><img src="images/ic-no.png"/></div>\
                        <div class="abnormal-list-middle"> <p class="noBody-css"><span>'+ v.username+'</span><i>'+ v.grade_name+' · '+ v.class_room_name+'</i><label>'+filterGender(v.gender)+'</label></p>\
                        <p class="noBody-css">正常离寝中</p></div> <span class="abnormal-list-right" parents_phone="'+v.parents_phone+'" teacher_phone="'+v.teacher_phone+'"><img src="images/big-call.png"  class="phoneToCall"></span></li>';
                    });
                    $('.normal-list').html(str);
                }

            }else
            {
                if(data.data.list.abnormal.length >0){ //有异常
                    $('.abnormal-title span').html(data.data.list.abnormal.length+'人');
                    var str = '';
                    $.each(data.data.list.abnormal,function(k,v){
                        dormName = v.dormitory_name+ v.bedroom_name;

                        if(v.status == 3 ){ //早出状态
                            str +=' <li class="night-abnormal-li"><div class="abnormal-list-left"><img src="images/ic-no.png"/></div>\
                        <div class="abnormal-list-middle"> <p><span>'+ v.username+'</span><i>'+ v.grade_name+' · '+ v.class_room_name+'</i><label>'+filterGender(v.gender)+'</label></p>\
                        <p>此同学早出寝室</p></div> <span class="abnormal-list-right" parents_phone="'+v.parents_phone+'" teacher_phone="'+v.teacher_phone+'"><img src="images/big-call.png"  class="phoneToCall"></span></li>';
                        }else if(v.status == 0){ //不在宿舍宿舍
                            str +=' <li class="night-abnormal-li"><div class="abnormal-list-left"><img src="images/ic-no.png"/></div>\
                        <div class="abnormal-list-middle"> <p><span>'+ v.username+'</span><i>'+ v.grade_name+' · '+ v.class_room_name+'</i><label>'+filterGender(v.gender)+'</label></p>\
                        <p>此同学未在寝室</p></div> <span class="abnormal-list-right" parents_phone="'+v.parents_phone+'" teacher_phone="'+v.teacher_phone+'"><img src="images/big-call.png"  class="phoneToCall"></span></li>';
                        }else if(v.status == 4){
                            str +=' <li class="night-abnormal-li"><div class="abnormal-list-left"><img src="images/ic-no.png"/></div>\
                        <div class="abnormal-list-middle"> <p><span>'+ v.username+'</span><i>'+ v.grade_name+' · '+ v.class_room_name+'</i><label>'+filterGender(v.gender)+'</label></p>\
                        <p>此同学未归寝室</p></div> <span class="abnormal-list-right" parents_phone="'+v.parents_phone+'" teacher_phone="'+v.teacher_phone+'"><img src="images/big-call.png"  class="phoneToCall"></span></li>';
                        }
                    });
                    $('.abnormal-list').html(str);
                }

                if(data.data.list.normal.length >0){ //正常
                    $('.normal-title span').html(data.data.list.normal.length+'人');
                    var str = '';
                    $.each(data.data.list.normal,function(k,v){
                        dormName = v.dormitory_name+ v.bedroom_name;
                        str +=' <li class="day-abnormal-li"><div class="abnormal-list-left"><img src="images/ic-yes.png"/></div>\
                        <div class="abnormal-list-middle"> <p><span>'+ v.username+'</span><i>'+ v.grade_name+' · '+ v.class_room_name+'</i><label>'+filterGender(v.gender)+'</label></p>\
                        <p>正常在寝</p></div> <span class="abnormal-list-right" parents_phone="'+v.parents_phone+'" teacher_phone="'+v.teacher_phone+'"><img src="images/big-call.png" class="phoneToCall"></span></li>';
                    });
                    $('.normal-list').html(str);
                }
            }
        }

        $('.dormDetailName').html(dormName);
    });

});

//拨打电话
$('.floor-list-detail').on('click','.phoneToCall',function(event){
    //取消事件冒泡
    event.stopPropagation();
    var parents_phone = $(this).parent().attr('parents_phone');
    var teacher_phone = $(this).parent().attr('teacher_phone');

    $('.toPhoneMask li').eq(0).html('<a href="tel:'+teacher_phone+'">老师电话（<i class="teacherPhone">'+teacher_phone+'</i>）<span><img src="images/ic-phone-small.png"></span></a>')
    $('.toPhoneMask li').eq(1).html('<a href="tel:'+parents_phone+'">家长电话（<i class="teacherPhone">'+parents_phone+'</i>）<span><img src="images/ic-phone-small.png"></span></a>');
    $('.toPhoneMask,.phoneMask').show();
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

function filterGender(num){
    if(num == 1){
        return '男';
    }else if(num == 2){
        return '女';
    }else{
        return '未填';
    }
}

//wsUri = getSockUrl;
//websocket = new WebSocket(wsUri);
//websocket.onopen = function(evt) {
//    var id = $('.teach-my-dorm-title option:selected').attr('data-id');
//    websocket.send(JSON.stringify({'bind' : id}));
//    //onOpen(evt)
//};
//websocket.onclose = function(evt) {
//    //onClose(evt)
//};
//websocket.onmessage = function(evt) {
//    $('.maskk,.no-data').hide();
//    getListData(JSON.parse(evt.data));
//};
//websocket.onerror = function(evt) {
//    $('.maskk,.no-data').show();
//    //onError(evt)
//};

function uploadPage(){
    window.location.reload();
}

function getListData(data)
{
    if(!data.data)
        return;
    var str = '';
    if(data.data.floor){
        $.each(data.data.floor,function(k,v){
            str += '<li><p class="part-one"><span>'+ v.floor +'楼</span> ('+v.in+'/'+v.total+')<i class="active"></i></p>';
            $.each(v.bedroom,function(b_k,b_v){
                str += '<div class="room-number-list" data-id="'+b_v.id+'">\
                        <p class="part-two"><span>'+b_v.name+'室</span>\
                            <span class="already-people-num">';

                if(globalType == 1){ //白天模式
                    for(var i=0;i<b_v.in;i++){ //异常的
                        str += '<i class="abnormal"></i>';
                    }
                    for(var i=0;i<b_v.total-b_v.in;i++){ //正常的
                        str += '<i></i>';
                    }
                }else if(globalType == 0){ //夜晚模式
                    for(var i=0;i<b_v.in;i++){ //正常的
                        str += '<i class="active"></i>';
                    }
                    for(var i=0;i<b_v.total-b_v.in;i++){ //异常的
                        str += '<i class="abnormal"></i>';
                    }
                }
                //for(var i=0;i<b_v.in;i++){
                //    str += '<i class="active"></i>';
                //}
                //for(var i=0;i<b_v.abnormal;i++){
                //    str += '<i class="abnormal"></i>';
                //}
                //
                //for(var i=0;i<b_v.total-b_v.in-b_v.abnormal;i++){
                //    str += '<i></i>';
                //}
                str += '</span><span class="part-three">'+b_v.in+'/'+b_v.total+' <label></label></span>\
                        </p>';
                if(b_k == 0)
                {
                    str += '<ul class="room-name-list">';
                } else {
                    str += '<ul class="room-name-list" style="display:none">';
                }
                $.each(b_v.list,function(l_k,l_v){

                    if(globalType == 1){ //白天模式
                        if((l_v.status == 1) || (l_v.status  == 2) || (l_v.status == 5) ){
                            if(l_v.status >= 1) {
                                str += '<li class="active" data-uid="'+l_v.user_id+'">'+l_v.username+'<i class="abnormal-mark"></i></li>';
                            }else{
                                str += '<li data-uid="'+l_v.user_id+'">'+l_v.username+'<i class="abnormal-mark"></i></li>';
                            }
                        }else{
                            //   if(l_v.status > 1) {
                            //      str += '<li data-uid="'+l_v.user_id+'">'+l_v.username+'<i class="abnormal-mark"></i></li>';
                            //   }else{
                            str += '<li data-uid="'+l_v.user_id+'">'+l_v.username+'</li>';
                            //   }
                        }
                    }else{ //夜晚模式
                        if((l_v.status == 0) || (l_v.status  == 3) || (l_v.status == 4) ){
                            str += '<li data-uid="'+l_v.user_id+'">'+l_v.username+'<i class="abnormal-mark"></i></li>';
                        }else{
                            str += '<li class="active" data-uid="'+l_v.user_id+'">'+l_v.username+'</li>';
                        }
                    }
                });

                str += '</ul></div>';
            });

            str += '</li>';

        });
    }
    $('.floor-list-ul').html(str);
    setDivShow(0);

    if(GetQueryString('data-id')){
        $('.room-number-list[data-id="'+GetQueryString("data-id")+'"] .room-name-list').trigger('click');
    }
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
    'maxDate':globalYear+'-'+globalMonth+'-'+globalDate,/*最大日期*/
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
    'maxDate':globalYear+'-'+globalMonth+'-'+globalDate,/*最大日期*/
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
        var ss = '<option>请选择</option>';
        var value ='';
        var startT ='';
        var endT ='';
        var timestamp =  parseInt(new Date().getTime()/1000);
        if(globalSemester){
            $.each(globalSemester,function(k,v){
                if(timestamp < toTimeStamp(v.end) && timestamp > toTimeStamp(v.start)){
                    value = k;
                    startT = v.start;
                    endT = v.end;
                }
                ss += '<option data-start="'+ v.start+'" data-end="'+ v.end+'" value="'+k+'">'+ v.name+'</option>';
            });
        }
        $('.semesterSelect').html(ss);
        $('.semesterSelect option[value='+value+']').attr('selected',true);
        $('.teach-my-title-term').show();
        $('.teach-my-title-month,.teach-my-title,.teach-my-title-year').hide();
        setInfo2(startT,endT);
    }else if(typeVal == 4){
        globalTotalWay = 2;
        var ss = '<option>请选择</option>';
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
function setInfo()
{
    var gr = $('.grade option:selected').text();
    var cl = $('.class option:selected').text();
    var gid = $('.grade option:selected').val();
    var cid = $('.class option:selected').val();
    var da = year+'-'+month+'-'+date;
    $('.info').html('<span>'+gr+'·'+cl+'</span>');


    $.get(getApiUrl+'/teacher/dormitory?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid+'&date='+da,function(data){
        console.log('3455');
        if(data.code == 1 || data.code == 14){
           // showError(1,'您的账号暂未开通考勤、排课服务。 请联系本校教师或拨打服务热线','');return;
           $('.maskkk,.no-access').show();
           $('.change-menu,.teach-my-schedule').hide();
        }
        if(data.code == 0){
            globalSemester = data.data.semester; //学期列表
            globalChangeSelect = data.data.year;//学年列表
            allNum = 0;zcnum=0;wgnum=0;z_cnum=0;w_gnum=0;ssnum=0;sdnum=0;
            $('.kuang').html('');$('.chi').html('');$('.zao').html('');
            if(data.data.list){
                $.each(data.data.list,function(k,v){
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
                            if(d_v.dormitory_name && d_v.bedroom_name){
                                str += '<li>'+d_v.username+'<span>('+d_v.dormitory_name+d_v.bedroom_name+')</span></li>';
                            }else{
                                str += '<li>'+d_v.username+'</li>';
                            }
                        });

                        $('.chi').html(str);
                    }
                    if(v.name == '早出'){
                        allNum += v.data.length;
                        z_cnum = v.data.length;

                        var str = '';
                        $.each(v.data,function(d_k,d_v){
                            if(d_v.dormitory_name && d_v.bedroom_name){
                                str += '<li>'+d_v.username+'<span>('+d_v.dormitory_name+d_v.bedroom_name+')</span></li>';
                            }else{
                                str += '<li>'+d_v.username+'</li>';
                            }
                        });

                        $('.kuang').html(str);
                    }
                    if(v.name == '未归'){
                        w_gnum = v.data.length;
                        allNum += v.data.length;

                        var str = '';
                        $.each(v.data,function(d_k,d_v){
                            if(d_v.dormitory_name && d_v.bedroom_name){
                                str += '<li>'+d_v.username+'<span>('+d_v.dormitory_name+d_v.bedroom_name+')</span></li>';
                            }else{
                                str += '<li>'+d_v.username+'</li>';
                            }
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

function setInfo2(start,end)
{
    var gr = $('.grade option:selected').text();
    var cl = $('.class option:selected').text();
    var gid = $('.grade option:selected').val();
    var cid = $('.class option:selected').val();
    var da = year+'-'+month+'-'+date;
    $('.info').html('<span>'+gr+'·'+cl+'</span>');


    $.get(getApiUrl+'/teacher/dormitory?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid+'&start='+start+'&end='+end,function(data){
        console.log('5543');
        if(data.code == 1 || data.code == 14){
            // showError(1,'您的账号暂未开通考勤、排课服务。 请联系本校教师或拨打服务热线','');return;
            $('.maskkk,.no-access').show();
            $('.change-menu,.teach-my-schedule').hide();
        }
        if(data.code == 0){
            allNum = 0;zcnum=0;wgnum=0;z_cnum=0;w_gnum=0;ssnum=0;sdnum=0;
            $('.kuang').html('');$('.chi').html('');$('.zao').html('');
            if(data.data.list){
                $.each(data.data.list,function(k,v){
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
                            if(d_v.dormitory_name && d_v.bedroom_name){
                                str += '<li>'+d_v.username+'<span>('+d_v.dormitory_name+d_v.bedroom_name+')</span></li>';
                            }else{
                                str += '<li>'+d_v.username+'</li>';
                            }
                        });

                        $('.chi').html(str);
                    }
                    if(v.name == '早出'){
                        allNum += v.data.length;
                        z_cnum = v.data.length;

                        var str = '';
                        $.each(v.data,function(d_k,d_v){
                            if(d_v.dormitory_name && d_v.bedroom_name){
                                str += '<li>'+d_v.username+'<span>('+d_v.dormitory_name+d_v.bedroom_name+')</span></li>';
                            }else{
                                str += '<li>'+d_v.username+'</li>';
                            }
                        });

                        $('.kuang').html(str);
                    }
                    if(v.name == '未归'){
                        w_gnum = v.data.length;
                        allNum += v.data.length;

                        var str = '';
                        $.each(v.data,function(d_k,d_v){
                            if(d_v.dormitory_name && d_v.bedroom_name){
                                str += '<li>'+d_v.username+'<span>('+d_v.dormitory_name+d_v.bedroom_name+')</span></li>';
                            }else{
                                str += '<li>'+d_v.username+'</li>';
                            }
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
//时间段转时间戳
function toTimeStamp(time){
    time = time.substring(0,19);
    time = time.replace(/-/g,'/');
    var timestamp = new Date(time).getTime();
    return parseInt(timestamp/1000);
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
function setExhibition(a,b,c,d){
    if( a == 0 && b == 0 && c == 0 && d == 0){ //全没数据
        $('#brokenLine').html('<div class="echartNodata"><img src="images/nodataImg.png"><p>抱歉！暂无数据呢！</p></div>').removeAttr('_echarts_instance_ style');
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
        window.location.href="teacherDormCheck.html";
        $('.actual-dorm-data').css('display','inline-block');
        $('.teach-my-schedule').css('visibility','hidden');
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
            //if(GetQueryString('data-id')){
                window.location.href="/teacherDormCheck.html";
           // }
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

// 点击空白处隐藏弹出窗口
$(document).click(function(event){
    var _con = $('#toPhoneMask');
    if(!_con.is(event.target) && _con.has(event.target).length === 0){
        $('.toPhoneMask,.phoneMask').fadeOut();
    }
});