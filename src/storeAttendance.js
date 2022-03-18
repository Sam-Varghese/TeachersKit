// Connecting to mongo-db database
var MongoClient = require("mongodb").MongoClient;
var chalk = require("chalk");
var url = "mongodb://localhost:27017/";

//$ Function to store the presentees list of a class into the database
function StoreAttendance(presenteesList, className, attendanceMode) {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db("PaulClasses");
        let JSONdata = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            date: new Date().getDate(),
            stringDate: new Date().toString(),
            presentees: presenteesList,
            mode: attendanceMode
        };
        dbo.collection(`${className}Attendance`).insertOne(JSONdata, (error, res) => {
            if (error) throw error;
            console.log(chalk.green(`Attendance data inserted successfully.`));
            db.close();
        })
    });
}

module.exports = StoreAttendance;