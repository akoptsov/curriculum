define(function(require, exports, module){
	var $ = require('jquery');
	require('jquery-ui');
	
	var dialog = require('./dialog');
	var storage = require('js/storage');
	var layout = require('./layout');
	var files = require('js/files')

	var _disabled = false;
	function _lock(action){
		if(!_disabled){
			_disabled = true;
			action();
			_disabled = false;
		}
	};

	function _menu(model){
		var menu = $('.b-menu');
		var button = {
			save:  menu.find('.b-menu__menu-item_command_save'),
			load:  menu.find('.b-menu__menu-item_command_load'),
			print: menu.find('.b-menu__menu-item_command_print'),
			upload: menu.find('.b-menu__menu-item_command_upload'),
			download: menu.find('.b-menu__menu-item_command_download')
		};
		
		
		$.each(button, function(){
			$(this).button();
		});
		
		button.save.button('disable');
		button.load.button('disable');
		
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
			button.print.click(function(e){
				_lock(function(){
					storage.set('modeldata', model.lectures());
				});
			});
		} 
		
		var _changed = false;
		var changed = function() {
			if(!_changed && storage.supported){
				
				button.save.button('enable');
				button.load.button('enable');
				_changed = true;
			}
		}
		
		model.on('lecture.add', changed);
		model.on('lecture.remove', changed);
		model.on('init', function(){ 
			/*FIXME: jquery ui class*/
			button.save.removeClass('ui-state-hover').button('disable');
			button.load.removeClass('ui-state-hover').button('disable');
			_changed = false;
		});

		if(JSON){
			button.upload.click(function(){
				dialog.getJSON(function(text){
					//Перенести в валидатор!
					var obj;

					try {
						//JSON должен быть с двойными кавычками, что некруто. Исправлю, если успею.
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
			button.download.click(function(e){
				var data = JSON.stringify(model.lectures() || '');
				if(data){
					_lock(function(){
						if(files.supported){
							var a = button.download;
							a.attr('download', 'model.json');
							a.attr('href', files.href(data));
						} else {
							e.preventDefault();
							dialog.provideJSON(JSON.stringify(model.lectures() || ''));
						}
					});
				}
			});
		}
	}

	function _traverse(model) {
		$('.b-content__workspace-control_action_prepend').click(function(){
			model.prependWeek();
		})

		$('.b-content__workspace-control_action_append').click(function(){
			model.appendWeek();
		})
	}

	var wrapper = $('.b-content__wrapper');
	exports.init = function(model){
		$(function(){
			layout.on('new.day', function(day){
				this.click(function(){
					var initial = {
						date: day.isoDate,
						start: day.lectures.length ? day.lectures[day.lectures.length - 1].end : '12:00',
					};
					initial.end = initial.start.replace(/\d{2}:/, function(m){
						return (parseInt(m) + 1) + ':';
					});
					dialog.create(this, initial, function(lecture){
						model.add(lecture);
					});
				});
			});

			layout.on('new.lecture', function(lecture){
				this.on('click', '.b-curriculum__lecture-action_remove', function(e){
					model.remove(lecture);
					e.stopPropagation();
				});

				this.click(function(e){
					dialog.change(this, lecture, function change(changed){
							model.remove(lecture);
							model.add(changed);
						}, 	function remove(){
							model.remove(lecture);
						}
					);
					e.stopPropagation();
				});
			});
			
			var body = $(this.body);
			
			layout.on('clear', function(){
				body.addClass('b-content_state_unloaded');
			});
			
			layout.on('init', function(){
				body.removeClass('b-content_state_unloaded');
			});
			

			_menu(model);
			layout.init(model);
			_traverse(model);
		});
	};
});