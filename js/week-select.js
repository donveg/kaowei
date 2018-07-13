(function(){
    currentYear = year;
    currentMonth = month;
    startDAy = '';
    endDAy = '';
    weekSelect ='';daySelect1='';daySelect2 = '';
    setDateMonth(year,month);
})()

//统计月份选择插件确定
function setDateMonth(y,m)
{
    year = y;
    month = m;
    $('.date-select-month label').html(y+'年'+m+'月');
}
//点击选择年月
/*$('.date-select-monthh').click(function(){
    timeDatePick2('.date-select-monthh');
});*/

//点击选择周

$('.week-select-month').click(function(event){
    newWeekArray = new Array;
    event.stopPropagation();
    $('.maskk,.select-week-total-box').show();
    var dayNumber = DayNumOfMonth(currentYear,currentMonth);
    if(currentYear == globalYear && currentMonth < globalMonth){

    }
    var week = 0;
    var aa = 0;
    var str ='';
        for(var i =1; i<=dayNumber;i++){
            if(i%7 ==0){
                aa +=1;
                var j =0;
                if(aa ==1){
                    j=1;
                }else{
                    j = i-6;
                }
                if(newWeekArray[aa] == undefined){
                    newWeekArray[aa] = new Array;
                }
                newWeekArray[aa].push(i);
                if(aa == currentWeek){
                    str += '<li><span><i>第<span>' + aa + '</span>周</i>（<b class="start">'+j+'</b>日-<b class="end">'+i+'</b>日）</span><label class="checked-icon active"></label></li>';
                }
               // else if(aa > globalWeekk){
               //     str += '<li><span><i>第<span>' + aa + '</span>周</i>（<b class="start">'+j+'</b>日-<b class="end">'+i+'</b>日）</span></li>';
               // }
                else{
                    str += '<li><span><i>第<span>' + aa + '</span>周</i>（<b class="start">'+j+'</b>日-<b class="end">'+i+'</b>日）</span><label class="checked-icon"></label></li>';
                }
            }else if((i==29) && (dayNumber ==29)){
                var ab = aa+1;
                if(newWeekArray[ab] == undefined){
                    newWeekArray[ab] = new Array;
                }
                newWeekArray[ab].push(29);
                if(ab == currentWeek){
                    str += '<li><span><i>第<span>' + ab + '</span>周</i>（<b class="start">'+i+'</b>日）</span><label class="checked-icon active"></label></li>';
                }
               // else if(ab > globalWeekk){
               //     str += '<li><span><i>第<span>' + ab + '</span>周</i>（<b class="start">'+i+'</b>日）</span></li>';
               // }
                else{
                    str += '<li><span><i>第<span>' + ab + '</span>周</i>（<b class="start">'+i+'</b>日）</span><label class="checked-icon"></label></li>';
                }
            }
        }
        if(dayNumber > 29) {
            var ab = aa + 1;
            if(newWeekArray[ab] == undefined){
                newWeekArray[ab] = new Array;
            }
            newWeekArray[ab].push(dayNumber);
            if(ab == currentWeek){
                str += '<li><span><i>第<span>' + ab + '</span>周</i>（<b class="start">29</b>日-<b class="end">' + dayNumber + '</b>日）</span><label class="checked-icon active"></label></li>';
            }
           // else if(ab > globalWeekk){
            //    str += '<li><span><i>第<span>' + ab + '</span>周</i>（<b class="start">29</b>日-<b class="end">' + dayNumber + '</b>日）</span></li>';
          //  }
            else{
                str += '<li><span><i>第<span>' + ab + '</span>周</i>（<b class="start">29</b>日-<b class="end">' + dayNumber + '</b>日）</span><label class="checked-icon"></label></li>';
            }
           
        }
    $('.select-week-list-box ul').html(str);
    hideWeek();
});

function hideWeek()
{
    $.each(newWeekArray,function(k,v){
        if(k >= 2){
            if((date < newWeekArray[k-1]) && (currentYear >= globalYear) && (currentMonth >= globalMonth)){
                $('.select-week-list-box li').eq(k-1).find('label').remove();
            }
        }
    });
}

//选中第几周
$('.select-week-list-box').on('click','ul li',function(event){
    if(!$(this).has('label').length){
        alert('不可以选择时间');
        $('.maskkk,.maskk,.select-week-total-box').hide();
        return;
    }

    event.stopPropagation();
    currentWeek = parseInt($(this).find('span i span').html());
    $('.select-week-list-box li label').removeClass('active');
    $(this).find('label').addClass('active');
    $('.maskkk,.maskk,.select-week-total-box').hide();
    $('.week-select-month label').html($(this).find('span i').text());
    weekSelect = $(this).find('span i span').text();
    daySelect1 = $(this).find('span .start').text();
    daySelect2 = $(this).find('span .end').text();
    startDAy = currentYear+'-'+currentMonth +'-'+$(this).find('span .start').text();
    endDAy = currentYear+'-'+currentMonth +'-'+$(this).find('span .end').text();
});

//点击保存按钮
$('.save-button button').click(function(){
    $('.totalNumber').show();
    $('.sselct-choose-week-list').hide();
    if(!daySelect1){
        $('.week-list p:first-child label').html('第'+currentWeek+'周（'+globalMonth+'月'+defaultStartDay+'日~'+globalMonth+'月'+defaultEndDay+'日）');
        weekSelect = currentWeek;
    }else{
        $('.week-list p:first-child label').html('第'+weekSelect+'周（'+currentMonth+'月'+daySelect1+'日~'+currentMonth+'月'+daySelect2+'日）');
    }
    if(weekSelect > globalWeekk){
        $('.week-list button .after-w-icon').parent().removeAttr('disabled');
    }else if(weekSelect == globalWeekk){
        $('.week-list button .before-w-icon').parent().removeAttr('disabled');
        $('.week-list button .after-w-icon').parent().attr('disabled','disabled');
    }else if(weekSelect == 1){
        $('.week-list button .after-w-icon').parent().removeAttr('disabled');
        $('.week-list button .before-w-icon').parent().attr('disabled','disabled');
    }else{
        $('.week-list button .before-w-icon').parent().removeAttr('disabled');
        $('.week-list button .after-w-icon').parent().removeAttr('disabled');
    }
    getTotalData2(currentMonth,startDAy,endDAy);
});

// 点击空白处隐藏弹出窗口
$(document).click(function(event){
    var _con = $('.select-week-total-box');
    if(!_con.is(event.target) && _con.has(event.target).length === 0){
        $('.maskk ,.maskk,.select-week-total-box').fadeOut();
    }
});



