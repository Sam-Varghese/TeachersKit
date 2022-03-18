var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
var open = require("open");

async function ActivateClass(className) {
    // Extracting the links from mongodb
    MongoClient.connect(url, (error, db) => {
        if (error) throw error;
        let dbo = db.db("PaulClasses");
        dbo.collection("classInformation").findOne(
            { className: className },
            { projection: { _id: 0, activatorLinks: 1 } },
            (err, res) => {
                if (err) throw err;
                if (res.activatorLinks.length == 0) {
                    console.log(
                        chalk.red(
                            `No links found in the database for this class`
                        )
                    );
                }
                res.activatorLinks.forEach((url) => open(url));
                db.close();
            }
        );
    });
}
module.exports = ActivateClass;