(function(){
	LoadMap(function(map){
		
		var btn = '<button title="รายงานภาพรวม" style="cursor: pointer;" class="cesium-button cesium-toolbar-button"><span id="report_btn" class="zmdi zmdi-chart" style="font-size:32px;cursor:pointer;" aria-hidden="true" title="รายงานภาพรวมศักยภาพ 5 มิติ"></span></button>';
		map.toolbar.append(btn);
		setTimeout(function(){
			$('#report_btn').off().on('click',function(){
				view5D();
			});
		},1000); //by Somporn
		//},2000);
		function view5D(){
			var title = '';
			var src = '../survey_p2/index.php?curr=report_jun11_5';
			//var src = '../survey/check_local2.php';			
			if($('#data_view')[0]){
				return false;
			}
			var div = '<div class="modal"><div class="modal-dialog modal-lg" style="height: 98%;width:99%;margin:4px;"><div class="modal-content" style="height: 100%;"><div class="modal-header" style="padding: 4px;"><button type="button" class="close" data-dismiss="modal">×</button></div><div class="modal-body" id="data_view" style="padding:4px;height: 96%;text-align: center;"><img src="images/spinner128.gif" style="margin-top: 60px;"></div></div></div></div>';
			setTimeout(function(){
				$(div).modal();
				setTimeout(_view,1000);
			},100);
			function _view(){
				if(!$('#data_view')[0]){
					setTimeout(_view,50);
					return false;
				}
				if($('#dataiframe')[0]){
					return false;
				}
				$('#data_view').html('<iframe id="dataiframe" class="responsive-iframe" style="display: none;width:100%;height: 100%;border: none;" src="'+src+'"></iframe>');
				_hide();
			}
			function _hide(){
				if(!$('#dataiframe').contents().find('.navbar')[0] || !$('#dataiframe').contents().find('footer')[0]){
					setTimeout(_hide,20);
					return false;
				}
				$('#dataiframe').contents().find('body').css('font-size','0.9em');
				$($('#dataiframe').contents().find('.row')[1]).hide();
				//$($('#dataiframe').contents().find('.row')[0]).hide();
				$('#dataiframe').contents().find('.navbar').hide();
				$('#dataiframe').contents().find('form').hide();
				//$('#dataiframe').contents().find('footer').hide();
				$('#dataiframe').show();
			}
		}
	});
})();