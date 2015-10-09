"use strict";

require('colors');
var constants = require('./constants');
var pathUtil = require('path');
var Square = require('./Square');
var r = require('./random');

var gm = require('gm');

class Grid {
    constructor (w, h) {
        this.width = w;
        this.height = h;
        this._grid = null;
        this._state = null;

        this.initialize(new Square(constants.TYPE_FILL));
    }

    /**
     * Initialize a the grid with a given square
     * @param s
     */
    initialize (s) {
        this._grid = [];

        for (var y = 0; y < this.height; y++) {
            var col = [];
            for (var x = 0; x < this.width; x++) {
                col.push(s);
            }
            this._grid.push(col);
        }
    }

    /**
     * Add a grid to this one.
     *
     * @param grid Grid to add
     * @param offsetX Offset the grid by x
     * @param offsetY Offset the grid by y
     */
    add (grid, offsetX, offsetY) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;

        for (var y = 0; y < grid.height; y++) {
            for (var x = 0; x < grid.width; x++) {
                this.set(
                    grid.get(x, y),
                    x + offsetX, y + offsetY
                );
            }
        }
    }

    /**
     * Set a square
     *
     * @param t
     * @param x
     * @param y
     */
    set (s, x, y) {
        x = x === undefined ? this._posX : x;
        y = y === undefined ? this._posY : y;

        //console.log('SET:', t, x, y);

        if (y >= this.height || y < 0 || x >= this.width || x < 0) {
            return;
        }

        this._grid[this.height - y - 1][x] = s;
    }

    /**
     * Set a random empty space to the given square
     *
     * @param s
     * @param options
     */
    setRandom (s, options) {
        options = options || {};

        var yMax = options.yMax || 1E9;
        var yMin = options.yMin || -1E9;

        var possibilities = [];
        for (var y = this.height - 1; y >= 0.; y--) {
            for (var x = 0; x < this.width; x++) {
                if (y <= yMax && y >= yMin && this.get(x, y).is(constants.TYPE_EMPTY)) {
                    possibilities.push([x, y]);
                }
            }
        }

        var coords = r.choice(possibilities);
        this.set(s, coords[0], coords[1]);
    }

    /**
     * Get the type at a given coordinate
     *
     * @param x
     * @param y
     * @returns Square
     */
    get (x, y) {
        if (y >= this.height || y < 0 || x >= this.width || x < 0) {
            return null;
        }

        return this._grid[this.height - y - 1][x];
    }

    /**
     * Clear a rectangle
     *
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {*}
     */
    clear (x1, y1, x2, y2) {
        return this.fill(
            new Square(constants.TYPE_EMPTY),
            x1,
            y1,
            x2,
            y2
        );
    }

    /**
     * Fill a rectangle
     *
     * @param s
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    fill (s, x1, y1, x2, y2) {
        //console.log('Fill:', t, x1, y1, ' --> ', x2, y2);

        var xMin = Math.min(x1, x2);
        var xMax = Math.max(x1, x2);
        var yMin = Math.min(y1, y2);
        var yMax = Math.max(y1, y2);

        for (var x = xMin; x <= xMax; x++) {
            for (var y = yMin; y <= yMax; y++) {
                this.set(s, x, y);
            }
        }
    }

    /**
     * Find the exit to a grid
     *
     * @returns {{floor: number, ceil: number height: number}}
     */
    findExit () {
        var floor = null;
        var ceil = null;
        var turn = false;
        var s;

        for (let y = 0; y < this.height; y++) {
            s = this.get(this.width - 1, y);

            if (floor === null && s.is(constants.TYPE_EMPTY)) {
                floor = y - 1;
            } else if (floor !== null && s.isnt(constants.TYPE_EMPTY)) {
                ceil = y;
                break;
            }
        }

        if (ceil === null && floor === null) {
            console.log("Looking on left");
            // We didn't find an exit on the right. Check left side.

            let firstEntrance = this.findEntrance();

            if (firstEntrance === null) {
                return null;
            }

            let exit = this.findEntrance(firstEntrance.ceil + 1);


            floor = exit.floor;
            ceil = exit.ceil;
            turn = true;
        }

        return {floor: floor, ceil: ceil, height: ceil - floor - 1, turn: turn};
    }

    /**
     * Find the entrance to a grid
     *
     * @returns {{floor: number, ceil: number height: number}}
     */
    findEntrance (startY) {
        startY = startY || 0;
        var floor = null;
        var ceil = null;
        var s;

        for (let y = startY; y < this.height; y++) {
            s = this.get(0, y);

            if (floor === null && s.is(constants.TYPE_EMPTY)) {
                floor = y - 1;
            } else if (floor !== null && s.isnt(constants.TYPE_EMPTY)) {
                ceil = y;
                break;
            }
        }

        if (floor === null || ceil === null) {
            return null;
        }

        return {floor: floor, ceil: ceil, height: ceil - floor - 1, turn: false};
    }

    /**
     * Crop the grid, leaving a certain amount of padding behind
     *
     * returns new grid instance
     *
     * @param pTop
     * @param pRight
     * @param pBottom
     * @param pLeft
     */
    crop (pTop, pRight, pBottom, pLeft) {

        var yFirst = this.height - 1;
        var yLast = 0;
        var xFirst = this.width - 1;
        var xLast = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.get(x, y).isnt(constants.TYPE_FILL)) {
                    xFirst = Math.min(xFirst, x);
                    yFirst = Math.min(yFirst, y);
                }
            }
        }

        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = this.width - 1; x >= 0; x--) {
                if (this.get(x, y).isnt(constants.TYPE_FILL)) {
                    xLast = Math.max(xLast, x);
                    yLast = Math.max(yLast, y);
                }
            }
        }

        var oldGrid = this.clone();

        this.width = xLast - xFirst + pLeft + pRight + 1;
        this.height = yLast - yFirst + pTop + pBottom + 1;

        this.initialize(new Square(constants.TYPE_FILL));

        this.add(
            oldGrid,
            -xFirst + pLeft,
            -yFirst + pBottom
        );
    }

    /**
     * Clone the grid instance
     */
    clone () {
        var newGrid = new Grid(this.width, this.height);
        newGrid.add(this);
        return newGrid;
    }

    /**
     * Print the grid in ascii
     */
    print () {
        console.log('--');
        var r, s;

        var numbers = '\\ ';
        for (let x = 0; x < this.width; x++) {
            numbers += ' ' + (x % 10);
        }
        console.log(numbers + '  /\n');

        for (let y = this.height - 1; y >= 0.; y--) {
            r = (y % 10) + '  ';
            for (let x = 0; x < this.width; x++) {
                r += this.get(x, y).type + ' ';
            }
            r += ' ' + (y % 10);
            console.log(r);
        }

        numbers = '/ ';
        for (let x = 0; x < this.width; x++) {
            numbers += ' ' + (x % 10);
        }

        console.log('\n' + numbers + '  \\');

        console.log('--');
    }

    /**
     * Export the grid to an image
     *
     * @param path
     */
    saveImage (path) {
        var img_visual = gm(this.width, this.height, 'transparent');
        var img_meta = gm(this.width, this.height, 'transparent');

        var s, c;
        var startX, nextType;

        for (var y = this.height - 1; y >= 0; y--) {
            startX = 0;

            for (var x = 0; x < this.width; x++) {
                s = this.get(x, y);
                nextType = this.get(x + 1, y).type;

                if (s.is(nextType)) {
                    continue;
                }

                c = constants.COLORS_META[s.type];
                if (c) {
                    //console.log('META', startX, this.height - y - 1, x, this.height - y - 1, t);
                    img_meta.fill(c);
                    if (startX == x) {
                        img_meta.drawPoint(
                            startX,
                            this.height - y - 1
                        );
                    } else {
                        img_meta.drawRectangle(
                            startX,
                            this.height - y - 1,
                            x,
                            this.height - y - 1
                        );
                    }
                }

                c = constants.COLORS_VISUAL[s.type];
                if (c) {
                    //console.log('VISU', startX, this.height - y - 1, x, this.height - y - 1, t);
                    img_visual.fill(c);
                    if (startX == x) {
                        img_visual.drawPoint(
                            startX,
                            this.height - y - 1
                        );
                    } else {
                        img_visual.drawRectangle(
                            startX,
                            this.height - y - 1,
                            x,
                            this.height - y - 1
                        );
                    }
                }

                startX = x + 1;
            }
        }

        var metaPath = pathUtil.join(path, 'meta.png');
        img_meta.write(metaPath, function (err) {
            if (err) {
                console.error('Failed to generate ' + metaPath, err);
            }
            else {
                //console.log('Generated ', metaPath);
            }
        });

        var visualPath = pathUtil.join(path, 'visual.png');
        img_visual.write(visualPath, function (err) {
            if (err) {
                console.error('Failed to generate ' + visualPath, err);
            }
            else {
                //console.log('Generated ', visualPath);
            }
        });
    }
}

module.exports = Grid;
