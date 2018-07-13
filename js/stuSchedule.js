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

    $('.schedule-nav ul').html(liStr).css('width',dateLength*2.1+'rem');

    $('.change-menu span').click(function(){//底部导航切换
        $('.change-menu span').removeClass('active');
        $(this).addClass('active');

        if($(this).hasClass('date')){
            $('.seatingChartBox').hide();
            $('.week-schedule').hide();
            $('.date-schedule').show();
        }else{
            $('.seatingChartBox').hide();
            $('.week-schedule').show();
            $('.date-schedule').hide();
            getWeekData();
        }
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
        navCenter(dataDate);
    });
})()

$('.date-change').on('click','li',function(){
    var dataDate = parseInt($(this).attr('data-date'));
    navCenter(dataDate);
});

//日期居中
function navCenter(date) {
    $('.schedule-date').text(year+'/'+month+'/'+date+'  '+getWeek(year,month-1,date));
    $('.date-change .active').removeClass('active');
    $('.date-change li[data-date="'+date+'"]').addClass('active');
    var leng = date*2.1-6.3;
    $(".date-change ul").css('margin-left','-'+leng+'rem');
    getData(year,month,date)
}

//获取日课表
function getData(y,m,d){
    var data = getApi(getApiUrl+'/student/schedule?access_token='+sessionStorage.getItem('access_token')+'&date='+y+'-'+m+'-'+d);
    var listData;
    switch(data.code)
    {
        case 0:
            listData = data.data;
            break;
        case 1: //账号不存在的情况
            $('.maskk,.no-access').show();
            $('.change-menu,.date-schedule').hide();
            break;
        default:
            listData = {"am":[],"pm":[]};
            break;
    }
    if((listData.am.length < 1) && (listData.pm.length < 1))
    {
        $('.morning-schedule').html('今日无课表');
        $('.afternoon-schedule').html('').hide();
        return;
    }
    $.each(listData,function(k,v){
        if(k == 'am'){
            var amStr = '<span>上午</span><ul>';
            $.each(v,function(q,i){
                var stard,end;
                stard = (new Date(i.start*1000)).getHours()+':'+addZero((new Date(i.start*1000)).getMinutes());
                end = (new Date(i.end*1000)).getHours()+':'+addZero((new Date(i.end*1000)).getMinutes());
                amStr += '<li data-teacher ="'+i.teacher_id+'" data-user ="'+i.user_id+'" data-order ="'+i.o+'" data-stard ="'+stard+'"><i class="node-icon"></i><span class="fixed-width">'+stard+'-'+end+'</span><span>第'+i.order+'节</span><span>'+i.course_name+'（'+i.grade_name+'·'+i.class_room_name+'）</span></li>';
            });
            amStr += '</ul>';
            $('.morning-schedule').html(amStr);

        }else if(k == 'pm'){
            var endStr = '<span>下午</span><ul>';
            $.each(v,function(q,i){
                var stard,end;
                stard = (new Date(i.start*1000)).getHours()+':'+addZero((new Date(i.start*1000)).getMinutes());
                end = (new Date(i.end*1000)).getHours()+':'+addZero((new Date(i.end*1000)).getMinutes());
                endStr += '<li data-teacher ="'+i.teacher_id+'" data-user ="'+i.user_id+'" data-order ="'+i.o+'" data-stard ="'+stard+'"><i class="node-icon"></i><span class="fixed-width">'+stard+'-'+end+'</span><span>第'+i.order+'节</span><span>'+i.course_name+'（'+i.grade_name+'·'+i.class_room_name+'）</span></li>';
            });
            endStr += '</ul>';
            $('.afternoon-schedule').html(endStr).show();
        }
    });
}

//点击日课表获取座位表
$('.afternoon-schedule').on('click','li',function(){
    var postData = {
        'teacher_id':$(this).attr('data-teacher'),
        'user_id':$(this).attr('data-user'),
        'order':$(this).attr('data-order'),
    }
    getPosition(postData);
});
$('.morning-schedule').on('click','li',function(){
    var postData = {
        'teacher_id':$(this).attr('data-teacher'),
        'user_id':$(this).attr('data-user'),
        'order':$(this).attr('data-order'),
    }
    $('.info-clock').html($(this).attr('data-stard'));
    getPosition(postData);
});


//少于10 加上0
function addZero(num){
    if(num <10){
        return '0'+num;
    }else{
        return num;
    }
}
function getPosition(postData){
    $.get(getApiUrl+'/student/schedule/seat?access_token='+sessionStorage.getItem('access_token'),postData,function(data){
        //var data = {
        //    "code": 0,
        //    "message": "Success",
        //    "data": {
        //        "seat": {
        //            "id": 10,
        //            "school_id": 1,
        //            "teacher_lesson_id": 46,
        //            "column": 2, //列数
        //            "row": 1, //行数
        //            "vertical": [ // 竖向通道
        //                {
        //                    "number": 1,
        //                    "type": 1
        //                },
        //                {
        //                    "number": 2,
        //                    "type": 2
        //                },
        //                {
        //                   "number": 5,
        //                    "type": 2
        //                }
        //            ],
        //            "cross": [ // 横向通道
        //                {
        //                    "number": 2,
        //                     "type": 3
        //                },
        //                {
        //                    "number": 3,
        //                    "type": 4
        //                }
        //            ],
        //            "order": 1,
        //            "orderBy": 1,
        //            "is_delete": 0,
        //            "created_at": 1511332333,
        //            "updated_at": 1511332338
        //        },
        //        "list": [
        //            [
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                {
        //                    "id": "26",
        //                    "grade_name": "高二",
        //                    "class_room_name": "一班",
        //                    "user_id": "254",
        //                    "teacher_id": "17",
        //                    "course_id": "19",
        //                    "course_name": "英语",
        //                    "username": "学生210",
        //                    "teacher_name": "刘慧敏",
        //                    "order": "1",
        //                    "seat": "0",
        //                    "sex": "0"
        //                },
        //                "{}",
        //                "{}",
        //                "{}"
        //            ],
        //            [
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}"
        //            ],
        //            [
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}"
        //            ],
        //            [
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}"
        //            ],
        //            [
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}"
        //            ],
        //            [
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}"
        //            ],
        //            [
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}",
        //                "{}"
        //            ]
        //        ],
        //        letter: [
        //            "A",
        //            "B",
        //            "C",
        //            "D",
        //            "E",
        //            "F",
        //            "G",
        //            "H",
        //            "I",
        //            "J",
        //            "K",
        //            "L",
        //            "M",
        //            "N",
        //            "O",
        //            "P",
        //            "Q",
        //            "R",
        //            "S",
        //            "T",
        //            "U",
        //            "V",
        //            "W",
        //            "X",
        //            "Y",
        //            "Z"
        //        ],
        //        position: {
        //            "1": "上方",
        //            "2": "下方",
        //            "3": "左侧",
        //            "4": "右侧"
        //        }
        //    }
        //};
        if(data.code == 0){
            $('.date-schedule').hide();
            $('.seatingChartBox').show();

            $('.seatingChartBox>p').html($('.schedule-date').text());

            var row = data.data.list.length; //行数
            var column = 0; //列数
            var str = '';

            $.each(data.data.list,function(a,b){
                column = b.length;
            });

            var globalPositionName = '';
            var globalCourseName = '';
            if(data.data.list){
                for(var i=1;i<=row; i++){
                    var spanStr = '';
                    for(var j=1;j<=column;j++){
                        if(typeof data.data.list[i-1][j-1] == "object"){
                            spanStr +='<span data-number="'+j+'" class="detailSpan">'+data.data.letter[j-1]+ i+'</span>';
                            globalPositionName = data.data.letter[j-1]+ i;
                            globalCourseName = data.data.list[i-1][j-1].course_name;
                        }else{
                            spanStr +='<span data-number="'+j+'"></span>';
                        }
                    }
                    str += '<li data-row="'+i+'">'+spanStr+'</li>';
                }
                $('.seating-list').html(str);

                if(data.data.seat){
                    $.each($('.seating-list li'),function(k,v){
                        $.each(data.data.seat.vertical,function(q,w){
                            if(w.type == 1){
                                $(v).find('span[data-number="'+ w.number+'"]').before('<label class="margin-left"></label>');
                            }else if(w.type == 2){
                                $(v).find('span[data-number="'+ w.number+'"]').after('<label class="margin-left"></label>');
                            }
                        });
                    $.each(data.data.seat.cross,function(m,n){
                            if(n.type == 2){
                                if($(v).attr('data-row') == n.number){
                                    $(v).before('<li class="margin-top"></li>');
                                }
                            }else if(n.type ==1){
                                if($(v).attr('data-row') == n.number){
                                    $(v).after('<li class="margin-bottom"></li>');
                                }
                            }
                        });
                    });
                }
            }else{
                $('.seating-list').html('暂时没有安排座位！');
            }
            $('.info-book').html(globalCourseName);
            $('.info-location').html(globalPositionName);
        }
    });
}
//获取周课表
function getWeekData(){
    var str = '';
    $('.am tbody').html('');
    $('.pm tbody').html('');
    var data = getApi(getApiUrl+'/student/schedule/week?access_token='+sessionStorage.getItem('access_token'));
    for(var i =1;i<=data.data[0].length;i++){
        var str ='<tr><td data-id ="'+i+'">'+i+'</td></tr>';
        if(i<5){
            $('.am tbody').append(str);
        }else{
            $('.pm tbody').append(str);
        }
    }
    $.each(data.data,function(k,v){
        $.each(v,function(m,n){
            var mm = m+1;
            var undefinedName =  n.course_name?n.course_name:'';
            var undefinedClass =  n.class_room_name?n.class_room_name:'';
            $('td[data-id="'+mm+'"]').parent().append('<td><span>'+ undefinedName+'</span><span>'+ undefinedClass+'</span></td>');

            if(n.grade_name){
                $('.schedule-week-head').html(n.grade_name);
            }else{
                $('.schedule-week-head').html('高二');
            }
        });
    });
}
pushHistory();
function pushHistory() {
    var state = {
        title: "title",
        url: "#"    };
    window.history.pushState(state, "title", "#");
};
window.onpopstate = function() {
    if($('.seatingChartBox').is(":visible")){
        $('.seatingChartBox').hide();
        $('.date-schedule').show();
    }
};
