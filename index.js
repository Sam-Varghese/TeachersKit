var figlet = require("figlet");
const Menu = require("./src/Menu");
const chalk = require("chalk");

var figletPromise = new Promise((resolve, reject) => {
    figlet("Attendance", function (err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        resolve("Done sir");
    });
});

figletPromise.then((data) => {
    Menu();
});
