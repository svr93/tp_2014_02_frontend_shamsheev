define(['classy'], function(Class) {

	var SeaWave = Class.$extend({
		__init__ : function(shiftValue) {
			this.picture = new Image();
			this.picture.src = 'images/seawave.png';
			this.shift = shiftValue;
		},

		update : function() {
			this.shift = (++this.shift) % ((this.picture.width + 45) / 2);
		}
	});

	return SeaWave;
});