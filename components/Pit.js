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

var Square = require('../Square');
var BaseComponent = require('./BaseComponent');
var constants = require('../constants');
var r = require('../random');

class Pit extends BaseComponent {
    constructor (difficulty) {
        super(difficulty);

        this.PADDING_Y = 2;
        this.PIT_DEPTH = r.i(1, 4);
        this.INNER_HEIGHT = r.i(8, 12);

        // Choose width based on difficulty
        if (this.isUnderMedium()) {
            this.width = r.i(2, 3) * 2 + 1;
        } else {
            this.width = r.i(4, 7) * 2 + 1;
        }

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
            new Square(constants.TYPE_DEATH),
            1,
            this.PADDING_Y,
            this.grid.width - 1 - 1,
            this.PADDING_Y + this.PIT_DEPTH - 1
        );

        // Place coin
        if (r.chance(30)) {
            this.grid.setRandom(
                new Square(constants.TYPE_COIN),
                this.PADDING_Y + this.PIT_DEPTH + 7
            );
        }
    }
}

module.exports = Pit;
