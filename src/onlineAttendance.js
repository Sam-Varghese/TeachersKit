var input = require("input");
var chalk = require("chalk");
var GetClassNames = require("./classNames");
var GetStudentNames = require("./studentNames");
var AddNewStudents = require("./newStudent");
var StoreAttendance = require("./storeAttendance");
const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";
var fs = require("fs");
var GetIgnoredStudentsList = require("./getOnlineAttendanceIgnoredStudents");
var pathToStudentNamesTxtFile = require("path").resolve(
    "documents/studentNames.txt"
);
var _ = require("lodash");

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
        // Getting the name of students that needs to get ignored
        const ignoredStudentsList = await GetIgnoredStudentsList(classSelected);
        // Removing students to get ignored from namesList
        _.remove(namesList, (element) => {
            (ignoredStudentsList.includes(element)) ? console.log(chalk.yellow(`Ignoring ${element}...`)) : console.log();
            return ignoredStudentsList.includes(element);
        });
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
                isNewStudent = isNewStudent[0];
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
                } else if (isNewStudent == "Ignore it") {
                    _.pull(namesList, namesList[i]);
                    console.log(chalk.green(`Name successfully ignored`));
                    // Script to add this name to the automatic ignore names list
                    /*
                    Context: In online attendance, there will be situations where the teacher would want to have some names ignored by the program automatically, instead of them manually giving instructions to ignore
                    */
                    const moveToIgnoreList = await input.confirm(
                        `Would you like to move this name to automatic ignore list? `
                    );
                    // If the name needs to be ignored automatically
                    if (moveToIgnoreList) {
                        // Checking if the ignoreOnlineStudentsList exists as a property in the document or not
                        MongoClient.connect(url, (error, db) => {
                            if (error) {
                                console.log(
                                    chalk.red(
                                        `Unable to connect to the database`
                                    )
                                );
                                console.log(err);
                            } else {
                                let dbo = db.db(`PaulClasses`);
                                dbo.collection(`classInformation`)
                                    .find(
                                        { className: classSelected },
                                        {
                                            projection: {
                                                _id: 0,
                                                ignoreOnlineStudentsList: 1,
                                            },
                                        }
                                    )
                                    .toArray((err, res) => {
                                        if (err) throw err;
                                        // If the property does not exists
                                        if (res == [{}]) {
                                            console.log(
                                                chalk.green(
                                                    `Creating ignoreOnlineStudentsList property in the document...`
                                                )
                                            );
                                            // Adding ignoreOnlineStudentsList property
                                            dbo.collection(
                                                `classInformation`
                                            ).updateOne(
                                                { className: classSelected },
                                                {
                                                    $set: {
                                                        ignoreOnlineStudentsList:
                                                            [namesList[i]],
                                                    },
                                                },
                                                (error1, res) => {
                                                    if (error1) throw error1;
                                                    db.close();
                                                }
                                            );
                                        } else {
                                            // If the property already exists
                                            dbo.collection(
                                                `classInformation`
                                            ).updateOne(
                                                { className: classSelected },
                                                {
                                                    $push: {
                                                        ignoreOnlineStudentsList:
                                                            namesList[i],
                                                    },
                                                }, (error2, res) => {
                                                    if (error2) throw error2;
                                                    db.close();
                                                }
                                            );
                                        }
                                    });
                                // db.close();
                            }
                        });
                    }
                }
            }
        }
        // Now add the list of presentees to the database
        StoreAttendance(namesList, classSelected, `Online`);
    }
}
module.exports = TakeOnlineAttendance;