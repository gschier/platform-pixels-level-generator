var Chance = require('chance');
var chance = new Chance();

function i (min, max) {
    return function () {
        return chance.integer({min: min, max: max});
    }
}

module.exports = {
    START_X:        i(0, 2),
    START_Y:        i(2, 7),
    START_OFFSET_Y: i(2, 4),

    DETACH_DISTANCE_X: i(3,  12),
    DETACH_DISTANCE_Y: i(-3, 5),

    DEATH_DEPTH: i(12, 20),

    PLATFORM_WIDTH: i(2, 12),
    PLATFORM_HEIGHT: i(3, 8),

    FLOOR_DEPTH: i(12, 20),
    CEILING_DEPTH: i(12, 20),
    CEILING_HEIGHT: i(8, 12),
};
