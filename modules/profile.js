(function(did){
	function parse(r){try {return JSON.parse(r);} catch(e){return {error:'ระบบผิดพลาด'}}}
	var $$ = this;
	var profile =  {
		edit:function(u){
			var editor = TABLES.volunteer.dataTables.editor();
			editor.editRow(u.id,u,function(){
				profile.show();
			},u.email);
		},
		getData:function(c){
			DB.db({table:'volunteer',where:"username='"+USER.username+"'"}).get(function(d){
				if(d.data && d.data[0]){
					c(d.data[0]);
				}
			});
		},
		show:function(){
			profile.getData(function(u){
				var login = u.login_name?u.login_name:''
				var p ='<div style="padding:10px;">ชื่อ : '+u.name+'</div>';
				p =p+'<div style="padding:10px;">Email : '+u.email+'</div>';
				p =p+'<div style="padding:10px;">ชื่อ Login : '+u.username+'</div>';
				p =p+'<span id="edit_pass" style="display:none;"><label for="pass">รหัสผ่านเก่า : </label><input type="password" id="pass" class="form-control">';
				p =p+'<label for="newpass1">รหัสผ่านใหม่ : </label><input type="password" id="newpass1" class="form-control">';
				p =p+'<label for="newpass2">ยืนยันรหัสผ่านใหม่ : </label><input type="password" id="newpass2" class="form-control"><div style="color:red;" id="form_error"></div></span>';
				p =p+'<button id="profile_edit" style="float:right;margin:10px;" class="btn btn-primary">แก้ไขโปรไฟล์</button>';
				p =p+'<button id="pass_edit" style="float:right;margin:10px;" class="btn btn-primary">เปลี่ยนรหัสผ่าน</button>';
				p =p+'<button id="cancel_edit" style="float:right;display:none;margin:10px;" class="btn btn-secondary">ยกเลิก</button>';
				p =p+'<button id="profile_save" style="float:right;display:none;margin:10px;" class="btn btn-primary">บันทึก</button></div>';
				$(did).html(p);
				$(did).show();
				setTimeout(function(){
					$('#profile_edit').off('click').on('click',function(){
						profile.edit(u);
					});
					$('#pass_edit').off('click').on('click',function(){
						profile.editPassword(u);
						$('#profile_edit').hide();
						$('#pass_edit').hide();
						$('#edit_pass').show();
					});
				},1000);
			});
		},
		checkPassword(pwd,inp_pwd,c){
			$.ajax({
				type:'POST',
				url:'profile.php',
				data:{pwd:pwd,inp_pwd:inp_pwd},
				success:function(r){
					r = parse(r);
					c(r);
				}
			});
		},
		savePassword:function(id,new_pwd,c){
			$.ajax({
				type:'POST',
				url:'profile.php',
				data:{id:id,new_pwd:new_pwd},
				success:function(r){
					r = parse(r);
					c(r);
				}
			});			
		},
		editPassword:function(u){
			$('#profile_save').show();
			$('#cancel_edit').show();
			$('#profile_save').off('click').on('click',function(){
				if(!$('#pass').val()){
					$('#form_error').html('กรุณาป้อนรหัสผ่านปัจจุบัน');
					return;
				} else {
					profile.checkPassword(u.password,$('#pass').val(),function(p){
						if(p.error){
							$('#form_error').html(p.error);
							return;
						} else {
							if(!$('#newpass1').val() || !$('#newpass2').val()){
								$('#form_error').html('กรุณาป้อนรหัสผ่านใหม่');
								return;
							}
							if($('#newpass1').val() !=$('#newpass2').val()){
								$('#form_error').html('รหัสผ่านใหม่ไม่ตรงกัน');
								return;
							} else {
								profile.savePassword(u.id,$('#newpass1').val(),function(r){
									if(r.error){
										$('#form_error').html(r.error);
									} else {
										profile.show();
									}
								});
								
							}
						}
					});
				}
			});
			$('#cancel_edit').off('click').on('click',function(){
				profile.show();
			});
		},
		hide:function(){
			$(did).hide();
		}
	}
	return profile;
});