var input = require("input");
var chalk = require("chalk");
var GetClassNames = require("./classNames");
var GetStudentNames = require("./studentNames");
var AddNewStudents = require("./newStudent");
var StoreAttendance = require("./storeAttendance");
var fs = require("fs");

var pathToStudentNamesTxtFile = `D:/VS Code Workspace/Rough Space/workingProjects/Attendance-Management/documents/studentNames.txt`;

//$ Function to take the attendance in the online mode
async function TakeOnlineAttendance() {
    console.log(chalk.yellow(`Working for online attendance...`));
    const listClasses = await GetClassNames();
    // Telling teacher to select class if there is 2 or more class
    // If there is just one class, then automatically select that class
    if (listClasses.length >= 2) {
        var classSelected = await input.checkboxes(
            `Select class: `,
            listClasses
        );
        classSelected = classSelected[0];
    } else {
        var classSelected = listClasses[0];
    }
    // Empty the student names file
    fs.writeFile(pathToStudentNamesTxtFile, "", (err) => {
        if (err) throw err;
    });
    // Open the notepad to write down names of students
    var spawnObj = require("child_process").spawn,
        progToOpen = spawnObj("C:\\windows\\notepad.exe", [
            pathToStudentNamesTxtFile,
        ]);
    // Fetching names of students of this class from database
    var studentsList = await GetStudentNames(classSelected);
    // Waiting for the teacher to put the names
    const namesWritten = await input.confirm(
        `Proceed if you've entered all names: `
    );
    // If names of presentees has been written
    if (namesWritten) {
        // Getting the names of students from user input
        let namesFileContent = fs.readFileSync(
            pathToStudentNamesTxtFile,
            "utf-8"
        );
        var namesList = namesFileContent.split("\r\n");
        // Traversing through the list to detect if any new student has appeared
        for (let i = 0; i < namesList.length; i++) {
            // If student not in the list
            if (studentsList.indexOf(namesList[i]) <= -1) {
                console.log(
                    chalk.red(`Unidentified name ${namesList[i]} detected`)
                );
                // Is it a new student
                let isNewStudent = await input.checkboxes(
                    `Is ${namesList[i]} a new student? `,
                    ["Yes", "No", "Ignore it"]
                );
                // If new student
                if (isNewStudent == "Yes") {
                    AddNewStudents([namesList[i]], classSelected);
                    console.log(
                        chalk.green(
                            `${namesList[i]} successfully added to ${classSelected}`
                        )
                    );
                } else if (isNewStudent == "No") {
                    const realName = await input.checkboxes(
                        `Kindly select the real name of ${namesList[i]}: `,
                        studentsList
                    );
                    // Replacing the name with the real name
                    namesList[i] = realName;
                    console.log(
                        chalk.green(`Name replacement successfully done`)
                    );
                } else if (isNewStudent == "Ignore") {
                    console.log(chalk.green(`Name successfully ignored`));
                }
            }
        }
        // Now add the list of presentees to the database
        StoreAttendance(namesList, classSelected);
    }
}
module.exports = TakeOnlineAttendance;
