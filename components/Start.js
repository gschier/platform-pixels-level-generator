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

        this._height = constants.START_HEIGHT();
        this._width = constants.START_WIDTH();
    }
    draw () {
        // Cut a hole
        var x1 = constants.START_X();
        var y1 = constants.START_Y();
        var x2 = x1 + constants.START_WIDTH();
        var y2 = y1 + constants.START_HEIGHT();
        this._grid.clear(x1, y1, x2, y2);

        // Place start position
        this._grid.set(constants.TYPE_START, x1 + 1, y1 + 1);
    }
}

module.exports = Start;
