define(function(require, exports, module){
	function Event(){
		var _handlers = [];
		
		this.subscribe = function(f) {
			typeof f === 'function' && _handlers.push(f);
		}
		
		this.unsubscribe = function(f) {
			if(typeof f !== 'function')
				return;
				
			var index = -1;
			for(var i = 0, l = _handlers.length; i < l; i++){
				if(_handlers[i]===f){
					index = i;
					break;
				}
			}
			index > -1 && _handlers.splice(index, 1);
		}
		
		this.emit = function() {
			for(var i=0, l = _handlers.length; i < l; i++){
				_handlers[i].apply(this, Array.prototype.slice.call(arguments, 0, arguments.length));
			}
		}
	};
	
	var _events = {};
	exports.emit = function(name) {
		_events[name] && _events[name].emit();
	};
	
	exports.on = function(name, f) {
		_events[name] = _events[name] || new Event();
		_events[name].subscribe(f);
	};
	
	exports.off = function(name, f) {
		_events[name] && _events[name].unsubscribe(f);
	};
	
});