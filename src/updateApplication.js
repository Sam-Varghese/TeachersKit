const chalk = require("chalk");
const exec = require("child_process").exec;
const process = require("process");
const input = require("input");

//$ Function to update this software
/* Update basically means to execute the following commands:
git pull
npm i
*/
async function UpdateSoftware() {
    return new Promise((resolve, reject) => {
        
        console.log(chalk.blue(`Updating the software...\nPulling the updates...`));
        // Executing git pull
        exec("git pull", (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(chalk.red(`Pulling changes failed...`))
                console.log(`exec error: ${error}`);
                console.log(chalk.blue(`Installing the dependencies...`));
            } else {
                console.log(chalk.green(`Changes from remote repository pulled successfully.`));
                console.log(chalk.blue(`Installing the dependencies...`));
            }
        });
        // Executing npm i
        exec("npm i", async(error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(chalk.red(`Installation of packages failed...`))
                console.log(`exec error: ${error}`);
            } else {
                console.log(chalk.green(`Installation successfully done...`));
                console.log(chalk.green(`Updates successfully made. Terminating the job...`));
            }
            console.log(chalk.red(`KINDLY RESTART THE PROGRAM... for the updates to take effect`));
            await input.confirm(`Press enter to exit: `);
            process.exit(1);
        });
    })
}
module.exports = UpdateSoftware;