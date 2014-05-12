define(['backbone', 'tmpl/game', 'game/game', 'views/gameover', 'game/playerinterface'], 
	function(Backbone, gameTmpl, Game, gameOver, playerInterface) {

	var View = Backbone.View.extend({
		$root : $("#page"),

		initialize : function() {
			this.$root.append(this.el);
			this.render();

			this.$startButton = $("#start-button");
			this.$resumeButton = $("#resume-button");
			this.$finishButton = $("#finish-button"); 
			this.$currButton = this.$startButton;

			this.$startButton.hide();
			this.$resumeButton.hide();
			this.$finishButton.hide();

			this.game = new Game(
				document.getElementById('game-field'),
				function(score) {
					self.$currButton = self.$startButton;
					gameOver.show(score);
				}
			);

			var self = this;
			$(".game__dialog__layout").click(function(e) {
				self.registerController('layout');
				$("#modal").hide();
			});
			
			$(".game__dialog__joystick").click(function(e) {
				self.registerController('joystick');
				self.getToken();
				
				self.listenTo(self.controller, "stop", function() {
					self.game.stop();
					self.$currButton.show();
				});

				self.listenTo(self.controller, "resume", function() {
					self.$currButton.click();
				});
				$("#modal").hide();
			});
		},

		registerController: function(controller) {
			var c = new playerInterface(controller);
			this.controller = new c();
			this.game.setController(this.controller);
			this.$currButton.show();
		},

		getToken: function() {
			this.controller.getToken();
			var self = this;
			this.listenTo(this.controller, "clickButton", function() {
				self.$currButton.click();
			});
		},

		render : function() {
			this.$el.html(gameTmpl());
		}, 

		show : function() {
			this.$el.show();
			
			var self = this;
			this.$startButton.bind('click', function() {
				self.$currButton.hide();
				self.$currButton = self.$resumeButton;
				self.game.run();
			});

			this.$resumeButton.bind('click', function() {
				self.$currButton.hide();
				self.game.run();
			});

			this.trigger("show", this);
		},

		hide : function() {
			this.$el.hide();
			this.$currButton.hide();
			this.game.stop();
			this.$currButton.unbind('click');
		},
	});

	return new View();
});
