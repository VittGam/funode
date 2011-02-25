var Tramp = new Object;

Tramp.oline = function(fun) {
  var ret = null;

  if (arguments.length > 1) {
    ret = fun.apply(fun, Array.prototype.slice.call(arguments, 1));
  }
  else {
    ret = fun();
  }

  while (typeof ret == 'function') {
    ret = ret();
  }

  return ret;
};


// node.js exports
exports.Tramp = Tramp;
