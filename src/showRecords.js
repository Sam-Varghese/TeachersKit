var input = require("input");
var GetClassNames = require("./classNames.js");
var GetStudentNames = require("./studentNames");
var chalk = require("chalk");
var {
    FetchAllAttendanceRecordsOfStudent,
    AttendanceOfStudentOfMonth,
    CheckAttendanceOfStudentOnDay,
} = require("./fetchAttendanceRecords");
var chalk = require("chalk");
//$ Function to show the attendance records of the students
async function ShowAttendanceRecords() {
    const classNamesList = await GetClassNames();
    // If there's just one class yet
    if (classNamesList.length == 1) {
        console.log(
            chalk.yellow(
                `Automatically selecting the only class in Paul Classes, ie ${classNamesList[0]}`
            )
        );
        var classesSelected = classNamesList;
    } else {
        var classesSelected = await input.checkboxes(
            `Select class: `,
            classNamesList
        );
    }
    // Asking the types of records to fetch
    const recordType = await input.checkboxes(`Select the records to fetch: `, [
        `Attendance records of a student`,
        `Class attendance records`,
    ]);
    for (let i = 0; i < recordType.length; i++) {
        switch (recordType[i]) {
            case "Attendance records of a student":
                // Asking the student name
                const studentNames = await GetStudentNames(classesSelected[0]);
                // If there are no students in the class
                if (studentNames.length == 0) {
                    console.log(
                        chalk.red(`No student available for this class.`)
                    );
                    return null;
                    // If there's one student in the class
                } else if (studentNames.length == 1) {
                    console.log(
                        chalk.yellow(
                            `Automatically selecting the only student of the class ${studentNames[0]}`
                        )
                    );
                    const studentsSelected = studentNames;
                    // If there are multiple students in the class
                } else {
                    const studentsSelected = await input.checkboxes(
                        `Select the students: `,
                        studentNames
                    );
                }
                // Asking the time range of records and iterating through all the students selected
                for (let j = 0; j < studentsSelected.length; j++) {
                    const typeStudentRecord = await input.checkboxes(
                        `Select the type of record for ${studentsSelected[j]}`,
                        [`All records`, `Records of a month`, `Record of a day`]
                    );
                    switch (typeStudentRecord[0]) {
                        // Fetching all records of a student
                        case `All records`:
                            await FetchAllAttendanceRecordsOfStudent(
                                studentsSelected[j],
                                classesSelected[0]
                            ).catch((error) => {
                                // If the data doesn't exists
                                console.log(
                                    chalk.yellow(
                                        `Terminating the batch job because of the following reason from the function: \n${error}`
                                    )
                                );
                            });
                            break;
                        // Fetching records of a student for a month
                        case `Records of a month`:
                            await AttendanceOfStudentOfMonth();
                            break;
                        // Accessing the attendance of a student on a day
                        case `Record of a day`:
                            const date = await input.checkboxes(
                                `Select the date: `,
                                [...Array(32).keys()].map(String)
                            );
                            // Storing information of months
                            const monthInfo = {
                                0: "January",
                                1: "February",
                                2: "March",
                                3: "April",
                                4: "May",
                                5: "June",
                                6: "July",
                                7: "August",
                                8: "September",
                                9: "October",
                                10: "November",
                                11: "December",
                            };
                            let month = await input.checkboxes(
                                `Select the month`,
                                Object.values(monthInfo)
                            );
                            const year = await input.checkboxes(
                                `Select the year: `,
                                [2022, 2023, 2024, 2025].map(String)
                            );
                            await CheckAttendanceOfStudentOnDay(
                                studentsSelected[j],
                                classesSelected[0],
                                date,
                                monthInfo[month],
                                year
                            );
                            break;
                    }
                }
                break;
            case "Class attendance records":
                //! To be continued
                console.log(chalk.yellow(`This feature will be available in the future. Currently it is in progress.`));
                break;
                let classNamesList = await GetClassNames();
                if (classNamesList.length == 0) {
                    console.log(
                        chalk.red(`No class available in the database.`)
                    );
                } else if (classNamesList.length == 1) {
                    console.log(
                        chalk.yellow(
                            `Automatically selecting the only class in the database, ie ${classNamesList[0]}`
                        )
                    );
                    const classSelected = classNamesList[0];
                } else {
                    const classSelected = await input.checkboxes(
                        `Select the class: `,
                        GetClassNames
                    );
                }
                
        }
    }
}
module.exports = ShowAttendanceRecords;
