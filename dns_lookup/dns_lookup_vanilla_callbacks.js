var dns = require('dns'),
    fs = require('fs');

var lookupAndSaveDns = function(domain, done){
  dns.lookup(domain, function(err, address){
    if(err)
      done(err);
    else {
      fs.writeFile(url, address, function(err){
        if(err)
          done(err);
        else
          done(null, address);
      });
    }
  });
}

module.exports = lookupAndSaveDns;
