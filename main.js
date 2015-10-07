var Level = require('./Level');

//var grid = new Grid(100, 50);
var level = new Level(20, 10);
level.draw();
level.print();
level.saveImage('./export');

