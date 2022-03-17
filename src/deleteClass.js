var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
var chalk = require("chalk");

//$ Function to delete a given class from the mongodb-database
async function DeleteClass(className) {
    // Connecting to the database
    MongoClient.connect(url, (error, db) => {
        if (error) throw error;
        var dbo = db.db("PaulClasses");
        var query = { className: className };
        // Deleting the class records from classInformation collection
        dbo.collection("classInformation").deleteOne(query, (err, res) => {
            if (err) throw err;
            console.log(chalk.green(`Deleted information of ${className}`));
        });
        // Deleting the attendance records collection of that class
        dbo.collection(`${className}Attendance`).drop((err, deleted) => {
            if (err) throw err;
            if (deleted)
                console.log(
                    chalk.green(
                        `Attendance records of ${className} deleted successfully.`
                    )
                );
            db.close();
        });
    });
}

module.exports = DeleteClass;
