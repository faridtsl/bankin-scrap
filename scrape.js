
var fs = require("fs");			// 'fs' is the object from the module fs giving us access to file creation/read/write


// Declaration of global variables
var arr = [];				// Array containing JS objects and will be written on a file when finished

var url = "http://web.bankin.com/challenge/index.html" 		// The url from the banking server slower compared to using localhost expected : ~1.2sec (depending on the internet speed and the machine)

var debut = 0;				// The index used to get the table

var t0 = performance.now(); // Taking time at the beginning to calculate the duration of the scrape

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

// Starting the casper session
casper.start(url);

// We set the start as 'debut' which is incremented by 'cnt' the number of transaction in each page.
// Then call doGenerate function and then we take the html table as a string
// For every HTML string.
// 		** The extraction is done using a Regular Expression (re) and the matches are stored in 'm'
//		** Construct a transaction as a javascript object with the necessary informations we push it to the 'arr' array
// We stop when we get an empty array.
casper.then(function(){
	do{
		var html_table = this.evaluate(function(debut) {
			window.start = debut;
			window.doGenerate();
			return document.querySelector("#dvTable table").innerHTML;
		}, debut);

		var cnt = 0;
		var m;
		var re = /.tr..td.([a-zA-Z]*)..td..td.Transaction.([0-9]*)..td..td.([0-9]*)(.)..td...tr./g;
		do {
			m = re.exec(html_table);
			if (m) {
				arr.push({
					Account : m[1],
					Transaction : m[2],
					Amount : m[3],
					Currency : m[4]
				});
				cnt++
			}
		} while (m);
	
		debut+=cnt;
	}while(html_table != "<tbody><tr><th>Account</th><th>Transaction</th><th>Amount</th></tr></tbody>" );
});

// When all the above steps are completed this function writes a JSON file containing the objects in the 'arr' array.
casper.then(function(){
	fs.write("./object.json", JSON.stringify(arr), 'w');
})

// We run casper and when finished we 'die'
casper.run(function(){
	var t2 = performance.now();
	this.echo((t2-t0));
	this.die();
});
