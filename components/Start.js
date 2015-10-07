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

class Start extends BaseComponent {
    constructor (grid) {
        super(grid);
    }
    draw () {
        // Cut a hole
        this._grid.fill(constants.TYPE_EMPTY, 1, 1, 6, 6);

        // Place start position
        this._grid.set(constants.TYPE_START, 2, 2);
    }
}

module.exports = Start;
