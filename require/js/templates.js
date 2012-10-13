define(function(require, exports, module){
	require('handlebars');
	var events = require('./events');
	
	var names = module.config().required;
	
	var ready = new events.Promise(function(){
		if(!names && !names.length) {
			return true;
		}
		
		for(var i = 0, count = names.length; i < count; i++){
			if(!exports[names[i]]) {
				return false;
			}
		}
		
		return true;
	});
	
	var re = /<!--\s*([\w$-]+)\s*-->\s*([\s\S]+?)\s*(?=<!--\s*[\w$-]+\s*-->|$)/g;
		  // /<!--\s*([\w$-]+)\s*-->\s*([\s\S]*?)\s*(?=<!--\s*\\\1\s*-->)/g;
	function _templates(text) {
		if(!Handlebars){
			console.error('Handlebars is missing from the global scope');
			return;
		};
		
		var matches;
		while(matches = re.exec(text)){
			for(var i = 0, count = matches.length; i < count; i++) {
				exports[matches[1]] = Handlebars.compile(matches[2]);
				ready.check();
			}
		}
	}
	
	require(['text!templates/templates.html'], function(text){
		text && _templates(text);
	});
	
	 exports.ready = ready;
});