(function(){
    change ={};
    getCourseList();
    getCourseData();
    $('.change-role span:last-child').addClass('active');
    $('.change-role span').click(function(){
        $('.change-role span').removeClass('active');
        $(this).addClass('active');

        if($(this).find('i').hasClass('person-icon')){
            $('.choice-course').hide();
            $('.screen-course').show();
        }else{
            $('.choice-course').show();
            $('.info-list').hide();
        }
    });

    var iconText = {'物理':'wu','化学':'hua','生物':'sheng','政治':'zheng','地理':'di','历史':'shi'};
    $.get(getApiUrl+'/student/schedule/select?access_token='+sessionStorage.getItem('access_token'),function(data){
        change = data.data.course;
        var str ='';
        $.each(data.data.course,function(a,b){
            str += '<li data-id="'+a+'"><i class="'+iconText[b]+'" ></i><span>'+b+'</span></li>';
        });
        $('.addMySelect').html(str);
    });

})()

function getCourseList(){
    $.get(getApiUrl+'/student/schedule/select/more?access_token='+sessionStorage.getItem('access_token'),function(data){
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
        var str ='';
        var strr = '';
        //循环6选3
        $.each(listData.course,function(m,n){
            str += '<li><input name="course_id[]" type="checkbox" value="'+ m+'"/>'+ n+'</li>';
            $('.six-choose-three').html(str);
        });
        //循环20种组合
        $.each(listData.combination,function(x,y){
            strr += '<p><span data-id="'+y[0]+'" class="sub1">'+change[y[0]]+'</span>+<span data-id="'+y[1]+'" class="sub2">'+change[y[1]]+'</span>+<span data-id="'+y[2]+'" class="sub3">'+change[y[2]]+'</span><span class="checked-icon"></span></p>';
            $('.screen-after-list').html(strr);
        });
    });
}

//6选3课程组合列表
$('.six-choose-three').on('click','li',function(){
    $(this).find('input').click();
});
$('.six-choose-three').on('click','li input',function(){
    $(this).click();
});
$('.six-choose-three').on('click','input',function(){
    var value = new Array();
    $.each($('.six-choose-three input:checked'),function()
    {
        value.push($(this).val());
        if(value.length>3){
            $('.error-info').html('学生选课只能选择3个课程');
        }else{
            $('.error-info').html('');
        }
    });

    $.each($('.screen-after-list p'), function () {
        var i = 0;
        $.each($(this).find('span'),function(k,v){
            i += cacheData($(v).attr('data-id'),value);
        });
        if(i != value.length){
            $(this).hide();
        }else{
            $(this).show();
        }
    })

});


function cacheData(id,arr)
{
    var i = 0;
    $.each(arr,function(k,v){
        if(id == v){
            ++i;
        }
    });
    return i;
}

//获取筛选后的课程组合列表
function getCourseData(){
    var data = getApi(getApiUrl+'/student/schedule/select?access_token='+sessionStorage.getItem('access_token'));
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
    var str ='';

    //$.each(listData.schoolRecommended,function(m,n){
    //    str += '<p><span data-id="'+n.course[0]+'">'+change[n.course[0]] +'</span>+<span data-id="'+n.course[1]+'">'+ change[n.course[1]]+'</span>+<span data-id="'+n.course[2]+'">'+ change[n.course[2]]+'</span>&nbsp;（<i>'+ n.number+'</i>/'+ n.max+'）<span class="checked-icon"></span></p>';
    //    $('.screen-after-list').html(str);
    //});
}
//点击筛选的课程
$('.screen-after-list').on('click','p .checked-icon',function(){
    $('.screen-after-list p span').removeClass('active');
    $(this).addClass('active');
    var value = new Array();
    $.each($(this).parent().find('span'), function (k,v) {
        if($(v).attr('data-id')){
            value.push($(v).attr('data-id'));
        }
    });
    $('.six-choose-three input').prop("checked", false);
    $.each(value,function(k,v){
        $('.six-choose-three input[value="'+v+'"]').prop("checked", true);
    });
    $('.warming-box h2').html($(this).parent().find('.sub1').text()+'+'+$(this).parent().find('.sub2').text()+'+'+$(this).parent().find('.sub3').text());
    $('.mask,.warming-box').show();

});
//点击提交选课
$('.submit-choose-course span').click(function(){
    var value = new Array();
    $.each($('.six-choose-three input:checked'),function() {
        value.push($(this).val());
        if(value.length == 3){
            $('.warming-box h2').html(change[value[0]]+'+'+change[value[1]]+'+'+change[value[2]]);
            $('.mask,.warming-box').show();
        }
    });
});

//点击重选
$('.btn-reelect').click(function(){
    $(".six-choose-three input").attr("checked",false);
    $('.screen-after-list p span').removeClass('active');
    $('.mask,.warming-box').hide();
    $('.screen-course').show();
});
//点击提交
$('.btn-refer').click(function(){
    var arr = $('.six-choose-three input:checked').serialize();
    var data = getApi(getApiUrl+'/student/schedule/select/update?access_token='+sessionStorage.getItem('access_token'),arr);
    if(data.code == 0){
        $('.mask,.warming-box,.screen-course').hide();
        $('.my-choose-course').show();
        $.get(getApiUrl+'/student/schedule/select/my?access_token='+sessionStorage.getItem('access_token'),function(data2){
            $.each(data2.data.select,function(m,n){
                $(".my-choose-course ul li[data-id="+m+"]").show();
            });
        });
    }
});

//重新选择课程组合
$('.btn-re-selection').click(function(){
    window.location.href='/setting-info.html?select=1';
    $('.change-role span:last-child').click();
    $('.choice-course').show();
    $('.my-choose-course ,.info-list').hide();
    getCourseData();
});
