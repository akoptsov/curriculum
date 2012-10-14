define(function(require, exports, module){
	require('jquery');
	var models = require('./model-factory');
	var storage = require('./storage');
	var layout = require('./ui/layout');
	
	var data = storage.get('modeldata');
	
	data
		? layout.init(new models.Model(data))
		: $(function() { 
			$('body').addClass('b-page_state_nodata'); 
		})

});