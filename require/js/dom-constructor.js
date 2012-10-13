define(function(require, exports, module){
	var $ = require('jquery');
	var templates = require('./templates');
	var dialog = require('./ui/dialog');
	var storage = require('./storage');
	
	
	function createModelDOM(container, model) {

		if(!model.weeks.length) {
			return;
		}

		if(container.length) {

			$.each(model.weeks, function(i, week){
				var $week = $(templates.week(week));
				
				$.each(week.days, function(j, day){
					var $day = $(templates.day(day)),
						$lectures = $day.find('.b-curriculum__lectures-list');

					var widget = function(lecture) {
						var $lecture = $(templates.lecture(lecture));
						
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
		}
	}

	var _disabled = false;
	function _lock(action){
		if(!_disabled){
			_disabled = true;
			action();
			_disabled = false;
		}
	};

	exports.init = function(model){
		$(function(){
			templates.ready.success(function(){
				var container = $('.b-curriculum');

				var menu = $('.b-menu');
				var button = {
					save:  menu.find('.b-menu__menu-item_command_save'),
					load:  menu.find('.b-menu__menu-item_command_load'),
					print: menu.find('.b-menu__menu-item_command_print'),
					upload: menu.find('.b-menu__menu-item_command_upload'),
					download: menu.find('.b-menu__menu-item_command_download')
				};

				if(storage.supported) {
					button.save.click(function(e){
						_lock(function(){ 
							storage.set('modeldata', model.lectures());
						});
					});

					button.load.click(function(e){
						_lock(function(){
							var data = storage.get('modeldata');
							data && data.length && model.init(data);
						});
					});
				} else {
					button.save.hide();
					button.load.hide();
				}
				
				if(JSON){
					button.upload.click(function(){
						dialog.getJSON(function(text){
							//Перенести в валидатор!
							var obj;
							
							try { 
								obj = JSON.parse(text.data);
							} catch(e) {
								obj = '';
							}
							
							if(obj && obj.length){
								_lock(function(){
									model.init(obj);
								})
							}
						});
					});
					button.download.click(function(){
						_lock(function(){
							dialog.provideJSON(JSON.stringify(model.lectures() || ''));
						});
					});
				}

				model.on('clear', function(){
					container.empty();
				});

				model.on('init', function(){
					createModelDOM(container, model);
				});
				
				createModelDOM(container, model);
			});
		});	
	};
});