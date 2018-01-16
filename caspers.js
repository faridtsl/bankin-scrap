

var f = Array(101);
//var url = "http://127.0.0.1/index.html"
var url = "http://web.bankin.com/challenge/index.html"
var urls = Array(101);

for( i = 0; i < 5000; i+=50){
	urls[i] = url + "?start=" + i;
}

var ff = 0;
var i = 0;
var casper = require('casper').create({
    clientScripts: ["./do.js"],
    logLevel: "debug"
});

casper.on("resource.error", function(resourceError){
    console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
    console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
});

casper.on('remote.message', function(message) {
    this.echo(message);
});

casper.on('fail.event', function() {
	//this.echo("Reloading ...");
	if( typeof f[i/50] == 'undefined' ){
		this.wait(10, function(){ this.reload(); });
	}
});

casper.on('load.finished', function(){
	var ua = this.evaluate(function() {
        // you can access the log from page DOM
		// console.log(document.documentElement.innerHTML);
		return document.querySelector("#dvTable").innerHTML;
    });
	if(typeof f[i/50] == 'undefined' && ua.length > 10){
		f[i/50] = ua;
		ff++;
		this.echo(i + " : " + ua);
	}else{
		this.emit('fail.event');
	}
});


casper.start().eachThen(urls, function(response) {
	this.echo("Loading " + i + " ....");
	this.thenOpen(response.data, function(response) {
		i += 50;
	});
});
	
casper.run(function(){
    this.die('\n'+'Done');
});
