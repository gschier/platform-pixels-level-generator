"use strict";

/*

 CHIMNEY COMPONENT

  O O O O O O O O O O O O
  O O O O O O O O O O O O
  O O O O - - - - - - - -
  O O O O - - - - - - - -
  O O O O - - - - - - - -
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
var r = require('../random').getRandom();

class Chimney extends BaseComponent {
    constructor (difficulty) {
        super(difficulty);

        this.PADDING_Y = 2;
        this.CHIMNEY_HEIGHT = r.i(5, 15);
        this.CHIMNEY_WIDTH = r.i(1, 5);
        this.ENTRANCE_WIDTH = r.i(3, 8);
        this.ENTRANCE_HEIGHT = r.i(1, 6);
        this.EXIT_WIDTH = r.i(2, 6);
        this.EXIT_HEIGHT = r.i(1, 6);

        this.width = this.CHIMNEY_WIDTH + this.ENTRANCE_WIDTH + this.EXIT_WIDTH;
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
            this.width - 1 - this.EXIT_WIDTH,
            this.height - 1 - this.PADDING_Y - this.EXIT_HEIGHT + 1,
            this.width - 1,
            this.height - 1 - this.PADDING_Y
        );

        // Cut chimney hole
        this.grid.clear(
            this.ENTRANCE_WIDTH,
            this.PADDING_Y,
            this.ENTRANCE_WIDTH - 1 + this.CHIMNEY_WIDTH,
            this.height - 1 - this.PADDING_Y
        );

        // Draw some death
        if (this.difficulty > 2) {
            var xStart, xEnd, yStart, yEnd;
            var deathHeight = r.i(1, this.CHIMNEY_HEIGHT - 1);

            if (r.bool()) { // Close side
                xStart = this.ENTRANCE_WIDTH - 1;
                xEnd = this.ENTRANCE_WIDTH - 1;
                yStart = r.i(0, this.CHIMNEY_HEIGHT - deathHeight) + this.PADDING_Y + this.ENTRANCE_HEIGHT;
            } else { // Far side
                xStart = this.ENTRANCE_WIDTH - 1 + this.CHIMNEY_WIDTH + 1;
                xEnd = this.ENTRANCE_WIDTH - 1 + this.CHIMNEY_WIDTH + 1;
                yStart = r.i(0, this.CHIMNEY_HEIGHT - deathHeight) + this.PADDING_Y + 1;
            }

            yEnd = yStart + deathHeight;

            this.grid.fill(
                constants.TYPE_DEATH,
                xStart,
                yStart,
                xEnd,
                yEnd
            );
        }
    }
}

module.exports = Chimney;
