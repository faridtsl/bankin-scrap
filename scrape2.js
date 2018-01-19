
var fs = require("fs");			// 'fs' is the object from the module fs giving us access to file creation/read/write


// Declaration of global variables
var f = [];					// An array of HTML Tables extracted from the website.
var arr = [];				// Array containing JS objects and will be written on a file when finished


//var url = "http://127.0.0.1/index.html"					// Please uncomment this line for better speed expected : ~45sec (Eliminates the time of the request over the network)
var url = "http://web.bankin.com/challenge/index.html" 		// The url from the banking server slower compared to using localhost expected : 15sec (depending on the internet speed)

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

// If the console from our website outputs a message, it is handled by this listener
casper.on('remote.message', function(message) {
	this.echo(message);
});
//End listener definitions

// When the file has finished loading the following steps are executed :
//		** Gets the innerHTML of the #dvTable from the client side
//		** Tests if the innerHTML contains the transactions and the 50 transactions starting from 'i' are not on the array
//		** If the above conditions are satisfied then add the element to the 'f' array and print a success message.
//		** Otherwise emit the fail.event to be handled with the listener above.
casper.start(url);

casper.then(function(){
	do{
		var ua = this.evaluate(function(i) {
			window.location.replace(location.protocol + "//" + location.host + location.pathname + "?start=" + i);
			console.log(location.href);
			return document.querySelector("#dvTable table").innerHTML;
		}, i);
	//	this.echo(ua);
		f.push(ua);
		i+=50;
		//this.echo(" Got 50 from : " + i);
	}while(ua != "<tbody><tr><th>Account</th><th>Transaction</th><th>Amount</th></tr></tbody>" );
});

// Now that we have all the element we are good to go, let's construct our json file
// For every HTML string in our 'f' array.
// 		** The extraction is done using a Regular Expression (re) and the matches are stored in 'm'
//		** Construct a transaction as a javascript object 't' with the necessary informations we push it to the 'arr' array'
// When finished the array is sorted in the increasing order of the transaction number
casper.then(function(){
	// Extraction
	for( i = 0; i < f.length; i++){
		var l = 0;
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
