(function(){
var collection = {table:'volunteer'}
var volunteer = {
	title:'อาสาสมัคร',
	module:'volunteer',
	Table:{
		title:'อาสาสมัคร',
		module:'volunteer',
		db:collection,
		columns:[{data:null},{data:null},{data:null},{data:'id',title:'ID',visible:false}],
		columnDefs: [
			{
				targets:0,
				title:'ชื่อ',
				width:'140px',
				render:function(d){
					return d.username+'<br>'+d.name;
				}
			},
			{
				targets:1,
				title:'ช่องทางติดต่อ',
				width:'220px',
				render:function(d){
					return 'Email : '+d.email+'<br>โทร. : '+d.tel+'<br>Facebook : '+d.fb+'<br>Line : '+d.line;
				}
			},
			{
				targets:2,
				title:'จังหวัด',
				width:'120px',
				render:function(d){
					return Provinces[d.JUN].name;
				}
			}
		],
		fields: [
			{
				type:'hidden',
				name:'id'
			},
			{
				label:'ชื่อ Login',
				name:'username',
				attr:{required:true}
			},
			{
				label:'ชื่อ สกุล',
				name:'name'
			},
			{
				label:'Email',
				name:'email',
				attr:{type:'email'}
			},
			{
				label: "โทรศัพท์",
				name: "tel",
				placeholder:"โทรศัพท์",
				attr:{
					type:"tel",
					placeholder:'0XXXXXXXXX',
					minlength:10, 
					maxlength:10,
					pattern:"[0]{1}[1-9]{1}[0-9]{8}"
				}
			},
			provinceIdField(false,'จังหวัด','JUN'),
			{
				label:'Line',
				name:'line'
			},
			{
				label:'Facebook',
				name:'fb'
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
					editor.field('username').enable();
				} else {
					editor.field('level').disable();
					editor.field('username').disable();
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
return volunteer;
});