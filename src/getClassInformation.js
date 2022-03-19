var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";

//$ Function to fetch class records from the classInformation collection
async function GetClassInformation(className) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (error, db) => {
            if (error) throw error;
            let dbo = db.db("PaulClasses");
            let query = { className: className };
            dbo.collection("classInformation").findOne(query, (err, res) => {
                if (err) throw err;
                db.close();
                resolve(res);
            });
        });
    });
}

module.exports = GetClassInformation;
// GetClassInformation('Trialclass').then(data => console.log(data))