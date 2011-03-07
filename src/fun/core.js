var Fun = new Object;

var sys = require('sys');

var $ = require('../seq/core');

/**
 *    var r10 = $.Fun.partial($.Seq.range, 10);
 *    r10(20);
 *    //=> [ 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]
 **/
Fun.partial = function(f) {
  var original_args = Array.prototype.slice.call(arguments, 1);

  return function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return f.apply(f, Array.prototype.concat.call(original_args, args));
  };
};


/*
 *    var f = $.Fun.juxt($.Seq.take, $.Seq.drop);
 *    f(2, [1,2,3,4]);
 *    //=> [ [ 1, 2 ], [ 3, 4 ] ]
 */
Fun.juxt = function() {
  var fns = $.Seq.seq(arguments);

  return function() {
    var ret = [];

    for (var i = 0; i < fns.length; i++) {
      ret.push(fns[i].apply(fns[i], $.Seq.seq(arguments)));
    }

    return ret;
  };
};

// node.js exports
exports.Fun = Fun;
