var connect = require('connect');
var logger = require('configurable_logger');

function logger(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next();
}

// hello middleware doesn't have a next callback
// because component finishes the HTTP response and
// never needs to give control back to the dispatcher
function hello(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.end('hello world');
}

function authenticateWithDatabase(user, pass, callback) {
  var err;
  if (user != 'tobi' || pass != 'ferret') {
    err = new Error('Unauthorized');
  }
  callback(err);
}

function restrict(req, res, next) {
	var authorization = req.headers.authorization;
	if(!authorization) return next(new Error('Unauthorized'));
	var parts = authorization.split(' ');
	var scheme = parts[0];
	var auth = new Buffer(parts[1], 'base64').toString().split(':');
	var user = auth[0];
	var pass = auth[1];

	authenticateWithDatabase(user, pass, function(err){
		if(err) return next(err);
		next();
	});
}

function admin(req, res, next) {
	switch (req.url) {
		case '/':
			res.end('try /users');
			break;
		case '/users':
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(['tobi', 'loki', 'jane']));
			break;
	}
}

connect()
	.use(logger(':httpVersion :method :url'))
  .use('/admin', restrict)
  .use('/admin', admin)
  .use(hello)
  .listen(3000);
