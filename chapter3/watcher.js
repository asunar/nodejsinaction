function Watcher(watchDir, processedDir) {
	console.log('watcher will watch:' + watchDir);
	this.watchDir = watchDir;
	this.processedDir = processedDir;
	console.log('watcher will move processed files to:' + processedDir);
}

var events = require('events')
	,util = require('util');

//same as Watcher.prototype = new events.EventEmitter();
util.inherits(Watcher, events.EventEmitter);

var fs = require('fs')
,watchDir = './watch'
,processedDir = './done';


Watcher.prototype.watch = function(){
	var watcher = this;
	fs.readdir(this.watchDir, function(err, files){
		if(err) throw err; //what is the point of this?
		for(var index in files) {
			console.log('Emitting Event: Process ' + files[index]);
			watcher.emit('process', files[index]);
		}
	});
};

Watcher.prototype.start = function(){
	console.log('Starting watcher..');
	var watcher = this;
	fs.watchFile(watchDir, function(){
		watcher.watch();
		console.log('watching:' + watchDir);
	});
};

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function process(file) {
	console.log('Processing...');
	var watcher = this;
	var watchFile = this.watchDir + '/' + file;
	var processedFile = this.processedDir + '/' + file.toLowerCase();

	console.log(watchFile);
	console.log(processedFile);
	fs.rename(watchFile, processedFile, function(err){
		if(err) throw err;
	} );


});

watcher.start();
