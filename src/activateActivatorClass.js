var input = require("input");
var chalk = require("chalk");
var GetClassNames = require("./classNames");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";

//$ Function to activate a class through activator
async function ActivateActivatorClass() {
    // Getting the className from the user
    const classNames = await GetClassNames();
    const classSelected = await input.checkboxes(
        `Select the class you wanna activate: `,
        classNames
    );
    // Asking the links and storing them in linksArray
    let linksArray = [];
    let looper = true;
    while (looper) {
        let link = await input.text(`Enter a link: `);
        linksArray.push(link);
        looper = await input.confirm(`want to enter more links? `);
    }
    // Storing the data in mongo-db
    MongoClient.connect(url, (error, db) => {
        if (error) throw error;
        let dbo = db.db("PaulClasses");
        let query = { className: classSelected[0] };
        let newValues = { $set: { activatorLinks: linksArray } };
        dbo.collection("classInformation").updateOne(
            query,
            newValues,
            (err, res) => {
                if (err) throw err;
                console.log(chalk.green(`Updated the database successfully`));
                db.close();
            }
        );
    });
}

module.exports = ActivateActivatorClass;