var PROVINCES,DISTRICTS,SUBDISTRICTS;
var Scripts = {}
function getProvinces(cb){
	if(!PROVINCES){
		PROVINCES = [];
	}
	if(PROVINCES.length>0){
		if(cb){
			cb(PROVINCES);
		}
	} else {
		var query = {where:"1=1",outFields:"*",returnGeometry:false,f:"pjson"}
		 $.ajax({
			type:'POST',
			url:'https://gistdaportal.gistda.or.th/arcgis/rest/services/app/admin_poly/MapServer/2/query',
			crossDomain:true,
			data:$.param(query),
			success: function(data){
				if(PROVINCES.length==0){
					data = JSON.parse(data);
					if(data.features && data.features.length>0){
						$.each(data.features,function(){
							PROVINCES.push({value:this.attributes.prov_namt,label:this.attributes.prov_namt});
						});
						PROVINCES.sort((a,b) => a.value.localeCompare(b.value,'th'));
						if(cb){
							cb(PROVINCES);
						}
					}
				} else {
					if(cb){
						cb(PROVINCES);
					}		
				}
			}
		});
	}
}
function getDisticts(province,cb){
	if(!DISTRICTS){
		DISTRICTS = {};
	}
	if(DISTRICTS[province] && DISTRICTS[province].length>0){
		if(cb){
			cb(DISTRICTS[province]);
		}
	} else {
		DISTRICTS[province] = [];
		var query = {returnDistinctValues:true,where:"prov_namt='"+province+"'",outFields:"amp_namt",returnGeometry:false,f:"pjson"}
		 $.ajax({
			type:'POST',
			url:'https://gistdaportal.gistda.or.th/arcgis/rest/services/app/admin_poly/MapServer/1/query',
			crossDomain:true,
			data:$.param(query),
			success: function(data){
				if(DISTRICTS[province].length==0){
					data = JSON.parse(data);
					if(data.features && data.features.length>0){
						$.each(data.features,function(){
							DISTRICTS[province].push({value:this.attributes.amp_namt,label:this.attributes.amp_namt});
						});
						DISTRICTS[province].sort((a,b) => a.value.localeCompare(b.value,'th'));
						if(cb){
							cb(DISTRICTS[province]);
						}
					}
				} else {
					if(cb){
						cb(DISTRICTS[province]);
					}
				}
			}
		});
	}
}
function getSubDisticts(province,district,cb){
	if(!SUBDISTRICTS){
		SUBDISTRICTS = {};
	}
	if(SUBDISTRICTS[province+'-'+district] && SUBDISTRICTS[province+'-'+district].length>0){
		if(cb){
			cb(SUBDISTRICTS[province+'-'+district]);
		}
	} else {
		if(!SUBDISTRICTS[province+'-'+district]){
			SUBDISTRICTS[province+'-'+district] = [];
			var query = {returnDistinctValues:true,where:"prov_namt='"+province+"' AND amp_namt='"+district+"'",outFields:"tam_namt",returnGeometry:false,f:"pjson"}
			$.ajax({
				type:'POST',
				url:'https://gistdaportal.gistda.or.th/arcgis/rest/services/app/admin_poly/MapServer/0/query',
				crossDomain:true,
				data:$.param(query),
				success: function(data){
					if(SUBDISTRICTS[province+'-'+district].length==0){
						data = JSON.parse(data);
						if(data.features && data.features.length>0){
							$.each(data.features,function(){
								SUBDISTRICTS[province+'-'+district].push({value:this.attributes.tam_namt,label:this.attributes.tam_namt});
							});
							SUBDISTRICTS[province+'-'+district].sort((a,b) => a.value.localeCompare(b.value,'th'));
							if(cb){
								cb(SUBDISTRICTS[province+'-'+district]);
							}
						}
					} else {
						if(cb){
							cb(SUBDISTRICTS[province+'-'+district]);
						}
					}
				}
			});
		} else {
			if(cb){
				cb(SUBDISTRICTS[province+'-'+district]);
			}
		}
	}
}

function processItem(table){
	if(!table.dataTables){
		SnapData(table);
		return false;
	}
	if(table.dataTables.editor() && table.dataTables.editor().isOpen){
		//setTimeout(function(){
			processItem(table);
		//},1000);
		return false;
	}
	if(table.newSnapshot && table.newSnapshot.length>0){
		$.each(table.newSnapshot,function(){
			var _this = this;
			if(!_this.data){
				_this.data = {id:_this.change_id}
			}
			var insnap = false;
			$.each(table.Table.fields,function(){
				if(!_this.data[this.name]){
					_this.data[this.name] = "";
				}
				if((this.multiple || this.json) && _this.data[this.name]){
					_this.data[this.name] = jsonParse(_this.data[this.name]);
				}
			});
			$.each(table.Snapshot.data,function(i){
				if(this.id ==_this.change_id){
					table.Snapshot.data[i] = _this.data;
					insnap = true;
				}
			});
			if(!insnap){
				table.Snapshot.data.push(_this.data);
			}
			table.dataTables.change(_this.data,_this.change_type);
			if(table.GIS && table.GIS.layerChange){
				table.GIS.layerChange(_this.data,_this.change_type);
			}
		});
	}
	setTimeout(function(){
		if(table.Snapshot.data.length<1){
			table.dataTables.reset();
		}
	},2000);
}
function jsonParse(r){
	try {
		return JSON.parse(r);
	} catch(e){
		return '';
	}
}
function SnapData(table){
	if(table.dataTables){
		processItem(table);
		return false;
	}
	table.module = table.module?table.module:'';
	table.module = table.module?table.module:table.Table.module;
	if(!table.dataTables){
		table.dataTables = createDatatable(table.Table);
	}
	$.each(table.Snapshot.data,function(){
		var d = this;
		$.each(table.Table.fields,function(){
			if(!d[this.name]){
				d[this.name] = "";
			}
			if((this.multiple || this.json) && d[this.name]){
				d[this.name] = jsonParse(d[this.name]);
			}
		});
	});
	//table.dataTables.rows.add(table.Snapshot.data);
	table.dataTables.rows.add(table.Snapshot.data).draw();
	if(table.GIS && table.GIS.addMarkers){
		table.GIS.addMarkers(table.Snapshot.data);
	}
	$(window).resize(function(){
		table.dataTables.fixedHeader.headerOffset(getTop()+6);
		$('#'+ table.module+'_table').css('top',getTop()+'px');
		table.dataTables.responsive.recalc();
	});
	setTimeout(function(){
		$('#'+ table.module+'_table').css('top',getTop()+'px');
		table.dataTables.fixedHeader.headerOffset(getTop()+6);
		table.dataTables.responsive.recalc();
	},200);
}
function getTop(){
	var top = 0;
	if($('#menu_bar')[0]){
		top = top+$('#menu_bar').height();
	}
	var h = 0;
	if($('.TableTool')[0]){
		$.each($('.TableTool'),function(){
			if($(this).height()>h){
				h = $(this).height();
			}
		});
		top = top+h;
	}
	return top;
}
function profileRender(data,id,filter){
	var ren = '';
	var name_th = '';
	var name_en = '';
	var nickname = '';
	if(data.title){name_th=name_th+data.title}
	if(data.first_name_th){name_th=name_th+data.first_name_th}
	if(data.last_name_th){name_th=name_th+" "+data.last_name_th}
	if(data.first_name_en){name_en=name_en+data.first_name_en}
	if(data.last_name_en){name_en=name_en+" "+data.last_name_en}
	if(data.nickname){nickname=' ('+data.nickname+')'}
	var link = '';
	var style = ' style="font-weight: bold;display:flex;"';
	if(id){
		link = ' onclick="TABLES.users.dataTables.viewRow('+id+');"';
		style = ' style="font-weight: bold;display:flex;color:blue;cursor:pointer;"';
	}
	if(filter){
		link = ' onclick="TABLES.users.dataTables.viewRow('+id+',\''+filter+'\');"';
	}
	ren = ren+ '<span'+style+link+'>'+name_th+nickname+'</span>';
	if(name_en){
		ren = ren+ '<span style="display:flex;">'+name_en+'</span>';
	}
	return ren;
}
function thumbImage(img,w){
	if(!img || (!img.thumb && img.path)){
		return '';
	}
	var src = img.thumb?img.thumb:img.path;
	if(!src){
		return '';
	}
	var width = w?w:80;
	var click = img.path?' onclick="viewImage(\''+img.path+'\')"':'';
	return '<span style="padding: 2px;"><img style="cursor:pointer;" src="'+src+'"'+click+' style="margin:2px;" width="'+width+'px"></span>';
}
function eRender(data){
	var phone = data.phone?'<span style="display:flex;">โทร : '+data.phone+'</span>':'';
	var email = data.email?'<span style="display:flex;">email : '+data.email+'</span>':'';
	var facebook = '';
	if(data.facebook){
		var fb = data.facebook;
		if(!data.facebook.match(/facebook/g)){
			fb = 'https://www.facebook.com/'+data.facebook;
			if(data.facebook.match(/ /g)){
				fb = 'https://www.facebook.com/search/top/?q='+data.facebook;
			}
		}
		facebook = '<a style="display:flex;" href="'+fb+'" target="_blank">Facebook</a>';
	}
	var line_id = data.line_id?'<span style="display:flex;">Line ID : '+data.line_id+'</span>':'';
	return phone+email+line_id+facebook;
}
function addressRender(data){
		var building_no = '';
		if(data.building_no){building_no = 'เลขที่ '+data.building_no+' '} else {
			if(data.house_no){building_no = 'เลขที่ '+data.house_no+' '}
		}
		var alley = '';
		if(data.alley){alley='ซ.'+data.alley+' '}
		var road = '';
		if(data.road){road='ถ.'+data.road+' '}
		var village_no = '';
		if(data.village_no){village_no='ม.'+data.village_no+' '}
		var village_name = '';
		if(data.village_name){village_name='บ.'+data.village_name+' '}
		var _province = '';
		if(data.province){_province=data.province}
		var sub_district = '';
		var district = '';
		var province = '';
		var pre_sub_district = '';
		var pre_district = '';
		var pre_province = '';
		if(_province === "กรุงเทพมหานคร"){
			pre_sub_district = 'แขวง';
			pre_district = 'เขต';
			pre_province = '';
		} else {
			pre_sub_district = 'ต.';
			pre_district = 'อ.';
			pre_province = 'จ.';
		}
		if(data.sub_district){sub_district=pre_sub_district+data.sub_district+' '}
		if(data.district){district=pre_district+data.district+' '}
		if(data.province){province=pre_province+data.province}
		var postal_code = '';
		if(data.postal_code){postal_code=' '+data.postal_code}
		return building_no+alley+road+village_no+village_name+sub_district+district+province+postal_code;
}

function Require(script,cb){
	if(!script.endsWith('.js')){
		script = script+'.js';
	}
	var req = script.slice(0, -3);
	if(!Scripts[req]){
		$.ajax({
			url:script,
			cache:false
		}).done(function(s){
			Scripts[req] = s.toString();
			if(cb){
				cb(eval(s.toString()));
			}
		});		
	} else {
		if(cb){
			cb(eval(Scripts[req]));
		}
	}
}
function isToday(t){
	var today = new Date().toLocaleString('th-TH').split(' ')[0];
	var d = new Date(parseInt(t)).toLocaleString('th-TH').split(' ')[0];
	if(d == today){
		return true;
	} else {
		return false;
	}
}
function isInDay(t){
	t = parseInt(t);
	var day = new Date();
	day.setHours(6);
	day.setMinutes(0);
	day.setSeconds(0);
	var moning = day.getTime();
	if(t>=moning){
		return true;
	} else {
		return false;
	}
}
function isInHour(t){
	var now = new Date().getTime();
	if(now-parseInt(t)<60*60*1000){
		return true;
	} else {
		return false;
	}
}
function isWorkTime(f,t){
	var from = f?f:80000;
	var to = t?t:170000;
	var date = new Date().toLocaleString('th-TH');
	var time = date.split(' ')[1];
	time = time.replace(/:/g,'');
	time = time.replace(/-/g,'');
	if(time>from && time<to){
		return true;
	} else {
		return false;
	}
}
function viewImage(url){
	if(!url){
		return;
	}
	var div = '<div class="modal"><div class="modal-dialog modal-lg" style="margin:4px;"><div class="modal-content"><div class="modal-header" style="padding: 4px;"><button type="button" class="close" data-dismiss="modal">×</button></div><div class="modal-body" id="image_view" style="padding:4px;"></div></div></div></div>';
	setTimeout(function(){
		$(div).modal();
		_view();
	},100);
	function _view(){
		if(!$('#image_view')[0]){
			setTimeout(_view,50);
			return false;
		}
		var width = $('#image_view').width()-2;
		$('#image_view').html('<img style="width:'+width+'px;" src="'+url+'">');
	}
}
function textProcess(txt){
	txt = txt.trim();
	txt = txt.replace(/\(/g,' \(');
	txt = txt.replace(/\( /g,'\(');
	txt = txt.replace(/\)/g,'\) ');
	txt = txt.replace(/ \)/g,'\)');
	txt = txt.replace(/   /g,' ');
	txt = txt.replace(/ััั/g,'ั');
	txt = txt.replace(/ัั/g,'ั');
	txt = txt.replace(/่่่/g,'่');
	txt = txt.replace(/่่/g,'่');
	txt = txt.replace(/้้้/g,'้');
	txt = txt.replace(/้้/g,'้');
	txt = txt.replace(/  /g,' ');
	txt = txt.replace(/[\u200B-\u200D\uFEFF]/g,'');
	return txt;
}
function commaNumber(x){
	if(x==0 || x=='0'){
		return 0;
	}
	if(!x){
		return '';
	} else {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}