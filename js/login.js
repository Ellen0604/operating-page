
/************************************  登陆验证手机  **************************/
var initLogin=function(){
	var InterValObj;
	var count = 60; //间隔秒
    var curCount=0;//倒数秒    
    //timer处理函数
    function SetRemainTime() {
    	if (curCount == 0) {
            clearInterval(InterValObj);
            setGetCodeBtn();
            $("#btn_getvcode").val("重新获取");
    	}else {
            curCount--;
            $("#btn_getvcode").val("" + curCount + "s");
    	};
    };
    //检查是否全输入正确
    function testAllInput(){
    	var vcode = $.trim($('#inp_vcode').val());
    	var mobile = $.trim($('#inp_mobile').val());    
    	if(/^1\d{10}$/.test(mobile) && /^\d{4}$/.test(vcode)) {
			$('#btn_submit').removeAttr("disabled");
		}else{
			$('#btn_submit').attr("disabled","true");
		};
    };
    //设置按钮状态
    function setGetCodeBtn(){
    	var mobile = $.trim($('#inp_mobile').val());
    	if(curCount<=0){
	    	if(/^1\d{10}$/.test(mobile)) {
				$('#btn_getvcode').removeAttr("disabled");
			}else{
				$('#btn_getvcode').attr("disabled","true");
			};
		};
    };
    //发送验证码
    var sendCode=function($ts,mobile){    	
        CF.showLoading(true);
        CF.call(_ApiRoot_+"users/sendsms",{"telephone":mobile,"type":3},function(result){
        	console.log(JSON.stringify(result));
        	if(result.code==200){ 
        		if(result.tips) CF.showTips(result.tips); else CF.showTips("验证码发送成功");          		
        	}else{
        		if(result.tips) CF.showTips(result.tips);
        	};
        	curCount = count;
			$ts.attr("disabled", "true");
	        $ts.val("" + curCount + "s");
	        InterValObj = window.setInterval(SetRemainTime, 1000);
        });
    };
    //检查手机输入
    $("#inp_mobile").on("input propertychange",function(){    	    	
    	setGetCodeBtn();
		testAllInput();
    });
    //检查验证码输入
    $("#inp_vcode").on("input propertychange",function(){
    	testAllInput();
    });
    //获取验证码按钮
    $('#btn_getvcode').click(function(event) {
        var $ts=$(this);
    	var mobile = $.trim($('#inp_mobile').val());
    	if(mobile == '') {
			CF.showTips('请输入手机号码！');
			return false;
		} else if(!/^1\d{10}$/.test(mobile)) {
			CF.showTips('手机号码格式有误，请重新输入！');
			return false;
		};
		sendCode($ts,mobile);//发送验证码		
    });
    function registerTel(){
    	var vcode = $.trim($('#inp_vcode').val());
    	var mobile = $.trim($('#inp_mobile').val());
		var psw="";		
		var pdata={"telephone":mobile,"code":vcode,"password":psw,"system":3};
		var wxdata=JSON.parse(CF.localData("51laizhan_weixinData"));
		pdata.openid=wxdata.openid;
		pdata.nick_name=wxdata.nickname;
		pdata.upfile=wxdata.headimgurl;
		pdata.type=2;
		CF.showLoading(1);
		CF.call(_ApiRoot_+"connects",pdata,function(result){
			console.log(result);
			if(result.code==200){
				CF.localData("51laizhan_userData",JSON.stringify(result.data));
				CF.localData("51laizhan_auth_key",result.data.auth_key);
				if (result.data.cyberbar_id>0) {
					CF.showTips("验证成功！",null,function(){
						var loginfrom=CF.localData("51laizhan_loginFrom");
						loginfrom=loginfrom?loginfrom:"index.html";
						location.replace(loginfrom);
					});
				}
				else{ 
					CF.showTips("该用户未绑定网吧管理员");
				}
			}else{
        		if(result.tips) CF.showTips(result.tips);
        	};
		},function(errCode){
			 CF.showTips("ERROR:"+errCode);
		});
	};
	//提交
	$('#btn_submit').click(function(){
	    var mobile = $.trim($('#inp_mobile').val());
	    var code = $.trim($('#inp_vcode').val());
	    //验证手机是否可用
		CF.localData("51laizhan_telephone",mobile);
		CF.localData("51laizhan_code",code);
		CF.showLoading(1);
		CF.call(_ApiRoot_+"connects/telephone-exist",{"telephone":mobile,"code":code},function(result){
			console.log(JSON.stringify(result));
			if(result.code==200){
				console.log(JSON.stringify(result));
				if(result.data){
					if(result.data.count && result.data.count>0){
						//CF.reURL("login_psw.html?tel="+mobile+"&code="+code+"&ht=1");
						registerTel();
					}else{
						//CF.reURL("login_psw.html?tel="+mobile+"&code="+code);
						registerTel()
					};
				};
			}else{
        		if(result.tips) CF.showTips(result.tips);
        	};
		},function(errCode){
			 CF.showTips("ERROR:"+errCode);
		});
	});
};

/************************************  绑定手机  **************************/
var initBindPhone=function(){
	var InterValObj;
	var count = 60; //间隔秒
    var curCount=0;//倒数秒    
    //timer处理函数
    function SetRemainTime() {
    	if (curCount == 0) {
            clearInterval(InterValObj);
            setGetCodeBtn();
            $("#btn_getvcode").val("重新获取");
    	}else {
            curCount--;
            $("#btn_getvcode").val("" + curCount + "s");
    	};
    };
    //检查是否全输入正确
    function testAllInput(){
    	var vcode = $.trim($('#inp_vcode').val());
    	var mobile = $.trim($('#inp_mobile').val());    
    	if(/^1\d{10}$/.test(mobile) && /^\d{4}$/.test(vcode)) {
			$('#btn_submit').removeAttr("disabled");
		}else{
			$('#btn_submit').attr("disabled","true");
		};
    };
    //设置按钮状态
    function setGetCodeBtn(){
    	var mobile = $.trim($('#inp_mobile').val());
    	if(curCount<=0){
	    	if(/^1\d{10}$/.test(mobile)) {
				$('#btn_getvcode').removeAttr("disabled");
			}else{
				$('#btn_getvcode').attr("disabled","true");
			};
		};
    };
    //发送验证码
    var sendCode=function($ts,mobile){    	
        CF.showLoading(true);
        CF.call(_ApiRoot_+"users/sendsms",{"telephone":mobile,"type":1},function(result){
        	console.log(JSON.stringify(result));
        	if(result.code==200){
        		if(result.tips) CF.showTips(result.tips); else CF.showTips("验证码发送成功");          		
        	}else{
        		if(result.tips) CF.showTips(result.tips);
        	};
        	curCount = count;
			$ts.attr("disabled", "true");
	        $ts.val("" + curCount + "s");
	        InterValObj = window.setInterval(SetRemainTime, 1000);
        });
    };
    //检查手机输入
    $("#inp_mobile").on("input propertychange",function(){    	    	
    	setGetCodeBtn();
		testAllInput();
    });
    //检查验证码输入
    $("#inp_vcode").on("input propertychange",function(){
    	testAllInput();
    });
    //获取验证码按钮
    $('#btn_getvcode').click(function(event) {
        var $ts=$(this);
    	var mobile = $.trim($('#inp_mobile').val());
    	if(mobile == '') {
			CF.showTips('请输入手机号码！');
			return false;
		} else if(!/^1\d{10}$/.test(mobile)) {
			CF.showTips('手机号码格式有误，请重新输入！');
			return false;
		};
		sendCode($ts,mobile);//发送验证码		
    });
	//提交
	$('#btn_submit').click(function(){
	    var mobile = $.trim($('#inp_mobile').val());
	    var code = $.trim($('#inp_vcode').val());
	    //验证手机是否可用
		CF.localData("51laizhan_telephone",mobile);
		CF.localData("51laizhan_code",code);
		CF.call(_ApiRoot_+"users/update-telephone?auth_key="+_authKey_,{"telephone":mobile,"code":code},function(result){
			if(result.code==200){
				console.log(JSON.stringify(result));
				CF.showTips(result.tips,null,function(){
					var ud=CF.localData("51laizhan_userData");
					if(ud){
						ud=JSON.parse(ud);
						ud.telephone=mobile;
						CF.localData("51laizhan_userData",JSON.stringify(ud));
					};
	        		history.back();
	        	});
			}else{
        		if(result.tips) CF.showTips(result.tips);
        	};
		},function(errCode){
			 CF.showTips("ERROR:"+errCode);
		});
	});
};

/************************************  输入密码  **************************/
var initPassword=function(){
	var tel=CF.queryString("tel");
	var code=CF.queryString("code");
	var hastel=CF.queryString("ht");
	var hidetel=tel?tel.substring(0,3)+"****"+tel.substring(8):"";
	
	function registerTelephone(){
		var t=/^[0-9a-zA-Z]*$/g;
		var psw=$("#inp_password").val();
		if(t.test(psw)){
			var pdata={"telephone":tel,"code":code,"password":psw,"system":3};
			var wxdata=JSON.parse(CF.localData("51laizhan_weixinData"));
			pdata.openid=wxdata.openid;
			pdata.nick_name=wxdata.nickname;
			pdata.upfile=wxdata.headimgurl;
			pdata.type=2;
			CF.call(_ApiRoot_+"connects",pdata,function(result){
				if(result.code==200){
					CF.localData("51laizhan_userData",JSON.stringify(result.data));
					CF.localData("51laizhan_auth_key",result.data.auth_key);
					CF.showTips("成功！",null,function(){
						var loginfrom=CF.localData("51laizhan_loginFrom");
						loginfrom=loginfrom?loginfrom:"index.html";
						location.replace(loginfrom);
					});
				}else{
	        		if(result.tips) CF.showTips(result.tips);
	        	};
			},function(errCode){
				 CF.showTips("ERROR:"+errCode);
			});
		}else CF.showTips("密码只能用数字和字母！");
	};
	
	if(hastel){
		$("#password_tips").html('您的手机'+hidetel+'已存在，请输入登录密码绑定此账号');
		$("#inp_password").attr("placeholder",'输入密码');
		$("#btn_submit").click(function(){
			registerTelephone();
		});
	}else{
		$("#password_tips").html('微信登录绑定手机'+hidetel+'，请为此账号设置登录密码');
		$("#inp_password").attr("placeholder",'设置密码（6~20位英文或数字）');
		$("#btn_submit").click(function(){
			registerTelephone();
		});
	};
};

$(function(){
	var fn=CF.getFileName();
	console.log(fn);
	if(fn=="login.html"){
		initLogin();
	}else if(fn=="login_psw.html"){
		initPassword();
	}else if(fn=="bind_phone.html"){
		initBindPhone();
	};
});

