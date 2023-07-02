var { fork } = require('child_process');
const { log } = require('console');

exports.run = (code, input) => {
    const child = fork('./judge/CppRunner.js');
    child.send({code: code, input: input});        

    return new Promise((resolve, reject) => {
        child.on('message', (message) => {
            // log(message);
            if(message.status == "success") {
                resolve(message.message);
            }
            else {
                reject(message.message);
            }
            child.kill();
        });
    });
}
