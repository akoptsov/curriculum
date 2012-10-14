define(function(require, exports, module){
	var $ = require('jquery');
	var template = require('js/templates');
	var events = require('js/events');

	var _emitter = new events.Emitter();

	var _lecture = {
		add: function(container, lecture, position) {
				var $widget = $(template.lecture(lecture)),
					children = container.children();
				
				if(position >= 0 && position < children.length){
					$(children[position]).before($widget);
				} else {
					container.append($widget);
				}
				
				_emitter.emit.call($widget, 'new.lecture', lecture);
				return $widget;
		},
		remove: function(container, lecture, position) {
			var children = container.children();
			if(position >= 0 && position <= children.length){
				$(children[position]).remove();
				_emitter.emit.call(container, 'removed.lecture', lecture);
			}
		}/*,
		redraw: function(widget, lecture) {
			widget.replaceWith($(template.lecture))
		}*/
	}

	_dayLectures = {}
	function _day(container, day) {
		var $widget = $(template.day(day)),
			$lectures = $widget.find('.b-curriculum__lectures-list');

		_dayLectures[day.isoDate] = $lectures;
		
		$.each(day.lectures, function(i, lecture){
			_lecture.add($lectures, lecture, -1);
		});
		
		container.append($widget);
		_emitter.emit.call($widget, 'new.day', day);
	}
	
	function _week(container, week, method){
		method = method || 'append';
		var $widget = $(template.week(week));
		$.each(week.days, function(i, day) {
			_day($widget, day);
		});
		container[method]($widget);
		_emitter.emit.call($widget, 'new.week', week);
	}
	
	function _model(container, model){
		$.each(model.weeks, function(i, week){
			_week(container, week);
		});
	}

	var _container = $('.b-curriculum');
	var config = module.config();
	
	function _init(model) {
		template.ready.success(function(){
			if(!model.weeks.length) {
				return;
			}
			
			if(!(config && config['static'])){ 
				model.on('clear', function() {_container.empty(); });
				model.on('init', function(){ _model(_container, this);});
				model.on('week.prepend', function(week){ _week(_container, week, 'prepend');});
				model.on('week.append', function(week){ _week(_container, week, 'append');});
				model.on('lecture.add', function(lecture, day, position){ 
					_lecture.add(_dayLectures[day.isoDate], lecture, position);
				});
				model.on('lecture.remove', function(lecture, day, position){ 
					_lecture.remove(_dayLectures[day.isoDate], lecture, position);
				});
			}
			
			_model(_container, model);
		});
	};
	
	exports.init = _init;
	
	exports.on = _emitter.on;
	exports.off = _emitter.off;
});