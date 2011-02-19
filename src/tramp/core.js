var Tramp = new Object;

Tramp.oline = function(firstFun) {
  return firstFun();
};


// node.js exports
exports.Tramp = Tramp;
