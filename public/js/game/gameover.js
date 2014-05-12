define(['classy', 'models/player', 'collections/players'], 
	function(Class, Player, Players) {

	var Handler = Class.$extend({
		__init__ : function() {
			/* void */
		},

		handle : function(form, event) {
			var data = $(form).serializeArray();
			Players.create(
				new Player({
					name : data[0].value, 
					score : data[1].value
				}), {
				//wait: true, - server error => only then save to collection 
			});
			window.location = "#scoreboard";			
		},
	});

	return new Handler();
});