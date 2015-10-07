require('colors');
var Chance = require('chance');
var chance = new Chance();

function i (min, max) {
    return function () {
        return chance.integer({min: min, max: max});
    }
}

var x = {};

x.DEATH_DEPTH = i(12, 20);

x.START_WIDTH = i(3, 5);
x.START_HEIGHT = i(3, 5);
x.START_Y = i(2, 4);
x.START_X = i(2, 4);

x.TYPE_EMPTY = '■'.grey;
x.TYPE_PLATFORM = '☐'.green.bold;
x.TYPE_FILL= '☐'.white.bold;
x.TYPE_DEATH = '☐'.red.bold;
x.TYPE_COIN = '●'.yellow.bold;
x.TYPE_START = '☃'.magenta.bold;

x.COLORS_VISUAL = {};
x.COLORS_VISUAL[x.TYPE_PLATFORM] = '#2A2828';
x.COLORS_VISUAL[x.TYPE_FILL] = '#312F2F';

x.COLORS_META = {};
x.COLORS_META[x.TYPE_DEATH] = '#F00'; // RED
x.COLORS_META[x.TYPE_START] = '#F0F'; // TEAL

module.exports = x;
