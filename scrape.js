
var fs = require("fs");			// 'fs' is the object from the module fs giving us access to file creation/read/write


// Declaration of global variables
var f = Array(101);				// An array of HTML Tables extracted from the website.
var nb = 5000;				// The number of transaction we want
var mx = nb - 50;				// The max of start parameter
var arr = [];					// Array containing JS objects and will be written on a file when finished


var url = "http://127.0.0.1/index.html"					// Please uncomment this line for better speed expected : ~45sec (Eliminates the time of the request over the network)
//var url = "http://web.bankin.com/challenge/index.html" 		// The url from the banking server slower compared to using localhost expected : 15sec (depending on the internet speed)

var urls = Array(101);						//  An array containing the different urls which will be used to request (with different start parameters)


// Filling the urls array
for( j = 0; j <= mx; j+=50){
	urls[j] = url + "?start=" + j;
}

var i = 0;				// The index used to fill the f Array

// Creating a casper object.
var casper = require('casper').create();

// Begin listener definitions

// When the page is initialized we redefine the random function to always give 0.01 (why ?):
//		** Because the slowmode, failmode and hasiframe should all be false.
//		** And they are initialized as follow : (100*random()) % 2 == 0.
//		** So the condition is always false thus not creating any problems.
casper.on("page.initialized", function(){
	this.evaluate(function(){
		Math.random = function(){
			return 0.01;
		}
	});
});

// If we are unable to load a resource from the file this lister is called
// 		** It gives us some informations about the resource and the error.
// 		** It reloads the page.
casper.on("resource.error", function(resourceError){
	console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
	console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
	this.evaluate(function(){
		window.location.reload();
	});
});

// If the console from our website outputs a message, it is handled by this listener
casper.on('remote.message', function(message) {
	this.echo(message);
});

// This event 'fail.event' is a costume event I created to handle the case of a fail of loading the <table></table>.
casper.on('fail.event', function() {
	this.evaluate(function(){
		window.location.reload();
	});
});


// When the file has finished loading the following steps are executed :
//		** Gets the innerHTML of the "#dvTable table" from the client side
//		** Tests if the innerHTML contains the transactions and the 50 transactions starting from 'i' are not on the array
//		** If the above conditions are satisfied then add the element to the 'f' array and print a success message.
//		** Otherwise emit the fail.event to be handled with the listener above.
casper.on('load.finished', function(){
	var ua = this.evaluate(function() {
		return document.querySelector("#dvTable table").innerHTML;
	});
	if(ua > 10){
		if( ua != "<tbody><tr><th>Account</th><th>Transaction</th><th>Amount</th></tr></tbody>"){
			f.push(ua);
		}
		//this.echo(" Got 50 from : " + i);
	}else{
		this.emit('fail.event');
	}
});

//End listener definitions

// This methode starts casper and for every url on the 'urls' array:
//		** Takes the start id using the regular expressions:
//			*** .*= to delete up to the equal sign (in case there is an IP adresse with numbers in the URL).
//			*** ^\D+ to delete all non numeric characters left.
//		** Prints "Loading x ....".
//		** When the page is loaded the 'load.finished' listener handles the output.
casper.start(url).eachThen(urls, function(response) {
	var o = response.data.replace(/.*=/g, '');
	//this.echo("Loading " + o + " ....");
	this.thenOpen(response.data, function(response) {});
});


// Now that we have all the element we are good to go, let's construct our json file
// For every HTML string in our 'f' array.
// 		** The extraction is done using a Regular Expression (re) and the matches are stored in 'm'
//		** Construct a transaction as a javascript object 't' with the necessary informations we push it to the 'arr' array'
// When finished the array is sorted in the increasing order of the transaction number
casper.then(function(){
	// Extraction
	for( i = 0; i < mx/50 + 1; i++){
		if( i*50 <= mx ){
			var l = 0;
			if(typeof f[i] != 'undefined'){
				var m;
				var re = /.tr..td.([a-zA-Z]*)..td..td.Transaction.([0-9]*)..td..td.([0-9]*)(.)..td...tr./g;
				do {
					m = re.exec(f[i]);
					if (m) {
						var t = {
							Account : m[1],
							Transaction : m[2],
							Amount : m[3],
							Currency : m[4]
						};
						arr.push(t);
					}
				} while (m);
			}
		}
	}

	// Sorting
	arr.sort(function(o1, o2){
		return (o1["Transaction"] - o2["Transaction"]);
	});

	// Done message
	casper.echo("Generated a table of " + arr.length + " Transactions.");
});

// When all the above steps are completed this function writes a JSON file containing the objects in the 'arr' array.
casper.then(function(){
	fs.write("./object.json", JSON.stringify(arr), 'w');
})

// We run casper and when finished we 'die' and output done
casper.run(function(){
	this.die('\n'+'Done');
});
