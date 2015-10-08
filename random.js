"use strict";

var Chance = require('chance');
var chance = new Chance();

class Random {
    constructor () {
        this._chance = new Chance();
    }

    choice (a) {
        return chance.pick(a, 1);
    }

    /**
     * 0 always returns false, 100 always returns true
     *
     * @param odds
     * @returns {boolean}
     */
    chance (odds) {
        return this.i(0, odds) <= odds;
    }

    bool (options) {
        return chance.bool(options);
    }

    i (min, max) {
        return this._chance.integer({
            min: Math.round(min),
            max: Math.round(max)
        });
    }
}

var instance = null;

module.exports.getRandom = function () {
    if (!instance) {
        instance = new Random();
    }

    return instance;
};


