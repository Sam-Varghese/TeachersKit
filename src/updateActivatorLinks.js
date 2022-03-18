var input = require("input");
var chalk = require("chalk");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

//$ Function to add array of links to activatorLinks array in classInformation collection
async function AddLinks(linksArray, className) {
    // Pushing into the urls array in mongodb
    MongoClient.connect(url, (error, db) => {
        if (error) throw error;
        let dbo = db.db("PaulClasses");
        let query = { className: className };
        let valueToGetPushed = {
            $push: { activatorLinks: { $each: linksArray } },
        };
        dbo.collection("classInformation").updateOne(
            query,
            valueToGetPushed,
            (err, res) => {
                if (err) throw err;
                console.log(
                    chalk.green(
                        `Link successfully pushed to the array in database.`
                    )
                );
                db.close();
            }
        );
    });
}

//$ Function to remove an array of links from activatorLinks of classInformation collection
async function RemoveLinks(linksArray, className) {
    // Removing all the elements mentioned in the array from mongo-db database
    MongoClient.connect(url, (error, db) => {
        if (error) throw error;
        let dbo = db.db("PaulClasses");
        let query = { className: className };
        dbo.collection("classInformation").updateMany(
            query,
            { $pull: { activatorLinks: { $in: linksArray } } },
            (err, res) => {
                if (err) throw err;
                console.log(
                    chalk.green(
                        `Links successfully removed the the array in database.`
                    )
                );
                db.close();
            }
        );
    });
}

module.exports = { AddLinks, RemoveLinks };