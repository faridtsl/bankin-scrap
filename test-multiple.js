
var fs = require("fs");
var f = Array(101);
var mx = 1000;
var url = "http://localhost/index.html"
//var url = "http://web.bankin.com/challenge/index.html"
var urls = Array(101);

for( i = 0; i <= mx+50; i+=50){
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
	this.evaluate(function(){
		window.location.reload();
	});
});

casper.on('remote.message', function(message) {
	this.echo(message);
});

casper.on('fail.event', function() {
	if( typeof f[i/50] == 'undefined' ){
		this.echo("FAAAIL");
		this.wait(10, function(){
			this.evaluate(function(){
				window.location.reload();
			});
		 });
	}
});

/*
casper.on('load.finished', function(){
	var ua = this.evaluate(function() {
		// Getting the table of the elements.
		return document.querySelector("#dvTable").innerHTML;
	});
	if(typeof f[i/50] == 'undefined' && ua.length > 10){
		f[i/50] = ua;
		ff++;
		this.echo(" Got 50 from : " + i);
	}else{
		this.emit('fail.event');
	}
});
*/


casper.start().eachThen(urls, function(response) {
	this.echo("Loading " + response.data.replace(/^\D+/g, '') + " ....");
	this.thenOpen(response.data, function(response) {
		i += 50;
	});

	this.then(function(){
		tableSelector = {
			type: 'xpath',
			path: '//div[@id="dvTable"]/table//tr'
		};

		this.waitForSelector(tableSelector,
			function(){
				var ua = this.evaluate(function() {
					// Getting the table of the elements.
					return document.querySelector("#dvTable").innerHTML;
				});
				this.echo("Waited");
				if(typeof f[i/50] == 'undefined' && ua.length > 10){
					f[i/50] = ua;
					ff++;
					this.echo(" Got 50 from : " + i);
				}else{
					this.emit('fail.event');
				}
			},
			function(){
				this.emit('fail.event');
			}, 1000);
	});
});

casper.then(function(){
	var urls = [];
	for( i = 0; i < f.length; i++){
		if( typeof f[i] == 'undefined' && i*50 <= mx ){
			urls.push(url + "?start=" + i*50);
		}
	}
	this.echo("Getting the deltas");
	this.start().eachThen(urls, function(response){
		this.thenOpen(response.data, function(response){
			//i = response.data.replace(/^\D+/g, '')
		});
	});

	// Getting the input and creating the JSON File.
	// The extraction is done using a Regular Expression.
	// Then stored in array, sorted in the order of 'Transaction' an later on written in a file.
	var arr = [];
	this.then(function(){
		for( i = 0; i <= mx/50; i++){
			if( i*50 <= mx ){
				var l = 0;
				if(typeof f[i] != 'undefined'){
					var m;
					var re = /.tr..td.([a-zA-Z]*)..td..td.Transaction.([0-9]*)..td..td.([0-9]*)(.)..td...tr./g;
					do {
						m = re.exec(f[i]);
						if (m) {
							var d = {
								Account : m[1],
								Transaction : m[2],
								Amount : m[3],
								Currency : m[4]
							};
							arr.push(d);
						}
					} while (m);
				}
			}
		}
		arr.sort(function(o1, o2){
			return (o1["Transaction"] - o2["Transaction"]);
		});
		this.echo("Generated a table of " + arr.length + " Transactions.");
	});
	this.then(function(){
		fs.write("./object.json", JSON.stringify(arr), 'w');
	});
});
	
casper.run(function(){
	this.die('\n'+'Done');
});
