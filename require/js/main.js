define(function(require, exports, module){
	var $ = require('jquery'),
		bus = require('js/event-bus'),
		storage = require('js/storage'),
		global = require('js/global'),
		factory = require('js/model-factory'),
		ui = require('js/dom-constructor')
	
	$(function(){
				
		var doc = $(this),
			window = $(global),
			headerHeight = doc.find('.b-content__header').outerHeight(),
			footerHeight = doc.find('.b-content__footer').outerHeight(),
			wrapper = doc.find('.b-content__wrapper');
		
		//hack to have a fixed-height container in the page with scrollable content;
		function adapt(){
			wrapper.height(window.height() - headerHeight - footerHeight);
		}
		
		adapt();
		$(window).resize(adapt);
		
		var data = [
			{
				title: 'Дизайн глазами проектировщика интерфейсов',
				person: 'Иванов С.П.',
				starts: '10:00',
				ends: '11:30',
				date: '2012-09-15'
			},{
				title: 'Проектирование глазами дизайнера',
				person: 'Петров А.Д.',
				starts: '10:00',
				ends: '11:30',
				date: '2012-09-29'
			}, {
				title: 'Кроссдоменная передача данных',
				person: 'Джейсон П.',
				starts: '19:00',
				ends: '20:00',
				date: '2012-09-16'
			}, {
				title: 'Новые технологии HTML5',
				person: 'Шестой И.Е.',
				starts: '20:00',
				ends: '21:00',
				date: '2012-09-16'
			}
		];

		ui.init(factory.create(data).data);
		
	});
});
