(function(){
    var gloabalDormList;
    if(GetQueryString('select')==1){
        $('.info-list').hide();
        $('.change-role span').removeClass('active');
        $('.choiceCourse-icon').parent().addClass('active');
        $('.choice-course').show();
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
            $('.info-list').hide();
            window.location.href="../teacher-dorm-notice.html";
            //if(!getExitCourse()){
            //    $('.choice-course').show();
            //    $('.info-list').hide();
            //    getCourseData();
            //}else{
            //    $('.mask,.warming-box,.screen-course,.choice-course,.info-list').hide();
            //}
        }
    });


})()

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
}






