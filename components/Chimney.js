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

var Square = require('../Square');
var BaseComponent = require('./BaseComponent');
var constants = require('../constants');
var r = require('../random');

class Chimney extends BaseComponent {
    constructor (difficulty) {
        super(difficulty);

        this.PADDING_Y = 2;
        this.CHIMNEY_HEIGHT = r.i(5, 15);
        this.ENTRANCE_WIDTH = r.i(3, 8);
        this.ENTRANCE_HEIGHT = r.i(1, 6);
        this.EXIT_WIDTH = r.i(2, 6);
        this.EXIT_HEIGHT = r.i(1, 6);

        if (this.isUnderMedium()) {
            this.CHIMNEY_WIDTH = r.i(3, 5);
        } else {
            this.CHIMNEY_WIDTH = r.i(1, 5);
        }

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

        // Draw some death if it's fairly difficult
        if (this.isOverEasy() && r.chance(70)) {
            var xStart, xEnd, yStart, yEnd;
            var deathHeight = r.i(1, this.CHIMNEY_HEIGHT - 1);

            if (r.bool()) { // Close side
                xStart = this.ENTRANCE_WIDTH - 1;
                xEnd = this.ENTRANCE_WIDTH - 1;
                yStart = r.i(0, this.CHIMNEY_HEIGHT - 1 - deathHeight) + this.PADDING_Y + this.ENTRANCE_HEIGHT;
            } else { // Far side
                xStart = this.ENTRANCE_WIDTH - 1 + this.CHIMNEY_WIDTH + 1;
                xEnd = this.ENTRANCE_WIDTH - 1 + this.CHIMNEY_WIDTH + 1;
                yStart = r.i(0, this.CHIMNEY_HEIGHT - 1 - deathHeight) + this.PADDING_Y + 1;
            }

            yEnd = yStart + deathHeight - 1;

            this.grid.fill(
                new Square(constants.TYPE_DEATH),
                xStart,
                yStart,
                xEnd,
                yEnd
            );
        }

        // Place coin
        if (r.chance(40)) {
            var x = r.i(
                this.ENTRANCE_WIDTH,
                this.ENTRANCE_WIDTH + this.CHIMNEY_WIDTH - 1
            );

            var y = r.i(
                this.ENTRANCE_HEIGHT + this.PADDING_Y + 1,
                this.grid.height - 1 - this.PADDING_Y - this.EXIT_HEIGHT
            );

            this.grid.set(new Square(constants.TYPE_COIN), x, y);
        }
    }
}

module.exports = Chimney;
