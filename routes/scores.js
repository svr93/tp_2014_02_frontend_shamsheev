var scores = [];
var id = 0;

function sortScores() {
	scores.sort(function(a,b) {
		return parseInt(a.score, 10) < parseInt(b.score, 10);
	});
}

module.exports = {
	getFull: function(req, res) {
		console.log(scores)
		var s;
		if (req.query.limit && !isNaN(parseInt(req.query.limit, 10))) {
			s = [];
			for (var i = 0, l = scores.length, li = req.query.limit; i < l && i < li; ++i) {
				s.push(scores[i]);
			}
		} else {
			s = scores;
		}

		s = JSON.stringify(s);
		res.setHeader('Content-Type', 'application/javascript'); //200??
		res.setHeader('Content-Length', Buffer.byteLength(s));
		res.end(s);
	},

	getOne: function(req, res) {
		var founded;
		var id = req.param.id;

		if (!id || isNaN(parseInt(id, 10))) {
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		for (var i = 0, l = scores.length; i < l; ++i) {
			var score = scores[i];
			if (score.id == id) {
				founded = score;
				break;
			}
		}

		if (founded) {
			res.writeHead(200, 'OK');
			founded = JSON.stringify(founded);
			res.setHeader('Content-Type', 'application/javascript');
			res.setHeader('Content-Length', Buffer.byteLength(founded));
			res.end(founded);
		} else {
			res.writeHead(404, 'Not Found');
			res.end();
		}
	},

	post : function(req, res) {
		var newScore = req.body;
		console.log("POST " + newScore)

		if (!newScore || !newScore.name || newScore.score && isNaN(parseInt(newScore.score, 10))) {
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		newScore.id = id++;
		scores.push(newScore);
		sortScores();
		var s = JSON.stringify(newScore);
		res.setHeader('Content-Type', 'application/javascript');
		res.setHeader('Content-Length', Buffer.byteLength(s));
		res.end(s);
	},

	postFull : function(req, res) {
		var newScores = [];
		var results = req.body;
		
		results.forEach(function(res) {
			if (!res || !res.name || res.score && isNaN(parseInt(res.score, 10))) {
				res.writeHead(400, 'Bad Request');
				res.end();
				return;
			}
		});

		results.forEach(function(res) {
			res.id = id++;
			scores.push(res);
			sortScores();
		});

		var s = JSON.stringify(results);
		res.setHeader('Content-Type', 'application/javascript');
		res.setHeader('Content-Length', Buffer.byteLength(s));
		res.end(s);
	},

	del : function(req, res) {
		var i = req.params.id;
		var founded;

		if (!id || isNaN(parseInt(id, 10))) {
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		for (var i = 0, l = scores.length; i < l; ++i) {
			var score = scores[i];
			if (score.id == id) {
				scores.splice(i, 1);
				founded = true;
				break;
			}
		}

		if (founded) {
			sortScores();
			res.writeHead(200, 'OK');
			res.end();
		} else {
			res.writeHead(400, 'Bad Request');
			res.end();
		}
	},

	put : function(req, res) {
		var id = req.params.id;
		var newScore = req.body;
		var founded;

		if (!id || isNaN(parseInt(id, 10))) {
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		if (!newScore || !newScore.name || newScore.score && isNaN(parseInt(newScore, 10))) {
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		for (var i = 0, l = scores.length; i < l; ++i) {
			var score = scores[i];
			if (score.id == id) {
				newScore.id = id; //TODO newScore already has id?
				scores.splice(i, 1, newScore);
				founded = true;
				break;
			}
		}

		if (founded) {
			sortScores();
			newScore = JSON.stringify(newScore);
			res.setHeader('Content-Type', 'application/javascript');
			res.setHeader('Content-Length', Buffer.byteLength(newScore));
			res.end();
			return;
		} else {
			res.writeHead(404, 'Not Found');
			res.end();
		}
	}
};