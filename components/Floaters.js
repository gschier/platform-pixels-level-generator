"use strict";

/*

 FLOATERS COMPONENT

  O O O O O O O O O O O O O O O O O O
  O O O O O O O O O O O O O O O O O O
  - - - - - - - - - - - - - - - - - -
  - - - - - - - - - - - - - - - - - -
  - - - - - - - - - - 0 0 - - - - - -
  - - - - - - - - - - 0 0 - - - - - -
  - - - - - - - - - - - - - - - - - -
  - - - - - - O 0 - - - - - 0 - - - -
  O O O - - - - - - - - - - - - O O O
  O O O - - - - - - - - - - - - O O O
  O O O - - - - - - - - - - - - O O O
  O O O | | | | | | | | | | | | O O O
  O O O | | | | | | | | | | | | O O O
  O O O O O O O O O O O O O O O O O O
  O O O O O O O O O O O O O O O O O O

*/

var BaseComponent = require('./BaseComponent');
var constants = require('../constants');
var r = require('../random');

class Floaters extends BaseComponent {
    constructor (difficulty) {
        super(difficulty);

        this.PADDING_Y = 2;
        this.PIT_DROP = r.i(5, 5);
        this.PIT_DEPTH = r.i(1, 4);
        this.INNER_HEIGHT = r.i(10, 15);

        // Choose width based on difficulty
        if (this.isUnderEasy()) {
            this.width = r.i(20, 25);
        } else if (this.isUnderMedium()) {
            this.width = r.i(25, 35);
        } else {
            this.width = r.i(25, 50);
        }

        this.height = this.INNER_HEIGHT + this.PADDING_Y * 2 + this.PIT_DEPTH + this.PIT_DROP;
    }
    draw () {
        super.draw();

        // Cut main hole
        this.grid.clear(
            0,
            this.PADDING_Y + this.PIT_DEPTH + this.PIT_DROP + 1,
            this.grid.width - 1,
            this.grid.height - 1 - this.PADDING_Y
        );

        // Cut pit hole
        this.grid.clear(
            1,
            this.PADDING_Y,
            this.grid.width - 1 - 1,
            this.PADDING_Y + this.PIT_DEPTH + this.PIT_DROP
        );

        // Place pit
        this.grid.fill(
            constants.TYPE_DEATH,
            1,
            this.PADDING_Y,
            this.grid.width - 1 - 1,
            this.PADDING_Y + this.PIT_DEPTH
        );

        // Place Floaters
        var x = r.i(5, 8);
        var y = r.i(-2, 5) + this.PADDING_Y + this.PIT_DEPTH + this.PIT_DROP;
        while (x < this.grid.width - 5) {

            var width;

            if (this.isUnderEasy()) {
                width = r.i(3, 5);
            } else if (this.isUnderMedium()) {
                width = r.i(2, 4);
            } else if (this.isUnderHard()) {
                width = r.i(2, 4);
            } else {
                width = r.i(1, 4);
            }

            var height = r.i(1, 2);

            this.grid.fill(
                constants.TYPE_FILL,
                x,
                y,
                x + width,
                y + height
            );

            if (this.isUnderEasy()) {
                x += width + r.i(6, 8);
            } else if (this.isUnderMedium()) {
                x += width + r.i(7, 10);
            } else if (this.isUnderHard()) {
                x += width + r.i(8, 15);
            } else {
                x += width + r.i(8, 18);
            }

            y = r.i(-2, 5) + this.PADDING_Y + this.PIT_DEPTH + this.PIT_DROP;
        }

        // Place coins
        for (let i = 0; i < r.i(0, this.width / 20); i++) {
            this.grid.setRandom(
                constants.TYPE_COIN,
                {
                    yMin: this.PADDING_Y + this.PIT_DEPTH + this.PIT_DROP + 1,
                    yMax: this.PADDING_Y + this.PIT_DEPTH + this.PIT_DROP + 8
                }
            );
        }
    }
}

module.exports = Floaters;
