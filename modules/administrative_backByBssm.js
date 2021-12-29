(function(){
	LoadMap(function(map){
//phase1	var provinces_list = [18,32,33,35,37,46,47,49,58,94];
//phase2
		//var provinces_list = [18,32,33,35,37,46,47,49,58,94,30, 31, 34, 42, 45, 52, 65, 93, 95, 96];
		var provinces_list = [18,30,31,32,33,34,35,37,42,45,46,47,49,52,58,65,93,94,95,96];
		function loadAdminData(Layer,bound,offset){
			if(!$('#'+Layer.name).prop('checked')){
				map.removeLayer(Layer.name);
				return false;
			}
			var scale = 1;
			if(Layer.Label && Layer.Label.fontSize){
				scale = Layer.Label.fontSize/11;
			}
			if(Layer.scale && Layer.Label.scale){
				scale = Layer.Label.scale;
			}
			var outlineColor = Layer.outlineColor?Layer.outlineColor:'';
			var backgroundColor = Layer.backgroundColor?Cesium.Color.fromCssColorString(Layer.backgroundColor):Cesium.Color.fromCssColorString('#641706');
			if(!outlineColor){
				if(map.getToneColor() == 'dark'){
					outlineColor = Cesium.Color.FLORALWHITE;
				} else {
					outlineColor = Cesium.Color.DARKSLATEGRAY;
				}
			}
			var height = Layer.height?Layer.height:10;
		
			 $.ajax({
				type:'POST',
				url:Layer.url,
				crossDomain: true,
				data:$.param(queryOptions(bound,offset)),
				success: function(res){
					map.removeLayer(Layer.name);
					map.showLayer(Layer.name);
					var data = JSON.parse(res);
					$.each(data.features,function(){
						var max = 3.0e5*scale*1.2;
						var fillColor = Cesium.Color.WHITE;
						var attr = this.attributes;
						var feature = this;
						var label = Layer.Label.expression?eval(Layer.Label.expression):'';
						var Info = Layer.Info?eval(Layer.Info):'';
						var description = Layer.description?eval(Layer.description):'';
						var x;
						var y;
						require(["esri/geometry/Polygon"], function(esriPolygon){
							var p = new esriPolygon(feature.geometry.rings);
							y = parseFloat(p.centroid.latitude.toFixed(4));
							x = parseFloat(p.centroid.longitude.toFixed(4));
						});
						var extentDescription = '';
						if(provinces_list.includes(parseInt(attr.PROV_CODE))){
							max = 5.0e5*scale*1.2;
							fillColor = Cesium.Color.YELLOW;
							extentDescription=extentDescription+'<div style="padding: 5px;">'+
							'<span id="marker_view" class="zmdi zmdi-chart" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="รายงานศักยภาพ 5 มิติ"></span>';
							extentDescription=extentDescription+'</div>';
						}
						$.each(this.geometry.rings,function(i){
							var degrees = [];
							var ring = this;
							$.each(ring,function(){
								degrees.push(this[0]);
								degrees.push(this[1]);
							});
							var ent = {
								name:Info,
								parent:map.Layers[Layer.name],
								polygon : {
									hierarchy:Cesium.Cartesian3.fromDegreesArray(degrees),
									outlineColor:outlineColor,
									outlineWidth:Layer.outlineWidth?Layer.outlineWidth:4,
									fill:false,
									outline:true,
									shadows:Cesium.ShadowMode.ENABLED
								},
								description:description,
								extentDescription:extentDescription,
								view:function(){
									view5D(attr);
								}
							}
							map.viewer.entities.add(ent);
						});
						var point = {
							name:Info,
							parent:map.Layers[Layer.name],
							description:description,
							position:Cesium.Cartesian3.fromDegrees(x,y,height),
							//height:height,
							heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND,
							label:{
								text:label,
								scaleByDistance:new Cesium.NearFarScalar(1.0e2,scale,max,0.0),
								backgroundColor:backgroundColor,
								showBackground:true,
								fillColor:fillColor
							},
							extentDescription:extentDescription,
							view:function(){
								view5D(attr);
							}
						}
						map.viewer.entities.add(point);
					});
				}
			});
		}
		function getOffset(bound){
			var b = bound?bound:map.getBound();
			return parseFloat(((b.E-b.W)/map.viewer.container.clientWidth).toFixed(6));
		}
		function queryOptions(rings,offset,type){
			var rel = type?type:'esriSpatialRelEnvelopeIntersects';
			return {
				geometry:JSON.stringify({rings:rings}),
				geometryType:"esriGeometryPolygon",
				inSR:4326,
				outSR:4326,
				spatialRel:rel,
				outFields:"*",
				returnGeometry:true,
				maxAllowableOffset:offset,
				geometryPrecision:5,
				f:"pjson",
				token:''
			}
		}
		function view5D(attr){
			var title = '';
			var src = '';
			if(attr.PROV_CODE){
				src = '../survey_p2/?curr=report_jun12_5&jun='+attr.PROV_CODE;
				title = attr.prov_nam_t; //attr.prov_namt
			}
			if(attr.AMP_CODE){
				src = '../survey_p2/?curr=report_jun13_5&jun='+attr.PROV_CODE+'&amp='+attr.PROV_CODE+attr.AMP_CODE;
				title = attr.amphoe_t+' '+title; //attr.amp_namt
			}
			if(attr.TAM_CODE){
				src = '../survey_p2/?curr=report_jun14_5&jun='+attr.PROV_CODE+'&amp='+attr.PROV_CODE+attr.AMP_CODE+'&tmp='+attr.PROV_CODE+attr.AMP_CODE+attr.TAM_CODE;
				title = attr.tam_nam_t+' '+title; //attr.tam_namt
			}
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
				$('#data_view').html('<iframe id="dataiframe" class="responsive-iframe" style="display: none;width:100%;height: 100%;border: none;" src="'+src+'"></iframe>');
				_hide();
			}
			function _hide(){
				if(!$('#dataiframe').contents().find('.navbar')[0] || !$('#dataiframe').contents().find('footer')[0]){
					setTimeout(_hide,20);
					return false;
				}
				$('#dataiframe').contents().find('body').css('font-size','0.9em');
				$($('#dataiframe').contents().find('.row')[2]).hide();
				$($('#dataiframe').contents().find('.row')[1]).css('font-size','1.1em').css('margin-left',0).css('font-weight',800).html(title);
				$($('#dataiframe').contents().find('.row')[0]).hide();
				$('#dataiframe').contents().find('.navbar').hide();
				$('#dataiframe').contents().find('form').hide();
				$('#dataiframe').contents().find('footer').html('').css('height','40px');
				$('#dataiframe').show();
			}
		}
		//var admin_server = 'https://services8.arcgis.com/gsAq5vcFUKwSVHYm/ArcGIS/rest/services';
		var admin_server = 'https://gisportal.fisheries.go.th/arcgis/rest/services/Hosted';
		var administratives = [
			{
				name:'Provinces',
				url:admin_server+'/ขอบเขตจังหวัดWGS84/FeatureServer/0/query',
				outlineWidth:4,
				Label:{expression:"attr.prov_nam_t",fontSize:20,fillColor:Cesium.Color.BLUE},
				Info:"attr.prov_nam_t",
				description:"attr.prov_nam_t+'<br>'+attr.prov_nam_e",
				minOffset:0.15,
				title:'ขอบเขตจังหวัด',
				height:120,
				backgroundColor:'#000033',
				check:true
			},
			{
				name:'Districts',
				url:admin_server+'/ขอบเขตอำเภอWGS84/FeatureServer/0/query',
				outlineWidth:2,
				Label:{expression:"attr.amphoe_t",fontSize:16,fillColor:Cesium.Color.BLUE},
				Info:"attr.amphoe_t",
				description:"attr.amphoe_t+' '+attr.prov_nam_t+'<br>'+attr.amphoe_e+' '+attr.prov_nam_e",
				minOffset:0.003,
				title:'ขอบเขตอำเภอ',
				height:60,
				backgroundColor:'#000088',
				check:true
				
			},
			{
				name:'SubDistricts',
				url:admin_server+'/ขอบเขตตำบลWGS84/FeatureServer/0/query',
				outlineWidth:1,
				Label:{expression:"attr.tam_nam_t",fontSize:10,fillColor:Cesium.Color.BLUE},
				Info:"attr.tam_nam_t+' '+attr.amphoe_t+' '+attr.prov_nam_t",
				description:"attr.tam_nam_t+' '+attr.amphoe_t+' '+attr.prov_nam_t+'<br>'+attr.tam_nam_t+', '+attr.amphoe_e+', '+attr.prov_nam_e",
				minOffset:0.0007,
				title:'ขอบเขตตำบล',
				height:10,
				backgroundColor:'#0000FF',
				check:true
			}
		];	
		$.each(administratives,function(){
			var L = this;
			map.addLegend({id:L.name,title:L.title,checked:L.check});
			if(!map.Layers[L.name]){
				map.Layers[L.name] = map.viewer.entities.add(new Cesium.Entity());
				map.Layers[L.name].show = true;
			}
			setTimeout(function(){
				$('#'+L.name).change(function(){
					if($(this).prop('checked')){
						 map.showLayer(L.name);
					} else {
						map.removeLayer(this.name);
					}
				});
			},1000);		
		});
		map.viewer.camera.moveEnd.addEventListener(function(){
			var b = map.getBound();
			if(b && b.W>90 && b.N<30 && b.E<110 && b.S>0){
				var ring = [[[b.W,b.N],[b.E,b.N],[b.E,b.S],[b.W,b.S]]];
				var offset = getOffset(b);
				$.each(administratives,function(){
					if(offset<this.minOffset){
						loadAdminData(this,ring,offset);
					} else {
						map.removeLayer(this.name);
					}
				});
			} else {
				$.each(administratives,function(){
					map.removeLayer(this.name);
				});
			}
		});
	});
})();