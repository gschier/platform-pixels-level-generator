"use strict";

var yargs = require('yargs');
var mkdirp = require('mkdirp');
var path = require('path');

var Level = require('./Level');

var argv = yargs
    .command('generate', 'Generate levels', function (y) {
        y.option('c', {
            alias: 'count',
            description: 'number of levels to generate',
            type: 'number',
            default: 1
        })
        .option('s', {
            alias: 'seed',
            description: 'random seed for generation',
            type: 'string'
        })
        .option('d', {
            alias: 'difficulty',
            description: 'starting difficulty',
            type: 'number',
            default: 1
        })
        .option('x', {
            alias: 'export',
            description: 'Export the level to a given path',
            type: 'string'
        })
        .option('v', {
            alias: 'verbose',
            description: 'print each level in ascii',
            type: 'boolean',
            default: false
        })
        .help('help')
    })
    .help('help')
    .argv;

var command = argv._[0];

if (!command) {
    yargs.showHelp();
    return;
}

if (argv.seed) {
    require('./random').setSeed(argv.seed);
}

var level;
for (var i = 0; i < argv.count; i++) {
    let difficulty = argv.difficulty + i;

    level = new Level(difficulty);
    level.draw();

    let levelInt = (i + 1);
    let levelNumber = levelInt.toString();
    while (levelNumber.length < 5) {
        levelNumber = '0' + levelNumber;
    }
    let levelName = levelNumber + '__level_' + levelInt;

    if (argv.export) {
        let fullPath = path.join(argv.export, levelName);
        mkdirp.sync(fullPath);

        level.saveImage(fullPath);
    }

    if (argv.verbose) {
        level.print();
    }

    console.log(
        'GENERATED: ' + levelName +
        ' DIFFICULTY: ' + difficulty +
        ' NUM COMPONENTS: ' + level.components.length
    );
}

// Debug if we're only making one level
//if (i === 1) {
//    level.print();
//}
