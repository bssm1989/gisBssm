(function(){
	
	var countNum=0;
var map =	LoadMap();
var collection = {table:'survey_profile'};
var entities = map.viewer.entities;
var staff;
DB.db({table:'survey_staff'}).get(function(r){
	staff = r.data;
});
var dataTambon=[];
var dataGroup=[];


var survey_profile = {
	title:'สำรวจครัวเรือน',
	module:'survey_profile',
	GIS:{
		addMarkers:function(data){
			dataGroup.push(data);
			var t=2000;
			var $$ = this;
			map.addLegend({id:'survey_profile',title:'สำรวจครัวเรือน',checked:true,icon:'icons/home-1.png'});
			map.addLegend({id:'survey_profile_a',title:'ครัวเรือนทั้งหมด',checked:false,icon:'icons/home-1.png',parent:'survey_profile'});
			if(USER.Province && USER.Province.province_id){
				var _title = 'ครัวเรือนจังหวัดของคุณ';
				if(USER.Province.province_name_thai){
					_title = 'ครัวเรือนจังหวัด'+USER.Province.province_name_thai;
				}
				map.addLegend({id:'survey_profile_p',title:_title,checked:false,icon:'icons/home-white.png',parent:'survey_profile'});
			}
			map.addLegend({id:'survey_profile_b',title:'ครัวเรือนที่คุณสำรวจ',checked:true,icon:'icons/home-blue.png',parent:'survey_profile'});
			map.addLegend({id:'survey_profile_c',title:'*ต้องแก้ไขข้อมูล',checked:true,icon:'icons/home-yellow.png',parent:'survey_profile'});
			$.each(data,function(i){
				var d = this;
				/*if(i%2000 == 0){
					i t=t+2000;
				}*/ //bssm
				$$.addMarker(d);
					//},i+t);
			
			});
		},
		getLatLng:function(p,c){
			var $$ = this;
			if(p.JUN){
				p.province_id = p.JUN;
			}
			if(p.AMP){
				p.district_id = p.AMP;
			}
			if(p.TMP){
				p.sub_district_id = p.TMP;
			}
			map.getLatLngAdminID(p,function(r){
				p.lat = r.latLng.lat;
				p.lng =  r.latLng.lng;
				p.tempLatLng = true;
				c(p);
			});
		},
		createIcon:function(d){
			return 'icons/home-1.png';
		},
		addMarker:function(o){
			var $$ = this;
			if(!o.HC){
				return false;
			}
			//if(!o.lat || !o.lng || o.lat<1 || o.lat>20 || o.lng<80 || o.lng>120){ //ment by bssm
			if(0){
				$.ajax({
					type:'POST',
					url:'database.php',
					data:{where:"HC='"+o.HC+"'",table:'survey_b'},
					success:function(r){
						r = JSON.parse(r);
						if(!r.empty){
							$.each(r.data,function(){
								if(this.b1_1 && !isNaN(this.b1_1) && this.b1_2 && !isNaN(this.b1_2)){
									var lat = parseFloat(parseFloat(this.b1_1).toFixed(6));
									var lng = parseFloat(parseFloat(this.b1_2).toFixed(6));
									if(lat>1 && lat<20 && lng>80 && lng<120){
										o.lat = lat;
										o.lng = lng;
										//_add();
							//phase1	var ud = {id:o.id,lat:lat,lng:lng}
										var ud = {id:o.HC1,lat:lat,lng:lng}
										DB.db(collection).update(ud);
										return false;
									}
								}
							});
						}
						_add();
					}
				});
			} else {
	getLatLngGis(o);
			}/*  */
			
			
			
			function getLatLngGis(o){
			
					////console.log("gis")
				var server = 'https://gisportal.fisheries.go.th/arcgis/rest/services/Hosted/';
				//var server = 'https://services8.arcgis.com/gsAq5vcFUKwSVHYm/ArcGIS/rest/services/';
				var where;
				var L;
			
									
					for(var i=0;i<dataTambon.length;i++){
						if(dataTambon[i].tambon_id==o.TMP)
						{
							
							where="";
							
							//dataTambon[numIndexData]=[];
							break; 
						}
						else{
							
							where = "TAMBON_IDN='"+o.TMP+"'";
						}
						
					}
					
					if(where||dataTambon.length==0){
						where = "TAMBON_IDN='"+o.TMP+"'";
					var dataTmp=[];
					 dataTmp['tambon_id']=o.TMP;
					dataTmp['geometry']=[];
					dataTambon.push(dataTmp);
					}
					////debugger;
					L = 'ขอบเขตตำบลWGS84';
					L = '%E0%B8%82%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5WGS84';
			
				if(where){
					
					var query = {
						outSR:4326,
						outfields:"*",
						where:where,
						returnGeometry:true,
						geometryPrecision:3,
						returnCentroid:true,
						f:"pjson",
						token:''
					}
					// return $.get('/page.php');
					// $.post(server+L+'/FeatureServer/0/query',  function(result){

					// });
					return $.ajax({
						type: 'POST',
						url: server+L+'/FeatureServer/0/query',
						crossDomain: true,
						data:query,
						success: function(data){
							//debugger;
							
							data = JSON.parse(data);
							index=dataTambon.findIndex(p => p.tambon_id == o.TMP);
						//	//console.log(index);
							if(index!=-1){
								console.log(index);
								console.log(data.features[0].geometry.rings);
							dataTambon[index].geometry.push(data.features[0].geometry.rings);
							
							}
							$.each(dataGroup[0],function(i){
								if(this.TMP==o.TMP){
							 _add(this);
							// //console.log(this.TMP);
								}
							});
						},
						error:function(){
							
						}
					});
				}
				else{
					// _add();
				}

			}
			
			function IsPointInPolygon(p, polygon )
			{
					// var minX = polygon[ 0 ].X;  lat lng
					// var maxX = polygon[ 0 ].X;	X 	Y
					// var minY = polygon[ 0 ].Y;	1	0
					// var maxY = polygon[ 0 ].Y;
					var minX = polygon[ 0 ][1];
					var maxX = polygon[ 0 ][1];
					var minY = polygon[ 0 ][0];
					var maxY = polygon[ 0 ][0];
					for ( var i = 1 ; i < polygon.length ; i++ )
					{
						var q = polygon[ i ];
						minX = Math.min( q[1], minX );
						maxX = Math.max( q[1], maxX );
						minY = Math.min( q[0], minY );
						maxY = Math.max( q[0], maxY );
					}

					if ( parseFloat(p.X) < minX || parseFloat(p.X) > maxX || parseFloat(p.Y) < minY || parseFloat(p.Y) > maxY )
					{
						return false;
					}

					//https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
					var inside = false;
					
					var i = 0, j = polygon.length - 1;
    // for (i, j; i < polygon.length; j = i++) {
        // if ( (polygon[i].y > p.y) != (polygon[j].y > p.y) &&
                // p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x ) {
            // isInside = !isInside;
        // }
    // }
	//h;
					 for (i, j; i < polygon.length; j = i++) {
						if ( ( polygon[ i ][0] > parseFloat(p.Y) ) != ( polygon[ j][0] > parseFloat(p.Y) ) &&
							 parseFloat(p.X) < ( polygon[ j ][1] - polygon[ i ][1] ) * ( parseFloat(p.Y) - polygon[ i ][0] ) / ( polygon[ j][0] - polygon[ i ][0] ) + polygon[ i ][1] )
						{
							inside = !inside;
						}
					}

					return inside;
			}
			
			function _add(dataByHc){
				countNum++;
	console.log(countNum);
				/*if(!dataByHc.lat || !dataByHc.lng){
					$$.getLatLng(o,function(p){
						_add();
					});
					return false;
				}*/
				var layer = 'survey_profile_a';
				var icon = 'icons/home-1.png';
	//phase1	var id = 'survey_profile_'+dataByHc.id;
				var id = 'survey_profile_'+dataByHc.HC1;
				if(USER.Province && USER.Province.province_id && dataByHc.JUN && USER.Province.province_id == dataByHc.JUN){
					layer = 'survey_profile_p';
					icon = 'icons/home-white.png';
				}
				
				
						
				var latLng=[];
				latLng['X']=dataByHc.lat;
				latLng['Y']=dataByHc.lng;
				index=dataTambon.findIndex(p => p.tambon_id == dataByHc.TMP);
				
				var isInArea=IsPointInPolygon(latLng,dataTambon[index].geometry[0][0]);
				//var isInArea=IsPointInPolygon(dataByHc
				if(!isInArea){
					//console.log("true");
					icon = 'icons/home-blue.png';
				////console.log(dataByHc);
				}
				var search = dataByHc.HC+' '+dataByHc.PERSON;
				var by = '';
				/*if(staff && staff.length>0){
					$.each(staff,function(){
						if(this.HC==dataByHc.HC){
							by = this.staff;
							return false;
						}
					});
				}*/ //ment by bssm
				var mistake = [];
				if(USER.username == by){
					layer = 'survey_profile_b';
					icon = 'icons/home-blue.png';
				}
				if(USER.username == by|| (USER.level && USER.level == 'admin')){
					if(map.getEntityById(id)){
						survey_profile.last_edit = id;
					}
					if(!dataByHc.JUN){
						mistake.push('ยังไม่ระบุจังหวัด');
					}
					if(!dataByHc.AMP){
						mistake.push('ยังไม่ระบุอำเภอ');
					}
					if(!dataByHc.TMP){
						mistake.push('ยังไม่ระบุตำบล');
					}
					if(dataByHc.AMP.substring(0,2)!=dataByHc.JUN){
						mistake.push('ระบุอำเภอผิดพลาด');
					}
					if(dataByHc.TMP.substring(0,2)!=dataByHc.JUN || dataByHc.TMP.substring(0,2)!=dataByHc.AMP.substring(0,2)){
						mistake.push('ระบุตำบลผิดพลาด');
					}
					if(!dataByHc.HC){
						mistake.push('ยังไม่ระบุรหัสบ้าน');
					} else {
						if(dataByHc.HC.startsWith('0')){
							if(dataByHc.HC.substring(1,3) != dataByHc.JUN){
								mistake.push('ระบุจังหวัดหรือรหัสบ้านผิดพลาด');
							}
						} else {
							var mis = false;
							if(dataByHc.HC.substring(0,2) != dataByHc.JUN){
								mis = 1;

							//----Some Provinces exception
								if(dataByHc.JUN == 37 && dataByHc.HC.substring(0,2)==34){
									mis = false;
								}
								if(mis){
									mistake.push('ระบุจังหวัดหรือรหัสบ้านผิดพลาด');
								}
							}
						}
					}
				}
				var search = dataByHc.HC+' '+dataByHc.PERSON+' โดย:'+by;
				var ent;
				var extentDescription = '';
				if(dataByHc.photo){
					extentDescription = extentDescription+'<div style="display:inline-block;">';
					$.each(dataByHc.photo,function(){
						extentDescription = extentDescription+'<img style="cursor:pointer;margin:2px;" src="'+this.thumb+'" onclick="viewImage(\''+this.path+'\')">';
					});
					extentDescription = extentDescription+'</div>';
				}
				if(dataByHc.tempLatLng && (USER.username == by|| (USER.level && USER.level == 'admin'))){
					extentDescription=extentDescription+'<div style="padding: 5px;font-size: 0.8em;color: orange;">พิกัดตำแหน่งชั่วคราว (กรุณาย้ายพิกัด)</div>';
				}
				if(mistake && mistake.length>0 && USER.username == by){
					layer = 'survey_profile_c';
					icon = 'icons/home-yellow.png';
					extentDescription=extentDescription+'<div style="padding: 5px;font-size: 0.9em;color: yellow;">ต้องการแก้ไขข้อมูลที่ผิดพลาด</div>';
					$.each(mistake,function(i){
						extentDescription=extentDescription+'<div style="padding: 5px;font-size: 0.8em;color: yellow;">'+(i+1)+'.'+this+'</div>';
					});
				}
				extentDescription=extentDescription+'<div style="padding: 5px;">';

				if(USER.username == by || (USER.level && USER.level == 'admin')){
					if(dataByHc.tempLatLng){
						extentDescription=extentDescription+'<div style="padding: 5px;font-size: 0.8em;color: orange;">พิกัดตำแหน่งชั่วคราว (กรุณาย้ายพิกัด)</div>';
					}

					extentDescription=extentDescription+'<span id="marker_undo" class="zmdi zmdi-undo" style="font-size:24px;cursor:pointer;float: right;padding:16px;display:none;" aria-hidden="true" title="เลิกย้ายพิกัด"></span>'+
					'<span id="marker_save" class="zmdi zmdi-floppy" style="font-size:24px;cursor:pointer;float: right;padding:16px;display:none;" aria-hidden="true" title="บันทึกพิกัดใหม่"></span>'+
					'<span id="marker_move" class="zmdi zmdi-arrows" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="ย้ายจุดพิกัด"></span>'+
					'<span id="marker_edit" class="zmdi zmdi-edit" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="แก้ไขข้อมูล"></span>'+
					'<span id="marker_delete" class="zmdi zmdi-delete" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="ลบข้อมูลครัวเรือนและแบบสอบถาม"></span>'+
					'<a href="/survey_p2/survey_edit.php?HC='+dataByHc.HC+'" target="_blank" style="text-decoration:none;color:wheat;font-size:16px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="แบบสอบถาม">แบบสอบถาม</a>';
				}
				extentDescription=extentDescription+'<span id="marker_view" class="zmdi zmdi-chart" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="รายงานศักยภาพ 5 มิติ"></span>';
				extentDescription=extentDescription+'</div>';
				var show = false;
				if($('#'+layer).prop('checked')){
					show = true;
				}
				if(!map.Layers[layer]){
					map.Layers[layer] = entities.add(new Cesium.Entity());
					map.Layers[layer].show = show;
				}
				var p={
					id:id,
					parent:map.Layers[layer],
					search:search,
					name:dataByHc.HC,
					description:{
						value:'',
						getValue:function(){
							if(!this.value){
								this.value = {
									hc:'รหัสบ้าน : '+dataByHc.HC+'<br><br>',
									h_no:'',
									v_no:'',
									v_name:'',
									sub_district:'',
									district:'',
									province:'',
									postcode:'',
									location1:'<br><br>พิกัด : ',

									person:'<br><br>ผู้ให้ข้อมูล : ',
									tel:'',
									member:'<br><br>สมาชิกครัวเรือน : ',
									by:'<br><br>ผู้สำรวจ : ',
									mistake:''
								}
								var v = this.value;
								if(dataByHc.MBNO){
									v.h_no = dataByHc.MBNO+' ';
								}
								if(dataByHc.MB){
									if(dataByHc.MB>100){
										v.v_no = 'หมู่ที่ '+parseInt(dataByHc.MB.slice(-2))+' ';
									} else {
										v.v_no = 'หมู่ที่ '+dataByHc.MB+' ';
									}
								}
								if(dataByHc.MM){
									v.v_name = 'บ้าน'+dataByHc.MM+' ';
								}
							//	if(dataByHc.PERSON){
							//		v.person = v.person+dataByHc.PERSON;
								if(dataByHc.PERSON_NAME){
									v.person = v.person+dataByHc.PERSON_NAME+' '+dataByHc.PERSON_SNAME;
								}
								
								v.location1=v.location1+dataByHc.lat+' , '+dataByHc.lng

								if(dataByHc.TEL && dataByHc.TEL.length>3){
									v.tel = '<br>โทร : '+dataByHc.TEL;
								}
								if(dataByHc.POSTCODE && dataByHc.POSTCODE.length>3){
									v.postcode = ' '+dataByHc.POSTCODE;
								}
								if(ent.mistake){
									v.mistake = '<div style="padding: 5px 0;color: yellow;">ระบุพิกัดหรือเขตการปกครองผิดพลาด</div>';
								}
								if(dataByHc.TMP){
									DB.db({table:'tambon',where:"tambon_id='"+dataByHc.TMP+"'"}).get(function(r){
										if(r.data && r.data[0]){
											if(r.data[0].province_id == 10){
												v.sub_district = r.data[0].tambon_name_thai+' ';
											} else {
												v.sub_district = 'ต.'+r.data[0].tambon_name_thai+' ';
											}
											if(ent.mistake&&ent.mistake.sub_district){
												v.mistake=v.mistake+'<div style="padding: 5px 0;font-size: 0.9em;color: yellow;">*พิกัดอยู่นอกขอบเขต '+v.sub_district+'</div>';
											}
										}
									});
								}
								if(dataByHc.AMP){
									DB.db({table:'district',where:"district_id='"+dataByHc.AMP+"'"}).get(function(r){
										if(r.data && r.data[0]){
											v.district = r.data[0].district_name_thai+' ';
											if(v.district.startsWith('อำเภอ')){
												v.district = v.district.replace('อำเภอ','อ.');
											}
											if(ent.mistake&&ent.mistake.district){
												v.mistake=v.mistake+'<div style="padding: 5px 0;font-size: 0.9em;color: yellow;">*พิกัดอยู่นอกขอบเขต '+v.district+'</div>';
											}
										}
									});
								}
								if(dataByHc.JUN){
									DB.db({table:'province',where:"province_id='"+dataByHc.JUN+"'"}).get(function(r){
										if(r.data && r.data[0]){
											if(r.data[0].province_id == 10){
												v.province = r.data[0].province_name_thai;
											} else {
												v.province = 'จ.'+r.data[0].province_name_thai;
											}
											if(ent.mistake&&ent.mistake.province){
												v.mistake=v.mistake+'<div style="padding: 5px 0;font-size: 0.9em;color: yellow;">*พิกัดอยู่นอกขอบเขต '+v.province+'</div>';
											}
										}
									});
								}
								DB.db({table:'survey_a',where:"HC='"+dataByHc.HC+"' AND survey_year='2564'"}).get(function(r){
									$.each(r.data,function(i){
									//	v.member = v.member+'<br>'+(i+1)+'.'+this.a2;
										v.member = v.member+'<br>'+(i+1)+'.'+this.a2_2+' '+this.a2_3;
									});
								});
								DB.db({table:'survey_staff',where:"HC='"+dataByHc.HC+"' AND survey_year='2564'"}).get(function(s){
									if(s.data && s.data[0]){
										DB.db({table:'volunteer',where:"username='"+s.data[0].staff+"'"}).get(function(r){
											if(r.data && r.data[0]){
												v.by =v.by+r.data[0].name;
											}
										});
									}
								});
							} else {
								var v = this.value;
								return v.hc+'ที่อยู่ : '+v.h_no+v.v_no+v.v_name+v.sub_district+v.district+v.province+v.postcode+v.location1+v.member+v.person+v.tel+v.by+v.mistake;
							}
						}
					},
					extentDescription:extentDescription,
					position:map.setPosition(dataByHc),
					originalPosition:map.setPosition(dataByHc),
					billboard:{
						image:icon,
						verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
						scaleByDistance:new Cesium.NearFarScalar(2000,1,1e7,0)
					},
					move:function(){
						map.pinMoving(ent,function(x){
							$('#marker_save').show();
							$('#marker_undo').show();
						});
					},
					view:function(){
						if($('#data_view')[0]){
							return false;
						}
						var div = '<div class="modal"><div class="modal-dialog modal-lg" style="height: 98%;width:98%;max-width:800px;margin:4px;"><div class="modal-content" style="height: 100%;"><div class="modal-header" style="padding: 4px;"><button type="button" class="close" data-dismiss="modal">×</button></div><div class="modal-body" id="data_view" style="padding:4px;height: 96%;"></div></div></div></div>';
						setTimeout(function(){
							$(div).modal();
							_view();
						},100);
						function _view(){
							if(!$('#data_view')[0]){
								setTimeout(_view,50);
								return false;
							}
							var width = $('#image_view').width()-2;
							$('#data_view').html('<iframe id="dataiframe" class="responsive-iframe" style="display: none;width:100%;height: 100%;border: none;" src="../survey_p2/?curr=show_hc6&hc='+dataByHc.HC+'"></iframe>');
							_hide();
						}
						function _hide(){
							if(!$('#dataiframe').contents().find('.navbar')[0] || !$('#dataiframe').contents().find('footer')[0]){
								setTimeout(_hide,20);
								return false;
							}
							$('#dataiframe').contents().find('body').css('font-size','0.9em');
							$('#dataiframe').contents().find('.navbar').hide();
							$('#dataiframe').contents().find('footer').html('<a href="/survey_p2/survey_edit.php?HC='+dataByHc.HC+'">แบบสอบถาม HC:'+dataByHc.HC+'</a>').css('height','40px');
							$('#dataiframe').show();
						}
					},
					save:function(){
						var d = {id:ent.id.replace('survey_profile_',''),lat:ent.lat,lng:ent.lng}
						DB.db(collection).update(d,function(out){
							$('#marker_save').hide();
							$('#marker_undo').hide();
							survey_profile.last_edit = ent.id;
							setTimeout(function(){
								map.viewer.selectedEntity = undefined;
								ent.draggable = false;
							},1000);
						});
						var dd = {b1_1:ent.lat,b1_2:ent.lng}
						DB.db({table:'survey_b'}).updateWhere(dd,"HC='"+dataByHc.HC+"'");
					},
					edit:function(){
						var editor = survey_profile.dataTables.editor();
						var id = ent.id.replace('survey_profile_','');
						survey_profile.dataTables.search(id).draw();
						editor.editRow(id,ent);
					},
					delete:function(){
						var editor = survey_profile.dataTables.editor();
						var id = ent.id.replace('survey_profile_','');
						survey_profile.dataTables.search(id).draw();
						editor.removeRow(id,ent.name,function(){
							map.viewer.selectedEntity = undefined;
						});
					}
				}
				map.removeEntityById(id);
				ent = entities.add(p);
				if(!dataByHc.tempLatLng && USER.username == by){
					setTimeout(function(){
						map.getAdmin(o,function(a){
							if(dataByHc.JUN&&a.province_id!=dataByHc.JUN){
								if(!ent.mistake){
									ent.mistake = {}
								}
								ent.mistake.province=true;
							}
							if(dataByHc.AMP&&a.district_id!=dataByHc.AMP){
								if(!ent.mistake){
									ent.mistake = {}
								}
								ent.mistake.district=true;
							}
							if(dataByHc.TMP&&a.sub_district_id!=dataByHc.TMP){
								if(!ent.mistake){
									ent.mistake = {}
								}
								ent.mistake.sub_district=true;
							}
							if(ent.mistake){
								ent.billboard.image = 'icons/home-yellow.png';
								ent.parent=map.Layers['survey_profile_c'];
							}
						});
		//phase1	},5000+dataByHc.id*10);
					},5000+dataByHc.HC1*10);
				}
				if(isInArea){
					//console.log("true");
					icon = 'icons/home-blue.png';
				//console.log(dataByHc);
				}
				if(survey_profile.last_edit && survey_profile.last_edit==ent.id){
					setTimeout(function(){
						map.viewer.selectedEntity = ent;
					},500);
				}
			}
		},
		editMarker:function(d){
			var $$ = this;
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
				map.removeEntityById('survey_profile_'+d.id);
			}
			if(t=='create'){
				$$.addMarker(d);
			}
		}
	},
	Table:{
		title:'ข้อมูลครัวเรือน',
		module:'survey_profile',
		db:collection,
		columns:[{data:null},{data:null},{data:null},{data:null},{data:null},{data:null},{data:'id',title:'ID',visible:false}],
		columnDefs: [
			{targets:0,title:'รหัสบ้าน',width:'80px',
				render:function(d){
					return d.HC;
				}
			},
			{targets:1,title:'บุคคล',width:'140px',
				render:function(d){
					return d.PERSON;
				}
			},
			{targets:2,title:'จังหวัด',width:'60px',
				render:function(d){
					return getProvince(d.JUN);
				}
			},
			{targets:3,title:'Lat,Lng',width:'80px',
				render:function(d){
					var r = '';
					if(d.lat&&d.lng){
						var id = 'survey_profile_'+d.id;
						r =r+ '<br><a style="font-size: 0.9em;text-decoration: none;cursor: pointer;" title="คลิกเพื่อดูแผนที่" onclick="panToLocation(\''+id+'\')">'+d.lat+','+d.lng+'</a>';
					}
					return r;
				}
			},
			{targets:4,title:'แบบสอบถาม',width:'60px',
				render:function(d){
					return '<a href="/survey_p2/survey_edit.php?HC='+d.HC+'" target="_blank" style="text-decoration:none;cursor:pointer;" aria-hidden="true" title="แบบสอบถาม">แบบสอบถาม</a>';
				}
			},
			{targets:5,title:'รูป',width:'200px',
				render:function(d){
					var r = '';
					if(d.photo && d.photo.length>0){
						$.each(d.photo,function(){
							r = r+'<span style="display:none;">มีรูป</span><img width="60" style="cursor:pointer;margin:2px;" src="'+this.thumb+'" onclick="viewImage(\''+this.path+'\')">';
						});
					}
					return r;
				}
			}
		],
		fields: [
			{type:'hidden',name:'id'},
			{label:'รหัสบ้าน <red>*</red>',name:'HC',attr:{pattern:'[0-9]{4}-[0-9]{6}-[0-9]{1}',placeholder:'xxxx-xxxxxx-x'},required:true},
			provinceIdField(1,'จังหวัด','JUN','AMP'),
			districtIdField(1,'อำเภอ','AMP','TMP'),
			subDistrictIdField(1,'ตำบล','TMP'),
			{type:'hidden',name:'PERSON'},
			{label:'Lat (พิกัดละติจูด องศาทศนิยม)',name:'lat',placeholder:'5.600001 - 20.499999',attr:{type:'number',title:'ค่าพิกัดละติจูด องศาทศนิยม 4-6 ตำแหน่ง เช่น 6.6789 หรือ 13.123456 ประเทศไทยอยู่ระหว่างละติจูดที่ 5.6(ทิศใต้) - 20.5(ทิศเหนือ))',step:'0.0000000001',min:5.6001,max:20.4999}},
			{label:'Long (พิกัดลองจิจูด องศาทศนิยม)',name:'lng',placeholder:'97.300001 - 105.699999',attr:{type:'number',title:'ค่าพิกัดลองจิจูด องศาทศนิยม 4-6 ตำแหน่ง เช่น 98.1234 หรือ 100.234567 ประเทศไทยอยู่ในลองจิจูดที่ 97.3(ทิศตะวันตก) - 105.7(ทิศตะวันออก)',step:'0.0000000001',min:97.3001,max:105.6999}},
			{label:'รูป',name:'photo',type:'uploadMany',uploadText:'เลือกรูป',clearText:'ลบรูป',noFileText:'ยังไม่มีรูป',dragDrop:true,dragDropText:'หรือคลิกลากรูปมาวางในกรอบนี้',
				display: function(d){
					return '<img style="cursor:pointer;" src="'+d.thumb+'" onclick="viewImage(\''+d.path+'\')" width="80px"/>';
				},
				noImageText: '-',
				upLoadFile:function(editor, conf, files, p, c){
					conf.folder = 'photos/survey';
					editor.upLoadFile(editor, conf, files, p, c);
				},
				multiple:true,json:true,folder:'photos/survey',attr:{accept:'image/*'}
			}
		],
		fnTable:function(t){if(!USER.level || USER.level!='admin'){t.hideEditorButton()}},
		fnEditor:function(editor){
			var er;
			function _error(s){
				if(editor.field('HC').val() && editor.s.action == 'create' && !er){
					editor.field('HC').error('กำลังตรวจสอบข้อมูล');
					DB.db({table:'survey_profile',where:"HC='"+editor.field('HC').val()+"'"}).get(function(r){
						if(r.empty){
							editor.field('HC').error('');
							editor.error('');
							if(s){
								er = true;
								editor.submit();
								setTimeout(function(){
									er = false;
								},2000);
							}
							return false;
						}
						$.each(r.data,function(){
							editor.field('HC').error('');
							editor.error('');
							if(editor.field('HC').val() == this.HC){
								editor.field('HC').error('มีรหัสบ้าน "'+this.HC+'" อยู่ในระบบแล้ว');
								editor.error('มีรหัสบ้าน "'+this.HC+'" อยู่ในระบบแล้ว');
								editor.field('HC').input().focus();
								return false;
							}
						});
					});
				}
			}
			editor.field('HC').input().on('change',function(){
				_error();
			});
			editor.on('preSubmit', function(){
				_error(true);
			});
			editor.on('postSubmit', function(a,b,c){
				if(c.action=='edit'){
					$.each(b.data,function(){
						if(this.HC){
							var d = {b1_1:this.lat,b1_2:this.lng}
							DB.db({table:'survey_b'}).updateWhere(d,"HC='"+this.HC+"'");
						}
					});
				}
				if(c.action == 'remove'){
					//var tb = ['staff','a1','a2','b1','b2','b3','c1','c2','d1','d2','d3','e1','e2','e3','f1'];
					var tb = ['staff','a','b','c','d','e','f','g'];
					$.each(c.data,function(){
						if(this.HC){
							var hc = this.HC;
							$.each(tb,function(i){
								DB.db({table:'survey_'+this}).deleteWhere("HC='"+hc+"'");
							});
						}
					});
				}
			});
		}
	}
}
return survey_profile;
});