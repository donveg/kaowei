grname = '';clname='';
(function(){
    var dateLength = DayNumOfMonth(year,month);
    var liStr = '';
    for(var i=1;i<=dateLength;i++)
    {
        classStr = '';
        if(i == date){
            navCenter(i);
            classStr = 'class="active"';
        }
        liStr += '<li '+classStr+' data-date="'+i+'">'+i+'日</li>';
    }

    $('.me').click(function(){
        $('.teach-my-title').html('我的课表<i></i>');

        if($('.change-menu .active').hasClass('date')){
            getData(year,month,date);
        }else{
            $('.week-schedule tbody').html('');
            getWeekData();
        }

        $('.select-room-box,.mask').hide();
    })

    $('.schedule-nav ul').html(liStr).css('width',dateLength*2.1+'rem');

    $('.change-menu span').click(function(){
        $('.am tbody').html('');
        $('.pm tbody').html('');
        $('.change-menu span').removeClass('active');
        $(this).addClass('active');

        if($(this).hasClass('date')){
            $('.week-schedule').hide();
            $('.date-schedule').show();
        }else{
            getWeekData();
            $('.week-schedule').show();
            $('.date-schedule').hide();
        }

        $('.teach-my-title').html('我的课表<i></i>');
    });

    $('.schedule-nav span').click(function(){
        var dataDate = parseInt($('.date-change .active').attr('data-date'));
        if($(this).hasClass('prev')){
            if(dataDate <= 1)
            {
                dataDate = 1;
            }else{
                dataDate -= 1;
            }
        }else{
            if(dataDate >= dateLength)
            {
                dataDate = dateLength;
            }else{
                dataDate += 1;
            }
        }
        date = dataDate;
        navCenter(dataDate);
    });

    $('.teach-my-title').click(function(){
        $('.mask,.select-room-box').show();
        var data = getApi(getApiUrl+'/teacher/schedule/grade?access_token='+sessionStorage.getItem('access_token'));
        if(data.code == 1){
           // showError(1,'该账号没有权限访问，请联系班级老师！','');return;
           $('.maskk,.no-access').show();
           $('.change-menu,.teach-my-schedule,.date-schedule').hide();
        }
        var listData;
        switch(data.code)
        {
            case 0:
                listData = data.data;
                break;
            default:
                listData = [];
                break;
        }

        var str = '';
        $.each(listData,function(k,v){
            if(grname && (grname == v.id)){
                str += '<span data-id="'+v.id+'" class="active">'+v.name+'</span>';
            }else{
                str += '<span data-id="'+v.id+'">'+v.name+'</span>';
            }
        });

        $('.select-room-list-part2 div').html(str);
    });

    $('.arror-icon').parent().click(function(){
        if($('.arror-icon').hasClass('active')){
            $('.arror-icon').removeClass('active');
        }else{
            $('.arror-icon').addClass('active');
        }
        $('.select-room-list-part2').toggle();
    });
})()

$('.date-change').on('click','li',function(){
    var dataDate = parseInt($(this).attr('data-date'));
    navCenter(dataDate);
});

$('.select-room-list-part2').on('click','li',function(){

    $('.classList .active').removeClass('active');
    $(this).find('i').addClass('active');
    $('.select-room-box,.mask').hide();
    $('.me').removeClass('active');

    var cid = parseInt($(this).find('i').attr('data-id'));
    clname = cid;
    var gid = $('.select-room-list-part2 .active').attr('data-id');
    var gname = $('.select-room-list-part2 .active').text();
    var cname = $(this).text();
    
    $('.teach-my-title').html(gname+' '+cname+'<i></i>');

    if($('.change-menu .active').hasClass('date')){
        dataDate = year+'-'+month+'-'+date;
        getClassData(gid,cid,dataDate);
    }else{
        getClassWeek(gid,cid);
    }

    
});

$('.select-room-list-part2').on('click','span',function(){
    $('.select-room-list-part2 span').removeClass('active');
    $(this).addClass('active');
    var id = $(this).attr('data-id');
    grname = id;
    var data = getApi(getApiUrl+'/teacher/schedule/class-room?access_token='+sessionStorage.getItem('access_token')+'&id='+id);
    if(data.code == 1){
       // showError(1,'该账号没有权限访问，请联系班级老师！','');return;
        $('.maskk,.no-access').show();
        $('.change-menu,.teach-my-schedule,.date-schedule').hide();
    }
    var listData;
    switch(data.code)
    {
        case 0:
            listData = data.data;
            break;
        default:
            listData = [];
            break;
    }

    var str = '';
    $.each(listData,function(k,v){
        str += ' <li><i class="checked-icon" data-id="'+v.id+'"></i>'+v.name+'</li>';
    });

    $('.select-room-list-part2 ul').html(str).show();
});

//日期居中
function navCenter(date)
{
    $('.schedule-date').text(year+'/'+month+'/'+date+'  '+getWeek(year,month-1,date));
    $('.date-change .active').removeClass('active');
    $('.date-change li[data-date="'+date+'"]').addClass('active');
    var leng = date*2.1-6.3;
    $(".date-change ul").css('margin-left','-'+leng+'rem');
    getData(year,month,date);
}

function getData(y,m,d){
    var data = getApi(getApiUrl+'/teacher/schedule?access_token='+sessionStorage.getItem('access_token')+'&date='+y+'-'+m+'-'+d);
    if(data.code == 1 || data.code == 14){
       // showError(1,'该账号没有权限访问，请联系班级老师！','');return;
       $('.maskk,.no-access').show();
       $('.change-menu,.teach-my-schedule,.date-schedule').hide();
    }
    var listData;
    switch(data.code)
    {
        case 0:
            listData = data.data;
            break;
        default:
            listData = [];
            break;
    }
    if(listData < 1)
    {
        $('.morning-schedule').html('今日无课表');
        $('.afternoon-schedule').html('').hide();
        return;
    }
 
        var amStr = '<ul>';
        $.each(listData,function(q,i){
            var stard,end;
            stard = (new Date(i.start*1000)).getHours()+':'+(new Date(i.start*1000)).getMinutes();
            end = (new Date(i.end*1000)).getHours()+':'+(new Date(i.end*1000)).getMinutes();
            amStr += '<li><i class="node-icon"></i><span class="fixed-width">'+stard+'-'+end+'</span><span>第'+i.order+'节</span><span>'+i.course_name+'（'+i.grade_name+'·'+i.class_room_name+'）</span></li>';
        });
        amStr += '</ul>';
        $('.morning-schedule').html(amStr);

}

function getWeekData()
{
    var data = getApi(getApiUrl+'/teacher/schedule/week?access_token='+sessionStorage.getItem('access_token'));
    if(data.code == 1 || data.code == 14){
       // showError(1,'该账号没有权限访问，请联系班级老师！','');return;
        $('.maskk,.no-access').show();
        $('.change-menu,.teach-my-schedule,.date-schedule').hide();
    }
    $.each(data.data.date,function(k,v)
    {
        var date = new Date(v.start*1000);
        
        amStardTime = (new Date(v.start*1000)).getHours()+':'+(new Date(v.start*1000)).getMinutes();
        apEndTime = (new Date(v.end*1000)).getHours()+':'+(new Date(v.end*1000)).getMinutes();
        console.log(date.getHours());

        var amStr = '<tr>';
        amStr += '<td data-id="'+v.lesson+'">'+amStardTime+'~'+apEndTime+'</td>';
        amStr += '</tr>';

        if(date.getHours() < 12)
        {
           
            $('.am tbody').append(amStr);
        }else{
            $('.pm tbody').append(amStr);
        }
    });

    $.each(data.data.schedule,function(q,w){
        $.each(w,function(e,r){
            var key = e += 1;
            var grade = r.grade_name ? r.grade_name :'';
            var calss = r.class_room_name ? r.class_room_name : '';
            tdStr = '<td><span>'+grade+'</span><span>'+calss+'</span></td>';
            $('td[data-id="'+key+'"]').parent().append(tdStr);
        });
    });
    
}

function getClassData(gid,cid,date)
{
    $.get(getApiUrl+'/teacher/schedule/class-room/schedule/day?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid+'&date='+date,function(data)
    {
        if(data.code == 1 || data.code == 14){
          //  showError(1,'该账号没有权限访问，请联系班级老师！','');return;
            $('.maskk,.no-access').show();
            $('.change-menu,.teach-my-schedule,.date-schedule').hide();
        }
        var listData;
        switch(data.code)
        {
            case 0:
                listData = data.data;
                break;
            default:
                listData = [];
                break;
        }
        if(listData < 1)
        {
            $('.morning-schedule').html('今日无课表');
            $('.afternoon-schedule').html('').hide();
            return;
        }
    
        var amStr = '<ul>';
        var grade_name = $('.select-room-list-part2 .active').text();
        var class_room_name = $('.classList .active').parent().text();
        $.each(listData,function(q,i){
            var stard,end;
            stard = (new Date(i.start*1000)).getHours()+':'+(new Date(i.start*1000)).getMinutes();
            end = (new Date(i.end*1000)).getHours()+':'+(new Date(i.end*1000)).getMinutes();
            amStr += '<li><i class="node-icon"></i><span class="fixed-width">'+stard+'-'+end+'</span><span>第'+i.lesson+'节</span><span>'+i.course+'（'+grade_name+'·'+class_room_name+'）</span></li>';
        });
        amStr += '</ul>';
        $('.morning-schedule').html(amStr);
    });
   
    
}

function getClassWeek(gid,cid)
{
    $.get(getApiUrl+'/teacher/schedule/class-room/schedule/week?access_token='+sessionStorage.getItem('access_token')+'&gid='+gid+'&cid='+cid,function(data)
    {
        if(data.code == 1 || data.code == 14){
            showError(1,'该账号没有权限访问，请联系班级老师！','');return;
        }
        $('.am tbody,.pm tbody').html('');
        $.each(data.data.date,function(k,v)
        {
            var date = new Date(v.start*1000);
            
            amStardTime = (new Date(v.start*1000)).getHours()+':'+(new Date(v.start*1000)).getMinutes();
            apEndTime = (new Date(v.end*1000)).getHours()+':'+(new Date(v.end*1000)).getMinutes();
            console.log(date.getHours());

            var amStr = '<tr>';
            amStr += '<td data-id="'+v.lesson+'">'+amStardTime+'~'+apEndTime+'</td>';
            amStr += '</tr>';

            if(date.getHours() < 12)
            {
            
                $('.am tbody').append(amStr);
            }else{
                $('.pm tbody').append(amStr);
            }
        });

        $.each(data.data.schedule,function(q,w){
            $.each(w,function(e,r){
                var key = e += 1;
                var grade = r.course_name ? r.course_name :'';
                //var calss = r.class_room_name ? r.class_room_name : '';
                tdStr = '<td><span>'+grade+'</span></td>';
                $('td[data-id="'+key+'"]').parent().append(tdStr);
            });
        });
    });
}