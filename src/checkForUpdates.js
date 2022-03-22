const exec = require("child_process").exec;
var chalk = require("chalk");
async function checkUpdates() {
    return new Promise((resolve, reject) => {
        exec(`git status`, (error, stdout, stderr) => {
            if (stdout.includes(`branch is behind`)) {
                resolve( true);
            } else {
                resolve( false);
            }
        });
    });
}
module.exports = checkUpdates;
