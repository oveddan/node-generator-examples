var chai = require('chai'),
  expect = chai.expect;

describe('function *()', function(){
  describe('next() with synchronous yield', function(){
    var synchronousGeneratorFunction = function *(){
      var currentValue = 0,
          maxValue = 2;

      while(currentValue <= maxValue) {
        yield currentValue;
        currentValue++;
      }
    };

    it('should execute until the yield and return its value', function(){
      var generator = synchronousGeneratorFunction();

      expect(generator.next().value).to.eq(0);
      expect(generator.next().value).to.eq(1);
      expect(generator.next().value).to.eq(2);
    });

    it('should have done=false when there are no more yields left', function(){
      var generator = synchronousGeneratorFunction();

      expect(generator.next().done).to.be.false;
      expect(generator.next().done).to.eq.false;
      expect(generator.next().done).to.eq.true;
    });

    describe('when there is no more code left to run', function(){
      var generator,
        currentIteration;

      before(function(){
        generator = synchronousGeneratorFunction();

        generator.next();
        generator.next();
        generator.next();
        currentIteration = generator.next();
      });

      describe('when there is no return value', function(){
        it('should have an undefined value and be done', function(){
          expect(currentIteration.value).to.be.undefined;
          expect(currentIteration.done).to.be.true;
        });
      });

      it('should raise an error when next is called', function(){
        // iterate again past last point of code
        expect(generator.next).to.throw(Error);
      });
    });  
  });

  describe('next() with callback for the yield', function(){
    describe('when callback does not callback with a value', function(){
      it('invokes the callback', function(){
        var calledBack = false;

        var callback = function (){
          calledBack = true;
        };

        var generator = (function *(){
          yield callback();
        })();

        generator.next();

        expect(calledBack).to.be.true;
      });
    });
    describe('when callback calls back with a value', function(){
      it('has a value of the callbacks value', function(){
        var callbackWrapper = function (){
          return function(callback) {
            callback(null, 5);
          };
        };

        var result = null;
        var generator = (function *(){
          result = yield callbackWrapper();
          return result;
        })();

        var currentIteration = generator.next();
        
        expect(result).to.eq(5);
      })
    });
  });
});

var callbackWrapper = function (){
  return function(callback) {
    callback(null, 5);
  };
};

var result = null;
var generator = (function *(){
  result = yield callbackWrapper();
})();

var nextIteration = generator.next();

// nextIteration.value is a function