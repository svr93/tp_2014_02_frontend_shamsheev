define(['classy', 'backbone', 'Connector'], 
	function(Class, Backbone, Connector) {

	function Joystick() {
		$.extend(Joystick.prototype, Backbone.Events, {
			getToken: function() {
				var $token = $("#current-token");
				this.server = new Connector({
					server: ['getToken', 'bind'],
					remote: '/console'
				});
				
				this.server.on('player-joined', function(data) {
					start(data.guid);
				});

				var self = this;
				reconnect = function() {
					self.server.bind({guid: localStorage.getItem('consoleguid')}, function(data) {
						if (data.status == 'success') {
							start(data.guid);
						} else if (data.status == 'undefined guid'){
							localStorage.removeItem('consoleguid');
							init();
						}
					});
				};

				init = function() {
					$token.html("ready");
					if (!localStorage.getItem('consoleguid')) {
						self.server.getToken(function(token) {
							$token.html('token: ' + token);
						});
					} else {
						reconnect();
					}
				};

				init();

				this.server.on('reconnect', reconnect);
				start = function(guid) {
					localStorage.setItem('consoleguid', guid);
					$token.html("");
				};

				this.server.on('touchend', function(data, answer) {
					if (data.data > self.windowWidth / 4 && data.data < self.windowWidth * 3 / 4) {
						if (data.button == "start")
							self.trigger("clickButton", this);
						else if (data.button == "stop")
							self.trigger("stop", this);
						else if (data.button == "resume")
							self.trigger("resume", this);
					}
				});

				this.server.on('window', function(data, answer) {
					self.windowHeight = data.data.height;
					self.windowWidth = data.data.width;
				});				

				this.x = 0;
				this.yUp = 0;
				this.yDown = 0;
				this.angleLeft = 0;
				this.angleRight = 0;
				this.leftTouchTimer = null;
				this.rightTouchTimer = null;
				window.server = this.server;	
			},

			start: function() {
				var self = this;
				
				this.server.on('touchstart', function(data, answer) {
					if (data.button == "stop" && data.data < self.windowWidth / 4) {
						self.leftTouchTimer = setInterval(function() {
							self.angleRight += 1;
						}, 1);
					};

					if (data.button == "stop" && data.data > self.windowWidth * 3 / 4)
						self.rightTouchTimer = setInterval(function() {
							self.angleLeft += 1;
						}, 1);
				});

				this.server.on('touchend', function(data, answer) {
					if (data.button == "stop" && data.data < self.windowWidth / 4) {
						clearInterval(self.leftTouchTimer);
					};
					if (data.button == "stop" && data.data > self.windowWidth * 3 / 4) {
						clearInterval(self.rightTouchTimer);
					}
				});

				this.server.on('deviceorientation', function(data, answer) {
					if (data.button == "stop") {
						self.x += data.data.beta;
						if (data.data.gamma < 10)
							self.yUp++;
						else
							self.yDown++;
					}
				});
			},

			finish: function(score) {
				this.stop();
				this.server.send({
					'type' : 'finish',
					'data' : score
				}, function(answer) {
 					/* void */
				});
			},

			stop: function() {
				this.server.off('touchstart');
				this.server.off('deviceorientation');
				clearInterval(this.leftTouchTimer);
				clearInterval(this.rightTouchTimer);
			},

			moveRight : function() {
				var value = 0;
				return value;
			},

			moveLeft : function() {
				var value = this.x;
				this.x = 0;
				return value;
			},

			rotateRight : function() {
				var value = this.angleRight;
				this.angleRight = 0;
				return value;
			},

			rotateLeft : function() {
				var value = this.angleLeft;
				this.angleLeft = 0;
				return value;
			},

			impulseUp : function() {
				var value = this.yUp;
				this.yUp = 0;
				return value;
			},

			impulseDown : function() {
				var value = this.yDown;
				this.yDown = 0;
				return value;
			}
		});
	};

	var Layout = Class.$extend({
		__init__ : function() {
			this.key = []; //array of keys
			this.keypress = []; //array of timers for keys
			
			this.key[65] = 0; //a
			this.key[68] = 0; //d
			this.key[87] = 0; //w
			this.key[83] = 0; //s
			this.key[38] = 0; //key up
			this.key[40] = 0; //key down
		},

		start : function() {
			var self = this;
			$(document).bind("keydown", function(event) {
				if (self.keypress[event.keyCode] == null) {
					self.keypress[event.keyCode] = setInterval(function() {
						self.key[event.keyCode] += 1;
					}, 1);
				}
			});

			$(document).bind("keyup", function(event) {
				clearInterval(self.keypress[event.keyCode]);
				self.keypress[event.keyCode] = null;
			});
		},
		
		finish: function(score) {
			this.stop();
		},

		stop : function() {
			this.keypress.forEach(function(timer) {
				clearInterval(timer);
				timer = null;
			});

			this.key.forEach(function(k) {
				k = 0;
			})
		},

		moveRight : function() {
			var value = this.key[68];
			this.key[68] = 0;
			return value;
		},

		moveLeft : function() {
			var value = this.key[65];
			this.key[65] = 0;
			return value;
		},

		rotateRight : function() {
			var value = this.key[38];
			this.key[38] = 0;
			return value;
		},

		rotateLeft : function() {
			var value = this.key[40];
			this.key[40] = 0;
			return value;
		},

		impulseUp : function() {
			var value = this.key[87];
			this.key[87] = 0;
			return value;
		},

		impulseDown : function() {
			var value = this.key[83];
			this.key[83] = 0;
			return value;
		}
	});
	
	function Controller(type) {
		if (type == 'layout') {
			return Layout;
		} else if (type == 'joystick') {
			return Joystick;
		}
	}

	return Controller;
});