(function(){
	LoadMap(function(map){
		
		var btn1 = '<button title="รายงานภาพรวม" style="cursor: pointer;" class="cesium-button cesium-toolbar-button"><span id="latlong_btn" class="zmdi zmdi-chart" style="font-size:32px;cursor:pointer;" aria-hidden="true" title="ตรวจพิกัด GPS"></span></button>';
		map.toolbar.append(btn1);
		setTimeout(function(){
			$('#latlong_btn').off().on('click',function(){
				SearchLatLon();
			});
		},2000);
		function SearchLatLon(){
			var title = '';
			var src1 = '../survey_p2/check_local2.php';
			//var src1 = 'http://www.somporn.net';
			if($('#data_view1')[0]){
				return false;
			}
			var div = '<div class="modal"><div class="modal-dialog modal-lg" style="height: 20%;width:20%;margin:4px;"><div class="modal-content" style="height: 100%;"><div class="modal-header" style="padding: 4px;"><button type="button" class="close" data-dismiss="modal">×</button></div><div class="modal-body" id="data_view1" style="padding:4px;height: 96%;text-align: center;"><img src="images/spinner128.gif" style="margin-top: 60px;"></div></div></div></div>';
			setTimeout(function(){
				$(div).modal();
				setTimeout(_view,1000);
			},100);
			function _view(){
				if(!$('#data_view1')[0]){
					setTimeout(_view,50);
					return false;
				}
				if($('#dataiframe1')[0]){
					return false;
				}
				$('#data_view1').html('<iframe id="dataiframe1" class="responsive-iframe" style="display: none;width:50%;height: 50%;border: none;" src="'+src1+'"></iframe>');
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