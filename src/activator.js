var input = require("input");
var chalk = require("chalk");
var ActivateActivatorClass = require("./activateActivatorClass");
var GetClassNames = require("./classNames");
var { AddLinks, RemoveLinks } = require("./updateActivatorLinks");
var GetActivatorLinks = require("./getActivatorLinks");
var ActivateClass = require("./activateClass");

//$ Activator function to perform all tasks related to activation
async function Activator() {
    let optionSelected = await input.checkboxes(`Select the task: `, [
        `Activate a class`,
        `Initialize activator to a class`,
        `Update activator links`,
    ]);
    switch (optionSelected[0]) {
        // Initializing activator to a class
        case `Initialize activator to a class`:
             await ActivateActivatorClass();
            break;
        // Activating a class
        case `Activate a class`:
            // Making the user select a class
            var classNamesList = await GetClassNames();
            var classSelected = await input.checkboxes(
                `Select the class: `,
                classNamesList
            );
            await ActivateClass(classSelected[0]).catch((rejectionMessage) => {chalk.red(`Unsuccessful activation: ${rejectionMessage}`)});
            break;
        // Adding/ deleting the links
        case `Update activator links`:
            classNamesList = await GetClassNames();
            classSelected = await input.checkboxes(
                `Select the class`,
                classNamesList
            );
            classSelected = classSelected[0];
            // Delete or add link
            let taskSelected = await input.checkboxes(`Select the task: `, [
                `Add links`,
                `Remove links`,
            ]);
            if (taskSelected[0] == `Add links`) {
                // If the user chooses to add links
                let keepAskingLinks = true;
                let addLinksList = [];
                while (keepAskingLinks) {
                    let link = await input.text(`Enter the link to add: `);
                    addLinksList.push(link);
                    keepAskingLinks = await input.confirm(
                        `Wanna add more links? `
                    );
                }
                await AddLinks(addLinksList, classSelected);
            } else {
                // If the user chooses to remove links
                let activatorLinksList = await GetActivatorLinks(classSelected);
                // If there's only 1 link in the database
                if (activatorLinksList.length == 1) {
                    console.log(
                        chalk.yellow(
                            `Automatically selecting ${activatorLinksList[0]} which is the only link present in the database.`
                        )
                    );
                    const removeApproval = await input.confirm(
                        `Do you wanna remove ${activatorLinksList[0]}? `
                    );
                    if (removeApproval) {
                        await RemoveLinks(activatorLinksList, classSelected);
                    }
                } else {
                    let removeLinksList = await input.checkboxes(
                        `Select the links you wanna remove: `,
                        activatorLinksList
                    );
                    await RemoveLinks(removeLinksList, classSelected);
                }
            }
            break;
        default:
            console.log(
                chalk.red(`Incorrect option, kindly select a right option`)
            );
            Activator();
            break;
    }
}

module.exports = Activator;