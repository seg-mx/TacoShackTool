const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

const data = require('./data.json');
const getMenu = require('./src/menu.js');
const {red, green, reset, clear} = require('./src/formatting.js');
const {loadData, saveData, setup} = require('./src/dataManager.js');
const UpgradePrinter = require('./src/printer.js');
const {printArray, getMissingTiers, getTotalTiers, getCompletedUpgrades, calculateMissingMoney} = require('./src/arrayUtils.js');
const printer = new UpgradePrinter();
const {addCommas, askToContinue, toArray, getUpgrade} = require('./src/utils.js');
const buyUpgrade = require('./src/buy.js');

let {income, upgrades} = loadData(data);
let hideCompleted = true;
let ascendantSort = true;

function loop() {
    clear();
    console.log(getMenu(hideCompleted, ascendantSort));
    let choice = parseInt(prompt(">> "));
    console.log("");

    let array = [];
    if (choice >= 12 && choice <= 15) {
        array = toArray(upgrades);
    }

    switch(choice) {
    case 1:
        hideCompleted = !hideCompleted;
        break;
    case 2:
        ascendantSort = !ascendantSort;
        break;
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
        printer.setup(upgrades, hideCompleted, ascendantSort, choice-3);
        printArray(printer, prompt, true);
        break;
    case 10:
        let upgrade = getUpgrade(upgrades, prompt);
        if (upgrade) {
            income += buyUpgrade(upgrade, prompt);
        }
        break;
    case 11:
        return;
    case 12:
        saveData(income, array);
        return;
    case 13:
        let missing = getMissingTiers(array);
        let total = getTotalTiers(array);
        let current = total-missing;
        console.log(green+"You have "+missing+" missing tiers "+current+"/"+total);
        askToContinue(prompt);
        break;
    case 14:
        let cu = getCompletedUpgrades(array);
        console.log(green+"You have "+cu+"/"+array.length+" upgrades");
        askToContinue(prompt);
        break;
    case 15:
        let money = calculateMissingMoney(array);
        console.log(green+"The missing money is: "+addCommas(money));
        askToContinue(prompt);
        break;
    case 16:
        let up = getUpgrade(upgrades, prompt);
        if (up) {
            up.print();
            askToContinue(prompt);
        }
        break;
    case 17:
        console.log(green+"The income is: "+income);
        askToContinue(prompt);
        break;
    case 18:
        income = 0;
        break;
    case 19:
        setup(upgrades, prompt);
        break;
    }

    loop();
}

loop();
