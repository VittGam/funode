var doris = {};

(function ($) {
  "use strict";
   
  $.NAME = "doris";

  /* Closure-local variables */
  var global = this,
  namespaces = {"doris" : doris};

  /* Utility functions */

  /**
   * `flatmap` applies a given function <code>fn</code> to each element
   * in an array and concatenates the results.
   *
   * @example
   * <code>
   * var strs = ["one", "1", "two", "2", "42", "foo"];
   *
   * var nums = strs.flatmap(function(x) {
   *   var res = parseInt(x);
   *   if (res) {
   *     return res;
   *   }
   *
   *   return [];
   * });
   *
   * // nums is [1,2,42]
   * </code>
   *
   * @arg fn A function to apply to each element in the array.
   *
   * @return  <code>fn(a<sub>0</sub>).concat(...).concate(fn(a<sub>n</sub>))</code>
   **/
  Array.prototype.flatmap = function (fn) {
    var acc = [];

    $.foreach(this, function (e) {
      var result = fn.apply(this, arguments);

      if (result) {
        acc = acc.concat(result);
      }
    });

    return acc;
  };

  /**
   * `flatten` Takes all of the values in a nested array and puts them into
   * an array of depth 1.
   *
   * @example
   * <code>
   * [1,2,[3,4,[5,6]]].flatten();  // gives [1,2,3,4,5,6]
   * </code>
   *
   **/
  Array.prototype.flatten = function() {
    var result = [];

    $.foreach(this, function(e) {
      if (e instanceof Array) {
        result = result.concat(e.flatten());
      }
      else {
        result.push(e);
      }
    });

    return result;
  };


  /**
   * `reduce` combines the element pairs in an array using a function
   * <code>fn</code> from left to right.
   *
   * @example
   * <code>
   * var nums = [1,2,3,4,5];
   *
   * var sum = nums.reduce(function(x,y) {
   *   return x + y;
   * });
   *
   * // sum is 15
   * </code>
   *
   * @arg fn A function to apply to each element pair in the array.
   *
   * @return  <code>fn(... fn(a<sub>0</sub>,a<sub>1</sub>), ..., a<sub>n</sub>)</code>
   **/
  if (!Array.reduce) {
    Array.prototype.reduce = function (fn) {
      var result;

      if (this.length === 0) {
        return fn.call(this);
      }
      else if (this.length === 1) {
        return fn.call(this, this[0]);
      }
      else {
        result = fn.call(this, this[0], this[1]);

        $.foreach(this.slice(2), function (e) {
          print(e);
          result = fn.call(this, result, e);
        });
      }

      return result;
    };
  }

  /**
   * `range` uses the elements in an array to build (usually) a larger
   * array using the range of values from the first element to the last (exclusive).
   * Additionally, it can take a value as an argument representing the
   * step value.
   *
   * @example
   * <code>
   * [0,10].range()  // gives [0,1,2,3,4,5,6,7,8,9]
   * [0,10].range(2) // gives [0,3,6,9]
   * [5,-5].range()  // gives [5,4,3,2,1,0,-1,-2,-3,-4]
   * </code>
   *
   * @arg step The step value
   *
   * @return  <code>[array[0] .. array[1] - 1]</code>
   *
   * @todo Allow a step function and provide a default.
   *
   **/
  Array.prototype.range = function(step) {
    var span = function(start,end) {
          /**
           * `span` is a function that takes a start number and an end
           * number and returns an array of all the numbers from start to
           * end (exclusive).
           **/
          var direction, // Are we increasing or decreasing?
              i, gap = start - end,
              by = (typeof step === 'undefined') ? 1 : Math.abs(step)
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


    switch (this.length) {
      case 0:
        return [];
      case 1:
        return span(0, this[0]);
      case 2:
        return this.reduce(span)
      default:
        return 'undefined';
    }
  }

  /**
   * Function.prototype.foreach attaches a Function-specific foreach
   * that works the same as `for(x in obj)` *except* that it skips
   * over any members on the prototype.
   *
   * The callback is invoked with the following args:
   * 1. object[key]
   * 2. key
   * 3. object
   *
   * @arg object The object called over
   * @arg callback The block of code to execute over the object
   * @arg context The value to assign to `this` in the callback
   *
   * @return undefined
   *
   **/
  Function.prototype.foreach = function (object, callback, context) {
    for (var key in object) {
      /**
       * Skip over items on the prototype chain.  Not using
       * `hasownProperty()` because it will not work on Arrays.
       **/
      if (typeof this.prototype[key] === "undefined") {
        callback.call(context, object[key], key, object);
      }
    }
  };

  /**
   * `foreach` attaches a foreach to the doris object that determines the
   * type of the object called on and dispatches to the proper foreach
   * based on that type.  Allows the same foreach pattern over *any* type:
   *
   * @example
   * <pre>
   * doris.foreach([1,2,3], function(val) {alert(val)});
   * doris.foreach({foo:1, bar:2}, function(val, key) {alert(key + "=>" val)});
   * var f = function() {return 42};
   * f.foo = "bar";
   * Function.prototype.bar = "baz";
   * doris.foreach(f, function(val) {print(val)}); // only shows "bar"
   * </pre>
   *
   * @arg object The object called over
   * @arg callback The block of code to execute over the object
   * @arg context The value to assign to `this` in the callback
   *
   * @return undefined
   *
   **/
  $.foreach = function (object, callback, context) {
    var dispatch = "undefined";

    if (object) {
      // default dispatch on Object
      dispatch = Object;

      // Both Function and Array might dispatch the same way...
      if (object instanceof Function) {
        dispatch = Function;
      }
      else if (typeof object.length === "number") {
        // ...unless Array.forEach is available
        if (Array.forEach) {
          Array.forEach(object, callback);
          return;
        }

        dispatch = Array;
      }
      else if (object.foreach instanceof Function) {
        // If the object has its own foreach, then use that
        object.foreach(callback, context);
        return;
      }

      dispatch.foreach(object, callback, context);
    }
  };

  /**
   * $.Namespace creates a virtual namespace object by parsing a dot-style
   * name and creating a global variable, or appending to an existing object,
   * a chain of lookups to some set of objects.
   *
   * In other words, it takes something like "foo.bar.baz" and creates a
   * variable (or appends to an existing one) lookup analogous to
   * foo["bar"]["baz"].
   *
   * @example
   * <pre>
   * var ns = new doris.Namespace("foo.bar");
   * ns.baz = function() {alert("quux")};
   *
   * foo.bar.baz();
   * foo["bar"]["baz"](); // prints the same as previous line
   * </pre>
   *
   * Only add functions and objects to the namespace object that you wish
   * to provide as public.  Otherwise, hide namespace-private functions
   * in a closure.  This convention allows me to simplify the implementation
   * instead of complicating matters with a whacked import/export mechanism.
   *
   * @arg object The object called over
   * @arg callback The block of code to execute over the object
   * @arg context The value to assign to `this` in the callback
   *
   * @return undefined
   *
   **/
  $.Namespace = function (name) {
    var parts = name.split('.'),
    ns = global,
    i, n;

    if (!name) {
      throw new Error("A name is required to construct a namespace");
    }

    // Do a quick namespace name sanity check
    if ((name.charAt(0) === '.') ||
        (name.charAt(name.length - 1) === '.') ||
        (name.indexOf("..") !== -1)) {
      throw new Error("Illegal namespace name: " + name);
    }

    /**
     * Loop through the parts and create namespace elements as needed
     * or append to existing
     **/
    $.foreach(parts, function (part) {
      if (!ns[part]) {
        // If there is no existing namespace element, then create one
        ns[part] = {};
      }
      else if (typeof ns[part] !== "object") {
        // Do not append to a non-object
        n = parts.slice(0, i).join('.');
        throw new Error(n + " already exists and is not an object");
      }

      // OK, now append
      ns = ns[part];
    });

    if (ns.NAME) {
      throw new Error("Namespace " + name + " is already defined");
    }

    // Set the namespace name and register it in the namespaces table
    ns.NAME = name;
    namespaces[name] = ns;

    return ns;
  };  // end of Namespace constructor
})(doris);
