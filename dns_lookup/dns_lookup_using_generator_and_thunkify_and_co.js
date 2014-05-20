var co = require('co'),
  thunkify = require('thunkify'),
  fs = require('fs'),
  dns = require('dns');

var dnsLookup = thunkify(dns.lookup),
  writeFile = thunkify(fs.writeFile);

co(function *(){
  var address = yield(dnsLookup('cnn.com'));
  yield writeFile('cnn.com', address);
})();
