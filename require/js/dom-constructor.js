define(function(require, exports, module){
	require('handlebars');
	$ = require('jquery');
	
	function addTemplate(name, template){
		if(!Handlebars) {
			console.error('Handlebars is missing from global scope!');
		}
		exports[name] = Handlebars.compile(template);
		ready.check();
	}
	
	require(['text!templates/day.html'], function(str){
		addTemplate('day', str);
	});
	
	require(['text!templates/lecture.html'], function(str){
		addTemplate('lecture', str);
	});
	
	require(['text!templates/week.html'], function(str){
		addTemplate('week', str);
	});
	
	var ready = {
		check: function (){
			if(exports.week && exports.day && exports.lecture){
				this.happened = true;
				this.callback && this.callback();
			} 
		},
		subscribe: function(callback){
			this.callback = callback;
			this.happened && this.callback();
		}
	};
	
	exports.init = function(model){
		$(function(){
			ready.subscribe(function(){
				if(!model.length) {
					return;
				}
				
				var container = $('.b-curriculum');
				
				if(container.length) {
					for(var i = 0, length = model.length; i < length; i++){
						var week = $(exports.week(model[i]));
						for(var j = 0, l2 = model[i].length; j < l2; j++) {
							var day = $(exports.day(model[i][j]));
							day.data(model[i][j]);
							week.append(day);
						}
						container.append(week);
					}
				}
			});	
		});
	}
	
});