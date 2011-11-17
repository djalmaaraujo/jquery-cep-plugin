/*
 *  Project: jQuery CEP Plugin
 *  Description: Return informations about an Brazilian CEP (postal code)
 *  Author: Djalma Araújo
 *  License: MIT License
 */
;(function ( $, window, document, undefined ) {
	
    // Create the defaults once
    var pluginName = 'jCep',
        defaults = {
            gateway: "http://apps.pianolab.com.br/wscep/",
			json_template: {
				result: 'resultado',
				result_message: 'resultado_txt',
				state: 'uf',
				city: 'cidade',
				neighborhood: 'bairro',
				street_type: 'tipo_logradouro',
				street: 'logradouro'
			},
			callback: '.jcep-target', // .jcep-target, callback function() {}
			request: {
				cep: null,
				format: 'javascript', // javascript, (xml, query_string soon)
			}
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    };

    Plugin.prototype.init = function () {
        this.hdlrInputWatch();
    };
	
	// Handlers
	Plugin.prototype.hdlrInputWatch = function () {
		var _i = this;
		var self = $(_i.element);
		
		switch (_i.element.localName) {
			case 'input':
				if (_i.element.type == 'text') { // supports only text input
					self.keyup(function (event) {
						if ((event.keyCode == 189) || ((event.keyCode >= 48) && (event.keyCode <= 57)) || ((event.keyCode >= 96) && (event.keyCode <= 105))) { // Only numbers and -
							var cep = $(this).val();
							if (_i.validateCep(cep)) _i.makeRequest(cep);
						}
					});
				}
				break;
				
			case 'select':
				if (_i.element.type == 'select-one') { // supports only non-multiple selects
					self.change(function () {
						var cep = $(this).val();
						if (_i.validateCep(cep)) _i.makeRequest(cep);
					});
				}
				break;
		}
	};
	
	// Make Server Request
	Plugin.prototype.makeRequest = function (cep) {
		var _i = this;
		_i.options.request.cep = cep;
		
		$.getScript(_i.options.gateway + '?cep=' + cep + '&format=' + _i.options.request.format, function(data, textStatus) {
			if (textStatus == 'success') _i.parseCallBack(resultadoCEP);
		}, 'JSON');
	};
	
	// ParseCallback
	Plugin.prototype.parseCallBack = function (data) {
		this.options.request.result = data;
		
		var _opts = this.options;
		var callBack = _opts.callback;
		var parsedResponse = this.jsonTemplateParser(_opts.request.result);
		
		if (!$.isPlainObject(callBack.prototype)) {
			this.outPutHtmlTemplate(parsedResponse);
		} else {
			callBack(parsedResponse);
		}
	};
	
	// ParseTemplate recreating flexible web service
	Plugin.prototype.jsonTemplateParser = function (data) {
		var template = this.options.json_template;
		var parsed = {};
		
		$.each(template, function(index, value) {
			parsed[index] = data[value];
		});
		
		return parsed;
	};
	
	Plugin.prototype.outPutHtmlTemplate = function (data) {
		var _i = this;
		var target = _i.options.callback;
		var html = $(target).addClass('jcep-container');
					
		$.each(_i.options.json_template, function(index, value) {
			html.append($('<div />').addClass('jcep-' + index).text(data[index]));
		});
	};
	
	// CEP Validation
	Plugin.prototype.validateCep = function (cep) {
		var pattern = /^\d{5}-\d{3}$|^\d{8}$/;
		return (cep.match(pattern)) ? true : false;
	};
	
	// Multiple Instance handler
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
			
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

})(jQuery, window, document);