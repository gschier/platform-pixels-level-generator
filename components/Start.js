"use strict";

/*

 START COMPONENT

 O O O O O O O O O O O
 O O O O O O O O O O O
 O O O - - - - - - - -
 O O O - - - - - - - -
 O O O - - - - - - - -
 O O O - S - - - - - -
 O O O - - - - - - - -
 O O O - - - - - - - -
 O O O O O O O O O O O
 O O O O O O O O O O O

*/

var BaseComponent = require('./BaseComponent');
var constants = require('../constants');
var r = require('../random').getRandom();

class Start extends BaseComponent {
    constructor (difficulty) {
        super(difficulty);

        this.PADDING_Y = 2;
        this.PADDING_X = 2;

        this.width = r.i(3, 5) + this.PADDING_X;
        this.height = r.i(3, 5) + this.PADDING_Y * 2
    }
    draw () {
        super.draw();

        // Cut a hole
        this.grid.clear(
            this.PADDING_X,
            this.PADDING_Y,
            this.grid.width - 1,
            this.grid.height - 1 - this.PADDING_Y
        );

        // Place start position
        this.grid.set(
            constants.TYPE_START,
            this.PADDING_X + 1,
            this.PADDING_Y + 1
        );
    }
}

module.exports = Start;
