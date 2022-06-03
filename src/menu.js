const {green, red, yellow, reset} = require('./formatting.js');

function getMenu(hc, as) {
    return (hc ? green : red) + "1. Hide completed (" + hc + ")\n" + reset +
        (as ? green : red) + "2. Ascendant sort (" + as + ")\n" + reset +
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
        "15. Show missing money\n" +
        "16. Show a upgrade\n" +
        "17. Show income\n" +
        "18. Clear income\n" +
        "19. Setup upgrades\n"+ reset
}

module.exports = getMenu;
