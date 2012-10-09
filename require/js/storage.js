define(function(require, exports, module){
	var window = require('./global'),
		json = window.JSON,
		storage = window.localStorage;
	
	function stringify(obj) {
		return typeof obj === 'string' ? obj : json.stringify(obj);
	}
	
	function parse(str) {
		return str ? json.parse(str) : str;
	}
	
	if(storage && json){
		exports.supported = true;
		
		exports.has = function (key) {
			return typeof storage.getItem(key) === 'string';
		};
		
		exports.get = function(key) {
			return parse(storage.getItem(key));
		};
		
		exports.set = function (key, value) {
			storage.setItem(key, stringify(value));
		};
		
		exports.remove = function (key) {
			storage.removeItem(key);
		}
		
	} else {
		exports.supported = false;
	}
	
});