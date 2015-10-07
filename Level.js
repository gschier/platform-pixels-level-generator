"use strict";

var Start = require('./components/Start');
var Pit = require('./components/Pit');
var Grid = require('./Grid');
var constants = require('./constants');

class Level {
    constructor (w, h) {
        this._grid = new Grid(w, h);
        this._grid.initialize(constants.TYPE_FILL);
    }

    draw () {
        var start = new Start(this._grid);
        start.draw();

        var pit = new Pit(this._grid);
        pit.draw();
    }

    print () {
        this._grid.print();
    }

    saveImage (path) {
        this._grid.saveImage(path);
    }
}

module.exports = Level;