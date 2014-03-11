var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFileName = './rss_feeds.txt';

function checkForRssFile() {
	fs.exists(configFileName, function (exists) {
		if(!exists){ return new Error('Missing RSS file: ' + configFileName); }
		next(null, configFileName);
	} );
}

function readRssFile(configFileName) {
	fs.readFile(configFileName, function(err, feedList){
		if(err) return next(err);
		feedList = feedList
				.toString()
				.replace(/^\s+|\s+$/g, '')
				.split('\n');

	var random = Math.floor(Math.random() * feedList.length);
	next(null, feedList[random]);
	});
}

function downloadRssFeed(feedUrl) {
	request({ uri: feedUrl }, function(err, res, body){
		if(err) return next(err);
		if(res.statusCode != 200) return next(new Error('Abnormal response status code'));

		next(null, body);
	}
	);
}

function parseRssFeed(res) {
	var handler = new htmlparser.RssHandler();
	var parser = new htmlparser.Parser(handler);
	parser.parseComplete(res);

	if(!handler.dom.items.length) return next(new Error('No RSS items found'));

	var item = handler.dom.items.shift();
	console.log(item.title);
	console.log(item.link);
}

var tasks = [
		checkForRssFile,
		readRssFile,
		downloadRssFeed,
		parseRssFeed
];

function next(err, result) {
	if(err) throw err;

	var currentTask = tasks.shift();

	if(currentTask) {
		currentTask(result);
	}
}

next();
