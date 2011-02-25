var Seq = new Object;

Seq.first = function(array_like) {
  return array_like[0];
};

Seq.rest = function(array_like) {
  return Array.prototype.slice.call(array_like, 1);
};


// node.js exports
exports.Seq = Seq;
