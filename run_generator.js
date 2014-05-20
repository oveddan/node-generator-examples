// source: slightly modified version of generator runner in http://strongloop.com/strongblog/how-to-generators-node-js-yield-use-cases/
var runGenerator = function (generator) {
  // initially - get to first yield
  yieldToNext()

  function yieldToNext (er, value) {
    debug('yielded to next with value ' + value);
    // whenever there is a callback with an error, exit by throwing that via the generator
    if (er) return generator.throw(er)
    // send value from the callback back into the generator, to be yielded
    debug('invoking generator.next(' + value + ')');
    var continuable = generator.next(value)

    // if no more yields left, we are done. return final value
    if (continuable.done) {
      debug('done running generator with result ' + continuable.value);
      return continuable.value
    }
    else {
      var callback = continuable.value
      // recursive call - pass the above yieldToNext as the callback to the yielded function
      debug('callback:\n' + callback + '\nwas yielded.  invoking it');
      callback(yieldToNext)
    }
  }
};

module.exports = runGenerator;
