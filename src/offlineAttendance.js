var input = require("input");
var chalk = require("chalk");
var StoreAttendance = require("./storeAttendance");
var GetClassNames = require("./classNames");
var GetStudentNames = require("./studentNames");

//$ Function to take attendance of student who appeared in offline mode
async function TakeOfflineAttendance(className) {
    console.log(chalk.yellow(`Working for offline attendance...`));
    const listClasses = await GetClassNames();
    // Telling teacher to select class if there is 2 or more class
    // If there is just one class, then automatically select that class
    if (listClasses.length >= 2) {
        var className = await input.checkboxes(
            `Select class: `,
            listClasses
        );
        className = listClasses[0];
    } else {
        var className = listClasses[0];
    }
    const studentsList = await GetStudentNames(className);
    const presenteesList = await input.checkboxes(
        `Select the list of attendees: `,
        studentsList
    );
    StoreAttendance(presenteesList, className);
}

module.exports = TakeOfflineAttendance;