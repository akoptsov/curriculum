define(function(require, exports, module) {
	
	/*
	function Lecture(obj) {
		this.title = obj.title;
		this.person = obj.person;
		this.date = obj.date;
		this.presentation = obj.presentation;
		this.video = obj.video;
	};
	*/
	
	function toISOdate(date) {
		var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
		return year + (month < 10 ? '-0': '-') + month + (day < 10 ? '-0': '-') + day;
	}
	
	var _isodate = /\s*(\d+)-(\d+)-(\d+)\s*/;
	function fromISOdate(str) {
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
	
	
	function Model(lectures) {
		var _lectures = [];
			_dates = {};
		
		function add(lecture){
			if(!lecture.date) {
				console.error('can\'t add a lecture without date!');
			}
			
			var index = 0, 
				length = _lectures.length;
			
			if(length){
				while(index < length && _lectures[index].date <= lecture.date  ) {
					index++;
				}
				_lectures.splice(index, 0, lecture);
			} else {
				_lectures.push(lecture);
			}
			
			_dates[lecture.date] = _dates[lecture.date] || [];
			_dates[lecture.date].push(lecture);
			
		}
		
		if(lectures.length) {
			for(var i = 0, count = lectures.length; i < count; i++){
				add(lectures[i]);
			}
		}
		
		var _weeks = [];
		
		if(_lectures.length) {
			var firstDate = fromISOdate(_lectures[0].date),
				lastDate = fromISOdate(_lectures[_lectures.length - 1].date);
			
			firstDate.setDate(firstDate.getDate() - firstDate.getDay() + 1); //monday of the same week
			lastDate.setDate(lastDate.getDate() + 7 - lastDate.getDay());    //sunday of the same week
			
			var dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
				week = [];
			
			for(var i = new Date(firstDate); i <= lastDate; i.setDate(i.getDate() + 1)){
				var date = i.getDate(),
					month = i.getMonth() + 1,
					day = {
						day: dayNames[i.getDay()],
						date: date + (month > 9 ? '.' : '.0') + month,
						lectures: _dates[toISOdate(i)] || []
					};
				week.push(day);
				
				if(i.getDay() === 0) {
					_weeks.push(week);
					week = [];
				}
			}
		}
		
		this.data = _weeks;
	}
	
	exports.create = function(lectures){
		return new Model(lectures);
	}
});