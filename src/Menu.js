var input = require("input");
var chalk = require("chalk");
var NewBeginnings = require("./newBeginnings");
var TakeAttendance = require("./takeAttendance");
var ShowAttendanceRecords = require("./showRecords");
var EndJourney = require("./endJourney");
var UpdateSoftware = require("./updateApplication");
var Activator = require("./activator");
var open = require("open");
async function Menu() {
    let taskGenre = await input.checkboxes(`Select the task: `, [
        `Activator`,
        `Attendance`,
        "Update application",
        "Report bugs/ request features",
    ]);
    switch (taskGenre[0]) {
        case `Activator`:
            Activator();
            break;
        case `Attendance`:
            // Showing user the checkbox
            var taskSelected = await input.checkboxes(`Select the task: `, [
                "New beginnings",
                "Take attendance",
                "Show records",
                "End journey",
                "Student records",
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

                default:
                    console.log(chalk.red(`Incorrect option...`));
                    console.log(chalk.yellow(`Kindly select again...`));
                    Menu();
                    break;
            }
        case `Update application`:
            UpdateSoftware();
            break;
        case `Report bugs/ request features`:
            await open(
                "https://github.com/Sam-Varghese/TeachersKit/issues/new"
            );
            break;
        default:
            console.log(chalk.red(`Incorrect option, kindly select again...`));
            Menu();
            break;
    }
}

module.exports = Menu;
