require('colors');
var gm = require('gm');
var Chance = require('chance');
var chance = new Chance();

var CONSTANTS = require('./constants');

var Grid = function (w, h) {
    this._width = w;
    this._height = h;
    this._grid = null;
    this._state = null;

    // For state
    this._posX = null;
    this._posY = null;
    this._side = null;
    this._lastPosX = null;
    this._lastPosY = null;
    this._lastSide = null;
    this._isHorizontal = true;
    this._forceHorizontal = false;

    this.initialize();
};

Grid.TYPE_EMPTY    = '■'.grey;
Grid.TYPE_PLATFORM = '☐'.green.bold;
Grid.TYPE_FILL     = '☐'.white.bold;
Grid.TYPE_DEATH    = '☐'.red.bold;
Grid.TYPE_START    = '☃'.magenta.bold;

Grid.STATE_INIT           = 0;
Grid.STATE_START_PLATFORM = 1;
Grid.STATE_END_PLATFORM   = 2;

Grid.SIDE_TOP    = [-1, 0];
Grid.SIDE_BOTTOM = [1, 0];
Grid.SIDE_LEFT   = [0, -1];
Grid.SIDE_RIGHT  = [0, 1];

Grid.COLORS_VISUAL = {};
Grid.COLORS_VISUAL[Grid.TYPE_PLATFORM] = '#2A2828';
Grid.COLORS_VISUAL[Grid.TYPE_FILL] = '#312F2F';

Grid.COLORS_META = {};
Grid.COLORS_META[Grid.TYPE_DEATH] = '#F00'; // RED
Grid.COLORS_META[Grid.TYPE_START] = '#F0F'; // TEAL

Grid.prototype.set = function (t, x, y) {
    x = x === undefined ? this._posX : x;
    y = y === undefined ? this._posY : y;

    //console.log('SET:', t, x, y);

    if (y >= this._height || y < 0 || x >= this._width || x < 0) {
        return;
    }

    this._grid[this._height - y - 1][x] = t;
};

Grid.prototype.get = function (x, y) {
    if (y >= this._height || y < 0 || x >= this._width || x < 0) {
        return null;
    }

    return this._grid[this._height - y - 1][x];
};

Grid.prototype.pos = function (x, y) {
    console.log('POS:', this._posX, this._posY, '-->', x, y);
    this._lastPosX = this._posX;
    this._lastPosY = this._posY;
    this._posX = x;
    this._posY = y;
};

Grid.prototype.move = function (dx, dy) {
    console.log('MOVE:', dx, dy);
    this.pos(this._posX + dx, this._posY + dy);
};

Grid.prototype.drag = function (dx, dy) {
    //console.log('DRAG:', dx, dy);
    var t = this.get(this._posX, this._posY);

    for (var x = this._posX; x <= this._posX + dx; x++) {
        for (var y = this._posY; y <= this._posY + dy; y++) {
            this.set(t, x, y);
        }
    }

    this.move(dx, dy);
};

Grid.prototype.fill = function (t, x1, y1, x2, y2) {
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
};

Grid.prototype.next = function () {
    if (this._state === Grid.STATE_INIT) {
        this.placeStartPlatform();
    } else if (this._state === Grid.STATE_START_PLATFORM) {
        this.placeEndPlatform();
    } else if (this._state === Grid.STATE_END_PLATFORM) {
        this.branch();
    }
    console.log();
};

Grid.prototype.placeEndPlatform = function () {
    this._isHorizontal = chance.bool({likelihood: 60});
    if (this._forceHorizontal) {
        this._isHorizontal = true;
        this._forceHorizontal = false;
    }

    if (!this._isHorizontal) {
        this.drag(0, CONSTANTS.PLATFORM_HEIGHT());
    } else {
        this.drag(CONSTANTS.PLATFORM_WIDTH(), 0);

        // Fill floor down
        this.fill(
            Grid.TYPE_FILL,
            this._lastPosX,
            this._posY - 1,
            this._posX,
            this._posY - 1 - CONSTANTS.FLOOR_DEPTH()
        );

        // Fill ceil up
        var platformCeilHeight = CONSTANTS.CEILING_HEIGHT();
        this.fill(
            Grid.TYPE_FILL,
            this._lastPosX,
            this._posY + platformCeilHeight,
            this._posX,
            this._posY + platformCeilHeight + CONSTANTS.CEILING_DEPTH()
        );
    }

    this._state = Grid.STATE_END_PLATFORM;
};

Grid.prototype.placeStartPlatform = function () {
    this.pos(CONSTANTS.START_X(), CONSTANTS.START_Y());

    this._forceHorizontal = true;

    // Set platform
    this.set(Grid.TYPE_PLATFORM);

    // Set start meta point
    this.set(Grid.TYPE_START, this._posX, this._posY + CONSTANTS.START_OFFSET_Y());

    this._state = Grid.STATE_START_PLATFORM;
};

Grid.prototype.branch = function () {
    this.detach();

    this._state = Grid.STATE_START_PLATFORM;
};

Grid.prototype.detach = function () {
    this.move(
        CONSTANTS.DETACH_DISTANCE_X(),
        Math.max(-1 * this._posY, CONSTANTS.DETACH_DISTANCE_Y())
    );

    this.set(Grid.TYPE_PLATFORM);

    if (this._isHorizontal) {

        // Add death between
        // Place one space below the last position an current one
        // TODO: Make this work better with vertical platforms
        var minY = Math.min(this._lastPosY, this._posY);
        this.fill(
            Grid.TYPE_DEATH,
            this._lastPosX + 1,
            minY - 1,
            this._posX - 1,
            minY - 1 - CONSTANTS.DEATH_DEPTH()
        );

        // Add death ceiling
        // TODO: Fix this so it doesn't block next vertical piece

        //var maxY = Math.max(this._lastPosY, this._posY);
        //var deathCeilHeight = chance.integer({min: 8, max: 12});
        //this.fill(
        //    Grid.TYPE_FILL,
        //    this._lastPosX + 1,
        //    maxY + deathCeilHeight,
        //    this._posX - 1,
        //    maxY + deathCeilHeight - chance.integer({min: 4, max: 7})
        //);
    }
};

Grid.prototype.print = function () {
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
};

Grid.prototype.export = function () {
    var img_visual = gm(this._width, this._height, 'transparent');
    var img_meta = gm(this._width, this._height, 'transparent');
    var t, c;
    for (var y = this._height - 1; y >= 0.; y--) {
        for (var x = 0; x < this._width; x++) {
            t = this.get(x, y);

            c = Grid.COLORS_META[t];
            if (c) {
                img_meta.fill(c);
                img_meta.drawPoint(x, this._height - y - 1);
            }

            c = Grid.COLORS_VISUAL[t];
            if (c) {
                img_visual.fill(c);
                img_visual.drawPoint(x, this._height - y - 1);
            }
        }
    }
    var path = '/Users/gschier/Workspace/platform-pixels/android/assets/levels/00017__generated';
    img_meta.write(path + '/meta.png', function (err) { });
    img_visual.write(path + '/visual.png', function (err) { });
};

Grid.prototype.initialize = function () {
    this._grid = [];

    for (var y = 0; y < this._height; y++) {
        var col = [];
        for (var x = 0; x < this._width; x++) {
            col.push(Grid.TYPE_EMPTY);
        }
        this._grid.push(col);
    }

    this._state = Grid.STATE_INIT;
};

module.exports = Grid;
