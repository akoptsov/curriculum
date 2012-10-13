define(function(require, exports, module){
	require('jquery');
	var models = require('./model-factory');
	var storage = require('./storage');
	var ui = require('./dom-constructor');
	var data = storage.get('modeldata');
	
	data
		? ui.init(new models.Model(data))
		: $(function() { 
			$('body').addClass('b-page_state_nodata'); 
		})

});