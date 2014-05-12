define(['classy'], function(Class) {

	var Wind = Class.$extend({
		__init__ : function() { //Image arrow
			this.strength = 0;
			this.direction = 0;
		},

		update : function() {
			this.strength = Math.random() * 5;
			this.direction += Math.random() * 10 - 5;
		}
	});

	return Wind;
});