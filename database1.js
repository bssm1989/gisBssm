var database = function(options){
var $$ = this;
$$.db = function(db){
	var _this = this;
	function parse(r){try {return JSON.parse(r);} catch(e){return {error:'ระบบผิดพลาด'}}}
	function _save(d,c){
		$.each(d.data,function(x){
			if((typeof this) == 'object' && this.length<1){
				d.data[x] = '';
			}
		});
		$.ajax({
			type:'POST',
			url:'save.php',
			data:d,
			success:function(r){
				r = parse(r);
				if(c){
					c(r);
				}
			}
		});
	}
	if(db && db.table){
		this.onSnapshot = function(c){
			var data = {
				table:db.table,
				where:db.where?db.where.replace(/"/g,"'"):''
			}
			function _start(){
				$.ajax({
					type:'POST',
					url:'database.php',
					data:data,
					cache:false
				}).done(function(r){
					r = parse(r);
					if(c){
						c(r);
					}
					_snap();
				}).fail(function(){
					_start();
				});
			}
			_start();
			var last_snap = '';
			function _snap(){
				if(!_this.stopped){
					setTimeout(function(){
						_snap();
					},5000);
				}
				$.ajax({
					type:'POST',
					url:'snap.php',
					data:data,
					cache:false,
					success:function(res){
						res = parse(res);
						if(data.where){
							var d = [];
							var ws = data.where.split('=');
							var k = ws[0];
							var v = ws[1].replace(/'/g,'');
							$.each(res.snap,function(){
								var _this = this;
								var sn = false;
								if(this.change_index[k] && this.change_index[k] == v){
									sn = true;
									if((!this.data[k] || this.data[k] != v) && this.change_type == 'update'){
										_this.change_type = 'removed';
									}
								}
								if(this.data[k] && this.data[k] == v){
									if(!sn && this.change_type == 'update'){
										_this.change_type = 'create';
									}
									sn = true;
								}
								if(sn){
									var inset = false;
									$.each(d,function(i){
										if(this.change_id == _this.change_id){
											if(_this.change_time>this.change_time){
												d[i] = _this;
												inset = true;
											}
										}
									});
									if(!inset){
										d.push(_this);
									}
								}
							});
							if(c){
								c(d);
							}
						} else {
							var d = [];
							$.each(res.snap,function(){
								if(this.id>last_snap){
									last_snap = this.id;
									var _this = this;
									var inset = false;
									$.each(d,function(i){
										if(this.change_id == _this.change_id){
											if(_this.change_time>this.change_time){
												d[i] = _this;
												inset = true;
											}
										}
									});
									if(!inset){
										d.push(_this);
									}
								}
								
							});
							if(c){
								c(d);
							}
						}
					}
				});
			}
			return _this;
		}
		this.Snapshot = function(c){
			_this.onSnapshot(c);
		}
		this.snapshot = function(c){
			_this.onSnapshot(c);
		}
		this.realtime = function(c){
			_this.onSnapshot(c);
		}
		this.stop = function(){
			_this.stopped = true;
		}
		this.get = function(c){
			var data = {
				table:db.table
			}
			if(db.where){
				data.where = db.where;
				where =  db.where;
			}
			$.ajax({
				type:'POST',
				url:'database.php',
				data:data,
				cache:false
			}).done(function(r){
				r = parse(r);
				if(c){
					c(r);
				}
			});
		}
		this.update = function(d,c){
			var data = {
				table:db.table,
				id:d.id,
				data:d
			}
			_save(data,c);
		}
		this.updateWhere = function(d,w,c){
			var where=w.replace(/"/g,"'");
			$.each(d,function(x){
				if((typeof this) == 'object' && this.length<1){
					d.data[x] = '';
				}
			});
			var data = {
				table:db.table,
				update:true,
				data:d,
				where:where
			}
			$.ajax({
				type:'POST',
				url:'save.php',
				data:data,
				success:function(r){
					r = parse(r);
					if(c){
						c(r);
					}
				}
			});
		}
		this.deleteWhere = function(w,c){
			var where=w.replace(/"/g,"'");
			var data = {
				table:db.table,
				delete:true,
				where:where
			}
			$.ajax({
				type:'POST',
				url:'save.php',
				data:data,
				success:function(r){
					r = parse(r);
					if(c){
						c(r);
					}
				}
			});
		}
		this.delete = function(id,c){
			var data = {
				table:db.table,
				id:id,
				delete:id,
				data:{id:id}
			}
			_save(data,c);
		}
		this.add = function(d,c){
			var data = {
				table:db.table,
				data:d
			}
			_save(data,c);
		}
	}
	return this;
}
return this;
}