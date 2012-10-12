define(function(require, exports, model){
	var $ = require('jquery');
	var forms = require('./forms');
	var events = require('js/events');
	
	require('handlebars');
	require('jquery-ui');
	
	var $change;
	var $view;
	var form;
	var templates = {};
	
	var ready = new events.Promise(function(){
		return templates.change && templates.view;
	});
	
	ready.success(function(){
		$change = $(templates.change()); 
		$change.dialog({
			autoOpen: false,
			modal: true,
			resizable: false,
		});
		form = new forms.Form($change, fields);
	})
	
	function addTemplate(name, template) {
		if(!Handlebars){
			console.error('Handlebars is missing from the global scope!');
		}
		templates[name] = Handlebars.compile(template);
		ready.check();
	}
	
	require(['text!templates/dialog/change.html'], function(template){
		addTemplate('change', template);
	});
	
	require(['text!templates/dialog/view.html'], function(template){
		addTemplate('view', template);
	});
	
	
	var url = /^\s*(?:https?|ftp):\/\/.+/;
	function _isUrl(){
		var value = this.get();
		if(!value) {
			return []; //необязательное поле
		}
		
		var exec = url.exec(this.get());
		if(!(exec && exec.length)){
			return [new forms.Error('format', this.name, '[http|https|ftp]://...')];
		}
		
		return [];
	}
	function _trim () {
		return $.trim(this.element.val());
	}
	
	$.datepicker.setDefaults( $.datepicker.regional[ "" ] );
	var fields = {
		date: {
			required: true,
			init: function() { 
				this.element.datepicker($.extend(true,{}, $.datepicker.regional['ru'], {
					showButtonPanel: true,
					showOn: 'button',
					dateFormat: 'yy-mm-dd'
				}));
			}
		},
		start: {
			required: true
		},
		end: {
			required: true
		},
		title: {
			required: true,
			get: _trim
		},
		person: {
			required: true,
			get: _trim
		},
		points: {
			get: _trim
		},
		presentation: {
			get: _trim,
			validate: _isUrl
		},
		video: {
			get: _trim,
			validate: _isUrl
		}
	};
		

		INVALID_CLASS = 'b-form__field_state_invalid',
		ERR_MSG_CLASS = '.b-form__field-error-message';
		
	function finish(next) {
		var errors = form.validate();
		if(errors.length){
			$.each(errors, function(i, error){
				var element = form.fields[error.name].element
				element.parent()
					.addClass(INVALID_CLASS)
					.find(ERR_MSG_CLASS).text(error.message);
				element.one('focus', function(e){
					element.parent()
						.removeClass(INVALID_CLASS)
						.find(ERR_MSG_CLASS).text('');
				});
			});
		} else {
			$.isFunction(next) && next(form.get());
			$change.dialog('close');
		}
	}
	
	function close(next) {
		$.isFunction(next) && next();
		$change.dialog('close');
	}
	
	
	function open(data, opts){
		ready.success(function(){
			form.bind(data);
			$change.dialog('option', opts).dialog('open');
		});
	}
	
	exports.create = function(elem, data, next){
		open(data, {
			title: 'Новая лекция',
			buttons: [
				{text: 'ОК', click: function(){ finish(next); }},
				{text: 'Отмена', click: close }
			]
		});
	};
	
	exports.change = function(elem, data, next, remove){
		open(data, {
			title: 'Изменить информацию',
			buttons: [
				{text: 'ОК', click: function(){ finish(next); }},
				{text: 'Отмена', click: close },
				{text: 'Удалить', click: function() { close(remove); }}
			]
		});
	}
	
})