(function() {
   "use strict";

   var $ = new doris.Namespace("doris.quux");

   /**
    * The Term object takes a form which is one of either a string or
    * an object containing a functor and its arguments:
    * <code>
    * {
    *   functor : "mother",
    *   args    : ["debby", "mike"]
    * }
    * </code>
    *
    * Arguments can be either atoms or lists:
    * <code>
    * {
    *   functor : "kids",
    *   args    : ["mike", ["keita","shota"]]
    * }
    * </code>
    *
    * The string should take the form of a typical Prolog compound form:
    * <code>"mother(debbie,mike)"</code>
    *
    **/
   $.Term = function(f, args) {
     if (!f) {
       throw new Error("A Term must have a functor!");
     }

     return {
       functor : f,
       args    : (args) ? args : []
     };
   };

   /**
    * The Clause object consists of a head and a body.  The head part is
    * A Term object with some number of variables and or atoms.  The body part
    * consists of a list of Terms comprising the goals.
    *
    * <code>
    * {
    *   head  : Term("son", ["X", "Y"]),
    *   goals : [Term("mother", ["Y", "X"]), Term("boy", "X")]
    * }
    * </code>
    *
    **/
   $.Clause = function(h, body) {
     if (!h) {
       throw new Error("A Clause must have a head!");
     }

     if (!$.isTerm(h)) {
       throw new Error("A Clause head must be a Term!");
     }

     return {
       head  : h,
       goals : (body) ? body : true
     }
   };

   $.isTerm = function(obj) {
     return obj.functor && obj.args;
   };

   $.isClause = function(obj) {
     return obj.head && obj.goals;
   };

   $.stringify = function(obj) {
     var str = "";

     if (obj) {
       if ($.isTerm(obj)) {
         str = obj.functor + "(" + obj.args + ")";
       }
       else if ($.isClause(obj)) {
         str  = $.stringify(obj.head);
         str += " :- ";

         if (obj.goals === true) {
           str += "true";
         }
         else {
           doris.foreach(obj.goals, function(e) {
                           str += $.stringify(e);
                           str += ", ";
                         });

           str = str.replace(/, $/, ".");
         }
       }
     }

     return str;
   };
 })();

var t = new doris.quux.Term("mother", ["debbie", "mike"]);
print(doris.quux.stringify(t));

var c = new doris.quux.Clause(new doris.quux.Term("son", ["X", "Y"]), [new doris.quux.Term("mother", ["Y", "X"]), new doris.quux.Term("boy", "X")]);
print(doris.quux.stringify(c));

