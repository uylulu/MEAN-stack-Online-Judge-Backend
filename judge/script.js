const { execFile, exec } = require('child_process');
var fs = require('fs');
var code = fs.readFileSync('sample.cpp', 'utf8');

var runner = require('./runner');

var output = runner.run(code, "12");

output.then((message) => {
    console.log(message);
})