password = false;
username = false;
(function(){
    $('.username').blur(function(){
        var usernameVal = $(this).val();
      //  var usernameRegex = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        var usernameRegex = /^[0-9a-zA-Z]*$/;

        if(!usernameRegex.test(usernameVal)){
            showError('.error-info','请正确填写',2);
            username = false;
            buttonOk();
            return;
        }
        username = true;
        showError('.error-info','',2);
        buttonOk();
    });

    $('.password').keyup(function(){
        var passwordRegex = /^[0-9a-zA-Z]*$/;
        var passwordVal = $(this).val();
        if((passwordVal.length < 6) || (passwordVal.length > 12))
        {
            showError('.error-info','密码必须在6-12位',2);
            password = false;
            buttonOk();
            return;
        }
        if(!passwordRegex.test(passwordVal)){
            showError('.error-info','密码必须由字母，数字组成',2);
            buttonOk();
            return;
        }

        showError('.error-info','',2);
        password = true;
        buttonOk();
    });

    //点击提交按钮
    $('.bind-btn button').click(function(){
        sendPost();
    });
})()

function buttonOk()
{
    console.log('密码'+password+'账号'+username);
    if(password && username){

        $('button').removeAttr('disabled');
    }else{
        $('button').attr('disabled','disabled');
    }
    
}
function sendPost(){
    var returnData = getApi(getTokenUrl+'/user/userbinding',{'name':$('.username').val(),'pass':$('.password').val(),'code':sessionStorage.getItem('code')});
    switch(returnData.code)
    {
        case 200:
		if(returnData.type == 1 || returnData.type == 3){ //学生
			if(sessionStorage.getItem("id")==1){
				window.location.href = '/stuSchedule.html';
			}else if(sessionStorage.getItem("id")==2){
				window.location.href = '/punchClock.html';
			}else if(sessionStorage.getItem("id")==3){
				window.location.href = '/setting-info.html';
			}else if(sessionStorage.getItem("id")==4){
                window.location.href = '/stuDormClock.html';
            }
        }else if(returnData.type == 2){ //老师
			if(sessionStorage.getItem("id")==1){
					window.location.href = '/teacherSchedule.html';
				}else if(sessionStorage.getItem("id")==2){
					window.location.href = '/teacherCheck.html';
				}else if(sessionStorage.getItem("id")==3){
					window.location.href = '/setting-info-teacher.html';
				}else if(sessionStorage.getItem("id")==4){
                    window.location.href = '/teacherDormCheck.html';
                }
			}else if(returnData.type == 10){ //宿管
                if(sessionStorage.getItem("id")==1){
                    window.location.href = '/teacherSchedule.html';
                }else if(sessionStorage.getItem("id")==2){
                    window.location.href = '/teacherCheck.html';
                }else if(sessionStorage.getItem("id")==3){
                    window.location.href = '/setting-info-housemaster.html';
                }else if(sessionStorage.getItem("id")==4){
                    window.location.href = '/dormCheck.html';
                }
             }
            sessionStorage.setItem("access_token",returnData.token);
            break;
        case 201:
            showError('.error-info','绑定失败',2);
            break;
        case 202:
            showError('.error-info','密码错误',2);
            break;
        case 203:
            showError('.error-info','账号不存在',2);
            break;
        default:
            showError('.error-info','系统故障',2);
            break;

    }
}