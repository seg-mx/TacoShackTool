const {toArray} = require('./utils.js');

class UpgradePrinter {
    constructor() {
        this.index = 0;
        this.length = 0;
    }

    setup(upgrades, hideCompleted, ascendantSort, sortType) {
        this.upgrades = toArray(upgrades);
        this.index = 0;

        if (hideCompleted) {
            this.upgrades = this.upgrades.filter(up => !up.isCompleted);
        }

        if (sortType < 6) {
            let arr = ["price", "boost", "current", "max", "percentTier", "bestUpgrade"];
            let type = arr[sortType];

            if (ascendantSort) {
                this.upgrades.sort((a, b) => {
                    return a[type] - b[type];
                });
            } else {
                this.upgrades.sort((a, b) => {
                    return b[type] - a[type];
                });
            }
        }

        this.length = this.upgrades.length;
    }

    hasNext() {
        return this.index < this.length;
    }

    next() {
        if (!this.hasNext()) {
            return;
        }
        this.upgrades[this.index].print();
        this.index++;
    }
}

module.exports = UpgradePrinter;
