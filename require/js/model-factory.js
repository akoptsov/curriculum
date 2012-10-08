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
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	}
	
	var _isodate = /\s*(\d+)-(\d+)-(\d+)\s*/;
	function fromISOdate(str) {
		var match = _isodate.exec(str);
		if (match === null || !match.length) {
			console.log('failed to parse an ISO date from ', str);
			return undefined;
		}
		
		var year = parseInt(RegExp.$1),
			month = parseInt(RegExp.$2) - 1,
			day = parseInt(RegExp.$3);
		if(!year || !month || !day){
			console.log('failed to parse an ISO date from ', str);
			return undefined;
		}
		
		return new Date(year, month, day, 0, 0, 0, 0);
	}
	
	
	function Model(lectures) {
		var _lectures = [];
		
		function add(lecture){
			if(!lecture.date) {
				console.error('can\'t add a lecture without date!');
			}
			
			var index = 0;
			while(lectures[index].date <= lecture.date) {
				index++;
			}
			
			_lectures = _lectures.splice(index, 0, lecture);
		}
		
		if(lectures.length) {
			for(var i = 0, count = lectures.length; i < count; i++){
				add(lectures[i]);
			}
		}
		
		var _weeks = [];
		if(_lectures.length){
			var startDate = fromISOdate(_lectures[0].date),
				endDate = fromISOdate(_lectures[_lectures.length - 1].date);
			
			var firstDate = new Date(startDate.getTicks()),
				lastDate = new Date(endDate.getTicks());
			
			firstDate.setDate(firstDate.getDate() - firstDate.getDay() + 1); //monday of the same week
			lastDate.setDate(firstDate.getDate() + 6 - firstDate.getDay());  //sunday of the same week
			
			var dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
				week = [];
			
			for(var i = new Date(firstDate.getTicks()); i<=lastDate; i.setDate(i.getDate() + 1)){
				var day = {
					day: dayNames[i.getDay()],
					date: (i.getMonth() + 1) + '.' + i.getDay(),
					lectures=[]
				};
				week.push(day);
				
				if(i.getDay() === 0) {
					_weeks.push(week);
					week = [];
				}
			}
		}
		
	}
	
	exports.Model = Model;
	
});