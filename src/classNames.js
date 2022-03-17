var input = require("input");
var chalk = require("chalk");

// Connecting to mongo-db database
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

//$ Function to return a promise to yield names of all classes
function GetClassNames() {
    return (getDataPromise = new Promise((resolve, reject) => {
        MongoClient.connect(url, (error, db) => {
            if (error) throw error;
            var dbo = db.db("PaulClasses");
            dbo.collection("classInformation")
                .find(
                    {},
                    {
                        projection: {
                            _id: 0,
                            className: 1,
                        },
                    }
                )
                .toArray((err, data) => {
                    if (err) throw err;
                    // Flattening the array
                    let finalData = data.map((item) => {
                        return item.className;
                     })
                    db.close();
                    resolve(finalData);
                });
        });
    }));
}

module.exports = GetClassNames;