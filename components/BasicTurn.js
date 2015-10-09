"use strict";

/*

 BASIC TURN COMPONENT

  O O O O O O O O O O O O
  O O O O O O O O O O O O
  - - - - - - - - O O O O
  - - - - - - - - O O O O
  - - - - - - - - O O O O
  O O O O - - - - O O O O
  O O O O - - - - O O O O
  O O O O - - - - O O O O
  O O O O - - - - O O O O
  - - - - - - - - O O O O
  - - - - - - - - O O O O
  - - - - - - - - O O O O
  O O O O O O O O O O O O
  O O O O O O O O O O O O

*/

var BaseComponent = require('./BaseComponent');
var constants = require('../constants');
var r = require('../random');

class BasicTurn extends BaseComponent {
    constructor (difficulty) {
        super(difficulty);

        this.PADDING_Y = 2;
        this.PADDING_X = 2;
        this.CHIMNEY_HEIGHT = r.i(5, 15);
        this.ENTRANCE_WIDTH = r.i(3, 8);
        this.ENTRANCE_HEIGHT = r.i(1, 6);
        this.EXIT_HEIGHT = r.i(1, 6);

        if (this.isUnderMedium()) {
            this.CHIMNEY_WIDTH = r.i(3, 5);
        } else {
            this.CHIMNEY_WIDTH = r.i(1, 5);
        }

        this.width = this.CHIMNEY_WIDTH + this.ENTRANCE_WIDTH + this.PADDING_X;
        this.height = this.CHIMNEY_HEIGHT + this.ENTRANCE_HEIGHT + this.EXIT_HEIGHT + this.PADDING_Y * 2;
    }
    draw () {
        super.draw();

        // Cut entrance hole
        this.grid.clear(
            0,
            this.PADDING_Y,
            this.ENTRANCE_WIDTH,
            this.PADDING_Y + this.ENTRANCE_HEIGHT - 1
        );

        // Cut exit hole
        this.grid.clear(
            0,
            this.height - 1 - this.PADDING_Y - this.EXIT_HEIGHT + 1,
            this.ENTRANCE_WIDTH,
            this.height - 1 - this.PADDING_Y
        );

        // Cut chimney hole
        this.grid.clear(
            this.ENTRANCE_WIDTH,
            this.PADDING_Y,
            this.ENTRANCE_WIDTH - 1 + this.CHIMNEY_WIDTH,
            this.height - 1 - this.PADDING_Y
        );
    }
}

module.exports = BasicTurn;
