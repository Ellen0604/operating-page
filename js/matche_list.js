var initMatches=function(){
	var page=1;
	var ak = CF.localData("51laizhan_auth_key");		
	var canLoad=true;
	var $loading=$("#matches_endloading");
	var skey="";
	var award = "";
	var matchesType=["","淘汰赛","积分赛","擂台赛","预选赛"];
	var matchesStatus=["已失效","报名中","进行中","结束","抽签中"];
	
	function getData(){
		if(!canLoad) return false;
		canLoad=false;
		var pdata={"page":page,"auth_key":ak};
		if(skey) pdata.name=skey;
		if(page==1){
			$loading.show();
			$("#matches_list").empty();
		};
		CF.get(_ApiRoot_+"matches/manager",pdata,function(result){
	        if(result.code==200){
	        	if(result.data){
	        		fillData(result.data);
	        	}
	        }
	    });
	};
	function fillData(D){
		var $LIST=$(".matche-list-menu");
		if(page==1) $LIST.empty();
		if(D.items && D.items.length>0){
			$.each(D.items, function(i,o) {
				console.log(o)
				var $elm=createListElm(o);
				$LIST.append($elm);
				$elm.click(function(){
					var matcheId=$(this).attr("data-id");
					CF.reURL("management_matche_detail.html?mid="+matcheId);
				});
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
		};
	};

	function createListElm(o){
		var mt=matchesType[o.type];
		var ms=matchesStatus[o.status];
		var htm='<ul data-id="'+o.id+'">'+
					'<li class="matche-list-menu-row-title">'+o.title+'</li>'+
					'<li class="matche-list-menu-row-award">'+o.award+'</li>'+
					'<li class="matche-list-menu-row-type">'+
						'<div><span>'+mt+'</span><span>'+ms+'</span></div>'+
					'</li>'+
				'</ul>';
		return $(htm);
	};

	CF.scrollBottomCallback(function(){getData();},0,null,".page");
	getData();

	$("#btn-submit").click(function(){
		CF.reURL("create_matche.html");
	});
	$(".info-search-input").click(function(){
		CF.reURL("matches_search.html");
	});
};
	
$(function(){
	initMatches();
});