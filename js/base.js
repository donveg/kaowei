var myDate = new Date();
year  = myDate.getFullYear();
month = parseInt(myDate.getMonth())+1;
date = myDate.getDate();
sessionStorage.setItem("access_token",'152531781188vczp');
getTokenUrl = 'http://weixinphp.sostudy.cn';
getApiUrl = 'http://scheduleweixinapi.sostudy.cn';
//getApiUrl = 'http://192.168.1.119:84';
getSockUrl = 'ws://101.201.28.83:86';
//getSockUrl ='ws://192.168.1.119:9502';
function getApi(url,data){
    $.ajaxSetup({ 
        async : false
    });
    var returnData; 
    $.post(url,data,function(data){
        if(typeof(data) != "object")
        {
            data = JSON.parse(data);
        }
        
        /*if(returnData.code != 200){
            showError('','服务器错误',3);
        }*/

        returnData = data;
    });
    return returnData;
}


//type:1=弹框,2=dom元素内,3=alert
function showError(position,msg,type){

    if(type == 2)
    {
        $(position).text(msg);
    }

    if(type == 1)
    {
        var errorStr = '<section>\
        <div class="maskk"></div>\
        <div class="no-access">\
            <p>'+msg+'</p>\
        </div>\
    </section>';
        //var errorStyle = '';
        $('body').html(errorStr);

    }

    if(type == 3)
    {
        alert(msg);
    }
}

function DayNumOfMonth(Year,Month)
{
    var day = new Date(Year,Month,0);
    return day.getDate();
}

function getWeek(y,m,d)
{
    var week;
    if(new Date(y,m,d).getDay()==0)          week="星期日";
    if(new Date(y,m,d).getDay()==1)          week="星期一";
    if(new Date(y,m,d).getDay()==2)          week="星期二";
    if(new Date(y,m,d).getDay()==3)          week="星期三";
    if(new Date(y,m,d).getDay()==4)          week="星期四";
    if(new Date(y,m,d).getDay()==5)          week="星期五";
    if(new Date(y,m,d).getDay()==6)          week="星期六";
    return week;
}

//获取地址栏参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function getMonthWeek(a, b, c)
{
    /*
     a = d = 当前日期
     b = 6 - w = 当前周的还有几天过完(不算今天)
     a + b 的和在除以7 就是当天是当前月份的第几周
     */
    var date = new Date(a, parseInt(b) - 1, c),
        w = date.getDay(),
        d = date.getDate();
    return Math.ceil((d + 6 - w) / 7);
};

function getTime(n){
    var now=new Date();
    var year=now.getFullYear();
//因为月份是从0开始的,所以获取这个月的月份数要加1才行
    var month=now.getMonth()+1;
    var date=now.getDate();
    var day=now.getDay();
    console.log(date);
//判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
    if(day!==0){
        n=n+(day-1);
    }
    else{
        n=n+day;
    }
    if(day){
//这个判断是为了解决跨年的问题
        if(month>1){
            month=month;
        }
//这个判断是为了解决跨年的问题,月份是从0开始的
        else{
            year=year-1;
            month=12;
        }
    }
    now.setDate(now.getDate()-n);
    year=now.getFullYear();
    month=now.getMonth()+1;
    date=now.getDate();
    console.log(n);
    s=year+"年"+(month<10?('0'+month):month)+"月"+(date<10?('0'+date):date)+"日";
    return s;
}

//解除绑定
$('#loginOut').click(function(){
    loginOut();
});

function loginOut(){
    $.get(getTokenUrl+'/user/loginout?access_token='+sessionStorage.getItem('access_token'),function(data){
        data = JSON.parse(data);
        if(data.code ==200){
            window.location.href = '/bind-account.html';
        }else{
            $('#unbind').fadeIn();
            setTimeout("$('#unbind').fadeOut()", 1000 );
        }
    });
}