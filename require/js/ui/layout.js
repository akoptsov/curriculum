define(function(require, exports, module){
	var $ = require('jquery');
	var template = require('js/templates');
	var events = require('js/events');

	var _emit = new events.Emitter();

	function _lecture(container, lecture) {
		var $widget = $(template.lecture(lecture));
		container.append($widget);
	}
	
	function _day(container, day) {
		var $widget = $(template.day(day)),
			$lectures = $widget.find('.b-curriculum__lectures-list');
		
		$.each(day.lectures, function(i, lecture){
			_lecture($lectures, lecture);
		});
		
		container.append($widget);
	}
	
	function _week(container, week, method){
		method = method || 'append';
		var $widget = $(template.week(week));
		$.each(week.days, function(i, day) {
			_day($widget, day);
		});
		container[method]($widget);
	}

	var _container = $('.b-curriculum');
	var _model;
	function _init(container, model) {
		template.ready.success(function(){
			if(!model.weeks.length) {
				return;
			}
			container.empty();
			$.each(model.weeks, function(i, week){
				_week(container, week);
			});
		});
	};
	
	exports.init = function(model){
		_init(_container, (_model = model));
	};
	
	exports.on = _emit.on;
	exports.off = _emit.off;
});