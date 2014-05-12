require.config({
	urlArgs: "_=" + (new Date().getTime()),
	baseUrl: "js",
	paths: {
		jquery: "lib/jquery",
		underscore: "lib/underscore",
		backbone: "lib/backbone",
		Connector: "lib/Connector",
		FnQuery: "lib/FnQuery",
		"socket.io" : "lib/socket.io"
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
	var $message = $("#message");
	var $input = $("#token-form");
	var $token = $("#token");
	var start, init, reconnect;

	var width = $(window).width();
	var height = $(window).height();

	var server = new Connector({
		server: ['bind'],
		remote: '/joystick'
	});

/*	function getOrientation() {
		return window.getOrientation % 180 === 0 ? 'portrait' : 'landscape';
	}
*/
	var x = 0;
	var y = 0;

	function handleDeviceOrientation(event) {
		x = event.beta; //[-180; 180]
		y = event.gamma; //[-90; 90]
	};

	function sendDeviceOrientationData() {
		var type = "deviceorientation";
		server.send({
			'type' : type,
			'data' : {
				'beta' : x,
				'gamma' : y
			},
			'button' : buttonValue			
		});			
	}

	
	var buttonValue = "start";
	$button = $("#main-button");
	$button.html("Start game");
	$button.hide();
	
	var timerData = null;	
	var touchList = [];

	function toggleButton() {
		if (buttonValue == 'resume') {
			buttonValue = 'stop';
			$button.html("Stop game");
			timerData = setInterval(sendDeviceOrientationData, 100);
			return;
		}

		if (buttonValue == 'start') {
			buttonValue = 'stop';
			$button.html("Stop game");
			timerData = setInterval(sendDeviceOrientationData, 100);
			return;
		}

		if (buttonValue == 'stop') {
			buttonValue = 'resume';
			$button.html("Resume game");
			clearInterval(timerData);		
			return;
		}
	};

	function handleTouchStart(event) {
		server.send({
			'type' : event.type,
			'data' : event.pageX,
			'button' : buttonValue
		});			
	};

	function handleTouchEnd(event) {
		server.send({
			'type' : event.type,
			'data' : lastMove.targetTouches[0].pageX,
			'button' : buttonValue
		});

		if (lastMove.targetTouches[0].pageX > width / 4 && 
			lastMove.targetTouches[0].pageX < width * 3 / 4)
		{
			toggleButton();
		};			
	};

	sendWindow = function() {
		server.send({
			'type' : 'window',
			'data' : {
				'width' : width,
				'height' : height
			}
		});
	};

	init = function() {
		$message.html('ready');
		if (!localStorage.getItem('playerguid')) {
			$input.submit(function(e) {
				e.preventDefault();
				var form = $input.serializeArray();
				server.bind({token: form[0].value}, function(data) {
					if (data.status == 'success') {
						start(data.guid);
						sendWindow();
						$input.hide();
						$button.show();
					} else {
						$message.html('failure');
					}
				});
			});
		} else {
			reconnect();
		}
	};

	reconnect = function() {
		server.bind({guid: localStorage.getItem('playerguid')}, function(data) {
			if (data.status == 'success') {
				start(data.guid);
			} else if (data.status == 'undefined guid'){
				localStorage.removeItem('playerguid');
				init();
			}
		});
	};

	start = function(guid) {
		$message.html("");
		window.addEventListener('touchstart', handleTouchStart);
		window.addEventListener('touchend', handleTouchEnd);
		window.addEventListener('deviceorientation', handleDeviceOrientation);
		localStorage.setItem('consoleguid', guid);
	};

	server.on('reconnect', reconnect);

	init();

	server.on('finish', function(data, answer) {
		$button.html("Start game");
		buttonValue = "start";
		clearInterval(timerData);
		//$message.html(data.data);
		//$message.show();
	});

	window.server = server;
});