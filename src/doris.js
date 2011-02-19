var $ = new Object();

var Seq = require('./seq/core');
var Tramp = require('./tramp/core');


var mix = function(target) {
  for (var i = 0; i < arguments.length; i++) {
    var trait = arguments[i];

    for (prop in trait) {
      if(trait.hasOwnProperty(prop) && !target.hasOwnProperty(prop)) {
        target[prop] = trait[prop];
      }
    }
  }

  return target;
};

mix($, Seq);
mix($, Tramp);

// Node.js exports
mix(exports, $);
