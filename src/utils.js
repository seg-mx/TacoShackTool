const {red, green, reset} = require('./formatting.js');

function addCommas(number) {
    return Number(number).toLocaleString();
}

function boostToText(boost) {
    if (typeof boost == 'string') {
        return boost;
    }
    return '+$'+boost+'/hr';
}

function getPrice(initial, tier) {
    const limit = tier * 2 + 3;
    let current = initial;
    let multiplicator = 3;

    while (multiplicator != limit) {
        current += initial * multiplicator;
        multiplicator += 2;
    }

    return current;
}

function askToContinue(prompt) {
    console.log(green+"\nPress enter to continue..."+reset);
    prompt(">> ");
}

function toArray(map) {
    return Array.from(map.values());;
}

function getUpgrade(upgrades, prompt) {
    console.log(green+"Insert the ID\n"+reset);
    let ID = prompt(">> ").trim().toLowerCase();
    if (upgrades.has(ID)) {
        return upgrades.get(ID);
    } else {
        console.log(red+"That upgrade doesn't exist");
    }
    askToContinue(prompt);
    return null;
}

function askForConfirmation(prompt) {
    console.log(red+"Are you sure? (Y/N)\n"+reset);

    let answer = prompt(">> ").trim().toLowerCase();
    return answer == 'y';
}

module.exports = {addCommas, boostToText, getPrice, askToContinue, toArray, getUpgrade, askForConfirmation};
