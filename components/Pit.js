"use strict";

/*

 PIT COMPONENT

  O O O O O O O O O O O O
  O O O O O O O O O O O O
  - - - - - - - - - - - -
  - - - - - - - - - - - -
  - - - - - - - - - - - -
  - - - - - - - - - - - -
  O O O - - - - - - O O O
  O O O * * * * * * O O O
  O O O * * * * * * O O O
  O O O O O O O O O O O O
  O O O O O O O O O O O O

*/

var BaseComponent = require('./BaseComponent');
var constants = require('../constants');

class Pit extends BaseComponent {
    constructor (grid) {
        super(grid);

        this._height = constants.START_HEIGHT();
        this._width = constants.START_WIDTH();
    }
    draw () {
        // Cut a hole
        this._grid.clear(10, 5, 24, 10);

        this._grid.clear(11, 4, 23, 5);

        // Place start position
        this._grid.fill(constants.TYPE_DEATH, 11, 2, 23, 3);

        // Place coin
        this._grid.set(constants.TYPE_COIN, 17, 8);
    }
}

module.exports = Pit;
