define(['backbone', 'models/player'], function(Backbone, player) {

	function tryToSave(res) {
		var model = new player({
			"name" : JSON.parse(localStorage[res]).name,
			"score" : JSON.parse(localStorage[res]).score
		});

		model.isLocal = true;
		model.save("newMax",100, { //WTF??????!!!!!!!
			error : function() {
				
			},
			success : function() {
				localStorage.removeItem(res);
			}
		})
	}

	//TODO async fo model.save
	function checkLocalStorage() {
		for (res in localStorage)
			tryToSave(res);
	} 

	var Collection = Backbone.Collection.extend({
		model : player,
		url : '/scores',
		allResponseLength : 0,
		
		comparator : function(player) {
			return -player.get('score');
		},
		
		//TODO test indicator
		sync : function(method, model, options) {
			checkLocalStorage();
			var self = this;
			options.xhr = function() {
				var xmlhttp = $.ajaxSettings.xhr();
				xmlhttp.onreadystatechange = function() {
					var percent = (self.allResponseLength != 0) ? 
						Math.round(this.response.length * 1000 / self.allResponseLength) / 10 : 0;
					self.trigger("load", this, percent);
				} 
				xmlhttp.onprogress = function(response) {
					self.allResponseLength = response.totalSize;
				}
				return xmlhttp;
			}	
			return Backbone.sync(method, model, options);
		}
	});

	return new Collection();
})