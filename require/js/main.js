define(function(require, exports, module){
	var $ = require('jquery'),
		storage = require('js/storage'),
		global = require('js/global'),
		factory = require('js/model-factory'),
		ui = require('js/dom-constructor')
	
		
		var data = storage.get('curriculum');
		data = data || [
			{
				title: 'Дизайн глазами проектировщика интерфейсов',
				person: 'Иванов С.П.',
				start: '10:00',
				end: '11:30',
				date: '2012-09-15'
			},{
				title: 'Проектирование глазами дизайнера',
				person: 'Петров А.Д.',
				start: '10:00',
				end: '11:30',
				date: '2012-09-29'
			}, {
				title: 'Кроссдоменная передача данных',
				person: 'Джейсон П.',
				start: '19:00',
				end: '20:00',
				date: '2012-09-16'
			}, {
				title: 'Новые технологии HTML5',
				person: 'Шестой И.Е.',
				start: '20:00',
				end: '21:00',
				date: '2012-09-16'
			}, {
				title: 'Далёкая лекция, чо',
				person: 'Слоуп О.К.',
				start: '19:00',
				end: '22:00',
				date: '2012-10-29'
			}
		];
		
		ui.init(new factory.Model(data));

});
