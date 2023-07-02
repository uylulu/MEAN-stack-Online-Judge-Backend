var compilex = require('compilex');
var env = { OS : "linux" , cmd : "g++" , options : {timeout:10000}};
const { log } = require('console');
compilex.init({ stats : true });

process.on('message', (message) => {

    if(!message.input) {
        compilex.compileCPP(env , message.code , function (data) {
            if(data.error) {
                console.log(data.error);
                process.send({status: "error", message: data.error, data: null});
            }
            else {
                process.send({status: "success", message: data.output, data: null});
            }
        });
    } else {
        compilex.compileCPPWithInput(env , message.code , message.input , function (data) {
            console.log("RAN WITH INPUT")
            
            if(data.error) {
                console.log(data.error);
                process.send({status: "error", message: data.error, data: null});
            }
            else {
                process.send({status: "success", message: data.output, data: null});
            }
        });
    }

});