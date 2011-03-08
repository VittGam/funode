var Seq = new Object;

var $ = require('../fun/core');

/*
 * Returns an array representation of an object that has elements, otherwise
 * returns `false`.
 */
Seq._ = function(s) {
  if (typeof s === 'undefined' || s.length === 'undefined') {
    return 'undefined';
  }

  if (s.length <= 0) {
    return false;
  }

  return Array.prototype.slice.call(s, 0);
};

/*
 * Returns the first element in an array like thing.
 */
Seq.first = function(s) {
  return Seq._(s)[0];
};

/*
 * Returns the second element in an array-like thing.
 */
Seq.second = $.Fun.comp($._.first, $._.rest);

/*
 * Returns an array that is the original array-like `s` minus the first `n` items.
 */
Seq.drop = function(n, s) {
  return Array.prototype.slice.call(s, n);
};

/*
 * Returns an array of only the first `n` items in the original array-like `s`.
 */
Seq.take = function(n, s) {
  return Array.prototype.slice.call(s, 0, n);
};

/*
 * Returns an array of all elements but the first of an
 * array-like thing.
 */
Seq.rest = function(seq) {
  return Seq.drop(1, seq);
};

/*
 * Concatentates one or more array-like things
 */
Seq.cat = function() {
  return Array.prototype.concat.apply([], Seq._(arguments));
};

/*
 * Builds an array of size `times` built from the call of function
 * `fn` with any additional arguments.
 *
 * $.Seq.iterate(3, $.Fun.partial($.Seq.range, 3));
 *
 */
Seq.iterate = function(times, fn) {
  var res = [];
  var args = Seq.drop(2, Seq._(arguments));

  for (var i=0; i < Math.abs(times); i++) {
    res.push(fn.apply(fn, args));
  }

  return res;
};

/*
 * Returns an array of size `sz` with the contents of the array-like `seq` padded
 * on both sides by the value `val`.  `pad` will try to balance the pad if it can, but
 * will favor the larger pad to the left.  If `size` is smaller than the length of the
 * `seq` then the original `seq` is simply returned.
 *
 */
Seq.pad = function(sz, val, seq) {
  if (sz <= seq.length) {
    return seq;
  }

  var left = Seq.iterate(Math.floor((sz / seq.length)), constantly(val));

  var right = Seq.iterate(sz - (left.length + seq.length), constantly(val));

  return Seq.cat(left, seq, right);
};

/*
 * Mega-range.  Works ike range but can go in different directions.  One-arg specifies
 * a range of [0,n):
 *
 *     $.Seq.range(5);
 *     //=> [0,1,2,3,4]
 *
 * Two-args specify the endpoints [s,e):
 *
 *     $.Seq.range(0,4);
 *     //=> [0,1,2,3]
 *
 * In either case, the range go go *backwards*:
 *
 *     $.Seq.range(-5);
 *     //=> [0,-1,-2,-3,-4]
 *
 *     $.Seq.range(1,-4);
 *     //=> [1, 0,-1,-2,-3]
 *
 * Given a 3rd numeric argument, `range` will step by that amount:
 *
 *     $.Seq.range(0,5,2);
 *     //=> [0,2,4]
 *
 */
Seq.range = function() {
  var span = function(start,end,step) {
    /**
     * `span` is a function that takes a start number and an end
     * number and returns an array of all the numbers from start to
     * end (exclusive).
     **/
    var direction, // Are we increasing or decreasing?
    i, gap = start - end,
    by = (typeof step === 'undefined') ? 1 : Math.abs(step);
    acc = [];

    if (start === end) {
      acc.push(start);
    }
    else {
      direction = (start < end) ? 1 : -1;
      by = by * direction;
    }

    /**
     * If the range is decreasing then the following holds true:
     *   gap - direction > direction
     * Else
     *   gap + direction > direction
     *
     * While either of these conditions hold true, another value is
     * added to the range.
     *
     **/
    for (i = start; direction < 0 ? gap > direction : gap < direction; i += by, gap = i - end + direction) {
      acc = acc.concat(i);
    }

    return acc;
  };

  switch (arguments.length) {
    case 0:
      return [];
    case 1:
      if (typeof arguments[0] === 'number') {
        return span(0, arguments[0], 1);
      }
      else {
        return arguments[0].reduce(span);
      }
    case 2:
      return span(arguments[0], arguments[1], 1);
    case 3:
      return span(arguments[0], arguments[1], arguments[2]);
    default:
      return 'undefined';
  }
};



// node.js exports
exports.Seq = Seq;
