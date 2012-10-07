define(function(require, exports, module){
	require('handlebars');

	require(['text!templates/day.html'], function(str){
		if(!Handlebars) {
			console.error('Handlebars is missing from global scope!');
		}
		
		Exports.day = Handlebars.compile(str);
	});
	
});