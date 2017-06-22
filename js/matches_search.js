
var initSearchMatches=function(){
	var page=1;
	var ak = CF.localData("51laizhan_auth_key");		
	var canLoad=true;
	var $loading=$("#matches_endloading");
	var skey="";
	var award = "";
	var matchesType=["","淘汰赛","积分赛","擂台赛","预选赛"];
	var matchesStatus=["禁止","报名中","进行中","结束","抽签中"];
	
	function getData(){
		if(!canLoad) return false;
		canLoad=false;
		var pdata={"page":page,"auth_key":ak};
		if(skey) pdata.title=skey;
		if(page==1){
			$loading.show();
			$("#matches_list").empty();
		};
		CF.get(_ApiRoot_+"matches/manager",pdata,function(result){
			console.log(JSON.stringify(result));
	        if(result.code==200){
	        	if(result.data){
	        		fillData(result.data);
	        	}
	        }
	    });
	};
	function fillData(D){
		console.log(D)
		var $LIST=$(".matche-list-menu");
		if(page==1) $LIST.empty();
		if(D.items && D.items.length>0){
			$.each(D.items, function(i,o) {
				matchesDetail(o);
			});
			if(D._meta) if(D._meta.currentPage<D._meta.pageCount){
				$loading.show();
			}else{
				$loading.hide();
			};
			setTimeout(function(){canLoad=true;},500);
			page++;
		}else{
			$loading.hide();
			if (page==1) {
				$LIST.text("未搜索到结果");
				$LIST.css({"text-align":"center"});
			}
		};
	};

	function matchesDetail(o){
		matchesId=o.id;
		var pdata={};
		if(_authKey_) pdata.auth_key=_authKey_;
		CF.get(_ApiRoot_+"matches/"+matchesId,pdata,function(result){
	        console.log(result);
	        if(result.code==200){
	        	if(result.data){
	        		createListElm(result.data);
	        	}
	        }
	    });
	}
	
	function createListElm(D){
		var mt=matchesType[D.type];
		var ms=matchesStatus[D.status];
		var htm='<ul data-id="'+D.id+'">'+
					'<li class="matche-list-menu-row-title">'+D.title+'</li>'+
					'<li class="matche-list-menu-row-award">'+D.award+'</li>'+
					'<li class="matche-list-menu-row-type">'+
						'<div><span>'+mt+'</span><span>'+ms+'</span></div>'+
					'</li>'+
				'</ul>';
		var $elm=$(htm);
		var $LIST=$(".matche-list-menu");
		$LIST.append($elm);
		$elm.click(function(){
			var newsId=$(this).attr("data-id");
			CF.reURL("management_matche_detail.html?mid="+newsId);
		});
	};
	
	function initSearch(){
		$("#searchKey").focus();
		
		var cninput=false;
		$("#searchKey").bind("compositionstart",function(){
			cninput=true;
		});
		$("#searchKey").bind("compositionend",function(){
			cninput=false;
		});
		$("#searchKey").bind('input propertychange', function(){
			if(cninput) return false;
			startSearch();
		});
		$("#searchKey").bind('keydown',function(event){
			if(event.keyCode == "13"){  
			    startSearch();
			};
		});  

		$("#search_cancel").click(function(){
			history.back();
		});
		
		if ($.trim($("#searchKey").val()) != "") startSearch();

		// 失焦----------kai
		$("body").on("touchmove",function(){
			$("#searchKey").blur();
		})
	};
	
	function startSearch() {	
		var inpkey = $.trim($("#searchKey").val());	
		if (inpkey != ""){
			skey=inpkey;
			page=1;
			canLoad=true;
			getData();
		};
	};
	
	function calcDist(lat,lng){				
		if(cb_lat && cb_lng && !isNaN(lat) && !isNaN(lng)){
			var EARTH_RADIUS = 6378137.0;//单位M
			var PI = Math.PI;
			function getRad(d){ return d*PI/180.0; };
			var radLat1 = getRad(cb_lat);
        	var radLat2 = getRad(lat);
			var a = radLat1 - radLat2;
	        var b = getRad(cb_lng) - getRad(lng);
	        var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
	        s = s*EARTH_RADIUS;
	        s = Math.round(s);
			return s;
		}else return -1;
	};
	
	function rebuildDist(){
		if(cb_lat && cb_lat){
			$(".matches-list-location").each(function(i,o){
				if($(o).find("span").length==0){
					var d=calcDist($(o).attr("data-lat"),$(o).attr("data-lng"));
					var dsc=d>1000? Math.round(d/1000)+"公里" : (d>0 ? d+"米" : "");
					if(dsc) $(o).append(" <span>"+dsc+"</span>");
				};
			});
		};		
	};
	
	function getLocation(callback){
		try{
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function (r) {
			    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
			        var mk = new BMap.Marker(r.point);
			        currentLat = r.point.lat;
			        currentLon = r.point.lng;
			        console.log("纬度:"+currentLat+"   经度:"+currentLon);
			        callback(currentLat,currentLon,true);
			    }else{
			    	callback(0,0,false);
			    };
			});
		}catch(e){
			callback(0,0,false);
		}
	};
	
	getLocation(function(lat,lng,succ){
		if(succ){
			console.log("坐标>  "+lat+"  :  "+lng);
			cb_lat=lat;
			cb_lng=lng;
			rebuildDist();
		};
	});
	
	initSearch();
	
	CF.scrollBottomCallback(function(){getData();},0,null,".page");
};
	

$(function(){
	initSearchMatches();
});
