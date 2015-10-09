"use strict";

var Chance = require('chance');
var chance = new Chance();

var instance = null;

module.exports.setSeed = function (s) {
    chance = new Chance(s);
};

module.exports.choice = function (a) {
    return chance.pick(a, 1);
};

/**
 * 0 always returns false, 100 always returns true
 *
 * @param odds
 * @returns {boolean}
 */
module.exports.chance = function (odds) {
    return module.exports.i(0, odds) <= odds;
};

module.exports.bool = function (options) {
    return chance.bool(options);
};

module.exports.i = function (min, max) {
    return chance.integer({
        min: Math.round(min),
        max: Math.round(max)
    });
};

