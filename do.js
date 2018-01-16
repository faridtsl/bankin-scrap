

var failmode = false;

Object.defineProperty(failmode, 'secret', {
    value: false,
    writable : false,
    enumerable : true,
    configurable : false
});

var hasiframe = false;

Object.defineProperty(hasiframe, 'secret', {
    value: false,
    writable : false,
    enumerable : true,
    configurable : false
});

var testsl = 69;
var handler = {
			apply: function(target, thisArg, argList){
			argList[1] = 1
			console.log("[TSL] "+ target + ": " + argList.join(','));
			return target.apply(thisArg, argList);
			}
		};
setTimeout = new Proxy(setTimeout, handler);

