var fs = require('fs');
var code = fs.readFileSync('sample.cpp', 'utf8');

var runner = require('./runner');

async function test() {
    var output = await runner.run(code, "ASD");
    console.log(output);
}

test();

