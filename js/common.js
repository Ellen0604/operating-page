
// 常量定义  ================================================================================================
/*http://test.51laizhan.com/v1/*/
var _ApiRoot_=(location.origin.indexOf("127.0.0.1")>0) ? "http://127.0.0.1/laizhan/v1/" : location.origin+"/laizhan/v1/";
var _ImgRoot_="http://49.213.15.168:20017/";
//=========================================================================================================
var _userData_=null;
var _authKey_="";
// BASE64  ================================================================================================
var iBase64=function(){return{encode:function(a){var b="",d,c,f,g,h,e,k,l=0;do d=a.charCodeAt(l++),c=a.charCodeAt(l++),f=a.charCodeAt(l++),g=d>>2,h=(d&3)<<4|c>>4,e=(c&15)<<2|f>>6,k=f&63,isNaN(c)?(h=(d&3)<<4,e=k=64):isNaN(f)&&(k=64),b=b+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(g)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(h)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(e)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(k);while(l<a.length);return b},decode:function(a){var b="",d,c,f,g,h,e=0;a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");do d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(a.charAt(e++)),c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(a.charAt(e++)),g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(a.charAt(e++)),h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(a.charAt(e++)),d=d<<2|c>>4,c=(c&15)<<4|g>>2,f=(g&3)<<6|h,b+=String.fromCharCode(d),64!=g&&(b+=String.fromCharCode(c)),64!=h&&(b+=String.fromCharCode(f));while(e<a.length);return b}}}();
//=========================================================================================================
// 添加系统方法format格式化时间  ============================================================================
Date.prototype.format=function(format){var args={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S":this.getMilliseconds()};if(/(y+)/.test(format))format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));for(var i in args){var n=args[i];if(new RegExp("("+i+")").test(format))format=format.replace(RegExp.$1,RegExp.$1.length==1?n:("00"+n).substr((""+n).length));};return format;};
//=========================================================================================================


var CF = {
	BROSWER:{
		"weixin":((/MicroMessenger/i.test(navigator.userAgent)) ? true : false),
		"qqBroswer":((/MQQBrowser/i.test(navigator.userAgent)) ? true : false),
		"ucBrowser":((/UCBrowser/i.test(navigator.userAgent)) ? true : false)
	},
	SYS:{
		"ios":((/iphone|ipad|ipod/i.test(navigator.userAgent)) ? true : false),
		"android":((/Android/i.test(navigator.userAgent)) ? true : false)
	},
	queryString: function(val,urlstr) {
		var urlSearch=window.location.search;
		if(urlstr) urlSearch=urlstr.substring(urlstr.indexOf("?"));
		if(urlSearch.length>0){
			var uri = urlSearch.substr(1);
			var re = new RegExp("" + val + "=([^&?]*)", "ig");
			return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
		}else{
			return null;
		};
	},
	//存储读取缓存，有第二个参数值就写入，否则读出
	localData: function(skey, svalue) {
		var result_val=null;
		if (window.localStorage) {
			var storageObj=window.localStorage;
			if(svalue!=undefined&&svalue!=null){
				storageObj.setItem(skey, svalue);
				result_val = svalue;
			}else{
				result_val = storageObj.getItem(skey);
			};			
		}else console.log("!!broswer no support storage!!");
		return result_val;
	},	
	//调用接口方法
	call: function(postUrl,postData,callBack,errBack,calltype){
		if(!postData) postData={};
		calltype=calltype?calltype:"post";
		$.ajax({timeout:30000,
				url: postUrl,
				type: calltype,
				dataType:"json",
				data: JSON.stringify(postData),
				contentType: "application/json",
				error: function(XMLHttpRequest, textStatus, errorThrown) {/*' rst=' + XMLHttpRequest.responseText + */
					console.log("接口连接错误！st="+ XMLHttpRequest.readyState + ' st=' + XMLHttpRequest.status + ' ts=' + textStatus+ ' rst=' + XMLHttpRequest.responseText);
					CF.showLoading(false);
					if(textStatus=="timeout"){
						CF.showTips("网络不可用！");
					}else if(errBack) errBack(XMLHttpRequest.status);
				},
				success: function(result) {
					console.log(result);
					CF.showLoading(false);
					if(callBack) callBack(result);
				}
			});
	},
	//json转url参数
	parseParam:function(param, key) {
	    var paramStr = "";
	    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
	        paramStr += "&" + key + "=" + encodeURIComponent(param);
	    } else {
	        $.each(param, function(i) {
	            var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
	            paramStr += '&' + CF.parseParam(this, k);
	        });
	    }
	    return paramStr.substr(1);
	},
	//调用接口方法
	get: function(postUrl,postData,callBack,errBack){
		var params=postData?"?"+CF.parseParam(postData):"";
		$.ajax({timeout:30000,
				url: postUrl+params,
				type: "get",
				dataType:"json",
				contentType: "application/json",
				error: function(XMLHttpRequest, textStatus, errorThrown) {/*' rst=' + XMLHttpRequest.responseText + */
					console.log("接口连接错误！st="+ XMLHttpRequest.readyState + ' st=' + XMLHttpRequest.status + ' ts=' + textStatus+ ' rst=' + XMLHttpRequest.responseText);
					CF.showLoading(false);
					if(textStatus=="timeout"){
						CF.showTips("网络不可用！");
					}else if(errBack) errBack(XMLHttpRequest.status);
				},
				success: function(result) {
					/*console.log(result);*/
					CF.showLoading(false);
					if(callBack) callBack(result);
				}
			});
	},
	callInterface: function(postUrl,postData,callBack,errBack){
		if(!postData) postData={};
		$.ajax({timeout:30000,
				url: postUrl,
				type: "post",
				dataType:"json",
				data: JSON.stringify(postData),
				contentType: "application/json",
				error: function(XMLHttpRequest, textStatus, errorThrown) {/*' rst=' + XMLHttpRequest.responseText + */
					console.log("接口连接错误！st="+ XMLHttpRequest.readyState + ' st=' + XMLHttpRequest.status + ' ts=' + textStatus+ ' rst=' + XMLHttpRequest.responseText);
					CF.showLoading(false);
					if(errBack) errBack(XMLHttpRequest.status);
				},
				success: function(result) {
					console.log(result);
					CF.showLoading(false);
					if(callBack) callBack(result);
				}
			});
	},
	callUpFile:function(url, data, refunc, errfunc) {
		CF.showLoading(1);
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			cache: false,
			contentType: false,
			processData: false,
			success: function(result) {
				CF.showLoading(0);
				if(result.code==200){
					if (refunc) refunc(result);
				}else{
					if (errfunc) errfunc(result.code,result.tips);
				};
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				CF.showLoading(0);
				if (errfunc) errfunc(XMLHttpRequest.status);
			}
		});
	},
	//显示提示
    showTips:function(msg,params,closeCallback){//显示提示
    	var top="40%";
    	var delay=1500;
    	var em="";
    	if(params){
    		if(params.top) top=params.top;
    		if(params.delay) delay=params.delay;
    	};    	
		var htm='<div style="z-index:391;background:rgba(0,0,0,0);position:fixed;top:0;left:0;width:100%;height:100%;" id="tips_coverlay">'+
		'<div style="position:absolute;top:'+top+';width:100%;text-align:center">'+
		'<div class="anim-InOut" style="display:inline-block;max-width:240px;margin:0 auto;padding:9px 11px;background:rgba(66,66,66,0.94);color:#FFF;font-size:15px;line-height:25px;text-align:center;border-radius:6px;-webkit-border-radius:6px;word-wrap:break-word;word-break:break-all;">'+em+msg+
		'</div></div></div>';
		var tipsObj=$(htm);
		$(document.body).append(tipsObj);
		function closeTips(){
			tipsObj.remove();
			if(closeCallback) closeCallback();
		};
		setTimeout(function(){closeTips();},delay);
		tipsObj.click(function(){closeTips();});		
		return tipsObj;
	},
	//单按钮提示
	showOkTips:function(msg,closeCallback,btntxt){
		if($("#okTips").length>0) return;
		var btntxt=btntxt?btntxt:"好的";
		var htm='<div id="okTips" style="position:fixed;z-index:188;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);">';
		htm+='<div style="width:75%;min-height:100px;overflow:hidden;border-radius:5px;-webkit-border-radius:5px;background:#FFF;margin:45% auto 0 auto">';
		htm+='<p style="line-height:24px;font-size:16px;text-align:center;padding:5px 15px 5px 15px;margin:10px 0;color:#333;min-height:24px;">'+msg+'</p>';
		htm+='<div><div id="btn_tips_cancel" style="width:100%;height:50px;line-height:50px;text-align:center;margin:15px auto 0 auto;border-top:1px solid #DDD;background:transparent;font-size:15px;box-sizing:border-box;color:#999;">'+btntxt+'</div>';
		htm+='</div></div>';
		var htmElm=$(htm);
		$(document.body).append(htmElm);
		htmElm.find("#btn_tips_cancel").unbind("click").click(function(){
			htmElm.remove();
			if(closeCallback) closeCallback();
		});
		return htmElm;
	},
	//确定提示
	showConfirmTips:function(msg,callback,btn1txt,btn2txt){
		var b1txt=btn1txt?btn1txt:"取消";
		var b2txt=btn2txt?btn2txt:"确认";
		var htm='<div id="upgradeTips" style="position:fixed;z-index:188;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);">';
		htm+='<div style="width:75%;min-height:100px;overflow:hidden;border-radius:5px;-webkit-border-radius:5px;background:#FFF;margin:45% auto 0 auto">';
		htm+='<p style="line-height:24px;font-size:15px;text-align:center;padding:5px 25px;margin-top:15px;color:#333;min-height:45px;">'+msg+'</p>';
		htm+='<div><div id="btn_cf_cancel" style="width:50%;height:50px;line-height:50px;text-align:center;margin:15px auto 0 auto;border-top:1px solid #DDD;background:transparent;font-size:14px;box-sizing:border-box;display:inline-block;">'+b1txt+'</div>';
		htm+='<div id="btn_cf_confirm" style="width:49%;height:50px;line-height:50px;text-align:center;margin:15px auto 0 auto;border-top:1px solid #DDD;background:transparent;font-size:14px;box-sizing:border-box;display:inline-block;border-left:1px solid #DDD;">'+b2txt+'</div>';
		htm+='</div></div>';
		var htmElm=$(htm);
		$(document.body).append(htmElm);
		htmElm.find("#btn_cf_cancel").unbind("click").click(function(){
			htmElm.remove();
		});
		htmElm.find("#btn_cf_confirm").unbind("click").click(function(){
			if(callback) callback();
			htmElm.remove();
		});
	},
	//加载动画
	showLoading:function(showOrClose){
		var top="40%";
		var loadingObj;
		if(showOrClose){
			if($(".page-loading-coverlay").length>0) return false;
			var htm='<div style="z-index:381;background:rgba(0,0,0,0);position:fixed;top:0;left:0;width:100%;height:100%;" class="page-loading-coverlay" id="loading_coverlay">'+
			'<div style="position:absolute;top:'+top+';width:100%;text-align:center">'+
			'<div class="page-loading"><div></div></div>'+
			'</div></div>';
			loadingObj=$(htm);
			$(document.body).append(loadingObj);
		}else{
			$(".page-loading-coverlay").remove();
		};
		return loadingObj;
	},
	// 滚动到距离底部多少px的时加载函数,用于滑动到底部加载下一页
	scrollBottomCallback:function(fn, number, ObjSelector, ObjChildren) {
		var a = number ? parseInt(number) : 0 ;
		ObjSelector=ObjSelector?ObjSelector : window ;
		ObjChildren=ObjChildren?ObjChildren : $(ObjSelector).children().eq(0)[0] ;
		$(ObjSelector).scroll(function() {
			if ($(ObjSelector).scrollTop() + $(ObjSelector).height() >= $(ObjChildren).height() - a) {
				if (fn) fn();
			};
		});
	},
	//时间到当前天数，参数例如"2018-7-14 15:46:37"
	unixDateToNow:function(string) {
		var f = string.split(' ', 2);
		var d = (f[0] ? f[0] : '').split('-', 3);
		var t = (f[1] ? f[1] : '').split(':', 3);
		var strDate=(new Date(
			parseInt(d[0], 10) || null,
			(parseInt(d[1], 10) || 1) - 1,
			parseInt(d[2], 10) || null,
			parseInt(t[0], 10) || null,
			parseInt(t[1], 10) || null,
			parseInt(t[2], 10) || null
		)).getTime() / 1000;
		var nowDate = Math.floor(new Date().getTime() / 1000);
		return (strDate-nowDate)/(24*60*60);
	},
	//时间戳转日期
	unixToDate: function(unixTime, isFull, timeZone) {
		if (typeof(timeZone) == 'number') {
			unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
		};
		if(String(unixTime).length<11) unixTime=unixTime* 1000;
		var time = new Date(unixTime);
		var ymdhis = "";
		ymdhis += time.getUTCFullYear() + "-";
		ymdhis += (time.getUTCMonth() + 1) + "-";
		ymdhis += time.getUTCDate();
		if (isFull){
			var hh=time.getHours();
			var mm=time.getUTCMinutes();
			var ss=time.getUTCSeconds();
			hh=String(1000+hh).substr(-2);
			mm=String(1000+mm).substr(-2);
			ss=String(1000+ss).substr(-2);
			if (isFull === true) {
				ymdhis += " " + hh + ":";
				ymdhis += mm + ":";
				ymdhis += ss;
			}else if(isFull == "hhmm"){
				ymdhis += " " + hh + ":";
				ymdhis += mm;
			};
		};
		return ymdhis;
	},
	//取页面文件名
	getFileName:function(cururl) {
		var curFile = cururl?cururl:window.location.href;
		curFile = curFile.replace(/\?.*$/, '');
		curFile = curFile.replace(/^.*\//, '');
		return curFile;
	},
	//跳转简化
	reURL:function(rurl, replace) {
		if(rurl){
			var unixCode=Math.floor(new Date().getTime()/1000);
			rurl+=rurl.indexOf("?")<0 ? "?t="+unixCode : "&t="+unixCode;
			if (replace) location.replace(rurl); else window.location.href = rurl;
		};
	},
	//时间戳到当前
	TimeStampDiff: function(dateTimeStamp,notoday) {
		var timestamp=parseInt(String(dateTimeStamp+"0000000000").substr(0,10));
		var unixTime=(String(timestamp).length<11) ? timestamp*1000 : timestamp;
		var ntime = new Date(unixTime);
		var now = new Date();
		if (ntime.toDateString() === now.toDateString() && !notoday) {
			return "今天";
		}else{
			var ymdhis = "";
			if(ntime.getUTCFullYear()==now.getUTCFullYear()){
				ymdhis += (ntime.getUTCMonth() + 1) + "月";
				ymdhis += ntime.getUTCDate() + "日";
			}else{
				ymdhis += ntime.getUTCFullYear() + "-";
				ymdhis += (ntime.getUTCMonth() + 1) + "-";
				ymdhis += ntime.getUTCDate();
			};			
			return ymdhis;
		};
	},
	//时间戳到当前
	getDateDiff: function(dateTimeStamp) {
		var minute = 1 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var d = new Date();
		var now = Math.floor(new Date().getTime() / 1000);
		var diffValue = now - dateTimeStamp;
		if (diffValue < 0) {
			if (diffValue > -60) return "刚刚";
			return null;
		};
		var monthC = diffValue / month;
		var weekC = diffValue / (7 * day);
		var dayC = diffValue / day;
		var hourC = diffValue / hour;
		var minC = diffValue / minute;
		if (monthC >= 1) {
			result = "" + parseInt(monthC) + "个月前";
		} else if (weekC >= 1) {
			result = "" + parseInt(weekC) + "周前";
		} else if (dayC >= 1) {
			result = "" + parseInt(dayC) + "天前";
		} else if (hourC >= 1) {
			result = "" + parseInt(hourC) + "个小时前";
		} else if (minC >= 1) {
			result = "" + parseInt(minC) + "分钟前";
		} else {
			result = "刚刚";
		};
		return result;
	},
	// 是否微信打开
	isWeiXin: (/MicroMessenger/i.test(navigator.userAgent)) ? true : false,
	//添加样式
	addCssByStyle:function(cssString){
	    var doc=document;  
	    var style=doc.createElement("style");  
	    style.setAttribute("type", "text/css");  
		var cssText = doc.createTextNode(cssString);  
	    style.appendChild(cssText);
	    var heads = doc.getElementsByTagName("head");  
	    if(heads.length) heads[0].appendChild(style);  
	    else doc.documentElement.appendChild(style); 
	}
};

/******************************************/
function initUserData(){
	_authKey_=CF.localData("51laizhan_auth_key");
	var userData=CF.localData("51laizhan_userData");
	_userData_=userData?JSON.parse(userData):"";
	if($(".member-floater").length>0){		
		if(_userData_){	
			var $loginhtm=$('<div class="member-floater-face" style="background-image:url('+_userData_.upfile+');"></div>');
			$(".member-floater").append($loginhtm);
			$loginhtm.click(function(){
				CF.reURL("mine.html");
			});
		}else{
			var $loginhtm=$('<div class="member-floater-face">登录</div>');
			$(".member-floater").append($loginhtm);
			$loginhtm.click(function(){
				CF.reURL("wxlogin.html");
			});
		};		
	};
};


/************* 初始化根文本尺寸 **/
(function(){var ww=document.documentElement.clientWidth; ww=ww>1024?1024:ww; var fs=Math.floor(ww/24); var ro=document.getElementsByTagName("html")[0]; ro.style.cssText='font-size:'+fs+'px;'; })();
/******************************************/

/******************************************/
$(function(){
	/*按屏幕修改根文本尺寸*/
	var setRootFont=function(){
		var ww=$(document.body).width();
		ww=ww>1024?1024:ww;
		var f=Math.floor(ww/ 24);
		$("html").css("font-size",f+"px");
		$("body").css("font-size",f+"px");
		console.log("RFS:"+f+"  ("+$("body").width()+"x"+$("body").height()+")");
	};
	setRootFont();
	$(window).resize(function(){setRootFont();});
	/******************/
	initUserData();
});
/******************************************/


