"use strict";

var constants = require('../constants');
var Grid = require('../Grid');

class BaseComponent {
    constructor (difficulty) {
        this.difficulty = difficulty;
    }

    isUnderEasy () {
        return this.difficulty < constants.DIFFICULTY_EASY;
    }

    isOverEasy () {
        return this.difficulty >= constants.DIFFICULTY_EASY;
    }

    isUnderMedium () {
        return this.difficulty < constants.DIFFICULTY_MEDIUM;
    }

    isOverMedium () {
        return this.difficulty >= constants.DIFFICULTY_MEDIUM;
    }

    isUnderHard () {
        return this.difficulty < constants.DIFFICULTY_HARD;
    }

    isOverHard () {
        return this.difficulty >= constants.DIFFICULTY_HARD;
    }

    isUnderInsane () {
        return this.difficulty < constants.DIFFICULTY_INSANE;
    }

    isOverInsane () {
        return this.difficulty < constants.DIFFICULTY_INSANE;
    }

    draw () {
        this.grid = new Grid(this.width, this.height);
    }

    print () {
        this.grid.print();
    }
}

module.exports = BaseComponent;
