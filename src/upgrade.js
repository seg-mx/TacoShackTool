const {cyan, green, yellow, reset} = require('./formatting.js');
const {addCommas, boostToText, getPrice} = require('./utils.js');

class Upgrade {
    constructor(data, id) {
        let upgrade = data.upgrades[id];

        this.name = upgrade.name;
        this.current = upgrade.current;
        this.max = upgrade.max;
        this.price = upgrade.price;
        this.boost = upgrade.boost;
        this.initial = upgrade.initial;
        
        this.load()
        this.id = id;
    }

    load() {
        this.percentTier = this.current/this.max;
        this.bestUpgrade = this.boost/this.price;
        this.isCompleted = this.current == this.max;
    }

    print() {
        console.log(
            `${cyan}${this.name} (${this.current}/${this.max})\n` +
            `${green}Cost: ${yellow}${addCommas(this.price)}\n` +
            `${green}Boost: ${yellow}${boostToText(this.boost)}\n` +
            `${green}PercentTier: ${yellow}${this.percentTier}\n` +
            `${green}BestUpgrade: ${yellow}${this.bestUpgrade}\n` +
            `${green}ID: ${yellow}${this.id}${reset}\n`
        );
    }

    nextValues() {
        if (this.nextPrice == undefined) {
            this.nextTier = this.current + 1;
            this.nextPrice = getPrice(this.initial, this.nextTier);
        }

        return {tier: this.nextTier, price: this.nextPrice};
    }

    buy() {
        if (this.nextPrice == undefined) {
            this.nextValues();
        }

        this.price = this.nextPrice;
        this.current = this.nextTier;
        this.nextPrice = undefined;

        this.nextValues();
    }

    toJSON() {
        return {
            name: this.name,
            current: this.current,
            max: this.max,
            price: this.price,
            boost: this.boost,
            initial: this.initial
        };
    }
}

module.exports = Upgrade;
