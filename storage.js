var storage = function(options){
var $$ = this;
$$.ref = function(path){
	if(path){
		this.put = function(file,opt){
			var _this = this;
			var data = new FormData();
			data.append('path',path);
			data.append('data', file);
			_this.state = {state:'prepare',bytesTransferred:0,totalBytes:file.size};
			this.on = function(e,progress,error,complete){
				if(e == 'state_changed'){
					if(_this.state.state == 'complete'){
						setTimeout(function(){
							if(complete){
								complete(_this.state);
							}
						},50);
					} else {
						if(progress){
							progress(_this.state);
						}
						setTimeout(function(){
							_this.on(e,progress,error,complete);
						},10);
					}
				}
			}
			this.cancel = function(){
				
			}
			$.ajax({
				type:'POST',
				url:'storage.php',
				data:data,
				beforeSend: function(){
					_this.state.state = 'start';
				},
				processData:false,
				contentType:false,
				xhr:function(){
					var xhr = $.ajaxSettings.xhr() ;
					xhr.upload.onprogress = function(e){
						_this.state.state = 'running';
						_this.state.bytesTransferred = e.loaded/e.total*file.size;
					}
					xhr.upload.onload = function(e){
						_this.state = {state:'complete',bytesTransferred:file.size,totalBytes:file.size}
					};
					return xhr ;					
				}
			}).done(function(res){
				_this.state = {state:'complete',bytesTransferred:file.size,totalBytes:file.size}
			});
			return this;
		}
	}
	return this;
}
return this;
}