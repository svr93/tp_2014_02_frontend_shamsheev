var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'xml');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser("R+mP2QeS-\"WzN&<mFs]~_V6WMz X[} =<obw<G-"));
app.use(express.session({
	key: "sid",
	secret: "-b6`_$-+z4nbssRcQhxnv,EFeZvp^-_73TL>3o",
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 30 //wowwowow? 
	}
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function() {
	app.use(express.errorHandler());
	app.use(express.logger('dev'));	
	app.engine('xml', require('artist').render({
		cache: false,
		debug: true
	}));
});

app.configure('production', function() {
	app.engine('xml', require('artist').render({
		cache: false,
		debug: true
	}));
});

var scores = require('./routes/scores');
var routes = require('./routes/index');

app.get('/', routes.index);
app.get('/console', routes.console);
app.get('/joystick', routes.joystick);

app.get('/scores', scores.getFull);
app.get('/scores/:id', scores.getOne);
app.post('/scores', scores.post);
app.del('scores/:id', scores.del);
app.put('scores/:id', scores.put);

var server = http.createServer(app);
require('./server/server').init(server);
server.listen(app.get('port'), function() {
	console.log('Express server listeningon port ' + app.get('port'));
});
