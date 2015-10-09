require('colors');
var Chance = require('chance');
var chance = new Chance();

function i (min, max) {
    return function () {
        return chance.integer({min: min, max: max});
    }
}

var x = {};

x.DIFFICULTY_EASY = 10;
x.DIFFICULTY_MEDIUM = 20;
x.DIFFICULTY_HARD = 30;
x.DIFFICULTY_INSANE = 40;

x.TYPE_EMPTY = '■'.grey;
x.TYPE_FILL = '☐'.white.bold;
x.TYPE_DEATH = 'D'.red.bold;
x.TYPE_COIN = 'C'.yellow.bold;
x.TYPE_START = 'S'.magenta.bold;
x.TYPE_FINISH = 'F'.green.bold;

x.COLORS_VISUAL = {};
x.COLORS_VISUAL[x.TYPE_FILL] = '#312F2F';
x.COLORS_VISUAL[x.TYPE_DEATH] = '#D00'; // RED
x.COLORS_VISUAL[x.TYPE_COIN] = '#DD0'; // YELLOW

x.COLORS_META = {};
x.COLORS_META[x.TYPE_DEATH] = '#F00'; // RED
x.COLORS_META[x.TYPE_START] = '#F0F'; // TEAL
x.COLORS_META[x.TYPE_FINISH] = '#0F0'; // GREEN
x.COLORS_META[x.TYPE_COIN] = '#FF0'; // YELLOW

module.exports = x;
