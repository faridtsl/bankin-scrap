
handler = {
			apply: function(target, thisArg, argList){
			argList[1] = 1
			console.log("[TSL] "+ target + ": " + argList.join(','));
			return target.apply(thisArg, argList);
			}
		};
setTimeout = new Proxy(setTimeout, handler);

