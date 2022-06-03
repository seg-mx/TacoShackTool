const cyan = '\u001b[36;1m';
const green = '\u001b[32;1m';
const yellow = '\u001b[33;1m';
const red = '\u001b[31;1m';
const reset = '\u001b[0m';

function clear() {
    console.log('\033[2J');
    console.log('\033[H');
}

module.exports = {cyan, green, yellow, red, reset, clear};
