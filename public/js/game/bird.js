define(['classy'], function(Class) {
	
	var Bird = Class.$extend({
		__init__ : function() {
			this.picture = new Image();
			this.picture.src = 'images/robin_reversed.png';
			this.xSize = 240;
			this.ySize = 315;
			this.xIndex = 0;
			this.yIndex = 3;
			this.frequency = 15;
			this.i = 0;
			
			this.yHeight = Math.random() * 540;
			this.xCoord = -50;
			this.divSize = 75;

			this.speed = Math.random() * 3 + 2;
		},

		render : function(context) {
			var x = this.xIndex * this.xSize;
			var y = this.yIndex * this.ySize;

			context.drawImage(this.picture, x, y, this.xSize, this.ySize, 
				this.xCoord, this.yHeight, this.divSize, this.divSize);
			
			this.i += 1;
			this.xCoord += this.speed;

			if (this.i == this.frequency) {
				this.i = 0;
				if (this.xIndex == 4) {
					this.xIndex = 0;
					if (this.yIndex == 0) {
						this.yIndex = 3;
					} else {
						this.yIndex -= 1;
					}
				} else {
					this.xIndex += 1;	
				}
			} 
		}
	});

	return Bird;
});