var expatparser = require('./').parser;


//simple:

var parser=new expatparser(); // new instance of parser 
parser.parser.parse( "<html><head><fb:media title=\"foo\" /></head><body bgcolor=\"#FFFFFF\">text</body>", false );
console.log("print tree:");
console.log(require('sys').inspect(parser.root,true,10));
console.log("print selected tree, note how it takes on the parent:");
console.log(require('sys').inspect(parser.root.html.body,true,10));

require('fs').readFile(__dirname+'/test_data.html','utf-8', function (err, data) {if (err) throw err;

  console.log(data);
});