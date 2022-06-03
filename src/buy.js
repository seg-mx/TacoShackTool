const {yellow, red, reset} = require('./formatting.js');
const {addCommas, askToContinue, askForConfirmation} = require('./utils.js');

function buyUpgrade(upgrade, prompt) {
    if (upgrade.current == upgrade.max) {
        console.log(red+"\nThat upgrade is maxed!"+reset);
        askToContinue(prompt);
        return;
    }
    upgrade.print();
    let {tier, price} = upgrade.nextValues();

    console.log(yellow+"\nPrice will be changed to "+addCommas(price)+"\nTier will be changed to "+tier+reset+"\n");

    let confirm = askForConfirmation(prompt);

    if (!confirm) {
        return 0;
    }

    let income = 0;
    if (typeof upgrade.boost == 'number') {
        income = upgrade.boost;
    }
    upgrade.buy();
    upgrade.load();

    return income;
}

module.exports = buyUpgrade;
