const {yellow, reset} = require('./formatting.js');
const {addCommas, askForConfirmation} = require('./utils.js');

function buyUpgrade(upgrade, prompt) {
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

    return income;
}

module.exports = buyUpgrade;
