const config = require('./upgrades.json');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs');

const cyan = '\u001b[36;1m';
const green = '\u001b[32;1m';
const yellow = '\u001b[33;1m';
const reset = '\u001b[0m'

const red = '\u001b[31;1m';

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
    const limit = (tier+1) * 2 + 3;
    let current = initial;
    let multiplicator = 3;

    while (multiplicator != limit) {
        current += initial * multiplicator;
        multiplicator += 2;
    }

    return current;
}

class Upgrade {
    constructor(name, current, max, price, boost, id, initial) {
        this.name = name;
        this.current = current;
        this.max = max;
        this.price = price;
        this.boost = boost;
        this.id = id;
        this.percentTier = current/max;
        this.bestUpgrade = boost/price;
        this.initial = initial;
    }
    printUpgrade() {
        console.log(
            `${cyan}${this.name} (${this.current}/${this.max})\n` +
            `${green}Cost: ${yellow}${addCommas(this.price)}\n` +
            `${green}Boost: ${yellow}${boostToText(this.boost)}\n` +
            `${green}PercentTier: ${yellow}${this.percentTier}\n` +
            `${green}BestUpgrade: ${yellow}${this.bestUpgrade}\n` +
            `${green}ID: ${yellow}${this.id}${reset}\n`
        );
    }
}

let array;
let hideCompleted = true;
let ascendantSort = true;

function addToArray(ignoreHide) {
    array = [];
    for (let i in config.upgrades) {
        const {name, current, max, price, boost, id, initial} = config.upgrades[i];
        
        if (!ignoreHide && hideCompleted && current >= max) {
            continue;
        }

        let upgrade = new Upgrade(name, current, max, price, boost, id, initial);
        array.push(upgrade);
    }
}

function sortArray(type) {
    let arr = ["price", "boost", "current", "max", "percentTier", "bestUpgrade"];

    if (ascendantSort) {
        array.sort((a, b) => {
            return eval("a."+arr[type]+" - b."+arr[type]);
        });
        return;
    }
    array.sort((a, b) => {
        return eval("b."+arr[type]+" - a."+arr[type]);
    });
}

function getMissingTiers() {
    let missing = 0;
    array.forEach(upgrade => {
        missing += upgrade.max - upgrade.current;
    });
    return missing;
}

function getTotalTiers() {
    addToArray(true);
    let total = 0;
    array.forEach(upgrade => {
        total += upgrade.max;
    });
    return total;
}

function getCompletedUpgrades() {
    let upgrades = 0;
    array.forEach(upgrade => {
        if (upgrade.current == upgrade.max) {
            upgrades++;
        }
    });
    
    return upgrades;
}

class Printer {
    constructor(array) {
        this.size = array.length;
        this.index = 0;
        this.array = array;
    }

    hasNext() {
        if (this.index >= this.size) {
            return false;
        }
        return true;
    }

    printNext() {
        if (this.index >= this.size) {
            return false;
        }
        this.array[this.index].printUpgrade();
        this.index++;
        return true;
    }
}

function printArray(printer) {
    let text = printer.hasNext() ? "continue" : "back at menu";
    rl.question(green+"\nPress enter to "+text+"...\n"+reset+">>", function(answer) {
        if (answer.trim().toLowerCase() == 'cancel') {
            printMenu();
            return;
        }
        if (text == "continue") {
            printer.printNext();
            printArray(printer);
            return;
        }
        printMenu();
    });
}

function getMenu() {
    return (hideCompleted ? green : red) + "1. Hide completed (" + hideCompleted + ")\n" + reset +
        (ascendantSort ? green : red) + "2. Ascendant sort (" + ascendantSort + ")\n" + reset +
        yellow + "Sort by:\n" +
        "3. Price\n" +
        "4. Boost\n" +
        "5. Current tier\n" +
        "6. Max tier\n" +
        "7. Percent tier\n" +
        "8. Worst purchase\n" +
        red + "Other options:\n" +
        "9. Show every upgrade\n" +
        "10. Buy upgrade\n" +
        "11. Exit losing changes\n" +
        "12. Exit saving changes\n" +
        "13. Show missing tiers\n" +
        "14. Show completed upgrades\n" +
        "15. Show a upgrade\n" +
        "16. Show income\n" +
        "17. Clear income\n" +
        "18. Show missing money\n\n" + reset +
        ">>";
}

function buyUpgrade(checkMax) {
    rl.question(green+"Which item would you buy?\nType 'cancel' to return\n"+reset+">>", function(answer) {
        answer = answer.trim().toLowerCase();
        if (answer == 'cancel') {
            printMenu();
            return;
        }
        for (let i in array) {
            const {id, current, max} = array[i];

            if (answer == id) {
                if (checkMax && current >= max) {
                    console.log("\n"+red+"That upgrade is already maxed!\n"+reset);
                    printMenu();
                    return;
                }
                break;
            }
        }
        let found = false;
        for (let i in array) {
            if (array[i].id == answer) {
                found = true;
                let upgrade = array[i];
                upgrade.printUpgrade();
                showConfirmMessage(upgrade, 0);
                break;
            }
        }
        if (!found) {
            console.log("\n"+red+"That upgrade doesn't exist!\n"+reset);
            printMenu();
        }
    });
}

function requestPrice(upgrade) {
    rl.question(yellow+"Insert the new price\nType 'cancel' to return\n"+reset+">>", function (answer) {
        answer = answer.trim().toLowerCase();
        if (answer == 'cancel') {
            printMenu();
            return;
        }
        answer = answer.replaceAll(',', '');
        let price = parseInt(answer);

        console.log("\n"+yellow+"Price will be changed to "+addCommas(price) +
            "\nTier will be changed to "+(upgrade.current+1)+"\n");
        showConfirmMessage(upgrade, 1, price);
    });
}

function changePrice(upgrade, price) {
    let index = -1;
    for (let i in config.upgrades) {
        if (config.upgrades[i].id == upgrade.id) {
            index = i;
            break;
        }
    }

    if (index == -1) {
        printMenu();
        return;
    }

    upgrade.price = price;
    config.upgrades[index].price = price;
    upgrade.current++;
    config.upgrades[index].current++;

    console.log("\n"+green+"Price changed to "+addCommas(price)+"!\nTier changed to "+upgrade.current+"\n"+reset);
    printMenu();
}

function showConfirmMessage(upgrade, callback, price) {
    let messages = ["This is the upgrade?", "Are you sure?"];
    rl.question(red+messages[callback]+" (Y/N)\n"+reset+">>", function (answer) {
        answer = answer.trim().toLowerCase();
        if (answer == 'y') {
            if (callback == 0) {
                let newPrice = getPrice(upgrade.initial, upgrade.current);

                console.log("\n"+yellow+"Price will be changed to "+addCommas(newPrice) +
                    "\nTier will be changed to "+(upgrade.current+1)+"\n");
                showConfirmMessage(upgrade, 1, newPrice);
                return;
            }
            if (typeof upgrade.boost == 'number') {
                config.income += upgrade.boost;
            }
            changePrice(upgrade, price);
            return;
        }
        printMenu();
    });
}

function calculateMissingMoney() {
    let money = 0;
    for (let i in array) {
        let upgrade = array[i];
        let upgradeMoney = upgrade.price;

        for (let j = upgrade.current; j < upgrade.max; j++) {
            upgradeMoney += getPrice(upgrade.initial, j);
        }
        money += upgradeMoney;
    }
    return money;
}

function printMenu() {
    console.log('\033[2J');
    console.log('\033[H');
    rl.question(getMenu(), function(answer) {
        let choice = parseInt(answer.trim());

        switch (choice) {
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
            addToArray(false);
            if (choice != 9) {
                sortArray(choice-3);
            }
            let printer = new Printer(array);
            console.log(green+"\nType 'cancel' at any moment to stop");
            printArray(printer);
            return;
        case 10:
            buyUpgrade(true);
            break;
        case 11:
            rl.close();
            return;
        case 12:
            fs.writeFileSync("upgrades.json", JSON.stringify(config));
            rl.close();
            return;
        case 13:
            addToArray(false);
            let missing = getMissingTiers();
            let total = getTotalTiers();
            let current = total-missing;
            let textTiers = green+"\nYou have "+missing+" missing tiers "+current+"/"+total+"\nPress enter to continue..."+reset+"\n>>";
            rl.question(textTiers, function (answer) {
                printMenu();
            });
            return;
        case 14:
            addToArray(true);
            let textUpgrades = green+"\nYou have "+getCompletedUpgrades()+"/"+array.length+" upgrades\nPress enter to continue..."+reset+"\n>>";
            rl.question(textUpgrades, function (answer) {
                printMenu();
            });
            return;
        case 15:
            buyUpgrade(false);
            break;
        case 16:
            rl.question(green+"\nThe income is: "+config.income+"\nPress enter to continue...", function (answer) {
                printMenu();
            });
            return;
        case 17:
            config.income = 0;
            break;
        case 18:
            addToArray(false);
            let money = calculateMissingMoney();
            rl.question(green+"\nThe missing money is: "+addCommas(money)+"\nPress enter to continue...", function (answer) {
                printMenu();
            });
            return;
        }

        printMenu();
    });
}

addToArray(false);
printMenu();
