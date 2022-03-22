var figlet = require("figlet");
const input = require("input");
const Menu = require("./src/Menu");
const chalk = require("chalk");
const checkUpdates = require("./src/checkForUpdates");
const UpdateSoftware = require("./src/updateApplication");
// Clearing the console
console.clear();

// Fancy fonts through figlet
var figletPromise = new Promise((resolve, reject) => {
    figlet("Attendance", function (err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(data);
        resolve("Done sir");
    });
});

// Printing out the menu options
figletPromise.then(async (data) => {
    // Check for updates...
    let updateStatus = await checkUpdates();
    if (updateStatus) {
        console.log(chalk.yellow(`Updates available...`));
        await input
            .confirm(`Would you like to update the application?`)
            .then(async (response) => {
                if (response) {
                    await UpdateSoftware();
                }
            });
    }

    while (true) {
        await Menu();
    }
});
