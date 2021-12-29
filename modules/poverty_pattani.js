(function(){
var map =	LoadMap();
var collection = {table:'poverty_pattani'};
var entities = map.viewer.entities;
function incomeRender(o){
	var s = 'รายได้ครัวเรือน'+'<br>';
	s = s+'อาชีพหลัก '+commaNumber(o.income_a)+' บาท/ปี</br>';
	s = s+'อาชีพรอง '+commaNumber(o.income_b)+' บาท/ปี</br>';
	s = s+'รายได้อื่น '+commaNumber(o.income_c)+' บาท/ปี</br>';
	s = s+'ทำ-หาเอง '+commaNumber(o.income_d)+' บาท/ปี</br>';
	var t = parseInt(o.income_a)+parseInt(o.income_b)+parseInt(o.income_c)+parseInt(o.income_d);
	s = s+'รายได้รวม '+commaNumber(t)+' บาท/ปี</br>';
	s = s+'รายได้เฉลี่ย '+commaNumber(incomeAvg(o))+' บาท/คน/ปี';
	return s;
}
function incomeAvg(o){
	var t = parseInt(o.income_a)+parseInt(o.income_b)+parseInt(o.income_c)+parseInt(o.income_d);
	return parseInt(t/(parseInt(o.members_m)+parseInt(o.members_f)));
}
var poverty = {
	title:'ครัวเรือนรายได้ต่ำ (จปฐ.) จังหวัดปัตตานี',
	module:'poverty_pattani',
	GIS:{
		addMarkers:function(data){
			var t=2000;
			var $$ = this;
			map.addLegend({id:'poverty_pattani',title:'ครัวเรือนที่มีรายได้ต่ำ (จปฐ.) จ.ปัตตานี',checked:false,icon:'icons/home-2.png'});
			map.addLegend({id:'poverty_pattani_h',title:'รายได้มากกว่า 38,000 บาท/คน/ปี',checked:false,icon:'icons/home-yellow.png',parent:'poverty_pattani'});
			map.addLegend({id:'poverty_pattani_l',title:'รายได้ต่ำกว่า 38,000 บาท/คน/ปี',checked:false,icon:'icons/home-brown.png',parent:'poverty_pattani'});
			$.each(data,function(i,x){
				t=t+5;
				setTimeout(function(){
					$$.addMarker(x);
				},t);
			});
		},
		getLatLng:function(p,c){
			var $$ = this;
			map.getLatLngAdmin(p,function(r){
				p.lat = r.latLng.lat;
				p.lng =  r.latLng.lng;
				c(p);
			});
		},
		createIcon:function(d){
			return 'icons/home-2.png';
		},
		addMarker:function(o){
			var $$ = this;
			if(!o.lat || !o.lng || o.lat==0 || o.lng==0){
				$$.getLatLng(o,function(p){
					$$.addMarker(p)
				});
				return false;
			}
			var id = 'poverty_pattani_'+o.id;
			map.removeEntityById(id);
			var name = o.house_no?o.house_no:'';
			var vn = o.village_no?'ม.'+o.village_no:'';
			var tam = o.sub_district?'ต.'+o.sub_district:'';
			if(vn){
				name = name+' '+vn;
			}
			if(tam){
				name = name+' '+tam;
			}
			var search = o.h_title+''+o.h_first_name+' '+o.h_last_name;
			search = search+' '+name+' อ.'+o.district+' จ.'+o.province;
			var ent;
			var extentDescription = '';
			var icon = $$.createIcon(o);
				extentDescription=extentDescription+'<div style="padding: 5px;">'+
				'<span id="marker_undo" class="zmdi zmdi-undo" style="font-size:24px;cursor:pointer;float: right;padding:16px;display:none;" aria-hidden="true" title="เลิกย้ายพิกัด"></span>'+
				'<span id="marker_save" class="zmdi zmdi-floppy" style="font-size:24px;cursor:pointer;float: right;padding:16px;display:none;" aria-hidden="true" title="บันทึกพิกัดใหม่"></span>'+
				'<span id="marker_move" class="zmdi zmdi-arrows" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="ย้ายจุดพิกัด"></span>';

			var show = false;
			var layer = 'poverty_pattani';
			if($('#poverty_pattani').prop('checked')){
				show = true;
			}
			if(incomeAvg(o)>38000){
				layer = 'poverty_pattani_h';
				icon = 'icons/home-yellow.png';
			} else {
				layer = 'poverty_pattani_l';
				icon = 'icons/home-brown.png';
			}
			if(!map.Layers[layer]){
				map.Layers[layer] = entities.add(new Cesium.Entity());
				map.Layers[layer].show = show;
			}
			var dynamicLabel = {
					name:name,
					position:map.setPosition(o),
					text:'',
					scale:0.5,
					style:Cesium.LabelStyle.FILL_AND_OUTLINE,
					horizontalOrigin:Cesium.HorizontalOrigin.LEFT,
					outlineWidth:2,
					verticalOrigin:Cesium.VerticalOrigin.TOP
			}
			var p={
				id:id,
				parent:map.Layers[layer],
				name:name,
				//search:search,
				description:{
					getValue:function(){
						var s = '';
						$.each(poverty.Snapshot.data,function(){
							if(parseInt(this.id) == parseInt(o.id)){
								s=s+'<div>ที่อยู่ : '+addressRender(this)+'</div>';
								s = s+'หัวหน้าครัวเรือน : '+o.h_title+o.h_first_name+' '+o.h_last_name;
								s = s+'<br>'+'อาชีพหัวหน้าครัวเรือน : '+o.h_occupation;
								s = s+'<br><br>'+'จำนวนสมาชิกครัวเรือน : '+'<br>'+'ชาย : '+o.members_m+'<br>'+'หญิง : '+o.members_f;
								s = s+'<br>'+'รวม : '+(parseInt(o.members_m)+parseInt(o.members_f));
								s = s+'<br><br>'+incomeRender(o);
							}
						});
						return s;
					}
				},
				extentDescription:extentDescription,
				position:map.setPosition(o),
				originalPosition:map.setPosition(o),
				//dynamicLabel:dynamicLabel,
				billboard:{
					image:icon,
					verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
					scaleByDistance:new Cesium.NearFarScalar(2000,1,2e6,0)
				},
				move:function(){
					map.pinMoving(ent,function(x){
						$('#marker_save').show();
						$('#marker_undo').show();
					});
				},
				save:function(){
					var d = {id:ent.id.replace('poverty_pattani_',''),lat:ent.lat,lng:ent.lng}
					DB.db(collection).update(d,function(out){
						$('#marker_save').hide();
						$('#marker_undo').hide();
						setTimeout(function(){
							map.viewer.selectedEntity = undefined;
							ent.draggable = false;
						},1000);
					});
				}
			}
			ent = entities.add(p);
		},
		editMarker:function(d){
			var $$ = this;
			//map.removeEntityById('poverty_'+d.id);
			setTimeout(function(){
				$$.addMarker(d);
			},20);
		},
		layerChange:function(d,t){
			var $$ = this;
			if(t=='update'){
				$$.editMarker(d);
			}
			if(t=='removed'){
				map.removeEntityById('poverty_pattani_'+d.id);
				map.removeEntityById('poverty_pattani_'+d.id+'label');
			}
			if(t=='create'){
				$$.addMarker(d);
			}
		}
	}
}

setTimeout(function(){
//DB.db({table:'poverty_pattani'}).get(function(r){
	 //poverty.GIS.addMarkers(r.data);
	 //console.log(r.data);
//});
},10000);
return poverty;
});