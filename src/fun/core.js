var Fun = new Object;

var $ = require('../seq/core');

/*
 * Constant function, or the K-combinator, returns a function that always returns the
 * original first value.
 */
Fun.constantly = function(k) {
  return function() {
    return k;
  };
};


Fun.identity = function(x) {
  return x;
};


/*
 * Function composition.
 *
 *    var second = $.Fun.comp($.Seq.first, $.Seq.rest);
 *    second([1,2,3]);
 *    //=> 2
 *
 */
Fun.comp = function() {
  var fns = $.Seq._(arguments).reverse();

  return function() {
    var args = $.Seq._(arguments);
    var ret = fns[0].apply(fns[0], args ? args : []);

    for (var i = 1; i < fns.length; i++) {
      ret = fns[i](ret);
    }

    return ret;
  };
}

var f = function() { return arguments; };

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
  var fns = $.Seq._(arguments);

  return function() {
    var ret = [];

    for (var i = 0; i < fns.length; i++) {
      ret.push(fns[i].apply(fns[i], $.Seq._(arguments)));
    }

    return ret;
  };
};

/*
 * var call = $.Fun.curry(function(f,x) { return f(x) });
 */
Fun.curry = function(fn) {
  var ret = function(){
    var args = $.Seq._(arguments);

    if (arguments.length >= fn.length) {
      return fn.apply(fn, args);
    }
    else {
      return ret.apply(ret, args.concat($.Seq._(arguments)));
    }
  };

  return ret;
};

/*
 * function lt(x, y) { return x < y };
 *
 * [1,2,3,4,5].filter($.Fun.partial(lt, 3));
 * //=> [4,5]
 *
 */
Fun.partial = function partial( fn /*, args...*/) {
  var args = $.Seq.rest($.Seq._(arguments));

  return function() {
    return fn.apply( fn, args.concat($.Seq._(arguments)));
  };
};


// node.js exports
exports.Fun = Fun;
