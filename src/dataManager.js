const Upgrade = require('./upgrade.js');
const fs = require('fs');
const {green, reset} = require('./formatting.js');

function loadData(data) {
    let income = data.income;

    let upgrades = new Map();
    for (let id in data.upgrades) {
        let upgrade = new Upgrade(data, id);
        upgrades.set(id, upgrade);
    }

    return {income, upgrades};
}

function saveData(income, upgrades) {
    let json = {income: income, upgrades: {}};

    for (let i in upgrades) {
        let up = upgrades[i];
        json.upgrades[up.id] = up.toJSON();
    }

    fs.writeFileSync('./data.json', JSON.stringify(json));
}

function setup(map, prompt) {
    let keys = Array.from(map.keys());

    for (let i in keys) {
        let key = keys[i];

        let up = map.get(key);
        up.print();
        
        console.log(green+"Insert the current tier\n"+reset);
        let current = parseInt(prompt(">> "));

        console.log(green+"Insert the max tier\n"+reset);
        let max = parseInt(prompt(">> "));

        up.current = current;
        up.max = max;
        up.load();
    }
}

module.exports = {loadData, saveData, setup};
