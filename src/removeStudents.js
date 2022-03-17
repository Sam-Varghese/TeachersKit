var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
var chalk = require("chalk");

//$ Function to remove multiple students from a given class
// So, because students list is generated from classInformation list of students, hence removing students from classInformation would be sufficient
async function RemoveStudents(studentsToRemoveList, className, studentsList) {
    // Updating the studentsList of classInformation
    MongoClient.connect(url, (error, db) => {
        if (error) throw error;
        let dbo = db.db("PaulClasses");
        let query = { className: className };
        // Filtering the studentsList to remove the given students
        studentsList = studentsList.filter((element) => {
            return studentsToRemoveList.includes(element) == false;
        });
        // Updating the studentsList of database
        let newValues = { $set: { studentsList: studentsList } };
        dbo.collection("classInformation").updateOne(
            query,
            newValues,
            (err, res) => {
                if (err) throw err;
                console.log(chalk.green(`Students removed successfully`));
                db.close();
            }
        );
    });
}

module.exports = RemoveStudents;
