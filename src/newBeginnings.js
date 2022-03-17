var input = require("input");
var StartNewClass = require("./startNewClass");
var GetClassNames = require("./classNames");
var AddStudent = require("./addStudent");
var chalk = require("chalk");
async function NewBeginnings() {
    let startNew = await input.checkboxes(`What to do? `, [
        `Start new class`,
        `Add new student`,
    ]);
    switch (startNew[0]) {
        case `Start new class`:
            StartNewClass();
        case `Add new student`:
            let classNamesList = await GetClassNames();
            // Making the user select the class
            // If there's only 1 class yet
            if (classNamesList.length == 1) {
                console.log(
                    chalk.yellow(
                        `Automatically selecting the only class of Paul Classes, ie ${classNamesList[0]}`
                    )
                );
                var classSelected = classNamesList[0];
            } else {
                var classSelected = await input.checkboxes(
                    `Select the class of the new student: `,
                    classNamesList
                );
                classSelected = classSelected[0];
            }
            // Getting the name of new student
            let newStudentName = await input.text(`Name of new student: `);
            AddStudent(classSelected, newStudentName);
    }
}
module.exports = NewBeginnings;