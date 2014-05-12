define(['backbone', 'tmpl/main'], function(Backbone, mainTmpl) {

	var View = Backbone.View.extend( {
		root: $("#page"),

		initialize : function() {
			//_bindAll(this, 'render', 'hide', 'show');
			$(this.root).append(this.el);
			this.render();
		},

		render : function() {
			var gameName = 'Windsurfing';
			this.$el.html(mainTmpl({name : gameName}));
		}, 

		show : function() {
			this.$el.show();
			this.trigger("show", this);
		},

		hide : function() {
			this.$el.hide();
		}
	});

	return new View();
});
