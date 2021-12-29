var ALGIS = function(options){
var $$ = this;
this.options = options?options:{}
this.titleContainer = 'titleContainer';
this.home = {
	x:$$.options&&$$.options.home&&$$.options.home.x?$$.options.home.x:100.7,
	y:$$.options&&$$.options.home&&$$.options.home.y?$$.options.home.y:13.8,
	z:$$.options&&$$.options.home&&$$.options.home.z?$$.options.home.z:10000000
}
this.init = function(){
	if(!$){
		setTimeout(function(){
			$$.init();
		},1);
		return false;
	}
	if($$.containerID){
		return false;
	}
	$$.containerID = $$.options&&$$.options.containerID?$$.options.containerID:'ALGISContainer';
	Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTM3MWFjMy01YjMwLTRiOTQtOWYzMy02YjIyNjcwM2Y5YjgiLCJpZCI6MTE4NDYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NTk4MjAyMTB9.cAenIn_UCizYjN4_sRr6Q_iI3NwIJdFagOFf9qSb-_g';
	//Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYjMxNDdiOS1jZGRlLTRmYjgtODlmZC1kMjgxMWUyZGExNzAiLCJpZCI6NDQ2MCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MDkwNDI0OX0.-46e7v4dPecRdAw5X1vySdBWDOkUGVWoNsOpyvVfzP4';
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees($$.home.x-2,$$.home.y-2,$$.home.x+2,$$.home.y+2);
	Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.15;
	$$.top = $$.options&&$$.options.top?$$.options.top:0;
	if(!$('#'+$$.containerID)[0]){
		$('body').append('<div id="'+$$.containerID+'" style="position:fixed;width:100%;z-index:10;"></div>');
	}
	$$.viewer = new Cesium.Viewer($$.containerID,{
		timeline: false,
		animation: false
	});
	//$$.viewer.scene.mode= Cesium.SceneMode.SCENE2D;
	//---add by somporn
	$$.viewer.scene.globe.tileCacheSize = 1000; // default 100
	$$.viewer.scene.globe.maximumScreenSpaceError = 2;
	//---end of adding by somporn	
	$$.infoBox = $('.cesium-infoBox');
	$$.container = $($$.viewer.container);
	$$.setTop($$.top);
	$$.toolbar = $('.cesium-viewer-toolbar');
	$$.toolbar.css('top','0');
	$$.toolbar.css('right','2px');
	$('.cesium-credit-textContainer').remove();
	$('.cesium-toolbar-button').css('margin-left','1px');
	$('.cesium-credit-expand-link').remove();
	$('.cesium-widget-credits').after('<div id="zoom_lavel" class="cesium-widget-credits" style="margin:14px;user-select: none;font-size: 12px;"></div>');
	$$.viewer.camera.setView({
		destination:Cesium.Cartesian3.fromDegrees($$.home.x,$$.home.y,$$.home.z)
	});
	$$.dynamicLabels = $$.viewer.scene.primitives.add(new Cesium.LabelCollection());
	$($$.viewer.infoBox.frame).after('<div id="descriptionBox" style="display:none;padding:8px;overflow-y: auto;"></div>');
	$$.descriptionBox = $('#descriptionBox');
	setTimeout(function(){
		if($$.options.Terrain){
			$$.selectTerrain($$.options.Terrain);
		}
		if(options.Imagery){
			$$.selectImagery($$.options.Imagery);
		}
	},10000);
	if($$.options.kmlLayer){
		$$.kmlLayer();
	}
	if($$.options.kmlUpload){
		$$.kmlUpload = $$.options.kmlUpload;
		setTimeout(function(){
			$$.kmlUploadButton();
		},100);
	}
	$$.viewer.selectedEntityChanged.addEventListener(function(e){
		if(e){
			$$.infoBox.css('top',$$.toolbar.height()+'px');
			if(window.innerWidth<400){
				$$.infoBox.css('width','60%');
			}
			if(e.fullWidth){
				$$.infoBox.css('width','100%');
			}
			if(e.width){
				var w = e.width.endsWith('%')||e.width.endsWith('px')?e.width:e.width+'px';
				$$.infoBox.css('width',w);
			}
			e.description.value = '';
			if(e.extentDescription){
				console.log("extentDescription");
				setTimeout(function(){
					$$.descriptionBox.html(e.extentDescription).show();
				},100);
				setTimeout(function(){
					var top = parseInt($$.descriptionBox.offset().top);
					$$.descriptionBox.css('max-height',(window.innerHeight-top-10)+'px');
					if($('#marker_edit')[0] && e.edit){
						$('#marker_edit').on('click',function(){
							e.edit();
						});
					}
					if($('#marker_delete')[0] && e.delete){
						$('#marker_delete').on('click',function(){
							e.delete();
						});
					}
					if($('#marker_view')[0] && e.view){
						$('#marker_view').on('click',function(){
							e.view();
						});
					}
					if($('#marker_move')[0] && e.move){
						$('#marker_move').on('click',function(){
							$('#marker_move').css('color','yellow');
							e.move();
						});					
					}
					if($('#marker_save')[0] && e.save){
						$('#marker_save').on('click',function(){
							e.save();
							$('#marker_undo').hide();
							$('#marker_save').hide();
							$('#marker_move').css('color','');
						});
					}
					if($('#marker_remove')[0] && e.remove){
						$('#marker_remove').on('click',function(){
							e.remove();
						});
					}
					if($('#marker_undo')[0] && e.originalPosition){
						$('#marker_undo').on('click',function(){
							e.position = e.originalPosition;
							$('#marker_undo').hide();
							$('#marker_save').hide();
							$('#marker_move').css('color','');
							e.draggable = false;
						});
					}
				},200);
			} else {
				$$.descriptionBox.html('').hide();
			}
			//$(window).trigger('resize');
		}
	});
	$$.searchText = '';
	$('.cesium-geocoder-input').keyup(function(){
		setTimeout(function(){
			var searchText = $$.viewer.geocoder.viewModel.searchText;
			if(!searchText || $$.searchText == searchText || searchText.length<3){
				return false;
			}
			$$.searchText = $$.viewer.geocoder.viewModel.searchText;
			var c = 0;
			$$.viewer.geocoder.viewModel.suggestions = [];
			$.each($$.viewer.entities.values,function(){
				if(c>50){
					return false;
				}
				if(this.search){
					var m = false;
					var ent = this;
					if(ent.search.trim().toLowerCase().includes(searchText.trim().toLowerCase())){
						m = true;
					} else {
						var search = $$.viewer.geocoder.viewModel.searchText.split(' ');
						var nm = false;
						$.each(search,function(){
							if(this.length>2){
								if(ent.search.trim().toLowerCase().includes(this.trim().toLowerCase())){
									m = true;
								} else {
									m = false;
									nm = true;
								}
							}
							if(nm){
								m = false;
							}
						});
					}
					setTimeout(function(){
						if(m){
							var inc = false;
							$.each($$.viewer.geocoder.viewModel.suggestions,function(){
								if(this.id && this.id == ent.id){
									inc = true;
								}
							});
							if(!inc && c<50){
								$$.viewer.geocoder.viewModel.suggestions.push({displayName:ent.search,destination:ent.position.getValue(),id:ent.id});
								c = c+1;
							}
						}
					},1);
				}
			});
		},500);
	});
	$$.viewer.geocoder.viewModel.complete.addEventListener(function(){
		var val = $$.viewer.geocoder.viewModel.searchText;
		if(val && val.length>4){
			$.each($$.viewer.entities.values,function(){
				if(this.search && this.search == val){
					var ent = this;
					$$.viewer.flyTo(ent);
					ent.show = true;
					if(ent.parent){
						ent.parent.show = true;
					}
					$$.viewer.selectedEntity = ent;
					return false;
				}
			});
		}
	});
	$$.viewer.camera.moveEnd.addEventListener(function(){
		$$.zoom = $$.getZoom();
		$$.bound = $$.getBound();
		$$.dynamicLabels.removeAll();
		var z = $$.zoom/1000+' กม.';
		if($$.zoom<1000){
			z = $$.zoom+' ม.';
		}
		$('#zoom_lavel').html('ความสูงระดับสายตา '+z);
		if($$.kmlData){
			$.each($$.kmlData,function(){
				if($('#'+this.layer).prop('checked')){
					if(this.maxZoom && $$.zoom>this.maxZoom){
						$$.hideLayer(this.layer);
					} else {
						$$.showLayer(this.layer);
					}
				} else {
					$$.hideLayer(this.layer);
				}
			});
		}
		if($$.zoom<2500){
			$.each($$.viewer.entities.values,function(){
				if(this.dynamicLabel && this.isShowing){
					var text = this.dynamicLabel.name?this.dynamicLabel.name:this.name;
					if(text && $$.inBound(this)){
						var z = $$.zoom;
						var t = '';
						var txt = this.dynamicLabel.name.split(' ');					
						if(z>1500){
							t = txt[0];
							if(txt[1] && t.length<10){
								t=t+' '+txt[1];
							}
							if(txt[2] && t.length<10){
								t=t+' '+txt[2];
							}
							if(t.length>10){
								t = t.substring(0,8)+'...';
							}
						} else if(z>1200){
							t = txt[0];
							if(txt[1] && t.length<16){
								t=t+' '+txt[1];
							}
							if(txt[2] && t.length<16){
								t=t+' '+txt[2];
							}
							if(t.length>18){
								t = t.substring(0,16)+'...';
							}
						} else if(z>1000){
							t = txt[0];
							if(txt[1] && t.length<16){
								t=t+' '+txt[1];
							}
							if(txt[2] && t.length<20){
								t=t+' '+txt[2];
							}
							if(t.length>25){
								t = t.substring(0,23)+'...';
							}
						} else {
							t=this.dynamicLabel.name;
							if(t.length>50){
								t=t.substring(0,45)+'...';
							}
						}
						t = textProcess(t);
						this.dynamicLabel.text =t;
						$$.dynamicLabels.add(this.dynamicLabel);
					}
				}
			});
		}
	});
	Cesium.knockout.getObservable($$.viewer.baseLayerPicker.viewModel,'selectedImagery').subscribe(function(){
		$$.toneColor = $$.getToneColor();
	});
	Cesium.knockout.getObservable($$.viewer.baseLayerPicker.viewModel,'selectedTerrain').subscribe(function(){
		$$.selectTerrain($$.viewer.baseLayerPicker.viewModel.selectedTerrain.name);
	});
	$$.viewer.canvas.addEventListener('click', function(e){
		var p= new Cesium.Cartesian2(e.clientX, e.clientY);
		var el = $$.viewer.scene.globe.ellipsoid;
		var ct = $$.viewer.camera.pickEllipsoid(p, el);
		if(ct){
			var cg = el.cartesianToCartographic(ct);
			e.lat = parseFloat(Cesium.Math.toDegrees(cg.latitude).toFixed(6));
			e.lng = parseFloat(Cesium.Math.toDegrees(cg.longitude).toFixed(6));
			e.latLng = {lat:e.lat,lng:e.lng}
		} else {
			e.latLng = {lat:'',lng:''}
			e.lat = '';
			e.lng = '';
		}
		e.selectedEntity =  $$.viewer.selectedEntity?$$.viewer.selectedEntity:'';
		e.entity =  e.selectedEntity;
	}, false);
	var title = '<div id="'+$$.titleContainer+'" style="float:left;margin:2px;text-align:center;border-radius: 3px;padding: 7px 2px;color: white;background: rgba(38,38,38,0.95);font-size:0.9em;"></div>';
	$$.toolbar.prepend(title);
	if($$.options.markable && !$('#mapMarking')[0]){
		$$.markable = false;
		$$.markerIcon = new Cesium.PinBuilder().fromText('M',Cesium.Color.DEEPSKYBLUE,32).toDataURL();
		$$.markerIconDisable = new Cesium.PinBuilder().fromText('M',Cesium.Color.GRAY,32).toDataURL();
		$$.toolbar.append('<button title="คลิกเพื่อเพิ่มพิกัดบนแผนที่" style="cursor: pointer;" id="mapMarking" class="cesium-button cesium-toolbar-button"><img src="'+$$.markerIconDisable+'" ></button>');
		$('#mapMarking').off().on('click',function(){
			if($$.markable){
				$$.Marking(null);
				$('#mapMarking').html('<img src="'+$$.markerIconDisable+'" >');
				$('#mapMarking').attr('title','คลิกเพื่อเพิ่มพิกัดบนแผนที่');
			} else {
				$$.markable = true;
				$$.Marking({});
				$('#mapMarking').html('<img src="'+$$.markerIcon+'" >');
				$('#mapMarking').attr('title','คลิกเพื่อปิดการเพิ่มพิกัดบนแผนที่');
			}
		});
	}
	if($$.options.title){
		$('#'+$$.titleContainer).html($$.options.title).show();
	} else {
		$('#'+$$.titleContainer).html('').hide();
	}
	if($$.getWidth()<600){
		$('#'+$$.titleContainer).css('width',$$.getWidth()-8+'px');
	} else {
		$('#'+$$.titleContainer).css('width','');
	}
	$(window).resize(function(){
		$$.setTop($$.top);
		if($$.getWidth()<600){
			$('#'+$$.titleContainer).css('width',$$.getWidth()-8+'px');
		} else {
			$('#'+$$.titleContainer).css('width','');
		}
		$$.infoBox.css('top',$$.toolbar.height()+'px');
	});
}
this.inBound = function(p){
	if(!p){return false;}
	var a;
	if(p.position){
		a = $$.positionToLatLng(p.position);
	} else {
		if(p.lat && p.lng){
			a = p;
		}
	}
	if(!a || !a.lat || !a.lng){
		return false;
	}
	var b = $$.bound;
	if(b && a.lat>b.S && a.lat<b.N && a.lng<b.E && a.lng>b.W){
		return true;
	} else {
		return false;
	}
}
this.selectImagery = function(name){
	$.each($$.viewer.baseLayerPicker.viewModel.imageryProviderViewModels,function(){
		if(this.name == name){
			$$.viewer.baseLayerPicker.viewModel.selectedImagery= this;
		}
	});
}
this.selectTerrain = function(name){
	$$.viewer.baseLayerPicker.viewModel.selectedTerrain = $$.viewer.baseLayerPicker.viewModel.terrainProviderViewModels[0];
	$.each($$.viewer.baseLayerPicker.viewModel.terrainProviderViewModels,function(){
		if(this.name == name){
			$$.viewer.terrainProvider=this.creationCommand();
		}
	});
}
this.getToneColor = function(){
	var name = $$.getSelectedImagery();
	var dark = ['Bing Maps Aerial','Bing Maps Aerial with Labels','Sentinel-2','Blue Marble','Earth at night','Mapbox Satellite','Mapbox Streets','ESRI World Imagery'];
	if(dark.includes(name)){
		$$.toneColor = 'dark';
		return 'dark';
	} else {
		$$.toneColor = 'bright';
		return 'bright';
	}
}
this.getSelectedImagery = function(){
	return $$.viewer.baseLayerPicker.viewModel.selectedImagery.name;
}
this.setView = function(x,y,z){
	x = parseFloat(x);
	y = parseFloat(y);
	z = parseFloat(z);
	$$.viewer.camera.setView({
		destination:Cesium.Cartesian3.fromDegrees(x,y,z)
	});	
}
this.addLayer = function(o,c){	
	if(o&&o.name){
		if(o.legend!=false){
			$$.addLegend(o);
		}
	}
	if(c){
		c(o);
	}
}
this.addLegend = function(o){
	if(!$$.legendContainer){
		$$.legendLayer();
	}
	if(o){
		var container = $$.legendContainer;
		if(o.container){
			container = o.container;
		}
		if(o.id&&!$('#'+o.id)[0]){
			var title = o.title?o.title:o.id;
			var checked = o.checked?' checked':'';
			var color = o.color?o.color:'#efefef';
			
			var margin = '';
			var fz = '';
			var wh = 'width:24px;height:24px;';
			var wh1 = 'width:16px;height:16px;';
			if(o.parent){
				margin = 'margin-left:16px;';
				fz='font-size:0.9em;';
				wh = 'width:20px;height:20px;';
				wh1 = 'width:13px;height:13px;';
			}
			var icon = o.icon?'<img src="'+o.icon+'" style="'+wh+'">':'<span class="circle" style="border:1px solid;background-color:'+color+';'+wh1+'"></span>';
			var l = '<div class="layer-select" style="'+margin+fz+'">'+icon+'<input id="'+o.id+'" style="margin: 8px;cursor:pointer;" type="checkbox"'+checked+'><label for="'+o.id+'">'+title+'</label></div>';
			if(o.parent){
				$('#'+o.parent+'_wrapper').append(l);
			} else {
				container.append('<div id="'+o.id+'_wrapper">'+l+'</div>');
			}
			setTimeout(function(){
				if(o.change){
					o.change();
				}
				$('#'+o.id).change(function(){
					if($(this).prop('checked')){
						 $$.showLayer(o.id);
					} else {
						$$.hideLayer(o.id);
					}
				});
				if(o.parent){
					$('#'+o.parent).change(function(){
						if($(this).prop('checked')){
							$('#'+o.id).prop('checked',true);
						} else {
							$('#'+o.id).prop('checked',false);
						}
						$('#'+o.id).trigger('change');
					});
				}
			},500);
		}
	}
}
this.getBound =function(){
	var w = 999;
	var s = 999;
	var e = -999;
	var n = -999;
	var tiles = $$.viewer.scene.globe._surface.tileProvider._tilesToRenderByTextureCount;
	if(tiles){
		$.each(tiles,function(i,t){
			if(t){
				$.each(t,function(){
					w = Math.min(w, this.rectangle.west);
					s = Math.min(s, this.rectangle.south);
					e = Math.max(e, this.rectangle.east);
					n = Math.max(n, this.rectangle.north);
				});
			}
		});
	}
	if(w < 999){
		var W = parseFloat(Cesium.Math.toDegrees(w).toFixed(4));
		var S = parseFloat(Cesium.Math.toDegrees(s).toFixed(4));
		var E = parseFloat(Cesium.Math.toDegrees(e).toFixed(4));
		var N = parseFloat(Cesium.Math.toDegrees(n).toFixed(4));
		return {W:W,N:N,E:E,S:S}
	} else {
		return false;
	}
}
this.legendLayer = function(){
	var div = '<div id="legendContainer" style="border: 1px solid #888;border-radius: 5px;padding: 5px;background-color: #efefef;"></div>';
	$('.cesium-baseLayerPicker-dropDown').prepend(div);
	var title = '<div style="font-size: 16pt;text-align: left;color: #edffff;margin-bottom: 4px;">ชั้นข้อมูล</div>';
	$('.cesium-baseLayerPicker-dropDown').prepend(title);
	$$.legendContainer = $('#legendContainer');
}
this.removeLayer = function(l,c){
	if($$.Layers[l]){
		$.each($$.Layers[l]._children,function(){
			$$.viewer.entities.remove(this);
		});
		$$.Layers[l]._children = [];
	} else {
		$.each($$.viewer.entities.values,function(){
			var _this = this;
			if(_this.layer && _this.layer == l){
				setTimeout(function(){
					$$.viewer.entities.remove(_this);
				},1);
			}
		});
	}
}
this.Layers = {}
this.hideLayer = function(l,c){
	if($$.Layers[l]){
		$$.Layers[l].show = false;
	} else {
		var src = $$.viewer.dataSources.getByName(l);
		if(src && src.length>0){
			$.each(src,function(){
				this.show = false;
			});
		}
		$.each($$.viewer.entities.values,function(){
			var _this = this;
			if(_this.layer && _this.layer == l){
				_this.show = false;
			}
		});
	}
}
this.showLayer = function(l,c){
	if($$.Layers[l]){
		$$.Layers[l].show = true;
	} else {
		var src = $$.viewer.dataSources.getByName(l);
		if(src && src.length>0){
			$.each(src,function(){
				this.show = true;
				if(this.dynamic){
					$.each(this.entities.values,function(){
						if(this.position){
							if($$.inBound(this)){
								this.show = true;
							} else {
								this.show = false;
							}
						}
					});
				}
			});
		} else {
			$.each($$.viewer.entities.values,function(){
				if(this.layer && this.layer == l){
					this.show = true;
				}
			});
		}
	}
}
this.addMarker = function(o,c){
	if(!o.lat || !o.lng){
		return false;
	}
	o.icon = o.icon?o.icon:'';
	o.label = o.label?o.label:'';
	var p={
		position:$$.setPosition(o),
		layer:o.layer?o.layer:'',
		latLng:{lat:o.lat,lng:o.lng},
		name:o.name,
		description:o.description?o.description:'',
		type:'point',
		properties:o.properties
	}
	if(o.id){
		p.id = o.id;
	}
	if(o.icon){
		p.billboard = {
			image : o.icon.image?o.icon.image:$$.markerIcon,
			width : o.icon.width?o.icon.width:32,
			height : o.icon.height?o.icon.height:32,
			//scaleByDistance:new Cesium.NearFarScalar(1.0e2,1,Layer.maxZoom,0.0),
			verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
			horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
		}
	}
	$$.viewer.entities.add(p);
}
this.mark = function (o,c){
	if(!o.lat || !o.lng){
		return false;
	}
	o.id = 'Marker';
	if($$.viewer.entities.getById(o.id)){
		$$.viewer.entities.getById(o.id).billboard.scale = 1;
		return false;
	}
	o.width = o.width?o.width:42;
	o.height = o.height?o.height:42;
	o.icon = o.icon?o.icon:$$.markerIcon;
	o.name = o.name?o.name:'Marker';
	var extentDescription = '<div style="padding: 5px;"><span id="marker_remove" class="zmdi zmdi-delete" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="ลบ"></span>'+
		'<span id="marker_save" class="zmdi zmdi-floppy" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="บันทึกเป็น"></span></div>';
	
	if(!$$.hideMarkerDetail){
		extentDescription = '<input class="form-control" id="pin_title" style="margin-bottom: 10px;" placeholder="ชื่อสถานที่">'+
		'<textarea class="form-control" id="pin_detail" rows="3" placeholder="รายละเอียดสถานที่"></textarea>'+extentDescription;
	}
	var p={
		name:o.name,
		id:o.id,
		extentDescription:extentDescription,
		billboard:{
			image:o.icon,
			width:o.width,
			height:o.height,
			verticalOrigin:Cesium.VerticalOrigin.BOTTOM
		}
	}
	p.position = $$.setPosition(o,p);
	var pin = $$.viewer.entities.add(p);
	pin.remove = function(){
		$$.viewer.entities.remove(pin);
	}
	pin.save = function(){
		if($$.saveMarker){
			if($('#pin_title')[0] && $('#pin_title').val()){
				pin.title = $('#pin_title').val();
				pin.name = $('#pin_title').val();
			}
			if($('#pin_detail')[0] && $('#pin_detail').val()){
				pin.detail = $('#pin_detail').val();
			}
			$$.saveMarker(pin);
		}
	}
	pin.description = {
		getValue:function(){
			return pin.info;
		}
	}
	$$.pinMoving(pin,c);
}
this.Marking = function(o,c){
	if(!o){
		$$.removeEntityById('Marker');
		$$.markable = false;
	} else {
		$$.markable = true;
	}

	$$.onclick(function(e){
		if(!o || !$$.markable){
			return false;
		}
		if(!e.selectedEntity && !$$.dragging){
		//if(!e.selectedEntity && !$$.dragging && $$.getZoom()<2000){
			o.lat = e.lat;
			o.lng = e.lng;
			$$.mark(o,function(pin){
				if(pin.lat && pin.lng){
					pin.info = '<p style="font-size:0.9em;">'+pin.lat+','+pin.lng+'</p>';
				}
				$$.getAdmin(pin.latLng,function(a){
					if(pin.lat && pin.lng){
						pin.info = '<p style="font-size:0.9em;">'+pin.lat+','+pin.lng+'</p>';
					}
					if(a){
						pin.administrative = a;
						pin.info = pin.info+'<p style="font-size:0.9em;">ตำบล : '+a.sub_district+'</p>'+
							'<p style="font-size:0.9em;">อำเภอ : '+a.district+'</p>'+
							'<p style="font-size:0.9em;">จังหวัด : '+a.province+'</p>';
					}
					if($$.viewer.selectedEntity && $$.viewer.selectedEntity.id == pin.id){
						if(c){
							c(pin);
						}
					}
				});
			});
		}
	});
}
this.getZoom = function(){
	var cartographic = new Cesium.Cartographic();
	var camera = $$.viewer.scene.camera;
	var ellipsoid = $$.viewer.scene.mapProjection.ellipsoid;
	ellipsoid.cartesianToCartographic(camera.positionWC, cartographic);
	return parseInt(cartographic.height);
}
this.pinMoving = function(pin,c){
	if(!$$.EventHandler){
		$$.EventHandler = new Cesium.ScreenSpaceEventHandler($$.viewer.canvas);
	}
	$$.dragging = false;
	if(!pin){
		return false;
	}
	pin.draggable = true;
	$$.EventHandler.setInputAction(function(click){
		var picked = $$.viewer.scene.pick(click.position);
		if(Cesium.defined(picked) && (picked.id.id == pin.id && pin.draggable)){
			$$.dragging = pin;
			pin.billboard.scale = 1.2;
			$$.viewer.scene.screenSpaceCameraController.enableRotate = false;
		}
	},Cesium.ScreenSpaceEventType.LEFT_DOWN);
	$$.EventHandler.setInputAction(function(click){
		if(pin && pin.remove && pin.id == 'Marker'){
			pin.remove();
		}
	},Cesium.ScreenSpaceEventType.RIGHT_DOWN);
	$$.EventHandler.setInputAction(function(){
		if($$.dragging && pin){
			pin.billboard.scale = 1;
			if(c){
				c(pin);
			}
			$$.dragging = false;
			$$.viewer.scene.screenSpaceCameraController.enableRotate = true;
		}
	},Cesium.ScreenSpaceEventType.LEFT_UP);
	$$.EventHandler.setInputAction(function(mvt){
		if($$.dragging && pin.draggable){
			var start = $$.viewer.camera.pickEllipsoid(mvt.startPosition);
			var end = $$.viewer.camera.pickEllipsoid(mvt.endPosition);
			var sll = $$.positionToLatLng(start);
			if(Cesium.defined(end)){
				pin.position = end;
				var ll = $$.positionToLatLng(end);
				pin.lat = ll.lat;
				pin.lng =ll.lng;
				pin.latLng = ll.latLng;
				pin.info = '';
			}
		}
	},Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}
this.positionToLatLng =function(p){
	var ll = {}
	var x = p;
	if(p.getValue){
		x = p.getValue();
	}
	var cg = $$.viewer.scene.globe.ellipsoid.cartesianToCartographic(x);
	ll.lat = parseFloat(Cesium.Math.toDegrees(cg.latitude).toFixed(6));
	ll.lng = parseFloat(Cesium.Math.toDegrees(cg.longitude).toFixed(6));
	ll.latLng = {lat:ll.lat,lng:ll.lng}
	return ll;
}
this.onclick = function(cb){
	if(cb){
		$$.viewer.canvas.addEventListener('click', function(e){
			cb(e);
		});
	}
}
this.setPosition = function(ll,e,z){
	var h = z?z:10;
	var lat = parseFloat(ll.lat);
	var lng = parseFloat(ll.lng);
	var p = Cesium.Cartesian3.fromDegrees(lng,lat,h);
	if(e){
		e.position = p;
		e.latLng = {lat:lat,lng:lng};
		e.lat = lat;
		e.lng = lng;
	}
	return p;
}
this.markers = function(){
	
}
this.addPolygon = function(o,c){
	
}
this.polygons = function(){
	
}
this.getEntityById = function(id){
	return $$.viewer.entities.getById(id);
}
this.removeEntityById = function(id){
	var ent = $$.viewer.entities.getById(id);
	if(ent){
		$$.viewer.entities.remove(ent);
	}
}
this.removeEntity = function(ent){
	if(ent){
		$$.viewer.entities.remove(ent);
	}
}
this.addPolyline = function(o,c){
	
}
this.polylines = function(){
	
}
this.removeItem = function(i){
	
}
this.hideItem = function(i){
	
}
this.addItem = function(i){
	
}
this.showItem = function(i){
	
}
this.getWidth = function(){
	return window.innerWidth;
}
this.setWidth = function(w){
	$$.container.css('width',w+'px');
}
this.getHeight = function(){
	return window.innerHeight;
}
this.setHeight = function(h){
	$$.container.css('height',h+'px');
}
this.setTop = function(t){
	$$.container.css('top',t+'px');
	var h = $$.getHeight()-t;
	$$.setHeight(h);
}
this.hide = function(){
	$$.container.hide();
}
this.show = function(){
	$$.container.show();
}
this.dynamicLabel = function(e){
	
}
this.checkLabelText = function(txt){
	
}
this.kmlLayer = function(){
	var div = '<div id="kmlLegendContainer" style="border: 1px solid #888;border-radius: 5px;padding: 5px;background-color: #efefef;"></div>';
	$('.cesium-baseLayerPicker-dropDown').prepend(div);
	var title = '<div style="font-size: 16pt;text-align: left;color: #edffff;margin-bottom: 4px;">ชั้นข้อมูล KML/KMZ</div>';
	$('.cesium-baseLayerPicker-dropDown').prepend(title);
	$$.kmlLegendContainer = $('#kmlLegendContainer');
}
this.removeKml = function(l){
	var src = $$.viewer.dataSources.getByName(l);
}
this.addKml = function(url,opt,c){
	if(!url){
		return false;
	}
	var layer = encodeURIComponent(url).replace(/%/g,'');
	layer = layer.replace(/\//g,'');
	layer = layer.replace(/@/g,'');
	layer = layer.replace(/#/g,'');
	layer = layer.replace(/\?/g,'');
	layer = layer.replace(/\./g,'');
	$$.removeKml(layer);
	var checked = true;
	if(opt && !opt.checked){
		checked = false;
	}
	var kml =$$.viewer.dataSources.add(Cesium.KmlDataSource.load(url));
	kml.then(function(data){
		data.layer = layer;
		var title = data.name.replace('.kml','');
		title = title.replace('.kmz','');
		data.name = layer;
		data.url = url;
		$$.addLegend({id:layer,title:title,checked:checked,container:$$.kmlLegendContainer});
		$.each(data.entities.values,function(){
			this.layer = layer;
		});
		if(opt && opt.maxZoom){
			data.maxZoom = opt.maxZoom;
		}
		if(opt && opt.flyTo){
			$$.viewer.flyTo(data);
		}
		if(opt && opt.id){
			data.data_id = opt.id;
		}
		if(!$$.kmlData){
			$$.kmlData = {};
		}
		$$.kmlData[layer] = data;
		if(c){
			c(data);
		}
	});
}
this.kmlUploadButton = function(o){
	if(!$$.kmlLegendContainer){
		$$.kmlLayer();
	}
	if(!$('#kml_upload')[0]){
		var input = '<div><span title="นำเข้าไฟล์ KML/KMZ" style="line-height:40px;"><input id="kml_upload" type="file" accept=".kml ,.kmz" style="opacity:0;position: absolute;font-size:40px;width:60px;z-index:1;"><img src="images/kml.png" width="32"></span><span style="font-size:0.8em;">อัปโหลดไฟล์</span></div>';
		input = input+'<div><form class="form-inline"><div class="form-group"><input id="kml_url" placeholder="หรือเพิ่ม url https://xxxx.xx/**.kml" type="url" class="form-control form-control-sm"></div><button type="submit" class="btn btn-sm btn-dark" id="kml_url_submit">เพิ่ม url</button></form></div>';
		$$.kmlLegendContainer.append(input);
		setTimeout(function(){
			$('#kml_url_submit').click(function(e){
				if($('#kml_url').val()){
					$$.addKml($('#kml_url').val());
					$('#kml_url').val('');
				}
				return false;
			});
			$('#kml_upload').off().on('change', function(){
				if($(this).val()){
					if($$.kmlUpload){
						$$.kmlUpload(this.files[0]);
					}
				}
			});
		},1000);
	}
}
$$.panToEntityId = function(id){
	$$.show();
	var ent = $$.getEntityById(id);
	if(ent){
		$$.viewer.flyTo(ent);
		setTimeout(function(){
			$$.viewer.selectedEntity = ent;
		},2000);
	}
}
$$.getGistdaAdmin =function(LL,cb){
	var query = {geometry:LL.lng+','+LL.lat,geometryType:"esriGeometryPoint",inSR:4326,outSR:4326,spatialRel:"esriSpatialRelWithin",outFields:"*",returnGeometry:false,f:"pjson"}
	 $.ajax({
		type:'POST',
		url:'https://gistdaportal.gistda.or.th/arcgis/rest/services/app/admin_poly/MapServer/94/query',
		crossDomain:true,
		data:$.param(query),
		success: function(data){
			data = JSON.parse(data);
			if(data.features && data.features.length==1){
				var admin = {};
				admin.province = data.features[0].attributes.prov_namt;
				admin.province_id = data.features[0].attributes.prov_code;
				admin.district = data.features[0].attributes.amp_namt;
				admin.district_id = data.features[0].attributes.prov_code+data.features[0].attributes.amp_code;
				admin.sub_district = data.features[0].attributes.tam_namt;
				admin.sub_district_id = data.features[0].attributes.prov_code+data.features[0].attributes.amp_code+data.features[0].attributes.tam_code;
				cb(admin);
			}
		}
	});
}
$$.getAdmin =function(LL,cb){
	var query = {geometry:LL.lng+','+LL.lat,geometryType:"esriGeometryPoint",inSR:4326,outSR:4326,spatialRel:"esriSpatialRelWithin",outFields:"*",returnGeometry:false,f:"pjson",token:''}

	 $.ajax({
		type:'POST',
		url:'https://gisportal.fisheries.go.th/arcgis/rest/services/Hosted/%E0%B8%82%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5WGS84/FeatureServer/93/query',
		//url:'https://services8.arcgis.com/gsAq5vcFUKwSVHYm/ArcGIS/rest/services/ขอบเขตตำบลWGS84/FeatureServer/99/query',
		crossDomain:true,
		data:$.param(query),
		success: function(data){
			data = JSON.parse(data);
			if(data.features && data.features.length==1){
				var admin = {};
				admin.province = data.features[0].attributes.prov_nam_t.replace('จ.','');
				admin.province_id = data.features[0].attributes.prov_code;
				admin.district = data.features[0].attributes.amphoe_t.replace('อ.','');
				admin.district_id = data.features[0].attributes.prov_code+data.features[0].attributes.amp_code;
				admin.sub_district = data.features[0].attributes.tam_nam_t.replace('ต.','');
				admin.sub_district_id = data.features[0].attributes.prov_code+data.features[0].attributes.amp_code+data.features[0].attributes.tam_code;
				cb(admin);
			}
		}
	});
	

}


$$.getAdmin1 =function(HC,lng,lat,cb){
	var query = {geometry:lng+','+lat,geometryType:"esriGeometryPoint",inSR:4326,outSR:4326,spatialRel:"esriSpatialRelWithin",outFields:"*",returnGeometry:false,f:"pjson",token:''}
	 $.ajax({
		type:'POST',
		url:'https://gisportal.fisheries.go.th/arcgis/rest/services/Hosted/%E0%B8%82%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5WGS84/FeatureServer/92/query',
		//url:'https://services8.arcgis.com/gsAq5vcFUKwSVHYm/ArcGIS/rest/services/ขอบเขตตำบลWGS84/FeatureServer/99/query',
		crossDomain:true,
		data:$.param(query),
		success: function(data){
			data = JSON.parse(data);
			if(data.features && data.features.length==1){
				var admin = {};
				admin.HC=HC;
				admin.lat=lat;
				admin.lng=lng;
				admin.province = data.features[0].attributes.PROV_NAM_T.replace('จ.','');
				admin.province_id = data.features[0].attributes.PROV_CODE;
				admin.district = data.features[0].attributes.AMPHOE_T.replace('อ.','');
				admin.district_id = data.features[0].attributes.PROV_CODE+data.features[0].attributes.AMP_CODE;
				admin.sub_district = data.features[0].attributes.TAM_NAM_T.replace('ต.','');
				admin.sub_district_id = data.features[0].attributes.PROV_CODE+data.features[0].attributes.AMP_CODE+data.features[0].attributes.TAM_CODE;
				cb(admin);
			}
		}
	});
}

$$.getAdmin2 =function(HC,lng,lat,cb){
	var query = {geometry:lng+','+lat,geometryType:"esriGeometryPoint",inSR:4326,outSR:4326,spatialRel:"esriSpatialRelWithin",outFields:"*",returnGeometry:false,f:"pjson",token:''}
	 $.ajax({
		type:'POST',
		url:'https://gisportal.fisheries.go.th/arcgis/rest/services/Hosted/%E0%B8%82%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5WGS84/FeatureServer/91/query',
		//url:'https://services8.arcgis.com/gsAq5vcFUKwSVHYm/ArcGIS/rest/services/ขอบเขตตำบลWGS84/FeatureServer/91/query',
		crossDomain:true,
		data:$.param(query),
		success: function(data){
			data = JSON.parse(data);
			if(data.features && data.features.length==1){
				var admin = {};
				admin.HC=HC;
				admin.lat=lat;
				admin.lng=lng;
				admin.province = data.features[0].attributes.PROV_NAM_T.replace('จ.','');
				admin.province_id = data.features[0].attributes.PROV_CODE;
				admin.district = data.features[0].attributes.AMPHOE_T.replace('อ.','');
				admin.district_id = data.features[0].attributes.PROV_CODE+data.features[0].attributes.AMP_CODE;
				admin.sub_district = data.features[0].attributes.TAM_NAM_T.replace('ต.','');
				admin.sub_district_id = data.features[0].attributes.PROV_CODE+data.features[0].attributes.AMP_CODE+data.features[0].attributes.TAM_CODE;
				cb(admin);
			}
		}
	});
}

$$.esriPolygonCentroid = function(rings,cb){
	require(["esri/geometry/Polygon"], function(esriPolygon){
		var c = {};
		var poly = new esriPolygon(rings);
		c.lat = parseFloat(poly.centroid.latitude.toFixed(4));
		c.lng = parseFloat(poly.centroid.longitude.toFixed(4));
		if(cb){
			cb(c);
		}
	});
}
$$.getLatLngAdminID = function(opts,cb){
	if($$.gettingLatLngID){
		setTimeout(function(){
			$$.getLatLngAdminID(opts,cb);
		},5);
		return false;
	}
	var server = 'https://gisportal.fisheries.go.th/arcgis/rest/services/';
	//var server = 'https://services8.arcgis.com/gsAq5vcFUKwSVHYm/ArcGIS/rest/services/';
	var where;
	var L;
	if(opts.province_id){
		where = "PROV_NAM_T='"+opts.province_id+"'";
		L = 'ขอบเขตจังหวัดWGS84';
	}
	if(opts.district_id){
		where = "AMPHOE_IDN='"+opts.district_id+"'";
		L = 'ขอบเขตอำเภอWGS84';
	}
	if(opts.sub_district_id){
		where = "TAMBON_IDN='"+opts.sub_district_id+"'";
		L = 'ขอบเขตตำบลWGS84';
		if($$.LatLngAdmin && $$.LatLngAdmin[opts.sub_district_id]){
			opts.latLng = ranLocation($$.LatLngAdmin[opts.sub_district_id]);
			if(cb){
				cb(opts);
			}
			return false;
		}
	}
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
		$$.gettingLatLng = true;
		console.log("layer url:");
		 $.ajax({
			type: 'POST',
			url: server+L+'/FeatureServer/96/query',
			crossDomain: true,
			data:query,
			success: function(data){
				$$.gettingLatLng = false;
				data = JSON.parse(data);
				if(data.features){
					if(data.features.length>0){
						opts.latLng = {}
						data.features.forEach(function(f){
							if(opts.sub_district_id){
								if(f.attributes.AMPHOE_T.replace('อ.','') == opts.district){
									if(f.centroid){
										var centroid = {lat:f.centroid.y,lng:f.centroid.x}
										opts.latLng = ranLocation(centroid);
										if(!$$.LatLngAdmin){
											$$.LatLngAdmin = {}
										}
										$$.LatLngAdmin[opts.district_id] = centroid;
										if(cb){
											cb(opts);
										}
										return false;
									} else {
										$$.esriPolygonCentroid(f.geometry.rings,function(centroid){
											opts.latLng =  ranLocation(centroid);
											if(!$$.LatLngAdmin){
												$$.LatLngAdmin = {}
											}
											$$.LatLngAdmin[opts.district_id] = centroid;
											if(cb){
												cb(opts);
											}
											return false;
										});
									}
								}
							} else if(opts.district_id){
								if(f.attributes.AMPHOE_T.replace('อ.','') == opts.district){
									if(f.centroid){
										var centroid = {lat:f.centroid.y,lng:f.centroid.x}
										opts.latLng =  ranLocation(centroid);
										if(cb){
											cb(opts);
										}
										return false;
									} else {
										$$.esriPolygonCentroid(f.geometry.rings,function(centroid){
											opts.latLng =  ranLocation(centroid);
											if(cb){
												cb(opts);
											}
											return false;
										});
									}
								}
							} else if(opts.province_id){
								if(f.attributes.PROV_NAM_T.replace('จ.','')== opts.province){
									if(f.centroid){
										var centroid = {lat:f.centroid.y,lng:f.centroid.x}
										opts.latLng =  ranLocation(centroid);
										if(cb){
											cb(opts);
										}
										return false;
									} else {
										$$.esriPolygonCentroid(f.geometry.rings,function(centroid){
											opts.latLng =  ranLocation(centroid);
											if(cb){
												cb(opts);
											}
											return false;
										});
									}
								}
							}
						});
					}
				} else {
				//	$$.getLatLngAdminID(opts,cb);
				}
			},
			error:function(){
				$$.gettingLatLngID = false;
				//$$.getLatLngAdminID(opts,cb);
			}
		});
	}
}
$$.getLatLngAdmin =function(opts,cb){
	if($$.gettingLatLng){
		setTimeout(function(){
			$$.getLatLngAdmin(opts,cb);
		},5);
		return false;
	}
	if(!opts.getTempGeoCount){
		opts.getTempGeoCount = 1;
	} else {
		if(opts.getTempGeoCount > 20){
			return false;
		}
		opts.getTempGeoCount = opts.getTempGeoCount+1;
	}
	var server = 'https://gisportal.fisheries.go.th/arcgis/rest/services/';
	//var server = 'https://services8.arcgis.com/gsAq5vcFUKwSVHYm/ArcGIS/rest/services/';
	var where;
	var L;
	if(opts.province){
		where = "PROV_NAM_T='จ."+opts.province+"'";
		L = 'ขอบเขตจังหวัดWGS84';
	}
	if(opts.district){
		where = "AMPHOE_T='อ."+opts.district+"'";
		L = 'ขอบเขตอำเภอWGS84';
	}
	if(opts.sub_district){
		where = "TAM_NAM_T='"+opts.sub_district+"'";
		L = 'ขอบเขตตำบลWGS84';
		if(opts.province && opts.district && $$.LatLngAdmin && $$.LatLngAdmin[opts.province+'-'+opts.district+'-'+opts.sub_district]){
			opts.latLng = ranLocation($$.LatLngAdmin[opts.province+'-'+opts.district+'-'+opts.sub_district]);
			if(cb){
				cb(opts);
			}
			return false;
		}
	}
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
		console.log("layer url:"+Layer.url);
		$$.gettingLatLng = true;
		 $.ajax({
			type: 'POST',
			url: server+L+'/FeatureServer/0/query',
			crossDomain: true,
			data:query,
			success: function(data){
				$$.gettingLatLng = false;
				data = JSON.parse(data);
				if(data.features){
					if(data.features.length>0){
						opts.latLng = {}
						data.features.forEach(function(f){
							if(opts.sub_district){
								if(f.attributes.AMPHOE_T.replace('อ.','') == opts.district){
									if(f.centroid){
										opts.latLng = ranLocation({lat:f.centroid.y,lng:f.centroid.x});
										if(!$$.LatLngAdmin){
											$$.LatLngAdmin = {}
										}
										$$.LatLngAdmin[opts.province+'-'+opts.district+'-'+opts.sub_district] = opts.latLng;
										if(cb){
											cb(opts);
										}
										return false;
									} else {
										$$.esriPolygonCentroid(f.geometry.rings,function(centroid){
											opts.latLng =  ranLocation(centroid);
											if(!$$.LatLngAdmin){
												$$.LatLngAdmin = {}
											}
											$$.LatLngAdmin[opts.province+'-'+opts.district+'-'+opts.sub_district] = opts.latLng;
											if(cb){
												cb(opts);
											}
											return false;
										});
									}
								}
							} else if(opts.district){
								if(f.attributes.AMPHOE_T.replace('อ.','') == opts.district){
									if(f.centroid){
										opts.latLng =  ranLocation({lat:f.centroid.y,lng:f.centroid.x});
										if(cb){
											cb(opts);
										}
										return false;
									} else {
										$$.esriPolygonCentroid(f.geometry.rings,function(centroid){
											opts.latLng =  ranLocation(centroid);
											if(cb){
												cb(opts);
											}
											return false;
										});
									}
								}
							} else if(opts.province){
								if(f.attributes.PROV_NAM_T.replace('จ.','')== opts.province){
									if(f.centroid){
										opts.latLng =  ranLocation({lat:f.centroid.y,lng:f.centroid.x});
										if(cb){
											cb(opts);
										}
										return false;
									} else {
										$$.esriPolygonCentroid(f.geometry.rings,function(centroid){
											opts.latLng =  ranLocation(centroid);
											if(cb){
												cb(opts);
											}
											return false;
										});
									}
								}
							}
						});
					}
				} else {
					$$.getLatLngAdmin(opts,cb);
				}
			},
			error:function(){
				$$.gettingLatLng = false;
				$$.getLatLngAdmin(opts,cb);
			}
		});
	}
}
return this;
}
ALGIS.prototype.setZoom = function(z){
	
}
ALGIS.prototype.getLayer = function(o,c){

}
function ranLocation(loc){
	var new_loc = Object.assign({}, loc);
	var rand =parseFloat((Math.random()*0.005).toFixed(6));
	if(loc.lat.toString().slice(-1)%2 == 0){
		rand = rand-0.0002;
	} else {
		rand = rand+0.0002;
	}
	var rand1 =parseFloat((Math.random()*0.005).toFixed(6));
	if(loc.lng.toString().slice(-1)%2 == 0){
		rand1 = rand1+0.0002;
	} else {
		rand1 = rand1-0.0002;
	}
	new_loc.lat = parseFloat((Number(loc.lat)+rand).toFixed(6));
	new_loc.lng = parseFloat((Number(loc.lng)+rand1).toFixed(6));
	return new_loc;
}