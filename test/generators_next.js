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

      describe('when there is a return value', function(){
        it('should assign the return value to .value', function(){
          // TODO: write this
        });
      });

      it('should raise an error when next is called', function(){
        // iterate again past last point of code
        expect(generator.next).to.throw(Error);
      });
    });  
  });

  describe('next() when a function is yielded', function(){
    it('invokes the function', function(){
      var methodCalled = false;

      var method = function (){
        methodCalled = true;
      };

      var generator = (function *(){
        yield method();
      })();

      generator.next();

      expect(methodCalled).to.be.true;
    });
    describe('when a function that returns another function is yielded', function(){
      it('that returned function can be invoked', function(done){
        var callbackWrapper = function (){
          return function(callback) {
            callback(null, 5);
          };
        };

        var generator = (function *(){
          yield callbackWrapper();
        })();

        var currentIteration = generator.next();

        currentIteration.value(function(err, result){      
          expect(result).to.eq(5);
          done();
        });
      });
      describe('when that returned function is invoked', function(){
        it('does not continue the execution of the generator', function(){
          var callbackWrapper = function (){
            return function() {};
          };

          var result = null;
          var generator = (function *(){
            yield callbackWrapper();
            result = 5;
          })();

          var iteration = generator.next();

          iteration.value();

          expect(result).to.eq(null);
        });
      });
      describe('when next(value) is invoked within the callback', function(){
        it('it returns the value to the yield statement and continues execution', function(done){
          var delayedIncrement = function (){
            return function(toIncrement, callback) {
              callback(null, toIncrement + 1);
            };
          };

          var generator = (function *(){
            var incremented = yield delayedIncrement();

            return incremented;
          })();

          var iteration = generator.next();

          iteration.value(3, function(e, result){
            var finalIteration = generator.next(result);
            expect(finalIteration.value).to.eq(4);
            done();
          });
        });          
      });
    });
  });
});