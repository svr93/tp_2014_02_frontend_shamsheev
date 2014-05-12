define(['classy'], function(Class){
	var DEFAULT_HEIGHT = 310;
	var DEFAULT_ROTATE = 300;

	var Jump = Class.$extend({
		__init__ : function() {
			this.impulseHeight = DEFAULT_HEIGHT;
			this.impulseRotate = DEFAULT_ROTATE;
			this.active = false;
		},

		fly : function(board) { //TODO add wind
			board.y -= this.impulseHeight / 10;
			board.angle -= this.impulseRotate / 10;
			
			this.impulseHeight -= 10;
			this.impulseRotate -= 5;

			if (this.impulseHeight < 0) {
				this.active = false;
			}
		},

		impulse : function(up, down) {
			if (up == 0 && down == 0)
				return;

			var value = 3;
			if (up < down)
				this.impulseHeight -= value;
			else
				this.impulseHeight += value;
			
			console.log(this.impulseHeight);
			this.impulseRotate += value;
		},

		isActive : function() {
			return this.active;
		},

		start : function() {
			this.impulseHeight = DEFAULT_HEIGHT;
			this.impulseRotate = DEFAULT_ROTATE;
			this.active = true;
		},

		stop : function() {
			this.active = false;
		}
	});

	return Jump;
});