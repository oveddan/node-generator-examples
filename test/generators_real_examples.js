var chai = require('chai'),
  expect = chai.expect;

describe('real generator examples', function(){
  it('can get the results from two asynchronous web requests', function(done){
    var fakeAjax = function(url, callback) {
      setTimeout(function() {
        var response = (url == 'http://www.mysite.biz' ? 'mysite' : 'theirsite');
        callback(null, response);
      }, 200);
    };

    var fakeAjaxThunk = function(url){
      return function(callback) {
        fakeAjax(url, callback)
      }
    }

    var generator = (function *(){
      var result = {};

      result.mine = yield fakeAjaxThunk('http://www.mysite.biz');
      result.them = yield fakeAjaxThunk('http://www.myrtle.gov');

      return result;
    })();


    generator.next().value(function(err, result){
      var nextIteration = generator.next(result);

      nextIteration.value(function(err, result){
        var finalResult = generator.next(result).value;
        expect(finalResult).to.eql({
          mine: 'mysite',
          them: 'theirsite'
        });
        done();
      });
    });
  });
});