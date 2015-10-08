"use strict";

var Level = require('./Level');
var mkdirp = require('mkdirp');
var pathJoin = require('path').join;

//var grid = new Grid(100, 50);

var path = process.argv[2] || './export';
var n = parseInt(process.argv[3], 10) || 1;

var level;
for (var i = 0; i < n; i++) {
    level = new Level(i);
    level.draw();

    let levelNumber = (i + 1).toString();
    while (levelNumber.length < 5) {
        levelNumber = '0' + levelNumber;
    }
    let levelName = levelNumber + '__generated';

    let fullPath = pathJoin(path, levelName);
    mkdirp.sync(fullPath);

    level.saveImage(fullPath);

    console.log('GENERATED: ' + levelName + ' => ' + level.components.length + ' components');
}

// Debug if we're only making one level
//level.print();

