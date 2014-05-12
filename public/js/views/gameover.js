define(['backbone', 'tmpl/gameover','game/gameover'], 
	function(Backbone, gameOverTmpl, gameOverHandler) {

		var View = Backbone.View.extend({
			$root : $("#page"),
			
			initialize : function() {
				this.$root.append(this.el);
			},

			render : function(score) {
				this.$el.html(gameOverTmpl({
					score : score
				}));
			},

			show : function(score) {
				this.render(score);
				$(".gameover__form").submit(function(event) {
					event.preventDefault();
					gameOverHandler.handle(this, event);
				});

				this.$el.show();
				this.trigger("show", this);
			},

			hide : function() {
				this.$el.hide();
			}
		});

		return new View();
	}
);