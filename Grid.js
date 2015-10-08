"use strict";

require('colors');
var constants = require('./constants');
var pathUtil = require('path');

var gm = require('gm');

class Grid {
    constructor (w, h) {
        this.width = w;
        this.height = h;
        this._grid = null;
        this._state = null;

        this.initialize(constants.TYPE_FILL);
    }

    /**
     * Initialize a the grid with a given type
     * @param t
     */
    initialize (t) {
        this._grid = [];

        for (var y = 0; y < this.height; y++) {
            var col = [];
            for (var x = 0; x < this.width; x++) {
                col.push(t);
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

        var t;
        for (var y = 0; y < grid.height; y++) {
            for (var x = 0; x < grid.width; x++) {
                t = grid.get(x, y);
                this.set(t, x + offsetX, y + offsetY);
            }
        }
    }

    /**
     * Set a grid space to a given type
     *
     * @param t
     * @param x
     * @param y
     */
    set (t, x, y) {
        x = x === undefined ? this._posX : x;
        y = y === undefined ? this._posY : y;

        //console.log('SET:', t, x, y);

        if (y >= this.height || y < 0 || x >= this.width || x < 0) {
            return;
        }

        this._grid[this.height - y - 1][x] = t;
    }

    /**
     * Get the type at a given coordinate
     *
     * @param x
     * @param y
     * @returns {*}
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
        return this.fill(constants.TYPE_EMPTY, x1, y1, x2, y2);
    }

    /**
     * Fill a rectangle
     *
     * @param t
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    fill (t, x1, y1, x2, y2) {
        //console.log('Fill:', t, x1, y1, ' --> ', x2, y2);

        var xMin = Math.min(x1, x2);
        var xMax = Math.max(x1, x2);
        var yMin = Math.min(y1, y2);
        var yMax = Math.max(y1, y2);

        for (var x = xMin; x <= xMax; x++) {
            for (var y = yMin; y <= yMax; y++) {
                this.set(t, x, y);
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
        var t;

        for (var y = 0; y < this.height; y++) {
            t = this.get(this.width - 1, y);

            if (floor === null && t === constants.TYPE_EMPTY) {
                floor = y - 1;
            } else if (floor !== null && t !== constants.TYPE_EMPTY) {
                ceil = y;
                break;
            }
        }

        return {floor: floor, ceil: ceil, height: ceil - floor - 1};
    }

    /**
     * Find the entrance to a grid
     *
     * @returns {{floor: number, ceil: number height: number}}
     */
    findEntrance () {
        var floor = null;
        var ceil = null;
        var t;

        for (var y = 0; y < this.height; y++) {
            t = this.get(0, y);

            if (floor === null && t === constants.TYPE_EMPTY) {
                floor = y - 1;
            } else if (floor !== null && t !== constants.TYPE_EMPTY) {
                ceil = y;
                break;
            }
        }

        return {floor: floor, ceil: ceil, height: ceil - floor - 1};
    }

    /**
     * Print the grid in ascii
     */
    print () {
        var r, t;
        for (var y = this.height - 1; y >= 0.; y--) {
            r = '';
            for (var x = 0; x < this.width; x++) {
                t = this.get(x, y);

                if (x === this._posX && y === this._posY) {
                    t = t.green.bold;
                }

                r += t + ' ';
            }
            console.log(r);
        }
    }

    /**
     * Export the grid to an image
     *
     * @param path
     */
    saveImage (path) {
        var img_visual = gm(this.width, this.height, 'transparent');
        var img_meta = gm(this.width, this.height, 'transparent');

        var t, c;
        var startX, nextType;

        for (var y = this.height - 1; y >= 0; y--) {
            startX = 0;

            for (var x = 0; x < this.width; x++) {
                t = this.get(x, y);
                nextType = this.get(x + 1, y);

                if (t === nextType) {
                    continue;
                }

                c = constants.COLORS_META[t];
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

                c = constants.COLORS_VISUAL[t];
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
