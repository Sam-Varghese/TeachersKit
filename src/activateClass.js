var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
var open = require("open");
var _ = require("lodash");
var chalk = require("chalk");
const { exec } = require("child_process");

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
                res.activatorLinks.forEach((url) => {
                    // Detecting whether the url is a link or path to a file
                    /*
                    Link will always contain one of the following:
                    https://
                    http://
                    www.
                    */
                    if (
                        _.startsWith(url, "https://") == false &&
                        _.startsWith(url, "http://") == false &&
                        _.startsWith(url, "www.") == false
                    ) {
                        console.log(chalk.blue(`Opening the file: ${url}`));
                        // Opening the file by powershell command, ie Invoke-Item <file path>
                        exec(
                            `Invoke-Item '${url}'`,
                            { shell: "powershell.exe" },
                            (error, stdout, stderr) => {
                                // do whatever with stdout
                                if (error) {
                                    console.log(
                                        chalk.red(`Failed to open ${url}`)
                                    );
                                    throw error;
                                }
                            }
                        );
                    } else {
                        console.log(chalk.blue(`Opening the link: ${url}`));
                        open(url);
                    }
                });
                db.close();
            }
        );
    });
}
module.exports = ActivateClass;
