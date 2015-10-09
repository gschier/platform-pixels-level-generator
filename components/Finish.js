"use strict";

/*

 FINISH COMPONENT

  O O O O O O O O O O O
  O O O O O O O O O O O
  - - - - - - - - O O O
  - - - - - - - - O O O
  - - - - - - - - O O O
  - - - - - F F - O O O
  - - - - - F F - O O O
  - - - - - F F - O O O
  O O O O O O O O O O O
  O O O O O O O O O O O

*/

var BaseComponent = require('./BaseComponent');
var constants = require('../constants');
var r = require('../random');

class Finish extends BaseComponent {
    constructor (difficulty) {
        super(difficulty);

        this.PADDING_X = 2;
        this.PADDING_Y = 2;

        this.width = r.i(5, 12) + this.PADDING_X;
        this.height = r.i(4, 6) + this.PADDING_Y * 2;
    }
    draw () {
        super.draw();

        // Cut a hole
        this.grid.clear(
            0,
            this.PADDING_Y,
            this.grid.width - 1 - this.PADDING_X,
            this.grid.height - 1 - this.PADDING_Y
        );

        // Place exit door
        this.grid.fill(
            constants.TYPE_FINISH,
            this.grid.width - 1 - this.PADDING_X - 2,
            this.PADDING_Y,
            this.grid.width - 1 - this.PADDING_X - 2 - 1,
            this.PADDING_Y + 2
        );
    }
}

module.exports = Finish;
