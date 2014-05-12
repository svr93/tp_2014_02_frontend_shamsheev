define([
'backbone',
'router',
],
function (Backbone, router) {
	var ViewManager = Backbone.View.extend({
		views : [],

		addView : function(curView) {
			this.views.push(curView);
			this.listenTo(curView, "show", function() {
				this.views.forEach(function(view) {
					if (view.cid != curView.cid) view.hide();
				});
			});
		}
	});

	return new ViewManager();
});