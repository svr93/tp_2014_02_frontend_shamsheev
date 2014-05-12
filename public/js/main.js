require.config({
	urlArgs: "_=" + (new Date().getTime()),
	baseUrl: 'js',
	
	paths: {
		jquery : 'lib/jquery',
		underscore : 'lib/underscore',
		backbone : 'lib/backbone',
		classy : 'lib/classy',
		Connector: 'lib/Connector',
		FnQuery: 'lib/FnQuery',
		"socket.io" : "lib/socket.io"
	},

	shim: {
		'backbone': {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'classy' : {
			exports: 'Class'
		},
		"socket.io" : {
			exports: "io"
		}
	}
});

define(['router'], function(router) {
	Backbone.history.start();
});