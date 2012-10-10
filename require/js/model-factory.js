define(function(require, exports, module) {
	var events = require('./events');
	
	function proxy(context, func){
		return function(){
			func.apply(context, Array.prototype.slice.call(arguments, 0));
		}
	}
	
	function d2(num){
		return (num < 10 ? '0' : '') + num;
	}
	
	function toISODate(date) {
		return date.getFullYear() + '-' + d2(date.getMonth() + 1) + '-' + d2(date.getDate());
	}
	
	var _isodate = /\s*(\d+)-(\d+)-(\d+)\s*/;
	function fromISODate(str) {
		var match = _isodate.exec(str);
		if (match === null || match.length < 4) {
			console.log('failed to parse an ISO date from ', str);
			return undefined;
		}
		
		var year = parseInt(match[1]),
			month = parseInt(match[2].replace(/^0*/, '')) - 1,
			day = parseInt(match[3].replace(/^0*/, ''));
		if(!year || !month || !day){
			console.log('failed to parse an ISO date from ', str);
			return undefined;
		}
		
		return new Date(year, month, day, 0, 0, 0, 0);
	}
	
	function monday(date) {
		var result = new Date(date),
			day = result.getDay();
			
		result.setDate(result.getDate() - (day ? day : 7) + 1);
		return result;
	}
	
	function sunday(date) {
		var result = new Date(date),
			day = result.getDay();
			
		day && result.setDate(result.getDate() - day + 7);
		return result;
	}

	var _dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
	function Day(date){
		this.isoDate = toISODate(date);
		this.display = {
			day : _dayNames[date.getDay()],
			date : date.getDate() + '.' + d2(date.getMonth() + 1)
		};
		this.lectures = [];
		var _emitter = new events.Emitter();
		
		this.on = proxy(this, _emitter.on);
		this.emit = proxy(this, _emitter.emit);
		this.off = proxy(this, _emitter.off);
	}
	
	Day.prototype.add = function(lecture) {

		var lectures = this.lectures,
			length = lectures.length,
			i = 0;
		
		
		while(i < length && lectures[i].starts > lecture.starts){
			i++;
		}
		
		lectures.splice(i, 0, lecture);
		
		this.emit('add', i, lecture);
		
		return this;
	}
	
	Day.prototype.remove = function(lecture) {
		var lectures = this.lectures,
			length = lectures.length,
			i = 0;
		
		while (i < length && lectures[i] !== lecture) {
			i++;
		}
		
		if (i < length) {
			this.emit('remove', i, lectures.splice(i, 1));
		}

		return this;
	}
	
	function Week(date) {
		var start = this.monday = monday(date);
		var end = this.sunday = sunday(date);
		var days = this.days = [];
		
		for(var i = new Date(start); i <= end; i.setDate(i.getDate() + 1)) {
			days.push(new Day(i));
		};
	}
	
	Week.prototype.contains = function (date) {
		return this.monday <= date && this.sunday >=date;
	};
	
	Week.prototype.day = function(date) {
		if(this.contains(date)) {
			return this.days[(date.getDay() + 6) % 7];
		}
	};
	
	function Model(lecturesList) {

		var _lectures = [],
			_weeks = [],
			_start,
			_end;

		function add(lecture){
			if(!lecture.date) {
				console.error('can\'t add a lecture without date!');
			}
			_lectures = _lectures || [];

			var index = 0, 
				length = _lectures.length;

			while(index < length && _lectures[index].date < lecture.date  ) {
				index++;
			}
			while(index < length && _lectures[index].date == lecture.date && _lectures[index].start < lecture.start){
				index++;
			}

			_lectures.splice(index, 0, lecture);

			day(lecture.date).add(lecture);
			
		}
		
		function day(isoDate) {
			var date = fromISODate(isoDate);
			
			var week;
			if(!_weeks.length) {
				week = new Week(date); 
				
				_weeks.push(week);
				_start = new Date(week.monday);
				_end = new Date(week.sunday);
				
			} else {
				while(_start > date) {
					week = prependWeek();
				}
				while (_end < date) {
					week = appendWeek();
				}
				if(!week) {
					var i = 0;
					do {
						week =  _weeks[i++];
					} while (!week.contains(date))
				}
			}
			
			return week && week.day(date);
			
		}
		
		function prependWeek() {
			_start.setDate(_start.getDate() - 7);
			
			var newWeek = new Week(_start);
			_weeks.splice(0, 0, newWeek);
			return newWeek;
		}
		
		function appendWeek() {
			_end.setDate(_end.getDate() + 7);
			
			var newWeek = new Week(_end);
			_weeks.push(newWeek);
			return newWeek;
		}

		function init(lectures){
			if(lectures.length) {
				for(var i = 0, count = lectures.length; i < count; i++){
					add(lectures[i]);
				}
			}
		}
		
		lecturesList && init(lecturesList);
		
		this.weeks = _weeks;
		this.add = add;
	};
	
	exports.create = function(lectures){
		return new Model(lectures);
	}
});