const {green, reset} = require('./formatting.js');
const {getPrice} = require('./utils.js');

function printArray(printer, prompt, showTip) {
    if (showTip) {
        console.log(green+"Type 'cancel' at any moment to stop");
        printArray(printer, prompt, false);
        return;
    }

    let action = printer.hasNext() ? "continue" : "back at menu";

    console.log(green+"\nPress enter to "+action+"..."+reset);
    let answer = prompt(">> ").trim().toLowerCase();

    if (answer == 'cancel') {
        return;
    }

    if (action == 'continue') {
        printer.next();
        printArray(printer, prompt, false);
    }
}

function getMissingTiers(array) {
    let missing = 0;
    array.forEach(upgrade => {
        missing += upgrade.max - upgrade.current;
    });

    return missing;
}

function getTotalTiers(array) {
    let total = 0;
    array.forEach(upgrade => {
        total += upgrade.max;
    });
    return total;
}

function getCompletedUpgrades(array) {
    let upgrades = 0;
    array.forEach(upgrade => {
        if (upgrade.current == upgrade.max) {
            upgrades++;
        }
    });
    return upgrades;
}

function calculateMissingMoney(array) {
    let money = 0;
    for (let i in array) {
        let upgrade = array[i];
        let upgradeMoney = 0;

        for (let j = upgrade.current; j < upgrade.max; j++) {
            upgradeMoney += getPrice(upgrade.initial, j);
        }
        money += upgradeMoney;
    }
    return money;
}

module.exports = {printArray, getMissingTiers, getTotalTiers, getCompletedUpgrades, calculateMissingMoney};
