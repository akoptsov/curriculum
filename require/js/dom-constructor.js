define(function(require, exports, module){
	$ = require('jquery');
	require('handlebars');
	
	var events = require('./events');
	var dialog = require('./ui/dialog');
	var storage = require('./storage');
	
	
	var ready = new events.Promise(function(){
		return exports.day && exports.lecture && exports.week;
	});
	
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
	

	exports.init = function(model){
		$(function(){
			ready.success(function(){
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
								
								function edit(data, onchange, onremove){
									dialog.change($lecture, data, onchange, onremove)
								}

								$lecture.click(function(e){
									edit(lecture, function change(changed){
											if(lecture.start!==changed.start || lecture.end!==changed.end){
												day.remove(lecture);
												day.add(changed);
											} else {
												$lecture.after(widget($.extend(true, lecture, changed)));
												$lecture.remove();
											}
										}, 	function remove(){ 
											day.remove(lecture);
										}
									);
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
								var initial = {
									date: data.isoDate,
									start: data.lectures.length ? data.lectures[data.lectures.length - 1].end : '12:00',
								};
								initial.end = initial.start.replace(/\d{2}:/, function(m){ 
									return (parseInt(m) + 1) + ':';
								});
								
								dialog.create($day, initial, function(lecture){
									model.add(lecture);
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