define(function(require, exports, model){
	var $ = require('jquery');
	var forms = require('./forms');
	var events = require('js/events');
	var templates = require('js/templates');
	
	require('jquery-ui');
	
	var change;
	var textdata;
	var onready = templates.ready.success;
	
	function _formDialog(html, dlgOpts, formOpts){
		var defaults = {
			autoOpen: false,
			modal: true,
			resizable: false
		};
		
		var res = {};
		res.dlg = $(html).dialog($.extend(true, defaults, dlgOpts));
		res.form = new forms.Form(res.dlg, formOpts);
		return res;
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

	var INVALID_CLASS = 'b-form__field_state_invalid',
		ERR_MSG_CLASS = '.b-form__field-error-message';
		
	function finish(dialog, next) {
		var form = dialog.form,
			errors = form.validate();
		if(errors.length){
			$.each(errors, function(i, error){
				var element = form.fields[error.name].element;
				
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
			dialog.dlg.dialog('close');
		}
	}
	
	function close(next) {
		$.isFunction(next) && next();
		$(this).dialog('close');
	}

	function open(dialog, data, opts){
		onready(function(){
			dialog.form.bind(data);
			dialog.dlg.dialog('option', opts).dialog('open');
		});
	}
	
	onready(function(){
		change =  _formDialog(templates['dialog-change'](), {}, fields);
		textdata =  _formDialog(templates['dialog-textdata'](), {resizable: true, width: 'auto', maxWidth: 1000}, { data: {} });
	});
	
	exports.create = function(elem, data, next){
		open(change, data, {
			title: 'Новая лекция',
			buttons: [
				{text: 'ОК', click: function(){ finish(change, next); }},
				{text: 'Отмена', click: close }
			]
		});
	};
	
	exports.change = function(elem, data, next, remove){
		open(change, data, {
			title: 'Изменить информацию',
			buttons: [
				{text: 'ОК', click: function(){ finish(change, next); }},
				{text: 'Отмена', click: close },
				{text: 'Удалить', click: function() { close.call(this, remove); }}
			]
		});
	}
	
	exports.getJSON = function(next){
		open(textdata, { }, {
			title: 'Создать из JSON',
			buttons: [
				{text: 'ОК', click: function() { finish(textdata, next); }},
				{text: 'Отмена', click: close },
			]
		});
	};
	
	exports.provideJSON = function(text){
		open(textdata, {data: text}, {
			title: 'Расписание в формате JSON',
			buttons: [
				{text: 'ОК', click: close}
			]
		});
	};
	
})