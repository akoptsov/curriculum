define(function(require, exports, module){
	require('handlebars');
	$ = require('jquery');
	
	function addTemplate(name, template){
		if(!Handlebars) {
			console.error('Handlebars is missing from global scope!');
		}
		exports[name] = Handlebars.compile(template);
	}
	
	/*TODO: USE ASYNC LOADED EVENT HERE OR IT WILL FUCK UP MISERABLY*/
	require(['text!templates/day.html'], function(str){
		addTemplate('day', str);
	});
	
	require(['text!templates/lecture.html'], function(str){
		addTemplate('lecture', str);
	});
	
	require(['text!templates/week.html'], function(str){
		addTemplate('week', str);
	});
	
	exports.init = function(model){
		$(function(){
			if(!model.length) {
				return;
			}
			
			var doc = $(this),
				container = doc.find('.b-curriculum');
			
			if(container.length) {
				for(var i = 0, length = model.length; i < length; i++){
					var week = $(exports.week(model[i]));
					for(var j = 0, l2 = week.length; j < l2; j++) {
						var day = $(exports.day(week[j]));
						day.data(week[j]);
						week.append(day);
					}
					container.append(week);
				}
			}
			
		});
	}
	
});