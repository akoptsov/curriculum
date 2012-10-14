define(function(require, exports, module){
	var $ = require('jquery');
	var dialog = require('./ui/dialog');
	var storage = require('./storage');
	var layout = require('./ui/layout');
	
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
	}
	
	function _traverse(model) {
		$('.b-content__workspace-control_action_prepend').click(function(){
			model.prependWeek();
		})
		
		$('.b-content__workspace-control_action_append').click(function(){
			model.appendWeek();
		})
	}
	
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
				this.on('click', '.b-curriculum__lecture-remove', function(e){
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
					
			_menu(model);
			layout.init(model);
			_traverse(model);
		});
	};
});