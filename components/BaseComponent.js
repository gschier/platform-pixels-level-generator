"use strict";

var constants = require('../constants');
var Grid = require('../Grid');

class BaseComponent {
    constructor (difficulty) {
        this.difficulty = difficulty;
    }

    draw () {
        this.grid = new Grid(this.width, this.height);
    }

    print () {
        this.grid.print();
    }
}

module.exports = BaseComponent;
