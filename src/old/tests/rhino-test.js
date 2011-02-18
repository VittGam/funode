function usage() {
  print("rhino-test.js <files to load>");
}

if (!arguments) {
  usage();
}

for (var i=0; i < arguments.length; i++) {
  load(arguments[i]);
}

