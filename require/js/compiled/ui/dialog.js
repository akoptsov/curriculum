define(function(require, exports, model){
	var $ = require('jquery');
	var forms = require('./forms');
	var events = require('js/events');
	var templates = require('js/templates');
	
	require('jquery-ui.ru');
	
	var change;
	var textdata;
	var onready = templates.ready.success;
	
	function _formDialog(html, dlgOpts, formOpts){
		var defaults = {
			autoOpen: false,
			modal: true,
			resizable: false,
			width: 'auto',
			maxWidth: 600,
			dialogClass: 'b-dialog'
		};
		
		var res = {};
		res.dlg = $(html).dialog($.extend(true, defaults, dlgOpts));
		res.form = new forms.Form(res.dlg, formOpts);
		return res;
	}
	
	
	function _int(str) {
		return parseInt(str.replace(/^0/, ''));
	}
	
	$.widget('ui.timespinner', $.ui.spinner, {
		options: {
			min: 0,
			max: 24*60 - 1,
			step: 1,
			page: 60
		},
		_parse: function(value){
			if(typeof value === 'string'){
				var res = /^\s*([0-2]\d):([0-5]\d)\s*$/.exec(value);
				if(res) {
					var hh = this._int(res[1]), 
						mm = this._int(res[2]);
						
					if(!isNaN(hh) && !isNaN(mm)){
						return hh * 60 + mm;
					}
				}
			} else if(typeof value === 'number') {
				return value;
			}
		},
		_format: function(value){
			return this._topzero(~~(value / 60)) + ':' + this._topzero(value % 60);
		},
		_topzero: function(n){
			return (n < 10 ? '0' : '') + n;
		},
		_int: _int
	});
	
		
	var url = /^\s*(?:https?|ftp):\/\/.+/;
	function _isUrl(){
		var value = this.get();
		if(!value) {
			return []; //необязательное поле
		}
		
		var exec = url.exec(value);
		if(!(exec && exec.length)){
			return [new forms.Error('format', this.name, '[http|https|ftp]://...')];
		}
		
		return [];
	}
	
	function _trim () {
		return $.trim(this.element.val());
	}
	
	function _isTime(){
		var e = /^\s*([0-2]\d):([0-5]\d)\s*$/.exec(this.get());
		if(!e) {
			return [new forms.Error('format', this.name, 'hh:mm')];
		}
		return [];
	}
	
	var fields = {
		date: {
			required: true,
			init: function() { 
				this.element.datepicker({
					showButtonPanel: true,
					showOn: 'button',
					dateFormat: 'yy-mm-dd'
				});
			}
		},
		start: {
			required: true,
			init: function(){
				this.element.timespinner();
			},
			validate: _isTime
		},
		end: {
			required: true,
			init: function(){
				this.element.timespinner();
			},
			validate: _isTime
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


	var INVALID_CLASS = 'b-form__field_state_invalid',
		ERR_MSG_CLASS = '.b-form__field-error-message';
		
	function finish(dialog, next) {
		var form = dialog.form,
			errors = form.validate();
		if(errors.length){
			$.each(errors, function(i, error){
				var element = form.fields[error.name].element,
					parent = element.closest('.b-form__field');
				
				parent
					.addClass(INVALID_CLASS)
					.find(ERR_MSG_CLASS).text(error.message);
				element.one('focus', function(e){
					parent
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