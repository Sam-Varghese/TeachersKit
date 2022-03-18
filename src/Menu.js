var input = require("input");
var chalk = require("chalk");
var NewBeginnings = require("./newBeginnings");
var TakeAttendance = require("./takeAttendance");
var ShowAttendanceRecords = require("./showRecords");
var EndJourney = require("./endJourney");
var UpdateSoftware = require("./updateApplication");
async function Menu() {
    // Showing user the checkbox
    var taskSelected = await input.checkboxes(`Select the task: `, [
        "New beginnings",
        "Take attendance",
        "Show records",
        "End journey",
        "Student records",
        "Update application",
    ]);
    // Functioning according to user input
    switch (taskSelected[0]) {
        case "New beginnings":
            NewBeginnings();
            break;
        case "Take attendance":
            TakeAttendance();
            break;
        case "Show records":
            ShowAttendanceRecords();
            break;
        case "End journey":
            EndJourney();
            break;
        case `Update application`:
            UpdateSoftware();
            break;
        default:
            console.log(chalk.red(`Incorrect option...`));
            console.log(chalk.yellow(`Kindly select again...`));
            Menu();
            break;
    }
}

module.exports = Menu;
