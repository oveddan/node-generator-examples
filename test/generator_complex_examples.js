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
  it('can call the asynchronous methods recursively', function(done){
    var asynchronousUrlShortener = function(url, callback) {
      var shortenedUrls = {
        'http://www.sitea.com' : 'http://m.s.l/5',
        'http://www.siteb.com' : 'http://m.s.l/2',
        'http://www.sitec.com' : 'http://m.s.l/9',
        'http://www.sited.com' : 'http://m.s.l/2',
        'http://www.sitef.com' : 'http://m.s.l/4',
      }

      setTimeout(function(){
        var shortenedUrl = shortenedUrls[url];
        callback(null, shortenedUrl);
      }, 100);
    }

    var urlShortenerThunk = function(url) {
      return function callbackForShortenUrl(callback) {
        asynchronousUrlShortener(url, callback);
      }
    };

    var generator = (function *(done){
      var urlsToShorten = [
        'http://www.siteb.com',
        'http://www.sited.com',
        'http://www.sitef.com',
        'http://www.sitea.com'
      ];

      var shortenedUrls = [];

      for(var i = 0; i < urlsToShorten.length; i++){
        var shortenedUrl = yield urlShortenerThunk(urlsToShorten[i]);
        shortenedUrls.push(shortenedUrl);
      };

      return shortenedUrls;
    })();

    var recursiveGeneratorRunner = function(gen, callback) {
      next()
 
      function next (er, value) { 
        if (er) return gen.throw(er);
        var continuable = gen.next(value);
        if (continuable.done) {
          callback(null, continuable.value);
        } else {
          var cbFn = continuable.value;
          cbFn(next);
        }
      }
    };


    recursiveGeneratorRunner(generator, function(err, result){
      expect(result).to.eql(['http://m.s.l/2', 'http://m.s.l/2', 'http://m.s.l/4', 'http://m.s.l/5']);
      done();
    });  
  });
});