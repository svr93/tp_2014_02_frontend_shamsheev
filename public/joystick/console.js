require.config({
	urlArgs: "_=" + (new Date().getTime()),
	baseUrl: "js",
	paths: {
		jquery: "/js/lib/jquery",
		underscore: "/js/lib/underscore",
		backbone: "/js/lib/backbone",
		Connector: "/js/lib/Connector",
		FnQuery: "/js/lib/FnQuery",
		"socket.io" : "/socket.io/socket.io"
	},

	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		"socket.io": {
			exports: "io"
		}
	}
});

define(['Connector'], function(Connector) {
	var message = document.getElementById('message');
	var start, init, reconnect;

	var server = new Connector({
		server: ['getToken', 'bind'],
		remote: '/console'
	});

	server.on('player-joined', function(data) {
		start(data.guid);
	});

	init = function() {
		message.innerHTML = 'ready';
		if (!localStorage.getItem('consoleguid')) {
			server.getToken(function(token) {
				message.innerHTML = 'token: ' + token;
			});
		} else {
			reconnect();
		}
	};

	reconnect = function() {
		server.bind({guid: localStorage.getItem('consoleguid')}, function(data) {
			if (data.status == 'success') {
				start(data.guid);
			} else if (data.status == 'undefined guid'){
				localStorage.removeItem('consoleguid');
				init();
			}
		});
	};

	server.on('reconnect', reconnect);

	start = function(guid) {
		console.log('start console');
		localStorage.setItem('consoleguid', guid);
		message.innerHTML = 'game';
	};

	init();

	server.on('message', function(data, answer) {
		console.log('message', data);
		answer('answer');
	});

	window.server = server;

	/*
	server.send('message', function(answer) {
		console.log(answer);
	});
*/
});