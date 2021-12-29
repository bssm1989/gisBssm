(function(){
	LoadMap(function(map){
		map.hideMarkerDetail = true;
		map.saveMarker = function(p){
			var editor = TABLES.survey_profile.dataTables.editor();
			editor.buttons([{label:'บันทึก',fn:function(){this.submit()}},{label:'ยกเลิก',fn:function(){this.close()}}]);
			editor.on('close',function(e){setTimeout(function(){p.remove()},100)});
			editor.create('เพิ่มครัวเรือน (หลังจากบันทึกแล้ว คุณสามารถคลิกที่หมุดบนแผนที่เพื่อระบุข้อมูลเพิ่มเติมได้ที่เมนูแบบสอบถาม)');
			setTimeout(function(){
				editor.field('lat').val(p.lat);
				editor.field('lng').val(p.lng);
				if(p.administrative && p.administrative.province_id){
					editor.field('JUN').val(p.administrative.province_id);
					if(p.administrative.district_id){
						setTimeout(function(){
							editor.field('AMP').val(p.administrative.district_id);
							if(p.administrative.sub_district_id){
								setTimeout(function(){
									editor.field('TMP').val(p.administrative.sub_district_id);
								},500);
							}
						},500);
					}
				}
			},100);
		}
	});
})();
