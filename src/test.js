const ff = {
  abc: {},
};

ff.abc["fn"] = function(a,b){console.log(a+b);};

const a = ff.abc["fn"];

a("a","a");
