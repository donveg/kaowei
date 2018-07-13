(function(){
    var gloabalDormList;
    if(GetQueryString('select')==1){
        $('.info-list').hide();
        $('.change-role span').removeClass('active');
        $('.choiceCourse-icon').parent().addClass('active');
        $('.choice-course').show();
        $('.headerr').hide();
        getCourseData();
    }
    globalArr = [];
    getPersonInfo();
    $('.change-menu span').click(function(){
        $('.my-choose-course').hide();
        $('.change-menu span').removeClass('active');
        $(this).addClass('active');

        if($(this).find('i').hasClass('person-icon')){
            $('.choice-course').hide();
            $('.info-list').show();
        }else if($(this).find('i').hasClass('choiceCourse-icon')){
            if(!getExitCourse()){
                $('.choice-course').show();
                $('.info-list').hide();
                getCourseData();
            }else{
                $('.mask,.warming-box,.screen-course,.choice-course,.info-list').hide();
            }
        }
    });
})()
//获取是否有选课成功
function getExitCourse(){
    var flag = true;
    $.get(getApiUrl+'/student/schedule/select/my?access_token='+sessionStorage.getItem('access_token'),function(data2){
        if(data2.data.length == undefined){
            $('.mask,.warming-box,.screen-course,.choice-course').hide();
            $('.my-choose-course').show();
            $.each(data2.data.select,function(m,n){
                $(".my-choose-course ul li[data-id="+m+"]").show();
            });
        }else{
            $('.headerr').hide();
            $('.screen-course,.choice-course').show();
            flag = false;
        }
    });
    return flag;
}
//获取老师推荐的排课组合
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
    var noStr = '';
    var change = listData.course;
   // var change ={20: "物理", 21: "化学", 22: "生物", 23: "地理", 24: "历史", 25: "政治"};
    if(listData.schoolRecommended.length == undefined){
        $.each(listData.schoolRecommended,function(m,n){
            if(parseInt(n.max) > parseInt(n.number)){
                globalArr = n.course;
                str += '<p><label data-keyid = "'+ n.course+'">'+change[n.course[0]] +'+'+ change[n.course[1]]+'+'+ change[n.course[2]]+'</label>&nbsp;（<i>'+ n.number+'</i>/'+ n.max+'）<span class="checked-icon"></span></p>';
            }else{
                globalArr = n.course;
                noStr += '<p><label data-keyid = "'+ n.course+'">'+change[n.course[0]] +'+'+ change[n.course[1]]+'+'+ change[n.course[2]]+'</label>&nbsp;（<i>'+ n.number+'</i>/'+ n.max+'）</p>';
            }

            $('.teacher-tui').html(str + noStr);
        });
    }else{
    }
}

//选择老师推荐课程组合
$('.teacher-tui').on('click','span',function(){
    $('.teacher-tui span').removeClass('active');
    $(this).addClass('active');
    $('.warming-box h2').attr('data-keyid',$(this).parent().find('label').attr('data-keyid'));
    $('.warming-box h2').html($(this).parent().find('label').text());
    $('.mask,.warming-box').show();
});

//获取个人信息资料
function getPersonInfo(){
    $.get(getApiUrl+'/dashboard?access_token='+sessionStorage.getItem('access_token'),function(data){
        if(data.code == 1){
           //账号不存在的情况
            $('.maskk,.no-access').show();
            $('.change-menu,.info-list').hide();
        }
        if(data.data){
            if(data.data.face){
                $('.info-img img').attr('src',data.data.face);
            }else{
                $('.info-img img').attr('src','../images/head.png');
            }
            $('.info-realname').html(data.data.username);
            $('.info-sex').html(data.data.genders[data.data.gender]);
            $('.info-school').html(data.data.school_name);
            $('.info-grade').html(data.data.grade_name);
            if(data.address){
                $('.info-address').html(data.data.address);
            }else{
                $('.info-address').html('暂未填写地址信息');
            }
            if(data.data.mobile){
                $('.info-phone').html(data.data.mobile);
            }else{
                $('.info-phone').html('暂未填写');
            }
            if(data.data.email){
                $('.info-email').html(data.data.email);
            }else{
                $('.info-email').html('暂未填写');
            }
            $('.info-username').html(data.data.account);
        }
    });
    var iconText = {'物理':'wu','化学':'hua','生物':'sheng','政治':'zheng','地理':'di','历史':'shi'};
    $.get(getApiUrl+'/student/schedule/select?access_token='+sessionStorage.getItem('access_token'),function(data){
        var str ='';
        $.each(data.data.course,function(a,b){
            str += '<li data-id="'+a+'"><i class="'+iconText[b]+'" ></i><span>'+b+'</span></li>';
        });
        $('.addMySelect').html(str);
    });
}

//点击重选
$('.btn-reelect').click(function(){
    $(".six-choose-three input").attr("checked",false);
    $('.teacher-tui p').removeClass('active');
    $('.mask,.warming-box').hide();
    $('.screen-course').show();
});
//点击提交
$('.btn-refer').click(function(){
    $(".my-choose-course ul li").hide();
    var course_id = $('.warming-box h2').attr('data-keyid');
    var courseArr = course_id.split(",");
    var arr = $('.six-choose-three input:checked').serialize();
    var data = getApi(getApiUrl+'/student/schedule/select/update?access_token='+sessionStorage.getItem('access_token'),{'course_id':courseArr});
    if(data.code == 0){
        $('.mask,.warming-box,.screen-course,.choice-course').hide();
        $('.my-choose-course').show();
        $.get(getApiUrl+'/student/schedule/select/my?access_token='+sessionStorage.getItem('access_token'),function(data){
            $.each(data.data.select,function(m,n){
                $(".my-choose-course ul li[data-id="+m+"]").show();
            });
        });
    }
});

//重新选择课程组合
$('.btn-re-selection').click(function(){
    $('.choice-course').show();
    $('.my-choose-course ,.info-list').hide();
    getCourseData();
});



