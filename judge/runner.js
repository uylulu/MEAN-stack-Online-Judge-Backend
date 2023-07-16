var { fork } = require('child_process');
const { log } = require('console');

var id = [];

const createId = () => {
    let newId = Math.floor(Math.random() * 1000000000);
    while(id.includes(newId)) {
        newId = Math.floor(Math.random() * 1000000000);
    }
    id.push(newId);
    return newId;
}

exports.run = (code, input) => {
    const child = fork('./judge/CppRunner.js');
    const newId = createId();

    child.send({code: code, input: input, id: newId});

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
