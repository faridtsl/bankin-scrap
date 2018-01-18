
// Redefining variables

// 'failmode' is a variable indicating to the 'load.js' file that our 'something' has failed
// thus creating problems. To elemminate all sort of problems 'failmode' is declared 
// before 'load.js' as having value false and read-only. so we prevent it from changing.
var failmode = false;
Object.defineProperty(failmode, 'secret', {
    value: false,
    writable : false,
    enumerable : true,
    configurable : false
});


// 'hasiframe' is telling the 'load.js' script to create and iframe.
// we don't need it to get all the transactions so with the same technique above
// let's declare it as having value false and prevent it from changing.
var hasiframe = false;
Object.defineProperty(hasiframe, 'secret', {
    value: false,
    writable : false,
    enumerable : true,
    configurable : false
});

// setTimeout is used in 'slowmode' by 'load.js' to slow us from scrapping effeciently.
// So we use a javascript object called 'Proxy' to intercept the call to this function
// and change the sleep periode to 1milisecond so that it doesn't affect our time.
// we could have declared 'slowmode' to be always false but this might affect the 'load.js'
// so it's preferable to let the script run as he wants.
var handler = {
			apply: function(target, thisArg, argList){
			argList[1] = 1;								// Change the sleep duration to 1ms
			return target.apply(thisArg, argList);		// call the original setTimeout with 1ms of sleep
			}
		};
setTimeout = new Proxy(setTimeout, handler);

