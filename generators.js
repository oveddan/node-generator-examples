var print = require('./lib').print;

var basic = function *(){
  print('started');

  yield 5;

  print('done');
};

var multipleYields = function *(){
  yield 5;
  yield 10;
  yield 13;
};


var withReturn = function *(){
  yield 5;
  yield 'a';

  return 6;
};


// advantages of lazy iteration: infinite iteration
var powersOfTwo = function *(){
  var totalSum = 0;

  var i = 0;
  while(true) {
    var power = Math.pow(2, i);

    totalSum += power;

    yield power;

    i++;
  }
};

// to properly run this, when calling next for the second time,
// pass a value to next (i.e. generator.next(5))
var sendingAValue = function *(){
  var a = yield 3;

  return a;
};

// this shows that a yielded function can be invoked
// to run:
/*
   var generator = generators.withYieldedFunction();
   var continuable = generator.next();
   continuable.value();
*/
var withYieldedFunction = function *(){
  yield function(){
    print('yielded function invoked');
  };
};

// this shows a real example which has an asynchronous function that invokes
// a callback
// to run:
/*
  var generator = generators.lookupDnsGenerator('google.com');
  var continuable = generator.next();
  continuable.value(function(e, result){
    generator.next(result);
  });
*/
var lookupDnsGenerator = function *(domain){
  var address = yield lookupDns(domain);

  print('Address of ' + domain + ' is ' + address);

  return address;
}

var dns = require('dns');

var lookupDns = function(domain) {
  return function(done) {
    dns.lookup(domain, function(err, address){
      done(err, address);
    });
  }
}



module.exports = {
  basic : basic,
  multipleYields : multipleYields,
  withReturn : withReturn,
  powersOfTwo : powersOfTwo,
  sendingAValue : sendingAValue,
  withYieldedFunction : withYieldedFunction,
  lookupDnsGenerator : lookupDnsGenerator
};
