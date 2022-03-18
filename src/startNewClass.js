var input = require("input");
var fs = require("fs");
var chalk = require("chalk");

var log = console.log;

// Connecting with mongodb
var mongoClient = require("mongodb").MongoClient;
var connectionUrl = "mongodb://localhost:27017/";

var pathToStudentNamesTxtFile = require("path").resolve(
    "documents/studentNames.txt"
);
var databaseName = `PaulClasses`;

//$ Function to create a new class, and store names of students in that class
async function StartNewClass() {
    // Taking input of class information
    const className = await input.text("Name of class: ");
    // Setting the database name to class name
    const classDescription = await input.text(
        `Description of the ${className}: `
    );
    const wannaInputStudentsList = await input.confirm(
        `Wanna give the list of students in ${className}: `
    );
    // If teacher wants to give names of students
    if (wannaInputStudentsList) {
        // Emptying the student names text file
        fs.writeFile(pathToStudentNamesTxtFile, "", (err) => {
            if (err) throw err;
        });
        // Open the notepad to write down names of students
        var spawnObj = require("child_process").spawn,
            progToOpen = spawnObj("C:\\windows\\notepad.exe", [
                pathToStudentNamesTxtFile,
            ]);
        // Waiting for user to write names of students
        const namesWritten = await input.confirm(
            `Select yes if you've noted down names of students: `
        );
        // If names have been written
        if (namesWritten) {
            let rawStudentsName = fs.readFileSync(
                pathToStudentNamesTxtFile,
                "utf-8"
            );
            const studentNames = rawStudentsName.split("\r\n");
            // Inserting data to mongodb-database
            mongoClient.connect(connectionUrl, (err, db) => {
                if (err) throw err;
                var dbo = db.db(databaseName);
                var databaseInformation = {
                    className: className,
                    classDescription: classDescription,
                    dateOfCreation: new Date().toGMTString(),
                    studentsList: studentNames,
                };
                dbo.collection("classInformation").insertOne(
                    databaseInformation,
                    (error, result) => {
                        if (error) throw error;
                        log(chalk.green(`Saved info. of ${className}`));
                        db.close();
                    }
                );
            });
        }
    } else {
        // Inserting the data to mong-db database
        mongoClient.connect(connectionUrl, (err, db) => {
            if (err) throw err;
            var dbo = db.db(databaseName);
            var databaseInformation = {
                className: className,
                classDescription: classDescription,
                dateOfCreation: new Date().toGMTString(),
                studentsList: [],
            };
            dbo.collection("classInformation").insertOne(
                databaseInformation,
                (error, result) => {
                    if (error) throw error;
                    log(chalk.green(`Saved info. of ${className}`));
                    db.close();
                }
            );
        });
    }
}

module.exports = StartNewClass;
