define(['backbone'], function(Backbone) {

	//CHECK 1 time!
	function supportsLocalStorage() {
		try {
			return 'localStorage' in window && window['localStorage'] 
				!== null;
		} catch (e) {
			return false;
		}
	}

	function saveToLocalStorage(data) {
		if (!supportsLocalStorage())
			alert("Server error! localStorage is not supported!")
		console.log(localStorage);
		localStorage[localStorage.length] = data;
	}

	var Model = Backbone.Model.extend({
		defaults: {
			name : '',
			score : 0
		},
		url : '/scores',
		isLocal : false, //bad, I think

		sync: function(method, model, options) {
			if (this.isLocal)
				return Backbone.sync(method, model, options);

			var model = this;
			options.xhr = function() {
				var xmlhttp = $.ajaxSettings.xhr();
				xmlhttp.onerror = function() {
					saveToLocalStorage(JSON.stringify(model));
				}
				xmlhttp.ontimeout = function() {
					saveToLocalStorage(JSON.stringify(model));
				}
				return xmlhttp;
			}
			return Backbone.sync(method, model, options);
		} 
	});

	return Model;
});