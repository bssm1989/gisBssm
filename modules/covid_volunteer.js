(function(){
	setTimeout(function(){
	
	LoadMap(function(map){
		var server = 'https://pbwatch.net/gis/';
		var entities = map.viewer.entities;
		var _types=[
			{label:'ผู้สูงอายุ',value:'ผู้สูงอายุ',icon:'icons/retirement_home.png'},
			{label:'แปลงเกษตร',value:'แปลงเกษตร',icon:'icons/field.png'},
			{label:'แหล่งท่องเที่ยว',value:'แหล่งท่องเที่ยว',icon:'icons/photography.png'},
			{label:'กลุ่มเยาวชน',value:'กลุ่มเยาวชน',icon:'icons/daycare.png'},
			{label:'กลุ่มชุมชน',value:'กลุ่มชุมชน',icon:'icons/communitycentre.png'},
			{label:'วิสาหกิจชุมชน',value:'วิสาหกิจชุมชน/กลุ่มอาชีพ',icon:'icons/communitycentre.png'},
			{label:'ที่ว่าการอำเภอ',value:'ที่ว่าการอำเภอ',icon:'icons/congress.png'},
			{label:'สถานีตำรวจ',value:'สถานีตำรวจ',icon:'icons/police.png'},
			{label:'สถาบันการศึกษา',value:'สถาบันการศึกษา',icon:'icons/university.png'},
			{label:'โรงเรียน',value:'โรงเรียน',icon:'icons/school.png'},
			{label:'ศูนย์พัฒนาเด็กเล็ก',value:'ศูนย์พัฒนาเด็กเล็ก',icon:'icons/nursery.png'},
			{label:'โรงพยาบาล',value:'โรงพยาบาล',icon:'icons/hospital-building.png'},
			{label:'รพ.สต.',value:'รพ.สต.',icon:'icons/firstaid.png'},
			{label:'สถานที่ของรัฐอื่นๆ',value:'สถานที่ของรัฐอื่นๆ',icon:'icons/conference.png'},
			{label:'อาคารพาณิชย์',value:'อาคารพาณิชย์',icon:'icons/office-building.png'},
			{label:'อาคารบ้านเรือน',value:'อาคารบ้านเรือน',icon:'icons/house.png'},
			{label:'โรงงานอุตสาหกรรม',value:'โรงงานอุตสาหกรรม',icon:'icons/factory.png'},
			{label:'โรงแรม',value:'โรงแรม',icon:'icons/motel-2.png'},
			{label:'รีสอร์ท',value:'รีสอร์ท',icon:'icons/resort.png'},
			{label:'โฮสเทล',value:'โฮสเทล',icon:'icons/hostel_0star.png'},
			{label:'โฮมสเตย์',value:'โฮมสเตย์',icon:'icons/hostel_0star.png'},
			{label:'ธนาคาร',value:'ธนาคาร',icon:'icons/bank_euro.png'},
			{label:'Co-working Space',value:'Co-working Space',icon:'icons/group-2.png'},
			{label:'Learning Space',value:'Learning Space',icon:'icons/group-2.png'},
			{label:'จุดหมายตา (Landmark)',value:'จุดหมายตา (Landmark)',icon:'icons/landmark.png'},
			{label:'พิพิธภัณฑ์',value:'พิพิธภัณฑ์',icon:'icons/art-museum-2.png'},
			{label:'ห้องแสดงศิลปะ (Art Gallery)',value:'ห้องแสดงศิลปะ (Art Gallery)',icon:'icons/artgallery.png'},
			{label:'ดนตรีและศิลปะการแสดง',value:'ดนตรีและศิลปะการแสดง',icon:'icons/music_choral.png'},
			{label:'ศูนย์ข้อมูลการท่องเที่ยว',value:'ศูนย์ข้อมูลการท่องเที่ยว',icon:'icons/information.png'},
			{label:'ภัตตาคาร/ร้านอาหาร',value:'ร้านอาหาร',icon:'icons/restaurant.png'},
			{label:'ร้านกาแฟ',value:'ร้านกาแฟ',icon:'icons/coffee.png'},
			{label:'ร้านจำหน่ายของที่ระลึก',value:'ร้านจำหน่ายของที่ระลึก',icon:'icons/gifts.png'},
			{label:'ร้านขายยา',value:'ร้านขายยา',icon:'icons/medicine.png'},
			{label:'นวดแผนไทย/สปา',value:'นวดแผนไทย/สปา',icon:'icons/massage.png'},
			{label:'ร้านขายของชำ',value:'ร้านขายของชำ',icon:'icons/grocery.png'},
			{label:'ร้านขายผลไม้',value:'ร้านขายผลไม้',icon:'icons/fruits.png'},
			{label:'ร้านขายผ้า/เครื่องแต่งกาย',value:'ร้านขายผ้า/เครื่องแต่งกาย',icon:'icons/clothers_female.png'},
			{label:'ร้านหัตกรรมพื้นบ้าน',value:'ร้านหัตกรรมพื้นบ้าน',icon:'icons/craftstore.png'},
			{label:'ร้านขายสมุนไพร/ยาสมุนไพร',value:'ร้านขายสมุนไพร/ยาสมุนไพร',icon:'icons/traditionelle_chinesische_medizin.png'},
			{label:'ร้านตัดเย็บเสื้อผ้า',value:'ร้านตัดเย็บเสื้อผ้า',icon:'icons/tailor.png'},
			{label:'อู่ซ่อมรถ',value:'อู่ซ่อมรถ',icon:'icons/workshop.png'},
			{label:'อู่ซ่อมเรือ',value:'อู่ซ่อมเรือ',icon:'icons/boat.png'},
			{label:'วัด',value:'วัด',icon:'icons/bouddha.png'},
			{label:'มัสยิด',value:'มัสยิด',icon:'icons/moonstar.png'},
			{label:'โบสถ์คริสต์',value:'โบสถ์คริสต์',icon:'icons/cathedral.png'},
			{label:'ศาลเจ้า',value:'ศาลเจ้า',icon:'icons/shintoshrine.png'},
			{label:'สำนักงานเทศบาล',value:'สำนักงานเทศบาล',icon:'icons/congress.png'},
			{label:'ที่ทำการ อบต.',value:'ที่ทำการ อบต.',icon:'icons/congress.png'},
			{label:'ที่ทำการกำนัน',value:'ที่ทำการกำนัน',icon:'icons/house.png'},
			{label:'ที่ทำการผู้ใหญ่บ้าน',value:'ที่ทำการผู้ใหญ่บ้าน',icon:'icons/house.png'},
			{label:'บ้านนายก อบต./เทศบาล',value:'บ้านนายก อบต./เทศบาล',icon:'icons/house.png'},
			{label:'ศาลาหมู่บ้าน',value:'ศาลาหมู่บ้าน',icon:'icons/house.png'},
			{label:'ตลาด/ตลาดนัด',value:'ตลาด',icon:'icons/market.png'},
			{label:'ถนน',value:'ถนน',icon:'icons/road.png'},
			{label:'สะพาน',value:'สะพาน',icon:'icons/bridge_modern.png'},
			{label:'ท่าเรือ',value:'ท่าเรือ',icon:'icons/ferry.png'},
			{label:'แม่น้ำ',value:'แม่น้ำ',icon:'icons/river-2.png'},
			{label:'คลอง',value:'คลอง',icon:'icons/river-2.png'},
			{label:'สระน้ำ',value:'สระน้ำ',icon:'icons/water.png'},
			{label:'อ่างเก็บน้ำ',value:'อ่างเก็บน้ำ',icon:'icons/dam.png'},
			{label:'ป่าไม้',value:'ป่าไม้',icon:'icons/forest.png'},
			{label:'ป่าชายเลน',value:'ป่าชายเลน',icon:'icons/forest.png'},
			{label:'ป่าชายหาดทราย',value:'ป่าชายหาดทราย',icon:'icons/forest2.png'},
			{label:'ต้นไม้',value:'ต้นไม้',icon:'icons/tree.png'},
			{label:'สวนสาธารณะ',value:'สวนสาธารณะ',icon:'icons/garden.png'},
			{label:'ชายหาด',value:'ชายหาด',icon:'icons/beach_icon.png'},
			{label:'ทุ่งนา',value:'ทุ่งนา',icon:'icons/rice.png'},
			{label:'สวนผลไม้',value:'สวนผลไม้',icon:'icons/fruits.png'},
			{label:'ปศุสัตว์',value:'ปศุสัตว์',icon:'icons/cow-export.png'},
			{label:'พื้นที่ขยะชุมชน',value:'พื้นที่ขยะชุมชน',icon:'icons/trash.png'},
			{label:'ปัญหา/ระบุในรายละเอียด',value:'ปัญหา',icon:'icons/symbol_excla.png'},
			{label:'ผู้นำทางความคิด/ปราชญ์ชาวบ้าน/บุคคลสำคัญ',value:'บุคคลสำคัญ',icon:'icons/expert.png'},
			{label:'ผู้พิการ',value:'ผู้พิการ',icon:'icons/disability.png'},
			{label:'ผู้ป่วยติดเตียง',value:'ผู้ป่วยติดเตียง',icon:'icons/lodging-2.png'},
			{label:'อื่นๆ/ระบุ',value:'อื่นๆ',icon:'icons/symbol_inter.png'}
		];
		var covid_locations = {};
		map.addLegend({id:'covid_locations',title:'หมุดสถานที่ โครงการบัณฑิตอาสาสู้ภัยโควิด มหาวิทยาลัยสงขลานครินทร์',checked:false,icon:'icons/symbol_blank.png'});
		$.each(_types,function(x){
			var type = this.value;
			map.addLegend({id:'covid_locations_'+x,title:type,checked:false,icon:this.icon,parent:'covid_locations'});
			setTimeout(function(){
				$('#covid_locations_'+x).change(function(){
					if($(this).prop('checked')){
						if(!covid_locations[x]){
							$.ajax({
								type:'POST',
								url:server+'locations.php',
								data:{where:"type='"+type+"'"},
								success:function(res){
									covid_locations[x] = jsonParse(res);
									if(covid_locations[x]){
										$.each(covid_locations[x],function(){
											if(this.lat && this.lng){
												addMarker(this);
											}
										});
									}
								}
							});
						}
					}
				});
			},2000);
		});
		function addMarker(o){
			var $$ = this;
			if(!o.lat || !o.lng){
				return false;
			}
			var id = 'covid_locations_'+o.id;
			map.removeEntityById(id);
			var name = textProcess(o.name);
			var ent;
			var extentDescription = '';
			var show = false;
			var layer = 'covid_locations';
			$.each(_types,function(x){
				if(o.type == this.value){
					layer = 'covid_locations_'+x;
					icon = this.icon;
					if($('#covid_locations_'+x).prop('checked')){
						show = true;
					}
				}
			});
			if(!map.Layers[layer]){
				map.Layers[layer] = entities.add(new Cesium.Entity());
				map.Layers[layer].show = show;
			}
			var extentDescription = '';
			if(o.images){
				var img = jsonParse(o.images);
				if(img){
				$.each(img,function(){
					extentDescription = extentDescription+'<img style="cursor:pointer;margin:2px;" src="'+server+this.thumb+'" onclick="viewImage(\''+server+this.path+'\')">';
				});
				}
			}
			var p={
				id:id,
				parent:map.Layers[layer],
				name:name,
				search:name,
				extentDescription:extentDescription,
				description:{
					value:'',
					getValue:function(){
						var _this = this;
						var s = '';
						if(!_this.value){
							$.ajax({
								type:'POST',
								url:server+'locations.php',
								data:{id:o.id},
								success:function(res){
									var data = JSON.parse(res);
									if(data && data[0]){
										_this.value = data[0];
									}
								}
							});							
						} else {
							var d = _this.value;
							if(d.type){
								s = s+'ประเภท : '+d.type+'<br>';
							}
							if(d.description){
								s = s+d.description+'<br>';
							}
							s = s+addressRender(d);
							if(d.description){
								s = s+d.description+'<br>';
							}
						}
						return s;
					}
				},
				position:map.setPosition(o),
				billboard:{
					image:icon,
					verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
					scaleByDistance:new Cesium.NearFarScalar(2000,1,2000000,0)
				}
			}
			ent = entities.add(p);
		}
	});
	},5000);
})();