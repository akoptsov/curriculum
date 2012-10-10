define(function(require, exports, module){
	$ = require('jquery');
	require('handlebars');
	require('jquery-ui');
	
	
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
				if(!model.weeks.length) {
					return;
				}
				
				var container = $('.b-curriculum');
				
				if(container.length) {
					$.each(model.weeks, function(i, week){
						var $week = $(exports.week(week));
						
						$.each(week.days, function(j, day){
							var $day = $(exports.day(day)),
								$lectures = $day.find('.b-curriculum__lectures-list');

							var widget = function(lecture) {
								var $lecture = $(exports.lecture(lecture));
								/*
								$lecture.dblclick(function(e){
									day.remove(lecture);
									e.stopPropagation();
								});
								*/
								function edit(data, callback){
									var clone = $.extend(true, {}, data);
									//here the dialog will change the function
									data.title = data.title + '!';
									callback(data);
								}

								$lecture.click(function(e){
									edit(lecture, function(changed){
										if(lecture.start!==changed.start || lecture.end!==changed.end){
											day.remove(lecture);
											day.add(changed);
										} else {
											$lecture.after(widget($.extend(true, lecture, changed)));
											$lecture.remove();
										}
									});
									e.stopPropagation();
								});
								
								return $lecture.data(lecture);
							}
							
							$lectures.empty();
							$.each(day.lectures, function(k, lecture){
								$lectures.append(widget(lecture));
							});

							$day.click(function(){
								var data = $(this).data();
								model.add({
									date: data.isoDate,
									start: data.lectures.length*2 + ':00',
									end: data.lectures.length*2 + 2+ ':00',
									title: 'Новая лекция' + (data.lectures.length ? (' ' + data.lectures.length) : '') ,
									person: 'Иванов И.И.'
								});
							});
							
							//переписать на вставку/изменение/удаление без очистки всех лекций
							day.on('add', function(i, lecture){
								var children = $lectures.children();
								children[i] 
									? $(children[i]).before(widget(lecture))
									: $lectures.append(widget(lecture));
							});
							day.on('remove', function(i){
								var children = $lectures.children();
								children[i] && $(children[i]).remove();
							});
							
							$day.data(day).appendTo($week);
						});
						
						container.append($week);
					});
				}
			});	
		});
	}
	
});