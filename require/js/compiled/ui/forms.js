define(function(require, exports, module){
	$ = require('jquery');
	
	function Error(code, name) {
		var messages = {
			required : function() {
				return 'Поле является обязательным';
			},
			format : function(format) {
				return 'Формат для поля : ' + format;
			},
			'default': function(message) {
				return message;
			}
		};
		return {
			name: name, 
			message: messages[messages[code] ? code: 'default'].apply(this, Array.prototype.slice.call(arguments, 2))
		};
	}

	function Form(container, fieldOpts, validate){
		this.container = container;
		var fields = {},
			self = this;
			
		$.each(fieldOpts, function(name, opts){
			var field = new Field(self, name, opts);
			field.element.length && (fields[name] = field);
		});
		
		if(typeof validate === 'function'){
			this.validate = function(){
				return Form.prototype.validate.call(this).concat(validate.call(this));
			}
		}
		
		self.fields = fields;
	};

	Form.prototype.get = function() {
		var data = {};
		$.each(this.fields, function(name, field){
			data[name] = field.get();
		});
		return data;
	};
	
	Form.prototype.bind = function(data){
		var self = this;

		$.each(this.fields, function(name, field){
			field.set('');
		});

		if(data && typeof data === 'object') {
			$.each(data, function(name, value) {
				self.fields[name] && self.fields[name].set(data[name]);
			});
		}
	};

	Form.prototype.validate = function() {
		var errors = [];
		$.each(this.fields, function(name, field){
			errors = errors.concat(field.validate());
		});
		return errors;
	};

	function Field(form, name, opts){
		this.name = name;
		this.element = form.container.find('[name=' + name + ']');
		if(!opts && !this.element) {
			return;
		}
		
		opts.required && (this.required = true);
		
		if($.isFunction(opts.init)) {
			opts.init.call(this);
		}
		
		$.isFunction(opts.get) && (this.get = opts.get);
		$.isFunction(opts.set) && (this.set = opts.set);
		
		if($.isFunction(opts.validate)){
			this.validate = function() {
				return Field.prototype.validate.call(this).concat(opts.validate.call(this));
			};
		}
	}
	
	Field.prototype.get = function() {
		return this.element.val();
	};

	Field.prototype.set = function(value) {
		this.element.val(value);
	};

	Field.prototype.validate = function() {
		if(this.required && !this.get()) {
			return [new Error('required', this.name)];
		}
		return [];
	}
	
	exports.Form = Form;
	exports.Error = Error;
});