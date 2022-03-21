var figlet = require("figlet");
const Menu = require("./src/Menu");
const chalk = require("chalk");

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
    while (true) {
        await Menu();
    }
});
