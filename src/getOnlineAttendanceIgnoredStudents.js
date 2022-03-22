const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";
var chalk = require("chalk");

//$ Function to get the list of students that needs to get ignored during online attendance
async function GetIgnoredStudentsList(className) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (error, db) => {
            if (error) {
                console.log(chalk.red(`Failed to connect to the database`));
                console.log(error);
            } else {
                let dbo = db.db(`PaulClasses`);
                dbo.collection(`classInformation`)
                    .find(
                        { className: className },
                        { projection: { _id: 0, ignoreOnlineStudentsList: 1 } }
                    )
                    .toArray((err, res) => {
                        if (err) throw err;
                        db.close();
                        resolve(res[0].ignoreOnlineStudentsList);
                    });
            }
        });
    });
}
module.exports = GetIgnoredStudentsList;