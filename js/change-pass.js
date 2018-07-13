var password,newPassworda,newPasswordb = false;
(function(){
    passwordRegex = /^[0-9a-zA-Z]*$/;
    $('.password').blur(function(){
        var passwordVal = $(this).val();
        if((passwordVal.length < 6) || (passwordVal.length > 12))
        {
            showError('.error-info','密码必须在6-12位',2);
            password = false;
            return;
        }

        if(!passwordRegex.test(passwordVal)){
            showError('.error-info','密码必须由字母，数字组成',2);
            password = false;
            return;
        }

        showError('.error-info','',2);
        password = true;
    });

    $('.passworda').focus(function(){
        $('button').attr('disabled','disabled');
        showError('.error-info','密码必须由字母，数字组成',2);
    });
    $('.passworda').keydown(function(){
        showError('.error-info','',2);
    });

    $('.passworda').blur(function(){
        var passwordVal = $(this).val();
        if((passwordVal.length < 6) || (passwordVal.length > 12))
        {
            showError('.error-info','密码必须在6-12位',2);
            newPassworda = false;
            return;
        }
        if(!passwordRegex.test(passwordVal)){
            showError('.error-info','密码必须由字母，数字组成',2);
            newPassworda = false;
            return;
        }

        showError('.error-info','',2);
        newPassworda = true;
    });

    $('.passwordb').keyup(function(){
        var passwordVal = $(this).val();
        if((passwordVal.length >=6) ||  (passwordVal == $('.passworda').val()))
        {
            showError('.error-info','',2);
            newPasswordb = true;
            buttonOk();
            return;
        }
        if(passwordVal.length >=6)
        {
            showError('.error-info','两次密码不一致',2);
            newPasswordb = false;
        }
        
        return;
    });
})()

function buttonOk()
{
    var passwordAgre = false;

    if($('.passworda').val() != $('.passwordb').val()){
        showError('.error-info','两次密码不一致',2);
    }else{
        passwordAgre = true;
    }
    if(password && newPassworda && newPasswordb && passwordAgre){
        $('button').removeAttr('disabled');
    }else{
        $('button').attr('disabled','disabled');
    }
    
}