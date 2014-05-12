define([
	'backbone', 
	'views/game', 
	'views/scoreboard', 
	'views/main', 
	'views/notfound',
	'views/gameover',
	'views/viewmanager'
	], 
	function(Backbone, 
		gameView, 
		scoreboardView, 
		mainView, 
		notfoundView,
		gameoverView,
		viewManager)
 {
 	var args = arguments;

	var Router = Backbone.Router.extend({
		routes: {
			'game' : 'gameAction',
			'scoreboard' : 'scoreboardAction',
			'' : 'mainAction',
			'*default' : 'defaultAction'
		},

		initialize : function() {
			viewManager.addView(gameView);
			viewManager.addView(scoreboardView);
			viewManager.addView(mainView);
			viewManager.addView(notfoundView);
			viewManager.addView(gameoverView);
		},

		gameAction : function() {
			gameView.show();
		},

		scoreboardAction : function() {
			scoreboardView.show();
		},

		mainAction : function() {
			mainView.show();
		},

		defaultAction : function() {
			notfoundView.show();
		},
	});

	return new Router();
})