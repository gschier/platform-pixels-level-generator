"use strict";

require('colors');
var constants = require('./constants');

var gm = require('gm');

class Grid {
    constructor (w, h) {
        this._width = w;
        this._height = h;
        this._grid = null;
        this._state = null;
    }

    initialize(t) {
        this._grid = [];

        for (var y = 0; y < this._height; y++) {
            var col = [];
            for (var x = 0; x < this._width; x++) {
                col.push(t);
            }
            this._grid.push(col);
        }
    }

    set(t, x, y) {
        x = x === undefined ? this._posX : x;
        y = y === undefined ? this._posY : y;

        //console.log('SET:', t, x, y);

        if (y >= this._height || y < 0 || x >= this._width || x < 0) {
            return;
        }

        this._grid[this._height - y - 1][x] = t;
    }

    get(x, y) {
        if (y >= this._height || y < 0 || x >= this._width || x < 0) {
            return null;
        }

        return this._grid[this._height - y - 1][x];
    }

    pos(x, y) {
        console.log('POS:', this._posX, this._posY, '-->', x, y);
        this._lastPosX = this._posX;
        this._lastPosY = this._posY;
        this._posX = x;
        this._posY = y;
    }

    move(dx, dy) {
        console.log('MOVE:', dx, dy);
        this.pos(this._posX + dx, this._posY + dy);
    }

    drag(dx, dy) {
        //console.log('DRAG:', dx, dy);
        var t = this.get(this._posX, this._posY);

        for (var x = this._posX; x <= this._posX + dx; x++) {
            for (var y = this._posY; y <= this._posY + dy; y++) {
                this.set(t, x, y);
            }
        }

        this.move(dx, dy);
    }

    fill(t, x1, y1, x2, y2) {
        console.log('Fill:', t, x1, y1, ' --> ', x2, y2);

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

    print() {
        var r, t;
        for (var y = this._height - 1; y >= 0.; y--) {
            r = '';
            for (var x = 0; x < this._width; x++) {
                t = this.get(x, y);

                if (x === this._posX && y === this._posY) {
                    t = t.green.bold;
                }

                r += t + ' ';
            }
            console.log(r);
        }
    }

    saveImage(path) {
        var img_visual = gm(this._width, this._height, 'transparent');
        var img_meta = gm(this._width, this._height, 'transparent');
        var t, c;

        for (var y = this._height - 1; y >= 0.; y--) {
            for (var x = 0; x < this._width; x++) {
                t = this.get(x, y);

                c = constants.COLORS_META[t];
                if (c) {
                    img_meta.fill(c);
                    img_meta.drawPoint(x, this._height - y - 1);
                }

                c = constants.COLORS_VISUAL[t];
                if (c) {
                    img_visual.fill(c);
                    img_visual.drawPoint(x, this._height - y - 1);
                }
            }
        }
        img_meta.write(path + '/meta.png', function (err) { });
        img_visual.write(path + '/visual.png', function (err) { });
    }
}

module.exports = Grid;
