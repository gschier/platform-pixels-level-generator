var Level = require('./Level');

//var grid = new Grid(100, 50);
var level = new Level(80, 50);
level.draw();
level.print();
level.saveImage(process.argv[2] || './export');

