exports.index = function(req, res) {
	res.render('index', {
		title: 'Windsurfing',
		development: ('production' != process.env.NODE_ENV)
	});
};

exports.joystick = function(req, res) {
	res.render('joystick', {
		title: 'Windsurfing',
		development: ('production' != process.env.NODE_ENV)
	});
};

exports.console = function(req, res) {
	res.render('console', {
		title: 'Windsurfing',
		development: ('production' != process.env.NODE_ENV)
	});
};