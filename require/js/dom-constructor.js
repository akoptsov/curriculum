define(function(require, exports, module){
	$ = require('jquery');
	require('handlebars');
	require('jquery-ui');
	var storage = require('./storage');
	
	
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
				var container = $('.b-curriculum');
				
				if(!model.weeks.length) {
					return;
				}
				
				
				if(container.length) {
					$.each(model.weeks, function(i, week){
						var $week = $(exports.week(week));
						
						$.each(week.days, function(j, day){
							var $day = $(exports.day(day)),
								$lectures = $day.find('.b-curriculum__lectures-list');

							var widget = function(lecture) {
								var $lecture = $(exports.lecture(lecture));
								
								$lecture.on('click', '.b-curriculum__lecture-remove', function(e){
									day.remove(lecture);
									e.stopPropagation();
								});
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
								var n = data.lectures.length * 2;
								model.add({
									date: data.isoDate,
									start:  (n < 10? '0':'') + n + ':00',
									end: ((n + 2) < 10? '0': '') + (n + 2) + ':00',
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
					
					var menu = $('.b-menu');
					var $buttons = {
						save:  menu.find('.b-menu__menu-item_command_save'),
						load:  menu.find('.b-menu__menu-item_command_load'),
						print: menu.find('.b-menu__menu-item_command_print'),
					};
					
					$buttons.save.click(function(e){

					});
					
					$buttons.load.click(function(e){
					
					});
				}
			});	
		});
	}
	
});