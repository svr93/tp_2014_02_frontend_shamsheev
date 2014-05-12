define(['backbone'], function(Backbone) {

	var View = Backbone.View.extend({
		root : $("#page"),
		
		initialize : function() {
			$(this.root).append(this.el);
			this.render();
		},

		render : function() {
			this.$el.load('notfound.html');
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
