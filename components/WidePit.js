"use strict";

/*

 WIDE PIT COMPONENT

  O O O O O O O O O O O O O O O O O O O O O O O
  O O O O O O O O O O O O O O O O O O O O O O O
  - - - - - - - - - - - - - - - - - - - - - - -
  - - - - - - - - - - - - - - - - - - - - - - -
  - - - - - - - - - - - - - - - - O O - - - - -
  - - - - - - - - - - - O - - - - O O - - - - -
  O O O - - - - - - - - O - - - - O O - - O O O
  O O O | | | | | | | | | | | | | | | | | O O O
  O O O | | | | | | | | | | | | | | | | | O O O
  O O O O O O O O O O O O O O O O O O O O O O O
  O O O O O O O O O O O O O O O O O O O O O O O

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
        this.INNER_HEIGHT = r.i(10, 15);

        if (this.isUnderEasy()) {
            this.width = r.i(20, 30);
        } else if (this.isUnderMedium()) {
            this.width = r.i(30, 40);
        } else {
            this.width = r.i(30, 50);
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

        // Place posts
        var x = r.i(7, 12);
        while (x < this.grid.width - 5) {

            var width;

            if (this.isUnderEasy()) {
                width = r.i(2, 3);
            } else if (this.isUnderMedium()) {
                width = r.i(1, 3);
            } else if (this.isUnderHard()) {
                width = r.i(1, 2);
            } else {
                width = r.i(0, 1);
            }

            var height = r.i(0, 4);

            this.grid.fill(
                new Square(constants.TYPE_FILL),
                x,
                this.PADDING_Y + this.PIT_DEPTH,
                x + width,
                this.PADDING_Y + this.PIT_DEPTH + height
            );

            if (this.isUnderEasy()) {
                x += width + r.i(5, 8);
            } else if (this.isUnderMedium()) {
                x += width + r.i(5, 10);
            } else if (this.isUnderHard()) {
                x += width + r.i(8, 15);
            } else {
                x += width + r.i(8, 18);
            }
        }

        // Place random amount of coins
        for (let i = 0; i < r.i(0, 2); i++) {
            this.grid.setRandom(
                new Square(constants.TYPE_COIN),
                { yMax: this.PADDING_Y + 8 }
            );
        }
    }
}

module.exports = Pit;
