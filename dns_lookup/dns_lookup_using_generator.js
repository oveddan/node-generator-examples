var dns = require('dns'),
    fs = require('fs');
    lib = require('../lib'),
    print = lib.print,
    debug = lib.debug;

var lookupAndSaveDnsGenerator = function *(domain) {
  var address = yield dnsLookup(domain);
  yield writeFile(domain, address);

  print('done executing. address is ' + address)
}

module.exports = lookupAndSaveDnsGenerator;

// create a thunk
var dnsLookup = function dnsLookup(domain){
  return function(done) {
    dns.lookup(domain, function(err, address){
      done(err, address);
    });
  }
}

// create another thunk
var writeFile = function writeFile(fileName, data){
  return function(done){
    fs.writeFile(fileName, data, function(err){
      done(err);
    });
  }
}

// to run:
// the hard way
/*
  var generator = lookupAndSaveDnsGenerator('yahoo.com');
  var continuable = generator.next()
  continuable.value(function(e, result){
    continuable = generator.next(result);
    continuable.value(function(e){
      generator.next();
    });
  })
*/
// using generator runner
/*
   var runGenerator = require('./run_generator')
   runGenerator(lookupAndSaveDnsGenerator('yahoo.com'))
*/
