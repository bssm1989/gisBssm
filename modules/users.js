(function(){
var collection = {table:'users'}
function _blink(p){
	if(p.online){
		p.blink = true;
		p.point.outlineColor=Cesium.Color.FORESTGREEN;
		if(p.color && p.color == 2){
			p.color = 1;
			p.point.outlineWidth = 1;
		} else {
			p.color = 2;
			p.point.outlineWidth = 0.3;
		}
		setTimeout(function(){
			_blink(p);
		},Math.floor(Math.random()*100)+700);
	}
}
var users = {
	title:'สมาชิกโครงการ',
	module:'users',
	Table:{
		title:"สมาชิกโครงการ",
		module:'users',
		db:collection,
		columns:[{data:null},{data:null},{data:null},{data:'sub_district',title:'ตำบล',visible:false},{data:'district',title:'อำเภอ',visible:false},{data:'province',title:'จังหวัด',visible:false},{data:'id',title:'ID',visible:false}],
		columnDefs: [
			{
				targets:0,
				title:'ชื่อ',
				width:'140px',
				render:function(d){
					return profileRender(d,d.id,d.email);
				}
			},
			{
				targets:1,
				title:'ที่อยู่',
				width:'220px',
				orderData:[6,5,4],
				render:function(d){
					return addressRender(d);
				}
			},
			{
				targets:2,
				title:'ช่องทางติดต่อ',
				width:'220px',
				render:function(d){
					return eRender(d);
				}
			}
		],
		fields: [
			{
				type:'hidden',
				name:'id'
			},
			{
				type:'hidden',
				name:'create_pwd',
				def:1
			},
			{
				label:'คำนำหน้าชื่อ',
				name:'title',
				attr:{placeholder:'นาย นาง นางสาว...'}
			},
			{
				label:'ชื่อ (ไทย)',
				name:'first_name_th',
				attr:{required:true}
			},
			{
				label:'สกุล (ไทย)',
				name:'last_name_th',
				attr:{required:true}
			},
			{
				label:'Email',
				name:'email',
				attr:{type:'email',required:true}
			},
			{
				label:'กำหนดรหัสผ่าน',
				name:'pre_pwd',
				attr:{placeholder:'ถ้าไม่กำหนดรหัสผ่าน ระบบจะสุ่มรหัสผ่านสำหรับ user ใหม่'}
			},
			{
				label:'บ้านเลขที่',
				name:'building_no'
			},
			{
				label:'หมู่',
				name:'village_no',
				attr:{
					type:"number",
					min:1,
					max:35,
					pattern:"[0-9]{1,2}"
				}
			},
			provinceField(true,'จังหวัด (พื้นที่ปฏิบัติงาน)'),
			districtField(true,'อำเภอ (พื้นที่ปฏิบัติงาน)'),
			subDistrictField(true,'ตำบล (พื้นที่ปฏิบัติงาน)'),
			{
				label: "โทรศัพท์",
				name: "phone",
				placeholder:"โทรศัพท์",
				attr:{
					type:"tel",
					placeholder:'0XXXXXXXXX',
					minlength:10, 
					maxlength:10,
					pattern:"[0]{1}[1-9]{1}[0-9]{8}"
				}
			},
			{
				label:'ระดับการใช้งานระบบ',
				name:'level',
				type:'select',
				def:'user',
				ipOpts: [
					{
						label:'Admin',
						value:'admin'
					},
					{
						label:'Director',
						value:'director'
					},
					{
						label:'Master',
						value:'master'
					},
					{
						label:'User',
						value:'user'
					}
				]
			}
		],
		fnTable:function(t){
			if(!USER.level || USER.level!='admin'){
				t.hideEditorButton();
			}
		},
		fnEditor:function(editor){
			editor.on('open', function(e,type,action){
				if(action == 'create'){
					editor.field('level').enable();
					editor.field('email').enable();
					editor.field('pre_pwd').show();
				} else {
					editor.field('level').disable();
					editor.field('email').disable();
					editor.field('pre_pwd').val('');
					editor.field('pre_pwd').hide();
				}
				if(!USER.level || USER.level!='admin'){
					editor.field('level').disable();
				} else {
					editor.field('level').enable();
				}
			});
		}
	}
}
return users;
});