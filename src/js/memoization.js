(function() {
   "use strict";
   
   var $ = new doris.Namespace("doris.memo");

   $.memoize = function (fn, context) {
     var memoize_arg = function (arg_pos) {
       var cache = {};
       return function () {
         if (arg_pos == 0) {
           if (!(arguments[arg_pos] in cache)) {
             cache[arguments[arg_pos]] = fn.apply(context, arguments);
           }
           return cache[arguments[arg_pos]];
         }
         else {
           if (!(arguments[arg_pos] in cache)) {
             cache[arguments[arg_pos]] = memoize_arg(arg_pos - 1);
           }
           return cache[arguments[arg_pos]].apply(this, arguments);
         }
       }
     }

     var arity = fn.arity || fn.length;
     return memoize_arg(arity ? arity - 1 : 0);
   }
})();

/*
load('src/doris.js');
load('src/memoization.js');
var fn = function (x) { return new Date(); };
var mfn = doris.memo.memoize(fn);
*/