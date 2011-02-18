var Doris = new Object();

var Seq = require('./seq/core');

var traits = function(target) {
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

traits(Doris, Seq);

// Node.js exports
exports.traits = traits;
traits(exports, Doris);
