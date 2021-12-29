jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "date-eu-pre": function(date){
        date = date.replace(" ", "");
        if (!date) {
            return null;
        }
        var year = 0;
        var eu_date = date.split(/[\.\-\/]/);
        if (eu_date[2]){
            year = eu_date[2];
        }
        var month = eu_date[1];
        var day = eu_date[0];
        return (year + month + day) * 1;
    },
    "date-eu-asc": function(a,b){
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
    "date-eu-desc": function (a,b){
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});
$.fn.dataTable.Editor.upload = function(editor, conf, files, progressCallback, completeCallback){
	if(conf.upLoadFile){
		conf.upLoadFile(editor, conf, files, progressCallback, completeCallback);
		return false;
	}
}
function createDatatable(options){
var Editor = createEditor(options);
var module = options.module?options.module:'';
var pageLength = options.pageLength?options.pageLength:100;
var headerOffset = options.headerOffset?options.headerOffset:0;
var rowId = options.rowId?options.rowId:'id';
var dom = '<"TableTool"Bfip>t';
var Table=$('#'+options.TableID).DataTable({
		orderCellsTop:true,
		TableID:options.TableID,
		orderClasses:false,
		dom:dom,
		fixedHeader:{headerOffset: headerOffset},
		deferRender:true,
		stateSave:false,
		processing:true,
		searching:true,
		retrieve:true,
		select:true,
		rowId:rowId,
		columns:options.columns,
		columnDefs:options.columnDefs,
		responsive:true,
		pageLength:pageLength,
		order:options.order?options.order:[],
		ajax:null,
		language:{
			emptyTable:'ไม่มีข้อมูล',
			info: "แสดงแถวที่ _START_ - _END_ จากทั้งหมด _TOTAL_ แถว",
			infoEmpty:'ยังไม่มีข้อมูล',
			search:'ค้นหา',
			select: {
				rows: {
					_: "(เลือก %d แถว)",
					0: "(Click บนแถวเพื่อเลือก)",
					1: "(เลือก 1 แถว)"
				}
			}
		},
		module:module,
		rowCallback:function(row,data,rowIdx){
			$(row).attr('title','Click บนแถวตารางและเลือกเครื่องมือด้านบน เพื่อแก้ไขหรือลบข้อมูล\nDouble-click บนแถวตารางเพื่อดูรายละเอียด');
			$(row).off('contextmenu').on('contextmenu',function(e){
			});
			$(row).off('dblclick').on('dblclick',function(e){
				if($('#datatable_view_row_'+module+data.id)[0]){
					return false;
				}
				var modal = RowModal(row,data);
				$(modal).modal();
				if(Table.canEdit || (options.canEdit && options.canEdit(data))){
					_loadTable();
				}
				function _loadTable(){
					if($('#datatable_view_row_'+module+data.id)[0]){
						editRow(data.id,options);
					} else {
						setTimeout(function(){
							_loadTable();
						},100);
					}
				}
			});
		},
        lengthMenu: [[-1,5,10,25,50,100,200,-1],['ทั้งหมด','5 แถว','10 แถว','25 แถว','50 แถว','100 แถว','200 แถว','ทั้งหมด']],
        buttons: [
			{extend:'colvis',collectionLayout: 'two-column',name:'colvis',text:'<i class="zmdi zmdi-view-column" style="font-size: 20px;" title="เลือกคอลัมน์"></i>',columns: function(index,title,th){return th.innerText?':gt('+index+')':title;},postfixButtons:['colvisRestore']},
			{extend:'pageLength',name:'page',text:'<i class="zmdi zmdi-view-list" style="font-size: 20px;" title="กำหนดจำนวนแถว (ค่าเริ่มต้น '+pageLength+' แถวต่อหน้า)"></i>'},
			{extend:"create", name:'create',text:'<i class="zmdi zmdi-collection-plus" style="font-size: 20px;" title="เพิ่ม '+options.title+'"></i>',editor:Editor,formButtons:['บันทึก',{label:'ยกเลิก',fn:function(){this.close();}}]},
			{extend:"edit", name:'edit',text:'<i class="zmdi zmdi-edit" style="font-size: 20px;" title="แก้ไขข้อมูล (คลิกเลือกแถว)"></i>',editor:Editor,formButtons:['บันทึก',{label:'ยกเลิก',fn:function(){this.close();}}]},
			{extend:"remove",name:'remove',text:'<i class="zmdi zmdi-delete" style="font-size: 20px;" title="ลบข้อมูล (คลิกเลือกแถว)"></i>',editor:Editor,formButtons:['ลบ',{label:'ยกเลิก',fn:function(){this.close();}}]},
			{name:'reset',text:'<i class="zmdi zmdi-refresh-alt" style="font-size: 20px;" title="รีเซ็ตตาราง"></i>',
				action:function(e,dt,node,config){
					dt.init().reset();
				}
			}
        ],
		reset:function(){
			Table.search('').columns().search('').page.len(this.pageLength).state.clear();
			$.each(this.columns,function(i){
				if(this.visible === false){
					Table.column(i).visible(false);
				} else {
					Table.column(i).visible(true);
				}
			});
			if(this.order){
				Table.order(this.order);
			}
			if(this.dateColumn){
				Table.order([this.dateColumn,'desc']);
			}
			Table.draw();
			if(Table.empty()){
				Table.emptyText();
			}
		},
		emptyText:function(t){
			setTimeout(function(){
			var text = 'ยังไม่มีข้อมูล';
			var canCreate = false;
			if(Table.button('create:name')[0]){
				canCreate = true;
				text = text+' <button class="btn btn-default btn-xs" id="'+options.TableID+'_new_data'+'">'+$(Table.button('create:name')[0].node).html()+'</button>';
			} else {
				if(options.noDataText){
					text = options.noDataText;
				}
			}
			if(t){
				text = t;
			}
			_addtext();
			var c = 0
			function _addtext(){
				if($('#'+options.TableID+' .dataTables_empty')[0]){
					$('#'+options.TableID+' .dataTables_empty').html(text);
					if(canCreate){
						setTimeout(function(){
							$('#'+options.TableID+'_new_data').on('click',function(){
								$(Table.button('create:name')[0].node).click();
							});
						},500);
					}
				} else {
					c = c+1;
					if(c < 100){
						setTimeout(function(){
							_addtext();
						},50);
					}
				}
			}
		},100);
		}
	});
	Table.disableEditor = function(){
		Table.button('create:name').remove();
		Table.button('edit:name').remove();
		Table.button('remove:name').remove();
		Table.canEdit = false;
	}
	Table.emptyText = function(t){
		Table.init().emptyText(t);
	}
	Table.viewRow = function(id,filter){
		if($('#datatable_view_row_'+module+id)[0]){
			return false;
		}
		var f = Table.search();
		if(filter){
			Table.search(filter).draw();
		} else {
			Table.search(id).draw();
		}
		setTimeout(function(){
			$('#'+options.TableID+' #'+id).dblclick();
			Table.search(f).draw();
		},300);
	}
	Table.reset = function(){
		Table.init().reset();
	}
	Table.hideEditorButton = function(){
		Table.button('create:name').remove();
		Table.button('edit:name').remove();
		Table.button('remove:name').remove();	
		Table.canEdit = false;
	}
	Table.canEdit = true;
	function editRow(id,data){
		var canEdit = true;
		if(options.canEdit && options.canEdit(data)){
			canEdit = true;
		}
		if(!Table.canEdit && !canEdit){
			return false;
		}
		if($('#editData_'+id)[0]){
			$('#editData_'+id).off().on('click',function(){
				Table.editor().editRow(id,data);
			});
		} else {
			setTimeout(function(){
				editRow(id,data);
			},200);
		}
	}
	Table.module = options.module;
	if(options.fnTable){
		options.fnTable(Table);
	}
	Table.empty = function(){return Table.data()[0]?false:true};
	Table.notEmpty = function(){return Table.data()[0]?true:false};
	Table.on('order.dt',function(){
		if(Table.empty()){
			Table.emptyText();
		}
	});
	Table.on('search.dt', function(){
		if(Table.empty()){
			Table.emptyText();
		} else {
			if(Table.rows().length == 1){
				Table.emptyText('ไม่มีข้อมูลที่ค้นหา');
			}
		}
	});
	Table.change = function(data,type){
		data.change = true;
		if(type == 'added' || type == 'create'){
			Table.rows().every(function(){
				if(data.id == this.id()){
					Table.row(this).remove().draw(false);
				}
			});
			Table.row.add(data).draw();
		}
		if(type == 'modified' || type == 'update'){
			Table.rows().every(function(){
				if(data.id == this.id()){
					Table.row(this).data(data).draw(false);
				}
			});
		}
		if(type == 'removed' || type == 'delete'){
			Table.rows().every( function(){
				if(data.id == this.id()){
					Table.row(this).remove().draw(false);
				}
			});			
		}
		setTimeout(function(){
			delete data.change;
		},2000);
	}
	function RowModal(row,data){
		if($('#datatable_view_row_'+module+data.id)[0]){
			return false;
		}
		var Clone = row.cloneNode(true);
		$.each(Clone.childNodes,function(i){
			var col = this;
			if(col.innerHTML){
				if(options.columnDefs[i] && options.columnDefs[i].title){
					col.title = '<u><b>'+options.columnDefs[i].title+'</b></u>';
				}
				$.each(col.childNodes,function(){
					if(this.nodeName === "img" || this.nodeName === "IMG" && !this.getAttribute('no-lg')){
						col.merge = true;
						if(!$(this).attr('force-left')){
							$(col).css("text-align","center");
							col.center = true;
						}
					}
				});
			}
		});
		var editBtn = '';
		if(Table.canEdit  || (options.canEdit && options.canEdit(data))){
			editBtn = '<span class="zmdi zmdi-edit" style="font-size:16px;cursor:pointer;margin-left:20px;" id="editData_'+data.id+'" title="แก้ไขข้อมูล"></span>';
		}
		var div = '<div id="datatable_view_row_'+module+data.id+'" class="modal fade modal_table datatable_view_row" tabindex="-1" role="dialog" aria-hidden="true">';
		div = div+'<div class="modal-dialog modal-lg" style="margin:4px;"><div class="modal-content" style="padding-bottom: 10px;">';
		div = div+'<div class="modal-header" style="padding: 6px;"><button type="button" class="close" data-dismiss="modal">&times;</button>';
		div = div+'<h4 class="modal-title" id="row_modal_title">'+options.title+editBtn+'</h4></div>';
		var h = (window.innerHeight-60)+'px';
		div = div+'<div class="modal-body" style="max-height:'+h+';overflow-y: auto;padding:4px;">';
		div = div+'<table class="table table-responsive" style="width:98%;">';
		$.each(Clone.childNodes,function(i){
			var col = this;
			if(this.innerHTML && options.columnDefs[i]){
				if(this.merge){
					var align = 'left';
					if(col.center){
						align = 'center';
					}
					div = div+'<tr style="height:50px;"><td valign="top" colspan="2" style="text-align:'+align+';overflow-wrap:normal;">'+this.innerHTML+'</td></tr>';
				} else {
					div = div+'<tr style="height:50px;"><td valign="top" style="max-width:300px;min-width:120px;overflow-wrap:normal;">'+this.title+'</td><td valign="top" style="overflow-wrap:normal;">'+this.innerHTML+'</td></tr>';
				}
			}
		});
		div =div+'</table></div></div></div>';
		return div;
	}
	return Table;
}
function createEditor(options){
var Editor = new $.fn.dataTable.Editor({
    ajax: function(method, url, d, successCB, errorCB){
		if(d.action === 'create'){
			DB.db(options.db).add(d.data[0],function(output){
				successCB(output);
			});
		}
		if(d.action === 'remove'){
			var c = 0;
			$.each(d.data, function(id, value){
				DB.db(options.db).delete(id,function(output){
					c = c+1;
					if(c === Object.keys(d.data).length){
						successCB(output);
					}
				});
			});
		}
		if(d.action === 'edit'){
			var output = {data:[]};
			$.each(d.data, function(id, value){
				DB.db(options.db).update(value,function(out){
					output.data.push(value);
					if(output.data.length === Object.keys(d.data).length){
						successCB(output);
					}
				});
			});
		}
	},
	table: '#'+options.TableID,
	title:options.title,
	idSrc:'id',
	fields:options.fields,
	i18n: {
		create: {button:"เพิ่ม",title:"เพิ่ม "+options.title,submit:"เพิ่ม"},
		edit: {button:"แก้ไข",title:"แก้ไข "+options.title,submit:"บันทึก"},
		remove: {button: "ลบ",title:"ลบ "+options.title,submit:"ลบ",confirm:{_: "<center>ต้องการลบข้อมูล %d แถว</center>",1: "<center>ต้องการลบข้อมูล 1 แถว</center>"}},
		error: {system: "ระบบผิดพลาด"}
   }
});
if(options.fnEditor){
	options.fnEditor(Editor);
}
if(options.extEditor){
	options.extEditor(Editor);
}
Editor.upLoadFile = function(editor,conf,files,progressCallback,completeCallback){
	var reader = new FileReader();
	var counter = 0;
	var file_ids = [];
	editor.error(conf.name,'');
	reader.onload = function(e){
		if(conf.attr && conf.attr.accept){
			var accept = conf.attr.accept.replace('*','');
			if(!(files[counter].type).includes(accept)){
				editor.error(conf.name,'ไฟล์ผิดประเภท');
				setTimeout(function(){
					editor.error(conf.name,'');
					progressCallback(conf);
				},3000);
				return false;
			}
		}
		progressCallback(conf,conf.fileReadText||"<i>กำลังอัปโหลด..</i>" );
		var submit = false;
		editor.on('preSubmit.DTE_Upload',function(){
			submit = true;
			return false;
		});
		var exts = files[counter].name.split('.');
		var ext = exts[exts.length-1];
		var path = conf.folder+'/'+randText(16)+'.'+ext;
		var uploadTask;
		if((files[counter].type).startsWith('image/')){
			scaleImage(files[counter],1024,function(r){
				uploadTask = STORAGE.ref(path).put(r,{contentType:files[counter].type});
				task(uploadTask);
			});
		} else {
			uploadTask = STORAGE.ref(path).put(files[counter],{contentType:files[counter].type});
			task(uploadTask);
		}
		editor.on('close',function(){
			uploadTask.cancel();
			progressCallback(conf);
			return false;
		});
		function addResult(result,c){
			result.path = path;			
			if(result.createThumb){
				STORAGE.ref(path+'.thumb.png').put(result.createThumb,{contentType:files[counter].type}).on('state_changed',false,false,function(){
					result.thumb = path+'.thumb.png';
					delete result.createThumb;
					file_ids.push(result);
					if(c){
						c();
					}
				});
			} else {
				file_ids.push(result);
				if(c){
					c();
				}
			}
		}
		function task(uploadTask){
			uploadTask.on('state_changed',function(sn){
				switch(sn.state){
					case 'paused':
						progressCallback(conf, 'Upload is paused');
					break;
					case 'running':
						var progress = ((sn.bytesTransferred/sn.totalBytes)*100).toFixed(0);
						progressCallback(conf, files.length==1?progress+'%':progress+'% of file '+(counter+1)+' from '+files.length+' files.');
					break;
				}
			}, function(error){
				editor.error(conf.name, error);
			}, function(){
				function _success(){
					progressCallback(conf);
					completeCallback.call(editor,[file_ids[file_ids.length-1]]);
					if(counter<files.length-1){
						counter++;
						reader.readAsDataURL(files[counter]);
					} else {
						setTimeout(function(){
							editor.off('preSubmit.DTE_Upload');
							$('div.clearValue button').removeAttr('disabled');
							//completeCallback.call(editor,file_ids);
							if(completeCallback.extFn){
								//completeCallback.extFn(file_ids);
							}
							if(submit){
								editor.submit();
							}
						},500);
					}			
				}
				if((files[counter].type).startsWith('image/')){
					scaleImage(files[counter],128,function(r){
						addResult({createThumb:r},_success);
					});
				} else {
					addResult({},_success);
				}
			});
		}
	}
	if(files[0]){
		reader.readAsText(files[0]);
	}
}

if(Editor.s.fields.province && Editor.s.fields.province.s.opts.type == 'select'){
	if(Editor.s.fields.district){
		if(Editor.s.fields.sub_district){
			Editor.dependent('district', function(val){
				if(val){
					Editor.field('district').def(val);
					getSubDisticts(Editor.field('province').val(),val,function(s){
						Editor.field('sub_district').update(s);
						$.each(Editor.s.editFields, function(){
							if(this.data && this.data.sub_district){
								Editor.field('sub_district').def(this.data.sub_district);
								Editor.field('sub_district').set(this.data.sub_district);
							}
						});
					});
				} else {
					Editor.field('sub_district').update([]);
				}
			});
			Editor.dependent('sub_district', function(val){
				if(val){
					Editor.field('sub_district').def(val);
				}
			});
		}
		Editor.dependent('province', function(val){
			if(val){
				//Editor.field('province').def(val);
				getDisticts(val,function(d){
					Editor.field('district').update(d);
					$.each(Editor.s.editFields, function(){
						if(this.data && this.data.district){
							Editor.field('district').def(this.data.district);
							Editor.field('district').set(this.data.district);
						}
					});
				});
			} else {
				Editor.field('district').update([]);
			}
		});
	}
	getProvinces(function(p){
		Editor.field('province').update(p);
	});
}
function thYear(){
	if(!$('.editor-datetime-year')[0]){
		setTimeout(function(){
			thYear();
		},10);
		return false;
	}
	if($('.editor-datetime-year').prev()[0] && !$('.editor-datetime-year').prev().attr('lang')){
		$('.editor-datetime-year').prev().html(Number($('.editor-datetime-year').prev().html())+543);
		$('.editor-datetime-year').prev().attr('lang','th');
	}
	$.each($('.editor-datetime-year')[0].childNodes,function(){
		if(!$(this).attr('lang')){
			$(this).html(Number($(this).html())+543);
			$(this).attr('lang','th');
		}
	});
}
$.each(Editor.fields(),function(){
	var f = this;
	if(Editor.field(f).s.opts.type === 'datetime'){
		Editor.field(f).input().on('focus',function(){
			thYear();
		});
	}
	if(Editor.field(f).s.opts.type === 'textarea'){
		$(Editor.field(f).input()).off('input').on('input',function(e){
			$(Editor.field(f).input()).css('height','5px');
			var h = $(Editor.field(f).input())[0].scrollHeight;
			$(Editor.field(f).input()).css('height',(h+2)+'px');
		});
		Editor.on('open',function(e,type,action){
			$(Editor.field(f).input()).attr('rows',2);
			$(Editor.field(f).input()).css('height','unset');
			if(action == 'edit'){
				setTimeout(function(){
					if(Editor.field(f).val()){
						$(Editor.field(f).input()).css('height','5px');
						var h = $(Editor.field(f).input())[0].scrollHeight;
						$(Editor.field(f).input()).css('height',(h+2)+'px');
					}
				},200);
			}
		});
	}
	if(Editor.field(f).s.opts.type != "upload" && Editor.field(f).s.opts.type != "uploadMany" && Editor.field(f).s.opts.type != "checkbox" && Editor.field(f).s.opts.type != "hidden" && Editor.field(f).s.opts.type != "textarea"){
		Editor.field(f).input().on('change',function(){
			Editor.FieldValidity(f);
		});
	}
	if(Editor.field(f).s.opts.onkeyup){
		Editor.field(f).input().on('keyup',function(){
			Editor.field(f).s.opts.onkeyup(Editor,Editor.field(f).val());
		});
	}
	if(Editor.field(f).s.opts.province_id){
		dbProvinces(function(p){
			var prov = [];
			$.each(p,function(){
				prov.push({label:this.name,value:this.id});
			});
			prov.sort((a,b) => a.label.localeCompare(b.label,'th'));
			Editor.field(f).update(prov);
			if(Editor.field(f).s.opts.depentTo){
				var fd = Editor.field(f).s.opts.depentTo;
				Editor.dependent(f, function(val){
					if(val){
						dbDistricts(val,function(d){
							var dist = [];
							$.each(d,function(){
								dist.push({label:this.name,value:this.id});
							});
							dist.sort((a,b) => a.label.localeCompare(b.label,'th'));
							Editor.field(fd).update(dist);
							$.each(Editor.s.editFields, function(){
								if(this.data && this.data[fd]){
									Editor.field(fd).set(this.data[fd]);
								}
							});
						});
					} else {
						Editor.field(fd).update([]);
					}
				});
				if(Editor.field(fd).s.opts.depentTo){
					var fs = Editor.field(fd).s.opts.depentTo;
					Editor.dependent(fd, function(val){
						if(val){
							dbSubDistricts(val,function(d){
								var sdist = [];
								$.each(d,function(){
									sdist.push({label:this.name,value:this.id});
								});
								sdist.sort((a,b) => a.label.localeCompare(b.label,'th'));
								Editor.field(fs).update(sdist);
								$.each(Editor.s.editFields, function(){
									if(this.data && this.data[fs]){
										Editor.field(fs).set(this.data[fs]);
									}
								});
							});
						} else {
							Editor.field(fs).update([]);
						}
					});
				}
			}
		});
	}
});
Editor.on('preOpen',function(e,type,action){
	Editor.error('');
	$.each(Editor.fields(),function(){
		Editor.field(this).error('');
	});
});
Editor.on('open',function(e,type,action){
	Editor.isOpen = true;
	Editor.isClose= false;
	Editor.error("");
	$.each(Editor.fields(),function(){
		var f = this;
		Editor.field(f).error("");
		if(Editor.field(f).s.opts.hideOpen){
			Editor.field(f).hide();
		}
		if(Editor.field(f).s.opts.ipOpts && Editor.field(f).s.opts.ipOpts.length>0){
			var p = 0;
			if(Editor.field(f).s.opts.placeholder || (Editor.field(f).s.opts.attr && Editor.field(f).s.opts.attr.placeholder)){
				p = 1;
			}
			$.each(Editor.field(f).s.opts.ipOpts,function(i){
				var opt = this;
				if(opt.title){
					$(Editor.field(f).input()[0][i+p]).attr('title',opt.title);
				}
				if(opt.attr){
					$.each(opt.attr,function(attr,v){
						$(Editor.field(f).input()[0][i+p]).attr(attr,v);
						if(Editor.field(f).input().length == 1){
							$(Editor.field(f).input()[0][i+p]).attr(attr,v);
						}
					});
				}
			});
		}
		if(Editor.field(f).s.opts.dependent){
			Editor.field(f).s.opts.dependent(Editor,Editor.field(f).val());
			Editor.dependent(f, function(val){
				Editor.field(f).s.opts.dependent(Editor,val);
			});
			if(Editor.field(f).s.opts.type === 'hidden'){
				$('.DTE_Field_Name_'+f).on('change',function(){
					Editor.field(f).s.opts.dependent(Editor,Editor.field(f).val());
				});
			}
		}
		if(Editor.field(f).s.opts.type === 'upload'){
			Editor.dependent(f, function(val){
				$('div.clearValue button').attr('disabled','disabled');
			});
		}
		if(Editor.field(f).s.opts.type === 'uploadMany'){

		}
		if(Editor.field(f).s.opts.onchange){
			Editor.field(f).input().on('change',function(){
				Editor.field(f).s.opts.onchange(Editor,Editor.field(f).val());
			});
			$('.DTE_Field_Name_'+f).on('change',function(){
				Editor.field(f).s.opts.onchange(Editor,Editor.field(f).val());
			});
		}
	});
	$('.modal-dialog').addClass('modal-lg');
});
Editor.FieldValidity = function(f){
	var Input = Editor.field(f).input()[0];
	var valid = true;
	if(Editor.field(f).inError()){
		valid = false;
	} else {
		if(Input && Input.validationMessage){
			var msg = Input.validationMessage;
			var minlength = '';
			var maxlength = '';
			if(Editor.field(f).s.opts.attr && Editor.field(f).s.opts.attr.minlength){
				minlength = Editor.field(f).s.opts.attr.minlength;
			} else if(Editor.field(f).s.opts.attr && Editor.field(f).s.opts.attr.min){
				minlength = Editor.field(f).s.opts.attr.min;
			}
			if(Editor.field(f).s.opts.attr && Editor.field(f).s.opts.attr.maxlength){
				maxlength = Editor.field(f).s.opts.attr.maxlength;
			} else if(Editor.field(f).s.opts.attr && Editor.field(f).s.opts.attr.max){
				maxlength = Editor.field(f).s.opts.attr.max;
			}
			if(Input.validity.valueMissing){msg = "ข้อมูลจำเป็น"}
			if(Input.validity.rangeUnderflow){msg = "ความยาวหรือค่าต้องมากกว่าหรือเท่ากับ "+minlength}
			if(Input.validity.rangeOverflow){msg = "ความยาวหรือค่าต้องน้อยกว่าหรือเท่ากับ "+maxlength}
			if(Input.validity.patternMismatch){msg = "รูปแบบไม่ถูกต้อง"}
			Editor.error(Editor.field(f).s.opts.label+':'+msg);
			Editor.field(f).error(msg);
			Input.focus();
			valid = false;
		} else {
			Editor.field(f).error('');
			Editor.error('');
		}
	}
	return valid;
}
Editor.on('preSubmit', function(e, o, act){
	if(act != 'remove'){
		$.each(Editor.fields(),function(){
			var f = this;
			if(Editor.field(f).inError()){
				return false;
			}
			if(Editor.field(f).s.opts.type != "upload" && Editor.field(f).s.opts.type != "uploadMany" && Editor.field(f).s.opts.type != "checkbox" && Editor.field(f).s.opts.type != "hidden"){
				if(!Editor.FieldValidity(f)){
					return false;
				}
			}
			if(Editor.field(f).s.opts.required){
				if(!Editor.field(f).val() || Editor.field(f).val().length<1){
					Editor.field(f).error('ข้อมูลจำเป็น');
					Editor.error(Editor.field(f).s.opts.label+' : ข้อมูลจำเป็น');
					Editor.field(f).input()[0].focus();
				}
			}
			if(Editor.field(f).s.opts.type === 'textarea'){
				if(Editor.field(f).val()){
					var v = Editor.field(f).val().replace(/\n\n/g,'\n');
					v = v.replace(/\n\n/g,'\n');
					v = v.replace(/   /g,' ');
					v = v.replace(/  /g,' ');
					v = v.replace(/\n /g,'\n');
					v = v.replace(/ \n/g,'\n');
					if(v.endsWith('\n') || v.endsWith(' ')){
						v = v.slice(0, -1);
					}
					Editor.field(f).val(v);
				}
			}
		});
		if(this.inError()){
			return false;
		}
	} else {

	}
});
Editor.on('close',function(e){
	Editor.isClose = true;
	Editor.isOpen = false;
	setTimeout(function(){
		$('.datatable_view_row').css('overflow-y','auto');
		if($('.modal').length>0){
			$('.modal')[$('.modal').length-1].focus();
			$('.modal').css('overflow-y','auto');
		}
	},500);
	Editor.error("");
	$.each(Editor.fields(),function(){
		Editor.field(this).error("");
		if(Editor.field(this).s.opts.type!="hidden"){
			Editor.field(this).show();
		}
	});
});
window.addEventListener('popstate', function(e){
	if(Editor.s.displayed){
		Editor.close();
		return false;
	}
});
Editor.editRow = function(id,data,c,filter){
	var table = $('#'+options.TableID).DataTable();
	var title = '';
	var f = table.search();
	if(data.title){
		//title = data.title;
	}
	Editor.buttons([
		{
			label: "บันทึก",fn: function(){
				this.submit();
				table.search(f).draw();
				if(c){
					c();
				}
			}
		},
		{
			label: "ยกเลิก",fn: function(){
				this.close();
				table.search(f).draw();
			}
		}
	]);
	if(filter){
		table.search(filter).draw();
	} else {
		table.search(id).draw();
	}
	setTimeout(function(){
		Editor.edit($('#'+options.TableID+' tbody tr#'+id),'แก้ไขข้อมูล '+title);
	},500);
}
Editor.removeRow = function(id,t,c){
	var title = t?t:'';
	Editor.buttons([
		{label:'ยืนยัน',fn:function(){this.submit();if(c){c();}}},
		{label:'ยกเลิก',fn:function(){this.close();}}
	]);
	Editor.remove($('#'+options.TableID+' tbody tr#'+id),'ลบข้อมูล '+title);
}
return Editor;
}
function provinceField(r,l,n,d){
	var label = l?l:'จังหวัด';
	var name = n?n:'province';
	var def = '';
	var req = false;
	if(r){
		label = label+' <red>*</red>';
		req = true;
	}
	var depentTo = d?d:false;
	return {label:label,name:name,type:'select',required:req,placeholder:'เลือกจังหวัด',province:true,depentTo:depentTo}
}
function provinceIdField(r,l,n,d){
	var label = l?l:'จังหวัด';
	var name = n?n:'province_id';
	var req = false;
	if(r){
		label = label+' <red>*</red>';
		req = true;
	}
	var depentTo = d?d:false;
	return {label:label,name:name,type:'select',required:req,placeholder:'เลือกจังหวัด',province_id:true,depentTo:depentTo}
}
function districtField(r,l,n,d){
	var label = l?l:'เขต/อำเภอ';
	var name = n?n:'district';
	var def = '';
	var req = false;
	if(r){
		label = label+' <red>*</red>';
		req = true;
	}
	var depentTo = d?d:false;
	return {label:label,name:name,type:'select',required:req,placeholder:'เลือกอำเภอ',district:true,depentTo:depentTo}
}
function districtIdField(r,l,n,d){
	var label = l?l:'เขต/อำเภอ';
	var name = n?n:'district_id';
	var req = false;
	if(r){
		label = label+' <red>*</red>';
		req = true;
	}
	var depentTo = d?d:false;
	return {label:label,name:name,type:'select',required:req,placeholder:'เลือกอำเภอ',district_id:true,depentTo:depentTo}
}
function subDistrictField(r,l,n){
	var label = l?l:'แขวง/ตำบล';
	var name = n?n:'sub_district';
	var req = false;
	if(r){
		label = label+' <red>*</red>';
		req = true;
	}
	return {label:label,name:name,type:'select',required:req,placeholder:'เลือกตำบล',sub_district:true}
}
function subDistrictIdField(r,l,n){
	var label = l?l:'แขวง/ตำบล';
	var name = n?n:'sub_district_id';
	var req = false;
	if(r){
		label = label+' <red>*</red>';
		req = true;
	}
	return {label:label,name:name,type:'select',required:req,placeholder:'เลือกตำบล',sub_district_id:true}
}
function randText(length){
	var L = 8;
	if(length){
		L = length;
	}
	var text = "";
	var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for(var i = 0; i<L; i++){
		text+=possible.charAt(Math.floor(Math.random()*possible.length));
	}
	return text;
}
if(!HTMLCanvasElement.prototype.toBlob){
	Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob',{
		value:function(callback, type, quality){
			var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
			len = binStr.length,
			arr = new Uint8Array(len);
			for(var i = 0; i < len; i++){
				arr[i] = binStr.charCodeAt(i);
			}
			callback(new Blob([arr], {type: type || 'image/png'}));
		}
	});
}
window.URL = window.URL || window.webkitURL;
function scaleImage(file,w,callback){
	var reader = new FileReader();
	reader.onload = function(e){
		var img = new Image();
		img.onload = function(){
			var rat = img.width/img.height;
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			canvas.width = w?w:1024;
			if(img.width<canvas.width){
				canvas.width = img.width;
			}
			canvas.height = (canvas.width/rat).toFixed(0);
			ctx.drawImage(img,0,0,canvas.width,canvas.height);
			canvas.toBlob(function(blob){
				callback(blob);
			},file.type);
		}
		img.src = reader.result;
	}
	if(file){
		reader.readAsDataURL(file);
	}
}