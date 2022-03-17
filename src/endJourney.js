var input = require("input");
var chalk = require("chalk");
var DeleteClass = require("./deleteClass");
var GetClassNames = require("./classNames");
var GetStudentNames = require("./studentNames");
var RemoveStudents = require("./removeStudents");
async function EndJourney() {
    var endJourneyType = await input.checkboxes(`What do you wanna end? `, [
        `Delete class`,
        `Remove student`,
    ]);
    // Making the user select the class name
    let classNamesList = await GetClassNames();
    // If there's only 1 class yet, then automatically select that class
    if (classNamesList.length == 1) {
        console.log(
            chalk.yellow(
                `Selecting the only class of Paul Classes, ie ${classNamesList[0]}`
            )
        );
        classSelected = classNamesList;
    } else {
        let classSelected = await input.checkboxes(
            `Select the class to delete: `,
            classNamesList
        );
    }
    switch (endJourneyType[0]) {
        case `Delete class`:
            // Deleting the class
            DeleteClass(classSelected[0]);
            break;
        case `Remove student`:
            // Getting the student name
            let studentNamesList = await GetStudentNames(classSelected[0]);
            // If there's only 1 student in the class
            if (studentNamesList.length == 1) {
                let removeStudent = await input.confirm(
                    `Do you wanna remove ${studentNamesList[0]}: `
                );
                if (removeStudent) {
                    // Removing the students
                    RemoveStudents(
                        [studentNamesList[0]],
                        classSelected[0],
                        studentNamesList
                    );
                }
            } else {
                let studentSelected = await input.checkboxes(
                    `Select the students`,
                    studentNamesList
                );
                // Removing the students
                RemoveStudents(
                    studentSelected,
                    classSelected[0],
                    studentNamesList
                );
            }
    }
}

module.exports = EndJourney;
