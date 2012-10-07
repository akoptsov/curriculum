define(function(require, exports, module){
	var $ = require('jquery'),
		bus = require('js/event-bus'),
		storage = require('js/storage'),
		global = require('js/global');
	
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
	});
});
