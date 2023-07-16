const { log } = require('console');
var fs = require('fs');
const { execFile , exec } = require('child_process');

const compileCode = (code, id) => {
    var newCode = fs.createWriteStream(`./temp/${id}.cpp`);
    newCode.write(code);
    newCode.end();

    return new Promise((resolve, reject) => {
        const child = execFile('g++', [`./temp/${id}.cpp`, '-o', `./temp/${id}`], (error, stdout, stderr) => {
            if(error) {
                log(error);
                return;
            }
            console.log(stdout);
            resolve();
        });
        
    })

}

var isolate_directory = "/var/local/lib/isolate/0"

process.on('message', async (message) => {
    var id = message.id,code = message.code;

    await compileCode(code, id);

    exec(`isolate --init`);

    // copy exec file to isolate directory
    fs.copyFileSync(`./temp/${id}`, isolate_directory + `/box/${id}`);
    
    // put input in isolate directory
    fs.writeFileSync(isolate_directory + `/box/${id}.in`, message.input);
    
    // put output in isolate directory
    fs.writeFileSync(isolate_directory + `/box/${id}.out`, '');
    
    // run the exec file
    exec(`isolate --stdin=${id}.in --stdout=${id}.out --mem=256000 --time=1 --run ${id}`, (error, stdout, stderr) => {
        if(error) {
            log(error);
            process.send({status: "error", message: error});
            return;
        }
        console.log(stdout);
        var output = fs.readFileSync(isolate_directory + `/box/${id}.out`, 'utf8');
        process.send({status: "success", message: output});
    });
});