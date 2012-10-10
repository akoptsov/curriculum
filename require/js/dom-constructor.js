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
					$.each(model, function(i, week){
						var $week = $(exports.week(week));
						
						$.each(week.days, function(j, day){
							var $day = $(exports.day(day)),
								$lectures = $day.find('.b-curriculum__lectures-list');

							$.each(day.lectures, function(k, lecture){
								var $lecture = $(exports.lecture(lecture));
								$lecture.data(lecture).appendTo($lectures);
							});
							
							$day.data(day).appendTo($week);
							/*
							$day.click(function(){
								var data = $(this).data();
								model.add({
									date: data.isoDate,
									starts: '09:00',
									ends: '11:00',
									title: 'Новая лекция',
									person: 'Иванов И.И.'
								});
							});
							*/
						});
						
						container.append($week);
					});
				}
			});	
		});
	}
	
});