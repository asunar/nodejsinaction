var connect = require('connect');
var app = connect();
app
	.use(logger)
	.use(hello)
	.listen(3000);

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
