var input = require("input");
var chalk = require("chalk");
var NewBeginnings = require("./newBeginnings");
var TakeAttendance = require("./takeAttendance");
var ShowAttendanceRecords = require("./showRecords");
var EndJourney = require("./endJourney");
var UpdateSoftware = require("./updateApplication");
var Activator = require("./activator");
var open = require("open");
var GetClassInformation = require("./getClassInformation");
var GetClassNames = require("./classNames");
async function Menu() {
    let taskGenre = await input.checkboxes(`Select the task: `, [
        `Activator`,
        `Attendance`,
        `Records`,
        "Update application",
        "Report bugs/ request features",
    ]);
    switch (taskGenre[0]) {
        case `Activator`:
            await Activator();
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
                    await NewBeginnings();
                    break;
                case "Take attendance":
                    await TakeAttendance();
                    break;
                case "Show records":
                    await ShowAttendanceRecords();
                    break;
                case "End journey":
                    await EndJourney();
                    break;

                default:
                    console.log(chalk.red(`Incorrect option...`));
                    console.log(chalk.yellow(`Kindly select again...`));
                    await Menu();
                    break;
            }
            break;
        case `Update application`:
            await UpdateSoftware();
            break;
        case `Report bugs/ request features`:
            await open(
                "https://github.com/Sam-Varghese/TeachersKit/issues/new"
            );
            break;
        case `Records`:
            // Getting the type of record user wants
            let recordType = await input.checkboxes(
                `Select the type of record: `,
                [`Class records`, `Student records`]
            );
            // Looping over all the types selected
            for (let i = 0; i < recordType.length; i++) {
                // Working for each type
                // console.log(recordType[i]);
                switch (recordType[i]) {
                    case `Class records`:
                        // Making the user select the class
                        let classNamesList = await GetClassNames();
                        // Checking the length of the list of classes
                        if (classNamesList.length == 0) {
                            console.log(
                                chalk.red(
                                    `No class present in the database. Executing the batch job...`
                                )
                            );
                            break;
                        } else if (classNamesList.length == 1) {
                            console.log(
                                chalk.yellow(
                                    `Selecting the only class present in the database, ie: ${classNamesList[0]} automatically.`
                                )
                            );
                            var classSelected = classNamesList[0];
                        } else {
                            var classSelected = await input.checkboxes(
                                `Select the class: `,
                                classNamesList
                            );
                            classSelected = classSelected[0];
                        }
                        // Extracting the classInformation...
                        let classDetails = await GetClassInformation(
                            classSelected
                        );
                        console.log(
                            chalk.blue(`Class name: `),
                            `${classDetails.className}`
                        );
                        console.log(
                            chalk.blue(`Class description: `),
                            `${classDetails.classDescription}`
                        );
                        console.log(
                            chalk.blue(`Creation date: `),
                            `${classDetails.dateOfCreation}`
                        );
                        console.log(chalk.blue(`Students list: `));
                        classDetails.studentsList.forEach((element) => {
                            console.log(`${element}`);
                        });
                        console.log(chalk.blue(`Activator links: `));
                        classDetails.activatorLinks.forEach((link) => {
                            console.log(link);
                        });

                        break;
                    case `Student records`:
                        break;
                    default:
                        console.log(
                            chalk.red(
                                `Incorrect option selected. Kindly select again...`
                            )
                        );
                        // For making them select again
                        i--;
                        break;
                }
            }
            break;
        default:
            console.log(chalk.red(`Incorrect option, kindly select again...`));
            await Menu();
            break;
    }
}

module.exports = Menu;
