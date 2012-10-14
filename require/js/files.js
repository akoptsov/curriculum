define(function(require, exports, module){
	var global = require('./global'),
		_url = global.URL || global.webkitURL,
		BlobBuilder = global.BlobBuilder|| global.WebKitBlobBuilder || global.MozBlobBuilder || global.MSBlobBuilder;
	
	this.supported = _url && BlobBuilder;

	function _href(string) {
		var builder = new BlobBuilder();
		builder.append(string);
		var blob = builder.getBlob('application/octet-stream');
		
		return _url.createObjectURL(blob);
	}
	
	this.href = _href;
});