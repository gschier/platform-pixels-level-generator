require('colors');
var gm = require('gm');
var Chance = require('chance');
var chance = new Chance();

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

    this.initialize();
};

Grid.TYPE_EMPTY    = '■'.grey;
Grid.TYPE_PLATFORM = '☐'.green.bold;
Grid.TYPE_FILL     = '☐'.white.bold;
Grid.TYPE_DEATH    = '☐'.red.bold;

Grid.STATE_INIT           = 0;
Grid.STATE_START_PLATFORM = 1;
Grid.STATE_END_PLATFORM   = 2;

Grid.SIDE_TOP    = [-1, 0];
Grid.SIDE_BOTTOM = [1, 0];
Grid.SIDE_LEFT   = [0, -1];
Grid.SIDE_RIGHT  = [0, 1];

Grid.prototype.set = function (t, x, y) {
    x = x === undefined ? this._posX : x;
    y = y === undefined ? this._posY : y;

    console.log('SET:', t, x, y);

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
    this._isHorizontal = chance.bool({likelihood: 70});
    if (!this._isHorizontal) {
        this.drag(
            0,
            chance.integer({min: 1, max: 8})
        );
    } else {
        this.drag(
            chance.integer({min: 2, max: 5}),
            0
        );

        // Fill floor down
        var platformFloorDepth = chance.integer({min: 4, max: 8});
        this.fill(
            Grid.TYPE_FILL,
            this._lastPosX,
            this._posY - 1,
            this._posX,
            this._posY - platformFloorDepth - 1
        );

        // Fill ceil up
        var platformCeilDepth = chance.integer({min: 4, max: 6});
        var platformCeilHeight = chance.integer({min: 4, max: 8});
        this.fill(
            Grid.TYPE_FILL,
            this._lastPosX,
            this._posY + platformCeilHeight,
            this._posX,
            this._posY + platformCeilHeight + platformCeilDepth
        );
    }

    this._state = Grid.STATE_END_PLATFORM;
};

Grid.prototype.placeStartPlatform = function () {
    this.pos(
        chance.integer({min: 0, max: 2}),
        chance.integer({min: 2, max: 7})
    );
    this.set(Grid.TYPE_PLATFORM);

    this._state = Grid.STATE_START_PLATFORM;
};

Grid.prototype.branch = function () {
    this.detach();

    this._state = Grid.STATE_START_PLATFORM;
};

Grid.prototype.detach = function () {
    this.move(
        chance.integer({min: 3, max: 7}),
        Math.max(-1 * this._posY, chance.integer({min: -3, max: 5}))
    );

    this.set(Grid.TYPE_PLATFORM);

    if (this._isHorizontal) {

        // Add death between
        // TODO: Make this work better with vertical platforms
        var minY = Math.min(this._lastPosY, this._posY);
        this.fill(
            Grid.TYPE_DEATH,
            this._lastPosX + 1,
            minY - 1,
            this._posX - 1,
            minY - 1 - chance.integer({min: 4, max: 7})
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
    var img = gm(200, 400, "#ddff99f3");
    var t;
    for (var y = this._height - 1; y >= 0.; y--) {
        for (var x = 0; x < this._width; x++) {
            t = this.get(x, y);

            if (t === Grid.TYPE_PLATFORM) {
                img.fill('#F00');
                img.drawPoint(x, this._height - y - 1);
            }
        }
    }
    img.write('foo.png', function (err) { });
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
