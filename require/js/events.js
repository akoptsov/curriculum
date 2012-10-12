define(function(require, exports, module){
	function Event(){
		var _handlers = [];
		
		this.subscribe = function(f) {
			typeof f === 'function' && _handlers.push(f);
		};
		
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
		};
		
		this.emit = function() {
			for(var i = 0, l = _handlers.length; i < l; i++){
				_handlers[i].apply(this, Array.prototype.slice.call(arguments, 0));
			}
		};
	};
	
	function Emitter() {
		var _events = {};
		
		this.emit = function(name) {
			name && _events[name] && _events[name].emit.apply(this, Array.prototype.slice.call(arguments, 1));
		};
		
		this.on = function(name, f) {
			_events[name] = _events[name] || new Event();
			_events[name].subscribe(f);
		};
		
		this.off = function(name, f) {
			_events[name] && _events[name].unsubscribe(f);
		};
	}
	
	function Promise(condition) {

		var _callbacks = [], 
			_happened = false,
			_args = [];
			
		if(typeof condition !== 'function') {
			console.error('Promise condition should be a function');
			_happened = !!condition;
			return;
		}
		
		this.check = function (){
			var args = Array.prototype.slice.call(arguments, 0);
			if(condition.apply(args)){
				_happened = true;
				_args = args;
				
				for(var i = 0, count = _callbacks.length; i < count; i++) {
					_callbacks[i].apply(this, args);
				}
			} 
		}

		this.success = function(callback){
			if(!typeof callback === 'function')
				return;
				
			_happened ? callback.apply(this, _args) : _callbacks.push(callback);
		}
		
	}
	
	exports.Event = Event;
	exports.Emitter = Emitter;
	exports.Promise = Promise;
	exports.Bus = new Emitter();
});