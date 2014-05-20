var colors = require('colors');

module.exports = {
  print : function(toPrint){
    console.log(toPrint.green);
  },
  debug : function(toDebug) {
    console.log(toDebug.yellow);
  }
}
