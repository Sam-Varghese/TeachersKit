// Connecting to mongo-db database
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

//$ Function to return the student names of a specific class
function GetStudentNames(className) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (error, db) => {
            if (error) return error;
            var dbo = db.db("PaulClasses");
            var query = { className: className };
            dbo.collection("classInformation")
                .find(query, { projection: { studentsList: 1, _id: 0 } })
                .toArray((err, data) => {
                    if (err) throw err;
                    db.close();
                    resolve([...new Set(data[0].studentsList)]);
                });
        });
    });
}

module.exports = GetStudentNames;