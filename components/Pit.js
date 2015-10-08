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
  O O O | | | | | | O O O
  O O O | | | | | | O O O
  O O O O O O O O O O O O
  O O O O O O O O O O O O

*/

var BaseComponent = require('./BaseComponent');
var constants = require('../constants');
var r = require('../random').getRandom();

class Pit extends BaseComponent {
    constructor (difficulty) {
        super(difficulty);

        this.PADDING_Y = 2;
        this.PIT_DEPTH = r.i(1, 4);
        this.INNER_HEIGHT = r.i(8, 12);

        this.width = r.i(8, 18);
        this.height = this.INNER_HEIGHT + this.PADDING_Y * 2 + this.PIT_DEPTH;
    }
    draw () {
        super.draw();

        // Cut main hole
        this.grid.clear(
            0,
            this.PADDING_Y + this.PIT_DEPTH + 1,
            this.grid.width - 1,
            this.grid.height - 1 - this.PADDING_Y
        );

        // Cut pit hole
        this.grid.clear(
            1,
            this.PADDING_Y + this.PIT_DEPTH,
            this.grid.width - 1 - 1,
            this.PADDING_Y + this.PIT_DEPTH + 1
        );

        // Place pit
        this.grid.fill(
            constants.TYPE_DEATH,
            1,
            this.PADDING_Y,
            this.grid.width - 1 - 1,
            this.PADDING_Y + this.PIT_DEPTH - 1
        );

        // Place coin
        if (r.chance(80)) {
            this.grid.set(
                constants.TYPE_COIN,
                Math.ceil(this.grid.width / 2),
                this.PADDING_Y + this.PIT_DEPTH + 5 );
        }
    }
}

module.exports = Pit;
