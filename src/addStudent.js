var chalk = require("chalk");
var input = require("input");
var GetStudentNames = require("./studentNames");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";

async function AddStudent(className, studentName) {
    let studentNamesList = await GetStudentNames(className);
    // Checking if the studentName already exists in the class
    if (studentNamesList.includes(studentName)) {
        console.log(chalk.red(`${studentName} already exists in the class`));
        let changeName = await input.confirm(
            `Would you like to change the name? `
        );
        if (changeName) {
            let newName = await input.text(
                `Enter the new name of ${studentName}: `
            );
            // Implementing a recursive approach
            AddStudent(className, newName);
            return null;
        }
    }
    // If the name is unique
    studentNamesList.push(studentName);
    // Updating the studentsList of classInformation
    MongoClient.connect(url, (error, db) => {
        if (error) throw error;
        let dbo = db.db("PaulClasses");
        let query = { className: className };
        let newValues = { $set: { studentsList: studentNamesList } };
        dbo.collection("classInformation").updateOne(
            query,
            newValues,
            (err, res) => {
                if (err) throw err;
                console.log(
                    chalk.green(
                        `${studentName} added to ${className} successfully.`
                    )
                );
                db.close();
            }
        );
    });
}

module.exports = AddStudent;
