define(['backbone', 'tmpl/scoreboard', 'tmpl/indicator', 'collections/players'], 
	function(Backbone, scoreboardTmpl, indicatorTmpl, top_players) {
		
	var View = Backbone.View.extend({
		root : $("#page"),

		initialize : function() {
			$(this.root).append(this.el);
			this.render();

			var self = this;
			this.listenTo(top_players, "load", function(xhr, percent) {
				if (xhr.readyState == 4 && xhr.status != 200) {
					if (confirm("Oops! The error while the page being downloaded! Refresh?")) {
						location.reload();
					}
				}
				$("#download").html(indicatorTmpl({percent : percent + "%"}));
			});
		},

		render : function() {
			var gameName = 'Windsurfing';
			this.$el.html(scoreboardTmpl({
				name : gameName,
				topresults : top_players.toJSON(),
			}));
		},

		show : function() {
			this.trigger("show", this);
			this.$el.show();
			
			var allResponseLength = 0;
			var view = this;
			top_players.fetch({
				success: function() {
					view.render();
				}, 
				error: function() {
					view.render();
				},
				url: '/scores/?limit=10'
			});
		},

		hide : function() {
			this.$el.hide();
		}
	});

	return new View();
});
