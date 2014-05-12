define(['classy'], function(Class) {

	var Board = Class.$extend({
		__init__ : function() {
			this.picture = new Image();
			this.picture.src = 'images/player.png';
			this.x = 650;
			this.y = 0;
			this.angle = 0;	
		},

		gravity : function() {
			this.y += 5;
		},

		blow : function(wind) {
			this.x += Math.cos(wind.direction) * wind.strength;
			this.y += Math.sin(wind.direction) * wind.strength;
		},

		clearOut : function() {
			this.x = 650;
			this.y = 0;
			this.angle = 0;
		}
	});

	return Board;
});