(function(){
	LoadMap(function(map){
		map.GeoLocation = navigator.geolocation || window.navigator.geolocation;
		var ex = 0.02;
		if(map.GeoLocation){
			function blink(p){
				if(p.color == 2){
					p.color = 1;
					p.point.outlineWidth=25;
					p.point.pixelSize=10;
				} else {
					p.color = 2;
					p.point.outlineWidth=20;
					p.point.pixelSize=12;
				}
				setTimeout(function(){
					blink(p);
				},500);
			}
			function _success(p){
				var x = parseFloat((p.coords.longitude).toFixed(6));
				var y = parseFloat((p.coords.latitude).toFixed(6));
				if(y == 15.870032 && x == 100.992541){
					y = '';
					x = '';
					if(USER.lat && USER.lng){
						x = parseFloat(USER.lng);
						y = parseFloat(USER.lat);
					}
					if(USER.last_lat && USER.last_lng){
						x = parseFloat(USER.last_lng);
						y = parseFloat(USER.last_lat);
					}
				}
				if(!x || !y){
					return false;
				}
				USER.last_lat = y;
				USER.last_lng = x;
				map.setView(x,y,10000);
				Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(x-ex,y-ex,x+ex,y+ex);
				Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
				map.Location = map.viewer.entities.add({
					id:'geolocation',
					position:Cesium.Cartesian3.fromDegrees(x,y),
					lat:y,
					lng:x,
					name:'ที่อยู่ปัจจุบันของคุณ',
					info:'<p style="font-size:0.9em;">'+y+','+x+'</p>',
					description:{
						getValue:function(){
							if($('#mark_location')[0] && !$('#mark_location').attr('action')){
								$('#mark_location').attr('action',1);
								$('#mark_location').off().on('click',function(){
									setTimeout(function(){
										map.viewer.selectedEntity = undefined;
										map.Marking({});
										$('#mapMarking').html('<img src="'+map.markerIcon+'" >');
										$('#mapMarking').attr('title','คลิกเพื่อปิดการเพิ่มพิกัดบนแผนที่');
										map.Marking({});
										map.mark({lat:map.Location.lat,lng:map.Location.lng},function(pin){
											map.getAdmin(pin.latLng,function(a){
												if(pin.lat && pin.lng){
													pin.info = '<p style="font-size:0.9em;">'+pin.lat+','+pin.lng+'</p>';
												}
												if(a){
													pin.administrative = a;
													pin.info = pin.info+'<p style="font-size:0.9em;">ตำบล : '+a.sub_district+'</p>'+
														'<p style="font-size:0.9em;">อำเภอ : '+a.district+'</p>'+
														'<p style="font-size:0.9em;">จังหวัด : '+a.province+'</p>';
												}
											});
										});
									},200);
								});
							}
							return map.Location.info+'<p><a style="cursor:help;" href="https://support.google.com/maps/answer/2839911?hl=th" target="_blank">คำแนะนำเพื่อเพิ่มความแม่นยำของ GPS</a></p>';
						}
					},
					color:1,
					point:{
						pixelSize:10,
						color:Cesium.Color.GREEN,
						outlineColor:Cesium.Color.BLUE.withAlpha(0.2),
						outlineWidth:25
					},
					extentDescription:'<button id="mark_location" style="float:right;margin:6px;" class="btn btn-primary">ปักหมุดตรงนี้</button>'
				});
				map.getAdmin({lat:y,lng:x},function(a){
					if(a){
						map.Location.info = map.Location.info+'<p style="font-size:0.9em;">ตำบล : '+a.sub_district+'</p><p style="font-size:0.9em;">อำเภอ : '+a.district+'</p><p style="font-size:0.9em;">จังหวัด : '+a.province+'</p>';
					}
				});
				blink(map.Location);
				USER.Location = map.Location;
			}
			function _error(e){
				if(e.code == 1){
					navigator.permissions.query({name:'geolocation'}).then(function(result){
					   if(result.state == 'denied'){
							var c = 'คุณไม่ได้อนุญาตให้ livingonnewpace.com แชร์ตำแหน่งของคุณ กรุณา<a style="cursor: help;" href="https://support.google.com/chrome/answer/142065?hl=th" target="_blank">อ่านวิธีแชร์ตำแหน่ง</a>';
							var div = '<div class="modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button></div><div class="modal-body">'+c+'</div></div></div></div>';
							setTimeout(function(){
								$(div).modal();
							},2000);
							if(USER.lat && USER.lng){
								Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(USER.lng-ex,USER.lat-ex,USER.lng+ex,USER.lat+ex);
							}
					   }
					});
				} else {
					map.GeoLocation.getCurrentPosition(_success,_error);
				}
			}
			map.GeoLocation.getCurrentPosition(_success,_error);
			map.GeoLocation.watchPosition(function(p){
				var x = parseFloat((p.coords.longitude).toFixed(6));
				var y = parseFloat((p.coords.latitude).toFixed(6));
				if(map.Location){
					if(y == 15.870032 && x == 100.992541){
						return false;
					}
					if(map.Location.lat!=y || map.Location.lng!=x){
						Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(x-ex,y-ex,x+ex,y+ex);
						map.Location.lat = y;
						map.Location.lng = x;
						map.Location.position = Cesium.Cartesian3.fromDegrees(x,y);
						map.Location.info = '<p style="font-size:0.9em;">'+y+','+x+'</p>';
						map.getAdmin({lat:y,lng:x},function(a){
							if(a){
								map.Location.info = map.Location.info+'<p style="font-size:0.9em;">ตำบล : '+a.sub_district+'</p><p style="font-size:0.9em;">อำเภอ : '+a.district+'</p><p style="font-size:0.9em;">จังหวัด : '+a.province+'</p>';
							}
						});
					}
					USER.Location = map.Location;
				} else {
					_success(p);
				}
			});
		} else {
			if(USER.lat && USER.lng){
				Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(USER.lng-ex,USER.lat-ex,USER.lng+ex,USER.lat+ex);
			}
		}
	});
})();