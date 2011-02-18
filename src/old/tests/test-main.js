doris.quux.foo();
doris.foreach([1,2,3], function(x){print(x)});
doris.foreach({foo:1, bar:2, baz:3, quux:4}, print);

var f = function() {return 42};
f.foo = "bar";
Function.prototype.bar = "baz";
doris.foreach(f, function(val) {print(val)});

doris["quux"]["foo"]();

var ns = new doris.Namespace("foo.bar");
foo.bar.baz = function() {print("qux")};
foo.bar.baz();
foo["bar"]["baz"]();

strs = ["one", "1", "two", "2", "42", "foo"];

nums = strs.flatmap(function(x) {
         var res = parseInt(x);
         if (res) {
           return res;
         }

         return [];
       });

print(nums);

nums = [1,2,3,4,5];

var sum = nums.reduce(function(x,y) {
  return x + y;
});

print(sum);
print([10,-5].range());
print([0,10].range());
print([0,10].range(3));
print([0,10,-10].range());
print([1,2,[3,4,[5,6]]].flatten());


