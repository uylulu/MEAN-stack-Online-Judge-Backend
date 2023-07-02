var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var runner = require('../judge/runner');
var { log } = require('console');

var problemSchema = new Schema({
    name: { type : String, unique : true, required : true},
    legend: { type : String, required : true},
    input: { type : Array, required : true},
    output: { type : Array, required : true},
    cppSolution : { type : String, required : true},
    cppGenerator : { type : String, required : true},
    status: { type : String }
});

problemSchema.method("add", function(req) {
    this.name = req.name;
    this.legend = req.legend;
    this.input = [];
    this.output = [];
    this.cppSolution = req.cppSolution;
    this.cppGenerator = req.cppGenerator;

})

problemSchema.method("addInput",async function() {
    // return a promise
    return new Promise((resolve, reject) => {
        for(let i = 0;i < 1;i++) {
            let inp_promise = runner.run(this.cppGenerator);
            inp_promise.then((inp) => {
                this.input.push(inp);
                let out_promise = runner.run(this.cppSolution, inp);
                out_promise.then((out) => {
                    this.output.push(out);
                    if(this.input.length == 1 && this.output.length == 1) {
                        resolve();
                    }
                });
            });
        }
    });
});

problemSchema.method("validateSolution", async function(solution) {
    for(let i = 0;i < 1;i++) {
        let output = await runner.run(solution, this.input[i]);
        if(output != this.output[i]) {
            return "Wrong Answer";
        }
    }
    return "Accepted";
});

module.exports = mongoose.model('Problem', problemSchema);