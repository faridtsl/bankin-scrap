
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

var res = false;
var ff = 0;
var f = new Array(1000);
var j = Array(101);
var n = 0;
var webPage = require('webpage');


function get50(start, j){
	var page = webPage.create();
	page.onInitialized = function(){
		page.evaluate( function(){
			myTimeout = setTimeout;
		setTimeout = function(f, arg){
				return myTimeout(f, 1);
			};
		});
	};
	
	page.onResourceError = function(resourceError) {
	  console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
	  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
	};
	
/*
	page.onAlert = function(msg){
		console.log('ALERT : ' + msg);
	}
*/
	
	
	page.onLoadFinished = function(status){
		if (status !== 'success'){
			console.log('Unable to access network');
		}else{

			var ua = page.evaluate(function() {
				return document.querySelector("#dvTable").innerHTML;
			});

			if(ua.length < 10){
				page.close();
			}else{
	//			console.log(ua);
				if(ua.length > 10 && ( typeof f[start/50]) == 'undefined' ||  f[start/50].length <= 10 ){
					f[start/50] = ua;
					ff+=1;
					j[start/50] = 100;
					console.log(ff);
					if(ff == 19){
						afterwork();
					}
				}
			}
		}
	}


	page.settings.userAgent = 'SpecialAgent';
	var url = 'http://127.0.0.1/index.html'
	//var url = 'http://web.bankin.com/challenge/index.html'
	url = url + "?start=" + start;
	page.open(url, function(status){
		//console.log(status);
	});
}



function dowork(){
	for( i = 0; i < 1000; i+=50){
		for( j[i/50] = 0; j[i/50] <= 50; j[i/50]++){
			get50(n*1000+i, j);
		}
	}
}

function afterwork(){
	console.log("HERE");
	for( i = 0; i <= 1000; i+=50){
		console.log(f[(n*1000 + i)/50]);
	}
	n++;
	if(n == 2){
		phantom.exit();
	}else{
		ff = 0;
		waitFor(round, afterwork);
	}
}

function round(){
	dowork();
	//waitFor(dowork, afterwork);
}

//round(0);
waitFor(round, afterwork);
