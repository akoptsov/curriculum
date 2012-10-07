define(function(require, exports, module){
	var $ = require('jquery'),
		bus = require('js/event-bus'),
		storage = require('js/storage');
	
	$(function(){
		bus.on('click', function(){
			alert('clicked!');
		});
		
		$('body').click(function(){
			bus.emit('click');
		});
		
		if(storage.supported){
			console.log('localStorage is supported');
			var a = {
				'foo': 'bar',
				'wee': new Date()
			}
			storage.set('my-key', a);
			console.log('Storage has "my-key": ', storage.has('my-key'));
			console.log('Storage[my-key]: ', storage.get('my-key'));
			console.log('Storage[other-key]: ', storage.get('other-key'));
			storage.remove('my-key');
			storage.remove('some-other-key')
		}
	});
});
