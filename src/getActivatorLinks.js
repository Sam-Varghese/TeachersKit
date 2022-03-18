var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";

//$ Function to return links to get activated for a given class
async function GetActivatorLinks(className) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (error, db) => {
            if (error) throw error;
            let dbo = db.db("PaulClasses");
            dbo.collection("classInformation").findOne(
                { className: className },
                { projection: { _id: 0, activatorLinks: 1 } },
                (err, res) => {
                    if (err) throw err;
                    db.close();
                    resolve(res.activatorLinks);
                }
            );
        });
    });
}

module.exports = GetActivatorLinks;