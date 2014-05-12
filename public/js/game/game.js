define([
	'classy', 
	'backbone',
	'game/board', 
	'game/seawave',
	'game/jump',
	'game/wind',
	'game/bird',
	], 
function(Class, Backbone, Board, SeaWave, Jump, Wind, Bird) {
	
	function birdConflict(board, bird) {
		//Rotate bird's center point back (to normalize rectanglular) 
		var unrotatedBirdX = ((bird.xCoord + bird.divSize / 2) - (board.x + board.picture.width / 2)) /
			Math.cos(Math.PI * board.angle / 180) + board.x + board.picture.width / 2;

		var unrotatedBirdY = ((bird.yHeight + bird.divSize / 2) - (board.y + board.picture.height / 2)) /
			Math.sin(Math.PI * board.angle / 180) + board.y + board.picture.height / 2;

		var closestX, closestY;

		if (unrotatedBirdX < board.x)
			closestX = board.x;
		else if (unrotatedBirdX > board.x + board.picture.width)
			closestX = board.x + board.picture.width;
		else
			closestX = unrotatedBirdX;

		if (unrotatedBirdY < board.y)
			closestY = board.y;
		else if (unrotatedBirdY > board.y + board.picture.height)
			closestY = board.y + board.picture.height;
		else
			closestY = unrotatedBirdY;

		if (Math.abs(unrotatedBirdX - closestX) < bird.divSize / 8 &&
			Math.abs(unrotatedBirdY - closestY) < bird.divSize / 8) {
			return true;
		}
		return false;
	}

	function checkBirdConflict(board, birds) {
		var flag = false;
		birds.forEach(function(bird) {
			if (birdConflict(board, bird)) {
				flag = true;
			}
		});
		return flag;
	}

	var Game = Class.$extend({
		__init__ : function(_canvas, callback) {
			this.canvas = _canvas;
			this.canvas.width = 768;
			this.canvas.height = 750;

			this.context = _canvas.getContext('2d');
			
			this.FPS = 60;
			this.refresh = null;
			this.isRunning = false;

			this.board = new Board();
			this.jump = new Jump();
			this.wind = new Wind();
			this.waveLow = new SeaWave(0);
			this.waveHigh = new SeaWave(50);
			
			this.birds = [];
			this.level = null;
			this.timeBirdCreate = 3000;
			
			this.score = 0;
			this.callback = callback;
		},

		setController : function(controller) {
			this.controller = controller;
		},

		createBird : function(time) {
			if (!this.isRunning)
				return;

			var self = this;
			setTimeout(function() {
				self.birds.push(new Bird());
				self.createBird(Math.random() * self.timeBirdCreate);
			}, time);
		},

		run : function() {
			this.isRunning = true;
			this.controller.start();

			var self = this;
			this.refresh = setInterval(function() {
				self.update();
				self.render();
			}, 1000 / this.FPS);

			this.level = setInterval(function() {
				self.timeBirdCreate *= 0.9;
			}, 5000);

			this.createBird(0);
		},

		update : function() {
			if (!this.jump.isActive()) {
				this.board.angle -= this.controller.rotateRight();
				this.board.angle += this.controller.rotateLeft();
			} else {
				this.jump.fly(this.board);
				this.jump.impulse(this.controller.impulseUp(), this.controller.impulseDown());
			}

			this.board.x -= this.controller.moveLeft();
			this.board.x += this.controller.moveRight();	
			this.board.gravity();
			this.wind.update();
			this.board.blow(this.wind);

			this.waveLow.update();
			this.waveHigh.update();

			//CHECK COLLISION BOARD AND SCREEN BORDERS
			if (this.board.x + this.board.picture.width / 2 < 0 || 
				this.board.x + this.board.picture.width / 2 > this.canvas.width ||
				this.board.y + this.board.picture.height < 0) {
					var score = this.score;
					this.clearOut();
					this.callback(score);
					return;
			}

			//CHECK COLLISION BOARD AND WATER
			if (this.board.y > this.canvas.height - 1.9 * this.waveHigh.picture.height) {
				if (Math.abs(this.board.angle) % 360 > 60 
					&& Math.abs(this.board.angle) % 360 < 300) {
						var score = this.score;
						this.clearOut();
						this.callback(score);
						return;
				}
				
				this.board.y = this.canvas.height - 1.9	 * this.waveHigh.picture.height;
				this.jump.start();
			}

			//CHECK COLLISION BOARD AND BIRDS
			if (checkBirdConflict(this.board, this.birds)) {
				var score = this.score;
				this.clearOut();
				this.callback(score);
				return;
			}

			//CLEAR BIRDS AFTER SCREEN BORDER
			for (var i = 0; i < this.birds.length; ++i) {
				if (this.birds[i].xCoord > this.canvas.width) {
					this.birds.splice(i, 1);
					this.score += 10;
					i -= 1;
				}
			}
		},

		render : function() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.save();
			
			this.context.translate(this.board.x + this.board.picture.width / 2,
				this.board.y + this.board.picture.height / 2);
			this.context.rotate(this.board.angle * Math.PI / 180);
			this.context.drawImage(this.board.picture, - this.board.picture.width / 2, 
				- this.board.picture.height / 2);
			
			this.context.restore();

			this.context.save();
			this.context.translate(0, this.canvas.height - 1.2 * this.waveHigh.picture.height);
			for (var i = -2; i < 15; ++i) {
				this.context.drawImage(this.waveHigh.picture, 
					this.waveHigh.picture.width * (2 * i / 3) + this.waveHigh.shift, 0);
			}
			this.context.translate(0, 0.2 * this.waveHigh.picture.height);
			for (var i = -2; i < 15; ++i) {
				this.context.drawImage(this.waveLow.picture, 
					this.waveLow.picture.width * (2 * i / 3) + this.waveLow.shift, 0);
			}
			this.context.restore();

			var self = this;
			this.birds.forEach(function(entity) {
				entity.render(self.context);
			});
			
			this.context.fillStyle = "#00F";
			this.context.font = "italic 30pt Arial";
			this.context.fillText(this.score, 50, 50);			
		}, 

		stop : function() {
			clearInterval(this.refresh);
			clearInterval(this.level);
			this.isRunning = false;
		},

		clearOut : function() {
			this.stop();
			this.controller.finish(this.score);
			this.score = 0;
			this.board.clearOut();
			this.jump.stop();
			this.birds.splice(0, this.birds.length);
			this.timeBirdCreate = 4000;
			
			this.render();
		}
	});
	
	return Game;
});
