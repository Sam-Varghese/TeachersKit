var input = require("input");
var chalk = require("chalk");
var TakeOnlineAttendance = require("./onlineAttendance");
var TakeOfflineAttendance = require("./offlineAttendance");

//$ Function to start taking the attendance
async function TakeAttendance() {
    // Getting the type of attendance
    const attendanceType = await input.checkboxes(`Type of attendance: `, [
        `Online only`,
        `Online + Offline`,
        `Offline only`,
    ]);
    switch (attendanceType[0]) {
        case `Online only`:
            TakeOnlineAttendance();
            break;
        case `Online + Offline`:
            await TakeOnlineAttendance();
            await TakeOfflineAttendance();
            break;
        case `Offline only`:
            TakeOfflineAttendance();
            break;
        default:
            console.log(chalk.red(`Option does not exists.`));
            TakeAttendance();
    }
}
module.exports = TakeAttendance;