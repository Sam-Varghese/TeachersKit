// Connecting to mongo-db database
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

//$ Function to add a new student in a class into a database
function AddNewStudents(studentNamesArray, className) {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db(`PaulClasses`);
        dbo.collection(`classInformation`).updateOne(
            { className: className },
            { $push: { studentsList: { $each: studentNamesArray } } }
        ).then((data) => {db.close()});
    });
}

module.exports = AddNewStudents;